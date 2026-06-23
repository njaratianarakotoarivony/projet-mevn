# 🏨 Gestion Hôtelière — Application MEVN

Application de réservation hôtelière complète : un **backend Node.js / Express / MongoDB**
et un **frontend Vue 3 (Vite)** au design « hôtel de luxe ». L'utilisateur parcourt les
chambres, vérifie la disponibilité, réserve et paie dans un tunnel fluide ; un espace client
et un espace administrateur complètent l'ensemble.

> 📌 Pour l'état d'avancement et les chantiers restants, voir [ROADMAP.md](./ROADMAP.md).

---

## 🏗️ Architecture

Le backend est un **monolithe modulaire** : un seul processus Express expose une *gateway*
([`backend/routes/gateway.js`](../backend/routes/gateway.js)) qui monte chaque domaine
fonctionnel sous `/api/*`. Le code est organisé **par service** pour rester lisible et
évolutif (chaque service a ses `controllers`, `routes`, `middlewares`, `models`).

```
backend/
├── index.js                 # Point d'entrée : env, sécurité, gateway, error handler
├── config/                  # env (validation), db (connexion Mongo)
├── middlewares/             # auth (JWT partagé), cors, logger, errorHandler
├── routes/gateway.js        # Montage de tous les services sous /api
├── scripts/seed.js          # Seed idempotent (14 chambres + compte admin)
└── services/
    ├── auth/                # Inscription, connexion, /me (JWT, rôles)
    ├── user/                # Profils utilisateurs
    ├── room/                # Chambres (CRUD) + disponibilité
    ├── reservation/         # Réservations (chevauchement, prix, annulation)
    ├── payment/             # Stripe PaymentIntents + persistance + webhook
    ├── stats/               # Statistiques (admin)
    ├── 2fa/                 # TOTP (otplib) : enroll / verify / disable
    ├── reset/               # Réinitialisation de mot de passe (token + email)
    └── email/               # Service email partagé (Nodemailer)

frontend/
└── src/
    ├── pages/               # Dashboard, Rooms, About, Contact, EspaceClient, Auth, ResetPassword, Admin
    ├── components/          # Header, Footer, BookingModal (overlay réservation→paiement)
    ├── services/api.js      # Client Axios + intercepteurs (token, 401)
    ├── store/index.js       # État d'auth réactif (Composition API, sans Pinia)
    └── router/              # Vue Router
```

---

## ✨ Fonctionnalités

### Authentification & sécurité
- Inscription / connexion par **JWT**, mots de passe hachés (**bcrypt**).
- Page d'authentification au design « luxe » (split-screen), avec bascule connexion / inscription.
- Rôles `user` / `admin` ; route `/api/stats` réservée aux admins.
- **2FA TOTP** (otplib) compatible Google Authenticator, avec QR code.
- **Mot de passe oublié** : flux complet de bout en bout — lien « Mot de passe oublié ? »
  sur la connexion → email avec lien sécurisé (token haché + expiration) → page
  `/reset-password` pour définir un nouveau mot de passe.
- Durcissement : **helmet**, **rate-limiting** (global + strict sur `/api/auth` et `/api/reset`),
  CORS configuré, validation des variables d'environnement au démarrage.

### Réservation (tunnel)
- Page **Chambres** = catalogue + recherche de **disponibilité** par dates / personnes.
- **Overlay de réservation** élégant : récap chambre → paiement → confirmation, sans changer de page.
- Backend : détection des **chevauchements**, contrôle de capacité, calcul `prix × nuits`,
  mise à jour de `room.available`, annulation.

### Paiement
- **Stripe PaymentIntents** (remplace l'API legacy `charges`), persistance des transactions
  (modèle `Payment`) et **webhook** de confirmation (`/api/payment/webhook`).

### Espace client & admin
- **Espace Client** : profil + liste de ses réservations (avec annulation).
- **Admin** : tableau de statistiques (revenus, taux d'occupation, etc.).

---

## 🔌 Principaux endpoints API

| Méthode | Endpoint | Accès | Description |
|--------|----------|-------|-------------|
| POST | `/api/auth/register` | public | Inscription |
| POST | `/api/auth/login` | public | Connexion |
| GET  | `/api/auth/me` | auth | Utilisateur courant |
| GET  | `/api/rooms` | public | Liste des chambres |
| GET  | `/api/rooms/availability` | public | Chambres libres (`?checkIn=&checkOut=&guests=`) |
| GET/POST/PUT/DELETE | `/api/rooms/:id?` | public / auth | Détail & gestion des chambres |
| POST | `/api/reservations` | auth | Créer une réservation |
| GET  | `/api/reservations` | auth | Lister les réservations |
| PUT  | `/api/reservations/:id/cancel` | auth | Annuler |
| POST | `/api/payment/pay` | auth | Créer un PaymentIntent |
| POST | `/api/payment/refund` | auth | Remboursement |
| POST | `/api/payment/webhook` | Stripe | Confirmation de paiement |
| GET  | `/api/stats` | admin | Statistiques |
| POST | `/api/2fa/enroll` \| `/verify` \| `/disable` | auth | Authentification à deux facteurs |
| POST | `/api/reset/request-reset` \| `/reset-password` | public | Réinitialisation de mot de passe |

---

## 🚀 Installation & démarrage

### Prérequis
- **Node.js** 18+ et **npm**
- **MongoDB** en local (ou une URI distante)

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env        # puis renseigner les variables (voir ci-dessous)
npm run seed                # crée 14 chambres + le compte admin
npm start                   # API sur http://localhost:3000  (npm run dev pour le hot-reload)
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev                 # interface sur http://localhost:8080
```

> Le port **8080** correspond à `FRONTEND_URL` côté backend (CORS). Le frontend cible
> l'API via `VITE_API_URL` (par défaut `http://localhost:3000/api`).

### Compte administrateur par défaut (après seed)
- **Email** : `admin@hotel.com`
- **Mot de passe** : `admin123`

### Variables d'environnement (`backend/.env`)
| Variable | Rôle |
|----------|------|
| `PORT` | Port du serveur (def. 3000) |
| `MONGO_URI` | Connexion MongoDB |
| `JWT_SECRET` | Secret de signature des tokens |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (test) |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook Stripe (optionnel en dev) |
| `FRONTEND_URL` | Origine autorisée par le CORS |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `EMAIL_FROM` | Service email (sans SMTP, les emails sont loggés en console) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Compte admin créé au seed |

---

## 🛠️ Technologies

**Backend** — Node.js, Express 5, MongoDB / Mongoose, JWT, bcryptjs, helmet,
express-rate-limit, cors, Stripe, Nodemailer, otplib, qrcode, dotenv.

**Frontend** — Vue 3 (Composition API), Vite, Vue Router, Axios, Tailwind CSS
(+ forms / typography / aspect-ratio), CSS personnalisé (thème « luxe »).

---

## 🗄️ Base de données (MongoDB)

Collections principales : `users`, `rooms`, `reservations`, `payments`. Le script
[`scripts/seed.js`](../backend/scripts/seed.js) peuple **14 chambres** variées
(Standard, Luxe, Suite, Familiale) avec photos, et crée le compte administrateur.
Il est **idempotent** (upsert par nom) : réexécutable sans créer de doublons.
