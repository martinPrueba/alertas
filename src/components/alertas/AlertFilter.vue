<!-- src/components/alertas/AlertFilter.vue -->
<template>
  <form class="filtro-form" @submit.prevent="emitirFiltros">
    <h5>Filtros</h5>


    <!-- Cod Alerta -->
    <div v-if="mostrar" class="mb-3">
      <label class="form-label">Código Alerta</label>
      <input v-model="filtros.codalerta" type="text" class="form-control" />
    </div>


        <!-- Nombre -->
    <div class="mb-3">
      <label class="form-label">Nombre</label>
      <input v-model="filtros.nombre" type="text" class="form-control" />
    </div>

    <!-- Sentencia -->
    <div class="mb-3">
      <label class="form-label">Sentencia ID</label>
      <input v-model="filtros.sentenciaId" type="number" class="form-control" />
    </div>

        <!-- Inicio Evento -->
    <div class="mb-3">
      <label class="form-label">Inicio Evento</label>
      <input v-model="filtros.inicioevento" type="datetime-local" class="form-control" />
    </div>

    <!-- Identificación Alerta -->
    <div class="mb-3">
      <label class="form-label">Identificación Alerta</label>
      <input v-model="filtros.identificacionalerta" type="text" class="form-control" />
    </div>

    <!-- Activo -->
    <div class="mb-3">
      <label class="form-label">Nombre Activo</label>
      <select v-model="filtros.activo" class="form-select">
        <option value="">Seleccionar</option>
        <option v-for="activo in activos" :key="activo" :value="activo">
          {{ activo }}
        </option>
      </select>
    </div>

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

    <!-- Latencia -->
    <div class="mb-3">
      <label class="form-label">Latencia (ms)</label>
      <input v-model="filtros.latencia" type="number" step="0.01" class="form-control" />
    </div>

    <!-- Tipo Servicio -->
    <div class="mb-3">
      <label class="form-label">Tipo Servicio</label>
      <select v-model="filtros.tipoServicio" class="form-select">
        <option value="">Seleccionar</option>
        <option v-for="serv in tiposServicio" :key="serv" :value="serv">
          {{ serv }}
        </option>
      </select>
    </div>

    <!-- CI -->
    <div class="mb-3">
      <label class="form-label">CI</label>
      <input v-model="filtros.CI" type="text" class="form-control" />
    </div>

    <!-- Subtipo Servicio -->
    <div class="mb-3">
      <label class="form-label">Subtipo Servicio</label>
      <input v-model="filtros.Subtiposervicio" type="text" class="form-control" />
    </div>

    <!-- Jitter -->
    <div class="mb-3">
      <label class="form-label">Jitter</label>
      <input v-model="filtros.jitter" type="number" step="0.01" class="form-control" />
    </div>

    <!-- Disponibilidad -->
    <div class="mb-3">
      <label class="form-label">Disponibilidad (%)</label>
      <input v-model="filtros.disponibilidad" type="number" step="0.01" class="form-control" />
    </div>

    <!-- Packet Lost -->
    <div class="mb-3">
      <label class="form-label">Packet Lost (%)</label>
      <input v-model="filtros.packetlost" type="number" step="0.01" class="form-control" />
    </div>

    <!-- RSSI -->
    <div class="mb-3">
      <label class="form-label">RSSI</label>
      <input v-model="filtros.rssi" type="number" step="0.01" class="form-control" />
    </div>

    <!-- NSR -->
    <div class="mb-3">
      <label class="form-label">NSR</label>
      <input v-model="filtros.nsr" type="number" step="0.01" class="form-control" />
    </div>

    <!-- PLM -->
    <div class="mb-3">
      <label class="form-label">PLM</label>
      <input v-model="filtros.PLM" type="text" class="form-control" />
    </div>

    <!-- Tipo ExWa -->
    <div class="mb-3">
      <label class="form-label">Tipo ExWa</label>
      <input v-model="filtros.tipoExWa" type="text" class="form-control" />
    </div>

    <!-- Código Evento -->
    <div class="mb-3">
      <label class="form-label">Código Evento</label>
      <input v-model="filtros.codigoEvento" type="text" class="form-control" />
    </div>

    <!-- Descripción Evento -->
    <div class="mb-3">
      <label class="form-label">Descripción Evento</label>
      <textarea v-model="filtros.descripcionevento" class="form-control"></textarea>
    </div>

    <!-- Origen -->
    <div class="mb-3">
      <label class="form-label">Origen</label>
      <input v-model="filtros.Origen" type="text" class="form-control" />
    </div>

    <!-- Tipo Documento -->
    <div class="mb-3">
      <label class="form-label">Tipo Documento</label>
      <input v-model="filtros.tipodocumento" type="text" class="form-control" />
    </div>

    <!-- Estado -->
    <div class="mb-3">
      <label class="form-label">Estado</label>
      <select v-model="filtros.estado" class="form-select">
        <option value="">Seleccionar</option>
        <option v-for="estado in estados" :key="estado" :value="estado">
          {{ estado }}
        </option>
      </select>
    </div>

    <!-- Resumen -->
    <div class="mb-3">
      <label class="form-label">Resumen</label>
      <textarea v-model="filtros.resumen" class="form-control"></textarea>
    </div>

    <!-- Titulo -->
    <div class="mb-3">
      <label class="form-label">Título</label>
      <input v-model="filtros.titulo" type="text" class="form-control" />
    </div>

    <!-- Numero -->
    <div class="mb-3">
      <label class="form-label">Número</label>
      <input v-model="filtros.numero" type="text" class="form-control" />
    </div>


    <!-- Fecha Estado -->
    <div class="mb-3">
      <label class="form-label">Fecha Estado</label>
      <input v-model="filtros.fechaestado" type="datetime-local" class="form-control" />
    </div>

    <!-- Razon Estado -->
    <div class="mb-3">
      <label class="form-label">Razón Estado</label>
      <input v-model="filtros.razonestado" type="text" class="form-control" />
    </div>

    <!-- GPS -->
    <div class="mb-3">
      <label class="form-label">GPS X</label>
      <input v-model="filtros.gpsx" type="number" step="0.01" class="form-control" />
    </div>
    <div class="mb-3">
      <label class="form-label">GPS Y</label>
      <input v-model="filtros.gpsy" type="number" step="0.01" class="form-control" />
    </div>
    <div class="mb-3">
      <label class="form-label">GPS Z</label>
      <input v-model="filtros.gpsz" type="number" step="0.01" class="form-control" />
    </div>
    <div class="mb-3">
      <label class="form-label">GPS H</label>
      <input v-model="filtros.gpsh" type="number" step="0.01" class="form-control" />
    </div>

    <!-- Radio -->
    <div class="mb-3">
      <label class="form-label">Radio</label>
      <input v-model="filtros.radio" type="text" class="form-control" />
    </div>

    <!-- Severidad -->
    <div class="mb-3">
      <label class="form-label">Severidad</label>
      <select v-model="filtros.severidad" class="form-select">
        <option value="">Seleccionar</option>
        <option v-for="sev in severidades" :key="sev" :value="sev">
          {{ sev }}
        </option>
      </select>
    </div>

    <!-- Usuario -->
    <div class="mb-3">
      <label class="form-label">Usuario</label>
      <input v-model="filtros.userid" type="text" class="form-control" />
    </div>

    <!-- Comentario -->
    <div class="mb-3">
      <label class="form-label">Comentario</label>
      <textarea v-model="filtros.comentario" class="form-control"></textarea>
    </div>

    <!-- Valida -->
    <div class="mb-3">
      <label class="form-label">Valida</label>
      <input v-model="filtros.valida" type="checkbox" class="form-check-input" />
    </div>

    <!-- OT -->
    <div class="mb-3">
      <label class="form-label">OT</label>
      <input v-model="filtros.OT" type="text" class="form-control" />
    </div>

    <!-- Ticket -->
    <div class="mb-3">
      <label class="form-label">Ticket</label>
      <input v-model="filtros.ticket" type="text" class="form-control" />
    </div>

    <!-- Fecha Reconocimiento -->
    <div class="mb-3">
      <label class="form-label">Fecha Reconocimiento</label>
      <input v-model="filtros.fechaReconocimiento" type="datetime-local" class="form-control" />
    </div>

    <!-- Grupo Local -->
    <div class="mb-3">
      <label class="form-label">Grupo Local</label>
      <input v-model="filtros.grupoLocal" type="text" class="form-control" />
    </div>

    <!-- Predicción -->
    <div class="mb-3">
      <label class="form-label">Predicción</label>
      <input v-model="filtros.prediccion" type="text" class="form-control" />
    </div>

    <!-- Tiempo Reconocimiento -->
    <div class="mb-3">
      <label class="form-label">Tiempo Reconocimiento (min)</label>
      <input v-model="filtros.tiempoReconocimiento" type="number" class="form-control" />
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

const mostrar = ref(true);  // ahora sí es reactivo

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
