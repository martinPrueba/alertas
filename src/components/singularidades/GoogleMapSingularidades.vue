<!-- src/components/alertas/GoogleMap.vue -->
<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue"; // 👈 añadido onUnmounted
import axios from "axios";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";
import SingularidadesTableModal from "./SingularidadesTableModal.vue";
import emitter from "@/utils/emitter"; // 👈 añadido
import { alertasData } from "@/stores/alertasData"; // 👈 import global
import { createMarkerConBorde } from "@/utils/MarkerConBorde.js";

import { useGlobalAlert } from "@/stores/useGlobalAlert.js";

const { showAlert } = useGlobalAlert();


const props = defineProps({
  // ⬅️ Recibimos filtros desde la vista
  filtros: { type: Object, default: () => ({}) },
});

const mapRef = ref(null);
let map = null;
let gmaps = null;
let markers = [];


//variable que definira si la alerta es validada o rechazada para aplicar el color
const estiloCssParaImagenAlerta = ref(null);

const modoVista = ref("simple");
const mostrarModal = ref(false);
const singularidadIdSeleccionada = ref(null);

const abrirModal = (id) => {
  singularidadIdSeleccionada.value = id;
  mostrarModal.value = true;
};

const obtenerIdSingularidad = (item) => item?.id ?? null;

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
    /*
    if (filtrosLlenos.alarmasActivas === true) {
      const response = await axios.get("http://localhost:8080/api/alertas/get-alertas-activas");
      data = response.data;

      alertasData.alertas = data[0]?.alertas || [];
      alertasData.alertasLeidas = data[0]?.alertasLeidas || [];
      
    } 
     */
    if (tieneFiltros) {
      // 👇 Si hay otros filtros → usamos el endpoint dinámico
      const response = await axios.post(
        "http://localhost:8080/api/singularidades/filter-dynamic",
        filtrosLlenos
      );
      data = response.data;

      alertasData.alertas = data.alertas || [];
      alertasData.alertasLeidas = data.alertasLeidas || [];

    } 
    else {
      // 👇 Si no hay filtros, traemos todas las alertas
      const response = await axios.get(
        "http://localhost:8080/api/singularidades/get-all"
      );
      data = response.data;
      // Si el backend devuelve un array, tomamos el primer elemento
      const wrapper = Array.isArray(data) ? data[0] : data;

      alertasData.alertas = wrapper.singularidades || [];
      alertasData.alertasLeidas = wrapper.singularidadesLeidas || [];


    }

    limpiarMarcadores();

    const wrapper = Array.isArray(data) ? data[0] : data;
    const alertas = wrapper?.singularidades ?? data ?? [];
    const alertasLeidas = wrapper?.singularidadesLeidas ?? [];

    const todas = [
      ...alertas.map((a) => ({ ...a, leida: false })),
      ...alertasLeidas.map((a) => ({ ...a, leida: true })),
    ];

    for (const a of todas) {
      if (!a.gpsx || !a.gpsy) continue;

let iconUrl;

    // Nota la prioridad al nombre correcto en JSON (lower camelCase)
  iconUrl =
    a.iconAssocieteFromProceso ||
    a.IconAssocieteFromProceso || // fallback por si algún endpoint antiguo lo manda así
    "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

  //// 🔴 Icono normal (rojo o el asignado por el proceso)
  //iconUrl = a.IconAssocieteFromProceso || "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

const position = new gmaps.LatLng(a.gpsx, a.gpsy);

// Definir color del borde según tu lógica
let colorBorde;

if (a.leida === true) {
  colorBorde = a.valida ? "green" : "red";
} else {
  colorBorde = null; // alerta nueva/no leída
}

const marker = createMarkerConBorde(
  gmaps,
  map,
  position,
  iconUrl,
  colorBorde
);

markers.push(marker);


  
let hoverTimeout = null;
let clickTimeout = null; // 👈 para diferenciar click simple de doble
let clickTriggered = false;
let dblclickTriggered = false;


// mouseout
marker.onMouseOut = () => {
  clearTimeout(hoverTimeout);
};

// CLICK
marker.onClick = () => {
  clearTimeout(hoverTimeout);
  clickTriggered = true;

  clickTimeout = setTimeout(() => {
    if (!dblclickTriggered) {
      modoVista.value = "validar";
      abrirModal(obtenerIdSingularidad(a));
    }
  }, 300);
};

// DOBLE CLICK
marker.onDblClick = () => {
  clearTimeout(hoverTimeout);
  clearTimeout(clickTimeout);
  dblclickTriggered = true;

  modoVista.value = "simple";
  abrirModal(obtenerIdSingularidad(a));
};



      markers.push(marker);
    }

  } catch (err) {
    const msg = errMsg(err, "Error cargando alertas");
    showAlert(`❌ ${msg}`);
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

<SingularidadesTableModal
  :mostrar="mostrarModal"
  :id="singularidadIdSeleccionada"
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
