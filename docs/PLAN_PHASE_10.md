# Plan de Développement - Phase 10 : Dashboard Donateur

**Date de création** : 09 janvier 2026
**Phase** : 10 - Dashboard Donateur
**Objectif** : Dashboard avec statistiques et vue d'ensemble pour les donateurs

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

Cette phase crée un **dashboard spécifique pour les donateurs**, leur offrant une vue d'ensemble de leur activité de soutien sur la plateforme.

**Capacités utilisateur :**
- Voir ses statistiques globales en tant que donateur
- Voir la liste des projets qu'il soutient actuellement (actifs)
- Voir ses dernières donations
- Accès rapide aux actions fréquentes (découvrir projets, voir toutes les donations)
- Suivre l'évolution des projets soutenus

**Différence avec le Dashboard Créateur (Phase 8) :**
- Le dashboard créateur (Phase 8) affiche les projets **créés** par l'utilisateur
- Le dashboard donateur (Phase 10) affiche les projets **soutenus** par l'utilisateur
- Un utilisateur peut avoir les deux rôles simultanément

**Logique de routing :**
- Route `/dashboard` → Affiche le dashboard **créateur** par défaut
- Route `/donor-dashboard` → Affiche le dashboard **donateur**
- OU alternative : Détecter automatiquement si l'utilisateur a créé des projets :
  - Si projets créés → Dashboard créateur
  - Si aucun projet créé mais donations → Dashboard donateur
  - Si les deux → Afficher un sélecteur (toggle créateur/donateur)

---

### 1.2 User Stories

**US 10.1** - *En tant que donateur, je veux voir un résumé de mon activité de soutien pour suivre mes contributions.*

**US 10.2** - *En tant que donateur, je veux voir la liste des projets actifs que je soutiens pour suivre leur progression.*

**US 10.3** - *En tant que donateur, je veux voir mes dernières donations pour garder un historique récent.*

**US 10.4** - *En tant qu'utilisateur ayant les deux rôles (créateur + donateur), je veux pouvoir basculer facilement entre mes deux dashboards.*

---

### 1.3 Prérequis

**Déjà implémenté :**
- ✅ Authentification (Phase 5)
- ✅ Dashboard Créateur (Phase 8)
- ✅ Système de dons complet (Phase 9)
- ✅ Page "Mes donations" (Phase 9)
- ✅ Service `donationService.js` avec `getDonorStats()`
- ✅ Composants `StatsCard`, `DonationCard` réutilisables

**À développer :**
- Dashboard donateur avec statistiques
- Widget projets soutenus actifs
- Widget dernières donations
- Logique de détection du rôle principal
- Navigation entre dashboards créateur/donateur

---

## 2. Composants à créer

### 2.1 SupportedProjectCard

**Fichier** : `src/components/dashboard/SupportedProjectCard.jsx`

**Description** : Carte affichant un projet soutenu par le donateur, avec sa progression et le montant donné.

**Props :**
```jsx
{
  project: {
    id: string,
    title: string,
    image_url: string,
    status: string,
    goal_amount: number,
    deadline: string,
    creator: {
      display_name: string,
      avatar_url: string
    }
  },
  userDonation: {
    total_amount: number,      // Somme des donations de l'utilisateur sur ce projet
    last_donation_date: string
  },
  totalCollected: number,      // Total collecté sur le projet
  donorsCount: number
}
```

**Affichage :**
- Image du projet
- Titre du projet
- Badge du statut (actif, terminé, échoué)
- Avatar + nom du créateur
- Barre de progression avec pourcentage
- Montant collecté / Objectif
- Jours restants (si actif)
- **Highlight** : Montant total donné par l'utilisateur avec icône Heart
- Bouton "Voir le projet" → `/projects/:id`

**Layout :**
- Card avec image en haut
- Contenu en dessous
- Footer avec bouton d'action

**Data-testid :**
```
supported-project-card
supported-project-card-image
supported-project-card-title
supported-project-card-status
supported-project-card-creator
supported-project-card-progress
supported-project-card-deadline
supported-project-card-user-donation
supported-project-card-view-button
```

---

### 2.2 RecentDonationsList

**Fichier** : `src/components/dashboard/RecentDonationsList.jsx`

**Description** : Liste des 5 dernières donations du donateur.

**Props :**
```jsx
{
  donations: array,           // Tableau des 5 dernières donations
  loading: boolean
}
```

**Affichage :**
- Titre de section "Dernières donations"
- Liste verticale de `DonationCard` en variante `compact`
- Bouton "Voir toutes mes donations" → `/my-donations`
- État vide si aucune donation : "Vous n'avez pas encore fait de don"

**Data-testid :**
```
recent-donations-list
recent-donations-item
recent-donations-view-all-button
recent-donations-empty-state
```

---

### 2.3 DashboardToggle (optionnel)

**Fichier** : `src/components/dashboard/DashboardToggle.jsx`

**Description** : Toggle permettant de basculer entre dashboard créateur et dashboard donateur.

**Props :**
```jsx
{
  currentView: 'creator' | 'donor',
  hasProjects: boolean,        // Utilisateur a créé des projets
  hasDonations: boolean,       // Utilisateur a fait des donations
  onToggle: function
}
```

**Affichage :**
- Tabs horizontales ou boutons radio
- "Dashboard Créateur" | "Dashboard Donateur"
- Désactivé si l'utilisateur n'a qu'un seul rôle
- Icônes : FolderOpen (créateur) / Heart (donateur)

**Data-testid :**
```
dashboard-toggle
dashboard-toggle-creator
dashboard-toggle-donor
```

---

## 3. Pages à créer

### 3.1 DonorDashboardPage

**Fichier** : `src/pages/donor/DonorDashboardPage.jsx`

**Route** : `/donor-dashboard`

**Description** : Dashboard principal pour les donateurs.

**Sections :**

#### Header
- Titre "Dashboard Donateur"
- Message de bienvenue : "Bonjour {display_name}, merci pour votre soutien !"
- `DashboardToggle` (si utilisateur a les deux rôles)

#### Statistiques globales (Grid 3 colonnes)
- **Montant total donné** (icône Coins, variant primary)
- **Projets soutenus** (icône FolderOpen, variant success)
- **Projets terminés avec succès** (icône CheckCircle, variant default)

#### Layout principal (2/3 + 1/3)

**Section principale (2/3) :**
- **Projets soutenus actifs**
  - Titre "Projets que vous soutenez"
  - Grid responsive de `SupportedProjectCard`
  - Filtre : Afficher uniquement les projets avec status `active`
  - Tri : Par date de dernière donation DESC
  - Limite : 6 projets maximum
  - Bouton "Voir tous les projets" → `/projects` avec filtre "soutenus"

**Sidebar (1/3) :**
- **Dernières donations**
  - Composant `RecentDonationsList`
  - 5 dernières donations
  - Bouton "Voir tout" → `/my-donations`

- **Actions rapides**
  - Bouton "Découvrir des projets" → `/projects`
  - Bouton "Voir toutes mes donations" → `/my-donations`

#### État vide
Si aucune donation :
- Icône Heart de grande taille
- Texte : "Vous n'avez pas encore soutenu de projet"
- Sous-texte : "Découvrez des projets passionnants à financer"
- Bouton "Découvrir les projets" → `/projects`

#### États de chargement
- Skeletons pour stats (3 cartes)
- Skeletons pour projets soutenus (grid 2x3)
- Skeletons pour dernières donations (liste 5 items)

**Data-testid :**
```
donor-dashboard-page
donor-dashboard-header
donor-dashboard-welcome
donor-dashboard-toggle
donor-dashboard-stats-grid
donor-stat-total-amount
donor-stat-projects-count
donor-stat-successful-projects
donor-dashboard-supported-projects
donor-dashboard-supported-projects-grid
donor-dashboard-recent-donations
donor-dashboard-quick-actions
donor-dashboard-discover-button
donor-dashboard-view-donations-button
donor-dashboard-empty-state
donor-dashboard-loading
```

---

### 3.2 Logique de DonorDashboardPage

```javascript
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { donationService } from '../../services/donationService'
import { projectService } from '../../services/projectService'
import { supabase } from '../../services/supabase'

export default function DonorDashboardPage() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({
    totalAmount: 0,
    projectsCount: 0,
    successfulProjects: 0
  })
  const [supportedProjects, setSupportedProjects] = useState([])
  const [recentDonations, setRecentDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return

      // 1. Récupérer statistiques donateur
      const { data: statsData } = await donationService.getDonorStats(user.id)

      // 2. Récupérer toutes les donations de l'utilisateur
      const { data: donationsData } = await donationService.getDonationsByDonor(user.id)

      // 3. Extraire les projets soutenus actifs uniques
      const activeProjects = new Map()

      donationsData.forEach(donation => {
        const projectId = donation.project.id

        if (donation.project.status === 'active') {
          if (!activeProjects.has(projectId)) {
            activeProjects.set(projectId, {
              ...donation.project,
              userDonation: {
                total_amount: donation.amount,
                last_donation_date: donation.created_at
              }
            })
          } else {
            // Accumuler le montant si plusieurs donations sur même projet
            const existing = activeProjects.get(projectId)
            existing.userDonation.total_amount += donation.amount

            // Garder la date la plus récente
            if (new Date(donation.created_at) > new Date(existing.userDonation.last_donation_date)) {
              existing.userDonation.last_donation_date = donation.created_at
            }
          }
        }
      })

      // 4. Enrichir les projets avec stats (total_collected, donors_count)
      const enrichedProjects = await Promise.all(
        Array.from(activeProjects.values()).map(async (project) => {
          const { data: totalData } = await supabase.rpc('get_project_total_collected', {
            project_uuid: project.id
          })
          const { data: donorsData } = await supabase.rpc('get_project_donors_count', {
            project_uuid: project.id
          })

          return {
            ...project,
            total_collected: totalData || 0,
            donors_count: donorsData || 0
          }
        })
      )

      // Trier par date de dernière donation (plus récent en premier)
      enrichedProjects.sort((a, b) =>
        new Date(b.userDonation.last_donation_date) - new Date(a.userDonation.last_donation_date)
      )

      // 5. Calculer projets terminés avec succès
      const successfulCount = donationsData.filter(d =>
        d.project.status === 'completed'
      ).reduce((acc, d) => {
        if (!acc.includes(d.project.id)) acc.push(d.project.id)
        return acc
      }, []).length

      // 6. Récupérer les 5 dernières donations
      const recent = donationsData.slice(0, 5)

      setStats({
        totalAmount: statsData.total_amount,
        projectsCount: statsData.projects_count,
        successfulProjects: successfulCount
      })
      setSupportedProjects(enrichedProjects.slice(0, 6)) // Max 6 projets
      setRecentDonations(recent)
      setLoading(false)
    }

    loadDashboard()
  }, [user])

  // ... JSX avec affichage
}
```

---

## 4. Services et hooks

### 4.1 Vérifications dans donationService.js

Le service `donationService.js` doit déjà avoir la méthode `getDonorStats()` créée en Phase 4.

**Vérifier que cette méthode existe et retourne :**
```javascript
{
  total_amount: number,        // Montant total donné
  projects_count: number,      // Nombre de projets uniques soutenus
  donations_count: number      // Nombre total de donations
}
```

Si elle n'existe pas, l'ajouter dans `src/services/donationService.js`.

---

### 4.2 Hook useDashboardType

**Fichier** : `src/hooks/useDashboardType.js`

**Description** : Hook pour déterminer quel dashboard afficher par défaut.

```javascript
import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { projectService } from '../services/projectService'
import { donationService } from '../services/donationService'

export function useDashboardType() {
  const { user } = useAuth()
  const [dashboardType, setDashboardType] = useState(null) // 'creator' | 'donor' | 'both'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function detectDashboardType() {
      if (!user) {
        setDashboardType(null)
        setLoading(false)
        return
      }

      // Vérifier si l'utilisateur a créé des projets
      const { data: projects } = await projectService.getProjectsByCreator(user.id)
      const hasProjects = projects && projects.length > 0

      // Vérifier si l'utilisateur a fait des donations
      const { data: donations } = await donationService.getDonationsByDonor(user.id)
      const hasDonations = donations && donations.length > 0

      if (hasProjects && hasDonations) {
        setDashboardType('both')
      } else if (hasProjects) {
        setDashboardType('creator')
      } else if (hasDonations) {
        setDashboardType('donor')
      } else {
        setDashboardType('creator') // Par défaut, afficher créateur
      }

      setLoading(false)
    }

    detectDashboardType()
  }, [user])

  return { dashboardType, loading }
}
```

---

## 5. Routes et navigation

### 5.1 Nouvelles routes

Ajouter dans `src/App.jsx` :

```jsx
// Route dashboard donateur
<Route
  path="/donor-dashboard"
  element={
    <ProtectedRoute>
      <DonorDashboardPage />
    </ProtectedRoute>
  }
/>
```

---

### 5.2 Logique de redirection du dashboard

**Option 1** : Routes séparées (recommandé)
- `/dashboard` → Toujours dashboard créateur
- `/donor-dashboard` → Toujours dashboard donateur
- L'utilisateur choisit manuellement via le Header

**Option 2** : Route intelligente
- `/dashboard` → Détecte automatiquement avec `useDashboardType()`
- Redirige vers le dashboard approprié
- Affiche un toggle si les deux rôles

**Implémentation Option 1 (recommandé) :**

Dans `src/App.jsx`, garder la route `/dashboard` existante pour le créateur, et ajouter `/donor-dashboard`.

Dans le Header, ajouter un lien "Dashboard Donateur" visible uniquement si l'utilisateur a fait des donations.

---

### 5.3 Navigation Header

**Desktop** :
```jsx
{user && (
  <>
    <Link to="/dashboard">
      <Button data-testid="header-dashboard-link" variant="ghost" size="sm">
        <LayoutDashboard size={18} />
        Dashboard
      </Button>
    </Link>

    {/* Nouveau : Lien Dashboard Donateur */}
    <Link to="/donor-dashboard">
      <Button data-testid="header-donor-dashboard-link" variant="ghost" size="sm">
        <Heart size={18} />
        Mes soutiens
      </Button>
    </Link>

    <Link to="/dashboard/projects">
      <Button data-testid="header-projects-link" variant="ghost" size="sm">
        <FolderOpen size={18} />
        Mes Projets
      </Button>
    </Link>

    <Link to="/my-donations">
      <Button data-testid="header-donations-link" variant="ghost" size="sm">
        <Heart size={18} />
        Mes donations
      </Button>
    </Link>
  </>
)}
```

**Mobile** : Ajouter le même lien dans le menu mobile.

---

## 6. Fonctionnalités détaillées

### 6.1 Affichage des statistiques

**Statistiques affichées :**

1. **Montant total donné**
   - Icône : Coins
   - Couleur : primary (violet)
   - Calcul : Somme de tous les montants des donations de l'utilisateur
   - Affichage : "15 450€"

2. **Projets soutenus**
   - Icône : FolderOpen
   - Couleur : success (vert)
   - Calcul : Nombre de projets uniques sur lesquels l'utilisateur a fait au moins un don
   - Affichage : "12 projets"

3. **Projets terminés avec succès**
   - Icône : CheckCircle
   - Couleur : default (gris)
   - Calcul : Nombre de projets uniques avec status `completed` que l'utilisateur a soutenus
   - Affichage : "8 projets"

**Layout :**
- Grid 3 colonnes sur desktop
- Grid 1 colonne sur mobile
- Utilise le composant `StatsCard` existant (Phase 8)

---

### 6.2 Projets soutenus actifs

**Critères de sélection :**
- Projets sur lesquels l'utilisateur a fait au moins un don
- Uniquement les projets avec status `active`
- Tri : Par date de dernière donation DESC (les plus récents d'abord)
- Limite : 6 projets maximum

**Affichage pour chaque projet :**
- Carte `SupportedProjectCard` avec :
  - Image du projet
  - Titre
  - Badge du statut
  - Créateur (avatar + nom)
  - Barre de progression
  - Montant collecté / Objectif
  - Jours restants
  - **Highlight** : Montant total donné par l'utilisateur sur ce projet
  - Bouton "Voir le projet"

**Calcul du montant total donné par projet :**
```javascript
// Si l'utilisateur a fait plusieurs donations sur le même projet
const userTotalForProject = donations
  .filter(d => d.project_id === projectId)
  .reduce((sum, d) => sum + d.amount, 0)
```

**Grid responsive :**
- Mobile : 1 colonne
- Tablet : 2 colonnes
- Desktop : 3 colonnes

---

### 6.3 Dernières donations

**Affichage :**
- Composant `RecentDonationsList`
- Liste verticale des 5 dernières donations
- Utilise `DonationCard` en variante `compact`
- Tri : Par date DESC (plus récent en premier)
- Bouton "Voir toutes mes donations" → `/my-donations`

**Informations affichées par donation :**
- Image du projet
- Titre du projet
- Montant
- Date relative ("Il y a 2 heures", "Il y a 3 jours")
- Badge du statut du projet

---

### 6.4 Actions rapides

**Boutons :**

1. **Découvrir des projets**
   - Icône : Search
   - Redirection : `/projects`
   - Texte : "Découvrir des projets"

2. **Voir toutes mes donations**
   - Icône : List
   - Redirection : `/my-donations`
   - Texte : "Voir toutes mes donations"

**Layout :**
- Section dans la sidebar
- 2 boutons verticaux
- Taille : full width

---

### 6.5 Toggle créateur/donateur (optionnel)

**Affichage conditionnel :**
- Afficher le toggle uniquement si l'utilisateur a **les deux rôles** :
  - A créé au moins 1 projet ET
  - A fait au moins 1 donation

**Comportement :**
- Tabs horizontales en haut de la page
- Onglet actif : Dashboard Créateur | Dashboard Donateur
- Clic sur "Dashboard Créateur" → Redirection `/dashboard`
- Clic sur "Dashboard Donateur" → Redirection `/donor-dashboard`

**Alternative plus simple :**
- Pas de toggle
- Ajouter simplement un lien dans le Header pour basculer entre les deux dashboards
- L'utilisateur navigue manuellement

---

## 7. Data-testid pour tests E2E

### 7.1 DonorDashboardPage

```
donor-dashboard-page
donor-dashboard-header
donor-dashboard-welcome
donor-dashboard-toggle (si implémenté)
donor-dashboard-stats-grid
donor-stat-total-amount
donor-stat-projects-count
donor-stat-successful-projects
donor-dashboard-supported-projects
donor-dashboard-supported-projects-title
donor-dashboard-supported-projects-grid
donor-dashboard-view-all-projects-button
donor-dashboard-recent-donations
donor-dashboard-recent-donations-title
donor-dashboard-quick-actions
donor-dashboard-discover-button
donor-dashboard-view-donations-button
donor-dashboard-empty-state
donor-dashboard-loading
```

### 7.2 SupportedProjectCard

```
supported-project-card
supported-project-card-image
supported-project-card-title
supported-project-card-status-badge
supported-project-card-creator
supported-project-card-creator-avatar
supported-project-card-creator-name
supported-project-card-progress-bar
supported-project-card-amounts
supported-project-card-deadline
supported-project-card-user-donation
supported-project-card-view-button
```

### 7.3 RecentDonationsList

```
recent-donations-list
recent-donations-title
recent-donations-item
recent-donations-view-all-button
recent-donations-empty-state
```

### 7.4 DashboardToggle (si implémenté)

```
dashboard-toggle
dashboard-toggle-creator
dashboard-toggle-donor
```

---

## 8. Ordre de développement

### 8.1 Session 1 : Composants de base

**Durée estimée** : 1-2 heures

1. ✅ Créer `SupportedProjectCard.jsx`
   - Layout carte avec image + infos
   - Barre de progression
   - Highlight montant utilisateur
   - Git commit : `feat: add SupportedProjectCard component`

2. ✅ Créer `RecentDonationsList.jsx`
   - Liste des 5 dernières donations
   - Utilise `DonationCard` compact
   - Bouton "Voir tout"
   - Git commit : `feat: add RecentDonationsList component`

3. ✅ (Optionnel) Créer `DashboardToggle.jsx`
   - Tabs créateur/donateur
   - Git commit : `feat: add DashboardToggle component`

---

### 8.2 Session 2 : DonorDashboardPage

**Durée estimée** : 2-3 heures

4. ✅ Créer `DonorDashboardPage.jsx`
   - Header avec titre
   - Grid statistiques (3 StatsCard)
   - Section projets soutenus
   - Sidebar avec dernières donations + actions rapides
   - État vide
   - Git commit : `feat: add DonorDashboardPage with stats and projects`

5. ✅ Implémenter la logique de chargement
   - Récupérer donations de l'utilisateur
   - Calculer statistiques
   - Extraire projets soutenus actifs
   - Enrichir avec stats projet
   - Git commit : `feat: implement DonorDashboardPage data loading`

---

### 8.3 Session 3 : Routes et navigation

**Durée estimée** : 1 heure

6. ✅ Ajouter route `/donor-dashboard`
   - Configuration dans App.jsx
   - Git commit : `feat: add donor dashboard route`

7. ✅ Ajouter liens dans Header
   - Lien "Mes soutiens" ou "Dashboard Donateur"
   - Desktop et mobile
   - Git commit : `feat: add donor dashboard link to header`

8. ✅ (Optionnel) Implémenter `useDashboardType` hook
   - Détection automatique du rôle
   - Git commit : `feat: add useDashboardType hook`

---

### 8.4 Session 4 : Tests et polish

**Durée estimée** : 1 heure

9. ✅ Tests manuels complets
   - Vérifier calcul des statistiques
   - Vérifier affichage projets soutenus
   - Vérifier dernières donations
   - Tester responsive
   - Vérifier tous les data-testid

10. ✅ Corrections et ajustements
    - Corriger bugs identifiés
    - Améliorer UX si nécessaire

11. ✅ Git commit final
    - `feat: complete donor dashboard (Phase 10)`

---

## 9. Validation et tests

### 9.1 Checklist fonctionnelle

**Page dashboard donateur :**
- [ ] La page `/donor-dashboard` se charge sans erreur
- [ ] Le message de bienvenue affiche le nom de l'utilisateur
- [ ] Les 3 statistiques s'affichent correctement
- [ ] Le calcul du montant total donné est correct
- [ ] Le nombre de projets soutenus est correct
- [ ] Le nombre de projets terminés avec succès est correct

**Projets soutenus :**
- [ ] La section "Projets que vous soutenez" affiche les projets actifs
- [ ] Maximum 6 projets sont affichés
- [ ] Les projets sont triés par date de dernière donation DESC
- [ ] Chaque carte affiche la barre de progression correcte
- [ ] Le montant donné par l'utilisateur est mis en évidence
- [ ] Le bouton "Voir le projet" redirige correctement
- [ ] Le bouton "Voir tous les projets" est présent

**Dernières donations :**
- [ ] La sidebar affiche les 5 dernières donations
- [ ] Les donations sont triées par date DESC
- [ ] Chaque donation affiche les bonnes infos
- [ ] Le bouton "Voir toutes mes donations" redirige vers `/my-donations`

**Actions rapides :**
- [ ] Le bouton "Découvrir des projets" redirige vers `/projects`
- [ ] Le bouton "Voir toutes mes donations" redirige vers `/my-donations`

**État vide :**
- [ ] Si aucune donation, l'état vide s'affiche
- [ ] Le bouton "Découvrir les projets" est présent et fonctionnel

**Navigation :**
- [ ] Le lien "Mes soutiens" (ou "Dashboard Donateur") est visible dans le Header
- [ ] Le lien redirige vers `/donor-dashboard`
- [ ] (Optionnel) Le toggle créateur/donateur fonctionne si implémenté

---

### 9.2 Tests responsive

- [ ] **Mobile (375px)** : Grid 1 colonne pour stats et projets
- [ ] **Tablet (768px)** : Grid 2 colonnes pour projets
- [ ] **Desktop (1200px)** : Grid 3 colonnes pour projets, layout 2/3 + 1/3

---

### 9.3 Tests de calcul

- [ ] Le montant total donné = Somme de toutes les donations
- [ ] Le nombre de projets soutenus = Nombre de projets uniques avec au moins 1 donation
- [ ] Le nombre de projets terminés avec succès = Projets uniques avec status `completed`
- [ ] Le montant par projet = Somme des donations de l'utilisateur sur ce projet

---

### 9.4 Tests de permissions

- [ ] Seul un utilisateur authentifié peut accéder à `/donor-dashboard`
- [ ] Si non authentifié → Redirection vers `/login`

---

### 9.5 Tests d'erreur

- [ ] Si l'utilisateur n'a aucune donation → État vide s'affiche
- [ ] Si erreur réseau → Message d'erreur approprié
- [ ] Si un projet soutenu est supprimé → Gérer gracieusement

---

## 10. Points d'attention

### 10.1 Performance

- ⚠️ Limiter les projets soutenus affichés à 6
- ⚠️ Limiter les dernières donations à 5
- ⚠️ Optimiser les appels RPC pour enrichir les stats
- ⚠️ Mettre en cache les statistiques si possible

### 10.2 UX

- ✅ Mettre en évidence le montant donné par l'utilisateur sur chaque projet
- ✅ Afficher des messages encourageants ("Merci pour votre soutien !")
- ✅ Utiliser des icônes cohérentes (Heart pour donations, FolderOpen pour projets)
- ✅ Afficher clairement l'état vide avec un CTA

### 10.3 Différenciation créateur/donateur

- ✅ Dashboard créateur → Focus sur les projets **créés**
- ✅ Dashboard donateur → Focus sur les projets **soutenus**
- ✅ Permettre à l'utilisateur de naviguer facilement entre les deux
- ✅ Si l'utilisateur n'a qu'un rôle, afficher uniquement le dashboard correspondant

### 10.4 Réutilisation de composants

- ✅ Réutiliser `StatsCard` (Phase 8)
- ✅ Réutiliser `DonationCard` (Phase 9)
- ✅ Réutiliser `ProgressBar`, `Badge`, `Avatar` (Phase 2)
- ✅ Créer uniquement les composants spécifiques : `SupportedProjectCard`, `RecentDonationsList`

---

## 11. Ressources

### 11.1 Services existants

- ✅ `src/services/donationService.js` (Phase 4)
- ✅ `src/services/projectService.js` (Phase 4)
- ✅ RPCs Supabase pour statistiques

### 11.2 Composants existants

- ✅ `StatsCard` (Phase 8)
- ✅ `DonationCard` (Phase 9)
- ✅ `Button`, `Badge`, `Avatar`, `ProgressBar` (Phase 2)
- ✅ `Skeleton` (Phase 2)

### 11.3 Hooks existants

- ✅ `useAuth` (Phase 4)
- ✅ `useDonations` (Phase 9, si créé)

---

## 12. Améliorations futures (hors MVP)

**Post-Phase 10 :**
- Graphiques d'évolution des donations dans le temps
- Comparaison avec d'autres donateurs (anonymisé)
- Badges de donateur ("Super donateur", "Early supporter", etc.)
- Notifications quand un projet soutenu atteint son objectif
- Export CSV des donations
- Filtres avancés sur les projets soutenus (par catégorie, par montant donné)

---

**Fin du plan Phase 10**

**Prochaine étape** : Développer les composants dans l'ordre défini ci-dessus.
