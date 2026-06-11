# Documentation de l'API REST

Base : `http://localhost:3000/api`

- Toutes les réponses sont en JSON.
- L'authentification utilise un **cookie httpOnly `session`** (JWT signé, 7 jours),
  posé automatiquement à l'inscription et à la connexion.
- En cas d'erreur, la réponse contient `{ "erreur": "message explicite" }` avec le
  code HTTP approprié : `400` (validation), `401` (non connecté), `403` (interdit),
  `404` (introuvable), `409` (conflit).

## Authentification

### `POST /api/auth/inscription`

Crée un compte (rôle `LECTEUR` par défaut) et connecte l'utilisateur.

```json
{ "nom": "Prénom Nom", "email": "x@epitech.eu", "password": "8 caractères min" }
```

Réponse `201` : `{ "utilisateur": { "id", "nom", "email", "role" } }`
Erreurs : `400` (validation), `409` (e-mail déjà utilisé).

### `POST /api/auth/connexion`

```json
{ "email": "x@epitech.eu", "password": "…" }
```

Réponse `200` : `{ "utilisateur": { … } }` — Erreur `401` si identifiants incorrects.

### `POST /api/auth/deconnexion`

Supprime le cookie de session. Réponse : `{ "ok": true }`.

### `GET /api/auth/moi`

Réponse : `{ "utilisateur": { … } }` ou `{ "utilisateur": null }`.

## Articles

### `GET /api/articles`

Liste paginée des articles **publiés**.

| Paramètre    | Description                                                    |
| ------------ | -------------------------------------------------------------- |
| `q`          | Recherche plein texte (titre, extrait, contenu, insensible à la casse) |
| `categorie`  | Slug de catégorie (ex. `esport-gaming`)                        |
| `tri`        | `recent` (défaut) · `populaire` (réactions) · `commentes`      |
| `page`       | Numéro de page (9 articles par page)                           |
| `brouillons` | `1` : brouillons du rédacteur connecté (tous pour un admin)    |

Réponse :

```json
{
  "articles": [
    {
      "id": "…", "titre": "…", "slug": "…", "extrait": "…",
      "imageUrl": "…", "publie": true, "aLaUne": false, "vues": 42,
      "createdAt": "…",
      "auteur": { "id": "…", "nom": "…" },
      "categorie": { "id": "…", "nom": "…", "slug": "…" },
      "_count": { "commentaires": 3, "reactions": 5 }
    }
  ],
  "pagination": { "page": 1, "totalPages": 2, "total": 12 }
}
```

### `POST /api/articles` 🔒 Rédacteur/Admin

```json
{
  "titre": "5–150 caractères",
  "extrait": "10–300 caractères",
  "contenu": "50 caractères minimum (paragraphes séparés par une ligne vide)",
  "imageUrl": "https://… (optionnel)",
  "categorieId": "…",
  "publie": false,
  "aLaUne": false
}
```

Réponse `201`. Le `slug` est généré automatiquement (unique).

### `GET /api/articles/{id}`

Accepte l'`id` **ou** le `slug`. Les brouillons ne sont visibles que par leur auteur
ou un admin (`404` sinon).

### `PUT /api/articles/{id}` 🔒 Auteur ou Admin

Même corps que le `POST`. Un rédacteur ne peut modifier que ses propres articles.

### `DELETE /api/articles/{id}` 🔒 Auteur ou Admin

Réponse : `{ "ok": true }`. Supprime aussi commentaires et réactions (cascade).

## Commentaires

### `GET /api/articles/{id}/commentaires`

Réponse : `{ "commentaires": [ { "id", "contenu", "createdAt", "auteur": { "id", "nom", "role" } } ] }`
(du plus récent au plus ancien).

### `POST /api/articles/{id}/commentaires` 🔒 Connecté

```json
{ "contenu": "2 à 1000 caractères" }
```

### `DELETE /api/commentaires/{id}` 🔒 Auteur du commentaire ou Admin

## Réactions

Types disponibles : `LIKE` 👍 · `LOVE` ❤️ · `BRAVO` 👏 · `INTERESSANT` 💡
Un utilisateur a **une seule réaction par article**.

### `GET /api/articles/{id}/reactions`

```json
{ "comptes": { "LIKE": 3, "LOVE": 1, "BRAVO": 0, "INTERESSANT": 2 }, "maReaction": "LIKE" }
```

### `POST /api/articles/{id}/reactions` 🔒 Connecté

```json
{ "type": "LOVE" }
```

Comportement *toggle* : re-cliquer le même type retire la réaction ;
un autre type remplace l'existante. Réponse : compteurs à jour + `maReaction`.

## Catégories

### `GET /api/categories`

```json
{ "categories": [ { "id", "nom", "slug", "nbArticles" } ] }
```

## Utilisateurs 🔒 Admin uniquement

### `GET /api/utilisateurs`

Liste complète avec compteurs d'articles et de commentaires.

### `PATCH /api/utilisateurs/{id}`

```json
{ "role": "ADMIN" | "REDACTEUR" | "LECTEUR" }
```

Un admin ne peut pas modifier son propre rôle.

### `DELETE /api/utilisateurs/{id}`

Supprime le compte et son contenu (cascade). Un admin ne peut pas se supprimer lui-même.
