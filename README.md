# GameFund 🎮

Plateforme de crowdfunding dédiée aux créateurs de jeux vidéo indépendants.

> **🧪 Projet Expérimental**
> dont l'objectif principal est d'explorer et de mettre en œuvre la stack **React + Supabase**, entièrement développé avec **Claude Code**.
> Il sert de démonstration technique et de base réutilisable pour de futurs projets similaires.

## 📋 Description

GameFund permet aux développeurs de jeux vidéo de financer leurs projets grâce au soutien de la communauté. Les donateurs peuvent découvrir et soutenir les projets qui les passionnent, suivre leur évolution et participer à la création des jeux de demain.

## 🚀 Stack Technique

- **Frontend** : React 18 + Vite
- **Styling** : Tailwind CSS v4
- **Routing** : React Router v7
- **Backend** : Supabase (PostgreSQL + Auth + Storage)
- **Icons** : Lucide React

## 📁 Documentation

- [🏗️ Architecture](docs/ARCHITECTURE.md) - **Documentation technique complète du projet**
- [📖 PRD - Product Requirements Document](docs/PRD_GameFund.md)
- [🎨 Design Guide](docs/DESIGN_GUIDE.md)
- [📋 Action Plan](docs/ACTION_PLAN.md)
- [✅ Progress Tracker](docs/PROGRESS.md)
- [🔧 Supabase Setup](docs/SUPABASE_SETUP.md)
- [🧪 Tests](docs/TESTS.md)
- [📝 Changelog](docs/CHANGELOG.md)
- [ℹ️ How To](docs/HOWTO.md)

## 🎯 Fonctionnalités

### Phase 1-3 (✅ Terminées)
- ✅ Configuration Tailwind CSS v4
- ✅ 11 composants UI réutilisables
- ✅ Layout responsive avec menu mobile
- ✅ Design system GameFund

### Phases suivantes (⏳ En cours)
- ⏳ Intégration Supabase
- ⏳ Authentification utilisateurs
- ⏳ Galerie de projets publique
- ⏳ CRUD projets (créateurs)
- ⏳ Système de dons
- ⏳ Dashboards (créateur, donateur, admin)

## 🛠️ Installation

```bash
# Cloner le projet
git clone <repository-url>
cd gamefund

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables Supabase dans .env
# VITE_SUPABASE_URL=votre_url
# VITE_SUPABASE_ANON_KEY=votre_cle

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173)

## 📦 Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run lint         # Linter ESLint
```

## 🎨 Composants UI

Le projet inclut 11 composants UI réutilisables :

- **Button** - 6 variants, 3 tailles, états loading/disabled
- **Card** - Composant modulaire avec image, contenu, footer
- **Badge** - Statuts de projets avec variants sémantiques
- **Input** - Champs texte avec icônes et validation
- **Textarea** - Zone de texte avec compteur de caractères
- **ProgressBar** - Barres de progression animées
- **Avatar** - Avatars avec fallback initiales
- **Skeleton** - États de chargement
- **Modal** - Modales avec overlay et animations
- **Select** - Sélecteurs personnalisés
- **FilePicker** - Upload de fichiers avec drag & drop

Voir la démo complète : `/` (page ComponentsDemo)

## 📐 Structure du projet

```
src/
├── components/
│   ├── ui/              # Composants UI réutilisables
│   ├── layout/          # Header, Footer, Container
│   ├── projects/        # Composants projets (à venir)
│   └── donations/       # Composants donations (à venir)
├── pages/
│   ├── public/          # Pages publiques (à venir)
│   ├── creator/         # Pages créateur (à venir)
│   ├── donor/           # Pages donateur (à venir)
│   └── admin/           # Pages admin (à venir)
├── hooks/               # Custom hooks (à venir)
├── services/            # Services Supabase (à venir)
└── utils/               # Utilitaires (à venir)
```

## 🎨 Palette de couleurs

- **Primary** : Purple (#9333ea) - Actions principales
- **Accent** : Green (#22c55e) - Succès, validation
- **Gray** : Échelle complète pour le contenu

## 🏷️ Versions

- **v0.3.0** - Phase 3 : Layout Components complets
- **v0.2.0** - Phase 2 : Composants UI de base
- **v0.1.0** - Phase 1 : Setup & Configuration

## 📄 Licence

[À définir]

## 👥 Contribution

[À définir]

---

**🤖 Développé avec Claude Code**
