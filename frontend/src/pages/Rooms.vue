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

    <!-- ===== BARRE DE DISPONIBILITÉ ===== -->
    <section class="filters-bar" style="padding-bottom:0;">
      <div class="container">
        <form class="avail-bar" @submit.prevent="searchAvailability">
          <div class="avail-field">
            <label>Arrivée</label>
            <input v-model="stay.checkIn" type="date" :min="minDate" />
          </div>
          <div class="avail-field">
            <label>Départ</label>
            <input v-model="stay.checkOut" type="date" :min="stay.checkIn || minDate" />
          </div>
          <div class="avail-field">
            <label>Personnes</label>
            <select v-model.number="stay.guests">
              <option :value="1">1 personne</option>
              <option :value="2">2 personnes</option>
              <option :value="3">3 personnes</option>
              <option :value="4">4 personnes</option>
            </select>
          </div>
          <button type="submit" class="avail-btn" :disabled="loading">
            {{ loading ? 'Recherche…' : 'Vérifier la disponibilité' }}
          </button>
          <button v-if="availabilityMode" type="button" class="avail-reset" @click="clearAvailability">
            ✕ Toutes les chambres
          </button>
        </form>
        <p v-if="availabilityMode" class="avail-note">
          Chambres disponibles du <strong>{{ stay.checkIn }}</strong> au <strong>{{ stay.checkOut }}</strong>
          pour <strong>{{ stay.guests }}</strong> personne(s).
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
                <button
                  :class="['btn-reserve', !room.available && 'btn-reserve--disabled']"
                  :disabled="!room.available"
                  @click="goReserve(room)"
                >
                  {{ room.available ? 'Réserver' : 'Indisponible' }}
                </button>
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
              <button
                class="btn-reserve"
                :disabled="!selectedRoom.available"
                @click="goReserve(selectedRoom)"
              >
                {{ selectedRoom.available ? '📅 Réserver cette chambre' : 'Indisponible' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- ===== OVERLAY RÉSERVATION → PAIEMENT ===== -->
    <BookingModal
      v-if="bookingRoom"
      :room="bookingRoom"
      :prefill="bookingPrefill"
      @close="closeBooking"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { roomAPI } from '../services/api'
import BookingModal from '../components/BookingModal.vue'
import '../assets/rooms.css'

// Chambre en cours de réservation (ouvre l'overlay si non null).
const bookingRoom = ref(null)
const bookingPrefill = ref({})

/* ===== DONNÉES ===== */
const rooms   = ref([])
const loading = ref(false)
const error   = ref('')

/* ===== DISPONIBILITÉ (dates) ===== */
const minDate = computed(() => new Date().toISOString().split('T')[0])
const stay = ref({ checkIn: '', checkOut: '', guests: 2 })
const availabilityMode = ref(false)

// Image de repli par catégorie (le backend ne stocke pas toujours d'images).
const FALLBACK_IMAGES = {
  Luxe:      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85',
  Suite:     'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=85',
  Familiale: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&q=85',
  Standard:  'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=900&q=85',
}

// Mappe une chambre du backend vers la forme attendue par le template.
function mapRoom(r) {
  return {
    id:          r._id,
    name:        r.name,
    category:    r.type,
    price:       r.price,
    capacity:    r.capacity,
    available:   r.available,
    description: r.description || '',
    amenities:   r.amenities || [],
    image:       (r.images && r.images[0]) || FALLBACK_IMAGES[r.type] || FALLBACK_IMAGES.Standard,
    featured:    r.type === 'Luxe' || r.type === 'Suite',
    // Champs non stockés côté backend : valeurs dérivées pour l'affichage.
    size:        r.capacity * 20,
    floor:       '—',
    bed:         r.capacity > 2 ? '2 Grands Lits' : 'Queen Size',
  }
}

async function fetchRooms() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await roomAPI.getAll()
    rooms.value = data.map(mapRoom)
  } catch (err) {
    error.value = err.response?.data?.message || 'Impossible de charger les chambres.'
  } finally {
    loading.value = false
  }
}

// Recherche les chambres réellement libres sur la période choisie.
async function searchAvailability() {
  if (!stay.value.checkIn || !stay.value.checkOut) {
    error.value = 'Choisis une date d’arrivée et de départ.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { data } = await roomAPI.checkAvailability({
      checkIn: stay.value.checkIn,
      checkOut: stay.value.checkOut,
      guests: stay.value.guests,
    })
    rooms.value = data.map(mapRoom)
    availabilityMode.value = true
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la recherche de disponibilité.'
  } finally {
    loading.value = false
  }
}

function clearAvailability() {
  availabilityMode.value = false
  stay.value = { checkIn: '', checkOut: '', guests: 2 }
  fetchRooms()
}

// Ouvre l'overlay de réservation (réservation → paiement) pour la chambre choisie.
function goReserve(room) {
  if (!room.available) return
  // BookingModal attend une chambre au format backend (_id, type, price, capacity…).
  bookingRoom.value = {
    _id: room.id,
    name: room.name,
    type: room.category,
    price: room.price,
    capacity: room.capacity,
  }
  bookingPrefill.value = availabilityMode.value
    ? { checkIn: stay.value.checkIn, checkOut: stay.value.checkOut, guests: stay.value.guests }
    : {}
  closeModal()
}

function closeBooking() {
  bookingRoom.value = null
}

onMounted(fetchRooms)

/* ===== FILTRES ===== */
const search         = ref('')
const activeCategory = ref('Tous')
const sortBy         = ref('default')
const selectedRoom   = ref(null)

const categories = [
  { label: 'Toutes',    value: 'Tous'      },
  { label: 'Luxe',      value: 'Luxe'      },
  { label: 'Suite',     value: 'Suite'     },
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

<style scoped>
.avail-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
  background: #fff;
  border: 1px solid #ece6d8;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}
.avail-field { display: flex; flex-direction: column; gap: 0.35rem; }
.avail-field label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #8a7f6a;
}
.avail-field input,
.avail-field select {
  border: 1px solid #d8d0bf;
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  font-size: 0.95rem;
  color: #2b2b2b;
  background: #fdfcf9;
  min-width: 150px;
}
.avail-btn {
  background: #c9a84c;
  color: #1a1a1a;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.4rem;
  cursor: pointer;
  transition: background 0.2s ease;
}
.avail-btn:hover:not(:disabled) { background: #e8c97e; }
.avail-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.avail-reset {
  background: none;
  border: none;
  color: #8a7f6a;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
}
.avail-note {
  margin-top: 0.85rem;
  color: #5c5443;
  font-size: 0.95rem;
}
</style>