<template>
  <teleport to="body">
    <div v-if="alertMessage" class="alert-overlay" @click="clearAlert">
      <div class="alert-box">
        <p>{{ alertMessage }}</p>
        <button @click="clearAlert">Cerrar</button>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { useGlobalAlert } from "@/stores/useGlobalAlert.js";

const { alertMessage, clearAlert } = useGlobalAlert();
</script>

<style scoped>
.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
}
.alert-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0,0,0,0.4);
}
</style>
