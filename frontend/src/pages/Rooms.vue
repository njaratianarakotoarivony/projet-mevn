<template>
  <div class="rooms-page">

    <!-- ===== EN-TÊTE DE PAGE ===== -->
    <section class="page-hero">
      <div class="page-hero-overlay"></div>
      <div class="page-hero-content">
        <p class="page-hero-badge">✦ Notre Collection</p>
        <h1 class="page-hero-title">Nos Chambres</h1>
        <p class="page-hero-sub">
          De la chambre standard au suite présidentielle, chaque espace est pensé pour votre confort et votre bien-être.
        </p>
      </div>
    </section>

    <!-- ===== FILTRES & RECHERCHE ===== -->
    <section class="filters-bar">
      <div class="container">
        <div class="filters-inner">

          <!-- Recherche -->
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              v-model="search"
              type="text"
              placeholder="Rechercher une chambre..."
              class="search-input"
            />
          </div>

          <!-- Filtre catégorie -->
          <div class="filter-group">
            <button
              v-for="cat in categories"
              :key="cat.value"
              :class="['filter-btn', { active: activeCategory === cat.value }]"
              @click="activeCategory = cat.value"
            >
              {{ cat.label }}
            </button>
          </div>

          <!-- Tri -->
          <select v-model="sortBy" class="sort-select">
            <option value="default">Trier par</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="name">Nom A→Z</option>
          </select>
        </div>

        <!-- Résultats count -->
        <p class="results-count">
          <strong>{{ filteredRooms.length }}</strong> chambre{{ filteredRooms.length > 1 ? 's' : '' }} trouvée{{ filteredRooms.length > 1 ? 's' : '' }}
        </p>
      </div>
    </section>

    <!-- ===== GRILLE DE CHAMBRES ===== -->
    <section class="rooms-section">
      <div class="container">

        <!-- Aucun résultat -->
        <div v-if="filteredRooms.length === 0" class="empty-state">
          <span class="empty-icon">🛏️</span>
          <p class="empty-text">Aucune chambre ne correspond à votre recherche.</p>
          <button class="btn-reset" @click="resetFilters">Réinitialiser les filtres</button>
        </div>

        <!-- Grille -->
        <div v-else class="rooms-grid">
          <article
            v-for="room in filteredRooms"
            :key="room.id"
            class="room-card"
          >
            <!-- Image -->
            <div class="room-img-wrap">
              <img :src="room.image" :alt="room.name" class="room-img" loading="lazy" />

              <!-- Badges -->
              <div class="room-badges">
                <span :class="['badge-status', room.available ? 'badge-ok' : 'badge-no']">
                  {{ room.available ? '✓ Disponible' : '✗ Occupée' }}
                </span>
                <span v-if="room.featured" class="badge-featured">⭐ Populaire</span>
              </div>

              <!-- Overlay hover -->
              <div class="room-img-overlay">
                <button class="overlay-btn" @click="openModal(room)">Voir les détails</button>
              </div>
            </div>

            <!-- Infos -->
            <div class="room-body">
              <div class="room-top">
                <div>
                  <span class="room-category">{{ room.category }}</span>
                  <h3 class="room-name">{{ room.name }}</h3>
                </div>
                <div class="room-price-block">
                  <span class="room-price">{{ room.price }} €</span>
                  <span class="room-price-unit">/nuit</span>
                </div>
              </div>

              <p class="room-desc">{{ room.description }}</p>

              <!-- Caractéristiques -->
              <div class="room-specs">
                <span class="spec-item">
                  <span class="spec-icon">👥</span> {{ room.capacity }} pers.
                </span>
                <span class="spec-item">
                  <span class="spec-icon">📐</span> {{ room.size }} m²
                </span>
                <span class="spec-item">
                  <span class="spec-icon">🛏️</span> {{ room.bed }}
                </span>
                <span class="spec-item">
                  <span class="spec-icon">🏢</span> Étage {{ room.floor }}
                </span>
              </div>

              <!-- Équipements -->
              <div class="room-amenities">
                <span v-for="a in room.amenities.slice(0, 4)" :key="a" class="amenity-tag">{{ a }}</span>
                <span v-if="room.amenities.length > 4" class="amenity-more">
                  +{{ room.amenities.length - 4 }}
                </span>
              </div>

              <!-- Actions -->
              <div class="room-actions">
                <button class="btn-details" @click="openModal(room)">
                  Détails
                </button>
                <router-link
                  :to="room.available ? '/reservations' : '/availability'"
                  :class="['btn-reserve', !room.available && 'btn-reserve--disabled']"
                >
                  {{ room.available ? 'Réserver' : 'Indisponible' }}
                </router-link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ===== MODAL DÉTAIL ===== -->
    <transition name="fade">
      <div v-if="selectedRoom" class="modal-backdrop" @click.self="closeModal">
        <div class="modal">
          <button class="modal-close" @click="closeModal">✕</button>

          <!-- Image grande -->
          <div class="modal-img-wrap">
            <img :src="selectedRoom.image" :alt="selectedRoom.name" class="modal-img" />
            <span :class="['modal-status', selectedRoom.available ? 'badge-ok' : 'badge-no']">
              {{ selectedRoom.available ? '✓ Disponible' : '✗ Occupée' }}
            </span>
          </div>

          <div class="modal-body">
            <div class="modal-header">
              <div>
                <span class="room-category">{{ selectedRoom.category }}</span>
                <h2 class="modal-title">{{ selectedRoom.name }}</h2>
              </div>
              <div class="modal-price-block">
                <span class="modal-price">{{ selectedRoom.price }} €</span>
                <span class="room-price-unit">/nuit</span>
              </div>
            </div>

            <p class="modal-desc">{{ selectedRoom.description }}</p>

            <!-- Specs -->
            <div class="modal-specs">
              <div class="modal-spec">
                <span class="modal-spec-icon">👥</span>
                <span class="modal-spec-label">Capacité</span>
                <span class="modal-spec-val">{{ selectedRoom.capacity }} personnes</span>
              </div>
              <div class="modal-spec">
                <span class="modal-spec-icon">📐</span>
                <span class="modal-spec-label">Superficie</span>
                <span class="modal-spec-val">{{ selectedRoom.size }} m²</span>
              </div>
              <div class="modal-spec">
                <span class="modal-spec-icon">🛏️</span>
                <span class="modal-spec-label">Literie</span>
                <span class="modal-spec-val">{{ selectedRoom.bed }}</span>
              </div>
              <div class="modal-spec">
                <span class="modal-spec-icon">🏢</span>
                <span class="modal-spec-label">Étage</span>
                <span class="modal-spec-val">{{ selectedRoom.floor }}</span>
              </div>
            </div>

            <!-- Tous les équipements -->
            <h4 class="modal-amenities-title">Équipements inclus</h4>
            <div class="modal-amenities">
              <span v-for="a in selectedRoom.amenities" :key="a" class="amenity-tag">{{ a }}</span>
            </div>

            <!-- CTA modal -->
            <div class="modal-actions">
              <button class="btn-close-modal" @click="closeModal">Fermer</button>
              <router-link
                :to="selectedRoom.available ? '/reservations' : '/availability'"
                class="btn-reserve"
                @click="closeModal"
              >
                {{ selectedRoom.available ? '📅 Réserver cette chambre' : '📆 Voir disponibilités' }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import '../assets/rooms.css'

/* ===== DONNÉES ===== */
const rooms = ref([
  {
    id: 1,
    name: 'Suite Présidentielle',
    category: 'Suite',
    price: 450,
    size: 85,
    capacity: 2,
    floor: 8,
    bed: 'King Size',
    featured: true,
    available: true,
    description: 'Notre chambre la plus prestigieuse, avec vue panoramique sur la ville, jacuzzi privatif, salon séparé et service en chambre 24h/24.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85',
    amenities: ['Jacuzzi privatif', 'Vue panoramique', 'King Size', 'Mini-bar premium', 'WiFi fibre', 'Climatisation', 'Coffre-fort', 'Room service 24h'],
  },
  {
    id: 2,
    name: 'Suite Junior',
    category: 'Suite',
    price: 320,
    size: 60,
    capacity: 2,
    floor: 6,
    bed: 'King Size',
    featured: false,
    available: true,
    description: 'Suite élégante avec espace salon, baignoire balnéo et vue dégagée. Idéale pour un séjour romantique ou une occasion spéciale.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=85',
    amenities: ['Baignoire balnéo', 'Salon séparé', 'King Size', 'Mini-bar', 'WiFi fibre', 'Climatisation', 'Coffre-fort'],
  },
  {
    id: 3,
    name: 'Chambre Deluxe',
    category: 'Deluxe',
    price: 220,
    size: 42,
    capacity: 2,
    floor: 4,
    bed: 'Queen Size',
    featured: true,
    available: true,
    description: 'Espace élégant avec literie haut de gamme, bureau de travail ergonomique et salle de bain en marbre. Parfait pour affaires ou loisirs.',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900&q=85',
    amenities: ['Queen Size', 'Baignoire marbre', 'Bureau ergonomique', 'WiFi fibre', 'Climatisation', 'TV 55"', 'Coffre-fort'],
  },
  {
    id: 4,
    name: 'Chambre Familiale',
    category: 'Familiale',
    price: 280,
    size: 55,
    capacity: 4,
    floor: 3,
    bed: '2 Grands Lits',
    featured: false,
    available: false,
    description: 'Grande chambre conçue pour les familles, avec deux espaces nuit séparés, salle de bain double vasque et coin détente pour les enfants.',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&q=85',
    amenities: ['2 Grands lits', 'Double vasque', 'Canapé-lit', 'WiFi fibre', 'TV 55"', 'Climatisation', 'Coffre-fort'],
  },
  {
    id: 5,
    name: 'Chambre Standard',
    category: 'Standard',
    price: 120,
    size: 28,
    capacity: 1,
    floor: 2,
    bed: 'Double',
    featured: false,
    available: true,
    description: 'Confort et simplicité réunis. Idéale pour les séjours professionnels courts, avec tout l\'essentiel pour un repos parfait.',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=900&q=85',
    amenities: ['Lit double', 'Douche italienne', 'WiFi', 'TV 4K', 'Climatisation'],
  },
  {
    id: 6,
    name: 'Chambre Vue Jardin',
    category: 'Standard',
    price: 150,
    size: 32,
    capacity: 2,
    floor: 1,
    bed: 'Queen Size',
    featured: false,
    available: true,
    description: 'Chambre calme avec vue directe sur notre jardin intérieur. Ambiance apaisante, lumière naturelle et décoration soignée.',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&q=85',
    amenities: ['Vue jardin', 'Queen Size', 'Baignoire', 'WiFi', 'TV 4K', 'Climatisation'],
  },
])

/* ===== FILTRES ===== */
const search         = ref('')
const activeCategory = ref('Tous')
const sortBy         = ref('default')
const selectedRoom   = ref(null)

const categories = [
  { label: 'Toutes',    value: 'Tous'      },
  { label: 'Suite',     value: 'Suite'     },
  { label: 'Deluxe',    value: 'Deluxe'   },
  { label: 'Familiale', value: 'Familiale' },
  { label: 'Standard',  value: 'Standard'  },
]

const filteredRooms = computed(() => {
  let list = rooms.value

  // Filtre catégorie
  if (activeCategory.value !== 'Tous') {
    list = list.filter(r => r.category === activeCategory.value)
  }

  // Filtre recherche
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    )
  }

  // Tri
  if (sortBy.value === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
  if (sortBy.value === 'name')       list = [...list].sort((a, b) => a.name.localeCompare(b.name))

  return list
})

function resetFilters() {
  search.value = ''
  activeCategory.value = 'Tous'
  sortBy.value = 'default'
}

function openModal(room) {
  selectedRoom.value = room
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  selectedRoom.value = null
  document.body.style.overflow = ''
}
</script>