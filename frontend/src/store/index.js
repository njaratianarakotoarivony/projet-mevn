import { reactive, computed } from 'vue';
import { authAPI } from '../services/api';

// État global réactif partagé par toute l'application.
const state = reactive({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
});

export const auth = {
  state,
  isAuthenticated: computed(() => !!state.token),
  isAdmin: computed(() => state.user?.role === 'admin'),

  async login(email, password) {
    const { data } = await authAPI.login(email, password);
    this._persist(data);
    return data;
  },

  async register(name, email, password) {
    const { data } = await authAPI.register(name, email, password);
    this._persist(data);
    return data;
  },

  logout() {
    state.user = null;
    state.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  _persist(data) {
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  },
};

export default auth;
