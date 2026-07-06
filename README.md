# 📰 Journal Web Étudiant — Epitech

Plateforme web servant de journal étudiant pour Epitech : actualités, événements,
interviews, projets et vie étudiante, avec commentaires, réactions et recherche.

> Projet réalisé dans le cadre du module de projet personnel.
> Cahier des charges : [`docs/cahier_des_charges_epitech.pdf`](docs/cahier_des_charges_epitech.pdf)

## ✨ Fonctionnalités

- **Articles** : création, modification, suppression, brouillons, mise à la une, image de couverture
- **9 catégories** : actualités école, événements, clubs, interviews, vie étudiante, projets, stages, esport, culture
- **Comptes & rôles** : Administrateur / Rédacteur / Lecteur (JWT en cookie httpOnly, mots de passe hashés bcrypt)
- **Interactions** : commentaires, 4 réactions (👍 ❤️ 👏 💡), partage (X, Facebook, LinkedIn, WhatsApp, copie de lien)
- **Recherche & filtres** : plein texte (titre/extrait/contenu), filtre par catégorie, tri récent/populaire/commenté, pagination
- **Administration** : tableau de bord avec statistiques, gestion des articles, gestion des utilisateurs et des rôles
- **Bonus** : mode sombre, articles similaires, design responsive mobile/PC

## 🛠 Stack technique

| Couche          | Choix                                              |
| --------------- | -------------------------------------------------- |
| Framework       | **Next.js 16** (App Router, React 19, TypeScript)  |
| Styles          | **Tailwind CSS 4**                                 |
| Base de données | **PostgreSQL 16** (Docker) + **Prisma 6** (ORM)    |
| Auth            | JWT signé (jose) en cookie httpOnly + bcryptjs     |
| Validation      | Zod (toutes les entrées API)                       |

## 🚀 Démarrage rapide

Prérequis : Node.js ≥ 20, Docker.

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env

# 3. Lancer PostgreSQL
docker compose up -d

# 4. Créer le schéma et insérer les données de démo
npx prisma migrate dev
npx prisma db seed

# 5. Lancer le serveur de développement
npm run dev
```

Le site est disponible sur [http://localhost:3000](http://localhost:3000).

### Comptes initiaux 

Le seed crée uniquement les catégories et deux comptes (aucune donnée de démonstration) :

| E-mail                     | Mot de passe     | Rôle                          |
| -------------------------- | ---------------- | ----------------------------- |
| `nisrine.zato@epitech.eu`  | `Freeproject123` | Administrateur                |
| `jury@epitech.eu`          | `JuryDemo2026`   | Administrateur (évaluation)   |

Le compte `jury@epitech.eu` est destiné à l'évaluation du projet par le jury.

## 📁 Structure du projet

```
prisma/
  schema.prisma        # Modèles : User, Category, Article, Comment, Reaction
  seed.ts              # Données de démonstration
src/
  app/
    api/               # API REST (voir docs/API.md)
    admin/             # Tableau de bord, gestion articles & utilisateurs
    articles/          # Liste (recherche/filtres) + détail
    categories/        # Vue par catégorie
    connexion/         # Authentification
    inscription/
  components/          # Composants UI (cartes, commentaires, réactions…)
  lib/
    auth.ts            # Sessions JWT + helpers de rôles
    prisma.ts          # Client Prisma (singleton)
    validations.ts     # Schémas Zod
    utils.ts           # Slugs, dates, constantes
docs/
  API.md               # Documentation complète de l'API REST
```

## 🔐 Rôles et permissions

| Action                          | Lecteur | Rédacteur       | Admin |
| ------------------------------- | :-----: | :-------------: | :---: |
| Lire les articles publiés       | ✅      | ✅              | ✅    |
| Commenter / réagir              | ✅      | ✅              | ✅    |
| Créer / modifier des articles   | ❌      | ✅ (les siens)  | ✅ (tous) |
| Supprimer un commentaire        | le sien | le sien         | tous  |
| Gérer les utilisateurs et rôles | ❌      | ❌              | ✅    |

## 🧰 Scripts utiles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # ESLint
npm run db:migrate   # Migration Prisma
npm run db:seed      # (Ré)insérer les données de démo
npm run db:studio    # Interface graphique de la base
```

## ☁️ Déploiement

Le projet se déploie sur **Vercel** (ou Render/Railway) :

1. Créer une base PostgreSQL **managée et toujours disponible** (Neon recommandé, ou Supabase/Railway). La base Docker locale n'est **pas** accessible depuis un site déployé.
2. Définir les variables d'environnement `DATABASE_URL` (celle de la base managée) et `JWT_SECRET`.
3. Exécuter `npx prisma migrate deploy` puis `npx prisma db seed`.
4. Déployer.

> **Images de couverture** : l'upload écrit dans `public/uploads/`, ce qui fonctionne en local mais **pas sur Vercel** (système de fichiers en lecture seule). En production, brancher un stockage objet (Vercel Blob, Cloudinary ou Supabase Storage).

## 👥 L'équipe

| Nom              | Rôle                              |
| ---------------- | --------------------------------- |
| Nisrine Zato     | Chef de projet / Fullstack        |
| Brandon Houssou  | Frontend principal                |
| Justice H.       | Backend principal                 |
| Theophore B.     | Fonctionnalités sociales          |
| Harys S.         | DevOps / QA / Documentation       |
