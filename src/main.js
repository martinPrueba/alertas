import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'   // 👈 importas el router


// 1. Crear la aplicación
const app = createApp(App)

// 2. Registrar el router como plugin
app.use(router)

// 3. Montar la aplicación
app.mount('#app')
