# PRD - GameFund : Plateforme de Crowdfunding pour Jeux Vidéo

**Version** : 1.0  
**Date** : 2025-01-01  
**Type** : Projet d'apprentissage  
**Stack** : Vite + React + Supabase

---

## 1. Vue d'ensemble

### 1.1 Objectif

Développer une plateforme web permettant aux créateurs de jeux vidéo de présenter leurs projets et de recevoir des promesses de dons de la part de donateurs, avec accès public en lecture.

### 1.2 Contexte

Projet d'apprentissage pour monter en compétences sur :
- React moderne avec Vite
- Backend-as-a-Service avec Supabase
- Gestion de rôles et permissions (RBAC)
- Architecture full-stack web

### 1.3 Scope initial (MVP)

**Inclus :**
- Gestion complète des utilisateurs (inscription, connexion, profils)
- CRUD complet des projets par les créateurs
- Système de dons avec gestion des donations
- Interface publique de consultation (galerie de projets)
- Dashboard admin avec gestion globale
- Calculs de progression en temps réel

**Exclus du MVP :**
- Paiement réel (montants symboliques uniquement)
- Intelligence artificielle
- Système de récompenses/paliers
- Notifications email
- Commentaires sur projets

---

## 2. Acteurs du système

### 2.1 Visiteur Public (non authentifié)

**Capacités :**
- Consulter la galerie des projets actifs
- Voir les détails complets d'un projet
- Voir la progression (montant collecté, donateurs, temps restant)
- Cliquer sur "Faire un don" → redirection vers login/signup

**Restrictions :**
- Ne peut pas faire de dons
- Ne voit que les projets avec statut `active`

---

### 2.2 Utilisateur (authentifié)

**Rôle** : `user` (par défaut à l'inscription)

**Capacités - Côté Créateur :**
- Créer des projets de jeux vidéo
- Gérer ses propres projets (CRUD)
- Voir les dons reçus sur ses projets
- Publier un projet (draft → active)
- Consulter des statistiques sur ses projets

**Capacités - Côté Donateur :**
- Faire des dons sur les projets actifs
- Consulter l'historique de ses donations
- Modifier/annuler ses donations (si projet encore actif)
- Voir les projets qu'il a soutenus

**Capacités - Général :**
- Éditer son profil (nom, avatar, bio)
- Voir tous les projets actifs (galerie publique)

**Restrictions :**
- Ne peut pas modifier/supprimer les projets des autres
- Ne peut pas voir les projets draft des autres
- Ne peut pas gérer d'autres utilisateurs

---

### 2.3 Admin (super-user)

**Rôle** : `admin`

**Capacités supplémentaires :**
- Voir TOUS les projets (tous statuts, tous créateurs)
- Modifier N'IMPORTE QUEL projet
- Supprimer N'IMPORTE QUEL projet (hard delete)
- Changer manuellement le statut d'un projet
- Voir la liste de tous les utilisateurs
- Désactiver/Réactiver des comptes utilisateurs
- Accès au dashboard global avec statistiques plateforme

**Note** : Les admins sont créés manuellement en base (pas d'inscription publique).

---

## 3. Fonctionnalités détaillées

### 3.1 Gestion des utilisateurs & authentification

#### 3.1.1 Inscription

**User Story :** *En tant que visiteur, je veux créer un compte pour pouvoir créer des projets et/ou faire des dons.*

**Formulaire d'inscription :**
- Email (requis, unique)
- Mot de passe (requis, min 6 caractères)
- Nom d'affichage (optionnel)

**Comportement :**
- À l'inscription, l'utilisateur obtient le rôle `user` par défaut
- Peut immédiatement créer des projets ET faire des dons
- Redirection vers dashboard après inscription

**Règles métier :**
- Email doit être unique
- Profil créé automatiquement dans `profiles` via trigger Supabase

---

#### 3.1.2 Connexion

**User Story :** *En tant qu'utilisateur existant, je veux me connecter pour accéder à mon compte.*

**Formulaire de connexion :**
- Email
- Mot de passe
- Lien "Mot de passe oublié" (optionnel MVP)

**Comportement :**
- Vérification via Supabase Auth
- Redirection vers dashboard selon rôle (user → dashboard général, admin → admin dashboard)
- Session persistante (localStorage)

---

#### 3.1.3 Profil utilisateur

**User Story :** *En tant qu'utilisateur, je veux gérer mon profil pour personnaliser ma présence sur la plateforme.*

**Champs éditables :**
- Nom d'affichage
- Avatar (upload image)
- Bio / Description

**Champs non éditables :**
- Email
- Rôle (sauf par admin)
- Date de création

---

### 3.2 Vue publique (non authentifié)

#### 3.2.1 Page d'accueil - Galerie de projets

**User Story :** *En tant que visiteur, je veux voir tous les projets actifs pour découvrir les jeux à soutenir.*

**Affichage :**
- Grille/cards de projets actifs uniquement
- Card projet affiche :
  - Image/bannière du projet
  - Titre
  - Nom du créateur (avec avatar)
  - Barre de progression visuelle
  - Montant collecté / Montant cible
  - Pourcentage de complétion
  - Jours restants
  - Nombre de donateurs
  - Bouton "Voir détails"

**Filtres disponibles :**
- Tous les projets actifs (défaut)
- Nouveaux projets (tri par date de création DESC)
- Bientôt terminés (deadline < 7 jours)
- Populaires (tri par nombre de donateurs DESC)

**Tri :**
- Par date de création (plus récent / plus ancien)
- Par montant collecté (plus financé / moins financé)
- Par échéance (se termine bientôt / le plus loin)

---

#### 3.2.2 Page détail projet (publique)

**User Story :** *En tant que visiteur, je veux voir les détails complets d'un projet pour décider si je veux le soutenir.*

**Sections :**

**Header :**
- Image/bannière
- Titre
- Créateur (nom + avatar + lien vers profil)
- Tags/Statut

**Statistiques principales :**
- Montant collecté / Montant cible
- Barre de progression détaillée
- Pourcentage de complétion
- Nombre de donateurs
- Jours restants (ou "Terminé" si deadline passée)

**Description :**
- Description complète du projet (markdown ou texte enrichi)

**Liste des dons récents :**
- 10 derniers dons affichés
- Pour chaque don :
  - Avatar + nom du donateur
  - Montant
  - Message (si présent)
  - Date relative (il y a 2 heures, il y a 3 jours, etc.)

**Call-to-action :**
- Bouton "Faire un don"
  - Si non connecté → redirect vers login
  - Si connecté → modal/page de donation

---

### 3.3 Fonctionnalités Créateur

#### 3.3.1 Créer un projet

**User Story :** *En tant que créateur, je veux créer un nouveau projet de jeu pour lever des fonds.*

**Formulaire de création :**
- Titre (requis, 3-200 caractères)
- Description (requis, min 10 caractères, markdown supporté)
- Image/bannière (requis, upload vers Supabase Storage)
- Montant cible (requis, > 0)
- Date d'échéance (requis, date future)

**Comportement :**
- Le projet est créé en statut `draft` par défaut
- Pas visible publiquement tant que non publié
- Possibilité de sauvegarder et continuer plus tard

**Validation :**
- Tous les champs requis doivent être remplis avant publication
- Date d'échéance doit être dans le futur
- Upload d'image avec limite de taille (ex: 5MB max)

---

#### 3.3.2 Lister mes projets

**User Story :** *En tant que créateur, je veux voir la liste de tous mes projets avec leurs statistiques.*

**Affichage :**
- Tableau ou grille de tous les projets du créateur
- Tous statuts confondus (draft, active, completed, failed, cancelled, suspended)

**Colonnes/Informations :**
- Titre
- Image miniature
- Statut (avec badge coloré)
- Montant collecté / Cible
- Pourcentage
- Donateurs
- Jours restants
- Date de création
- Actions (Voir, Éditer, Publier, Supprimer)

**Actions rapides :**
- Voir le projet (vue publique)
- Éditer (selon statut)
- Publier (si draft)
- Supprimer (si draft ET aucun don)

---

#### 3.3.3 Modifier un projet

**User Story :** *En tant que créateur, je veux modifier mon projet pour corriger des erreurs ou mettre à jour des informations.*

**Règles de modification selon statut :**

| Statut     | Titre | Description | Image | Montant | Deadline | Supprimer |
|------------|-------|-------------|-------|---------|----------|-----------|
| draft      | ✅    | ✅          | ✅    | ✅      | ✅       | ✅        |
| active     | ❌    | ✅          | ✅    | ❌      | ❌       | ❌        |
| completed  | ❌    | ❌          | ❌    | ❌      | ❌       | ❌        |
| failed     | ❌    | ❌          | ❌    | ❌      | ❌       | ❌        |
| cancelled  | ❌    | ❌          | ❌    | ❌      | ❌       | ❌        |
| suspended  | ❌    | ✅          | ✅    | ❌      | ❌       | ❌        |

**Comportement :**
- Formulaire pré-rempli avec données existantes
- Champs non modifiables sont désactivés (disabled)
- Message informatif expliquant les restrictions

---

#### 3.3.4 Publier un projet

**User Story :** *En tant que créateur, je veux publier mon projet draft pour qu'il devienne visible et accepte des dons.*

**Condition de publication :**
- Tous les champs requis remplis
- Date d'échéance dans le futur
- Image uploadée

**Comportement :**
- Changement de statut : `draft` → `active`
- Projet devient visible publiquement
- Commence à accepter des dons
- Action irréversible (ne peut pas repasser en draft)

---

#### 3.3.5 Supprimer un projet

**User Story :** *En tant que créateur, je veux supprimer un projet que je ne souhaite plus poursuivre.*

**Règles de suppression :**
- **Suppression possible :** Statut = `draft` ET aucun don reçu
- **Suppression impossible :** Si projet a reçu des dons
  - Alternative : passer en statut `cancelled`

**Comportement :**
- Modal de confirmation avec avertissement
- Suppression définitive (hard delete)
- Si impossible : proposer d'annuler le projet

---

#### 3.3.6 Voir les dons reçus

**User Story :** *En tant que créateur, je veux voir qui a fait un don à mon projet et combien.*

**Page détail projet (vue créateur) :**
- Toutes les infos de la vue publique +
- Liste complète de TOUS les dons (pas seulement les 10 derniers)
- Possibilité de filtrer/trier
- Export CSV (optionnel MVP)

**Informations par don :**
- Avatar + nom du donateur
- Montant
- Message
- Date et heure exactes
- Statut (si donation modifiée/annulée)

---

#### 3.3.7 Dashboard créateur

**User Story :** *En tant que créateur, je veux avoir une vue d'ensemble de mes projets et leurs performances.*

**Widgets :**
- Nombre total de projets (par statut)
- Montant total collecté (tous projets confondus)
- Nombre total de donateurs uniques
- Projet le plus financé

**Graphiques (optionnel MVP) :**
- Évolution des dons dans le temps
- Répartition des projets par statut

**Liste des projets récents :**
- 5 derniers projets modifiés
- Accès rapide

---

### 3.4 Fonctionnalités Donateur

#### 3.4.1 Faire un don

**User Story :** *En tant que donateur, je veux soutenir un projet qui me plaît en faisant un don.*

**Formulaire de don :**
- Montant (requis, > 0, en unité symbolique)
- Message au créateur (optionnel, max 500 caractères)

**Comportement :**
- Accessible depuis la page détail du projet
- Modal ou page dédiée
- Prévisualisation avant confirmation
- Confirmation avec récapitulatif

**Validation :**
- Montant minimum : 1 unité
- Projet doit avoir statut `active`
- Utilisateur doit être authentifié

**Après donation :**
- Message de succès
- Redirection vers "Mes donations" ou retour au projet
- Mise à jour immédiate de la progression du projet

---

#### 3.4.2 Mes donations

**User Story :** *En tant que donateur, je veux voir la liste de tous mes dons pour suivre mes contributions.*

**Affichage :**
- Liste de toutes les donations du donateur
- Tri par date (plus récent en premier)

**Informations par donation :**
- Image du projet
- Titre du projet
- Montant donné
- Message envoyé
- Date du don
- Statut du projet (actif, terminé, échoué, etc.)
- Actions (Modifier, Annuler)

**Filtres :**
- Par statut de projet (actifs, terminés, tous)
- Par montant
- Par date

---

#### 3.4.3 Modifier une donation

**User Story :** *En tant que donateur, je veux modifier le montant ou le message de mon don tant que le projet est actif.*

**Règles de modification :**
- Possible uniquement si `project.status = 'active'`
- Peut modifier :
  - Montant (doit rester > 0)
  - Message

**Comportement :**
- Formulaire pré-rempli
- Validation identique à la création
- Mise à jour du `updated_at`
- Recalcul automatique de la progression du projet

---

#### 3.4.4 Annuler une donation

**User Story :** *En tant que donateur, je veux annuler mon don si je change d'avis et que le projet est encore actif.*

**Règles d'annulation :**
- Possible uniquement si `project.status = 'active'`
- Suppression définitive (hard delete)

**Comportement :**
- Modal de confirmation
- Suppression de la donation
- Recalcul automatique de la progression du projet
- Message de confirmation

---

#### 3.4.5 Dashboard donateur

**User Story :** *En tant que donateur, je veux voir un résumé de mon activité de soutien.*

**Statistiques :**
- Montant total donné
- Nombre de projets soutenus
- Nombre de projets terminés avec succès

**Listes :**
- Projets soutenus actifs (en cours)
- Derniers dons effectués

---

### 3.5 Fonctionnalités Admin

#### 3.5.1 Dashboard admin

**User Story :** *En tant qu'admin, je veux avoir une vue d'ensemble complète de la plateforme.*

**Statistiques globales :**
- Nombre total d'utilisateurs (total, actifs)
- Nombre total de projets (par statut)
- Montant total collecté (tous projets)
- Nombre total de donations

**Graphiques (optionnel MVP) :**
- Évolution des inscriptions
- Évolution des projets créés
- Évolution du montant total collecté

**Accès rapides :**
- Derniers projets créés (tous statuts)
- Derniers utilisateurs inscrits
- Projets signalés/problématiques (future fonctionnalité)

---

#### 3.5.2 Gérer tous les projets

**User Story :** *En tant qu'admin, je veux voir et gérer tous les projets de la plateforme.*

**Liste de tous les projets :**
- Tous créateurs confondus
- Tous statuts confondus

**Filtres admin :**
- Par créateur
- Par statut
- Par montant collecté
- Par date de création

**Actions admin :**
- Voir détails
- Modifier n'importe quel champ
- Changer le statut manuellement (ex: `active` → `suspended`)
- Supprimer définitivement (hard delete, même avec dons)

---

#### 3.5.3 Gérer les utilisateurs

**User Story :** *En tant qu'admin, je veux gérer les comptes utilisateurs de la plateforme.*

**Liste de tous les utilisateurs :**
- Nom, email, rôle
- Date d'inscription
- Statut (actif/désactivé)
- Nombre de projets créés
- Nombre de dons effectués

**Actions admin :**
- Voir le profil détaillé
- Désactiver/Réactiver un compte (`is_active = false/true`)
- Voir tous les projets de l'utilisateur
- Voir tous les dons de l'utilisateur

**Note :** La suppression d'utilisateurs n'est pas dans le MVP (complexe avec cascade)

---

## 4. Modèle de données

### 4.1 Tables

#### profiles
```
id              UUID PRIMARY KEY (FK auth.users)
email           TEXT UNIQUE NOT NULL
display_name    TEXT
avatar_url      TEXT
bio             TEXT
role            user_role DEFAULT 'user'  ('user' | 'admin')
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

#### projects
```
id              UUID PRIMARY KEY
creator_id      UUID (FK profiles)
title           TEXT NOT NULL (3-200 chars)
description     TEXT NOT NULL (min 10 chars)
image_url       TEXT NOT NULL
goal_amount     NUMERIC(10,2) NOT NULL CHECK > 0
deadline        TIMESTAMPTZ NOT NULL
status          project_status DEFAULT 'draft'
                ('draft' | 'active' | 'completed' | 'failed' | 'cancelled' | 'suspended')
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

#### donations
```
id              UUID PRIMARY KEY
project_id      UUID (FK projects)
donor_id        UUID (FK profiles)
amount          NUMERIC(10,2) NOT NULL CHECK > 0
message         TEXT (max 500 chars)
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

### 4.2 Relations

```
profiles (1) ─── creates ──→ (N) projects
profiles (1) ─── makes ────→ (N) donations
projects (1) ─── receives ─→ (N) donations
```

### 4.3 Fonctions utilitaires

**Calculs côté base :**
- `get_project_total_collected(uuid)` : Montant total collecté
- `get_project_donors_count(uuid)` : Nombre de donateurs uniques
- `get_project_completion_percentage(uuid)` : Pourcentage de complétion
- `auto_complete_projects()` : Complétion automatique des projets échus

---

## 5. Statuts de projet & Transitions

### 5.1 États possibles

| Statut     | Description                                    | Visible publiquement | Accepte dons |
|------------|------------------------------------------------|----------------------|--------------|
| draft      | Brouillon, en cours de création                | ❌                   | ❌           |
| active     | Publié, campagne en cours                      | ✅                   | ✅           |
| completed  | Terminé avec succès (montant atteint)          | ✅                   | ❌           |
| failed     | Échoué (deadline passée, montant non atteint)  | ✅                   | ❌           |
| cancelled  | Annulé par le créateur ou admin                | ✅                   | ❌           |
| suspended  | Suspendu temporairement (modération)           | ❌                   | ❌           |

### 5.2 Diagramme de transitions

```
        ┌─────────────────────────────────┐
        │         draft                    │
        │ (création initiale)              │
        └────────────┬────────────────────┘
                     │
                     │ Publication
                     │ (créateur)
                     ▼
        ┌─────────────────────────────────┐
        │         active                   │
        │ (campagne en cours)              │
        └─────┬──────────┬─────────────────┘
              │          │
              │          │ À la deadline:
              │          │ - montant >= goal → completed
              │          │ - montant < goal → failed
              │          │
   Annulation │          ▼
   (créateur/ │    ┌──────────────┐
   admin)     │    │  completed   │
              │    │  ou failed   │
              │    └──────────────┘
              │
              ▼
        ┌─────────────────────────────────┐
        │      cancelled                   │
        │      ou suspended                │
        └─────────────────────────────────┘
```

### 5.3 Règles de transition

**Transitions automatiques :**
- `active` → `completed` si `total_collected >= goal_amount` OU `deadline < NOW()`
- `active` → `failed` si `deadline < NOW()` ET `total_collected < goal_amount`

**Transitions manuelles :**
- `draft` → `active` : Par le créateur (bouton "Publier")
- `active` → `cancelled` : Par le créateur ou admin
- `active` → `suspended` : Par admin uniquement
- `*` → `cancelled` : Admin peut annuler n'importe quel projet

**Transitions interdites :**
- Impossible de repasser en `draft` une fois publié
- Impossible de modifier `completed` ou `failed` (sauf admin)

---

## 6. Architecture technique

### 6.1 Stack technologique

**Frontend :**
- Framework : React 18+
- Build tool : Vite
- Routing : React Router v6
- State management : React Context / Zustand (à décider)
- UI styling : Tailwind CSS
- Client Supabase : @supabase/supabase-js

**Backend (Supabase) :**
- Database : PostgreSQL
- Auth : Supabase Auth
- Storage : Supabase Storage (images de projets)
- Realtime : Supabase Realtime (optionnel)
- Row Level Security : RLS activé sur toutes les tables

**Déploiement :**
- Frontend : Vercel
- Backend : Supabase Cloud (plan gratuit)

### 6.2 Structure de routing

```
/                          → Galerie publique (HomePage)
/projects/:id              → Détail projet (public)
/login                     → Connexion
/signup                    → Inscription

--- Routes protégées (authentification requise) ---
/dashboard                 → Dashboard principal (user ou admin)
/profile                   → Mon profil

--- Routes créateur ---
/my-projects               → Liste de mes projets
/projects/new              → Créer un projet
/projects/:id/edit         → Modifier mon projet
/projects/:id/donations    → Voir les dons de mon projet

--- Routes donateur ---
/my-donations              → Mes donations

--- Routes admin ---
/admin                     → Dashboard admin
/admin/projects            → Tous les projets
/admin/users               → Tous les utilisateurs
```

### 6.3 Composants React clés

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── AdminRoute.jsx
│   │   └── Loader.jsx
│   │
│   ├── projects/
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectGrid.jsx
│   │   ├── ProjectDetail.jsx
│   │   ├── ProjectForm.jsx
│   │   ├── ProgressBar.jsx
│   │   └── ProjectFilters.jsx
│   │
│   ├── donations/
│   │   ├── DonationForm.jsx
│   │   ├── DonationList.jsx
│   │   └── DonationCard.jsx
│   │
│   └── dashboard/
│       ├── UserDashboard.jsx
│       ├── AdminDashboard.jsx
│       └── StatsWidget.jsx
│
├── pages/
│   ├── public/
│   │   ├── HomePage.jsx
│   │   ├── ProjectPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── SignupPage.jsx
│   │
│   ├── creator/
│   │   ├── MyProjectsPage.jsx
│   │   ├── CreateProjectPage.jsx
│   │   └── EditProjectPage.jsx
│   │
│   ├── donor/
│   │   └── MyDonationsPage.jsx
│   │
│   └── admin/
│       ├── AdminDashboardPage.jsx
│       ├── AdminProjectsPage.jsx
│       └── AdminUsersPage.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useProjects.js
│   ├── useDonations.js
│   └── useUser.js
│
├── services/
│   ├── supabase.js
│   ├── authService.js
│   ├── projectService.js
│   └── donationService.js
│
├── utils/
│   ├── formatters.js
│   ├── validators.js
│   └── constants.js
│
└── App.jsx
```

---

## 7. User Stories prioritaires

### P0 - Core (MVP minimum)

**Authentification :**
1. En tant que visiteur, je peux créer un compte
2. En tant qu'utilisateur, je peux me connecter
3. En tant qu'utilisateur, je peux me déconnecter

**Vue publique :**
4. En tant que visiteur, je vois la galerie des projets actifs
5. En tant que visiteur, je vois le détail d'un projet
6. En tant que visiteur, si je clique "Faire un don", je suis redirigé vers login

**Créateur :**
7. En tant que créateur, je peux créer un projet (brouillon)
8. En tant que créateur, je peux publier un projet (draft → active)
9. En tant que créateur, je vois la liste de mes projets
10. En tant que créateur, je peux modifier mon projet (selon statut)
11. En tant que créateur, je peux supprimer mon projet (si aucun don)
12. En tant que créateur, je vois les dons reçus sur mes projets

**Donateur :**
13. En tant que donateur, je peux faire un don sur un projet actif
14. En tant que donateur, je vois la liste de mes donations
15. En tant que donateur, je peux modifier une donation (si projet actif)
16. En tant que donateur, je peux annuler une donation (si projet actif)

**Admin :**
17. En tant qu'admin, je vois TOUS les projets (tous statuts)
18. En tant qu'admin, je peux modifier/supprimer N'IMPORTE QUEL projet
19. En tant qu'admin, je vois la liste de tous les utilisateurs
20. En tant qu'admin, je peux désactiver un utilisateur

### P1 - Important (amélioration UX)

21. Filtres et tri sur la galerie publique
22. Dashboard avec statistiques (tous rôles)
23. Upload d'images optimisées
24. Gestion du profil utilisateur (avatar, bio)
25. Recherche textuelle de projets

### P2 - Nice to have (post-MVP)

26. Notifications (email)
27. Commentaires sur projets
28. Tags/catégories de jeux
29. Export CSV des dons (créateur)
30. Mode sombre
31. Internationalisation (FR/EN)

---

## 8. Règles métier détaillées

### 8.1 Projets

**Création :**
- Titre : 3-200 caractères
- Description : minimum 10 caractères
- Image : requis, max 5MB, formats acceptés : jpg, png, webp
- Montant cible : > 0, en unité symbolique
- Deadline : doit être future par rapport à la date de création

**Publication :**
- Tous les champs requis doivent être remplis
- Passe de `draft` à `active`
- Devient visible publiquement
- Action irréversible (ne peut pas repasser en draft)

**Modification :**
- Voir tableau section 3.3.3
- Un projet `active` ne peut modifier que description et image
- Un projet `completed`, `failed` ou `cancelled` n'est plus modifiable

**Suppression :**
- Hard delete possible si `status = draft` ET aucun don
- Sinon, doit passer par statut `cancelled`
- Admin peut forcer le hard delete même avec dons

**Complétion automatique :**
- Exécutée périodiquement (cron job ou edge function)
- Si `status = active` ET `deadline < NOW()` :
  - Si `total_collected >= goal_amount` → `completed`
  - Sinon → `failed`

---

### 8.2 Donations

**Création :**
- Montant minimum : 1 unité symbolique
- Message optionnel : max 500 caractères
- Projet doit avoir `status = active`
- Utilisateur doit être authentifié

**Modification :**
- Possible uniquement si `project.status = active`
- Peut modifier montant (doit rester > 0) et message

**Annulation :**
- Possible uniquement si `project.status = active`
- Hard delete de la donation
- Recalcul automatique de la progression du projet

**Visibilité :**
- Les donations sont publiques (nom du donateur, montant, message)
- Apparaissent dans la liste publique du projet

---

### 8.3 Utilisateurs

**Inscription :**
- Email unique requis
- Mot de passe min 6 caractères (géré par Supabase)
- Rôle `user` par défaut
- Profil créé automatiquement via trigger

**Rôles :**
- `user` : peut créer des projets ET faire des dons
- `admin` : privilèges supplémentaires, créé manuellement

**Désactivation :**
- Admin peut mettre `is_active = false`
- Utilisateur désactivé ne peut plus se connecter
- Ses projets et dons restent visibles
- Réactivation possible par admin

---

### 8.4 Calculs de progression

**Montant total collecté :**
- Calculé dynamiquement via `SUM(donations.amount)`
- Fonction : `get_project_total_collected(project_id)`

**Nombre de donateurs :**
- Calculé via `COUNT(DISTINCT donor_id)`
- Fonction : `get_project_donors_count(project_id)`

**Pourcentage de complétion :**
- `(total_collected / goal_amount) * 100`
- Peut dépasser 100% (stretch goal)
- Fonction : `get_project_completion_percentage(project_id)`

**Jours restants :**
- `deadline - NOW()`
- Affiché en jours/heures selon la proximité

---

## 9. Sécurité & Permissions (RLS)

### 9.1 Table profiles

| Action | Qui peut ? | Condition |
|--------|-----------|-----------|
| SELECT | Tout le monde | `is_active = true` |
| SELECT | Utilisateur | Son propre profil (même si désactivé) |
| SELECT | Admin | Tous les profils |
| UPDATE | Utilisateur | Son propre profil (sauf champ `role`) |
| UPDATE | Admin | Tous les profils |
| INSERT | Système | Via trigger à l'inscription |

### 9.2 Table projects

| Action | Qui peut ? | Condition |
|--------|-----------|-----------|
| SELECT | Tout le monde | `status = 'active'` |
| SELECT | Créateur | Ses propres projets (tous statuts) |
| SELECT | Admin | Tous les projets |
| INSERT | Utilisateur authentifié | Création de son propre projet |
| UPDATE | Créateur | Ses propres projets |
| UPDATE | Admin | Tous les projets |
| DELETE | Créateur | Ses projets si `draft` ET aucun don |
| DELETE | Admin | Tous les projets |

### 9.3 Table donations

| Action | Qui peut ? | Condition |
|--------|-----------|-----------|
| SELECT | Tout le monde | Toutes les donations (publiques) |
| INSERT | Utilisateur authentifié | Si `project.status = 'active'` |
| UPDATE | Donateur | Ses propres donations ET `project.status = 'active'` |
| DELETE | Donateur | Ses propres donations ET `project.status = 'active'` |
| ALL | Admin | Toutes les donations |

---

## 10. Plan de développement

### Phase 1 : Setup & Auth (1 semaine)

**Objectifs :**
- [x] Initialiser projet Vite + React
- [x] Configurer Supabase (compte, projet, tables, RLS)
- [x] Implémenter login/signup
- [x] Context/hook `useAuth`
- [x] Routing de base + ProtectedRoute

**Livrables :**
- Application démarre
- Utilisateur peut s'inscrire et se connecter
- Redirection selon authentification

---

### Phase 2 : Vue publique (1 semaine)

**Objectifs :**
- [x] Page galerie (HomePage)
- [x] ProjectCard component
- [x] Page détail projet (vue publique)
- [x] Fetch projets depuis Supabase
- [x] ProgressBar component
- [x] Filtres de base

**Livrables :**
- Galerie de projets actifs visible
- Clic sur projet → page détail
- Calculs de progression fonctionnels

---

### Phase 3 : Fonctionnalités Créateur (1.5 semaines)

**Objectifs :**
- [x] Page "Mes projets"
- [x] Formulaire création projet
- [x] Upload image vers Supabase Storage
- [x] Bouton "Publier" (draft → active)
- [x] Édition projet (avec règles selon statut)
- [x] Suppression projet (avec validations)
- [x] Vue détail projet côté créateur (avec dons)

**Livrables :**
- Créateur peut CRUD ses projets
- Upload d'images fonctionnel
- Règles métier respectées

---

### Phase 4 : Fonctionnalités Donateur (1 semaine)

**Objectifs :**
- [x] Formulaire donation
- [x] Liste "Mes donations"
- [x] Modification donation
- [x] Annulation donation
- [x] Dashboard donateur

**Livrables :**
- Utilisateur peut donner
- Gestion complète des donations
- Recalcul progression automatique

---

### Phase 5 : Fonctionnalités Admin (1 semaine)

**Objectifs :**
- [x] Dashboard admin
- [x] Liste tous projets (avec filtres)
- [x] Modification/Suppression tous projets
- [x] Liste utilisateurs
- [x] Désactivation utilisateur

**Livrables :**
- Admin a contrôle complet
- Statistiques globales affichées

---

### Phase 6 : Polish & Déploiement (1 semaine)

**Objectifs :**
- [x] Responsive design (mobile-first)
- [x] Gestion erreurs et loading states
- [x] Validation formulaires côté client
- [x] Fonction auto-complétion projets
- [x] Tests manuels complets
- [x] Déploiement Vercel

**Livrables :**
- Application responsive
- Expérience utilisateur fluide
- Application déployée en production

**Durée totale estimée : 6.5 semaines** (temps partiel)

---

## 11. Critères de succès MVP

### Fonctionnalités
- [ ] Un visiteur voit la galerie de projets actifs
- [ ] Un utilisateur peut s'inscrire, se connecter, se déconnecter
- [ ] Un créateur peut CRUD ses projets avec upload d'image
- [ ] Un donateur peut faire un don et gérer ses donations
- [ ] Un admin peut tout voir et tout modifier
- [ ] Les RLS policies protègent correctement les données
- [ ] Les calculs de progression sont corrects

### Qualité
- [ ] Interface responsive (mobile + desktop)
- [ ] Gestion d'erreurs utilisateur (formulaires, fetch, etc.)
- [ ] Loading states sur toutes les actions async
- [ ] Validation formulaires côté client ET serveur
- [ ] Pas de faille de sécurité évidente

### Déploiement
- [ ] Application déployée sur Vercel
- [ ] Base Supabase configurée en production
- [ ] Variables d'environnement configurées
- [ ] Storage Supabase configuré pour images

---

## 12. Extensions post-MVP

### Fonctionnalités avancées
- Système de paliers/récompenses pour donateurs
- Commentaires sur projets
- Tags/catégories de jeux (RPG, Indie, Action, etc.)
- Recherche full-text (titre, description)
- Notifications email (Supabase + Resend)
- Mode sombre
- Internationalisation (FR/EN)
- Updates de projet pour backers
- FAQ par projet

### Améliorations techniques
- Migration vers TypeScript
- Tests unitaires (Vitest + React Testing Library)
- Tests E2E (Playwright)
- CI/CD (GitHub Actions)
- Monitoring (Sentry)
- Analytics (Plausible ou Umami)
- Optimisation images (WebP, lazy loading)
- Cache côté client (React Query)

### IA & Automatisation
- Agent IA : modération automatique des descriptions
- Agent IA : recommandations personnalisées de projets
- Agent IA : génération de résumés de projets
- Automatisation : emails de relance donateurs
- Automatisation : rapports hebdomadaires créateurs
- Automatisation : détection de fraude

---

## 13. Glossaire

**Termes métier :**
- **Créateur** : Utilisateur qui crée des projets de jeux vidéo
- **Donateur** : Utilisateur qui fait des dons aux projets
- **Projet** : Campagne de financement pour un jeu vidéo
- **Donation** : Contribution financière d'un donateur vers un projet
- **Draft** : Brouillon de projet non publié
- **Goal** : Montant cible à atteindre
- **Deadline** : Date limite de la campagne

**Termes techniques :**
- **RLS** : Row Level Security (sécurité au niveau des lignes)
- **MVP** : Minimum Viable Product (produit minimum viable)
- **CRUD** : Create, Read, Update, Delete
- **Auth** : Authentification
- **Storage** : Stockage de fichiers (images)

---

## Annexe A : Variables d'environnement

Fichier `.env` à créer :

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optionnel (développement)
VITE_APP_ENV=development
VITE_APP_NAME=GameFund
```

---

## Annexe B : Commandes utiles

```bash
# Installation
npm create vite@latest gamefund -- --template react
cd gamefund
npm install

# Dépendances
npm install @supabase/supabase-js react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Développement
npm run dev

# Build production
npm run build
npm run preview

# Déploiement Vercel
vercel deploy
```

---

**Fin du PRD**
