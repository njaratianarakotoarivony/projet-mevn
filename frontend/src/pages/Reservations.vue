<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
    <h1 class="text-4xl font-bold text-white mb-8">Mes Réservations</h1>
    
    <div class="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl border border-white border-opacity-20 shadow-2xl overflow-hidden">
      <table class="w-full text-left text-white">
        <thead class="bg-white bg-opacity-10">
          <tr>
            <th class="p-4">ID</th>
            <th class="p-4">Chambre</th>
            <th class="p-4">Date</th>
            <th class="p-4">Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in reservations" :key="res.id" class="border-t border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition-colors">
            <td class="p-4">#{{ res.id }}</td>
            <td class="p-4">{{ res.roomName }}</td>
            <td class="p-4">{{ res.date }}</td>
            <td class="p-4">
              <span class="px-3 py-1 rounded-full bg-green-400 bg-opacity-30 text-green-100 border border-green-400 border-opacity-50">
                {{ res.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reservations',
  data() {
    return {
      reservations: [
        { id: 101, roomName: 'Suite Royale', date: '2024-06-15', status: 'Confirmée' },
        { id: 102, roomName: 'Chambre Standard', date: '2024-06-20', status: 'En attente' },
      ]
    }
  }
}
</script>
