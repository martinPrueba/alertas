<!-- src/components/alertas/AlertFilter.vue -->
<template>
  <form class="filtro-form" @submit.prevent="emitirFiltros">
    <h5>Filtros</h5>

    <!-- Proceso -->
    <div class="mb-3">
      <label class="form-label">Proceso</label>
      <select v-model="filtros.proceso" class="form-select">
        <option value="">Seleccionar</option>
        <option v-for="proceso in procesos" :key="proceso" :value="proceso">
          {{ proceso }}
        </option>
      </select>
    </div>

    <!-- Activo -->
    <div class="mb-3">
      <label class="form-label">Activo</label>
      <select v-model="filtros.activo" class="form-select">
        <option value="">Seleccionar</option>
        <option v-for="activo in activos" :key="activo" :value="activo">
          {{ activo }}
        </option>
      </select>
    </div>

    <!-- Fechas -->
    <div class="mb-3">
      <label class="form-label">Fecha Inicio</label>
      <input v-model="filtros.initDate" type="datetime-local" class="form-control" />
    </div>

    <div class="mb-3">
      <label class="form-label">Fecha Fin</label>
      <input v-model="filtros.endDate" type="datetime-local" class="form-control" />
    </div>

    <div class="acciones">
      <button type="button" class="btn btn-secondary" @click="limpiar">Limpiar</button>
      <button type="submit" class="btn btn-primary">Buscar</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import axios from "axios";

const emit = defineEmits(["filtrar"]);

const filtros = reactive({
  proceso: "",
  activo: "",
  initDate: "",
  endDate: "",
});

const procesos = ref([]);
const activos  = ref([]);

// Normaliza datetime-local a ISO 8601 (OffsetDateTime-friendly en backend)
const toISO = (val) => (val ? new Date(val).toISOString() : "");

// Helper para extraer mensaje de error del backend/axios
const errMsg = (err, fallback) =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  err?.message ||
  fallback ||
  "Error desconocido";

// Enviar filtros al padre (la vista) -> la vista los pasa a GoogleMap via :filtros
const emitirFiltros = () => {
  emit("filtrar", {
    proceso: filtros.proceso || "",
    activo: filtros.activo || "",
    initDate: toISO(filtros.initDate),
    endDate: toISO(filtros.endDate),
  });
};

// Limpia el formulario y emite sin filtros
const limpiar = () => {
  filtros.proceso = "";
  filtros.activo = "";
  filtros.initDate = "";
  filtros.endDate = "";
  emitirFiltros();
};

onMounted(async () => {
  const reqProcesos = axios.get("http://localhost:8080/api/alertas/get-procesos");
  const reqActivos  = axios.get("http://localhost:8080/api/alertas/get-activos");

  const [p1, p2] = await Promise.allSettled([reqProcesos, reqActivos]);

  // Procesos
  if (p1.status === "fulfilled") {
    procesos.value = p1.value?.data || [];
  } else {
    const msg = errMsg(p1.reason, "Error al obtener procesos");
    alert(`❌ ${msg}`);
    console.error("Error get-procesos:", p1.reason);
  }

  // Activos
  if (p2.status === "fulfilled") {
    activos.value = p2.value?.data || [];
  } else {
    const msg = errMsg(p2.reason, "Error al obtener activos");
    alert(`❌ ${msg}`);
    console.error("Error get-activos:", p2.reason);
  }
});
</script>

<style scoped>
.filtro-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.acciones {
  display: flex;
  gap: 8px;
  justify-content: space-between;
}
.btn {
  cursor: pointer;
}
</style>
