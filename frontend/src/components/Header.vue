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
            active-class="nav-link--active"
            exact-active-class="nav-link--active"
          >
            {{ link.label }}
          </router-link>
        </li>
        <!-- État d'authentification -->
        <li v-if="!auth.isAuthenticated.value">
          <router-link to="/auth" class="nav-link nav-link--cta">Connexion</router-link>
        </li>
        <li v-else ref="dropdownRef" class="user-dropdown">
          <button class="user-trigger" @click.stop="userMenuOpen = !userMenuOpen">
            <span class="user-avatar">{{ initials }}</span>
            <span class="user-name">{{ auth.state.user?.name }}</span>
            <span class="caret" :class="{ open: userMenuOpen }">▾</span>
          </button>
          <transition name="dropdown">
            <ul v-if="userMenuOpen" class="dropdown-menu">
              <li>
                <router-link to="/espace-client" class="dropdown-item" @click="userMenuOpen = false">
                  👤 Espace Client
                </router-link>
              </li>
              <li v-if="auth.isAdmin.value">
                <router-link to="/admin" class="dropdown-item" @click="userMenuOpen = false">
                  ⚙ Administration
                </router-link>
              </li>
              <li><hr class="dropdown-sep" /></li>
              <li>
                <button class="dropdown-item dropdown-logout" @click="handleLogout">
                  ⎋ Déconnexion
                </button>
              </li>
            </ul>
          </transition>
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
          @click="menuOpen = false"
        >
          {{ link.label }}
        </router-link>
        <router-link
          v-if="!auth.isAuthenticated.value"
          to="/auth"
          class="mobile-link mobile-link--cta"
          @click="menuOpen = false"
        >
          Connexion
        </router-link>
        <template v-else>
          <router-link to="/espace-client" class="mobile-link" @click="menuOpen = false">
            👤 Espace Client ({{ auth.state.user?.name }})
          </router-link>
          <router-link v-if="auth.isAdmin.value" to="/admin" class="mobile-link" @click="menuOpen = false">
            ⚙ Administration
          </router-link>
          <button class="mobile-link mobile-link--cta" @click="handleLogout">Déconnexion</button>
        </template>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import auth from '../store'

const router = useRouter()
const scrolled     = ref(false)
const menuOpen     = ref(false)
const userMenuOpen = ref(false)
const dropdownRef  = ref(null)

// Le parcours réservation se fait entièrement depuis « Chambres »
// (disponibilité → réservation → paiement), donc pas de liens séparés.
const links = [
  { to: '/',        label: 'Accueil'   },
  { to: '/rooms',   label: 'Chambres'  },
  { to: '/about',   label: 'À propos'  },
  { to: '/contact', label: 'Contact'   },
]

// Initiales pour la pastille du dropdown utilisateur.
const initials = computed(() =>
  (auth.state.user?.name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
)

function handleLogout() {
  auth.logout()
  menuOpen.value = false
  userMenuOpen.value = false
  router.push('/auth')
}

function onScroll() {
  scrolled.value = window.scrollY > 50
}

// Ferme le dropdown si on clique en dehors.
function onClickOutside(e) {
  if (userMenuOpen.value && dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  document.addEventListener('click', onClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onClickOutside)
})
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

/* Bouton (déconnexion) stylé comme un lien */
button.nav-link {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
}
button.mobile-link {
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: 'DM Sans', sans-serif;
  width: 100%;
}

/* ===== DROPDOWN UTILISATEUR ===== */
.user-dropdown {
  position: relative;
  margin-left: 0.5rem;
}
.user-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  padding: 0.35rem 0.5rem;
}
.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #C9A84C, #E8C97E);
  color: #1a1a1a;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-name {
  font-size: 0.9rem;
  color: #E8C97E;
  white-space: nowrap;
}
.caret {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  transition: transform 0.2s ease;
}
.caret.open { transform: rotate(180deg); }

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 200px;
  background: rgba(15, 15, 15, 0.97);
  border: 1px solid rgba(201, 168, 76, 0.25);
  border-radius: 10px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(14px);
  padding: 0.4rem;
  list-style: none;
}
.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  padding: 0.65rem 0.85rem;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.18s ease, color 0.18s ease;
}
.dropdown-item:hover {
  background: rgba(201, 168, 76, 0.15);
  color: #E8C97E;
}
.dropdown-logout:hover { color: #ff9b9b; background: rgba(255, 70, 70, 0.12); }
.dropdown-sep {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0.3rem 0.4rem;
}

/* Transition d'apparition du menu */
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }

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