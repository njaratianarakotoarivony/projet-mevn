import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../pages/Dashboard.vue';
import Rooms from '../pages/Rooms.vue';
import Auth from '../pages/Auth.vue';
import Admin from '../pages/Admin.vue';
import About from '../pages/About.vue';
import Contact from '../pages/Contact.vue';
import EspaceClient from '../pages/EspaceClient.vue';
import ResetPassword from '../pages/ResetPassword.vue';

const routes = [
  { path: '/', component: Dashboard },
  { path: '/rooms', component: Rooms },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/espace-client', component: EspaceClient },
  { path: '/auth', component: Auth },
  { path: '/reset-password', component: ResetPassword },
  { path: '/admin', component: Admin },
  // Réservation & paiement se font désormais en overlay depuis « Chambres ».
  // On garde ces chemins pour compat (anciens liens / favoris).
  { path: '/reservations', redirect: '/espace-client' },
  { path: '/payments', redirect: '/rooms' },
  { path: '/availability', redirect: '/rooms' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
