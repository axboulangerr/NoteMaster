# NoteMaster

![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

Un gestionnaire de fichiers Markdown moderne avec conversion de documents DOC/DOCX.

## 🚀 Fonctionnalités

- **Authentification sécurisée** : Système d'inscription/connexion avec JWT
- **Éditeur Markdown avancé** : Interface divisée avec aperçu en temps réel
- **Conversion de documents** : Convertissez vos fichiers DOC/DOCX en Markdown
- **Gestion de fichiers** : Organisez, recherchez et gérez vos documents
- **Interface moderne** : Design responsive et intuitive
- **Sauvegarde automatique** : Ne perdez jamais votre travail
- **Espaces utilisateur privés** : Chaque utilisateur a son propre espace

## 🛠️ Technologies

### Backend
- Node.js + Express + TypeScript
- SQLite (base de données)
- JWT (authentification)
- Mammoth.js (conversion DOC/DOCX)
- Turndown.js (HTML vers Markdown)

### Frontend
- React 18 + TypeScript
- React Router (navigation)
- Styled Components (styling)
- React Markdown (aperçu)
- Axios (API)

## 📦 Installation

### Prérequis
- Node.js 16+
- npm ou yarn

### 1. Cloner le projet
```bash
git clone <repository-url>
cd NoteMaster
```

### 2. Installation du backend
```bash
cd backend
npm install
cp .env.example .env
# Modifier les variables d'environnement dans .env
npm run dev
```

### 3. Installation du frontend
```bash
cd ../frontend
npm install
# Le fichier .env est déjà configuré
npm start
```

### 4. Accéder à l'application
- Frontend : http://localhost:3000
- Backend API : http://localhost:3001/api

## 🎯 Utilisation

### Première utilisation
1. Accédez à http://localhost:3000
2. Créez un compte via "S'inscrire"
3. Connectez-vous avec vos identifiants

### Créer un document
1. Cliquez sur "Nouveau document" dans le tableau de bord
2. Donnez un titre à votre document
3. Rédigez en Markdown dans l'éditeur
4. L'aperçu se met à jour en temps réel
5. La sauvegarde est automatique

### Convertir un document
1. Dans le tableau de bord, utilisez la section "Convertir un document"
2. Glissez-déposez ou sélectionnez un fichier .doc/.docx
3. Cliquez sur "Convertir en Markdown"
4. Prévisualisez le résultat et sauvegardez

### Organiser vos documents
- Utilisez la barre de recherche pour trouver vos documents
- Cliquez sur un document pour l'ouvrir
- Utilisez l'icône 🗑️ pour supprimer un document

## 🔧 Configuration

### Variables d'environnement Backend (.env)
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DB_PATH=./data/notemaster.db
```

### Variables d'environnement Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 📁 Structure du projet

```
NoteMaster/
├── backend/                    # API Node.js
│   ├── src/
│   │   ├── routes/            # Routes API
│   │   ├── auth.ts            # Service d'authentification
│   │   ├── database.ts        # Gestion SQLite
│   │   ├── fileService.ts     # CRUD fichiers
│   │   └── index.ts           # Serveur principal
│   ├── data/                  # Base de données SQLite
│   └── uploads/               # Fichiers temporaires
├── frontend/                  # Interface React
│   ├── src/
│   │   ├── components/        # Composants React
│   │   ├── contexts/          # Contextes (Auth)
│   │   ├── services/          # Services API
│   │   └── types/             # Types TypeScript
└── README.md
```

## 🔐 Sécurité

- Authentification JWT avec expiration
- Hashage des mots de passe avec bcrypt
- Isolation des données par utilisateur
- Validation des données côté client et serveur
- Headers de sécurité avec Helmet
- CORS configuré

## 🚀 Déploiement

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Servir les fichiers du dossier build/
```

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🐛 Problèmes connus

- La conversion de documents très volumineux peut prendre du temps
- Certains éléments complexes de Word peuvent ne pas être parfaitement convertis

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que les deux serveurs (backend et frontend) sont démarrés
2. Consultez les logs dans la console du navigateur et du terminal
3. Vérifiez la configuration des variables d'environnement

## 🎉 Fonctionnalités à venir

- [ ] Export PDF des documents Markdown
- [ ] Thèmes personnalisés pour l'éditeur
- [ ] Collaboration en temps réel
- [ ] Organisation en dossiers
- [ ] Mode hors ligne
- [ ] Import depuis d'autres formats (HTML, PDF)
