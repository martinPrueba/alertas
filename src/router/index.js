import { createRouter, createWebHistory } from 'vue-router'
import Alertas from '../views/Alertas.vue'
import Singularidades from '../views/Singularidades.vue'
import Impacto from '../views/Impacto.vue'
import Seguimiento from '../views/Seguimiento.vue'

const routes = [
  { path: '/', redirect: '/alertas' }, // redirige a /alertas por defecto
  { path: '/alertas', component: Alertas },
  { path: '/singularidades', component: Singularidades },
  { path: '/impacto', component: Impacto },
  { path: '/seguimiento', component: Seguimiento },
]

const router = createRouter({
  history: createWebHistory(), // usa el modo history (URLs limpias)
  routes,
})

export default router
