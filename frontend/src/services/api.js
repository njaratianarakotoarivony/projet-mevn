import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Payment API calls
export const paymentAPI = {
  // Create a new payment
  createPayment: (paymentData) => api.post('/payments', paymentData),
  
  // Get all payments for a user
  getPayments: () => api.get('/payments'),
  
  // Get payment by ID
  getPaymentById: (paymentId) => api.get(`/payments/${paymentId}`),
  
  // Process Stripe payment
  processStripePayment: (paymentData) => api.post('/payments/stripe', paymentData),
  
  // Process PayPal payment
  processPayPalPayment: (paymentData) => api.post('/payments/paypal', paymentData),
  
  // Refund payment
  refundPayment: (paymentId) => api.post(`/payments/${paymentId}/refund`),
};

// Availability API calls
export const availabilityAPI = {
  // Check room availability
  checkAvailability: (searchParams) => api.get('/rooms/availability', { params: searchParams }),
  
  // Get available rooms for specific dates
  getAvailableRooms: (checkIn, checkOut) => api.get(`/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`),
  
  // Get room details
  getRoomDetails: (roomId) => api.get(`/rooms/${roomId}`),
  
  // Get all room types
  getRoomTypes: () => api.get('/rooms/types'),
  
  // Check specific room availability
  checkRoomAvailability: (roomId, checkIn, checkOut) => 
    api.get(`/rooms/${roomId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`),
};

export default api;
