import api from '../services/api';

// Simple state management without Pinia
const state = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  rooms: [],
  currentRoom: null,
  reservations: [],
  currentReservation: null,
};

export const authStore = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      state.token = response.data.token;
      state.user = response.data.user;
      state.isAuthenticated = true;
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async register(name, email, password) {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      state.token = response.data.token;
      state.user = response.data.user;
      state.isAuthenticated = true;
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  logout() {
    state.token = null;
    state.user = null;
    state.isAuthenticated = false;
    localStorage.removeItem('token');
  },
  getState() {
    return { user: state.user, token: state.token, isAuthenticated: state.isAuthenticated };
  },
};

export const roomStore = {
  async fetchRooms() {
    try {
      const response = await api.get('/rooms');
      state.rooms = response.data;
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async fetchRoomById(id) {
    try {
      const response = await api.get(`/rooms/${id}`);
      state.currentRoom = response.data;
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getState() {
    return { rooms: state.rooms, currentRoom: state.currentRoom };
  },
};

export const reservationStore = {
  async fetchReservations() {
    try {
      const response = await api.get('/reservations');
      state.reservations = response.data;
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async createReservation(reservationData) {
    try {
      const response = await api.post('/reservations', reservationData);
      state.reservations.push(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getState() {
    return { reservations: state.reservations, currentReservation: state.currentReservation };
  },
};
