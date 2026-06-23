<template>
  <div class="page">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <p class="hero-badge">✦ Notre Maison</p>
        <h1 class="hero-title">À propos de l'Hôtel Luxe</h1>
        <p class="hero-sub">
          Depuis 2009, l'art de recevoir à la française au cœur de la ville.
        </p>
      </div>
    </section>

    <!-- HISTOIRE -->
    <section class="section">
      <div class="container split">
        <div class="split-text">
          <p class="eyebrow">Notre histoire</p>
          <h2 class="h2">Quinze ans d'excellence</h2>
          <p class="p">
            Né de la passion d'une famille d'hôteliers, l'Hôtel Luxe est devenu une
            référence de l'hospitalité raffinée. Chaque détail — du choix des
            matériaux à la sélection de nos équipes — est pensé pour offrir à nos
            hôtes une expérience inoubliable.
          </p>
          <p class="p">
            Nos 48 chambres et suites allient le charme de l'architecture
            classique au confort des technologies les plus modernes, dans une
            atmosphère feutrée et intemporelle.
          </p>
        </div>
        <div class="split-img">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=85" alt="Façade de l'hôtel" />
        </div>
      </div>
    </section>

    <!-- CHIFFRES -->
    <section class="stats-band">
      <div class="container stats-grid">
        <div class="stat"><span class="stat-num">48</span><span class="stat-label">Chambres & suites</span></div>
        <div class="stat"><span class="stat-num">15+</span><span class="stat-label">Années d'expérience</span></div>
        <div class="stat"><span class="stat-num">98%</span><span class="stat-label">Clients satisfaits</span></div>
        <div class="stat"><span class="stat-num">24/7</span><span class="stat-label">Service en chambre</span></div>
      </div>
    </section>

    <!-- VALEURS -->
    <section class="section">
      <div class="container">
        <p class="eyebrow center">Ce qui nous distingue</p>
        <h2 class="h2 center">Nos valeurs</h2>
        <div class="cards">
          <article class="card">
            <span class="card-icon">🤍</span>
            <h3 class="card-title">Excellence du service</h3>
            <p class="card-text">Une équipe attentionnée, disponible à chaque instant pour anticiper vos moindres désirs.</p>
          </article>
          <article class="card">
            <span class="card-icon">🌿</span>
            <h3 class="card-title">Engagement durable</h3>
            <p class="card-text">Produits locaux, gestion responsable de l'énergie et de l'eau, démarche éco-responsable.</p>
          </article>
          <article class="card">
            <span class="card-icon">✦</span>
            <h3 class="card-title">Élégance intemporelle</h3>
            <p class="card-text">Un cadre raffiné où le design contemporain rencontre le charme du patrimoine.</p>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="container cta-inner">
        <h2 class="h2 light">Envie de vivre l'expérience ?</h2>
        <router-link to="/rooms" class="btn-gold">Découvrir nos chambres</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
// Page de présentation — contenu statique.
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

.page { background: #FAF7F2; font-family: 'DM Sans', sans-serif; color: #1A1A1A; }
.container { max-width: 1140px; margin: 0 auto; padding: 0 1.5rem; }

/* HERO */
.hero {
  position: relative; height: 360px; display: flex; align-items: center; justify-content: center;
  background-image: url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=85');
  background-size: cover; background-position: center;
}
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(0,0,0,.75), rgba(0,0,0,.5)); }
.hero-content { position: relative; z-index: 2; text-align: center; padding: 2rem; }
.hero-badge { color: #E8C97E; letter-spacing: .2em; text-transform: uppercase; font-size: .8rem; margin-bottom: 1rem; }
.hero-title { font-family: 'Cormorant Garamond', serif; font-size: 3rem; color: #fff; line-height: 1.1; }
.hero-sub { color: rgba(255,255,255,.85); margin-top: 1rem; font-size: 1.1rem; }

/* SECTIONS */
.section { padding: 5rem 0; }
.eyebrow { color: #C9A84C; letter-spacing: .18em; text-transform: uppercase; font-size: .78rem; font-weight: 600; margin-bottom: .75rem; }
.eyebrow.center, .h2.center { text-align: center; }
.h2 { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; margin-bottom: 1.5rem; }
.h2.light { color: #fff; }
.p { color: #555; line-height: 1.8; margin-bottom: 1rem; font-weight: 300; font-size: 1.05rem; }

.split { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
.split-img img { width: 100%; border-radius: 14px; box-shadow: 0 20px 50px rgba(0,0,0,.15); }

/* CHIFFRES */
.stats-band { background: #0D0D0D; padding: 3.5rem 0; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; text-align: center; }
.stat-num { display: block; font-family: 'Cormorant Garamond', serif; font-size: 2.8rem; color: #E8C97E; }
.stat-label { color: rgba(255,255,255,.7); font-size: .9rem; letter-spacing: .05em; }

/* CARTES */
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; }
.card { background: #fff; border: 1px solid #E2DDD6; border-radius: 14px; padding: 2.5rem 2rem; text-align: center; transition: transform .25s ease, box-shadow .25s ease; }
.card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(0,0,0,.08); }
.card-icon { font-size: 2.2rem; display: block; margin-bottom: 1rem; }
.card-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; margin-bottom: .75rem; }
.card-text { color: #666; line-height: 1.7; font-weight: 300; }

/* CTA */
.cta { background: linear-gradient(160deg, #1a1a1a, #2a2419); padding: 4.5rem 0; }
.cta-inner { text-align: center; }
.btn-gold { display: inline-block; margin-top: 1rem; background: #C9A84C; color: #1a1a1a; font-weight: 700; padding: .9rem 2rem; border-radius: 8px; text-decoration: none; transition: background .2s ease; }
.btn-gold:hover { background: #E8C97E; }

@media (max-width: 820px) {
  .split { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .cards { grid-template-columns: 1fr; }
  .hero-title { font-size: 2.2rem; }
}
</style>
