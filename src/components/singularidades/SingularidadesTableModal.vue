<!-- src/components/singularidades/SingularidadesTableModal.vue -->
<script setup>
import { ref, watch, computed, onMounted } from "vue";
import axios from "axios";
import { useGlobalAlert } from "@/stores/useGlobalAlert.js";

const props = defineProps({
  mostrar: Boolean,
  id: Number,
  modoVista: {
    type: String,
    default: "simple", // valores: "simple", "validar"
  },
});

const emit = defineEmits(["cerrar"]);
const { showAlert } = useGlobalAlert();

const singularidad = ref(null);
const estadisticas = ref(null);

const opcion = ref(null);
const comentario = ref("");
const codigoSeleccionado = ref("");
const codigo2Seleccionado = ref("");

const codigos1 = ref([]);
const codigos2 = ref([]);
const loadingCodigo1 = ref(true);
const loadingCodigo2 = ref(true);
const errorCodigo1 = ref(null);
const errorCodigo2 = ref(null);

const detalleEntries = computed(() =>
  singularidad.value ? Object.entries(singularidad.value) : []
);

const estadisticasRecords = computed(() => {
  if (!estadisticas.value) return [];
  return Array.isArray(estadisticas.value)
    ? estadisticas.value
    : [estadisticas.value];
});

const normalizarSingularidad = (data) => {
  if (!data) return null;
  const raw = Array.isArray(data) ? data[0] : data;
  if (raw?.singularidades) {
    return Array.isArray(raw.singularidades)
      ? raw.singularidades[0] || null
      : raw.singularidades;
  }
  return raw;
};

const cargarSingularidad = async (id) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/singularidades/${id}`
    );
    singularidad.value = normalizarSingularidad(data);
  } catch (err) {
    console.error("Error al cargar singularidad:", err);
    singularidad.value = null;
  }
};

const cargarEstadisticas = async (id) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/singularidades/estadisticas/by-singularidad/${id}`
    );
    estadisticas.value = data;
  } catch (err) {
    console.error("Error al cargar estadisticas:", err);
    estadisticas.value = null;
  }
};

const cargarCodigos = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/alertas-codigo1/list");
    if (!response.ok) throw new Error("Error al obtener codigo1");
    codigos1.value = await response.json();
  } catch (err) {
    errorCodigo1.value = err.message;
  } finally {
    loadingCodigo1.value = false;
  }

  try {
    const response = await fetch("http://localhost:8080/api/alertas-codigo2/list");
    if (!response.ok) throw new Error("Error al obtener codigo2");
    codigos2.value = await response.json();
  } catch (err) {
    errorCodigo2.value = err.message;
  } finally {
    loadingCodigo2.value = false;
  }
};

const marcarComoLeida = async () => {
  if (!opcion.value) {
    showAlert("Selecciona aprobar o rechazar primero");
    return;
  }

  if (!comentario.value || comentario.value.trim().length === 0) {
    showAlert("Debes ingresar un comentario");
    return;
  }

  if (comentario.value.length > 80) {
    showAlert("El comentario no puede superar 80 caracteres");
    return;
  }

  if (!codigoSeleccionado.value) {
    showAlert("Debes seleccionar un codigo1");
    return;
  }

  if (!codigo2Seleccionado.value) {
    showAlert("Debes seleccionar un codigo2");
    return;
  }

  const payload = {
    id: props.id,
    valida: opcion.value === "aprobar",
    comentario: comentario.value,
    codigo1: codigoSeleccionado.value,
    codigo2: codigo2Seleccionado.value,
  };

  try {
    await axios.post(
      "http://localhost:8080/api/singularidades/marcar-leida",
      payload
    );
    showAlert("Singularidad validada correctamente");
    emit("cerrar");
    window.location.reload();
  } catch (err) {
    console.error("Error al validar singularidad:", err);
    showAlert("No se pudo validar la singularidad");
  }
};

watch(
  () => props.mostrar,
  async (nuevoValor, valorAnterior) => {
    if (nuevoValor && props.id != null) {
      await cargarSingularidad(props.id);
      await cargarEstadisticas(props.id);
    }

    if (!nuevoValor && valorAnterior) {
      opcion.value = null;
      comentario.value = "";
      codigoSeleccionado.value = "";
      codigo2Seleccionado.value = "";
    }
  }
);

onMounted(async () => {
  await cargarCodigos();
});
</script>

<template>
  <div v-if="mostrar" class="modal-backdrop">
    <div class="modal-content">
      <h2>Detalle de la Singularidad ID: {{ id }}</h2>
      <button class="btn-cerrar" @click="emit('cerrar')">Cerrar</button>

      <div class="panel">
        <h3>Datos de singularidad</h3>
        <div v-if="singularidad" class="vertical-scroll">
          <table class="vertical-table">
            <tbody>
              <tr v-for="([key, value], index) in detalleEntries" :key="key + index">
                <th>{{ key }}</th>
                <td>
                  <img
                    v-if="key === 'IconAssocieteFromProceso'"
                    :src="value"
                    alt="icono"
                    class="icono"
                  />
                  <span v-else>{{ value }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else>Cargando singularidad...</p>
      </div>

      <div class="panel">
        <h3>Datos de singularidad estadisticas</h3>
        <div v-if="estadisticasRecords.length" class="vertical-scroll">
          <div
            v-for="(item, idx) in estadisticasRecords"
            :key="'stats-' + idx"
            class="stats-block"
          >
            <table class="vertical-table">
              <tbody>
                <tr
                  v-for="([key, value], index) in Object.entries(item)"
                  :key="key + index"
                >
                  <th>{{ key }}</th>
                  <td>{{ value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p v-else>Sin estadisticas</p>
      </div>

      <div v-if="modoVista === 'validar' && singularidad" class="marcar-leida">
        <template v-if="singularidad.valida == null">
          <h3>Validar singularidad</h3>

          <button
            :class="{ activo: opcion === 'aprobar' }"
            @click="opcion = 'aprobar'"
          >
            Aprobar
          </button>

          <button
            :class="{ activo: opcion === 'rechazar' }"
            @click="opcion = 'rechazar'"
          >
            Rechazar
          </button>

          <label class="field-label">Comentario (max 80)</label>
          <textarea
            v-model="comentario"
            maxlength="80"
            placeholder="Escribe un comentario..."
          ></textarea>
          <div class="char-count">{{ comentario.length }} / 80</div>

          <div class="select-wrapper">
            <label for="codigo1">Seleccione codigo 1:</label>
            <select
              id="codigo1"
              v-model="codigoSeleccionado"
              class="form-select"
            >
              <option disabled value="">-- Seleccione una opcion --</option>
              <option
                v-for="item in codigos1"
                :key="item.id"
                :value="item.codcodigo1"
              >
                {{ item.codcodigo1 }} - {{ item.descripcion }}
              </option>
            </select>
            <p v-if="loadingCodigo1" class="loading">Cargando codigos...</p>
            <p v-if="errorCodigo1" class="error">{{ errorCodigo1 }}</p>
          </div>

          <div class="select-wrapper">
            <label for="codigo2">Seleccione codigo 2:</label>
            <select
              id="codigo2"
              v-model="codigo2Seleccionado"
              class="form-select"
            >
              <option disabled value="">-- Seleccione una opcion --</option>
              <option
                v-for="item in codigos2"
                :key="item.id"
                :value="item.codcodigo2"
              >
                {{ item.codcodigo2 }} - {{ item.descripcion }}
              </option>
            </select>
            <p v-if="loadingCodigo2" class="loading">Cargando codigos...</p>
            <p v-if="errorCodigo2" class="error">{{ errorCodigo2 }}</p>
          </div>

          <button class="btn-accion" @click="marcarComoLeida">
            Guardar validacion
          </button>
        </template>

        <template v-else>
          <h3>
            <span v-if="singularidad.valida === true">Singularidad aprobada</span>
            <span v-else-if="singularidad.valida === false">Singularidad rechazada</span>
            <span v-else>Singularidad leida</span>
          </h3>

          <p><strong>Comentario:</strong> {{ singularidad.comentario || "Sin comentario" }}</p>
          <p><strong>Codigo1:</strong> {{ singularidad.codigo1 || "Sin codigo1" }}</p>
          <p><strong>Codigo2:</strong> {{ singularidad.codigo2 || "Sin codigo2" }}</p>
          <p><strong>Usuario:</strong> {{ singularidad.userId || "Sin usuario" }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 90%;
  max-height: 80%;
  overflow-y: auto;
  position: relative;
}

.btn-cerrar {
  position: absolute;
  top: 10px;
  right: 10px;
  background: crimson;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.panel {
  margin-top: 16px;
  padding: 10px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 6px;
}

.vertical-scroll {
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px;
}

.vertical-table {
  width: 100%;
  border-collapse: collapse;
}

.vertical-table th,
.vertical-table td {
  padding: 6px 10px;
  border: 1px solid #ccc;
  text-align: left;
  font-size: 14px;
}

.stats-block + .stats-block {
  margin-top: 10px;
}

.icono {
  width: 40px;
  height: 40px;
}

.marcar-leida {
  margin-top: 20px;
  padding: 10px;
  background: #f5f9ff;
  border: 1px solid #cce;
  border-radius: 6px;
}

textarea {
  width: 100%;
  min-height: 60px;
  margin-top: 6px;
  padding: 5px;
  font-size: 14px;
}

.char-count {
  font-size: 12px;
  color: #666;
  text-align: right;
  margin-top: 4px;
}

.btn-accion {
  margin-top: 10px;
  background: #0077cc;
  color: white;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 4px;
}

.activo {
  background-color: #4caf50;
  color: white;
  border-color: #3d8b40;
  transform: scale(1.05);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.25);
}

.field-label {
  display: block;
  margin-top: 8px;
}

.select-wrapper {
  margin-top: 10px;
}
</style>
