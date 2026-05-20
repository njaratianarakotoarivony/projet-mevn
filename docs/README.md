# Projet de Gestion Hôtelière

Ce projet est une application de gestion hôtelière complète, construite avec une architecture microservices en backend (Node.js/Express/MongoDB) et un frontend moderne en Vue.js avec Tailwind CSS et un design glassmorphisme.

## Architecture

L'application est divisée en plusieurs microservices pour le backend et une application frontend pour l'interface utilisateur.

### Backend (Microservices)

Le backend est composé des services suivants :

- **API Gateway** : Point d'entrée unique pour toutes les requêtes frontend, routant vers les microservices appropriés.
- **Auth Service** : Gère l'authentification des utilisateurs (inscription, connexion, JWT).
- **Reservation Service** : Gère les réservations de chambres.
- **Room Service** : Gère les informations sur les chambres et leur disponibilité.
- **Payment Service** : Intègre un système de paiement (Stripe).
- **Stats Service** : Collecte et agrège les statistiques d'utilisation et financières.
- **User Service** : Gère les profils utilisateurs.
- **2FA Service** : Gère l'authentification à deux facteurs.
- **Reset Service** : Gère la réinitialisation des mots de passe.

### Frontend (Vue.js)

Le frontend est une application Vue.js réactive, stylisée avec Tailwind CSS et un effet glassmorphisme. Il inclut les pages suivantes :

- **Dashboard** : Vue d'ensemble et statistiques.
- **Rooms** : Gestion et affichage des chambres.
- **Reservations** : Gestion des réservations.
- **Payments** : Historique des transactions.
- **Availability** : Vérification de la disponibilité des chambres.
- **Auth** : Pages d'authentification (connexion, inscription).

## Base de Données

Le projet utilise MongoDB comme base de données, avec plusieurs collections pour stocker les informations relatives aux chambres, réservations, paiements, utilisateurs et statistiques.

## Installation et Démarrage

Des instructions détaillées pour l'installation et le démarrage de l'application, ainsi que les dépendances nécessaires, sont fournies dans ce document et dans le fichier `requirements.txt`.

## Technologies Utilisées

### Backend

- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT (jsonwebtoken)
- bcryptjs
- cors
- Stripe

### Frontend

- Vue.js
- Vue Router
- Pinia (gestion d'état)
- Axios
- Tailwind CSS
- PostCSS, Autoprefixer
- @tailwindcss/forms, @tailwindcss/typography, @tailwindcss/aspect-ratio

## Auteurs

Ce projet a été développé par Manus AI.
