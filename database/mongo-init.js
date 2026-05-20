db = db.getSiblingDB('hotel_management');

db.createCollection('rooms');
db.createCollection('reservations');
db.createCollection('payments');
db.createCollection('users');
db.createCollection('stats');

db.rooms.insertMany([
  { name: 'Suite Royale', type: 'Luxe', price: 500, available: true },
  { name: 'Chambre Standard', type: 'Standard', price: 100, available: true },
  { name: 'Chambre Familiale', type: 'Confort', price: 250, available: true }
]);

console.log('Base de données initialisée avec succès.');
