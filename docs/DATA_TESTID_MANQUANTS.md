# Data-testid Manquants - Rapport Détaillé

**Date** : 21 janvier 2026
**Source** : Analyse du fichier docs/data_testids.csv

---

## Résumé

**25 data-testid documentés dans TESTING.md sont absents du code.**

Ces éléments sont soit :
- Des fonctionnalités non implémentées
- Des wrappers/containers manquants
- Des éléments de feedback (messages, états) non identifiés

---

## Liste Détaillée par Section

### 1. CRUD Projets (Create/Edit) - 5 manquants

| data-testid | Élément | Fichier attendu | Statut |
|-------------|---------|----------------|--------|
| `project-form-tagline-input` | Champ tagline | CreateProjectPage.jsx | ❌ Champ non implémenté |
| `project-form-image-preview` | Prévisualisation image | CreateProjectPage.jsx | ❌ Container manquant |
| `project-form-cancel-button` | Bouton annuler | CreateProjectPage.jsx | ❌ Bouton manquant |
| `project-form-error` | Message erreur | CreateProjectPage.jsx | ❌ Container manquant |
| `project-form-success` | Message succès | CreateProjectPage.jsx | ❌ Container manquant |

**Impact** : Moyen
**Note** : Le champ "tagline" n'existe pas dans le formulaire (seulement title + description). Les autres sont des éléments de feedback/UX qui existent probablement mais sans data-testid.

---

### 2. Mes Projets (MyProjectsPage) - 3 manquants

| data-testid | Élément | Fichier attendu | Statut |
|-------------|---------|----------------|--------|
| `my-project-card-title` | Titre | MyProjectsPage.jsx | ❌ Pas de testid sur le titre |
| `my-project-card-status` | Badge statut | MyProjectsPage.jsx | ❌ Pas de testid sur le badge |
| `my-project-card-stats` | Statistiques | MyProjectsPage.jsx | ❌ Container manquant |

**Impact** : Faible
**Note** : Ces éléments existent mais n'ont pas de data-testid individuels. La carte `my-project-card` existe.

---

### 3. Système de Dons - 7 manquants

#### DonationForm
| data-testid | Élément | Fichier attendu | Statut |
|-------------|---------|----------------|--------|
| `donation-confirm-amount` | Montant affiché | DonationForm.jsx | ❌ Pas de testid |
| `donation-success-message` | Message succès | DonationForm.jsx | ❌ Container manquant |

#### DonationCard (Mes Donations)
| data-testid | Élément | Fichier attendu | Statut |
|-------------|---------|----------------|--------|
| `donation-card-project` | Nom projet | DonationCard.jsx | ❌ Pas de testid |
| `donation-card-amount` | Montant | DonationCard.jsx | ❌ Pas de testid |
| `donation-card-date` | Date | DonationCard.jsx | ❌ Pas de testid |
| `donation-card-edit-button` | Bouton modifier | DonationCard.jsx | ❌ Pas de testid |
| `donation-card-delete-button` | Bouton supprimer | DonationCard.jsx | ❌ Pas de testid |

**Impact** : Moyen
**Note** : Le composant DonationCard existe mais ses sous-éléments n'ont pas de data-testid.

---

### 4. Donations Reçues (Créateur) - 1 manquant

| data-testid | Élément | Fichier attendu | Statut |
|-------------|---------|----------------|--------|
| `project-donations-list` | Liste des donations | ProjectDonationsPage.jsx | ❌ Container manquant |

**Impact** : Faible

---

### 5. Dashboard Créateur - 3 manquants

| data-testid | Élément | Fichier attendu | Statut |
|-------------|---------|----------------|--------|
| `creator-dashboard-recent-projects` | Section projets récents | CreatorDashboardPage.jsx | ❌ Container manquant |
| `creator-dashboard-quick-actions` | Section actions rapides | CreatorDashboardPage.jsx | ❌ Container manquant |
| `creator-dashboard-empty` | État vide (nouveau créateur) | CreatorDashboardPage.jsx | ❌ État manquant |

**Impact** : Faible
**Note** : Ces sections existent (RecentProjectsList, QuickActions) mais n'ont pas de wrapper avec data-testid dans le Dashboard.

---

### 6. Dashboard Donateur - 5 manquants

| data-testid | Élément | Fichier attendu | Statut |
|-------------|---------|----------------|--------|
| `donor-dashboard-stat-total-donated` | Total donné | DonorDashboardPage.jsx | ❌ Stat individuelle |
| `donor-dashboard-stat-projects-count` | Projets soutenus | DonorDashboardPage.jsx | ❌ Stat individuelle |
| `donor-dashboard-stat-successful` | Projets réussis | DonorDashboardPage.jsx | ❌ Stat individuelle |
| `donor-dashboard-recent-donations` | Donations récentes | DonorDashboardPage.jsx | ❌ Container manquant |
| `donor-dashboard-empty` | État vide | DonorDashboardPage.jsx | ❌ État manquant |

**Impact** : Moyen
**Note** : Les statistiques existent probablement mais sans data-testid individuels sur chaque stat.

---

### 7. Admin - Gestion Utilisateurs - 1 manquant

| data-testid | Élément | Fichier attendu | Statut |
|-------------|---------|----------------|--------|
| `admin-users-search` | Recherche | AdminUsersPage.jsx | ❌ **Fonctionnalité non implémentée** |

**Impact** : Critique si tests cherchent cette fonctionnalité
**Note** : C'est le seul cas où la **fonctionnalité complète est absente**, pas juste le data-testid.

---

## Analyse par Type de Problème

### Type A : Fonctionnalité Non Implémentée (2)
1. `project-form-tagline-input` - Le champ tagline n'existe pas
2. `admin-users-search` - La recherche utilisateurs n'existe pas

**Action recommandée** : Décider si ces fonctionnalités doivent être implémentées ou retirées de TESTING.md

---

### Type B : Élément Existant Sans data-testid (15)
- Tous les sous-éléments de `my-project-card` (3)
- Tous les sous-éléments de `donation-card` (5)
- Toutes les stats de `donor-dashboard` (3)
- `donation-confirm-amount` (1)
- `project-donations-list` (1)
- `creator-dashboard-recent-projects` (1)
- `creator-dashboard-quick-actions` (1)

**Action recommandée** : Ajouter les data-testid manquants sur ces éléments existants

---

### Type C : Containers/Wrappers Manquants (5)
- `project-form-image-preview`
- `project-form-error`
- `project-form-success`
- `my-project-card-stats`
- `donation-success-message`

**Action recommandée** : Ajouter des wrappers avec data-testid autour de ces groupes d'éléments

---

### Type D : États Conditionnels Manquants (3)
- `creator-dashboard-empty`
- `donor-dashboard-empty`
- `donor-dashboard-recent-donations`

**Action recommandée** : Ajouter data-testid sur les états vides/sections conditionnelles

---

## Priorité de Correction

### 🔴 Priorité Haute (7)
1. `admin-users-search` - Décider : implémenter ou retirer
2. `project-form-tagline-input` - Décider : implémenter ou retirer
3. `donation-card-*` (5 éléments) - Essentiels pour tester les donations

### 🟡 Priorité Moyenne (10)
4. `project-form-*` (3 éléments feedback) - UX important
5. `my-project-card-*` (3 sous-éléments) - Tests CRUD créateur
6. `donor-dashboard-stat-*` (3 stats) - Tests dashboard donateur
7. `donation-confirm-amount` - Vérification montant

### 🟢 Priorité Basse (8)
8. `creator-dashboard-*` (3 sections) - Nice to have
9. `donor-dashboard-*` (2 états) - Tests d'états
10. `project-donations-list` - Container
11. `donation-success-message` - Feedback
12. `project-form-cancel-button` - Action secondaire

---

## Recommandations

### Court Terme
1. **Décider du sort des 2 fonctionnalités manquantes** (tagline, search)
2. **Ajouter data-testid sur DonationCard** (priorité haute - 5 éléments)
3. **Ajouter data-testid sur les stats DonorDashboard** (3 éléments)

### Moyen Terme
4. Ajouter data-testid sur MyProjectCard (3 éléments)
5. Ajouter containers de feedback sur project-form (3 éléments)
6. Ajouter data-testid sur donation-confirm-amount

### Long Terme
7. Ajouter wrappers pour sections dashboard (5 éléments)
8. Ajouter états vides (2 éléments)

---

## Impact sur les Tests E2E

### Tests Bloqués (Ne peuvent pas être écrits)
- **Recherche utilisateurs admin** - Fonctionnalité absente
- **Édition de champ tagline** - Champ absent

### Tests Partiels (Peuvent tester la page mais pas les détails)
- **DonationCard** - Peut tester la liste mais pas les détails de carte
- **MyProjectCard** - Peut tester la grille mais pas les détails de carte
- **DonorDashboard stats** - Peut tester la page mais pas les stats individuelles

### Tests Non Affectés
- Authentification ✅
- Navigation ✅
- Galerie projets ✅
- Détail projet ✅
- CRUD projets (sauf tagline) ✅
- Dashboard Admin ✅

---

## Fichiers à Modifier

| Fichier | Nb data-testid à ajouter | Priorité |
|---------|-------------------------|----------|
| `src/components/donations/DonationCard.jsx` | 5 | 🔴 Haute |
| `src/pages/DonorDashboardPage.jsx` | 5 | 🟡 Moyenne |
| `src/pages/creator/MyProjectsPage.jsx` | 3 | 🟡 Moyenne |
| `src/pages/creator/CreateProjectPage.jsx` | 4 | 🟡 Moyenne |
| `src/components/donations/DonationForm.jsx` | 2 | 🟡 Moyenne |
| `src/pages/creator/CreatorDashboardPage.jsx` | 3 | 🟢 Basse |
| `src/pages/ProjectDonationsPage.jsx` | 1 | 🟢 Basse |
| `src/pages/AdminUsersPage.jsx` | 1 | 🔴 Haute (décision) |

**Total** : 8 fichiers, 25 data-testid

---

**Rapport généré le** : 21 janvier 2026
**Par** : Claude Code (Assistant de développement)
