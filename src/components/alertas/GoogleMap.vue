<template>
  <div class="map-container" ref="mapRef"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { loadGoogleMaps } from '@/utils/loadGoogleMaps';

const mapRef = ref(null);
let map = null;

onMounted(async () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('⚠️ Falta VITE_GOOGLE_MAPS_API_KEY en tu .env.local');
    return;
  }

  try {
    const maps = await loadGoogleMaps(apiKey);

    // IMPORTANTE: el contenedor debe tener alto explícito
    map = new maps.Map(mapRef.value, {
      center: { lat: -33.4489, lng: -70.6693 }, // Ej: Santiago
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Ejemplo: agrega un marcador cuando el mapa termine de cargar
    maps.event.addListenerOnce(map, 'idle', () => {
      new maps.Marker({
        position: { lat: -33.4489, lng: -70.6693 },
        map,
        title: 'Ejemplo',
      });
    });
  } catch (err) {
    console.error('❌ Error cargando Google Maps:', err);
  }
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;    /* dale altura explícita (ajusta a tu layout) */
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}
</style>
