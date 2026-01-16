# Plan de Développement - Phase 11 : Dashboard Admin

**Date de création** : 13 janvier 2026
**Phase** : 11 - Dashboard Admin
**Objectif** : Interface d'administration minimaliste et efficace pour superviser la plateforme

---

## 📋 Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Composants à créer](#2-composants-à-créer)
3. [Pages à créer](#3-pages-à-créer)
4. [Services et hooks](#4-services-et-hooks)
5. [Routes et navigation](#5-routes-et-navigation)
6. [Fonctionnalités détaillées](#6-fonctionnalités-détaillées)
7. [Data-testid pour tests E2E](#7-data-testid-pour-tests-e2e)
8. [Ordre de développement](#8-ordre-de-développement)
9. [Validation et tests](#9-validation-et-tests)

---

## 1. Vue d'ensemble

### 1.1 Objectifs de la phase

Cette phase crée un **dashboard admin minimaliste et efficace** pour la supervision complète de la plateforme.

**Philosophie de design :**
- ✅ **Minimaliste** : Pas de fioritures, design épuré
- ✅ **Efficacité** : Actions directes, navigation rapide
- ✅ **Densité d'information** : Tableaux compacts, vues en liste
- ✅ **Contrôle total** : Accès à toutes les données et actions critiques

**Capacités admin :**
- Vue d'ensemble de la plateforme (stats globales)
- Gestion complète des projets (tous statuts, tous créateurs)
- Gestion des utilisateurs (liste, désactivation, réactivation)
- Supervision des donations
- Actions rapides sans confirmation excessive

**Différence avec dashboards utilisateurs :**
- Pas de graphiques fantaisistes
- Tableaux denses avec toutes les colonnes importantes
- Actions en masse possibles
- Accès sans restriction (RLS bypassé via service_role ou policies admin)

---

### 1.2 User Stories

**US 11.1** - *En tant qu'admin, je veux voir une vue d'ensemble de la plateforme avec stats clés pour superviser rapidement.*

**US 11.2** - *En tant qu'admin, je veux voir TOUS les projets (draft, active, completed, cancelled, failed, suspended) pour avoir le contrôle total.*

**US 11.3** - *En tant qu'admin, je veux pouvoir modifier le statut d'un projet (activer, suspendre, annuler) en un clic.*

**US 11.4** - *En tant qu'admin, je veux voir la liste complète de tous les utilisateurs avec leur rôle et statut.*

**US 11.5** - *En tant qu'admin, je veux désactiver/réactiver un compte utilisateur.*

**US 11.6** - *En tant qu'admin, je veux accéder aux pages de détail de n'importe quel projet pour le modifier.*

---

### 1.3 Prérequis

**Déjà implémenté :**
- ✅ Authentification (Phase 5)
- ✅ Système de rôles (`user` / `admin`) en base
- ✅ CRUD Projets (Phase 7)
- ✅ Système de dons (Phase 9)
- ✅ Dashboards créateur et donateur (Phases 8 & 10)

**À développer :**
- Dashboard admin avec stats globales
- Page gestion projets (tous)
- Page gestion utilisateurs
- Hook `useAdmin` pour vérifier rôle admin
- Route protection `AdminRoute`
- Services admin étendus

**Base de données :**
- Colonne `role` existe déjà dans table `profiles` (enum: 'user', 'admin')
- Colonne `is_active` existe pour désactiver comptes
- RLS policies doivent permettre aux admins de tout voir

---

## 2. Composants à créer

### 2.1 AdminRoute

**Fichier** : `src/components/auth/AdminRoute.jsx`

**Description** : Route protégée accessible uniquement aux admins.

**Props :**
```jsx
{
  children: ReactNode  // Composant à rendre si admin
}
```

**Comportement :**
- Vérifie que l'utilisateur est authentifié ET a le rôle `admin`
- Si non admin → redirect vers `/`
- Si admin → render children

**État de chargement :**
- Afficher Skeleton pendant vérification du rôle

**data-testid :**
- `admin-route-loading` - État de chargement
- `admin-route-unauthorized` - Message si non admin (avant redirect)

---

### 2.2 StatsGrid

**Fichier** : `src/components/admin/StatsGrid.jsx`

**Description** : Grille de statistiques minimaliste pour dashboard admin.

**Props :**
```jsx
{
  stats: {
    totalUsers: number,
    totalProjects: number,
    activeProjects: number,
    totalDonations: number,
    totalAmount: number,
    suspendedUsers: number
  }
}
```

**Design :**
- Grid 2x3 (mobile: 1 col, tablet: 2 cols, desktop: 3 cols)
- Cartes blanches simples avec bordure
- Icône + label + valeur + sous-texte optionnel
- Pas de couleurs flashy, design monochrome

**data-testid :**
- `admin-stats-grid`
- `admin-stat-{key}` (ex: `admin-stat-totalUsers`)

---

### 2.3 ProjectsTable

**Fichier** : `src/components/admin/ProjectsTable.jsx`

**Description** : Tableau dense de tous les projets pour admin.

**Props :**
```jsx
{
  projects: Array,
  onStatusChange: function,  // (projectId, newStatus) => void
  onDelete: function          // (projectId) => void
}
```

**Colonnes :**
1. **ID** (4 premiers chars)
2. **Titre** (lien vers détail)
3. **Créateur** (nom)
4. **Statut** (Badge avec couleur)
5. **Objectif**
6. **Collecté**
7. **Progression** (%)
8. **Créé le**
9. **Actions** (dropdown: Voir, Modifier statut, Supprimer)

**Design :**
- Tableau HTML natif avec Tailwind
- Lignes compactes (py-2)
- Alternance de couleurs pour lisibilité
- Sticky header lors du scroll
- Pagination ou scroll infini (si >50 projets)

**Actions :**
- **Voir** : Navigate vers `/projects/:id`
- **Modifier statut** : Dropdown avec tous les statuts possibles
- **Supprimer** : Confirmation modale simple

**Filtres :**
- Par statut (all, draft, active, completed, cancelled, failed, suspended)
- Recherche par titre ou créateur

**data-testid :**
- `admin-projects-table`
- `admin-project-row-{projectId}`
- `admin-project-status-{projectId}`
- `admin-project-actions-{projectId}`
- `admin-project-delete-{projectId}`

---

### 2.4 UsersTable

**Fichier** : `src/components/admin/UsersTable.jsx`

**Description** : Tableau dense de tous les utilisateurs.

**Props :**
```jsx
{
  users: Array,
  onToggleActive: function,  // (userId, isActive) => void
  onChangeRole: function      // (userId, newRole) => void
}
```

**Colonnes :**
1. **ID** (4 premiers chars)
2. **Email**
3. **Nom d'affichage**
4. **Rôle** (Badge: user / admin)
5. **Statut** (Badge: actif / désactivé)
6. **Inscrit le**
7. **Projets créés** (#)
8. **Donations** (#)
9. **Actions** (Toggle actif, Changer rôle)

**Design :**
- Même style que ProjectsTable
- Lignes compactes
- Alternance de couleurs

**Actions :**
- **Toggle actif** : Bouton switch simple (désactiver/réactiver)
- **Changer rôle** : Dropdown (user / admin) - AVEC confirmation pour admin

**Filtres :**
- Par statut (tous, actifs, désactivés)
- Par rôle (tous, users, admins)
- Recherche par email ou nom

**data-testid :**
- `admin-users-table`
- `admin-user-row-{userId}`
- `admin-user-role-{userId}`
- `admin-user-status-{userId}`
- `admin-user-toggle-{userId}`

---

## 3. Pages à créer

### 3.1 AdminDashboardPage

**Fichier** : `src/pages/admin/AdminDashboardPage.jsx`

**Route** : `/admin`

**Description** : Dashboard principal admin avec vue d'ensemble.

**Sections :**

1. **Header**
   - Titre "Dashboard Admin"
   - Badge "Administrateur" avec icône Shield
   - Actions rapides (Gérer projets, Gérer utilisateurs)

2. **Stats Globales**
   - StatsGrid avec 6 stats clés
   - Calcul en temps réel depuis Supabase

3. **Activité récente** (optionnel, si temps)
   - 5 derniers projets créés
   - 5 dernières donations
   - Table simple, pas de graphiques

4. **Liens rapides**
   - Liste de liens vers sections admin
   - Design minimaliste

**Layout :**
- MainLayout (header + footer)
- Container avec padding py-8
- Pas de sidebar, tout en une page

**États :**
- Loading avec skeletons
- Error avec message et bouton retry

**data-testid :**
- `admin-dashboard-page`
- `admin-dashboard-header`
- `admin-dashboard-stats`
- `admin-dashboard-quick-actions`

---

### 3.2 AdminProjectsPage

**Fichier** : `src/pages/admin/AdminProjectsPage.jsx`

**Route** : `/admin/projects`

**Description** : Page de gestion complète des projets.

**Sections :**

1. **Header**
   - Titre "Gestion des Projets"
   - Compteur: X projets au total
   - Input recherche + Filtres statut

2. **ProjectsTable**
   - Tous les projets de tous les créateurs
   - Actions admin: modifier statut, supprimer

3. **Pagination ou Infinite Scroll**
   - Si >50 projets

**Fonctionnalités :**
- **Changer statut** : Modal simple avec dropdown
  - Options: draft, active, completed, cancelled, failed, suspended
  - Confirmation simple (texte + bouton OK)
- **Supprimer** : Modal confirmation avec texte d'avertissement
  - "Cette action est irréversible"

**États :**
- Loading avec skeleton table
- Empty state si aucun projet
- Error avec retry

**data-testid :**
- `admin-projects-page`
- `admin-projects-search`
- `admin-projects-filter`
- `admin-projects-count`

---

### 3.3 AdminUsersPage

**Fichier** : `src/pages/admin/AdminUsersPage.jsx`

**Route** : `/admin/users`

**Description** : Page de gestion des utilisateurs.

**Sections :**

1. **Header**
   - Titre "Gestion des Utilisateurs"
   - Compteur: X utilisateurs
   - Input recherche + Filtres

2. **UsersTable**
   - Tous les utilisateurs
   - Actions: désactiver, réactiver, changer rôle

3. **Pagination**

**Fonctionnalités :**
- **Désactiver utilisateur** : Toggle direct, pas de modal
  - Change `is_active` à `false`
- **Réactiver utilisateur** : Toggle direct
- **Changer rôle** : Modal de confirmation SEULEMENT si passage en admin
  - "Êtes-vous sûr de promouvoir cet utilisateur en admin ?"

**États :**
- Loading
- Empty state
- Error

**data-testid :**
- `admin-users-page`
- `admin-users-search`
- `admin-users-filter`
- `admin-users-count`

---

## 4. Services et hooks

### 4.1 Hook useAdmin

**Fichier** : `src/hooks/useAdmin.js`

**Description** : Hook pour vérifier si l'utilisateur est admin.

**Retour :**
```javascript
{
  isAdmin: boolean,
  loading: boolean
}
```

**Implémentation :**
- Utilise `useAuth()` pour récupérer `profile`
- Vérifie `profile?.role === 'admin'`
- Retourne `isAdmin` et `loading`

---

### 4.2 Service adminService

**Fichier** : `src/services/adminService.js`

**Description** : Service pour actions admin uniquement.

**Fonctions :**

```javascript
// Statistiques globales
async function getGlobalStats()
// Retourne: { totalUsers, totalProjects, activeProjects, totalDonations, totalAmount, suspendedUsers }

// Tous les projets (aucun filtre RLS)
async function getAllProjects(filters = {})
// Params: { status?, search?, sortBy?, sortOrder? }
// Retourne: { data: projects[], error }

// Changer statut projet
async function updateProjectStatus(projectId, newStatus)
// Retourne: { data, error }

// Tous les utilisateurs
async function getAllUsers(filters = {})
// Params: { isActive?, role?, search?, sortBy?, sortOrder? }
// Retourne: { data: users[], error }

// Toggle statut utilisateur
async function toggleUserActive(userId, isActive)
// Retourne: { data, error }

// Changer rôle utilisateur
async function updateUserRole(userId, newRole)
// Retourne: { data, error }

// Supprimer projet (hard delete, admin only)
async function deleteProjectHard(projectId)
// Retourne: { error }
```

**Export :**
```javascript
export const adminService = {
  getGlobalStats,
  getAllProjects,
  updateProjectStatus,
  getAllUsers,
  toggleUserActive,
  updateUserRole,
  deleteProjectHard
}
```

---

## 5. Routes et navigation

### 5.1 Nouvelles routes

**Fichier** : `src/App.jsx`

Ajouter dans `<Routes>` :

```jsx
{/* Routes Admin - Protégées */}
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboardPage />
    </AdminRoute>
  }
/>
<Route
  path="/admin/projects"
  element={
    <AdminRoute>
      <AdminProjectsPage />
    </AdminRoute>
  }
/>
<Route
  path="/admin/users"
  element={
    <AdminRoute>
      <AdminUsersPage />
    </AdminRoute>
  }
/>
```

---

### 5.2 Liens dans Header

**Fichier** : `src/components/layout/Header.jsx`

**Modification :**
- Ajouter lien "Admin" SEULEMENT si `isAdmin === true`
- Position: après "Dashboard Donateur"
- Icône: `Shield` de lucide-react
- Visible desktop + mobile

**Code :**
```jsx
import { useAdmin } from '../../hooks/useAdmin'

// Dans le composant
const { isAdmin } = useAdmin()

// Dans le JSX (après Dashboard Donateur)
{isAdmin && (
  <Link to="/admin">
    <Button data-testid="header-admin-link" variant="ghost" size="sm">
      <Shield size={18} />
      Admin
    </Button>
  </Link>
)}
```

---

## 6. Fonctionnalités détaillées

### 6.1 Calcul des stats globales

**getGlobalStats()** dans `adminService.js` :

```javascript
async function getGlobalStats() {
  try {
    // Total utilisateurs
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Utilisateurs suspendus
    const { count: suspendedUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', false)

    // Total projets
    const { count: totalProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })

    // Projets actifs
    const { count: activeProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Total donations
    const { count: totalDonations } = await supabase
      .from('donations')
      .select('*', { count: 'exact', head: true })
      .eq('cancelled', false)

    // Montant total
    const { data: amountData } = await supabase
      .from('donations')
      .select('amount')
      .eq('cancelled', false)

    const totalAmount = amountData?.reduce((sum, d) => sum + d.amount, 0) || 0

    return {
      data: {
        totalUsers: totalUsers || 0,
        suspendedUsers: suspendedUsers || 0,
        totalProjects: totalProjects || 0,
        activeProjects: activeProjects || 0,
        totalDonations: totalDonations || 0,
        totalAmount
      },
      error: null
    }
  } catch (err) {
    return {
      data: null,
      error: err.message
    }
  }
}
```

---

### 6.2 Permissions RLS pour admin

**IMPORTANT** : Vérifier que les policies Supabase permettent aux admins de :

1. **Voir tous les projets** (même draft des autres)
2. **Modifier tous les projets**
3. **Supprimer tous les projets**
4. **Voir tous les profils**
5. **Modifier tous les profils** (is_active, role)

**SQL à vérifier/ajouter :**

```sql
-- Policy admin pour projets (SELECT)
CREATE POLICY "Admins can view all projects"
  ON projects FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Policy admin pour projets (UPDATE)
CREATE POLICY "Admins can update all projects"
  ON projects FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Policy admin pour projets (DELETE)
CREATE POLICY "Admins can delete all projects"
  ON projects FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Policy admin pour profiles (SELECT)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Policy admin pour profiles (UPDATE)
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Policy admin pour donations (SELECT)
CREATE POLICY "Admins can view all donations"
  ON donations FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );
```

---

### 6.3 Changement de statut projet

**Statuts possibles :**
- `draft` → En cours de création
- `active` → Projet actif, accepte des dons
- `completed` → Objectif atteint
- `failed` → Deadline passée, objectif non atteint
- `cancelled` → Annulé par créateur ou admin
- `suspended` → Suspendu par admin (violation, modération)

**Règles admin :**
- Admin peut forcer N'IMPORTE QUEL changement de statut
- Pas de validation métier pour admin (contrôle total)

**updateProjectStatus() :**

```javascript
async function updateProjectStatus(projectId, newStatus) {
  const { data, error } = await supabase
    .from('projects')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .single()

  return { data, error }
}
```

---

### 6.4 Désactivation utilisateur

**Comportement :**
- Change `is_active` à `false`
- L'utilisateur ne peut plus se connecter
- Ses projets restent visibles (mais pas modifiables par lui)
- Réactivation possible par admin

**toggleUserActive() :**

```javascript
async function toggleUserActive(userId, isActive) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_active: isActive })
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}
```

---

## 7. Data-testid pour tests E2E

### 7.1 AdminRoute
- `admin-route-loading`
- `admin-route-unauthorized`

### 7.2 AdminDashboardPage
- `admin-dashboard-page`
- `admin-dashboard-header`
- `admin-dashboard-stats`
- `admin-dashboard-quick-actions`
- `admin-stat-totalUsers`
- `admin-stat-totalProjects`
- `admin-stat-activeProjects`
- `admin-stat-totalDonations`
- `admin-stat-totalAmount`
- `admin-stat-suspendedUsers`

### 7.3 AdminProjectsPage
- `admin-projects-page`
- `admin-projects-search`
- `admin-projects-filter`
- `admin-projects-count`
- `admin-projects-table`
- `admin-project-row-{projectId}`
- `admin-project-status-{projectId}`
- `admin-project-actions-{projectId}`
- `admin-project-delete-{projectId}`

### 7.4 AdminUsersPage
- `admin-users-page`
- `admin-users-search`
- `admin-users-filter`
- `admin-users-count`
- `admin-users-table`
- `admin-user-row-{userId}`
- `admin-user-role-{userId}`
- `admin-user-status-{userId}`
- `admin-user-toggle-{userId}`

---

## 8. Ordre de développement

### Session 1 : Base Admin (1-2h)
1. Hook `useAdmin`
2. Composant `AdminRoute`
3. Service `adminService.js` (structure + getGlobalStats)
4. Composant `StatsGrid`
5. Page `AdminDashboardPage` (version minimale)
6. Routes dans `App.jsx`
7. Lien "Admin" dans Header

**Test :**
- Admin peut accéder à `/admin`
- Stats globales s'affichent correctement
- Non-admin redirigé vers `/`

---

### Session 2 : Gestion Projets (1-2h)
1. `adminService.getAllProjects()`
2. Composant `ProjectsTable`
3. Page `AdminProjectsPage`
4. `adminService.updateProjectStatus()`
5. `adminService.deleteProjectHard()`
6. Modales de confirmation

**Test :**
- Table affiche tous les projets
- Filtres fonctionnent
- Changement de statut fonctionne
- Suppression fonctionne

---

### Session 3 : Gestion Utilisateurs (1-2h)
1. `adminService.getAllUsers()`
2. `adminService.toggleUserActive()`
3. `adminService.updateUserRole()`
4. Composant `UsersTable`
5. Page `AdminUsersPage`

**Test :**
- Table affiche tous les utilisateurs
- Toggle actif/inactif fonctionne
- Changement de rôle fonctionne

---

### Session 4 : Polish et Tests (1h)
1. États de chargement partout
2. Gestion d'erreurs
3. Messages de succès/erreur (toast)
4. Vérifier tous les data-testid
5. Tests manuels complets

---

## 9. Validation et tests

### 9.1 Tests manuels requis

**Dashboard Admin :**
- [ ] Stats globales correctes
- [ ] Loading states fonctionnent
- [ ] Error states avec retry

**Gestion Projets :**
- [ ] Tous les projets visibles (tous statuts)
- [ ] Recherche fonctionne
- [ ] Filtres par statut fonctionnent
- [ ] Changement de statut fonctionne
- [ ] Suppression fonctionne avec confirmation
- [ ] Navigation vers détail projet

**Gestion Utilisateurs :**
- [ ] Tous les utilisateurs visibles
- [ ] Recherche fonctionne
- [ ] Filtres fonctionnent
- [ ] Désactivation/réactivation immédiate
- [ ] Changement de rôle avec confirmation
- [ ] Compteurs corrects

**Sécurité :**
- [ ] Non-admin ne peut pas accéder aux routes `/admin/*`
- [ ] Non-admin ne voit pas le lien "Admin" dans header
- [ ] Policies RLS correctes en base

---

### 9.2 Scénarios E2E à tester

#### 1. Accès admin
**Prérequis** : Compte admin en base

**Étapes :**
1. Se connecter en tant qu'admin
2. Vérifier lien "Admin" visible dans header
3. Cliquer sur "Admin"
4. Vérifier redirection vers `/admin`
5. Vérifier stats affichées

**Assertions :**
- Dashboard admin accessible
- Stats cohérentes
- Lien "Admin" visible seulement pour admins

#### 2. Gestion projet admin
**Prérequis** : Admin connecté, projets existants

**Étapes :**
1. Aller sur `/admin/projects`
2. Vérifier tous les projets visibles
3. Changer statut d'un projet à "suspended"
4. Vérifier changement dans table
5. Supprimer un projet
6. Confirmer suppression
7. Vérifier projet disparu

**Assertions :**
- Tous les projets visibles (même draft des autres)
- Changement de statut effectif
- Suppression définitive

#### 3. Désactivation utilisateur
**Prérequis** : Admin connecté, utilisateurs existants

**Étapes :**
1. Aller sur `/admin/users`
2. Désactiver un utilisateur
3. Vérifier badge "désactivé"
4. Se déconnecter et tenter connexion avec utilisateur désactivé
5. Vérifier échec de connexion
6. Reconnecter en admin
7. Réactiver l'utilisateur

**Assertions :**
- Désactivation immédiate
- Utilisateur ne peut plus se connecter
- Réactivation fonctionne

---

## 10. Considérations techniques

### 10.1 Performance

**Optimisations :**
- Pagination sur tables (max 50 lignes)
- Index Supabase sur colonnes filtrées (status, role, is_active)
- Debounce sur recherche (300ms)
- Cache query Supabase si possible

---

### 10.2 Sécurité

**Points critiques :**
- Vérifier rôle admin CÔTÉ SERVEUR (RLS policies)
- Ne JAMAIS faire confiance au frontend seul
- Logger toutes les actions admin critiques
- Confirmation obligatoire pour actions destructives
- Pas de possibilité pour admin de se désactiver lui-même

---

### 10.3 UX Minimaliste

**Principes :**
- Pas d'animations superflues
- Pas de graphiques complexes (juste tableaux et stats)
- Actions directes en 1 clic max
- Feedback immédiat (toast simple)
- Design monochrome gris + primary
- Densité d'information élevée

**Composants à utiliser :**
- Tableaux HTML natifs avec Tailwind
- Badges simples pour statuts
- Dropdowns natifs ou très simples
- Modales minimalistes
- Pas de carousel, pas d'accordéon, pas de tabs complexes

---

## 11. Checklist finale

### Avant de commit :
- [ ] Tous les composants créés
- [ ] Toutes les pages créées
- [ ] Service adminService complet
- [ ] Hook useAdmin fonctionne
- [ ] Routes configurées
- [ ] Lien Admin dans header
- [ ] Tous les data-testid présents
- [ ] Tests manuels passés
- [ ] Policies RLS vérifiées
- [ ] Code compile sans erreur
- [ ] Pas d'erreurs console

---

**Fin du plan Phase 11**

Ce plan suit une approche minimaliste et efficace, sans fioritures, orientée vers la productivité admin.
