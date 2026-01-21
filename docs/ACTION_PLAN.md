# Plan d'Action - GameFund

**Projet** : GameFund - Plateforme de crowdfunding pour jeux vidéo
**Stack** : Vite + React + Tailwind CSS v4 + Supabase
**Statut** : MVP complet (v1.0.0)

---

## Vue d'ensemble

Ce plan décrit les phases de développement du projet GameFund, développé avec Claude Code.

---

## Phases de développement

| Phase | Description | Statut |
|-------|-------------|--------|
| **0** | Prérequis et environnement | ✅ Terminé |
| **1** | Setup Vite & Configuration Tailwind v4 | ✅ Terminé |
| **2** | Composants UI de base (12 composants) | ✅ Terminé |
| **3** | Layout (Header, Footer, Container) | ✅ Terminé |
| **4** | Configuration Supabase (schema, RLS) | ✅ Terminé |
| **5** | Pages d'authentification | ✅ Terminé |
| **6** | Galerie publique de projets | ✅ Terminé |
| **7** | CRUD projets (créateur) | ✅ Terminé |
| **8** | Dashboard créateur | ✅ Terminé |
| **9** | Système de dons | ✅ Terminé |
| **10** | Dashboard donateur | ✅ Terminé |
| **11** | Dashboard admin | ✅ Terminé |
| **11b** | Profils créateurs (avatar, bio) | ✅ Terminé |
| **12** | Polish & Déploiement | ⏳ À faire |

---

## Détail des phases

### Phase 0 : Prérequis

- Node.js v18+
- npm
- Compte Supabase
- VS Code avec Claude Code

### Phase 1 : Setup & Configuration

- Projet Vite + React
- Tailwind CSS v4 avec configuration CSS-first
- React Router, Lucide React, Supabase JS
- Structure de dossiers (components, pages, hooks, services)

### Phase 2 : Composants UI

12 composants réutilisables :
- Avatar, Badge, Button, Card
- FilePicker, ImageUpload, Input, Modal
- ProgressBar, Select, Skeleton, Textarea

### Phase 3 : Layout

- Container responsive
- Header avec navigation et auth
- Footer avec liens
- MainLayout wrapper

### Phase 4 : Supabase

- Schéma de base de données (profiles, projects, donations)
- Types énumérés (user_role, project_status)
- Fonctions PostgreSQL (statistiques, triggers)
- Row Level Security (RLS)
- Storage buckets (project-images, avatars)

### Phase 5 : Authentification

- LoginPage et SignupPage
- useAuth hook (Context API)
- ProtectedRoute et AdminRoute
- Gestion de session persistante

### Phase 6 : Galerie publique

- ProjectsPage (homepage)
- ProjectDetailPage
- ProjectCard, ProjectGrid, ProjectFilters
- Filtres (statut, recherche, tri)

### Phase 7 : CRUD Projets

- CreateProjectPage
- EditProjectPage
- MyProjectsPage
- Upload d'images vers Storage

### Phase 8 : Dashboard créateur

- CreatorDashboardPage
- Statistiques projets
- Actions rapides
- Édition profil

### Phase 9 : Système de dons

- DonationForm
- DonationCard, DonationsList
- ProjectDonationsPage
- Calcul temps réel des montants collectés

### Phase 10 : Dashboard donateur

- DonorDashboardPage
- MyDonationsPage
- SupportedProjectCard
- Historique et statistiques

### Phase 11 : Dashboard admin

- AdminDashboardPage
- AdminUsersPage (gestion utilisateurs)
- AdminProjectsPage (gestion projets)
- StatsGrid avec métriques globales

### Phase 11b : Profils créateurs

- AvatarUpload avec drag & drop
- ProfileEditor (avatar + bio)
- CreatorsPage publique
- CreatorCard, CreatorsGrid
- Bucket Storage avatars

### Phase 12 : Polish & Déploiement (à faire)

- Tests E2E (Playwright)
- Optimisation performances
- Déploiement Vercel
- Documentation finale

---

## Documentation associée

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Documentation technique |
| [TESTING.md](TESTING.md) | Guide de tests E2E |
| [PRD_GameFund.md](PRD_GameFund.md) | Spécifications produit |
| [DESIGN_GUIDE.md](DESIGN_GUIDE.md) | Design system Tailwind v4 |
| [PROGRESS.md](PROGRESS.md) | Suivi détaillé |
| [SUPABASE_SETUP.md](SUPABASE_SETUP.md) | Configuration Supabase |
| [RLS_POLICIES.md](RLS_POLICIES.md) | Politiques de sécurité |

---

**Dernière mise à jour** : Janvier 2026
