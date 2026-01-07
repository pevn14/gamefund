# Plan d'implémentation - Phase 6 : Galerie de Projets Publique

## Objectif
Créer la page publique de galerie de projets permettant aux visiteurs (authentifiés ou non) de consulter tous les projets actifs avec recherche, filtres et tri.

---

## Architecture découverte

### Composants UI existants réutilisables
- ✅ **Card** (avec CardImage, CardContent, CardFooter, CardTitle, CardDescription)
  - Supporte hover effect avec `hover={true}`
  - CardImage avec lazy loading intégré
- ✅ **Badge** - Variants de statut déjà définis (draft, active, completed, failed, etc.)
- ✅ **ProgressBar** - Avec animated, showLabel, showPercentage
- ✅ **Avatar** - Multiple tailles, fallback automatique
- ✅ **Skeleton** et **SkeletonCard** - Pour états de chargement
- ✅ **Button, Input, Select** - Composants de formulaire

### Services existants
- ✅ **projectService.js** - `getProjects(filters)` déjà implémenté
  - Supporte: status, search, sortBy, sortOrder
  - Joint automatiquement les données créateur (profile)
- ✅ **getUserProfile()** - Pour récupérer infos créateur

### Patterns établis
- Structure de page: `min-h-screen bg-gray-50 py-12` + `max-w-* mx-auto px-6`
- Grilles responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- États: loading/error/empty avec useState
- Fetch dans useEffect

---

## Composants à créer

### 1. ProjectCard.jsx (`src/components/projects/ProjectCard.jsx`)

**Responsabilité**: Afficher une carte de projet individuelle

**Props**:
```javascript
{
  project: {
    id,
    title,
    description,
    image_url,
    goal_amount,
    deadline,
    status,
    creator: {
      display_name,
      avatar_url
    }
  }
}
```

**Structure**:
```jsx
<Card hover>
  <CardImage src={project.image_url} alt={project.title} />
  <CardContent>
    <div className="flex items-center justify-between mb-2">
      <Badge variant={project.status}>{status_text}</Badge>
      <span className="text-xs text-gray-500">{days_remaining}</span>
    </div>

    <CardTitle>{project.title}</CardTitle>
    <CardDescription>{truncated_description}</CardDescription>

    {/* Funding Progress */}
    <ProgressBar
      value={total_collected}
      max={goal_amount}
      variant="success"
      showPercentage
      animated
    />

    {/* Stats row */}
    <div className="flex items-center justify-between text-sm">
      <span>{collected_amount} / {goal_amount}€</span>
      <span>{donors_count} donateurs</span>
    </div>
  </CardContent>

  <CardFooter>
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <Avatar src={creator.avatar_url} size="sm" />
        <span className="text-sm">{creator.display_name}</span>
      </div>
      <Button variant="primary" size="sm">
        Voir le projet
      </Button>
    </div>
  </CardFooter>
</Card>
```

**Fonctionnalités**:
- Calcul jours restants avec `new Date(deadline) - new Date()`
- Troncature description à 100 caractères
- Utilisation de `getProjectStats()` pour montant collecté (ou calcul côté composant parent)
- Link React Router vers `/projects/:id`

---

### 2. ProjectGrid.jsx (`src/components/projects/ProjectGrid.jsx`)

**Responsabilité**: Afficher la grille de ProjectCards avec états de chargement/vide

**Props**:
```javascript
{
  projects: [],
  loading: boolean,
  error: string | null
}
```

**Structure**:
```jsx
export default function ProjectGrid({ projects, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Aucun projet trouvé</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

---

### 3. ProjectFilters.jsx (`src/components/projects/ProjectFilters.jsx`)

**Responsabilité**: Barre de recherche, filtres de statut et options de tri

**Props**:
```javascript
{
  onSearchChange: (value) => void,
  onStatusChange: (status) => void,
  onSortChange: (sortBy, sortOrder) => void,
  initialSearch: '',
  initialStatus: 'active',
  initialSort: 'created_at'
}
```

**Structure**:
```jsx
<div className="mb-8 space-y-4">
  {/* Search Bar */}
  <Input
    type="search"
    placeholder="Rechercher un projet..."
    value={search}
    onChange={(e) => handleSearchChange(e.target.value)}
  />

  <div className="flex flex-wrap gap-4">
    {/* Status Filter */}
    <Select
      label="Statut"
      value={status}
      onChange={(e) => handleStatusChange(e.target.value)}
    >
      <option value="all">Tous les projets</option>
      <option value="active">Actifs</option>
      <option value="completed">Terminés</option>
      <option value="failed">Échoués</option>
    </Select>

    {/* Sort Options */}
    <Select
      label="Trier par"
      value={sortBy}
      onChange={(e) => handleSortChange(e.target.value)}
    >
      <option value="created_at">Plus récents</option>
      <option value="created_at_asc">Plus anciens</option>
      <option value="goal_amount">Objectif (croissant)</option>
      <option value="goal_amount_desc">Objectif (décroissant)</option>
      <option value="deadline">Date limite (proche)</option>
    </Select>
  </div>
</div>
```

**Fonctionnalités**:
- Debounce sur la recherche (300ms) avec `setTimeout`
- Emit des changements au parent via callbacks
- État local pour inputs contrôlés

---

### 4. ProjectsPage.jsx (`src/pages/public/ProjectsPage.jsx`)

**Responsabilité**: Page principale orchestrant fetch, filtres et affichage (**HOMEPAGE**)

**Structure**:
```jsx
import { useState, useEffect } from 'react'
import { Container } from '@/components/layout/Container'
import ProjectFilters from '@/components/projects/ProjectFilters'
import ProjectGrid from '@/components/projects/ProjectGrid'
import * as projectService from '@/services/projectService'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter states
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('active')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    fetchProjects()
  }, [search, status, sortBy, sortOrder])

  async function fetchProjects() {
    setLoading(true)
    setError(null)

    try {
      const filters = {
        status: status === 'all' ? undefined : status,
        search: search || undefined,
        sortBy,
        sortOrder
      }

      const { projects: data, error: fetchError } = await projectService.getProjects(filters)

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setProjects(data || [])
      }
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Découvrez les projets
          </h1>
          <p className="text-gray-600">
            Soutenez les créateurs de jeux vidéo indépendants
          </p>
        </div>

        <ProjectFilters
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onSortChange={(sort) => {
            const [field, order] = sort.includes('_desc')
              ? [sort.replace('_desc', ''), 'desc']
              : [sort.replace('_asc', ''), sort.includes('_asc') ? 'asc' : 'desc']
            setSortBy(field)
            setSortOrder(order)
          }}
          initialSearch={search}
          initialStatus={status}
          initialSort={sortBy}
        />

        <ProjectGrid
          projects={projects}
          loading={loading}
          error={error}
        />
      </Container>
    </div>
  )
}
```

---

## Modifications aux fichiers existants

### App.jsx
**Actions**:
1. Déplacer TestHome de `/` vers `/test`
2. Ajouter ProjectsPage sur `/` (nouvelle homepage)
3. Ajouter route `/projects/:id` pour ProjectDetailPage

```jsx
import TestHome from './pages/TestHome'
import ProjectsPage from './pages/public/ProjectsPage'
import ProjectDetailPage from './pages/public/ProjectDetailPage'
import ComponentsDemo from './pages/ComponentsDemo'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <Routes>
      {/* Homepage - Galerie de projets */}
      <Route path="/" element={<ProjectsPage />} />

      {/* Détail projet */}
      <Route path="/projects/:id" element={<ProjectDetailPage />} />

      {/* Pages de test (dev) */}
      <Route path="/test" element={<TestHome />} />
      <Route path="/components" element={<ComponentsDemo />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  )
}
```

### projectService.js
**Action**: ✅ FAIT - Modifier `getProjects()` pour inclure automatiquement les stats

---

## Ordre d'implémentation

1. ✅ **Améliorer projectService.js** → Ajouter stats dans getProjects()
2. **Créer projets de test SQL** → Insérer 3-5 projets fictifs
3. **ProjectCard** → Composant autonome, testable isolément
4. **ProjectGrid** → Wrapper simple avec états
5. **ProjectFilters** → Gestion d'état plus complexe
6. **ProjectsPage** → Orchestration finale (homepage)
7. **ProjectDetailPage** → Page placeholder simple
8. **Routes dans App.jsx** → / → ProjectsPage, /test → TestHome, /projects/:id → ProjectDetailPage
9. **Test avec données** → Validation fonctionnelle

---

## Données de test - Script SQL

### Création de 5 projets de test

**Prérequis**: Récupérer l'UUID d'un utilisateur créateur depuis la table profiles

```sql
-- 1. Récupérer l'UUID d'un créateur
SELECT id, email, display_name FROM profiles LIMIT 1;
-- Copier l'UUID pour la suite

-- 2. Insérer 5 projets variés
INSERT INTO projects (creator_id, title, description, image_url, goal_amount, deadline, status)
VALUES
  -- Projet 1: RPG fantasy (actif, proche objectif)
  ('{creator_uuid}',
   'Mystic Quest: The Awakening',
   'Un RPG épique mêlant magie et technologie dans un monde post-apocalyptique. Explorez des donjons mystérieux, combattez des créatures légendaires et sauvez le monde de l''extinction.',
   'https://picsum.photos/seed/game1/800/400',
   50000,
   NOW() + INTERVAL '30 days',
   'active'),

  -- Projet 2: Platformer indé (actif, début de campagne)
  ('{creator_uuid}',
   'Cyber Ninja Chronicles',
   'Un jeu d''action-platformer cyberpunk où vous incarnez un ninja futuriste. Parcourez les toits d''une mégalopole dystopique et déjouez les complots d''une corporation maléfique.',
   'https://picsum.photos/seed/game2/800/400',
   30000,
   NOW() + INTERVAL '45 days',
   'active'),

  -- Projet 3: Puzzle game (actif, presque terminé)
  ('{creator_uuid}',
   'Quantum Enigma',
   'Un jeu de réflexion innovant basé sur la physique quantique. Résolvez des énigmes en manipulant le temps et l''espace dans un univers visuel époustouflant.',
   'https://picsum.photos/seed/game3/800/400',
   15000,
   NOW() + INTERVAL '10 days',
   'active'),

  -- Projet 4: Simulation (actif, gros budget)
  ('{creator_uuid}',
   'Galactic Tycoon',
   'Construisez votre empire spatial dans cette simulation de gestion. Explorez la galaxie, établissez des colonies et dominez le commerce interstellaire.',
   'https://picsum.photos/seed/game4/800/400',
   100000,
   NOW() + INTERVAL '60 days',
   'active'),

  -- Projet 5: Roguelike (actif, petit projet)
  ('{creator_uuid}',
   'Dungeon Dash',
   'Un roguelike rapide et addictif. Affrontez des hordes de monstres dans des donjons générés aléatoirement. Chaque partie est unique !',
   'https://picsum.photos/seed/game5/800/400',
   8000,
   NOW() + INTERVAL '20 days',
   'active');

-- 3. Vérifier l'insertion
SELECT id, title, goal_amount, deadline, status FROM projects;
```

**Note**: Remplacer `{creator_uuid}` par l'UUID réel d'un utilisateur avant exécution.

### Optionnel: Ajouter des donations pour les stats

```sql
-- Récupérer l'UUID d'un donateur
SELECT id FROM profiles LIMIT 1;

-- Ajouter quelques donations pour tester les stats
INSERT INTO donations (project_id, donor_id, amount, message)
SELECT
  p.id,
  '{donor_uuid}',
  CASE
    WHEN p.title = 'Mystic Quest: The Awakening' THEN 5000
    WHEN p.title = 'Quantum Enigma' THEN 14000
    WHEN p.title = 'Dungeon Dash' THEN 2000
    ELSE 1000
  END,
  'Super projet, hâte de tester !'
FROM projects p
WHERE p.status = 'active'
LIMIT 3;
```

---

## Points d'attention

### 1. Calcul du montant collecté
✅ **Solution choisie**: Modifier getProjects() pour inclure `total_collected` et `donors_count` via Promise.all

### 2. Calcul des jours restants
**Implémentation dans ProjectCard**:
```javascript
function getDaysRemaining(deadline) {
  const now = new Date()
  const end = new Date(deadline)
  const diffTime = end - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Terminé'
  if (diffDays === 0) return "Dernier jour !"
  if (diffDays === 1) return "1 jour restant"
  return `${diffDays} jours restants`
}
```

### 3. Troncature de description
```javascript
function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}
```

### 4. Images de placeholder
Si projet sans image:
- Utiliser Picsum: `https://picsum.photos/seed/${project.id}/800/400`
- Ou image par défaut: `/placeholder-game.jpg`

### 5. Debounce de recherche
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    onSearchChange(searchValue)
  }, 300)

  return () => clearTimeout(timer)
}, [searchValue])
```

---

## Tests manuels à effectuer

1. ✅ Affichage grille vide (base sans projets)
2. ✅ Loading state (skeletons pendant fetch)
3. ✅ Affichage projets actifs
4. ✅ Recherche par titre
5. ✅ Filtre par statut
6. ✅ Tri (newest, oldest, etc.)
7. ✅ Hover effect sur cards
8. ✅ Click sur "Voir le projet" (navigation)
9. ✅ Responsive (mobile, tablet, desktop)
10. ✅ Calcul progression correcte

---

## Commits Git

1. ✅ `feat: enhance getProjects() to include stats`
2. `data: add 5 test projects via SQL`
3. `feat: add ProjectCard component`
4. `feat: add ProjectGrid with loading states`
5. `feat: add ProjectFilters component`
6. `feat: add ProjectsPage as new homepage`
7. `feat: add ProjectDetailPage placeholder`
8. `feat: update routes - ProjectsPage on /, TestHome on /test`
9. `feat: complete public project gallery (Phase 6)`

---

## Fichiers critiques

### À créer
- `src/components/projects/ProjectCard.jsx` - Carte projet individuelle
- `src/components/projects/ProjectGrid.jsx` - Grille de cartes avec états
- `src/components/projects/ProjectFilters.jsx` - Recherche/filtres/tri
- `src/pages/public/ProjectsPage.jsx` - Homepage avec galerie
- `src/pages/public/ProjectDetailPage.jsx` - Page détail placeholder

### À modifier
- ✅ `src/services/projectService.js` - Enrichir getProjects() avec stats
- `src/App.jsx` - Routes: / → ProjectsPage, /test → TestHome, /projects/:id → ProjectDetailPage

### À référencer
- `src/components/ui/Card.jsx` (Card, CardImage, CardContent, etc.)
- `src/components/ui/Badge.jsx` (variants de statut)
- `src/components/ui/ProgressBar.jsx` (funding progress)
- `src/components/ui/Avatar.jsx` (créateur)
- `src/components/ui/Skeleton.jsx` (loading)
- `src/components/layout/Container.jsx` (wrapper responsive)

---

## Décisions utilisateur ✅

### 1. Données de test
✅ **Créer 3-5 projets de test via SQL**
- Insertion de projets fictifs avec images Picsum
- Projets variés (différents objectifs, deadlines, créateurs)

### 2. Route homepage
✅ **Remplacer / par ProjectsPage**
- TestHome déplacé vers `/test`
- ProjectsPage devient la vraie homepage

### 3. Détail de projet
✅ **Créer page placeholder simple**
- `src/pages/public/ProjectDetailPage.jsx`
- Affiche titre + message "Page en construction"

### 4. Amélioration projectService
✅ **Modifier getProjects() pour inclure stats automatiquement**
- Utiliser fonctions PostgreSQL `get_project_total_collected()` et `get_project_donors_count()`
- Une seule requête avec toutes les données

---

**Date de création**: 07 janvier 2026
**Status**: En cours d'implémentation
