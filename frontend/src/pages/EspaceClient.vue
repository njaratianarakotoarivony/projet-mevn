<template>
  <div class="page">
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <p class="hero-badge">✦ Espace Client</p>
        <h1 class="hero-title">Bonjour, {{ user?.name || 'cher client' }}</h1>
        <p class="hero-sub">Gérez votre profil et vos réservations.</p>
      </div>
    </section>

    <section class="section">
      <div class="container grid">
        <!-- PROFIL -->
        <aside class="profile-card">
          <div class="avatar">{{ initials }}</div>
          <h2 class="profile-name">{{ user?.name }}</h2>
          <p class="profile-role">{{ isAdmin ? 'Administrateur' : 'Client' }}</p>
          <ul class="profile-info">
            <li><span>Email</span><strong>{{ user?.email }}</strong></li>
            <li><span>Identifiant</span><strong class="mono">{{ shortId }}</strong></li>
          </ul>
          <router-link v-if="isAdmin" to="/admin" class="btn-outline">Tableau de bord admin</router-link>
          <button class="btn-gold" @click="logout">Se déconnecter</button>
        </aside>

        <!-- RÉSERVATIONS -->
        <div class="resa">
          <div class="resa-head">
            <h2 class="h2">Mes réservations</h2>
            <router-link to="/rooms" class="btn-gold sm">+ Nouvelle réservation</router-link>
          </div>

          <div v-if="loading" class="state">Chargement…</div>
          <div v-else-if="myReservations.length === 0" class="state">
            Vous n'avez pas encore de réservation.
            <router-link to="/rooms" class="link">Réserver une chambre →</router-link>
          </div>

          <ul v-else class="resa-list">
            <li v-for="res in myReservations" :key="res._id" class="resa-item">
              <div class="resa-main">
                <h3 class="resa-room">{{ roomName(res.roomId) }}</h3>
                <p class="resa-dates">
                  {{ formatDate(res.checkIn) }} → {{ formatDate(res.checkOut) }} · {{ res.guests }} pers.
                </p>
              </div>
              <div class="resa-right">
                <span class="resa-total">{{ res.totalPrice }} €</span>
                <span :class="['badge', res.status === 'confirmée' ? 'badge-ok' : 'badge-no']">{{ res.status }}</span>
                <button v-if="res.status === 'confirmée'" class="cancel" @click="cancel(res._id)">Annuler</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import auth from '../store';
import { reservationAPI, roomAPI } from '../services/api';

const router = useRouter();
const user = computed(() => auth.state.user);
const isAdmin = computed(() => auth.isAdmin.value);

const initials = computed(() =>
  (user.value?.name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
);
const shortId = computed(() => (user.value?.id ? `#${String(user.value.id).slice(-6)}` : '—'));

const reservations = ref([]);
const rooms = ref([]);
const loading = ref(false);

const roomMap = computed(() => Object.fromEntries(rooms.value.map((r) => [r._id, r.name])));
const roomName = (id) => roomMap.value[id] || 'Chambre';

// On n'affiche que les réservations de l'utilisateur connecté.
const myReservations = computed(() =>
  reservations.value.filter((r) => !user.value?.id || r.userId === user.value.id)
);

const formatDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

async function load() {
  loading.value = true;
  try {
    const [resv, rms] = await Promise.all([reservationAPI.getAll(), roomAPI.getAll()]);
    reservations.value = resv.data;
    rooms.value = rms.data;
  } catch (err) {
    console.error('Chargement Espace Client échoué :', err);
  } finally {
    loading.value = false;
  }
}

async function cancel(id) {
  try {
    await reservationAPI.cancel(id);
    await load();
  } catch (err) {
    console.error('Annulation échouée :', err);
  }
}

function logout() {
  auth.logout();
  router.push('/auth');
}

onMounted(load);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

.page { background: #FAF7F2; font-family: 'DM Sans', sans-serif; color: #1A1A1A; min-height: 100vh; }
.container { max-width: 1140px; margin: 0 auto; padding: 0 1.5rem; }

.hero {
  position: relative; height: 280px; display: flex; align-items: center; justify-content: center;
  background-image: url('https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1920&q=85');
  background-size: cover; background-position: center;
}
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(0,0,0,.75), rgba(0,0,0,.5)); }
.hero-content { position: relative; z-index: 2; text-align: center; }
.hero-badge { color: #E8C97E; letter-spacing: .2em; text-transform: uppercase; font-size: .8rem; margin-bottom: .75rem; }
.hero-title { font-family: 'Cormorant Garamond', serif; font-size: 2.6rem; color: #fff; }
.hero-sub { color: rgba(255,255,255,.85); margin-top: .5rem; }

.section { padding: 4rem 0; }
.grid { display: grid; grid-template-columns: 320px 1fr; gap: 2.5rem; align-items: start; }
.h2 { font-family: 'Cormorant Garamond', serif; font-size: 2rem; }

/* PROFIL */
.profile-card { background: #fff; border: 1px solid #E2DDD6; border-radius: 16px; padding: 2rem; text-align: center; box-shadow: 0 14px 36px rgba(0,0,0,.05); }
.avatar { width: 76px; height: 76px; border-radius: 50%; margin: 0 auto 1rem; background: linear-gradient(135deg, #C9A84C, #E8C97E); color: #1a1a1a; font-weight: 700; font-size: 1.6rem; display: flex; align-items: center; justify-content: center; }
.profile-name { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; }
.profile-role { color: #C9A84C; font-size: .85rem; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 1.5rem; }
.profile-info { list-style: none; text-align: left; margin-bottom: 1.5rem; }
.profile-info li { display: flex; justify-content: space-between; gap: 1rem; padding: .6rem 0; border-bottom: 1px solid #efeae1; font-size: .9rem; }
.profile-info span { color: #8a7f6a; }
.mono { font-family: monospace; }

.btn-gold { display: inline-block; width: 100%; background: #C9A84C; color: #1a1a1a; font-weight: 700; border: none; padding: .8rem 1.4rem; border-radius: 8px; cursor: pointer; text-decoration: none; transition: background .2s ease; }
.btn-gold:hover { background: #E8C97E; }
.btn-gold.sm { width: auto; padding: .55rem 1.1rem; font-size: .9rem; }
.btn-outline { display: block; width: 100%; margin-bottom: .75rem; border: 1px solid #C9A84C; color: #1a1a1a; padding: .75rem; border-radius: 8px; text-decoration: none; transition: background .2s; }
.btn-outline:hover { background: #faf3e2; }

/* RÉSERVATIONS */
.resa-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.state { background: #fff; border: 1px dashed #d8d0bf; border-radius: 14px; padding: 2.5rem; text-align: center; color: #777; }
.state .link { color: #C9A84C; text-decoration: none; display: inline-block; margin-top: .5rem; }
.resa-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
.resa-item { background: #fff; border: 1px solid #E2DDD6; border-radius: 14px; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
.resa-room { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; }
.resa-dates { color: #777; font-size: .9rem; margin-top: .2rem; }
.resa-right { display: flex; align-items: center; gap: 1rem; }
.resa-total { font-weight: 700; font-size: 1.1rem; }
.badge { padding: .25rem .7rem; border-radius: 999px; font-size: .78rem; }
.badge-ok { background: #e6f5ea; color: #1d7a3a; }
.badge-no { background: #fbe9e9; color: #b3261e; }
.cancel { background: none; border: none; color: #b3261e; cursor: pointer; text-decoration: underline; font-size: .85rem; }

@media (max-width: 820px) {
  .grid { grid-template-columns: 1fr; }
  .resa-item { flex-direction: column; align-items: flex-start; }
}
</style>
