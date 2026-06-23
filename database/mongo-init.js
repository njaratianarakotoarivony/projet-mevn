// Script d'initialisation exécuté automatiquement au premier démarrage du conteneur
// (uniquement quand le volume de données est vide).
db = db.getSiblingDB('hotel_management');

// Création des collections
db.createCollection('users');
db.createCollection('rooms');
db.createCollection('reservations');
db.createCollection('payments');
db.createCollection('stats');

// Index (cohérents avec les schémas Mongoose)
db.users.createIndex({ email: 1 }, { unique: true });
db.rooms.createIndex({ type: 1, available: 1 });
db.reservations.createIndex({ roomId: 1, checkIn: 1, checkOut: 1 });
db.reservations.createIndex({ userId: 1 });
db.payments.createIndex({ userId: 1 });
db.payments.createIndex({ reservationId: 1 });

// Données de démonstration (chambres)
const now = new Date();
db.rooms.insertMany([
  {
    name: 'Suite Royale',
    type: 'Luxe',
    price: 500,
    capacity: 2,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'Minibar', 'Jacuzzi'],
    images: [],
    description: 'Suite luxueuse avec vue panoramique.',
    createdAt: now,
    updatedAt: now,
  },
  {
    name: 'Chambre Standard',
    type: 'Standard',
    price: 100,
    capacity: 2,
    available: true,
    amenities: ['Wifi', 'Climatisation'],
    images: [],
    description: 'Chambre confortable pour deux personnes.',
    createdAt: now,
    updatedAt: now,
  },
  {
    name: 'Chambre Familiale',
    type: 'Familiale',
    price: 250,
    capacity: 4,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'TV'],
    images: [],
    description: 'Idéale pour les familles, jusqu\'à 4 personnes.',
    createdAt: now,
    updatedAt: now,
  },
]);

print('Base de données « hotel_management » initialisée avec succès.');
