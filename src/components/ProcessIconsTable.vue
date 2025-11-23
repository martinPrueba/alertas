<template>
  <div>
    <h3>Procesos e Íconos Asociados</h3>
    <div class="table-container">

<table class="table">
  <thead>
    <tr>
      <th>Proceso</th>
      <th>Grupo Local</th>
      <th>Ícono</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="proceso in procesos" :key="proceso.id">
      <td>{{ proceso.proceso }}</td>
      <td>{{ proceso.grupoLocal }}</td>

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
        <button class="btn-edit" @click="editarProceso(proceso)">✏ Editar</button>
        <button class="btn-delete" @click="eliminarProceso(proceso)">🗑 Eliminar</button>
      </td>
    </tr>
  </tbody>
</table>

    </div>


        <!-- Aquí incluyes el modal -->
    <EditarProceso
      :mostrar="mostrarModal"
      :proceso="procesoSeleccionado"
      @cerrar="cerrarModal"
      @actualizado="actualizarLocal"
    />

  </div>


</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import EditarProceso from "./EditarProceso.vue"; // 👈 Import

const procesos = ref([]);
const mostrarModal = ref(false);
const procesoSeleccionado = ref({});

const cargarProcesos = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/process-icons/get-all");

    procesos.value = response.data.map(p => ({
      id: p.id,
      proceso: p.proceso,
      iconUrl: p.iconUrl,
      grupoLocal: p.grupoLocal
    }));


    console.log("Procesos transformados:", procesos.value);
  } catch (error) {
    console.error("Error cargando procesos:", error);
  }
};


const editarProceso = (proceso) => {
  procesoSeleccionado.value = { ...proceso }; // clonar
  mostrarModal.value = true;
console.log("esto nos llego de proceso " + JSON.stringify(proceso));
  // Aquí puedes abrir un modal para actualizar el iconUrl
  console.log("mostrarModal", mostrarModal.value);

};


const eliminarProceso = async (proceso) => {
  // Confirmación al usuario
  const ok = confirm(`¿Seguro que deseas eliminar el ícono del proceso "${proceso.proceso}"?`);
  if (!ok) return;

  try {

    // Llamada DELETE enviando el ID
    await axios.delete(`http://localhost:8080/api/process-icons/delete/${proceso.id}`);

    // Eliminación en la tabla local
    procesos.value = procesos.value.filter(p => p.id !== proceso.id);
    console.log(proceso);
    console.log("OJOOOOOOOOO");
    alert("Proceso eliminado correctamente.");
  } catch (error) {
    console.error("Error eliminando proceso:", error);
    alert("❌ Error al eliminar el proceso.");
  }
};


// cerrar modal
const cerrarModal = () => {
  mostrarModal.value = false;
};

// actualizar la tabla local cuando se guarde en el modal
const actualizarLocal = (procesoActualizado) => {
  const index = procesos.value.findIndex(p => p.proceso === procesoActualizado.proceso);
  if (index !== -1) {
    procesos.value[index].iconUrl = procesoActualizado.iconUrl;
  }
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
