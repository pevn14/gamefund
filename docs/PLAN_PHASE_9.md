# Plan de Développement - Phase 9 : Système de Dons

**Date de création** : 09 janvier 2026
**Phase** : 9 - Système de Dons
**Objectif** : Permettre aux donateurs de faire des dons, les modifier et les annuler

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

Cette phase implémente le cœur fonctionnel de la plateforme : **le système de dons**.

**Capacités utilisateur :**
- Consulter les détails complets d'un projet (vue publique et créateur)
- Faire un don sur un projet actif
- Voir l'historique de toutes ses donations
- Modifier une donation (montant/message) si projet encore actif
- Annuler une donation si projet encore actif
- Voir en temps réel la mise à jour de la progression du projet

**Règles métier critiques :**
- Seuls les projets avec status `active` acceptent des dons
- Montant minimum : 1€
- Un utilisateur peut faire plusieurs dons au même projet
- Modification/Annulation possible uniquement si `project.status === 'active'`
- La progression du projet se recalcule automatiquement après chaque action

---

### 1.2 User Stories

**US 9.1** - *En tant que visiteur ou utilisateur, je veux voir les détails complets d'un projet pour décider si je veux le soutenir.*

**US 9.2** - *En tant qu'utilisateur authentifié, je veux faire un don à un projet actif pour le soutenir financièrement.*

**US 9.3** - *En tant que donateur, je veux voir l'historique de toutes mes donations pour suivre mes contributions.*

**US 9.4** - *En tant que donateur, je veux modifier le montant ou le message de mon don tant que le projet est actif.*

**US 9.5** - *En tant que donateur, je veux annuler mon don si je change d'avis et que le projet est encore actif.*

**US 9.6** - *En tant que créateur, je veux voir la liste complète de tous les dons reçus sur mes projets.*

---

### 1.3 Prérequis

**Déjà implémenté :**
- ✅ Authentification (Phase 5)
- ✅ Galerie de projets publique (Phase 6)
- ✅ CRUD Projets (Phase 7)
- ✅ Dashboard Créateur (Phase 8)
- ✅ Table `donations` en base de données (Phase 4)
- ✅ Service `donationService.js` (Phase 4)
- ✅ RPCs Supabase pour statistiques

**À développer :**
- Page détail projet (publique et créateur)
- Formulaire de donation
- Page "Mes donations"
- Composants d'affichage de donations
- Logique de modification/annulation

---

## 2. Composants à créer

### 2.1 DonationForm

**Fichier** : `src/components/donations/DonationForm.jsx`

**Description** : Formulaire pour faire un don à un projet.

**Props :**
```jsx
{
  projectId: string,          // UUID du projet
  projectTitle: string,        // Titre du projet (pour affichage)
  projectGoal: number,         // Objectif du projet
  totalCollected: number,      // Montant déjà collecté
  onSuccess: function,         // Callback après don réussi
  onCancel: function           // Callback si annulation
}
```

**État interne :**
```jsx
{
  amount: number,              // Montant du don
  message: string,             // Message au créateur (optionnel)
  loading: boolean,            // Chargement de la soumission
  error: string | null,        // Message d'erreur
  showConfirmation: boolean    // Afficher preview avant validation
}
```

**Validations :**
- Montant >= 1
- Montant doit être un nombre entier positif
- Message max 500 caractères
- Projet doit avoir status `active`

**UI :**
- Input type number pour le montant
- Textarea pour le message (optionnel)
- Affichage du nouveau total si don validé : `{totalCollected + amount}€ / {projectGoal}€`
- Bouton "Annuler" et "Faire un don"
- Modal de confirmation avec récapitulatif avant envoi final

**Comportement :**
1. Utilisateur remplit montant + message
2. Clic sur "Faire un don" → Affiche modal de confirmation
3. Modal affiche récapitulatif (montant, message, nouveau total)
4. Clic sur "Confirmer" → Appel `donationService.createDonation()`
5. Si succès → `onSuccess()` avec message "Merci pour votre don !"
6. Si erreur → Affichage message d'erreur

**Data-testid :**
```
donation-form
donation-amount-input
donation-message-input
donation-preview-total
donation-cancel-button
donation-submit-button
donation-confirm-modal
donation-confirm-button
donation-error-message
donation-success-message
```

---

### 2.2 DonationCard

**Fichier** : `src/components/donations/DonationCard.jsx`

**Description** : Carte affichant une donation individuelle.

**Props :**
```jsx
{
  donation: {
    id: string,
    amount: number,
    message: string,
    created_at: string,
    updated_at: string,
    donor: {
      display_name: string,
      avatar_url: string
    },
    project: {
      id: string,
      title: string,
      status: string,
      image_url: string
    }
  },
  variant: 'default' | 'compact',     // Variante d'affichage
  showActions: boolean,                // Afficher boutons Modifier/Annuler
  onEdit: function,                    // Callback édition
  onDelete: function                   // Callback annulation
}
```

**Variantes :**
- `default` : Card complète avec image projet, infos donateur, montant, message, date, actions
- `compact` : Version réduite pour liste (sans image projet, moins de détails)

**Affichage :**
- Avatar + nom du donateur
- Montant en gras avec icône (Heart ou Coins)
- Message du donateur (si présent)
- Date relative : "Il y a 2 heures", "Il y a 3 jours"
- Badge du statut du projet (actif, terminé, échoué)
- Actions conditionnelles :
  - Bouton "Modifier" si `project.status === 'active'` et `showActions === true`
  - Bouton "Annuler" si `project.status === 'active'` et `showActions === true`
  - Boutons désactivés si projet n'est plus actif

**Data-testid :**
```
donation-card
donation-card-donor-info
donation-card-amount
donation-card-message
donation-card-date
donation-card-project-status
donation-card-edit-button
donation-card-delete-button
```

---

### 2.3 DonationsList

**Fichier** : `src/components/donations/DonationsList.jsx`

**Description** : Liste paginée de donations avec filtres.

**Props :**
```jsx
{
  donations: array,            // Tableau de donations
  loading: boolean,            // État de chargement
  variant: 'default' | 'compact',
  showActions: boolean,
  onEdit: function,
  onDelete: function,
  emptyMessage: string         // Message si liste vide
}
```

**Affichage :**
- Grid responsive de `DonationCard`
- Skeleton loaders pendant chargement
- Message d'état vide si aucune donation
- Pagination si > 20 donations

**Data-testid :**
```
donations-list
donations-list-item
donations-empty-state
donations-loading
```

---

### 2.4 ProjectStats

**Fichier** : `src/components/projects/ProjectStats.jsx`

**Description** : Widget affichant les statistiques d'un projet (progression, donateurs, jours restants).

**Props :**
```jsx
{
  project: {
    goal_amount: number,
    deadline: string,
    status: string,
    total_collected: number,
    donors_count: number
  },
  size: 'sm' | 'md' | 'lg'
}
```

**Affichage :**
- Barre de progression avec pourcentage
- Montant collecté / Objectif
- Nombre de donateurs avec icône Users
- Jours restants avec icône Calendar (si actif)
- Badge du statut

**Data-testid :**
```
project-stats
project-stats-progress-bar
project-stats-amount
project-stats-donors
project-stats-deadline
project-stats-status-badge
```

---

## 3. Pages à créer

### 3.1 ProjectDetailPage

**Fichier** : `src/pages/public/ProjectDetailPage.jsx`

**Route** : `/projects/:id`

**Description** : Page détail complète d'un projet, accessible à tous (visiteurs et utilisateurs).

**Sections :**

#### Header
- Image/bannière du projet (pleine largeur)
- Titre du projet (h1)
- Badge du statut
- Avatar + nom du créateur (cliquable vers profil créateur)
- Date de création

#### Sidebar (desktop) ou section mobile
- **Widget `ProjectStats`** : progression, montant, donateurs, deadline
- **Bouton "Faire un don"** :
  - Si non authentifié → Redirection vers `/login`
  - Si authentifié → Ouvre modal avec `DonationForm`
  - Désactivé si projet n'est pas `active`

#### Contenu principal
- **Description complète** du projet (formatée avec retours à la ligne)
- **Section "Dons récents"** :
  - Affiche les 10 derniers dons
  - Utilise `DonationCard` en variant compact
  - Bouton "Voir tous les dons" si > 10 dons

#### État de chargement
- Skeleton pour header, stats, description
- Message d'erreur si projet introuvable (404)

#### Permissions créateur
- Si l'utilisateur connecté est le créateur du projet :
  - Bouton "Modifier le projet" → `/projects/:id/edit`
  - Afficher section "Tous les dons reçus" (au lieu de "Dons récents")

**Data-testid :**
```
project-detail-page
project-detail-header
project-detail-image
project-detail-title
project-detail-creator
project-detail-description
project-detail-stats
project-detail-donate-button
project-detail-edit-button
project-detail-donations-section
project-detail-loading
project-detail-error
```

**Logique :**
```javascript
// Récupération projet
const { id } = useParams()
const [project, setProject] = useState(null)
const [donations, setDonations] = useState([])
const [loading, setLoading] = useState(true)
const [showDonationModal, setShowDonationModal] = useState(false)
const { user } = useAuth()

useEffect(() => {
  async function loadProject() {
    // 1. Récupérer projet par ID
    const { data: projectData, error } = await projectService.getProjectById(id)

    // 2. Enrichir avec stats (total_collected, donors_count)
    const { data: statsData } = await supabase.rpc('get_project_total_collected', { project_uuid: id })

    // 3. Récupérer les 10 derniers dons
    const { data: donationsData } = await donationService.getDonationsByProject(id, { limit: 10 })

    setProject({ ...projectData, total_collected: statsData })
    setDonations(donationsData)
    setLoading(false)
  }

  loadProject()
}, [id])

// Gestion du don
async function handleDonationSuccess() {
  setShowDonationModal(false)
  // Recharger les stats et donations
  loadProject()
}
```

---

### 3.2 MyDonationsPage

**Fichier** : `src/pages/donor/MyDonationsPage.jsx`

**Route** : `/my-donations`

**Description** : Page listant toutes les donations de l'utilisateur connecté.

**Sections :**

#### Header
- Titre "Mes donations"
- Statistiques rapides :
  - Montant total donné
  - Nombre de projets soutenus
  - Nombre de donations

#### Filtres
- Select "Statut du projet" :
  - Tous
  - Projets actifs
  - Projets terminés
  - Projets échoués
- Select "Tri" :
  - Plus récent
  - Plus ancien
  - Montant croissant
  - Montant décroissant

#### Liste des donations
- Utilise `DonationsList` avec `showActions={true}`
- Grid responsive (1 col mobile, 2 cols tablet, 3 cols desktop)

#### Actions
- Bouton "Modifier" → Ouvre modal avec formulaire pré-rempli
- Bouton "Annuler" → Ouvre modal de confirmation
- Actions désactivées si projet n'est plus actif

#### État vide
- Si aucune donation :
  - Icône Heart
  - Texte : "Vous n'avez pas encore fait de don"
  - Bouton "Découvrir les projets" → `/projects`

**Data-testid :**
```
my-donations-page
my-donations-header
my-donations-stats
my-donations-filters
my-donations-status-filter
my-donations-sort-filter
my-donations-list
my-donations-empty-state
donation-edit-modal
donation-delete-modal
```

**Logique :**
```javascript
const { user } = useAuth()
const [donations, setDonations] = useState([])
const [filteredDonations, setFilteredDonations] = useState([])
const [loading, setLoading] = useState(true)
const [statusFilter, setStatusFilter] = useState('all')
const [sortBy, setSortBy] = useState('newest')
const [editingDonation, setEditingDonation] = useState(null)
const [deletingDonation, setDeletingDonation] = useState(null)

// Statistiques calculées
const stats = {
  totalAmount: donations.reduce((sum, d) => sum + d.amount, 0),
  projectsCount: new Set(donations.map(d => d.project_id)).size,
  donationsCount: donations.length
}

// Chargement des donations
useEffect(() => {
  async function loadDonations() {
    const { data, error } = await donationService.getDonationsByDonor(user.id)
    if (!error) {
      setDonations(data)
    }
    setLoading(false)
  }
  loadDonations()
}, [user.id])

// Filtrage et tri
useEffect(() => {
  let filtered = [...donations]

  // Filtre par statut
  if (statusFilter !== 'all') {
    filtered = filtered.filter(d => d.project.status === statusFilter)
  }

  // Tri
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.created_at) - new Date(a.created_at)
      case 'oldest': return new Date(a.created_at) - new Date(b.created_at)
      case 'amount_asc': return a.amount - b.amount
      case 'amount_desc': return b.amount - a.amount
      default: return 0
    }
  })

  setFilteredDonations(filtered)
}, [donations, statusFilter, sortBy])

// Édition
async function handleEdit(donationId, updates) {
  const { error } = await donationService.updateDonation(donationId, updates)
  if (!error) {
    // Recharger les donations
    loadDonations()
    setEditingDonation(null)
  }
}

// Annulation
async function handleDelete(donationId) {
  const { error } = await donationService.deleteDonation(donationId)
  if (!error) {
    // Recharger les donations
    loadDonations()
    setDeletingDonation(null)
  }
}
```

---

### 3.3 ProjectDonationsPage (Créateur)

**Fichier** : `src/pages/creator/ProjectDonationsPage.jsx`

**Route** : `/dashboard/projects/:id/donations`

**Description** : Page pour que le créateur voie TOUTES les donations reçues sur son projet.

**Sections :**

#### Header
- Retour vers "Mes projets"
- Titre du projet
- Badge du statut

#### Statistiques
- Montant total collecté
- Nombre de donateurs uniques
- Nombre total de donations
- Montant moyen par donation

#### Filtres et tri
- Select "Tri" :
  - Plus récent
  - Plus ancien
  - Montant croissant
  - Montant décroissant
- Barre de recherche (par nom de donateur)

#### Liste des donations
- Utilise `DonationsList` avec `showActions={false}`
- Affiche TOUTES les donations (pas de limite)
- Pagination si > 50 donations

#### Export (optionnel)
- Bouton "Exporter en CSV"

**Data-testid :**
```
project-donations-page
project-donations-header
project-donations-stats
project-donations-search
project-donations-sort-filter
project-donations-list
project-donations-export-button
```

---

## 4. Services et hooks

### 4.1 donationService.js

**Fichier** : `src/services/donationService.js`

**Note** : Ce service existe déjà depuis la Phase 4, mais il faut vérifier qu'il contient bien toutes les méthodes nécessaires.

**Méthodes requises :**

```javascript
// Créer une donation
async function createDonation(donationData) {
  // donationData = { project_id, donor_id, amount, message }
  const { data, error } = await supabase
    .from('donations')
    .insert(donationData)
    .select('*, project:projects(*), donor:profiles(*)')
    .single()

  return { data, error }
}

// Récupérer donations par projet
async function getDonationsByProject(projectId, options = {}) {
  let query = supabase
    .from('donations')
    .select('*, donor:profiles(id, display_name, avatar_url)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (options.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query
  return { data, error }
}

// Récupérer donations par donateur
async function getDonationsByDonor(donorId) {
  const { data, error } = await supabase
    .from('donations')
    .select('*, project:projects(*)')
    .eq('donor_id', donorId)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Récupérer une donation par ID
async function getDonationById(donationId) {
  const { data, error } = await supabase
    .from('donations')
    .select('*, project:projects(*), donor:profiles(*)')
    .eq('id', donationId)
    .single()

  return { data, error }
}

// Mettre à jour une donation
async function updateDonation(donationId, updates) {
  // updates = { amount, message }
  const { data, error } = await supabase
    .from('donations')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', donationId)
    .select('*')
    .single()

  return { data, error }
}

// Supprimer une donation
async function deleteDonation(donationId) {
  const { data, error } = await supabase
    .from('donations')
    .delete()
    .eq('id', donationId)

  return { data, error }
}

// Statistiques donateur
async function getDonorStats(donorId) {
  const { data: donations, error } = await supabase
    .from('donations')
    .select('amount, project_id')
    .eq('donor_id', donorId)

  if (error) return { data: null, error }

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0)
  const projectsCount = new Set(donations.map(d => d.project_id)).size

  return {
    data: {
      total_amount: totalAmount,
      projects_count: projectsCount,
      donations_count: donations.length
    },
    error: null
  }
}

// Vérifier si l'utilisateur a déjà fait un don à ce projet
async function hasUserDonatedToProject(projectId, donorId) {
  const { data, error } = await supabase
    .from('donations')
    .select('id')
    .eq('project_id', projectId)
    .eq('donor_id', donorId)
    .limit(1)

  return { hasDonated: data && data.length > 0, error }
}
```

---

### 4.2 Hooks personnalisés

#### useDonations

**Fichier** : `src/hooks/useDonations.js`

**Description** : Hook pour gérer les donations d'un utilisateur.

```javascript
import { useState, useEffect } from 'react'
import { donationService } from '../services/donationService'
import { useAuth } from './useAuth'

export function useDonations() {
  const { user } = useAuth()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setDonations([])
      setLoading(false)
      return
    }

    async function fetchDonations() {
      setLoading(true)
      const { data, error } = await donationService.getDonationsByDonor(user.id)

      if (error) {
        setError(error.message)
      } else {
        setDonations(data)
      }

      setLoading(false)
    }

    fetchDonations()
  }, [user])

  // Méthode pour recharger
  async function reload() {
    setLoading(true)
    const { data, error } = await donationService.getDonationsByDonor(user.id)
    if (!error) setDonations(data)
    setLoading(false)
  }

  return {
    donations,
    loading,
    error,
    reload
  }
}
```

---

## 5. Routes et navigation

### 5.1 Nouvelles routes

Ajouter dans `src/App.jsx` :

```jsx
// Routes publiques
<Route path="/projects/:id" element={<ProjectDetailPage />} />

// Routes protégées (authentifié)
<Route
  path="/my-donations"
  element={
    <ProtectedRoute>
      <MyDonationsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/projects/:id/donations"
  element={
    <ProtectedRoute>
      <ProjectDonationsPage />
    </ProtectedRoute>
  }
/>
```

---

### 5.2 Navigation Header

Ajouter un lien "Mes donations" dans le header pour les utilisateurs authentifiés :

**Desktop** :
```jsx
<Link to="/my-donations">
  <Button data-testid="header-donations-link" variant="ghost" size="sm">
    <Heart size={18} />
    Mes donations
  </Button>
</Link>
```

**Mobile** :
```jsx
<Link
  data-testid="header-mobile-donations-link"
  to="/my-donations"
  className="text-gray-600 hover:text-primary-600"
  onClick={() => setMobileMenuOpen(false)}
>
  Mes donations
</Link>
```

---

## 6. Fonctionnalités détaillées

### 6.1 Faire un don

**Flux utilisateur :**

1. **Utilisateur consulte un projet** (`/projects/:id`)
2. **Clic sur "Faire un don"** :
   - Si non authentifié → Redirection `/login` avec `redirect=/projects/:id`
   - Si authentifié → Ouvre modal avec `DonationForm`
3. **Remplit le formulaire** :
   - Montant (requis, >= 1)
   - Message optionnel (max 500 caractères)
4. **Clic sur "Faire un don"** → Modal de confirmation
5. **Modal affiche récapitulatif** :
   - Projet : [Titre]
   - Montant : [X]€
   - Message : [Message ou "Aucun message"]
   - Nouveau total : [total_collected + amount]€ / [goal_amount]€
   - Nouvelle progression : [%]
6. **Clic sur "Confirmer le don"** :
   - Appel `donationService.createDonation()`
   - Si succès :
     - Message toast : "Merci pour votre don de [X]€ !"
     - Ferme modal
     - Recharge les stats et donations du projet
   - Si erreur :
     - Affiche message d'erreur dans le modal

**Validations :**
- ✅ Utilisateur authentifié
- ✅ Projet avec status `active`
- ✅ Montant >= 1
- ✅ Montant est un nombre entier
- ✅ Message <= 500 caractères

**Cas d'erreur :**
- Projet introuvable → 404
- Projet n'est pas actif → "Ce projet n'accepte plus de dons"
- Montant invalide → "Le montant doit être au moins 1€"
- Erreur réseau → "Une erreur est survenue, veuillez réessayer"

---

### 6.2 Modifier une donation

**Flux utilisateur :**

1. **Utilisateur va sur "Mes donations"** (`/my-donations`)
2. **Clic sur "Modifier"** sur une donation :
   - Vérifie que `project.status === 'active'`
   - Si non actif → Bouton désactivé avec tooltip "Le projet n'est plus actif"
3. **Ouvre modal avec formulaire pré-rempli** :
   - Montant actuel
   - Message actuel
4. **Modifie les valeurs**
5. **Clic sur "Enregistrer les modifications"** :
   - Appel `donationService.updateDonation(id, { amount, message })`
   - Si succès :
     - Message toast : "Donation modifiée avec succès"
     - Ferme modal
     - Recharge la liste des donations
   - Si erreur :
     - Affiche message d'erreur

**Validations :**
- Identiques à la création

**Cas d'erreur :**
- Projet n'est plus actif → "Modification impossible, le projet n'est plus actif"
- Donation introuvable → "Cette donation n'existe plus"

---

### 6.3 Annuler une donation

**Flux utilisateur :**

1. **Utilisateur va sur "Mes donations"** (`/my-donations`)
2. **Clic sur "Annuler"** sur une donation :
   - Vérifie que `project.status === 'active'`
   - Si non actif → Bouton désactivé
3. **Ouvre modal de confirmation** :
   - "Êtes-vous sûr de vouloir annuler cette donation de [X]€ ?"
   - "Cette action est irréversible"
   - Boutons : "Annuler" (ferme modal) et "Confirmer l'annulation" (danger)
4. **Clic sur "Confirmer l'annulation"** :
   - Appel `donationService.deleteDonation(id)`
   - Si succès :
     - Message toast : "Donation annulée avec succès"
     - Ferme modal
     - Supprime la donation de la liste (sans recharger)
   - Si erreur :
     - Affiche message d'erreur

**Cas d'erreur :**
- Projet n'est plus actif → "Annulation impossible, le projet n'est plus actif"
- Donation introuvable → "Cette donation n'existe plus"

---

### 6.4 Mise à jour de la progression

**Déclencheurs :**
- Après création d'une donation
- Après modification d'une donation
- Après annulation d'une donation

**Mécanisme :**

Les RPCs Supabase existants recalculent automatiquement :
- `get_project_total_collected(project_uuid)` : Somme des donations
- `get_project_donors_count(project_uuid)` : Nombre de donateurs uniques

**Dans l'interface :**
- Après chaque action, recharger les stats du projet
- Mettre à jour la barre de progression
- Mettre à jour le compteur de donateurs

---

## 7. Data-testid pour tests E2E

### 7.1 ProjectDetailPage

```
project-detail-page
project-detail-header
project-detail-image
project-detail-title
project-detail-creator
project-detail-status-badge
project-detail-description
project-detail-stats
project-detail-donate-button
project-detail-edit-button (si créateur)
project-detail-donations-section
project-detail-donations-list
project-detail-view-all-donations-button
project-detail-loading
project-detail-error
```

### 7.2 DonationForm

```
donation-form
donation-amount-input
donation-message-input
donation-preview-total
donation-cancel-button
donation-submit-button
donation-confirm-modal
donation-confirm-summary
donation-confirm-button
donation-error-message
donation-success-message
```

### 7.3 MyDonationsPage

```
my-donations-page
my-donations-header
my-donations-stats
my-donations-total-amount
my-donations-projects-count
my-donations-count
my-donations-filters
my-donations-status-filter
my-donations-sort-filter
my-donations-list
my-donations-empty-state
donation-edit-modal
donation-edit-form
donation-delete-modal
donation-delete-confirm-button
```

### 7.4 DonationCard

```
donation-card
donation-card-donor-info
donation-card-donor-avatar
donation-card-donor-name
donation-card-amount
donation-card-message
donation-card-date
donation-card-project-info
donation-card-project-title
donation-card-project-status
donation-card-edit-button
donation-card-delete-button
```

### 7.5 ProjectDonationsPage (Créateur)

```
project-donations-page
project-donations-header
project-donations-back-button
project-donations-project-title
project-donations-stats
project-donations-total-collected
project-donations-donors-count
project-donations-donations-count
project-donations-average-amount
project-donations-search
project-donations-sort-filter
project-donations-list
project-donations-export-button
```

---

## 8. Ordre de développement

### 8.1 Session 1 : Composants de base

**Durée estimée** : 1-2 heures

1. ✅ Créer `DonationForm.jsx`
   - Formulaire montant + message
   - Validations
   - Modal de confirmation
   - Git commit : `feat: add DonationForm component`

2. ✅ Créer `DonationCard.jsx`
   - Variantes default et compact
   - Affichage conditionnel des actions
   - Git commit : `feat: add DonationCard component`

3. ✅ Créer `DonationsList.jsx`
   - Grid responsive
   - États loading et vide
   - Git commit : `feat: add DonationsList component`

4. ✅ Créer `ProjectStats.jsx`
   - Widget statistiques projet
   - Git commit : `feat: add ProjectStats component`

---

### 8.2 Session 2 : ProjectDetailPage

**Durée estimée** : 2-3 heures

5. ✅ Créer `ProjectDetailPage.jsx`
   - Layout complet (header, sidebar, contenu)
   - Intégration `ProjectStats`
   - Affichage description
   - Section "Dons récents"
   - Modal donation avec `DonationForm`
   - Git commit : `feat: add ProjectDetailPage with donation modal`

6. ✅ Ajouter route `/projects/:id`
   - Configuration dans App.jsx
   - Git commit : `feat: add project detail route`

7. ✅ Tester le flux complet de donation
   - Ouvrir modal
   - Remplir formulaire
   - Confirmer
   - Vérifier mise à jour stats
   - Git commit : `test: validate donation flow on ProjectDetailPage`

---

### 8.3 Session 3 : MyDonationsPage

**Durée estimée** : 2-3 heures

8. ✅ Créer `MyDonationsPage.jsx`
   - Header avec stats
   - Filtres (status, tri)
   - Intégration `DonationsList`
   - État vide
   - Git commit : `feat: add MyDonationsPage with filters`

9. ✅ Implémenter modification de donation
   - Modal avec formulaire pré-rempli
   - Validation projet actif
   - Git commit : `feat: add donation edit functionality`

10. ✅ Implémenter annulation de donation
    - Modal de confirmation
    - Validation projet actif
    - Git commit : `feat: add donation delete functionality`

11. ✅ Ajouter route `/my-donations`
    - Configuration dans App.jsx avec ProtectedRoute
    - Ajouter lien dans Header
    - Git commit : `feat: add my donations route and navigation`

---

### 8.4 Session 4 : ProjectDonationsPage (Créateur)

**Durée estimée** : 1-2 heures

12. ✅ Créer `ProjectDonationsPage.jsx`
    - Header avec retour
    - Stats détaillées
    - Filtres et recherche
    - Liste complète des donations
    - Git commit : `feat: add ProjectDonationsPage for creators`

13. ✅ Ajouter route `/dashboard/projects/:id/donations`
    - Configuration dans App.jsx
    - Ajouter lien depuis MyProjectsPage
    - Git commit : `feat: add project donations route`

---

### 8.5 Session 5 : Tests et polish

**Durée estimée** : 1-2 heures

14. ✅ Tests manuels complets
    - Tester tous les flux utilisateur
    - Vérifier toutes les validations
    - Tester responsive mobile/tablet/desktop
    - Vérifier tous les data-testid

15. ✅ Corrections et ajustements
    - Corriger bugs identifiés
    - Améliorer UX si nécessaire

16. ✅ Git commit final
    - `feat: complete donation system (Phase 9)`

---

## 9. Validation et tests

### 9.1 Checklist fonctionnelle

**Page détail projet :**
- [x] La page `/projects/:id` se charge sans erreur
- [x] Toutes les infos du projet sont affichées
- [x] Le widget `ProjectStats` affiche les bonnes valeurs
- [ ] Les 10 derniers dons sont affichés
- [x] Le bouton "Faire un don" est visible
- [ ] Clic sur "Faire un don" ouvre le modal (si authentifié)
- [ ] Clic sur "Faire un don" redirige vers login (si non authentifié)
- [ ] Le créateur voit le bouton "Modifier le projet"

**Faire un don :**
- [x] Le modal `DonationForm` s'ouvre correctement
- [x] Les validations fonctionnent (montant >= 1)
- [ ] Le message est optionnel
- [x] Le bouton "Faire un don" affiche le modal de confirmation
- [ ] Le modal de confirmation affiche le récapitulatif
- [x] Clic sur "Confirmer" crée la donation
- [x] Message de succès s'affiche
- [x] Les stats du projet se mettent à jour automatiquement
- [x] La nouvelle donation apparaît dans la liste

**Mes donations :**
- [ ] La page `/my-donations` se charge sans erreur
- [ ] Les statistiques sont correctes
- [ ] Les filtres fonctionnent (status, tri)
- [ ] Toutes les donations sont affichées
- [ ] Le bouton "Modifier" est visible si projet actif
- [ ] Le bouton "Annuler" est visible si projet actif
- [ ] Les boutons sont désactivés si projet non actif

**Modifier une donation :**
- [ ] Clic sur "Modifier" ouvre le modal avec données pré-remplies
- [ ] Les validations fonctionnent
- [ ] Clic sur "Enregistrer" met à jour la donation
- [ ] Message de succès s'affiche
- [ ] La liste se recharge avec les nouvelles valeurs

**Annuler une donation :**
- [ ] Clic sur "Annuler" ouvre le modal de confirmation
- [ ] Clic sur "Confirmer l'annulation" supprime la donation
- [ ] Message de succès s'affiche
- [ ] La donation disparaît de la liste

**Donations projet (créateur) :**
- [ ] La page `/dashboard/projects/:id/donations` se charge
- [ ] Les stats détaillées sont correctes
- [ ] Le filtre de tri fonctionne
- [ ] Toutes les donations sont affichées (pas de limite)

---

### 9.2 Tests responsive

- [ ] **Mobile (375px)** : Tous les composants s'adaptent
- [ ] **Tablet (768px)** : Grid passe à 2 colonnes
- [ ] **Desktop (1200px)** : Grid passe à 3 colonnes

---

### 9.3 Tests de permissions

- [ ] Visiteur non authentifié ne peut pas faire de don (redirection login)
- [ ] Utilisateur authentifié peut faire un don
- [ ] Utilisateur peut modifier/annuler uniquement ses propres donations
- [ ] Créateur voit le bouton "Modifier le projet" sur ses projets
- [ ] Créateur peut voir toutes les donations de son projet

---

### 9.4 Tests d'erreur

- [ ] Projet inexistant → 404
- [ ] Projet non actif → Bouton "Faire un don" désactivé
- [ ] Montant invalide → Message d'erreur
- [ ] Message trop long → Message d'erreur
- [ ] Erreur réseau → Message d'erreur approprié

---

## 10. Points d'attention

### 10.1 Performance

- ⚠️ Limiter les dons affichés sur ProjectDetailPage à 10
- ⚠️ Pagination sur ProjectDonationsPage si > 50 donations
- ⚠️ Optimiser les requêtes (select seulement les champs nécessaires)

### 10.2 UX

- ✅ Toujours afficher un message de confirmation après une action
- ✅ Désactiver visuellement les actions non disponibles
- ✅ Afficher des tooltips explicatifs sur les boutons désactivés
- ✅ Utiliser des loaders pendant les actions asynchrones

### 10.3 Sécurité

- ✅ Vérifier côté backend que l'utilisateur est authentifié
- ✅ Vérifier que le projet est actif avant d'accepter un don
- ✅ Vérifier que l'utilisateur est propriétaire de la donation avant modification/annulation
- ✅ Les RLS policies de Supabase doivent protéger la table `donations`

---

## 11. Ressources

### 11.1 Services existants

- ✅ `src/services/donationService.js` (Phase 4)
- ✅ `src/services/projectService.js` (Phase 4)
- ✅ RPCs Supabase pour statistiques

### 11.2 Composants existants

- ✅ `Button`, `Input`, `Textarea`, `Modal` (Phase 2)
- ✅ `Badge`, `ProgressBar`, `Avatar` (Phase 2)
- ✅ `Card` (Phase 2)
- ✅ `Skeleton` (Phase 2)

### 11.3 Hooks existants

- ✅ `useAuth` (Phase 4)
- ✅ `useProjects` (à créer ou adapter)

---

**Fin du plan Phase 9**

**Prochaine étape** : Développer les composants dans l'ordre défini ci-dessus.
