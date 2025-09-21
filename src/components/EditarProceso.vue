<template>
  <div v-if="mostrar" class="modal-backdrop">
    <div class="modal-edit">
      <h4>Editar Icono</h4>

      <div class="mb-3">
        <label>Proceso</label>
        <input type="text" v-model="proceso.proceso" disabled class="form-control" />
      </div>

      <div class="mb-3">
        <label>Subir Icono</label>
        <input type="file" @change="onFileChange" class="form-control" />
      </div>

      <!-- Vista previa del icono -->
      <div v-if="previewUrl" class="preview">
        <p><strong>Vista previa:</strong></p>
        <img :src="previewUrl" alt="preview" class="preview-img" />
      </div>

      <div class="actions">
        <button class="btn btn-secondary" @click="$emit('cerrar')">Cancelar</button>
        <button class="btn btn-primary" @click="guardar" :disabled="subiendo">
          {{ subiendo ? "Subiendo..." : "Guardar" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const { mostrar, proceso } = defineProps({
  mostrar: Boolean,
  proceso: Object
});

const emit = defineEmits(["cerrar", "actualizado"]);

const archivoSeleccionado = ref(null);
const previewUrl = ref(proceso.iconUrl || null);
const subiendo = ref(false);

// Cuando se selecciona un archivo
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    archivoSeleccionado.value = file;
    previewUrl.value = URL.createObjectURL(file); // vista previa local
  }
};

const guardar = async () => {
  try {
    let nuevaUrl = proceso.iconUrl;

    // 1️⃣ Subir archivo si hay uno nuevo
    if (archivoSeleccionado.value) {
      subiendo.value = true;
      const formData = new FormData();
      formData.append("file", archivoSeleccionado.value);

      const uploadResp = await axios.post("http://localhost:8080/api/files/icon", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      nuevaUrl = uploadResp.data.fileUrl; // obtenemos la url devuelta
      subiendo.value = false;
    }

    // 2️⃣ Actualizar proceso con la nueva URL
    await axios.put("http://localhost:8080/api/process-icons/update", {
      proceso: proceso.proceso,
      iconUrl: nuevaUrl
    });

    emit("actualizado", { ...proceso, iconUrl: nuevaUrl });
    emit("cerrar");
  } catch (e) {
    subiendo.value = false;
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

.modal-edit {
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  animation: fadeIn 0.3s ease;
  z-index: 10000;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.form-control {
  width: 100%;
  padding: 8px 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.preview {
  margin-top: 10px;
  text-align: center;
}

.preview-img {
  max-width: 120px;
  max-height: 120px;
  margin-top: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
</style>
