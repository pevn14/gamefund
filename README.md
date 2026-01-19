# GameFund 🎮

Plateforme de crowdfunding dédiée aux créateurs de jeux vidéo indépendants.

> **🧪 Projet Expérimental**
> Projet dont l'objectif principal est d'explorer et de mettre en œuvre la stack **React + Supabase**, entièrement développé avec **Claude Code**.
> Il sert de démonstration technique et de base réutilisable pour de futurs projets similaires.

## 📋 Description

GameFund permet aux développeurs de jeux vidéo de financer leurs projets grâce au soutien de la communauté. Les donateurs peuvent découvrir et soutenir les projets qui les passionnent, suivre leur évolution et participer à la création des jeux de demain.

## 🚀 Stack Technique

| Technologie | Version | Usage |
|------------|---------|-------|
| **React** | 19.x | Framework UI |
| **Vite** | 7.x | Build tool & dev server |
| **Tailwind CSS** | 4.x | Framework CSS |
| **React Router** | 7.x | Routing SPA |
| **Supabase** | 2.89+ | Backend (PostgreSQL + Auth + Storage) |
| **Lucide React** | 0.562+ | Icônes |

## 🎯 Fonctionnalités (MVP)

| Fonctionnalité | Description |
|----------------|-------------|
| **Authentification** | Inscription, connexion, gestion de session |
| **Galerie publique** | Liste des projets avec filtres et recherche |
| **CRUD Projets** | Création, édition, publication, suppression |
| **Système de dons** | Faire des dons avec messages optionnels |
| **Dashboard Créateur** | Gestion projets, statistiques, profil avec avatar |
| **Dashboard Donateur** | Historique des dons, projets soutenus |
| **Dashboard Admin** | Gestion utilisateurs et projets |
| **Profils Créateurs** | Avatar, bio, page créateurs publique |

## 📁 Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Documentation technique complète |
| [TESTING.md](docs/TESTING.md) | Guide de tests E2E |
| [PRD_GameFund.md](docs/PRD_GameFund.md) | Product Requirements Document |
| [DESIGN_GUIDE.md](docs/DESIGN_GUIDE.md) | Guide de design Tailwind v4 |
| [ACTION_PLAN.md](docs/ACTION_PLAN.md) | Plan d'action par phases |
| [PROGRESS.md](docs/PROGRESS.md) | Suivi de progression |
| [SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) | Configuration Supabase |
| [RLS_POLICIES.md](docs/RLS_POLICIES.md) | Politiques Row Level Security |
| [HOWTO.md](docs/HOWTO.md) | Guides pratiques |

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

## 📐 Structure du projet

```
src/
├── components/
│   ├── ui/           # 12 composants UI réutilisables
│   ├── layout/       # Header, Footer, Container, MainLayout
│   ├── projects/     # ProjectCard, ProjectGrid, ProjectFilters...
│   ├── donations/    # DonationCard, DonationForm, DonationsList...
│   ├── dashboard/    # StatsCard, QuickActions, RecentProjectsList
│   ├── profile/      # AvatarUpload, ProfileEditor
│   ├── creators/     # CreatorCard, CreatorsGrid
│   └── admin/        # StatsGrid
├── pages/
│   ├── public/       # ProjectsPage, ProjectDetailPage, CreatorsPage...
│   ├── creator/      # CreatorDashboardPage, CreateProjectPage...
│   └── *.jsx         # LoginPage, SignupPage, AdminDashboardPage...
├── hooks/            # useAuth, useProfile, useAdmin
├── services/         # supabase, authService, projectService...
├── App.jsx           # Routing
└── main.jsx          # Point d'entrée
```

## 🗄️ Base de données

| Table | Description |
|-------|-------------|
| `profiles` | Utilisateurs (id, email, display_name, avatar_url, bio, role) |
| `projects` | Projets (title, description, goal_amount, deadline, status) |
| `donations` | Dons (project_id, donor_id, amount, message) |

**Storage Buckets :**
- `project-images` : Images des projets
- `avatars` : Avatars utilisateurs

## 🎨 Composants UI

12 composants réutilisables dans `src/components/ui/` :

- **Avatar** - Avec fallback initiales
- **Badge** - Statuts avec variants sémantiques
- **Button** - 6 variants, 3 tailles, loading/disabled
- **Card** - Modulaire avec image, contenu, footer
- **FilePicker** - Upload avec drag & drop
- **ImageUpload** - Upload image avec validation
- **Input** - Champs texte avec icônes et erreurs
- **Modal** - Avec overlay et fermeture Escape
- **ProgressBar** - Barres animées
- **Select** - Sélecteurs personnalisés
- **Skeleton** - États de chargement
- **Textarea** - Avec compteur de caractères

## 🔐 Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables
- **JWT** pour l'authentification
- Politiques par rôle (user, admin)

## 🏷️ Version

**v1.0.0** - MVP complet (Phases 1-11b)

## 📄 Licence

[À définir]

---

**🤖 Développé avec Claude Code**
