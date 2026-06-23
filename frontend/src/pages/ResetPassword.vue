<template>
  <div class="reset">
    <div class="reset-card">
      <router-link to="/" class="brand">✦ Hôtel Luxe</router-link>
      <p class="eyebrow">Sécurité</p>
      <h1 class="title">Nouveau mot de passe</h1>

      <!-- Lien invalide -->
      <p v-if="!token || !email" class="msg error">
        Lien invalide ou incomplet. Refaites une demande depuis « Mot de passe oublié ? ».
      </p>

      <!-- Succès -->
      <div v-else-if="done" class="success-block">
        <div class="big-icon">✅</div>
        <p class="msg success">Mot de passe mis à jour avec succès.</p>
        <router-link to="/auth" class="btn-gold">Se connecter</router-link>
      </div>

      <!-- Formulaire -->
      <form v-else @submit.prevent="submit" class="form">
        <p class="hint">Pour le compte <strong>{{ email }}</strong></p>
        <div class="field">
          <label>Nouveau mot de passe</label>
          <input v-model="password" type="password" placeholder="••••••••" required minlength="8" />
        </div>
        <div class="field">
          <label>Confirmer le mot de passe</label>
          <input v-model="confirm" type="password" placeholder="••••••••" required minlength="8" />
        </div>

        <p v-if="error" class="msg error">{{ error }}</p>

        <button type="submit" :disabled="loading" class="btn-gold">
          {{ loading ? 'Mise à jour…' : 'Réinitialiser le mot de passe' }}
        </button>
      </form>

      <p class="switch"><router-link to="/auth">← Retour à la connexion</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { resetAPI } from '../services/api';

const route = useRoute();
const token = route.query.token || '';
const email = route.query.email || '';

const password = ref('');
const confirm = ref('');
const loading = ref(false);
const error = ref('');
const done = ref(false);

async function submit() {
  error.value = '';
  if (password.value.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caractères.';
    return;
  }
  if (password.value !== confirm.value) {
    error.value = 'Les mots de passe ne correspondent pas.';
    return;
  }
  loading.value = true;
  try {
    await resetAPI.resetPassword(email, token, password.value);
    done.value = true;
  } catch (err) {
    error.value = err.response
      ? err.response.data?.message || 'Échec de la réinitialisation.'
      : 'Impossible de joindre le serveur (port 3000).';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

.reset {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  padding: 2rem;
  font-family: 'DM Sans', sans-serif; color: #1A1A1A;
  background: #FAF7F2;
}
.reset-card {
  width: 100%; max-width: 420px;
  background: #fff; border: 1px solid #E2DDD6; border-radius: 16px;
  padding: 2.5rem; box-shadow: 0 18px 45px rgba(0,0,0,.06);
}
.brand { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: #1a1a1a; text-decoration: none; }
.eyebrow { color: #C9A84C; text-transform: uppercase; letter-spacing: .18em; font-size: .75rem; font-weight: 600; margin-top: 1.5rem; }
.title { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; margin: .3rem 0 1.25rem; }
.hint { color: #777; margin-bottom: 1rem; font-size: .92rem; }

.form { display: flex; flex-direction: column; gap: 1.1rem; }
.field { display: flex; flex-direction: column; gap: .4rem; }
.field label { font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: #8a7f6a; }
.field input {
  border: 1px solid #d8d0bf; border-radius: 9px; padding: .8rem 1rem;
  font-size: .98rem; font-family: 'DM Sans', sans-serif; color: #2b2b2b; background: #fff;
  transition: border-color .2s ease, box-shadow .2s ease;
}
.field input:focus { outline: none; border-color: #C9A84C; box-shadow: 0 0 0 3px rgba(201,168,76,.15); }

.msg { font-size: .9rem; margin: 0; }
.msg.error { color: #b00020; }
.msg.success { color: #1d7a3a; }
.success-block { text-align: center; padding: 1rem 0; }
.big-icon { font-size: 2.6rem; margin-bottom: .5rem; }

.btn-gold {
  margin-top: .5rem; display: inline-block;
  background: #C9A84C; color: #1a1a1a; font-weight: 700;
  border: none; padding: .9rem 1.4rem; border-radius: 9px; cursor: pointer;
  font-size: 1rem; text-decoration: none; transition: background .2s ease;
}
.btn-gold:hover:not(:disabled) { background: #E8C97E; }
.btn-gold:disabled { opacity: .55; cursor: not-allowed; }

.switch { text-align: center; margin-top: 1.75rem; font-size: .9rem; }
.switch a { color: #C9A84C; text-decoration: none; }
.switch a:hover { text-decoration: underline; }
</style>
