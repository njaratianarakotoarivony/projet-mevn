<template>
  <div class="auth">
    <!-- Panneau visuel (gauche) -->
    <aside class="auth-visual">
      <div class="auth-visual-overlay"></div>
      <div class="auth-visual-content">
        <router-link to="/" class="brand">✦ Hôtel Luxe</router-link>
        <h2 class="visual-title">L'art de<br />vivre bien</h2>
        <p class="visual-sub">
          Connectez-vous pour réserver votre séjour et accéder à votre espace personnel.
        </p>
      </div>
    </aside>

    <!-- Panneau formulaire (droite) -->
    <section class="auth-form-panel">
      <div class="auth-card">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h1 class="auth-title">{{ title }}</h1>
        <p class="auth-hint">{{ hint }}</p>

        <!-- Connexion / Inscription -->
        <form v-if="mode !== 'forgot'" @submit.prevent="handleSubmit" class="form">
          <div v-if="mode === 'register'" class="field">
            <label>Nom complet</label>
            <input v-model="form.name" type="text" placeholder="Jean Dupont" required />
          </div>
          <div class="field">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="vous@email.com" required />
          </div>
          <div class="field">
            <div class="field-head">
              <label>Mot de passe</label>
              <a v-if="mode === 'login'" href="#" class="forgot-link" @click.prevent="goForgot">
                Mot de passe oublié ?
              </a>
            </div>
            <input v-model="form.password" type="password" placeholder="••••••••" required minlength="8" />
          </div>

          <p v-if="error" class="msg error">{{ error }}</p>
          <p v-if="success" class="msg success">{{ success }}</p>

          <button type="submit" :disabled="loading" class="btn-gold">
            {{ loading ? 'Veuillez patienter…' : (mode === 'login' ? 'Se connecter' : "S'inscrire") }}
          </button>
        </form>

        <!-- Mot de passe oublié -->
        <form v-else @submit.prevent="handleForgot" class="form">
          <div class="field">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="vous@email.com" required />
          </div>

          <p v-if="error" class="msg error">{{ error }}</p>
          <p v-if="success" class="msg success">{{ success }}</p>

          <button type="submit" :disabled="loading" class="btn-gold">
            {{ loading ? 'Envoi…' : 'Envoyer le lien de réinitialisation' }}
          </button>
        </form>

        <p class="switch">
          <template v-if="mode === 'login'">
            Pas encore de compte ?
            <a href="#" @click.prevent="switchMode">S'inscrire</a>
          </template>
          <template v-else-if="mode === 'register'">
            Déjà un compte ?
            <a href="#" @click.prevent="switchMode">Se connecter</a>
          </template>
          <template v-else>
            <a href="#" @click.prevent="backToLogin">← Retour à la connexion</a>
          </template>
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import auth from '../store';
import { resetAPI } from '../services/api';

const router = useRouter();
const mode = ref('login'); // 'login' | 'register' | 'forgot'
const loading = ref(false);
const error = ref('');
const success = ref('');
const form = ref({ name: '', email: '', password: '' });

const eyebrow = computed(() =>
  mode.value === 'login' ? 'Bon retour' : mode.value === 'register' ? 'Bienvenue' : 'Récupération'
);
const title = computed(() =>
  mode.value === 'login' ? 'Connexion' : mode.value === 'register' ? 'Créer un compte' : 'Mot de passe oublié'
);
const hint = computed(() =>
  mode.value === 'login'
    ? 'Accédez à votre espace client.'
    : mode.value === 'register'
      ? 'Quelques secondes suffisent.'
      : 'Saisissez votre email pour recevoir un lien de réinitialisation.'
);

function resetMessages() {
  error.value = '';
  success.value = '';
}

function switchMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login';
  resetMessages();
}

function goForgot() {
  mode.value = 'forgot';
  resetMessages();
}

function backToLogin() {
  mode.value = 'login';
  resetMessages();
}

async function handleForgot() {
  loading.value = true;
  resetMessages();
  try {
    const { data } = await resetAPI.requestReset(form.value.email);
    success.value = data.message || 'Si un compte existe, un lien a été envoyé.';
  } catch (err) {
    error.value = err.response
      ? err.response.data?.message || 'Une erreur est survenue.'
      : 'Impossible de joindre le serveur (port 3000).';
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  loading.value = true;
  error.value = '';
  success.value = '';
  try {
    const data =
      mode.value === 'login'
        ? await auth.login(form.value.email, form.value.password)
        : await auth.register(form.value.name, form.value.email, form.value.password);

    success.value = `Bienvenue ${data.user.name} ! Redirection...`;
    // Laisse le message s'afficher brièvement avant de rediriger.
    setTimeout(() => router.push(auth.isAdmin.value ? '/admin' : '/'), 800);
  } catch (err) {
    if (err.response) {
      error.value = err.response.data?.message || 'Identifiants invalides.';
    } else {
      error.value =
        "Impossible de joindre le serveur. Vérifie que le backend tourne (port 3000).";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

.auth {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: 'DM Sans', sans-serif;
  color: #1A1A1A;
  background: #FAF7F2;
}

/* ===== PANNEAU VISUEL ===== */
.auth-visual {
  position: relative;
  display: flex;
  align-items: flex-end;
  background-image: url('https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1400&q=85');
  background-size: cover;
  background-position: center;
}
.auth-visual-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, rgba(13,13,13,.55) 0%, rgba(13,13,13,.82) 100%);
}
.auth-visual-content { position: relative; z-index: 2; padding: 3.5rem; }
.brand {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem; font-weight: 700;
  color: #fff; text-decoration: none; letter-spacing: .02em;
}
.visual-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 3rem; line-height: 1.05; color: #fff; margin: 1.5rem 0 1rem;
}
.visual-sub { color: rgba(255,255,255,.8); max-width: 360px; font-weight: 300; line-height: 1.7; }

/* ===== PANNEAU FORMULAIRE ===== */
.auth-form-panel {
  display: flex; align-items: center; justify-content: center;
  padding: 2.5rem;
}
.auth-card { width: 100%; max-width: 400px; }

.eyebrow { color: #C9A84C; text-transform: uppercase; letter-spacing: .18em; font-size: .75rem; font-weight: 600; }
.auth-title { font-family: 'Cormorant Garamond', serif; font-size: 2.6rem; line-height: 1.1; margin: .35rem 0; }
.auth-hint { color: #777; margin-bottom: 2rem; }

.form { display: flex; flex-direction: column; gap: 1.1rem; }
.field { display: flex; flex-direction: column; gap: .4rem; }
.field label { font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: #8a7f6a; }
.field-head { display: flex; align-items: baseline; justify-content: space-between; }
.forgot-link { font-size: .78rem; color: #C9A84C; text-decoration: none; font-weight: 500; }
.forgot-link:hover { text-decoration: underline; }
.field input {
  border: 1px solid #d8d0bf; border-radius: 9px; padding: .8rem 1rem;
  font-size: .98rem; font-family: 'DM Sans', sans-serif; color: #2b2b2b; background: #fff;
  transition: border-color .2s ease, box-shadow .2s ease;
}
.field input:focus { outline: none; border-color: #C9A84C; box-shadow: 0 0 0 3px rgba(201,168,76,.15); }

.msg { font-size: .88rem; margin: 0; }
.msg.error { color: #b00020; }
.msg.success { color: #1d7a3a; }

.btn-gold {
  margin-top: .5rem;
  background: #C9A84C; color: #1a1a1a; font-weight: 700;
  border: none; padding: .95rem; border-radius: 9px; cursor: pointer;
  font-size: 1rem; transition: background .2s ease;
}
.btn-gold:hover:not(:disabled) { background: #E8C97E; }
.btn-gold:disabled { opacity: .55; cursor: not-allowed; }

.switch { text-align: center; margin-top: 2rem; color: #777; font-size: .92rem; }
.switch a { color: #C9A84C; font-weight: 600; text-decoration: none; }
.switch a:hover { text-decoration: underline; }

/* ===== RESPONSIVE ===== */
@media (max-width: 860px) {
  .auth { grid-template-columns: 1fr; }
  .auth-visual { display: none; }
  .auth-form-panel { min-height: 100vh; }
}
</style>
