# 🗺️ Roadmap — Backend Gestion Hôtelière

> État actuel : backend fonctionnel (monolithe modulaire Express + MongoDB), 8 routeurs montés via une gateway. Plusieurs features sont des stubs et certains câblages manquent. Ce roadmap liste les chantiers, des fondations critiques aux finitions.

---

## Phase 0 — Fondations & hygiène 🔧
*Objectif : un socle propre et sécurisé avant d'ajouter des features.*

- [ ] Créer un `.env.example` (`JWT_SECRET`, `STRIPE_SECRET_KEY`, `MONGO_URI`, `FRONTEND_URL`, `PORT`) + retirer tous les fallbacks en dur
- [ ] Brancher `errorHandler` dans `index.js` (placé **après** les routes)
- [ ] Brancher `logger` et le cors configuré (`middlewares/cors.js`) au lieu de `cors()` nu
- [ ] 🗑️ Supprimer le dossier mort `backend/routes/` (sauf `gateway.js`) et clarifier la structure
- [ ] Corriger le seed `database/mongo-init.js` (`'Confort'` → enum valide, ajouter `capacity`)
- [ ] Factoriser le `verifyToken` dupliqué dans 6 fichiers → un seul middleware partagé

## Phase 1 — Sécurité & correctness 🔒
*Objectif : combler les failles logiques et durcir l'API.*

- [ ] `createReservation` : prendre `userId` depuis `req.user`, pas depuis `req.body`
- [ ] Vérifier les **chevauchements de réservation** + mettre à jour `room.available`
- [ ] Ajouter `helmet` + `express-rate-limit` (surtout sur `/login`, `/register`, `/reset`)
- [ ] Endpoint `GET /api/auth/me` + envisager refresh tokens / logout
- [ ] Centraliser la validation (envisager `zod` ou `express-validator`)

## Phase 2 — Compléter les features stub 🧩
*Objectif : rendre réel ce qui est factice.*

- [ ] **Reset password** : génération de token (hash + expiration en base), envoi email, **mise à jour effective** du mot de passe (`resetController.js`)
- [ ] **2FA** : vrai TOTP (`speakeasy`/`otplib`), champs `twoFactorSecret`/`twoFactorEnabled` sur `User`, flux enroll + verify (`2faController.js`)
- [ ] Service email (Nodemailer / provider) — prérequis pour reset & 2FA

## Phase 3 — Persistance & domaine manquant 💾
*Objectif : combler les trous fonctionnels annoncés dans le README.*

- [ ] Modèle **`Payment`** + persistance des transactions (lier réservation ↔ paiement)
- [ ] Migrer Stripe `charges` (legacy) → **PaymentIntents** + webhook de confirmation
- [ ] Endpoint **Availability** : `GET /api/rooms/availability?checkIn=&checkOut=&guests=`
- [ ] Corriger le calcul des revenus dans `statsController.js` (nb de nuits × prix)

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
