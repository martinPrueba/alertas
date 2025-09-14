<template>
    <h5>Filtros</h5>
    <form @submit.prevent="buscar">
      <div class="mb-3">
        <label class="form-label">Proceso</label>
        <input v-model="filtros.proceso" type="text" class="form-control"/>
      </div>
      <div class="mb-3">
        <label class="form-label">Activo</label>
        <input v-model="filtros.activo" type="text" class="form-control"/>
      </div>
      <div class="mb-3">
        <label class="form-label">Fecha Inicio</label>
        <input v-model="filtros.initDate" type="datetime-local" class="form-control"/>
      </div>
      <div class="mb-3">
        <label class="form-label">Fecha Fin</label>
        <input v-model="filtros.endDate" type="datetime-local" class="form-control"/>
      </div>
      <button class="btn btn-primary w-100">Buscar</button>
    </form>
</template>

<script setup>
import { reactive } from "vue";
import { onMounted } from "vue"
import axios from "axios"

const filtros = reactive({
  proceso: "",
  activo: "",
  initDate: "",
  endDate: ""
});

const buscar = () => {
  console.log("Buscando con filtros:", filtros);
  // Aquí después vas a emitir al padre o hacer fetch a tu backend
};



onMounted(async () => {
  try {
    const resp = await axios.get("http://localhost:8080/api/alertas/get-all-alerts")
    console.log("Datos cargados:", resp.data)
  } catch (err) {
    console.error("Error al llamar la API:", err)
  }
})

</script>

<style scoped>
aside {
  width: 250px;          /* ancho fijo */
  background: red;
  margin-left: 0;   /* asegura que no se separe */


}

</style>
