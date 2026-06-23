import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajoute automatiquement le token JWT à chaque requête.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Déconnecte et redirige vers /auth en cas de 401 (sauf si déjà sur /auth).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/auth') {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// --- Auth ---
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  me: () => api.get('/auth/me'),
};

// --- Chambres ---
export const roomAPI = {
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`),
  // Disponibilité sur une période (correspond à GET /api/rooms/availability)
  checkAvailability: (params) => api.get('/rooms/availability', { params }),
};

// --- Réservations ---
export const reservationAPI = {
  getAll: () => api.get('/reservations'),
  getById: (id) => api.get(`/reservations/${id}`),
  create: (data) => api.post('/reservations', data),
  cancel: (id) => api.put(`/reservations/${id}/cancel`),
};

// --- Paiements (Stripe PaymentIntents) ---
export const paymentAPI = {
  // Crée un PaymentIntent et renvoie { clientSecret, paymentId }
  pay: (data) => api.post('/payment/pay', data),
  refund: (paymentIntentId) => api.post('/payment/refund', { paymentIntentId }),
};

// --- Statistiques (admin) ---
export const statsAPI = {
  get: () => api.get('/stats'),
};

// --- Réinitialisation de mot de passe ---
export const resetAPI = {
  requestReset: (email) => api.post('/reset/request-reset', { email }),
  resetPassword: (email, token, newPassword) =>
    api.post('/reset/reset-password', { email, token, newPassword }),
};

export default api;
