<template>
  <div>
    <h3>Procesos e Íconos Asociados</h3>

    <div class="div-boton-agregar">
      <button class="btn-add" type="button" @click="toggleAgregar">
        {{ mostrarAgregar ? "Cancelar" : "➕ Agregar" }}
      </button>

      <br>
    </div>

            <br>

    <div class="table-container">

<table class="table">
  <thead>
    <tr>
      <th>Proceso</th>
      <th>Ícono</th>
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

      <td class="actions-cell">
        <button class="btn-edit" @click="editarProceso(proceso)">✏</button>
        <button class="btn-delete" @click="eliminarProceso(proceso)">🗑</button>
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


    <div v-if="mostrarAgregar" class="form-container">
      <h4>Nuevo proceso</h4>
      <div class="form-grid">
        <label class="form-field">
          <span>Proceso</span>
          <input
            v-model="nuevoProceso.proceso"
            type="text"
            class="form-control"
            placeholder="Nombre del proceso"
          />
        </label>

        <label class="form-field">
          <span>URL del ícono</span>
          <input
            type="file"
            accept="image/*"
            class="form-control"
            @change="handleIconFile"
          />
          <small v-if="iconUploadNombre">{{ iconUploadNombre }}</small>
          <small v-else>Seleccione un archivo de imagen para subir.</small>
          <small v-if="nuevoProceso.iconUrl" class="upload-success">
            Ícono subido correctamente.
          </small>
          <small v-if="subiendoIcono" class="upload-progress">Subiendo ícono...</small>
        </label>
      </div>
      <div class="actions">
        <button class="btn-save" type="button" @click="crearProceso">Guardar</button>
      </div>
    </div>


  </div>


</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import EditarProceso from "./EditarProceso.vue"; // 👈 Import
import { useGlobalAlert } from "@/stores/useGlobalAlert.js";


const { showAlert } = useGlobalAlert();
const procesos = ref([]);
const mostrarModal = ref(false);
const procesoSeleccionado = ref({});

const mostrarAgregar = ref(false);
const nuevoProceso = ref({
  proceso: "",
  iconUrl: "",
});
const subiendoIcono = ref(false);
const iconUploadNombre = ref("");


const cargarProcesos = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/process-icons/get-all");

    procesos.value = response.data.map(p => ({
      id: p.id,
      proceso: p.proceso,
      iconUrl: p.iconUrl
      }));


    console.log("Procesos transformados:", procesos.value);
  } catch (error) {
    console.error("Error cargando procesos:", error);
  }
};


const toggleAgregar = () => {
  mostrarAgregar.value = !mostrarAgregar.value;
  if (!mostrarAgregar.value) {
    limpiarFormulario();
  }
};

const limpiarFormulario = () => {
  nuevoProceso.value = {
    proceso: "",
    iconUrl: "",
  };
  iconUploadNombre.value = "";
  subiendoIcono.value = false;
};

const handleIconFile = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  iconUploadNombre.value = file.name;
  subiendoIcono.value = true;

  try {
    const { data } = await axios.post(
      "http://localhost:8080/api/files/icon",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    nuevoProceso.value.iconUrl = data?.fileUrl || data?.fileUrl || data?.fileUrl || data;
  } catch (error) {
    console.error("Error subiendo el ícono:", error);
    alert("❌ Error al subir el ícono. Intente nuevamente.");
    nuevoProceso.value.iconUrl = "";
  } finally {
    subiendoIcono.value = false;
  }
};

const crearProceso = async () => {
  if (!nuevoProceso.value.proceso) {
    alert("Por favor complete el proceso");
    return;
  }

  if (!nuevoProceso.value.iconUrl) {
    alert("Por favor cargue el ícono antes de guardar.");
    return;
  }

  try {
    const { data } = await axios.post(
      "http://localhost:8080/api/process-icons/create-process-icon",
      nuevoProceso.value
    );

    procesos.value.push({
      id: data?.id || Date.now(),
      ...nuevoProceso.value
    });

    limpiarFormulario();
    mostrarAgregar.value = false;
    alert("Proceso agregado correctamente.");
  } catch (error) {
    console.error("Error creando proceso:", error);
    alert("❌ Error al crear el proceso.");
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
    showAlert("Proceso eliminado correctamente.")
  } catch (error) {
    console.error("Error eliminando proceso:", error);
    showAlert("❌ Error al eliminar el proceso.")
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
    width: 40px;

}
.btn-edit:hover {
  background-color: #e0a800;
}


.btn-delete {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
    width: 40px;

}

.btn-delete:hover {
  background-color: #c82333;
}

.btn-add {
  background-color: #198754;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-add:hover {
  background-color: #157347;
}

.form-container {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f8f9fa;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.btn-save {
  background-color: #0d6efd;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-save:hover {
  background-color: #0b5ed7;
}

.actions-cell {
  display: flex;
  justify-content: center;
  gap: 10px;
}


</style>
