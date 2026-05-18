# 🏨 Hotel Management App — MEVN Stack

Application de gestion hôtelière fullstack avec architecture microservices.

## 🛠 Stack Technique
- **Backend** : Node.js, Express.js, MongoDB (Mongoose), Redis
- **Frontend** : Vue.js 3, Pinia, Vue Router, Tailwind CSS (Glassmorphisme)
- **Auth** : JWT (Access + Refresh tokens), 2FA (TOTP/SMS/Email)
- **Paiements** : Stripe / PayPal
- **API Gateway** : Express Gateway unique

## 📁 Structure

```
hotel-app/
├── backend/
│   ├── gateway/            # API Gateway (point d'entrée unique)
│   ├── auth-service/       # Authentification (login, signup, tokens)
│   ├── reservation-service/# Réservations + token de réservation
│   ├── room-service/       # Chambres (CRUD, disponibilité)
│   ├── payment-service/    # Paiements (Stripe/PayPal)
│   ├── user-service/       # Gestion utilisateurs
│   ├── stats-service/      # Statistiques (agrégations MongoDB)
│   ├── 2fa-service/        # Double authentification
│   ├── reset-service/      # Reset password
│   └── common/             # Middlewares, config DB, logger, utils
└── frontend/
    └── src/
        ├── pages/          # Dashboard, Rooms, Reservations, Payments, Availability, Auth
        ├── components/     # Composants réutilisables (cards, modals)
        ├── layouts/        # Layouts (dashboard, auth)
        ├── store/          # Pinia (state management)
        ├── router/         # Routes Vue
        └── services/       # Axios API calls
```

## 🚀 Lancement rapide

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## 📌 Modules
1. **Chambres** — CRUD + disponibilité
2. **Réservations** — Création, modification, annulation, token
3. **Paiements** — Stripe/PayPal, suivi transactions
4. **Disponibilité** — Vérification en temps réel
5. **Statistiques** — Revenus, taux d'occupation
6. **Sécurité** — 2FA, reset password, JWT
