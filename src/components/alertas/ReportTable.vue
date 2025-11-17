<template>
  <div class="reporte-container">
    <!-- Procesos -->
    <div class="table-box">
      <h4>Procesos</h4>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Proceso</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!Object.keys(data.alertasPorProceso).length">
              <td colspan="2">Sin datos</td>
            </tr>
            <tr v-for="(cantidad, proceso) in data.alertasPorProceso" :key="proceso">
              <td>{{ proceso }}</td>
              <td>{{ cantidad }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Criticidad -->
    <div class="table-box">
      <h4>Criticidad</h4>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Criticidad</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!Object.keys(data.alertasPorCriticidad).length">
              <td colspan="2">Sin datos</td>
            </tr>
            <tr v-for="(cantidad, criticidad) in data.alertasPorCriticidad" :key="criticidad">
              <td>{{ criticidad }}</td>
              <td>{{ cantidad }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Servicios -->
    <div class="table-box">
      <h4>Servicios</h4>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!Object.keys(data.alertasPorTipoServicio).length">
              <td colspan="2">Sin datos</td>
            </tr>
            <tr v-for="(cantidad, servicio) in data.alertasPorTipoServicio" :key="servicio">
              <td>{{ servicio }}</td>
              <td>{{ cantidad }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Activas -->
    <div class="table-box">
      <h4>Activas</h4>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Activas</td>
              <td>{{ data.cantidadActivas || 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { alertasData } from "@/stores/alertasData"; // 👈 import global

const data = ref({
  alertasPorProceso: {},
  alertasPorCriticidad: {},
  alertasPorTipoServicio: {},
  cantidadActivas: 0
});

// 🔹 Función para cargar el reporte dinámico
const cargarReporte = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/alertas/reporte-alertas-dynamic",
      {
        alertas: alertasData.alertas,
        alertasLeidas: alertasData.alertasLeidas
      }
    );
    data.value = response.data;
  } catch (error) {
    console.error("❌ Error cargando reporte:", error);
  }
};


// Cargar datos iniciales (todas las alertas)
const cargarInicial = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/alertas/reporte-alertas"
    );
    data.value = response.data;
        console.log("Datos iniciales:", response.data);

  } catch (error) {
    console.error("❌ Error cargando alertas iniciales:", error);
  }
};

// 🔹 Llamar al cargar la vista
onMounted(async () => {
  await cargarInicial(); // 👈 primero carga todas las alertas
});

let primeraCarga = true;

watch(
  () => [alertasData.alertas, alertasData.alertasLeidas],
  () => {

    // ⛔ no ejecutar si ambos arrays están vacíos
    if (nuevasAlertas.length === 0 && nuevasLeidas.length === 0) return;
    
    if (primeraCarga) {
      primeraCarga = false;
      return; // 👈 no ejecuta en la primera carga
    }
    cargarReporte();
  },
  { deep: true }
);

</script>


<style scoped>
.reporte-container {
  display: flex;
  flex-wrap: wrap;          /* permite que se dividan en 2 filas */
  gap: 20px;                /* espacio entre tablas */
  justify-content: flex-start;
}

.table-box {
  flex: 1 1 calc(50% - 20px); /* 2 columnas por fila */
  min-width: 250px;
}

/* Scroll interno para cada tabla */
.table-scroll {
  max-height: 200px;        /* altura fija */
  overflow-y: auto;         /* scroll vertical */
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 8px;
}

/* Estilo tabla */
.table {
  border-collapse: collapse;
  width: 100%;
}
th, td {
  border: 1px solid #ccc;
  padding: 6px 10px;
  text-align: center;
}
</style>
