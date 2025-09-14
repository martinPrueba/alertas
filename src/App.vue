<script setup>
import Header from './components/Header.vue'
</script>

<template>
  <!-- Header fijo arriba -->
  <header class="header">
    <Header />
  </header>

  <!-- Contenido debajo -->
  <main class="contenido">
    <router-view />
  </main>
</template>

<style>
/* Header fijo arriba */
.header {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

/* Contenedor principal debajo del header */
.contenido {
  margin: 0;
  padding: 0;
  width: 100%;
  padding-top: 26px; /* Ajusta según la altura real del header */
  box-sizing: border-box;
  min-height: 100vh;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden; /* 🔥 evita el scroll horizontal */
}


</style>
