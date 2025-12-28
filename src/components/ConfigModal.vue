<template>
  <teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <header class="modal-header">
          <h3>Configuracion</h3>
        </header>

        <section class="modal-body">
          <h5>Configuracion de visibilidad de columnas de alertas</h5>

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
                    <input type="checkbox" v-model="col.visible" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h5>Configuracion de visibilidad de columnas de singularidades</h5>

          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Columna</th>
                  <th>Visible</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="col in singularidadesColumns" :key="col.fieldName">
                  <td>{{ col.fieldName }}</td>
                  <td>
                    <input type="checkbox" v-model="col.visible" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h5>Configuracion de visibilidad de columnas de singularidades estadisticas</h5>

          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Columna</th>
                  <th>Visible</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="col in singularidadesEstadisticasColumns"
                  :key="col.fieldName"
                >
                  <td>{{ col.fieldName }}</td>
                  <td>
                    <input type="checkbox" v-model="col.visible" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h5>Configuracion opciones de filtro</h5>

          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Columna</th>
                  <th>Visible</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="col in columnsFilter" :key="col.fieldName">
                  <td>{{ col.fieldName }}</td>
                  <td>
                    <input type="checkbox" v-model="col.visible" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ProcessIconsTable />

          <h5>Configuracion Singularidad Geo</h5>

          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Condicion</th>
                  <th>Color</th>
                </tr>
              </thead>
              <tbody>
                  <tr v-for="rango in singularidadGeoConfig" :key="rango.nombre">

                  <td>{{ formatearCondicion(rango) }}</td>
                  <td>
                    <input type="color" v-model="rango.color" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <footer class="modal-footer">
          <button class="btn" @click="guardarCambios();">Guardar</button>
          <button class="btn btn-secondary" @click="close">Cerrar</button>
        </footer>
      </div>
    </div>
   </teleport>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import ProcessIconsTable from "./ProcessIconsTable.vue";
import { useGlobalAlert } from "@/stores/useGlobalAlert.js";

const props = defineProps({
  show: { type: Boolean, default: false },
});

const emit = defineEmits(["close"]);
const close = () => emit("close");

const { showAlert } = useGlobalAlert();

const columns = ref([]);
const columnsFilter = ref([]);
const singularidadesColumns = ref([]);
const singularidadesEstadisticasColumns = ref([]);
const defaultRangosSingularidadGeo = [
  {
    key: "mayor-09",
    nombre: "Valor > 0.9",
    color: "#FF0000",
    minValor: 0.9,
    maxValor: null,
    prioridad: 1
  },
  {
    key: "menor-01",
    nombre: "Valor < 0.1",
    color: "#00FF00",
    minValor: null,
    maxValor: 0.1,
    prioridad: 2
  },
  {
    key: "otros",
    nombre: "Entre 0.1 y 0.9",
    color: "#FFFF00",
    minValor: 0.1,
    maxValor: 0.9,
    prioridad: 3
  }
];
const singularidadGeoConfig = ref([...defaultRangosSingularidadGeo]);

const guardarCambios = async () => {
  try {
    const response = await axios.put(
      "http://localhost:8080/api/visible-fields/update-all",
      columns.value
    );
    console.log("Respuesta backend:", response.data);
  } catch (error) {
    console.error("Error al guardar:", error);
    showAlert("Error al guardar cambios");
  }

  try {
    const responseSaveFilter = await axios.put(
      "http://localhost:8080/api/visible-fields-filter/update-all",
      columnsFilter.value
    );
    console.log("Respuesta backend:", responseSaveFilter.data);
  } catch (error) {
    console.error("Error al guardar:", error);
    showAlert("Error al guardar cambios");
  }

  try {
    const responseSingularidades = await axios.put(
      "http://localhost:8080/api/singularidades/visible-fields/update-all",
      singularidadesColumns.value
    );
    console.log(
      "Respuesta backend singularidades:",
      responseSingularidades.data
    );
  } catch (error) {
    console.error("Error al guardar singularidades:", error);
    showAlert("Error al guardar cambios");
  }

  try {
    const responseSingularidadesEstadisticas = await axios.put(
      "http://localhost:8080/api/singularidades/estadisticas-visible-fields/config/update-all",
      singularidadesEstadisticasColumns.value
    );
    console.log(
      "Respuesta backend singularidades estadisticas:",
      responseSingularidadesEstadisticas.data
    );
  } catch (error) {
    console.error("Error al guardar singularidades estadisticas:", error);
    showAlert("Error al guardar cambios");
  }

try {
  const response = await axios.put(
    "http://localhost:8080/api/rangos-color/update-all",
    singularidadGeoConfig.value
  );
  console.log("Respuesta backend geo:", response.data);
} catch (error) {
  console.error("Error:", error);
}



  close();
  showAlert("Configuracion guardada correctamente.");

  setTimeout(() => {
    window.location.reload();
  }, 3000);
};

onMounted(async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/visible-fields/get-all"
    );
    columns.value = Object.entries(response.data).map(([key, value]) => ({
      fieldName: key,
      visible: value,
    }));
    console.log("Columnas cargadas:", columns.value);
  } catch (error) {
    console.error("Error cargando columnas:", error);
  }

  try {
    const responseApiFilter = await axios.get(
      "http://localhost:8080/api/visible-fields-filter/get-all"
    );
    columnsFilter.value = Object.entries(responseApiFilter.data).map(
      ([key, value]) => ({
        fieldName: key,
        visible: value,
      })
    );
    console.log("Columnas cargadas filter:", columnsFilter.value);
  } catch (error) {
    console.error("Error cargando columnas:", error);
  }

  try {
    const responseSingularidades = await axios.get(
      "http://localhost:8080/api/singularidades/visible-fields/get-all"
    );
    const data = responseSingularidades.data;
    singularidadesColumns.value = Array.isArray(data)
      ? data.map((item) => ({
          fieldName: item.fieldName,
          visible: item.visible,
        }))
      : Object.entries(data).map(([key, value]) => ({
          fieldName: key,
          visible: value,
        }));
    console.log("Columnas de singularidades cargadas:", singularidadesColumns.value);
  } catch (error) {
    console.error("Error cargando columnas de singularidades:", error);
  }

  try {
    const responseSingularidadesEstadisticas = await axios.get(
      "http://localhost:8080/api/singularidades/estadisticas-visible-fields/config"
    );
    const data = responseSingularidadesEstadisticas.data;
    singularidadesEstadisticasColumns.value = Array.isArray(data)
      ? data.map((item) => ({
          fieldName: item.fieldName,
          visible: item.visible,
        }))
      : Object.entries(data).map(([key, value]) => ({
          fieldName: key,
          visible: value,
        }));
    console.log(
      "Columnas de singularidades estadisticas cargadas:",
      singularidadesEstadisticasColumns.value
    );
  } catch (error) {
    console.error("Error cargando columnas de singularidades estadisticas:", error);
  }

  try {
    const responseRangos = await axios.get(
      "http://localhost:8080/api/rangos-color"
    );
    singularidadGeoConfig.value = normalizarRangos(responseRangos.data);
    console.log(
      "Configuracion singularidad geo cargada:",
      singularidadGeoConfig.value
    );
  } catch (error) {
    console.error("Error cargando Configuracion de singularidad geo:", error);
    singularidadGeoConfig.value = normalizarRangos([]);
  }
});

const normalizarRangos = (data) => {
  const limpiar = (v) => (v === undefined ? null : v);

  const entrante = Array.isArray(data)
    ? data.map((item) => ({
        id: item.id,
        nombre: item.nombre || "",
        color: item.color || "#000000",
        minValor: limpiar(item.minValor),
        maxValor: limpiar(item.maxValor),
        prioridad: item.prioridad ?? null
      }))
    : [];

return defaultRangosSingularidadGeo.map((def) => {
  const coincidencia = entrante.find(r => r.prioridad === def.prioridad);
  return coincidencia ? { ...def, ...coincidencia } : { ...def };
});

};


const formatearCondicion = (rango) => {
  if (rango.minValor != null && rango.maxValor != null) {
    return `${rango.minValor} <= valor <= ${rango.maxValor}`;
  }
  if (rango.minValor != null) {
    return `valor > ${rango.minValor}`;
  }
  if (rango.maxValor != null) {
    return `valor < ${rango.maxValor}`;
  }
  return "Cualquier valor";
};
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
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.table-container {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 300px;
}

.table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px 12px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

.btn-secondary {
  background: #6c757d;
}
.btn-secondary:hover {
  background: #5a6268;
}
</style>
