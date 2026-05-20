<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-8">
    <h1 class="text-4xl font-bold text-white mb-8">Paiements</h1>
    
    <div class="max-w-4xl mx-auto">
      <div class="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-30 shadow-2xl">
        <h2 class="text-2xl font-bold text-white mb-6">Historique des Transactions</h2>
        <div class="space-y-4">
          <div v-for="payment in payments" :key="payment.id" class="flex justify-between items-center p-4 bg-white bg-opacity-10 rounded-xl border border-white border-opacity-10">
            <div>
              <p class="text-white font-semibold">{{ payment.description }}</p>
              <p class="text-orange-100 text-sm">{{ payment.date }}</p>
            </div>
            <div class="text-right">
              <p class="text-white font-bold">{{ payment.amount }} €</p>
              <p class="text-green-300 text-xs">Réussi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Payments',
  data() {
    return {
      payments: [
        { id: 1, description: 'Réservation Suite Royale', amount: 500, date: '2024-05-10' },
        { id: 2, description: 'Réservation Chambre Standard', amount: 100, date: '2024-05-12' },
      ]
    }
  }
}
</script>
