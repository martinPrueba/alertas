<!-- src/components/alertas/AlertasTableModal.vue -->
<script setup>
import { ref, watch, computed } from "vue";
import { onMounted } from 'vue'

import axios from "axios";

const props = defineProps({
  mostrar: Boolean,
  alertaId: Number,
  modoVista: {
    type: String,
    default: "simple", // valores: "simple", "validar", "relaciones"
  },
});


const { showAlert } = useGlobalAlert();

import { useGlobalAlert } from "@/stores/useGlobalAlert.js";

const emit = defineEmits(["cerrar"]);

const alerta = ref(null);
const columnas = ref([]);
const esLeida = ref(false); // viene de alertasLeidas




const comentario = ref("");

// Relacionadas (posteriores y anteriores)
const posterior = ref(null);
const colsPosterior = ref([]);
const anterior = ref(null);
const colsAnterior = ref([]);

// Utilidad: ¿hay columnas?
const hasCols = (cols) => Array.isArray(cols) && cols.length > 0;

const hayPosterior = computed(() => Array.isArray(posterior.value) && posterior.value.length > 0);
const hayAnterior  = computed(() => Array.isArray(anterior.value) && anterior.value.length > 0);




//variable para entender el boton que se presiono
const opcion = ref(null); 




// Cuando el modal se abre, cargamos datos
watch(
  () => props.mostrar,
  async (nuevoValor, valorAnterior) => {
    // 🔵 Cuando se abre
    if (nuevoValor && props.alertaId !== null) {
      await cargarAlerta(props.alertaId);
      await cargarRelacionadas(props.alertaId);
    }

    // 🔴 Cuando se cierra
    if (!nuevoValor && valorAnterior) {
      opcion.value = null;
      comentario.value = "";
      codigoSeleccionado.value = "";
      codigo2Seleccionado.value = "";
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
    comentario.value = "";
  } 
  catch (err) 
  {
    console.error("❌ Error al cargar alerta:", err);
    alerta.value = null;
    columnas.value = [];
    esLeida.value = false;
  }
};

const cargarRelacionadas = async (id) => {
  // limpia antes de cargar
  posterior.value = [];
  colsPosterior.value = [];
  anterior.value = [];
  colsAnterior.value = [];

  // --- Posteriores ---
  try {
    const respPost = await axios.get(`http://localhost:8080/api/alertas-posteriores/${id}`);
    const dataPost = respPost?.data;
    if (Array.isArray(dataPost) && dataPost.length > 0) {
      posterior.value = dataPost;
      colsPosterior.value = Object.keys(dataPost[0]); // columnas del primer elemento
    } else {
      posterior.value = [];
      colsPosterior.value = [];
    }
  } catch (e) {
    console.error("⚠️ Error en posteriores:", e);
    posterior.value = [];
    colsPosterior.value = [];
  }

  // --- Anteriores ---
  try {
    const respPrev = await axios.get(`http://localhost:8080/api/alertas-previos/${id}`);
    const dataPrev = respPrev?.data;
    if (Array.isArray(dataPrev) && dataPrev.length > 0) {
      anterior.value = dataPrev;
      colsAnterior.value = Object.keys(dataPrev[0]);
    } else {
      anterior.value = [];
      colsAnterior.value = [];
    }
  } catch (e) {
    console.error("⚠️ Error en anteriores:", e);
    anterior.value = [];
    colsAnterior.value = [];
  }
};



const marcarComoLeida = async () => {
  try {
    if (!opcion.value) 
    {
      showAlert("Selecciona aprobar o rechazar primero");
      return;
    }

        // Validar comentario mínimo 10 caracteres
    if (!comentario.value || comentario.value.trim().length < 10) 
    {
      showAlert("El comentario debe tener al menos 10 caracteres.");
      return;
    }

        // 3) Validar códigos obligatorios
    if (!codigoSeleccionado.value) 
    {
      showAlert("Debes seleccionar un código principal (codigo1).");
      return;
    }

    if (!codigo2Seleccionado.value) 
    {
      showAlert("Debes seleccionar un código secundario (codigo2).");
      return;
    }

    // convertir opcion → booleano
    const valorValida = opcion.value === "aprobar";



    const payload = {
      idAlerta: props.alertaId,
      valida: valorValida,             // 👈 aquí sí va booleano
      comentario: comentario.value,
      codigo1: codigoSeleccionado.value,
      codigo2: codigo2Seleccionado.value,
    };


    await axios.post("http://localhost:8080/api/alertas/marcar-leida", payload);

    showAlert("✅ Alerta marcada como leída");
    window.location.reload();
    emit("cerrar");

  } catch (err) {
    console.error("❌ Error al marcar como leída:", err);
    showAlert("❌ No se pudo marcar como leída");
  }
};






const alertas = ref([])
const codigoSeleccionado = ref('')
const loading = ref(true)
const error = ref(null)

const alertasCodigo2 = ref([])
const codigo2Seleccionado = ref('')
const loadingCodigo2 = ref(true)
const errorCodigo2 = ref(null)


onMounted(async () => {
  try {
    const response = await fetch('http://localhost:8080/api/alertas-codigo1/list')
    if (!response.ok) throw new Error('Error al obtener los datos del servidor')
    alertas.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }

try {
  const response2 = await fetch('http://localhost:8080/api/alertas-codigo2/list')
  if (!response2.ok) throw new Error('Error al obtener los códigos del servidor')
  alertasCodigo2.value = await response2.json()
} catch (err) {
  errorCodigo2.value = err.message
} finally {
  loadingCodigo2.value = false
}


})

function emitirSeleccion() {
  console.log("Código 1 seleccionado:", codigoSeleccionado.value)
}

function emitirSeleccionCodigo2() {
  console.log("Código 2 seleccionado:", codigo2Seleccionado.value)
}


</script>

<template>
  <div v-if="mostrar" class="modal-backdrop">
    <div class="modal-content">
      <h2>📋 Detalle de la Alerta ID: {{ alertaId }}</h2>
      <button class="btn-cerrar" @click="emit('cerrar')">❌ Cerrar</button>

      <!-- 🟩 SECCIÓN PRINCIPAL: información básica de la alerta -->
      <div 
  v-if="alerta && modoVista !== 'relaciones'"
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
  
  <!-- 🔹 Caso 1: alerta NO leída (sin fecha/tiempo de reconocimiento) -->
  <template  v-if="alerta.valida == null">
    <h3>Validar alerta</h3>

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



    <textarea
      v-model="comentario"
      placeholder="Escribe un comentario..."
    ></textarea>

      <div class="select-alertas-codigo1">
    <label for="codigo1">Seleccione Código 1:</label>
  <select
    id="codigo1"
    v-model="codigoSeleccionado"
    @change="emitirSeleccion"
    class="form-select"
  >
    <option disabled value="">-- Seleccione una opción --</option>
    <option
      v-for="item in alertas"
      :key="item.id"
      :value="item.codcodigo1"
    >
      {{ item.codcodigo1 }} - {{ item.descripcion }}
    </option>
  </select>

  <p v-if="codigoSeleccionado" class="seleccion">
    Código seleccionado: <strong>{{ codigoSeleccionado }}</strong>
  </p>

  <p v-if="loading" class="loading">Cargando códigos...</p>
  <p v-if="error" class="error">{{ error }}</p>

  </div>






  <div class="select-alertas-codigo2">
    <label for="codigo2">Seleccione Código 2:</label>
    <select
      id="codigo2"
      v-model="codigo2Seleccionado"
      @change="emitirSeleccionCodigo2"
      class="form-select"
    >
      <option disabled value="">-- Seleccione una opción --</option>
      <option
        v-for="item in alertasCodigo2"
        :key="item.id"
        :value="item.codcodigo2"
      >
        {{ item.codcodigo2 }} - {{ item.descripcion }}
      </option>
    </select>

    <p v-if="codigo2Seleccionado" class="seleccion">
      Código seleccionado: <strong>{{ codigo2Seleccionado }}</strong>
    </p>

    <p v-if="loadingCodigo2" class="loading">Cargando códigos...</p>
    <p v-if="errorCodigo2" class="error">{{ errorCodigo2 }}</p>

  </div>



    <button class="btn-accion" @click="marcarComoLeida">
      💾 Guardar validación
    </button>
  </template>

  <!-- 🔹 Caso 2: alerta YA leída (con fecha/tiempo de reconocimiento) -->
  <template v-else>
    <h3>
      <span v-if="alerta.valida === true">Alerta Aprobada</span>
      <span v-else-if="alerta.valida === false">Alerta Rechazada</span>
      <span v-else>📘 Alerta leída</span>
    </h3>

    <p><strong>Fecha de reconocimiento:</strong> {{ alerta.fecha_reconocimiento }}</p>
    <p><strong>Tiempo de reconocimiento:</strong> {{ alerta.tiempo_reconocimiento }}</p>
    <p><strong>Comentario:</strong> {{ alerta.comentario || 'Sin comentario registrado' }}</p>
    <p><strong>Id de usuario:</strong> {{ alerta.userid || 'Id de usuario no encontrado' }}</p>
    <p><strong>Codigo1:</strong> {{ alerta.codigo1 || 'Codigo1 no encontrado' }}</p>
    <p><strong>Codigo2:</strong> {{ alerta.codigo2 || 'Codigo2 no encontrado' }}</p>

  </template>

</div>


<!-- 🔴 SECCIÓN RELACIONES -->
<div v-if="modoVista === 'relaciones'" class="relacionadas-container">

  <!-- Si no hay relaciones -->
  <div v-if="!hayPosterior && !hayAnterior" class="relacionadas">
    <p class="mensaje-vacio"><strong>No existen eventos posteriores ni anteriores.</strong></p>
  </div>

  <!-- Si hay relaciones -->
  <div v-else>

    <!-- 🔼 Anteriores -->
    <div class="relacionadas">
      <h3>🔼 Alertas anteriores relacionadas</h3>
      <div v-if="hayAnterior" class="tabla-wrapper scroll-list">
        <table>
          <thead>
            <tr>
              <th v-for="col in colsAnterior" :key="'ant-h-' + col">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(alerta, index) in anterior" :key="'ant-row-' + index">
              <td v-for="col in colsAnterior" :key="'ant-v-' + col">
                {{ alerta[col] == null ? "—" : alerta[col] }}
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
      <div v-if="hayPosterior" class="tabla-wrapper scroll-list">
        <table>
          <thead>
            <tr>
              <th v-for="col in colsPosterior" :key="'post-h-' + col">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(alerta, index) in posterior" :key="'post-row-' + index">
              <td v-for="col in colsPosterior" :key="'post-v-' + col">
                {{ alerta[col] == null ? "—" : alerta[col] }}
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

.activo {
  background-color: #4caf50;   /* verde para seleccionado */
  color: white;
  border-color: #3d8b40;
  transform: scale(1.05);      /* ligero zoom para destacarlo */
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.25); /* sombra bonita */
}
</style>
