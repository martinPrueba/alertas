<template>
  <div v-if="mostrar" class="modal-backdrop">
    <div class="modal">
      <h4>Editar Icono</h4>

      <div class="mb-3">
        <label>Proceso</label>
        <input type="text" v-model="proceso.proceso" disabled class="form-control" />
      </div>

      <div class="mb-3">
        <label>URL Icono</label>
        <input type="text" v-model="proceso.iconUrl" class="form-control" />
      </div>

      <div class="actions">
        <button class="btn btn-secondary" @click="$emit('cerrar')">Cancelar</button>
        <button class="btn btn-primary" @click="guardar">Guardar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";

// ✅ props desestructuradas
const { mostrar, proceso } = defineProps({
  mostrar: Boolean,
  proceso: Object
});

const emit = defineEmits(["cerrar", "actualizado"]);

const guardar = async () => {
  try {
    await axios.put("http://localhost:8080/api/process-icons/update", {
      proceso: proceso.proceso,
      iconUrl: proceso.iconUrl
    });
    emit("actualizado", { ...proceso });
    emit("cerrar");
  } catch (e) {
    console.error("Error guardando icono:", e);
    alert("❌ Error al guardar el icono");
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  min-height: 180px;
  color: black;
  z-index: 10000;
}

.actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #0d6efd;
  color: white;
}
.btn-primary:hover {
  background: #0b5ed7;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}
.btn-secondary:hover {
  background: #5a6268;
}
</style>
