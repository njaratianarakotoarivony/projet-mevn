import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../pages/Dashboard.vue';
import Rooms from '../pages/Rooms.vue';
import Reservations from '../pages/Reservations.vue';
import Payments from '../pages/Payments.vue';
import Availability from '../pages/Availability.vue';
import Auth from '../pages/Auth.vue';
import Admin from '../pages/Admin.vue';

const routes = [
  { path: '/', component: Dashboard },
  { path: '/rooms', component: Rooms },
  { path: '/reservations', component: Reservations },
  { path: '/payments', component: Payments },
  { path: '/availability', component: Availability },
  { path: '/auth', component: Auth },
  { path: '/admin', component: Admin },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
