<template>
  <div class="page">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <p class="hero-badge">✦ Nous Contacter</p>
        <h1 class="hero-title">Contact</h1>
        <p class="hero-sub">Notre équipe est à votre écoute, 7j/7.</p>
      </div>
    </section>

    <section class="section">
      <div class="container grid">
        <!-- INFOS -->
        <div class="infos">
          <p class="eyebrow">Coordonnées</p>
          <h2 class="h2">Parlons de votre séjour</h2>
          <p class="lead">
            Une question, une demande particulière ou l'organisation d'un événement ?
            Écrivez-nous, nous vous répondrons sous 24 heures.
          </p>

          <ul class="info-list">
            <li><span class="info-icon">📍</span><div><strong>Adresse</strong><br>12 avenue des Lumières, 75008 Paris</div></li>
            <li><span class="info-icon">📞</span><div><strong>Téléphone</strong><br><a href="tel:+33145000000">+33 1 45 00 00 00</a></div></li>
            <li><span class="info-icon">✉️</span><div><strong>Email</strong><br><a href="mailto:contact@hotel-luxe.fr">contact@hotel-luxe.fr</a></div></li>
            <li><span class="info-icon">🕑</span><div><strong>Réception</strong><br>Ouverte 24h/24, 7j/7</div></li>
          </ul>
        </div>

        <!-- FORMULAIRE -->
        <div class="form-wrap">
          <div v-if="sent" class="sent">
            <div class="sent-icon">✅</div>
            <h3 class="sent-title">Message envoyé</h3>
            <p class="sent-text">Merci {{ form.name }} ! Nous revenons vers vous très vite.</p>
            <button class="btn-gold" @click="reset">Envoyer un autre message</button>
          </div>

          <form v-else class="form" @submit.prevent="submit">
            <h3 class="form-title">Écrivez-nous</h3>
            <div class="field">
              <label>Nom complet</label>
              <input v-model="form.name" type="text" required placeholder="Votre nom" />
            </div>
            <div class="field">
              <label>Email</label>
              <input v-model="form.email" type="email" required placeholder="vous@email.com" />
            </div>
            <div class="field">
              <label>Sujet</label>
              <input v-model="form.subject" type="text" placeholder="Objet de votre message" />
            </div>
            <div class="field">
              <label>Message</label>
              <textarea v-model="form.message" rows="5" required placeholder="Votre message…"></textarea>
            </div>
            <p v-if="error" class="error">{{ error }}</p>
            <button type="submit" class="btn-gold full">Envoyer le message</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({ name: '', email: '', subject: '', message: '' });
const sent = ref(false);
const error = ref('');

function submit() {
  error.value = '';
  if (!form.value.name || !form.value.email || !form.value.message) {
    error.value = 'Merci de remplir les champs obligatoires.';
    return;
  }
  // Pas d'endpoint backend dédié : on confirme côté client.
  sent.value = true;
}

function reset() {
  form.value = { name: '', email: '', subject: '', message: '' };
  sent.value = false;
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

.page { background: #FAF7F2; font-family: 'DM Sans', sans-serif; color: #1A1A1A; }
.container { max-width: 1140px; margin: 0 auto; padding: 0 1.5rem; }

/* HERO */
.hero {
  position: relative; height: 320px; display: flex; align-items: center; justify-content: center;
  background-image: url('https://images.unsplash.com/photo-1455587734955-081b22074882?w=1920&q=85');
  background-size: cover; background-position: center;
}
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(0,0,0,.75), rgba(0,0,0,.5)); }
.hero-content { position: relative; z-index: 2; text-align: center; }
.hero-badge { color: #E8C97E; letter-spacing: .2em; text-transform: uppercase; font-size: .8rem; margin-bottom: 1rem; }
.hero-title { font-family: 'Cormorant Garamond', serif; font-size: 3rem; color: #fff; }
.hero-sub { color: rgba(255,255,255,.85); margin-top: .75rem; }

/* SECTION */
.section { padding: 5rem 0; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3.5rem; align-items: start; }
.eyebrow { color: #C9A84C; letter-spacing: .18em; text-transform: uppercase; font-size: .78rem; font-weight: 600; margin-bottom: .75rem; }
.h2 { font-family: 'Cormorant Garamond', serif; font-size: 2.3rem; margin-bottom: 1rem; }
.lead { color: #555; line-height: 1.8; font-weight: 300; margin-bottom: 2rem; }

.info-list { list-style: none; display: flex; flex-direction: column; gap: 1.4rem; }
.info-list li { display: flex; gap: 1rem; align-items: flex-start; color: #444; line-height: 1.5; }
.info-icon { font-size: 1.3rem; }
.info-list a { color: #C9A84C; text-decoration: none; }
.info-list a:hover { text-decoration: underline; }

/* FORM */
.form-wrap { background: #fff; border: 1px solid #E2DDD6; border-radius: 16px; padding: 2.5rem; box-shadow: 0 18px 45px rgba(0,0,0,.06); }
.form-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; margin-bottom: 1.5rem; }
.field { margin-bottom: 1.1rem; display: flex; flex-direction: column; gap: .4rem; }
.field label { font-size: .8rem; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: #8a7f6a; }
.field input, .field textarea {
  border: 1px solid #d8d0bf; border-radius: 8px; padding: .7rem .9rem; font-size: .95rem;
  font-family: 'DM Sans', sans-serif; color: #2b2b2b; background: #fdfcf9; resize: vertical;
}
.field input:focus, .field textarea:focus { outline: none; border-color: #C9A84C; }
.error { color: #b00020; font-size: .9rem; margin-bottom: 1rem; }

.btn-gold { background: #C9A84C; color: #1a1a1a; font-weight: 700; border: none; padding: .85rem 1.8rem; border-radius: 8px; cursor: pointer; transition: background .2s ease; }
.btn-gold:hover { background: #E8C97E; }
.btn-gold.full { width: 100%; }

/* SENT */
.sent { text-align: center; padding: 2rem 0; }
.sent-icon { font-size: 3rem; margin-bottom: 1rem; }
.sent-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; margin-bottom: .5rem; }
.sent-text { color: #666; margin-bottom: 1.5rem; }

@media (max-width: 820px) {
  .grid { grid-template-columns: 1fr; }
  .hero-title { font-size: 2.2rem; }
}
</style>
