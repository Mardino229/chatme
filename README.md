

# ChatMe

ChatMe est une application de messagerie instantanée avec une architecture moderne composée d’un frontend (React + Vite) et d’un backend (Node.js + Express + Prisma).

---

## Fonctionnalités principales
- Authentification des utilisateurs (inscription, connexion, déconnexion)
- Gestion des conversations et des messages en temps réel
- Sécurité avec gestion des tokens et chiffrement
- Interface utilisateur moderne et responsive

---

## Structure du projet

```
chatme/
├── backend/      # API Express, Prisma, contrôleurs, routes, middlewares
├── frontend/     # Application React, composants, pages, hooks, assets
└── README.md     # Ce fichier
```

---

## Backend

### Technologies
- Node.js, Express, Prisma
- Base de données : PostgreSQL
- Authentification : JWT, cookies sécurisés
- WebSocket : messagerie en temps réel

### Prérequis
- Node.js (>= 18)
- pnpm
- Base de données compatible Prisma

### Installation & Démarrage
1. Installer les dépendances :
  ```bash
  cd backend
  pnpm install
  ```
2. Configurer la base de données :
  - Modifier `prisma/schema.prisma` selon votre configuration
  - Appliquer les migrations :
    ```bash
    pnpm prisma migrate deploy
    ```
3. Démarrer le serveur :
  ```bash
  pnpm start
  ```

### Scripts
- `pnpm start` : démarre le backend
- `pnpm prisma migrate deploy` : applique les migrations Prisma

---

## Frontend

### Technologies
- React, TypeScript, Vite

### Prérequis
- Node.js (>= 18)
- pnpm

### Installation & Démarrage
1. Installer les dépendances :
  ```bash
  cd frontend
  pnpm install
  ```
2. Démarrer l’application :
  ```bash
  pnpm dev
  ```

### Scripts 
- `pnpm dev` : démarre le frontend en mode développement


