<template>
  <transition name="overlay">
    <div class="overlay" @click.self="close">
      <div class="modal">
        <button class="modal-close" @click="close" aria-label="Fermer">✕</button>

        <!-- Indicateur d'étapes -->
        <div class="steps">
          <span :class="['step', step === 'reserve' && 'active', stepDone('reserve') && 'done']">1 · Réservation</span>
          <span class="step-sep"></span>
          <span :class="['step', step === 'pay' && 'active', stepDone('pay') && 'done']">2 · Paiement</span>
          <span class="step-sep"></span>
          <span :class="['step', step === 'done' && 'active']">3 · Confirmation</span>
        </div>

        <!-- Non connecté -->
        <div v-if="!isAuth" class="body center">
          <div class="big-icon">🔒</div>
          <h3 class="title">Connectez-vous pour réserver</h3>
          <p class="muted">Vous devez être connecté pour finaliser une réservation.</p>
          <router-link to="/auth" class="btn-gold" @click="close">Se connecter / S'inscrire</router-link>
        </div>

        <!-- ÉTAPE 1 : Réservation -->
        <div v-else-if="step === 'reserve'" class="body">
          <p class="eyebrow">{{ room.type }}</p>
          <h3 class="title">{{ room.name }}</h3>
          <p class="muted">{{ room.capacity }} pers. max · {{ room.price }} € / nuit</p>

          <div class="fields">
            <div class="field">
              <label>Arrivée</label>
              <input v-model="booking.checkIn" type="date" :min="minDate" />
            </div>
            <div class="field">
              <label>Départ</label>
              <input v-model="booking.checkOut" type="date" :min="booking.checkIn || minDate" />
            </div>
            <div class="field">
              <label>Personnes</label>
              <input v-model.number="booking.guests" type="number" min="1" :max="room.capacity" />
            </div>
          </div>

          <div class="recap">
            <span>{{ room.price }} € × {{ nights }} nuit(s)</span>
            <strong>{{ total }} €</strong>
          </div>

          <p v-if="error" class="error">{{ error }}</p>

          <button class="btn-gold full" :disabled="loading || nights < 1" @click="reserve">
            {{ loading ? 'Réservation…' : `Confirmer · ${total} €` }}
          </button>
        </div>

        <!-- ÉTAPE 2 : Paiement -->
        <div v-else-if="step === 'pay'" class="body">
          <p class="eyebrow">Paiement sécurisé</p>
          <h3 class="title">{{ total }} €</h3>
          <p class="muted">{{ room.name }} · {{ formatDate(booking.checkIn) }} → {{ formatDate(booking.checkOut) }}</p>

          <div class="fields one">
            <div class="field">
              <label>Numéro de carte</label>
              <input v-model="card.number" type="text" maxlength="19" placeholder="4242 4242 4242 4242" />
            </div>
            <div class="field-row">
              <div class="field">
                <label>Expiration</label>
                <input v-model="card.expiry" type="text" maxlength="5" placeholder="MM/AA" />
              </div>
              <div class="field">
                <label>CVV</label>
                <input v-model="card.cvv" type="text" maxlength="4" placeholder="123" />
              </div>
            </div>
          </div>

          <p v-if="error" class="error">{{ error }}</p>

          <div class="actions">
            <button class="btn-ghost" @click="step = 'reserve'">← Retour</button>
            <button class="btn-gold full" :disabled="loading" @click="pay">
              {{ loading ? 'Traitement…' : `Payer ${total} €` }}
            </button>
          </div>
        </div>

        <!-- ÉTAPE 3 : Succès -->
        <div v-else class="body center">
          <div class="big-icon">✅</div>
          <h3 class="title">Réservation confirmée</h3>
          <p class="muted">Merci ! Votre chambre « {{ room.name }} » est réservée et payée.</p>
          <div class="actions center">
            <router-link to="/espace-client" class="btn-ghost" @click="close">Mes réservations</router-link>
            <button class="btn-gold" @click="close">Terminer</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue';
import auth from '../store';
import { reservationAPI, paymentAPI } from '../services/api';

const props = defineProps({
  room: { type: Object, required: true },
  prefill: { type: Object, default: () => ({}) },
});
const emit = defineEmits(['close', 'success']);

const isAuth = computed(() => auth.isAuthenticated.value);
const minDate = computed(() => new Date().toISOString().split('T')[0]);

const step = ref('reserve');
const loading = ref(false);
const error = ref('');
const reservationId = ref(null);

const booking = ref({
  checkIn: props.prefill.checkIn || '',
  checkOut: props.prefill.checkOut || '',
  guests: Number(props.prefill.guests) || 2,
});
const card = ref({ number: '', expiry: '', cvv: '' });

const nights = computed(() => {
  if (!booking.value.checkIn || !booking.value.checkOut) return 0;
  const ms = new Date(booking.value.checkOut) - new Date(booking.value.checkIn);
  return Math.max(0, Math.ceil(ms / 86400000));
});
const total = computed(() => props.room.price * Math.max(1, nights.value));

const order = { reserve: 0, pay: 1, done: 2 };
const stepDone = (s) => order[step.value] > order[s];

const formatDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

async function reserve() {
  error.value = '';
  if (nights.value < 1) { error.value = 'La date de départ doit suivre la date d’arrivée.'; return; }
  if (booking.value.guests > props.room.capacity) { error.value = 'Trop de personnes pour cette chambre.'; return; }
  loading.value = true;
  try {
    const { data } = await reservationAPI.create({
      roomId: props.room._id,
      checkIn: booking.value.checkIn,
      checkOut: booking.value.checkOut,
      guests: booking.value.guests,
    });
    reservationId.value = data._id;
    step.value = 'pay';
  } catch (err) {
    error.value = err.response?.data?.message || 'Échec de la réservation.';
  } finally {
    loading.value = false;
  }
}

async function pay() {
  error.value = '';
  loading.value = true;
  try {
    await paymentAPI.pay({
      amount: Math.round(total.value * 100),
      currency: 'eur',
      reservationId: reservationId.value,
      description: `Réservation ${props.room.name}`,
    });
    step.value = 'done';
    emit('success');
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      "Le paiement a échoué. Vérifie la configuration Stripe du backend.";
  } finally {
    loading.value = false;
  }
}

function close() {
  emit('close');
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

.overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(10, 10, 10, 0.7);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
}
.modal {
  position: relative;
  width: 100%; max-width: 460px;
  background: #FAF7F2;
  border-radius: 18px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  font-family: 'DM Sans', sans-serif;
  color: #1A1A1A;
  overflow: hidden;
  animation: pop 0.25s ease;
}
@keyframes pop { from { transform: scale(0.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }

.modal-close {
  position: absolute; top: 1rem; right: 1rem; z-index: 2;
  background: rgba(0,0,0,0.06); border: none; cursor: pointer;
  width: 34px; height: 34px; border-radius: 50%;
  font-size: 0.9rem; color: #555; transition: background 0.2s;
}
.modal-close:hover { background: rgba(0,0,0,0.12); }

/* Étapes */
.steps {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  background: #0D0D0D; padding: 1rem; font-size: 0.72rem; letter-spacing: 0.04em;
}
.step { color: rgba(255,255,255,0.4); text-transform: uppercase; }
.step.active { color: #E8C97E; font-weight: 600; }
.step.done { color: rgba(232,201,126,0.7); }
.step-sep { width: 18px; height: 1px; background: rgba(255,255,255,0.2); }

.body { padding: 2rem; }
.body.center { text-align: center; }
.eyebrow { color: #C9A84C; text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.72rem; font-weight: 600; }
.title { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; margin: 0.2rem 0; }
.muted { color: #777; font-size: 0.92rem; margin-bottom: 1.25rem; }

.fields { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; margin-bottom: 1.25rem; }
.fields.one { grid-template-columns: 1fr; }
.fields .field:first-child { grid-column: 1 / -1; }
.fields.one .field:first-child { grid-column: auto; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: #8a7f6a; }
.field input {
  border: 1px solid #d8d0bf; border-radius: 8px; padding: 0.6rem 0.75rem;
  font-size: 0.95rem; font-family: 'DM Sans', sans-serif; color: #2b2b2b; background: #fff;
}
.field input:focus { outline: none; border-color: #C9A84C; }

.recap {
  display: flex; justify-content: space-between; align-items: center;
  border-top: 1px solid #e5dfd3; padding-top: 1rem; margin-bottom: 1.25rem;
}
.recap strong { font-size: 1.3rem; }

.error { color: #b00020; font-size: 0.88rem; margin-bottom: 1rem; }

.big-icon { font-size: 3rem; margin-bottom: 0.5rem; }

.btn-gold {
  display: inline-block; background: #C9A84C; color: #1a1a1a; font-weight: 700;
  border: none; padding: 0.85rem 1.6rem; border-radius: 9px; cursor: pointer;
  text-decoration: none; transition: background 0.2s ease;
}
.btn-gold:hover:not(:disabled) { background: #E8C97E; }
.btn-gold:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-gold.full { width: 100%; }
.btn-ghost {
  background: none; border: 1px solid #cfc6b3; color: #5c5443;
  padding: 0.85rem 1.2rem; border-radius: 9px; cursor: pointer; text-decoration: none;
  transition: background 0.2s ease;
}
.btn-ghost:hover { background: #efe9da; }

.actions { display: flex; gap: 0.75rem; align-items: center; }
.actions.center { justify-content: center; margin-top: 1.25rem; }
.actions .btn-gold.full { flex: 1; }

/* Transition overlay */
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.2s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
</style>
