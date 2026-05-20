<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': scrolled }">
    <div class="navbar-inner">

      <!-- Logo -->
      <router-link to="/" class="navbar-logo">
        <span class="logo-symbol">✦</span>
        <span class="logo-text">Hôtel Luxe</span>
      </router-link>

      <!-- Liens desktop -->
      <ul class="navbar-links">
        <li v-for="link in links" :key="link.to">
          <router-link
            :to="link.to"
            class="nav-link"
            :class="{ 'nav-link--cta': link.cta }"
            active-class="nav-link--active"
            exact-active-class="nav-link--active"
          >
            {{ link.label }}
          </router-link>
        </li>
      </ul>

      <!-- Burger mobile -->
      <button class="burger" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>
    </div>

    <!-- Menu mobile -->
    <transition name="slide-down">
      <div v-if="menuOpen" class="mobile-menu">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="mobile-link"
          :class="{ 'mobile-link--cta': link.cta }"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </router-link>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled  = ref(false)
const menuOpen  = ref(false)

const links = [
  { to: '/',             label: 'Accueil'       },
  { to: '/rooms',        label: 'Chambres'      },
  { to: '/reservations', label: 'Réservations'  },
  { to: '/availability', label: 'Disponibilité' },
  { to: '/payments',     label: 'Paiements'     },
  { to: '/auth',         label: 'Connexion', cta: true },
]

function onScroll() {
  scrolled.value = window.scrollY > 50
}

onMounted(()  => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;500;600&display=swap');

/* ===== BASE ===== */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 0 2rem;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  /* Transparent au sommet */
  background: transparent;
  border-bottom: 1px solid transparent;
  transition: background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease;
}

/* Après scroll : fond sombre semi-transparent */
.navbar--scrolled {
  background: rgba(10, 10, 10, 0.88);
  border-bottom: 1px solid rgba(201, 168, 76, 0.25);
  backdrop-filter: blur(16px);
}

.navbar-inner {
  max-width: 1240px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ===== LOGO ===== */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}
.logo-symbol {
  font-size: 1.2rem;
  color: #E8C97E;
  line-height: 1;
}
.logo-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: 0.02em;
}

/* ===== LIENS DESKTOP ===== */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
}

.nav-link {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  padding: 0.45rem 1rem;
  border-radius: 4px;
  letter-spacing: 0.03em;
  transition: color 0.2s ease, background 0.2s ease;
  white-space: nowrap;
}
.nav-link:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.08);
}
.nav-link--active {
  color: #E8C97E !important;
}

/* Bouton CTA "Connexion" */
.nav-link--cta {
  background: #C9A84C;
  color: #000000 !important;
  font-weight: 600;
  padding: 0.5rem 1.3rem;
  border-radius: 4px;
  margin-left: 0.5rem;
}
.nav-link--cta:hover {
  background: #E8C97E;
  color: #000000 !important;
}

/* ===== BURGER ===== */
.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0.4rem;
}
.burger span {
  display: block;
  width: 24px;
  height: 2px;
  background: #FFFFFF;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}
.burger span.open:nth-child(1) { transform: translateY(7px) rotate(45deg);  }
.burger span.open:nth-child(2) { opacity: 0; transform: scaleX(0); }
.burger span.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ===== MENU MOBILE ===== */
.mobile-menu {
  display: flex;
  flex-direction: column;
  background: rgba(10, 10, 10, 0.97);
  border-top: 1px solid rgba(201, 168, 76, 0.2);
  padding: 1rem 2rem 1.5rem;
}
.mobile-link {
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.88);
  text-decoration: none;
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  transition: color 0.2s;
}
.mobile-link:hover { color: #E8C97E; }
.mobile-link--cta {
  color: #E8C97E;
  font-weight: 600;
  border-bottom: none;
  margin-top: 0.5rem;
}

/* Transition menu mobile */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 400px;
  opacity: 1;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .navbar-links { display: none; }
  .burger       { display: flex; }
  .navbar { height: auto; min-height: 60px; }
}
</style>