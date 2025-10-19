<!-- src/components/alertas/GoogleMap.vue -->
<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue"; // 👈 añadido onUnmounted
import axios from "axios";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";
import AlertasTableModal from "./AlertasTableModal.vue";
import emitter from "@/utils/emitter"; // 👈 añadido
import { alertasData } from "@/stores/alertasData"; // 👈 import global




const props = defineProps({
  // ⬅️ Recibimos filtros desde la vista
  filtros: { type: Object, default: () => ({}) },
});

const mapRef = ref(null);
let map = null;
let gmaps = null;
let markers = [];

const modoVista = ref("simple");
const mostrarModal = ref(false);
const alertaIdSeleccionada = ref(null);

const abrirModal = (id) => {
  alertaIdSeleccionada.value = id;
  mostrarModal.value = true;
};

// 🔹 Helper para extraer mensaje de error del backend/Axios
const errMsg = (err, fallback) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  fallback ||
  "Error desconocido";

// Limpia todos los marcadores del mapa
const limpiarMarcadores = () => {
  markers.forEach((m) => m.setMap(null));
  markers = [];
};

const cargarAlertas = async (f = {}) => {
  try {

    const filtrosLlenos = Object.fromEntries(
      Object.entries(f || {}).filter(([k, v]) => {
        // 🔸 Ignorar valores vacíos o nulos
        if (v === "" || v == null) return false;
        // 🔸 Ignorar alarmasActivas:false (solo usar si es true)
        if (k === "alarmasActivas" && v === false) return false;
        return true;
      })
    );

    const tieneFiltros = Object.keys(filtrosLlenos).length > 0;

    let data;


    // 🔹 Si viene "alarmasActivas: true" → llamamos a esa API directamente
    if (filtrosLlenos.alarmasActivas === true) {
      const response = await axios.get("http://localhost:8080/api/alertas/get-alertas-activas");
      data = response.data;

      alertasData.alertas = data[0]?.alertas || [];
      alertasData.alertasLeidas = data[0]?.alertasLeidas || [];
      
    } 
    else if (tieneFiltros) {
      // 👇 Si hay otros filtros → usamos el endpoint dinámico
      const response = await axios.post(
        "http://localhost:8080/api/alertas/filter-dynamic",
        filtrosLlenos
      );
      data = response.data;

      alertasData.alertas = data.alertas || [];
      alertasData.alertasLeidas = data.alertasLeidas || [];

    } 
    else {
      // 👇 Si no hay filtros, traemos todas las alertas
      const response = await axios.get(
        "http://localhost:8080/api/alertas/get-all-alerts"
      );
      data = response.data;
      // Si el backend devuelve un array, tomamos el primer elemento
      const wrapper = Array.isArray(data) ? data[0] : data;

      alertasData.alertas = wrapper.alertas || [];
      alertasData.alertasLeidas = wrapper.alertasLeidas || [];


    }

    limpiarMarcadores();

    const wrapper = Array.isArray(data) ? data[0] : data;
    const alertas = wrapper?.alertas ?? data ?? [];
    const alertasLeidas = wrapper?.alertasLeidas ?? [];

    const todas = [
      ...alertas.map((a) => ({ ...a, leida: false })),
      ...alertasLeidas.map((a) => ({ ...a, leida: true })),
    ];

    for (const a of todas) {
      if (!a.gpsx || !a.gpsy) continue;

let iconUrl;

if (a.leida) {
  // 🟦 Icono circular celeste con borde azul
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <circle cx="20" cy="20" r="18" fill="deepskyblue" stroke="blue" stroke-width="2"/>
    </svg>
  `;
  iconUrl = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
} else {
  // 🔴 Icono normal (rojo o el asignado por el proceso)
  iconUrl = a.IconAssocieteFromProceso || "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
}

const marker = new gmaps.Marker({
  position: { lat: a.gpsy, lng: a.gpsx },
  map,
  title: a.nombre,
  icon: {
    url: iconUrl,
    scaledSize: new gmaps.Size(40, 40),
  },
});
  

let hoverTimeout = null;
let clickTimeout = null; // 👈 para diferenciar click simple de doble
let clickTriggered = false;
let dblclickTriggered = false;

//  Hover: solo información simple si no hay click ni doble click
marker.addListener("mouseover", () => {
  clickTriggered = false;
  dblclickTriggered = false;

  hoverTimeout = setTimeout(() => {
    if (!clickTriggered && !dblclickTriggered) {
      modoVista.value = "simple";
      abrirModal(a.alertaid);
    }
  }, 600);
});

marker.addListener("mouseout", () => {
  clearTimeout(hoverTimeout);
});

//  Click: se ejecuta con delay para saber si viene un doble click
marker.addListener("click", (event) => {
  clearTimeout(hoverTimeout);
  clickTriggered = true;

  // Esperamos un poco por si el usuario hace doble click
  clickTimeout = setTimeout(() => {
    if (!dblclickTriggered) {
      modoVista.value = "validar";
      abrirModal(a.alertaid);
    }
  }, 300); // <-- si en 300ms no hubo segundo click, se asume click simple

  event.domEvent?.stopPropagation();
  event.domEvent?.preventDefault();
});

//  Doble click: cancela el click simple y ejecuta relaciones
marker.addListener("dblclick", (event) => {
  clearTimeout(hoverTimeout);
  clearTimeout(clickTimeout); // 👈 cancela el click simple pendiente
  dblclickTriggered = true;

  modoVista.value = "relaciones";
  abrirModal(a.alertaid);

  event.domEvent?.stopPropagation();
  event.domEvent?.preventDefault();
});



      markers.push(marker);
    }

  } catch (err) {
    const msg = errMsg(err, "Error cargando alertas");
    alert(`❌ ${msg}`);
    console.error("❌ Error cargando alertas:", err);
  }
};


// 👂 Handler que atiende el evento del bus para refrescar el mapa
const handleRefresh = () => {
  if (!gmaps || !map) return;
  //console.log("[GoogleMap] REFRESH_MAP recibido → recargando alertas…");
  cargarAlertas(props.filtros || {});
};

// Reacciona a cambios en los filtros que llegan desde la vista
watch(
  () => props.filtros,
  (nuevo) => cargarAlertas(nuevo),
  { deep: true, immediate: false }
);

onMounted(async () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("⚠️ Falta VITE_GOOGLE_MAPS_API_KEY en tu .env.local");
    return;
  }

  try {
    const maps = await loadGoogleMaps(apiKey);
    gmaps = maps;

map = new gmaps.Map(mapRef.value, {
  center: { lat: -33.4489, lng: -70.6693 }, // Santiago
  zoom: 6,

  // 👇 Cambiá esta parte:
  mapTypeId: "roadmap", // "roadmap" = normal, "satellite" = satélite, "hybrid" = satélite + etiquetas
  mapTypeControl: true, // 👈 muestra el botón para elegir tipo de mapa
  mapTypeControlOptions: {
    style: gmaps.MapTypeControlStyle.HORIZONTAL_BAR,
    position: gmaps.ControlPosition.TOP_RIGHT,
    mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain"], // 👈 opciones disponibles
  },

  streetViewControl: false,
  fullscreenControl: false,
});


    // Primera carga: sin filtros (o con los que vengan ya seteados)
    await cargarAlertas(props.filtros || {});

    // 👂 Suscribirse al bus para refrescos periódicos / cambios de intervalo
    emitter.on("REFRESH_MAP", handleRefresh);
    emitter.on("REFRESH_INTERVAL_CHANGED", handleRefresh); // opcional
  } catch (err) {
    console.error("❌ Error cargando Google Maps:", err);
  }
});

onUnmounted(() => {
  emitter.off("REFRESH_MAP", handleRefresh);
  emitter.off("REFRESH_INTERVAL_CHANGED", handleRefresh);
});

// Exponer método para que el padre pueda forzar reload si lo desea
defineExpose({
  reload: () => {
    cargarAlertas(props.filtros || {});
  }
});
</script>

<template>
  <div class="map-container" ref="mapRef"></div>

<AlertasTableModal
  :mostrar="mostrarModal"
  :alertaId="alertaIdSeleccionada"
  :modoVista="modoVista"
  @cerrar="mostrarModal = false"
/>
 

</template>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
</style>
