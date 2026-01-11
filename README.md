# 🚀 Backend Node.js – Express + Prisma + Auth

Ce projet est une API backend construite avec **Node.js**, **Express**, **Prisma** et une **authentification JWT**. Il fournit une base propre et prête pour la production, avec une structure claire et des tests via **Postman**.

---

## 🧱 Stack technique

* **Node.js**
* **Express.js**
* **Prisma ORM**
* **SQLite / PostgreSQL** (selon l’environnement)
* **JWT (Authentication & Authorization)**
* **Postman** (tests API)

---

## 📁 Structure du projet

```
express-course/
├── prisma/                  # Configuration de la base de données
│   ├── schema.prisma        # Structure de vos données (modèles)
│   └── dev.db               # Le fichier de base de données (SQLite)
├── src/                     # Le code source de votre application
│   ├── controllers/         # Les chefs d'orchestre : reçoivent les requêtes et répondent
│   ├── dto/                 # Filtres de données : choisissent ce qu'on envoie au client
│   ├── lib/                 # Boîte à outils : fonctions utilitaires partagées
│   ├── middlewares/         # Filtres de passage : s'exécutent avant les routes
│   ├── routes/              # Les adresses (points d'entrée) de votre API
│   ├── schemas/             # Définition des règles de validation (Zod)
│   ├── services/            # Les ouvriers : font le vrai travail (calculs, BDD)
│   └── index.js             # Le point de départ du serveur
├── .env                     # Vos secrets et configurations (ne pas partager !)
└── package.json             # Liste des outils et scripts du projet
```

---

## ⚙️ Installation

```bash
git clone https://github.com/kamikael/backend-nodejs.git
cd backend-nodejs
npm install
```

---

## 🔐 Variables d’environnement (.env)

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./prisma/dev.db"
JWT_ACCESS_SECRET=your_secret_key
```

---

## 🗄️ Initialisation de la base de données

```bash
npx prisma migrate dev
npx prisma generate
```

---

## ▶️ Lancer le projet

```bash
npm run dev
```

L’API sera disponible sur :
👉 `http://localhost:3000`

---

# 🔑 AUTHENTIFICATION (Postman)

## 1️⃣ Inscription utilisateur

**POST** `/auth/register`

### Body (JSON)

```json
{
  "email":"darksideinfinity983@gmail.com",
  "password": "password123",
  "firstName": "mbarga",
  "lastName": "kami"
}
```

## 2️⃣ Connexion utilisateur

**POST** `/auth/login`

### Body (JSON)

```json
{
  "email":"darksideinfinity983@gmail.com",
  "password": "password123"
}
```

### Réponse attendue

```json
{
  "ok": true,
  "data": {
    "success": true,
    "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4MTc3NWRjMy03NTRhLTRlODItOGMzZi03YzBkZWZmOTUxYjYiLCJ0eXBlIjoiYWNjZXNzIiwianRpIjoiYzg4MWY0YTEtODljNS00ZjFjLWJjMDgtZGFiOTVkODJhNGQ4Iiwicm5kIjoiMGY0ZWJkZWMzZGMyNjM1MTBmODczNTYzOTZmMGVjOWU4NWViMjFkMDY2MTA4YmE3MTBlMTNiYjEwOGRjNjZmMyIsImlhdCI6MTc2ODEzMzgzMSwiZXhwIjoxNzY4MTM0NzMxfQ.cn298Kn37_klKpK5QV1yG8Q9FG4W2mns0vSI-bth9r4",
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4MTc3NWRjMy03NTRhLTRlODItOGMzZi03YzBkZWZmOTUxYjYiLCJ0eXBlIjoicmVmcmVzaCIsImp0aSI6IjhiYzY3MTBmLTM5YTktNDZiMi1iNTIxLWQwNGM3MWQ5Mzk3ZiIsInJuZCI6IjVkZGE2MzA4ZDI4YzM5MWFmNDE3ZDM2MGY4ZTBlNTVmZjhkMTFmMTkwMDQ1MDYxNWY2ZTA5MzAwMDM3OGY4N2UwMzBhOWViZjMwMjZjMDE3ZmViMmNkZTYxY2VlMmI0ZiIsImlhdCI6MTc2ODEzMzgzMSwiZXhwIjoxNzY4NzM4NjMxfQ.qZX32XYUqIqVZvP6O4dpqfHcn-7QdWTDYOfuueWELEc",
    "user": {
      "id": "81775dc3-754a-4e82-8c3f-7c0deff951b6",
      "email": "darksideinfinity983@gmail.com",
      "firstName": "Jean",
      "lastName": "Claude"
    }
  }
}
```

## 3️⃣ Routes protégées

* **GET** `/users/profile`
* **Headers** : `Authorization: Bearer <JWT_TOKEN>`

## 4️⃣ Email / Vérification / Password reset

* `/email/verify`
* `/email/resend`

## 5️⃣ OAuth / 2FA

* `/oauth/google`
* `/oauth/github`
* `/2fa/enable`
* `/2fa/disable`
* `/2fa/verify`

## 6️⃣ Sessions et sécurité

* `/sessions`
* `/sessions/:id/revoke`
* `/sessions/revoke-all`

---

# 🧪 Checklist de tests Postman

* ✅ Register utilisateur
* ✅ Login utilisateur
* ✅ Accès route protégée avec token
* ❌ Accès sans token (401)
* ❌ Token invalide (403)
* ✅ CRUD utilisateurs et sessions

---

# 🧑‍💻 Auteur et équipe

### **Dev 1 — Base Technique + BDD + Utilitaires (kami)**

* Fondation du projet
* Prisma (migration, seed, helpers)
* Configuration Express, `.env`, sécurité
* Middlewares globaux (error handler, not found)
* Lib utils (password, JWT, logger, async handler, validate)

### **Dev 2 — Authentification de Base (marie jean)**

* Signup / Login / Logout / Refresh Token
* Change password / Forgot password / Reset password
* Routes, controllers, services, schemas
* Collabore étroitement avec Dev 1 pour JWT & password

### **Dev 3 — Email + Vérification + Password Reset (maelle)**

* Email verification, resend verification
* Password reset token, expiration, cleanup
* Services email/token, controllers, routes, DTOs

### **Dev 4 — OAuth + 2FA (kami)**

* OAuth Google/GitHub, création/lien compte
* 2FA TOTP (enable, disable, verify)

### **Dev 5 — Sessions + Sécurité + Statistiques (kami)**

* Session management (list, revoke, revoke all)
* RefreshToken whitelist, AccessToken blacklist
* Rate limiting, login history, device/IP logging

---

# ✅ Git Stratégie

* `main` → stable
* `dev` → intégration en cours
* branches perso :

```
feature/auth (kami)
feature/oauth (jean marie)
feature/email (maelle)
feature/session (kami)
feature/security (kami)
```

---

🔥 Projet prêt pour une production robuste et évolutive.
