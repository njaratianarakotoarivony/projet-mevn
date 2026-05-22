<template>
  <div class="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600 p-8">
    <h1 class="text-4xl font-bold text-white mb-8 text-center">Disponibilité des Chambres</h1>
    
    <div class="max-w-7xl mx-auto">
      <!-- Search Form -->
      <div class="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-30 shadow-2xl mb-8">
        <h2 class="text-2xl font-bold text-white mb-6">Rechercher une Chambre</h2>
        
        <form @submit.prevent="searchAvailability" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Check-in Date -->
          <div>
            <label class="block text-white text-sm font-medium mb-2">Date d'arrivée</label>
            <input 
              v-model="searchForm.checkIn" 
              type="date" 
              class="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              :min="minDate"
              required
            >
          </div>
          
          <!-- Check-out Date -->
          <div>
            <label class="block text-white text-sm font-medium mb-2">Date de départ</label>
            <input 
              v-model="searchForm.checkOut" 
              type="date" 
              class="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              :min="searchForm.checkIn"
              required
            >
          </div>
          
          <!-- Room Type -->
          <div>
            <label class="block text-white text-sm font-medium mb-2">Type de Chambre</label>
            <select 
              v-model="searchForm.roomType" 
              class="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              <option value="" class="text-gray-800">Tous les types</option>
              <option value="standard" class="text-gray-800">Standard</option>
              <option value="deluxe" class="text-gray-800">Deluxe</option>
              <option value="suite" class="text-gray-800">Suite</option>
              <option value="royal" class="text-gray-800">Suite Royale</option>
            </select>
          </div>
          
          <!-- Guests -->
          <div>
            <label class="block text-white text-sm font-medium mb-2">Nombre de Personnes</label>
            <select 
              v-model="searchForm.guests" 
              class="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              <option value="1" class="text-gray-800">1 personne</option>
              <option value="2" class="text-gray-800">2 personnes</option>
              <option value="3" class="text-gray-800">3 personnes</option>
              <option value="4" class="text-gray-800">4 personnes</option>
            </select>
          </div>
          
          <div class="md:col-span-2 lg:col-span-4">
            <button 
              type="submit"
              :disabled="loading"
              class="w-full bg-white text-blue-600 font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Recherche...' : 'Vérifier la disponibilité' }}
            </button>
          </div>
        </form>
      </div>
      
      <!-- Available Rooms -->
      <div v-if="hasSearched" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-if="availableRooms.length === 0" class="col-span-full text-center text-white text-opacity-70 py-12">
          <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-xl">Aucune chambre disponible pour ces dates</p>
          <p class="text-sm mt-2">Essayez de modifier vos dates ou vos critères de recherche</p>
        </div>
        
        <div 
          v-for="room in availableRooms" 
          :key="room.id"
          class="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl overflow-hidden border border-white border-opacity-30 shadow-2xl hover:transform hover:scale-105 transition-all duration-300"
        >
          <!-- Room Image -->
          <div class="h-48 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
            <svg class="w-20 h-20 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          
          <!-- Room Details -->
          <div class="p-6">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-xl font-bold text-white">{{ room.name }}</h3>
              <span class="bg-white bg-opacity-30 text-white text-xs px-3 py-1 rounded-full">{{ room.type }}</span>
            </div>
            
            <p class="text-blue-100 text-sm mb-4">{{ room.description }}</p>
            
            <!-- Amenities -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="amenity in room.amenities" :key="amenity" class="bg-white bg-opacity-10 text-white text-xs px-2 py-1 rounded">
                {{ amenity }}
              </span>
            </div>
            
            <!-- Capacity -->
            <div class="flex items-center text-blue-100 text-sm mb-4">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {{ room.capacity }} personnes max
            </div>
            
            <!-- Price and Book Button -->
            <div class="flex justify-between items-center">
              <div>
                <p class="text-white font-bold text-2xl">{{ room.price }} €</p>
                <p class="text-blue-200 text-xs">par nuit</p>
              </div>
              <button 
                @click="bookRoom(room)"
                class="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-opacity-90 transition-all shadow-lg"
              >
                Réserver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';

const loading = ref(false);
const hasSearched = ref(false);
const availableRooms = ref([]);

const searchForm = ref({
  checkIn: '',
  checkOut: '',
  roomType: '',
  guests: '2'
});

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const searchAvailability = async () => {
  loading.value = true;
  hasSearched.value = true;
  
  try {
    // API call would go here
    // const response = await api.get('/rooms/availability', { params: searchForm.value });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock data
    const allRooms = [
      {
        id: 1,
        name: 'Chambre Standard',
        type: 'standard',
        description: 'Chambre confortable avec vue sur le jardin',
        price: 89,
        capacity: 2,
        amenities: ['WiFi', 'TV', 'Climatisation']
      },
      {
        id: 2,
        name: 'Chambre Deluxe',
        type: 'deluxe',
        description: 'Chambre spacieuse avec balcon et vue mer',
        price: 149,
        capacity: 2,
        amenities: ['WiFi', 'TV', 'Climatisation', 'Balcon', 'Mini-bar']
      },
      {
        id: 3,
        name: 'Suite Executive',
        type: 'suite',
        description: 'Suite luxueuse avec salon séparé',
        price: 249,
        capacity: 3,
        amenities: ['WiFi', 'TV', 'Climatisation', 'Balcon', 'Mini-bar', 'Salon', 'Baignoire']
      },
      {
        id: 4,
        name: 'Suite Royale',
        type: 'royal',
        description: 'Suite présidentielle avec tous les confort',
        price: 499,
        capacity: 4,
        amenities: ['WiFi', 'TV', 'Climatisation', 'Balcon', 'Mini-bar', 'Salon', 'Baignoire', 'Vue panoramique', 'Room service']
      },
      {
        id: 5,
        name: 'Chambre Familiale',
        type: 'standard',
        description: 'Idéale pour les familles avec enfants',
        price: 129,
        capacity: 4,
        amenities: ['WiFi', 'TV', 'Climatisation', 'Lit enfant']
      },
      {
        id: 6,
        name: 'Suite Romantique',
        type: 'suite',
        description: 'Parfaite pour un séjour en amoureux',
        price: 199,
        capacity: 2,
        amenities: ['WiFi', 'TV', 'Climatisation', 'Balcon', 'Baignoire spa', 'Champagne']
      }
    ];
    
    // Filter by room type if selected
    let filteredRooms = allRooms;
    if (searchForm.value.roomType) {
      filteredRooms = filteredRooms.filter(room => room.type === searchForm.value.roomType);
    }
    
    // Filter by capacity
    filteredRooms = filteredRooms.filter(room => room.capacity >= parseInt(searchForm.value.guests));
    
    availableRooms.value = filteredRooms;
  } catch (error) {
    console.error('Error searching availability:', error);
    alert('Erreur lors de la recherche');
  } finally {
    loading.value = false;
  }
};

const bookRoom = (room) => {
  alert(`Réservation de ${room.name} du ${searchForm.value.checkIn} au ${searchForm.value.checkOut}`);
  // Navigate to payment or reservation page
};

onMounted(() => {
  // Set default dates (today and tomorrow)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  searchForm.value.checkIn = today.toISOString().split('T')[0];
  searchForm.value.checkOut = tomorrow.toISOString().split('T')[0];
});
</script>
