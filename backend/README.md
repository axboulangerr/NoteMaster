# NoteMaster Backend

Backend API pour l'application NoteMaster - un gestionnaire de fichiers Markdown avec conversion de documents.

## Fonctionnalités

- 🔐 Authentification JWT avec inscription/connexion
- 📝 CRUD complet pour les fichiers Markdown
- 🔄 Conversion de fichiers DOC/DOCX vers Markdown
- 🔍 Recherche dans les fichiers
- 👤 Gestion des utilisateurs avec espaces privés
- 🛡️ Sécurisation avec Helmet et CORS

## Technologies utilisées

- Node.js + Express + TypeScript
- SQLite pour la base de données
- JWT pour l'authentification
- Mammoth.js pour la conversion DOC/DOCX vers HTML
- Turndown.js pour la conversion HTML vers Markdown
- Multer pour l'upload de fichiers

## Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Modifier les variables d'environnement selon vos besoins
# Surtout JWT_SECRET en production !
```

## Utilisation

```bash
# Développement avec hot reload
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm start
```

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Fichiers Markdown (authentifiés)
- `GET /api/files` - Liste des fichiers
- `GET /api/files?search=terme` - Recherche dans les fichiers
- `GET /api/files/:id` - Récupérer un fichier
- `POST /api/files` - Créer un fichier
- `PUT /api/files/:id` - Modifier un fichier
- `DELETE /api/files/:id` - Supprimer un fichier

### Conversion (authentifiées)
- `POST /api/convert/convert` - Convertir DOC/DOCX vers Markdown
- `POST /api/convert/html-to-markdown` - Convertir HTML vers Markdown

### Utilitaires
- `GET /api/health` - Statut du serveur

## Structure des données

### Utilisateur
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Fichier Markdown
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Mon document",
  "content": "# Titre\n\nContenu en markdown...",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## Sécurité

- Authentification JWT obligatoire pour toutes les routes protégées
- Validation des données d'entrée
- Isolation des données par utilisateur
- Headers de sécurité avec Helmet
- CORS configuré
- Limitation de taille des fichiers uploadés
