<template>
  <div class="layout">
    <!-- Columna izquierda: filtros -->
    <aside class="filtros">
      <AlertFilter />
    </aside>

    <!-- Columna derecha: mapa + tabla -->
    <main class="contenido">
      <!-- Mapa ocupa el espacio grande -->
      <section class="mapa">
        <GoogleMap />
      </section>

      <!-- Tabla abajo -->
      <section class="tabla">
        <ReportTable />
      </section>
    </main>
  </div>
</template>

<script setup>
import AlertFilter from "../components/alertas/AlertFilter.vue";
import GoogleMap from "../components/alertas/GoogleMap.vue";
import ReportTable from "../components/alertas/ReportTable.vue";
</script>

<style scoped>
/* Contenedor general: ocupa toda la pantalla */
.layout {
  display: flex;
  height: 100vh;   /* 100% alto de la ventana */
  width: 100vw;    /* 100% ancho de la ventana */
  margin: 0;
  padding: 0;
}

/* Aside (columna izquierda) */
.filtros {
  width: 250px;         /* ancho fijo */
  background: #f5f5f5;  /* color de fondo */
  border-right: 1px solid #ccc;
  padding: 40px;        /* espacio interno */
  box-sizing: border-box;
}

/* Columna derecha */
.contenido {
  flex: 1;                  /* ocupa todo el espacio sobrante */
  display: flex;
  flex-direction: column;   /* organiza mapa arriba y tabla abajo */
  margin: 0;          /* sin margen externo */
}

/* Sección mapa: ocupa todo lo posible */
.mapa {
  flex: 1;
  padding: 1px;
  box-sizing: border-box;
}

/* Sección tabla: altura fija abajo */
.tabla {
  max-height: 300px;
  overflow-y: auto;
  padding: 80px;
  box-sizing: border-box;
}



</style>
