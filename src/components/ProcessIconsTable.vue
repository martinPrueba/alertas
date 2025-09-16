<template>
  <div>
    <h3>Procesos e Íconos Asociados</h3>
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Proceso</th>
            <th>IconAssocieteFromProceso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="proceso in procesos" :key="proceso.id">
            <td>{{ proceso.proceso }}</td>
            <td>
              <img
                v-if="proceso.iconUrl"
                :src="proceso.iconUrl"
                alt="icono"
                class="icon-img"
              />
              <span v-else>No tiene ícono</span>
            </td>
            <td>
              <button class="btn-edit" @click="editarProceso(proceso)">
                ✏ Editar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const procesos = ref([]);

const cargarProcesos = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/process-icons/get-all");
    procesos.value = response.data;
  } catch (error) {
    console.error("Error cargando procesos:", error);
  }
};

const editarProceso = (proceso) => {
  alert(`Editar proceso: ${proceso.proceso}`);
  // Aquí puedes abrir un modal para actualizar el iconUrl
};

onMounted(() => {
  cargarProcesos();
});
</script>

<style scoped>
.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.icon-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.btn-edit {
  background-color: #ffc107;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-edit:hover {
  background-color: #e0a800;
}
</style>
