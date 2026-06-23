// Script de seed / migration idempotent.
// Crée les index, insère les chambres de démonstration et un compte admin.
// Réexécutable sans créer de doublons (upsert par clé naturelle).
//
// Usage :  npm run seed        (depuis le dossier backend/)
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { hash } from 'bcryptjs';

import Room from '../services/room/models/Room.js';
import User from '../services/user/models/User.js';

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/hotel_management';

// Helper : image Unsplash normalisée.
const img = (id) => `https://images.unsplash.com/photo-${id}?w=900&q=80`;

const rooms = [
  // ===== STANDARD =====
  {
    name: 'Chambre Standard Vue Ville',
    type: 'Standard',
    price: 95,
    capacity: 2,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'TV 4K'],
    description: 'Chambre cosy et lumineuse avec vue sur la ville, idéale pour un court séjour.',
    images: [img('1505693314120-0d443867891c')],
  },
  {
    name: 'Chambre Standard Vue Jardin',
    type: 'Standard',
    price: 110,
    capacity: 2,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'TV 4K', 'Vue jardin'],
    description: 'Chambre calme donnant sur le jardin intérieur, ambiance apaisante.',
    images: [img('1522771739844-6a9f6d5f14af')],
  },
  {
    name: 'Chambre Standard Twin',
    type: 'Standard',
    price: 105,
    capacity: 2,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'TV', '2 lits simples'],
    description: 'Chambre à deux lits séparés, parfaite pour les voyages entre amis.',
    images: [img('1551882547-ff40c63fe5fa')],
  },
  {
    name: 'Chambre Confort Double',
    type: 'Standard',
    price: 130,
    capacity: 2,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'TV 4K', 'Bureau', 'Bouilloire'],
    description: 'Espace confortable avec coin bureau, pensé pour les séjours d’affaires.',
    images: [img('1611892440504-42a792e24d32')],
  },

  // ===== LUXE =====
  {
    name: 'Chambre Deluxe',
    type: 'Luxe',
    price: 220,
    capacity: 2,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'Minibar', 'Baignoire', 'Peignoirs'],
    description: 'Literie haut de gamme, salle de bain en marbre et finitions élégantes.',
    images: [img('1618773928121-c32242e63f39')],
  },
  {
    name: 'Chambre Deluxe Vue Mer',
    type: 'Luxe',
    price: 260,
    capacity: 2,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'Minibar', 'Balcon', 'Vue mer'],
    description: 'Chambre raffinée avec balcon privatif et vue dégagée sur la mer.',
    images: [img('1582719478250-c89cae4dc85b')],
  },
  {
    name: 'Chambre Luxe Prestige',
    type: 'Luxe',
    price: 300,
    capacity: 2,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'Minibar premium', 'Machine à café', 'Coffre-fort'],
    description: 'Le summum du confort : matériaux nobles, lumière naturelle et services premium.',
    images: [img('1631049552057-403cdb8f0658')],
  },

  // ===== SUITE =====
  {
    name: 'Suite Junior',
    type: 'Suite',
    price: 320,
    capacity: 2,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'Salon', 'Minibar', 'Baignoire balnéo'],
    description: 'Suite élégante avec espace salon et baignoire balnéo pour un séjour romantique.',
    images: [img('1590490360182-c33d57733427')],
  },
  {
    name: 'Suite Exécutive',
    type: 'Suite',
    price: 380,
    capacity: 3,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'Salon séparé', 'Bureau', 'Minibar', 'Coffre-fort'],
    description: 'Vaste suite avec salon séparé, idéale pour conjuguer travail et détente.',
    images: [img('1578683010236-d716f9a3f461')],
  },
  {
    name: 'Suite Royale',
    type: 'Suite',
    price: 500,
    capacity: 2,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'Minibar', 'Jacuzzi', 'Vue panoramique'],
    description: 'Suite luxueuse avec jacuzzi privatif et vue panoramique sur la ville.',
    images: [img('1631049307264-da0ec9d70304')],
  },
  {
    name: 'Suite Présidentielle',
    type: 'Suite',
    price: 750,
    capacity: 4,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'Jacuzzi', 'Salon', 'Salle à manger', 'Room service 24h'],
    description: 'Notre suite la plus prestigieuse : espaces multiples, terrasse et service dédié.',
    images: [img('1591088398332-8a7791972843')],
  },

  // ===== FAMILIALE =====
  {
    name: 'Chambre Familiale',
    type: 'Familiale',
    price: 250,
    capacity: 4,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'TV', 'Canapé-lit'],
    description: 'Chambre spacieuse pour les familles, jusqu’à 4 personnes.',
    images: [img('1566665797739-1674de7a421a')],
  },
  {
    name: 'Suite Familiale',
    type: 'Familiale',
    price: 340,
    capacity: 5,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'TV', '2 chambres', 'Coin enfants'],
    description: 'Deux espaces nuit séparés et un coin détente pour toute la famille.',
    images: [img('1560448204-e02f11c3d0e2')],
  },
  {
    name: 'Chambre Familiale Communicante',
    type: 'Familiale',
    price: 290,
    capacity: 6,
    available: true,
    amenities: ['Wifi', 'Climatisation', 'TV', 'Chambres communicantes', 'Double salle de bain'],
    description: 'Deux chambres communicantes idéales pour les grandes familles ou groupes.',
    images: [img('1598928506311-c55ded91a20c')],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connecté à MongoDB (${MONGO_URI}).`);

    // Synchronise les index définis dans les schémas
    await Promise.all([Room.syncIndexes(), User.syncIndexes()]);
    console.log('Index synchronisés.');

    // Chambres (upsert par nom -> idempotent)
    for (const room of rooms) {
      await Room.updateOne({ name: room.name }, { $set: room }, { upsert: true });
    }
    console.log(`${rooms.length} chambres insérées/mises à jour.`);

    // Compte administrateur
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@hotel.com').toLowerCase();
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin déjà présent (${adminEmail}).`);
    } else {
      const hashedPassword = await hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      await User.create({
        name: 'Administrateur',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`Admin créé : ${adminEmail}`);
    }

    console.log('Seed terminé avec succès.');
  } catch (err) {
    console.error('Erreur lors du seed :', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
