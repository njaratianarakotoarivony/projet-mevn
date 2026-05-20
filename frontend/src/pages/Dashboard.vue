<template>
  <!-- HERO -->
  <section class="hero-section">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <p class="hero-badge">✦ Bienvenue à l'Hôtel Luxe</p>
      <h1 class="hero-title">
        L'Art de<br />
        <span class="hero-title-accent">Vivre Bien</span>
      </h1>
      <p class="hero-subtitle">
        Une expérience hôtelière d'exception au cœur de la ville.
        Chambres raffinées, service personnalisé, confort absolu.
      </p>
      <div class="hero-buttons">
        <router-link to="/reservations" class="btn-primary">Réserver une chambre</router-link>
        <router-link to="/availability" class="btn-secondary">Voir les disponibilités</router-link>
      </div>
      <div class="hero-stats">
        <div class="stat-item">
          <span class="stat-number">48</span>
          <span class="stat-label">Chambres</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">98%</span>
          <span class="stat-label">Satisfaction</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">15+</span>
          <span class="stat-label">Années d'expérience</span>
        </div>
      </div>
    </div>
    <div class="scroll-indicator">
      <span>Découvrir</span>
      <div class="scroll-arrow">↓</div>
    </div>
  </section>

  <!-- STATS -->
  <section class="section-dashboard">
    <div class="container">
      <h2 class="section-title">Tableau de Bord</h2>
      <p class="section-subtitle">Vue d'ensemble en temps réel</p>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-icon">💰</div>
          <div class="stat-card-content">
            <span class="stat-card-label">Revenus du mois</span>
            <span class="stat-card-value">15 000 €</span>
            <span class="stat-card-trend trend-up">↑ +12% ce mois</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon">🏨</div>
          <div class="stat-card-content">
            <span class="stat-card-label">Taux d'occupation</span>
            <span class="stat-card-value">85%</span>
            <div class="progress-bar"><div class="progress-fill" style="width:85%"></div></div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon">📅</div>
          <div class="stat-card-content">
            <span class="stat-card-label">Réservations actives</span>
            <span class="stat-card-value">120</span>
            <span class="stat-card-trend trend-up">↑ +8 aujourd'hui</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon">✅</div>
          <div class="stat-card-content">
            <span class="stat-card-label">Chambres disponibles</span>
            <span class="stat-card-value">7</span>
            <span class="stat-card-trend trend-neutral">sur 48 chambres</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CHAMBRES -->
  <section class="section-rooms">
    <div class="container">
      <h2 class="section-title">Nos Chambres</h2>
      <p class="section-subtitle">Chaque espace pensé pour votre confort</p>
      <div class="rooms-grid">
        <div v-for="room in featuredRooms" :key="room.id" class="room-card">
          <div class="room-image-wrapper">
            <img :src="room.image" :alt="room.name" class="room-image" loading="lazy" />
            <span :class="['room-badge', room.available ? 'badge-available' : 'badge-unavailable']">
              {{ room.available ? 'Disponible' : 'Occupée' }}
            </span>
          </div>
          <div class="room-info">
            <div class="room-header">
              <h3 class="room-name">{{ room.name }}</h3>
              <span class="room-price">{{ room.price }} €<small>/nuit</small></span>
            </div>
            <p class="room-description">{{ room.description }}</p>
            <div class="room-amenities">
              <span v-for="a in room.amenities" :key="a" class="amenity-tag">{{ a }}</span>
            </div>
            <router-link :to="room.available ? '/reservations' : '/availability'" class="room-cta">
              {{ room.available ? 'Réserver maintenant' : 'Voir disponibilités' }}
            </router-link>
          </div>
        </div>
      </div>
      <div class="rooms-footer">
        <router-link to="/rooms" class="btn-outline">Voir toutes les chambres →</router-link>
      </div>
    </div>
  </section>

  <!-- FONCTIONNALITÉS -->
  <section class="section-features">
    <div class="container">
      <h2 class="section-title section-title--light">Tout ce dont vous avez besoin</h2>
      <p class="section-subtitle section-subtitle--light">Une gestion hôtelière complète et simplifiée</p>
      <div class="features-grid">
        <router-link to="/rooms" class="feature-card">
          <div class="feature-icon">🛏️</div>
          <h3 class="feature-title">Chambres</h3>
          <p class="feature-desc">Gérez votre inventaire de chambres, catégories, tarifs et équipements.</p>
        </router-link>
        <router-link to="/reservations" class="feature-card">
          <div class="feature-icon">📋</div>
          <h3 class="feature-title">Réservations</h3>
          <p class="feature-desc">Suivi complet des réservations : en attente, confirmées, annulées.</p>
        </router-link>
        <router-link to="/payments" class="feature-card">
          <div class="feature-icon">💳</div>
          <h3 class="feature-title">Paiements</h3>
          <p class="feature-desc">Historique des transactions, factures et rapports financiers.</p>
        </router-link>
        <router-link to="/availability" class="feature-card">
          <div class="feature-icon">📆</div>
          <h3 class="feature-title">Disponibilité</h3>
          <p class="feature-desc">Calendrier interactif pour visualiser et gérer les disponibilités.</p>
        </router-link>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <span class="footer-logo">✦ Hôtel Luxe</span>
        <p class="footer-tagline">L'excellence à chaque séjour.</p>
      </div>
      <div class="footer-links">
        <router-link to="/">Accueil</router-link>
        <router-link to="/rooms">Chambres</router-link>
        <router-link to="/reservations">Réservations</router-link>
        <router-link to="/availability">Disponibilité</router-link>
        <router-link to="/auth">Connexion</router-link>
      </div>
      <p class="footer-copy">© 2025 Hôtel Luxe. Tous droits réservés.</p>
    </div>
  </footer>
</template>

<script setup>
import '../assets/dashboard.css'

const featuredRooms = [
  {
    id: 1,
    name: 'Suite Présidentielle',
    price: 450,
    description: 'Notre chambre la plus prestigieuse, avec vue panoramique, jacuzzi privatif et salon séparé.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    amenities: ['Jacuzzi', 'Vue panoramique', 'King Bed', 'Mini-bar', 'WiFi'],
    available: true,
  },
  {
    id: 2,
    name: 'Chambre Deluxe',
    price: 220,
    description: 'Espace élégant avec literie haut de gamme, bureau de travail et salle de bain en marbre.',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
    amenities: ['Queen Bed', 'Baignoire', 'Bureau', 'WiFi', 'Climatisation'],
    available: true,
  },
  {
    id: 3,
    name: 'Chambre Standard',
    price: 120,
    description: "Confort et simplicité, idéale pour les séjours d'affaires ou week-ends en solo.",
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
    amenities: ['Double Bed', 'Douche', 'WiFi', 'TV 4K'],
    available: false,
  },
]
</script>