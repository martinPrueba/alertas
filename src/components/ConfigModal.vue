<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <header class="modal-header">
        <h3>⚙ Configuración</h3>
        <!-- <button class="close-btn" @click="close">✖</button>-->
      </header>

      <section class="modal-body">
        <h5>Configuración de visibilidad de columnas de alertas</h5>

        <!-- Tabla con scroll horizontal -->
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Columna</th>
                <th>Visible</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="col in columns" :key="col.fieldName">
                <td>{{ col.fieldName }}</td>
                <td>
                  <!-- Checkbox refleja el valor de visible -->
                  <input
                    type="checkbox"
                    v-model="col.visible"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>


            <ProcessIconsTable />
            
            <RefreshIntervalInput />
      </section>

        <footer class="modal-footer">
        <button class="btn" @click="guardarCambios">Guardar</button>
        <button class="btn btn-secondary" @click="close">Cerrar</button>
        </footer>

    </div>
  </div>
</template>


<script setup>
const props = defineProps({
  show: { type: Boolean, default: false }
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import ProcessIconsTable from "./ProcessIconsTable.vue"; // 👈 importa el componente hijo
import RefreshIntervalInput from "./RefreshIntervalInput.vue"; // 👈 importa el componente hijo
import emitter from "@/utils/emitter"; // 👈 bus de eventos (mitt) para notificar al GoogleMap

const columns = ref([]); // columnas desde la API

// Cuando cambia el checkbox
const toggleVisibility = async (col) => {
  console.log(`Columna ${col.fieldName} ahora es ${col.visible}`);
  try {
    await axios.put("http://localhost:8080/api/visible-fields/update-all", col);
  } catch (error) {
    console.error("Error actualizando visibilidad:", error);
  }
};

// 🔥 Botón Guardar: envía todo a la API
const guardarCambios = async () => {
  try {
    const response = await axios.put(
      "http://localhost:8080/api/visible-fields/update-all",
      columns.value
    );
    console.log("Respuesta backend:", response.data);
    alert("Configuración guardada correctamente ✅");
  } catch (error) {
    console.error("Error al guardar:", error);
    alert("❌ Error al guardar cambios");
  }
};

// 📥 Carga de columnas visibles
onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/visible-fields/get-all");
    // 🔄 transformar { key: value } → [{ fieldName, visible }]
    columns.value = Object.entries(response.data).map(([key, value]) => ({
      fieldName: key,
      visible: value
    }));
    console.log("📌 Columnas cargadas:", columns.value);
  } catch (error) {
    console.error("Error cargando columnas:", error);
  }

  // ▶️ Arranca el ciclo de auto-refresh
  refreshTick();
});

/* ============================
   🕒 Auto-refresh del GoogleMap
   ============================ */
const GET_REFRESH_URL = "http://localhost:8080/api/alertas/get/refresh-interval";
const refreshSeconds = ref(30);
let refreshTimeoutId = null;

// Programa el siguiente tick
const scheduleNextTick = (sec) => {
  clearTimeout(refreshTimeoutId);
  const s = Math.max(5, Number(sec) || 30);
  refreshTimeoutId = setTimeout(refreshTick, s * 1000);
};

// Tick: lee segundos, emite REFRESH_MAP, reprograma
const refreshTick = async () => {
  try {
    const { data } = await axios.get(GET_REFRESH_URL);
    // Puede venir { seconds: n } o un número directo, o {message/error}
    let s =
      typeof data?.seconds === "number"
        ? data.seconds
        : Number.isFinite(data)
        ? Number(data)
        : refreshSeconds.value;

    if (!Number.isFinite(s) || s < 5) s = 30;
    refreshSeconds.value = s;

    // 🔔 Notifica al mapa para que se recargue (GoogleMap escucha REFRESH_MAP)
    emitter.emit("REFRESH_MAP");
  } catch (e) {
    console.error("⚠️ No se pudo obtener refresh-interval:", e?.response?.data || e.message);
    // Aunque falle, continúa con el valor vigente
  } finally {
    scheduleNextTick(refreshSeconds.value);
  }
};

onUnmounted(() => {
  clearTimeout(refreshTimeoutId);
});
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 600px;
  max-height: 80vh;       /* 👈 limite de alto del modal */
  display: flex;
  flex-direction: column;
  overflow: hidden;       /* evita que el contenido se desborde */
}

.modal-body {
  flex: 1;
  overflow-y: auto;       /* 👈 scroll vertical */
  padding: 16px;
}

/* Contenedor de la tabla */
.table-container {
  overflow-x: auto;       /* scroll horizontal */
  overflow-y: auto;       /* 👈 scroll vertical */
  max-height: 300px;      /* 👈 limite de alto */
}

.table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px 12px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end; /* los empuja a la derecha */
  gap: 10px;                 /* 👈 separación entre botones */
  padding: 8px 16px;
}

.btn {
  background: #0d6efd;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background: #0b5ed7;
}

/* Estilo alternativo para el botón Cerrar */
.btn-secondary {
  background: #6c757d;
}
.btn-secondary:hover {
  background: #5a6268;
}
</style>
