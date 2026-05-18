import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/',             redirect: '/dashboard' },
  { path: '/auth',         component: () => import('../pages/Auth.vue') },
  { path: '/dashboard',    component: () => import('../pages/Dashboard.vue') },
  { path: '/rooms',        component: () => import('../pages/Rooms.vue') },
  { path: '/reservations', component: () => import('../pages/Reservations.vue') },
  { path: '/payments',     component: () => import('../pages/Payments.vue') },
  { path: '/availability', component: () => import('../pages/Availability.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
