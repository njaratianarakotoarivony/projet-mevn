<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-8">
    <h1 class="text-4xl font-bold text-white mb-8 text-center">Paiements</h1>
    
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Payment Form -->
      <div class="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-30 shadow-2xl">
        <h2 class="text-2xl font-bold text-white mb-6">Nouveau Paiement</h2>
        
        <form @submit.prevent="processPayment" class="space-y-6">
          <!-- Amount -->
          <div>
            <label class="block text-white text-sm font-medium mb-2">Montant (€)</label>
            <input 
              v-model="paymentForm.amount" 
              type="number" 
              step="0.01"
              class="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              placeholder="0.00"
              required
            >
          </div>

          <!-- Payment Method -->
          <div>
            <label class="block text-white text-sm font-medium mb-2">Méthode de Paiement</label>
            <div class="grid grid-cols-2 gap-4">
              <button 
                type="button"
                @click="paymentForm.method = 'card'"
                :class="paymentForm.method === 'card' ? 'bg-white text-orange-600' : 'bg-white bg-opacity-20 text-white'"
                class="p-4 rounded-xl border border-white border-opacity-30 transition-all hover:bg-opacity-30"
              >
                <div class="text-center">
                  <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                  <span class="font-semibold">Carte</span>
                </div>
              </button>
              <button 
                type="button"
                @click="paymentForm.method = 'paypal'"
                :class="paymentForm.method === 'paypal' ? 'bg-white text-orange-600' : 'bg-white bg-opacity-20 text-white'"
                class="p-4 rounded-xl border border-white border-opacity-30 transition-all hover:bg-opacity-30"
              >
                <div class="text-center">
                  <svg class="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                  </svg>
                  <span class="font-semibold">PayPal</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Card Details -->
          <div v-if="paymentForm.method === 'card'" class="space-y-4">
            <div>
              <label class="block text-white text-sm font-medium mb-2">Numéro de Carte</label>
              <input 
                v-model="paymentForm.cardNumber"
                type="text" 
                maxlength="19"
                class="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                placeholder="1234 5678 9012 3456"
                @input="formatCardNumber"
              >
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-white text-sm font-medium mb-2">Expiration</label>
                <input 
                  v-model="paymentForm.expiry"
                  type="text" 
                  maxlength="5"
                  class="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  placeholder="MM/YY"
                  @input="formatExpiry"
                >
              </div>
              <div>
                <label class="block text-white text-sm font-medium mb-2">CVV</label>
                <input 
                  v-model="paymentForm.cvv"
                  type="text" 
                  maxlength="3"
                  class="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  placeholder="123"
                >
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-white text-sm font-medium mb-2">Description</label>
            <input 
              v-model="paymentForm.description" 
              type="text" 
              class="w-full bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              placeholder="Réservation Chambre..."
              required
            >
          </div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full bg-white text-orange-600 font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Traitement...' : 'Payer' }}
          </button>
        </form>
      </div>

      <!-- Transaction History -->
      <div class="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-30 shadow-2xl">
        <h2 class="text-2xl font-bold text-white mb-6">Historique des Transactions</h2>
        
        <div v-if="payments.length === 0" class="text-center text-white text-opacity-70 py-8">
          Aucune transaction récente
        </div>
        
        <div v-else class="space-y-4 max-h-96 overflow-y-auto">
          <div v-for="payment in payments" :key="payment.id" class="flex justify-between items-center p-4 bg-white bg-opacity-10 rounded-xl border border-white border-opacity-10 hover:bg-opacity-20 transition-all">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg v-if="payment.method === 'card'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                <svg v-else class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                </svg>
              </div>
              <div>
                <p class="text-white font-semibold">{{ payment.description }}</p>
                <p class="text-orange-100 text-sm">{{ formatDate(payment.date) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-white font-bold text-lg">{{ payment.amount }} €</p>
              <p :class="payment.status === 'success' ? 'text-green-300' : 'text-red-300'" class="text-xs font-medium">
                {{ payment.status === 'success' ? 'Réussi' : 'Échoué' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const loading = ref(false);
const payments = ref([
  { id: 1, description: 'Réservation Suite Royale', amount: 500, date: '2024-05-10', method: 'card', status: 'success' },
  { id: 2, description: 'Réservation Chambre Standard', amount: 100, date: '2024-05-12', method: 'paypal', status: 'success' },
]);

const paymentForm = ref({
  amount: '',
  method: 'card',
  cardNumber: '',
  expiry: '',
  cvv: '',
  description: ''
});

const formatCardNumber = () => {
  let value = paymentForm.value.cardNumber.replace(/\s/g, '').replace(/\D/g, '');
  let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
  paymentForm.value.cardNumber = formatted;
};

const formatExpiry = () => {
  let value = paymentForm.value.expiry.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2);
  }
  paymentForm.value.expiry = value;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

const processPayment = async () => {
  loading.value = true;
  try {
    // API call would go here
    // const response = await api.post('/payments', paymentForm.value);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add to payments list
    payments.value.unshift({
      id: payments.value.length + 1,
      description: paymentForm.value.description,
      amount: parseFloat(paymentForm.value.amount).toFixed(2),
      date: new Date().toISOString().split('T')[0],
      method: paymentForm.value.method,
      status: 'success'
    });
    
    // Reset form
    paymentForm.value = {
      amount: '',
      method: 'card',
      cardNumber: '',
      expiry: '',
      cvv: '',
      description: ''
    };
    
    alert('Paiement réussi!');
  } catch (error) {
    console.error('Payment error:', error);
    alert('Erreur lors du paiement');
  } finally {
    loading.value = false;
  }
};

const fetchPayments = async () => {
  try {
    // const response = await api.get('/payments');
    // payments.value = response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
  }
};

onMounted(() => {
  fetchPayments();
});
</script>
