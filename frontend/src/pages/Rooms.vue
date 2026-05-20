<template>
  <div class="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-8">
    <h1 class="text-4xl font-bold text-white mb-8">Nos Chambres</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="room in rooms" :key="room.id" class="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl overflow-hidden border border-white border-opacity-20 shadow-2xl transition-transform hover:scale-105">
        <div class="h-48 bg-gray-300 bg-opacity-30 flex items-center justify-center">
          <span class="text-white text-lg">Image de la chambre</span>
        </div>
        <div class="p-6">
          <h3 class="text-2xl font-bold text-white">{{ room.name }}</h3>
          <p class="text-blue-100 mt-2">{{ room.type }}</p>
          <div class="flex justify-between items-center mt-4">
            <span class="text-2xl font-bold text-white">{{ room.price }} € / nuit</span>
            <button class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg border border-white border-opacity-40 transition-colors">
              Réserver
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rooms',
  data() {
    return {
      rooms: [
        { id: 1, name: 'Suite Royale', type: 'Luxe', price: 500 },
        { id: 2, name: 'Chambre Standard', type: 'Standard', price: 100 },
        { id: 3, name: 'Chambre Familiale', type: 'Confort', price: 250 },
      ]
    }
  }
}
</script>
