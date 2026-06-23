# 🗺️ Roadmap — Backend Gestion Hôtelière

> État actuel : backend fonctionnel (monolithe modulaire Express + MongoDB), 8 routeurs montés via une gateway. **Phases 0 à 3 terminées** (fondations, sécurité, features stub complétées, persistance). Restent les chantiers de qualité/DX (Phase 4) et le choix d'architecture (Phase 5).

---

## Phase 0 — Fondations & hygiène 🔧
*Objectif : un socle propre et sécurisé avant d'ajouter des features.*

- [x] Créer un `.env.example` (`JWT_SECRET`, `STRIPE_SECRET_KEY`, `MONGO_URI`, `FRONTEND_URL`, `PORT`) + retirer tous les fallbacks en dur
- [x] Brancher `errorHandler` dans `index.js` (placé **après** les routes)
- [x] Brancher `logger` et le cors configuré (`middlewares/cors.js`) au lieu de `cors()` nu
- [x] 🗑️ Supprimer le dossier mort `backend/routes/` (sauf `gateway.js`) et clarifier la structure
- [x] Corriger le seed `database/mongo-init.js` (`'Confort'` → enum valide, ajouter `capacity`)
- [x] Factoriser le `verifyToken` dupliqué dans 6 fichiers → un seul middleware partagé (`middlewares/auth.js`)

## Phase 1 — Sécurité & correctness 🔒
*Objectif : combler les failles logiques et durcir l'API.*

- [x] `createReservation` : prendre `userId` depuis `req.user`, pas depuis `req.body`
- [x] Vérifier les **chevauchements de réservation** + mettre à jour `room.available`
- [x] Ajouter `helmet` + `express-rate-limit` (surtout sur `/login`, `/register`, `/reset`)
- [x] Endpoint `GET /api/auth/me` (refresh tokens / logout : à envisager plus tard)
- [ ] Centraliser la validation (envisager `zod` ou `express-validator`)

## Phase 2 — Compléter les features stub 🧩
*Objectif : rendre réel ce qui est factice.*

- [x] **Reset password** : génération de token (hash SHA-256 + expiration 1 h en base), envoi email, **mise à jour effective** du mot de passe (`resetController.js`)
- [x] **2FA** : vrai TOTP (`otplib`), champs `twoFactorSecret`/`twoFactorEnabled` sur `User`, flux enroll (QR code) + verify + disable (`2faController.js`, routes authentifiées)
- [x] Service email (Nodemailer, fallback mode console si SMTP absent) — `services/email/emailService.js`

## Phase 3 — Persistance & domaine manquant 💾
*Objectif : combler les trous fonctionnels annoncés dans le README.*

- [x] Modèle **`Payment`** + persistance des transactions (lier réservation ↔ paiement)
- [x] Migrer Stripe `charges` (legacy) → **PaymentIntents** + webhook de confirmation (`/api/payment/webhook`, corps brut)
- [x] Endpoint **Availability** : `GET /api/rooms/availability?checkIn=&checkOut=&guests=`
- [x] Corriger le calcul des revenus dans `statsController.js` (somme des `totalPrice` = nuits × prix)

## Phase 4 — Qualité & DX 🧪
*Objectif : fiabilité et maintenabilité.*

- [ ] Tests (Jest/Vitest + Supertest) sur auth, reservations, rooms
- [ ] Pagination/filtres sur les listes (`getAllReservations`, `getAllRooms`)
- [ ] Documentation API (Swagger/OpenAPI)
- [ ] Linter + format (ESLint/Prettier) + CI basique

## Phase 5 — Architecture (optionnel) 🏗️
*Objectif : aligner avec l'ambition « microservices » du README — seulement si réellement voulu.*

- [ ] Trancher : assumer le **monolithe modulaire** (et corriger le README) **ou**
- [ ] Découper en vrais services (process/ports séparés) + gateway proxy + Dockerfiles par service + orchestration

---

**Ordre conseillé :** Phase 0 → 1 → 2/3 en parallèle → 4. La Phase 5 est un choix stratégique à trancher en premier (impacte le README et la structure).

---

## ✅ Avancement (24/06/2026)
Phases **0, 1, 2 et 3 terminées**. Détails notables :
- Sécurité : `helmet`, rate-limit global + strict sur `/api/auth` et `/api/reset`, secrets validés au démarrage.
- Reset password & 2FA TOTP réellement fonctionnels, adossés à un service email partagé.
- Paiement migré vers Stripe **PaymentIntents** avec persistance `Payment` et webhook de confirmation.
- `GET /api/rooms/availability` et calcul des revenus corrigé.

**Reste à faire :** Phase 1 (validation centralisée, optionnelle), Phase 4 (tests, pagination, Swagger, lint/CI) et Phase 5 (décision d'architecture).

> ⚠️ Une vraie clé `STRIPE_SECRET_KEY` et une config SMTP sont nécessaires en production ; sans SMTP, les emails sont seulement loggés (mode console).
