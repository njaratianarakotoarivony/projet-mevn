<template>
  <div class="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600 p-8">
    <h1 class="text-4xl font-bold text-white mb-8">Disponibilité</h1>
    
    <div class="max-w-2xl mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl">
      <div class="space-y-6">
        <div>
          <label class="block text-white text-sm font-medium mb-2">Date d'arrivée</label>
          <input type="date" class="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
        </div>
        <div>
          <label class="block text-white text-sm font-medium mb-2">Date de départ</label>
          <input type="date" class="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
        </div>
        <button class="w-full bg-white text-blue-600 font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all shadow-lg">
          Vérifier la disponibilité
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Availability'
}
</script>
