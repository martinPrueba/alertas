<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <!-- Nombre o logo -->
      <router-link class="navbar-brand" to="/alertas">
        🚨 Sistema de Alertas
      </router-link>

      <!-- Links -->
      <ul class="navbar-links">
        <li><router-link to="/alertas">Alertas</router-link></li>
        <li><router-link to="/singularidades">Singularidades</router-link></li>
        <li><router-link to="/impacto">Impacto</router-link></li>
        <li><router-link to="/seguimiento">Seguimiento</router-link></li>
      </ul>

      <!-- Botón Configuración -->
      <!-- Botón Configuración (solo si es admin) -->
      <div v-if="esAdmin" class="config-btn">
        <button @click="abrirConfig">⚙ Configuración</button>
          <!-- el padre “escucha” el cierre del modal -->
      </div>

    </div>
  </nav>

    <!-- Renderiza el modal fuera del nav -->
    <ConfigModal :show="showModal" @close="showModal = false" />
    
</template>

<script setup>
// No necesitas lógica acá, solo es la barra de navegación

import { ref, onMounted } from "vue";
import axios from "axios";
import ConfigModal from "../components/ConfigModal.vue"; // importa el modal

const esAdmin = ref(false);
const showModal = ref(false);

const abrirConfig = () => {
  console.log("Abrir configuración...");
  showModal.value = true; // 🔥 esto abre el modal
  // Aquí podrías abrir un modal o redirigir a otra ruta
};

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/usuario/is-admin");
    // Suponiendo que la API devuelve { esAdmin: true/false }
    esAdmin.value = response.data;
    console.log("¿Es admin?:", esAdmin.value);
  } catch (error) {
    console.error("Error al verificar si es admin:", error);
  }
});


</script>

<style scoped>
.navbar {
  background: #222;         /* color de fondo oscuro */
  color: white;             /* texto blanco */
  padding: 0.5rem 1rem;     /* separación interna */
  width: 100%;              /* ocupa todo el ancho */
  position: fixed;          /* fijo arriba */
  top: 0;
  left: 0;
  z-index: 1000;            /* siempre arriba del contenido */
}

.navbar-inner {
  display: flex;
  justify-content: space-between; /* logo a la izquierda, links a la derecha */
  align-items: center;
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  text-decoration: none;
}

.navbar-links {
  list-style: none;
  display: flex;
  gap: 1rem;       /* espacio entre los links */
  margin: 0;
  padding: 0;
}

.navbar-links a {
  color: white;
  text-decoration: none;
  transition: color 0.2s ease;
}

.navbar-links a:hover {
  color: #0d6efd; /* azul al pasar el mouse */
}

.navbar-links a.router-link-active {
  font-weight: bold;
  color: #0d6efd; /* azul para el link activo */
}


.config-btn {
  margin-left: 930px; /* espacio de separación respecto a los links */
}

.config-btn button {
  background: #0d6efd;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.config-btn button:hover {
  background: #0b5ed7;
}
</style>
