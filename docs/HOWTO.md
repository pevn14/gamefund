# HOWTO - GameFund

Guide pratique pour installer et utiliser le projet GameFund.

---

## Installation rapide

### Prérequis

- Node.js v18+
- npm
- Compte Supabase (gratuit)

### Étapes

```bash
# 1. Cloner le projet
git clone <repository-url>
cd gamefund

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos credentials Supabase

# 4. Lancer le serveur
npm run dev
```

L'application sera accessible sur http://localhost:5173

---

## Configuration Supabase

### 1. Créer un projet Supabase

1. Aller sur https://supabase.com
2. Créer un nouveau projet
3. Noter l'URL et la clé publique (anon key)

### 2. Configurer la base de données

Exécuter le script SQL dans l'éditeur SQL de Supabase :

```bash
# Le script se trouve dans :
supabase/schema.sql
```

### 3. Configurer le Storage

Exécuter le script pour le bucket avatars :

```bash
supabase/add_avatar_storage.sql
```

### 4. Variables d'environnement

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualiser le build |
| `npm run lint` | Linter ESLint |

---

## Structure du projet

```
src/
├── components/       # Composants React
│   ├── ui/          # Composants réutilisables
│   ├── layout/      # Header, Footer, etc.
│   ├── projects/    # Composants projets
│   ├── donations/   # Composants dons
│   └── ...
├── pages/           # Pages de l'application
├── hooks/           # Custom hooks
├── services/        # Services Supabase
├── App.jsx          # Routing
└── main.jsx         # Point d'entrée
```

---

## Routes principales

### Publiques

| Route | Description |
|-------|-------------|
| `/` | Galerie de projets (homepage) |
| `/projects/:id` | Détail d'un projet |
| `/creators` | Liste des créateurs |
| `/about` | À propos |
| `/faq` | FAQ |
| `/login` | Connexion |
| `/signup` | Inscription |

### Protégées (authentification requise)

| Route | Description |
|-------|-------------|
| `/dashboard` | Dashboard créateur |
| `/dashboard/projects` | Mes projets |
| `/projects/create` | Créer un projet |
| `/projects/:id/edit` | Éditer un projet |
| `/donor-dashboard` | Dashboard donateur |
| `/my-donations` | Historique des dons |

### Admin (rôle admin requis)

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard admin |
| `/admin/users` | Gestion utilisateurs |
| `/admin/projects` | Gestion projets |

---

## Rôles utilisateurs

| Rôle | Permissions |
|------|-------------|
| **user** | Créer des projets, faire des dons, gérer son profil |
| **admin** | Tout + gestion utilisateurs et tous les projets |

Pour promouvoir un utilisateur admin, exécuter dans Supabase SQL :

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'email@example.com';
```

---

## Déploiement

### Vercel (recommandé)

1. Connecter le repo GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer

### Variables d'environnement production

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_production
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Documentation technique complète |
| [TESTING.md](TESTING.md) | Guide de tests E2E |
| [PRD_GameFund.md](PRD_GameFund.md) | Spécifications produit |
| [DESIGN_GUIDE.md](DESIGN_GUIDE.md) | Design system Tailwind v4 |
| [SUPABASE_SETUP.md](SUPABASE_SETUP.md) | Configuration détaillée Supabase |
| [RLS_POLICIES.md](RLS_POLICIES.md) | Politiques de sécurité |

---

**Version** : 1.0.0 (MVP)
