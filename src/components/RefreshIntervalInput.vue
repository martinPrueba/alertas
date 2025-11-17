<template>

<div></div>
<!--  <div class="refresh-card">
    <h4>Intervalo de actualización</h4>

    <form class="form-row" @submit.prevent="guardar">
      <label for="seconds">Segundos</label>
      <input
        id="seconds"
        type="number"
        min="5"
        max="3600"
        step="1"
        v-model.number="seconds"
        :disabled="cargando"
        class="input"
      />

      <button class="btn btn-primary" :disabled="cargando || !esValido">
        {{ cargando ? "Guardando..." : "Guardar" }}
      </button>

      <button type="button" class="btn" @click="cargar" :disabled="cargando">
        Recargar
      </button>
    </form>

    <p class="help">
      Debe ser un número entre 5 y 3600 segundos.
    </p>
  </div> -->

</template>

<script setup>

/*
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const emit = defineEmits(["interval-updated"]);

// Endpoints según tu controller actual
const GET_URL = "http://localhost:8080/api/alertas/get/refresh-interval";
const PUT_URL = "http://localhost:8080/api/alertas/post/refresh-interval";

const seconds  = ref(30);
const cargando = ref(false);

const esValido = computed(
  () => Number.isFinite(seconds.value) && seconds.value >= 5 && seconds.value <= 3600
);

const alertFromError = (err) => {
  const data = err?.response?.data || {};
  const msg  = data.message || data.error || err.message || "Error desconocido";
  alert(`❌ ${msg}`);
};

const cargar = async () => {
  try {
    cargando.value = true;
    const { data } = await axios.get(GET_URL);
    // Esperado: { seconds: number } | o { message/error }
    if (typeof data?.seconds === "number") {
      seconds.value = data.seconds;
    } else {
      alert(`ℹ️ ${data?.message || data?.error || "Respuesta inesperada del servidor"}`);
    }
  } catch (err) {
    alertFromError(err);
  } finally {
    cargando.value = false;
  }
};

const guardar = async () => {
  try {
    if (!esValido.value) {
      return alert("⚠️ Valor inválido. Debe estar entre 5 y 3600.");
    }
    cargando.value = true;
    const body = { seconds: Math.floor(seconds.value) };
    const { data } = await axios.put(PUT_URL, body);
    // Esperado: { message: "Actualizado", seconds: number } | o { message/error }
    if (typeof data?.seconds === "number") {
      seconds.value = data.seconds;
    }
    alert(`✅ ${data?.message || "Intervalo actualizado"}`);
    // Notifica al padre para que recargue el mapa con el nuevo intervalo
    emit("interval-updated", seconds.value);
  } catch (err) {
    alertFromError(err);
  } finally {
    cargando.value = false;
  }
};

onMounted(cargar);

*/
</script>

<style scoped>
.refresh-card {
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}
.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.input {
  width: 120px;
  padding: 6px 8px;
}
.btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  cursor: pointer;
  background: #f7f7f7;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-primary {
  background: #0d6efd;
  color: #fff;
  border-color: #0d6efd;
}
.help {
  margin-top: 6px;
  color: #555;
  font-size: 12px;
}
</style>
