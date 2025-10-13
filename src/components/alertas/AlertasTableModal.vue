<!-- src/components/alertas/AlertasTableModal.vue -->
<script setup>
import { ref, watch, computed } from "vue";
import axios from "axios";

const props = defineProps({
  mostrar: Boolean,
  alertaId: Number,
  modoVista: {
    type: String,
    default: "simple", // valores: "simple", "validar", "relaciones"
  },
});


const emit = defineEmits(["cerrar"]);

const alerta = ref(null);
const columnas = ref([]);
const esLeida = ref(false); // viene de alertasLeidas

// Campos para marcar como leída
const valida = ref(false);
const comentario = ref("");

// Relacionadas (posteriores y anteriores)
const posterior = ref(null);
const colsPosterior = ref([]);
const anterior = ref(null);
const colsAnterior = ref([]);

// Utilidad: ¿hay columnas?
const hasCols = (cols) => Array.isArray(cols) && cols.length > 0;

// Computadas para saber si hay datos en posteriores/anteriores
const hayPosterior = computed(() => posterior.value && hasCols(colsPosterior.value));
const hayAnterior  = computed(() => anterior.value  && hasCols(colsAnterior.value));

// Cuando el modal se abre, cargamos datos
watch(
  () => props.mostrar,
  async (val) => {
    if (val && props.alertaId !== null) {
      await cargarAlerta(props.alertaId);
      await cargarRelacionadas(props.alertaId);
    }
  }
);

const cargarAlerta = async (id) => {
  try {
    const { data } = await axios.get(`http://localhost:8080/api/alertas/${id}`);
    // data[0] = { alertas: [...], alertasLeidas: [...] }
    const alertas = data?.[0]?.alertas || [];
    const alertasLeidas = data?.[0]?.alertasLeidas || [];

    const encontrada =
      alertas.find((a) => a.alertaid === id) ||
      alertasLeidas.find((a) => a.alertaid === id);

    alerta.value = encontrada || null;
    columnas.value = encontrada ? Object.keys(encontrada) : [];

    esLeida.value = alertasLeidas.some((a) => a.alertaid === id);

    // Reset sección marcar como leída
    valida.value = false;
    comentario.value = "";
  } catch (err) {
    console.error("❌ Error al cargar alerta:", err);
    alerta.value = null;
    columnas.value = [];
    esLeida.value = false;
  }
};

const cargarRelacionadas = async (id) => {
  // limpia antes de cargar
  posterior.value = null;
  colsPosterior.value = [];
  anterior.value = null;
  colsAnterior.value = [];

  // --- Posteriores ---
  try {
    const respPost = await axios.get(`http://localhost:8080/api/alertas-posteriores/${id}`);
    const dataPost = respPost?.data;
    if (dataPost && Object.keys(dataPost).length > 0) {
      posterior.value = dataPost;
      colsPosterior.value = Object.keys(dataPost);
    } else {
      posterior.value = null;
      colsPosterior.value = [];
    }
    console.log("🔽 Posterior:", dataPost); // evita [object Object]
  } catch (e) {
    console.error("⚠️ Error en posteriores:", e);
    const msg = e?.response?.data?.message || e?.response?.data?.error || e.message;
    if (msg) //alert(`Posteriores: ${msg}`);
    posterior.value = null;
    colsPosterior.value = [];
  }

  // --- Anteriores ---
  try {
    const respPrev = await axios.get(`http://localhost:8080/api/alertas-previos/${id}`);
    const dataPrev = respPrev?.data;
    if (dataPrev && Object.keys(dataPrev).length > 0) {
      anterior.value = dataPrev;
      colsAnterior.value = Object.keys(dataPrev);
    } else {
      anterior.value = null;
      colsAnterior.value = [];
    }
    console.log("🔼 Anterior:", dataPrev);
  } catch (e) {
    console.error("⚠️ Error en anteriores:", e);
    const msg = e?.response?.data?.message || e?.response?.data?.error || e.message;
    if (msg) //alert(`Anteriores: ${msg}`);
    anterior.value = null;
    colsAnterior.value = [];
  }
};


// Marcar como leída
const marcarComoLeida = async () => {
  try {
    const payload = {
      idAlerta: props.alertaId,
      valida: valida.value,
      comentario: comentario.value,
    };

    await axios.post("http://localhost:8080/api/alertas/marcar-leida", payload);

    alert("✅ Alerta marcada como leída");
    window.location.reload(); // refresca el mapa/tablas del listado
    emit("cerrar");
  } catch (err) {
    console.error("❌ Error al marcar como leída:", err);
    alert("❌ No se pudo marcar como leída");
  }
};
</script>

<template>
  <div v-if="mostrar" class="modal-backdrop">
    <div class="modal-content">
      <h2>📋 Detalle de la Alerta ID: {{ alertaId }}</h2>
      <button class="btn-cerrar" @click="emit('cerrar')">❌ Cerrar</button>

      <!-- 🟩 SECCIÓN PRINCIPAL: información básica de la alerta -->
      <div
        v-if="alerta && modoVista === 'simple'"
        class="tabla-wrapper"
      >
        <table>
          <thead>
            <tr>
              <th v-for="col in columnas" :key="col">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="col in columnas" :key="col">
                <img
                  v-if="col === 'IconAssocieteFromProceso'"
                  :src="alerta[col]"
                  alt="icono"
                  style="width: 40px; height: 40px;"
                />
                <span v-else>{{ alerta[col] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 👇 si aún no se cargó nada -->
      <p v-else-if="!alerta">⏳ Cargando alerta...</p>


<!-- 🟡 SECCIÓN VALIDAR -->
<div v-if="modoVista === 'validar' && alerta" class="marcar-leida">
  
  <!-- 🔹 Caso 1: alerta NO leída (sin fecha/tiempo de reconocimiento) -->
  <template v-if="!alerta.fecha_reconocimiento && !alerta.tiempo_reconocimiento">
    <h3>✅ Validar alerta</h3>
    <label>
      <input type="checkbox" v-model="valida" />
      ¿Validada?
    </label>

    <textarea
      v-model="comentario"
      placeholder="Escribe un comentario..."
    ></textarea>

    <button class="btn-accion" @click="marcarComoLeida">
      💾 Guardar validación
    </button>
  </template>

  <!-- 🔹 Caso 2: alerta YA leída (con fecha/tiempo de reconocimiento) -->
  <template v-else>
    <h3>📘 Alerta ya validada</h3>
    <p><strong>Fecha de reconocimiento:</strong> {{ alerta.fecha_reconocimiento }}</p>
    <p><strong>Tiempo de reconocimiento:</strong> {{ alerta.tiempo_reconocimiento }}</p>
    <p><strong>Comentario:</strong> {{ alerta.comentario || 'Sin comentario registrado' }}</p>
  </template>

</div>


      <!-- 🔴 SECCIÓN RELACIONES: sólo si el modoVista es 'relaciones' -->
      <div v-if="modoVista === 'relaciones'" class="relacionadas-container">
        <!-- Si no hay relaciones -->
        <div v-if="!hayPosterior && !hayAnterior" class="relacionadas">
          <p class="mensaje-vacio">
            <strong>No existen eventos posteriores ni anteriores.</strong>
          </p>
        </div>

        <!-- Si hay relaciones -->
        <div v-else>
          <!-- 🔼 Anteriores -->
          <div class="relacionadas">
            <h3>🔼 Alertas anteriores relacionadas</h3>
            <div v-if="hayAnterior" class="tabla-wrapper">
              <table>
                <thead>
                  <tr>
                    <th v-for="col in colsAnterior" :key="'ant-h-' + col">{{ col }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td v-for="col in colsAnterior" :key="'ant-v-' + col">
                      {{ anterior[col] == null ? "—" : anterior[col] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else class="mensaje-vacio">No hay alertas anteriores.</p>
          </div>

          <!-- 🔽 Posteriores -->
          <div class="relacionadas">
            <h3>🔽 Alertas posteriores relacionadas</h3>
            <div v-if="hayPosterior" class="tabla-wrapper">
              <table>
                <thead>
                  <tr>
                    <th v-for="col in colsPosterior" :key="'post-h-' + col">{{ col }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td v-for="col in colsPosterior" :key="'post-v-' + col">
                      {{ posterior[col] == null ? "—" : posterior[col] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else class="mensaje-vacio">No hay alertas posteriores.</p>
          </div>
        </div>
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

.tabla-wrapper {
  overflow-x: auto;
  margin-top: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px 12px;
  border: 1px solid #ccc;
  text-align: left;
  font-size: 14px;
}

/* Bloques relacionadas */
.relacionadas {
  margin-top: 16px;
  padding: 10px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 6px;
}

.mensaje-vacio {
  margin: 0;
  color: #666;
}

/* Sección marcar como leída */
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
  margin-top: 10px;
  padding: 5px;
  font-size: 14px;
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
</style>
