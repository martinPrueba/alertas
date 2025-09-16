// src/utils/loadGoogleMaps.js
export function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    // Ya cargado
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    // Script existente
    const existing = document.getElementById('gmaps-script');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps));
      existing.addEventListener('error', reject);
      return;
    }

    // Insertar script
    const script = document.createElement('script');
    script.id = 'gmaps-script';
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('No se pudo cargar Google Maps'));
    document.head.appendChild(script);
  });
}
