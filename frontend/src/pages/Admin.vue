<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Administration</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-700">Total Revenu</h3>
          <p class="text-3xl font-bold text-green-600">{{ stats.totalRevenue }} €</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-700">Taux d'occupation</h3>
          <p class="text-3xl font-bold text-blue-600">{{ stats.occupancyRate }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-700">Total Réservations</h3>
          <p class="text-3xl font-bold text-purple-600">{{ stats.totalReservations }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-700">Chambres Disponibles</h3>
          <p class="text-3xl font-bold text-orange-600">{{ stats.availableRooms }}</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Actions Rapides</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <router-link to="/rooms" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-center">
            Gérer les Chambres
          </router-link>
          <router-link to="/espace-client" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-center">
            Voir les Réservations
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const stats = ref({
  totalRevenue: 0,
  occupancyRate: '0%',
  totalReservations: 0,
  availableRooms: 0,
});

onMounted(async () => {
  try {
    const response = await api.get('/stats');
    stats.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
  }
});
</script>
