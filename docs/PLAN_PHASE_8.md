# Phase 8 : Dashboard Créateur ⏳

**Date de début** : 2026-01-08
**Statut** : À commencer

---

## 🎯 Objectif

Créer un dashboard complet pour les créateurs avec statistiques globales, vue d'ensemble des projets et accès rapides aux actions principales.

---

## 📦 Composants à créer

### 1. Composant : StatsCard

**Fichier** : `src/components/dashboard/StatsCard.jsx`

**Responsabilité** : Afficher une statistique individuelle avec icône, valeur et label

**Props** :
```javascript
{
  icon: ReactNode,           // Icône Lucide React
  label: string,             // Label de la stat (ex: "Projets actifs")
  value: string | number,    // Valeur à afficher (ex: 3, "15 450€")
  trend?: {                  // Optionnel : tendance
    value: number,           // +10, -5
    label: string           // "vs mois dernier"
  },
  variant?: 'default' | 'primary' | 'success' | 'warning'
}
```

**Structure** :
```jsx
<Card>
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${variantBgColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {trend && (
        <div className={`text-sm ${trend.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
          <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
          <span className="text-gray-500"> {trend.label}</span>
        </div>
      )}
    </div>
  </CardContent>
</Card>
```

**Variants de couleur** :
- `default` : Gris
- `primary` : Violet (primary)
- `success` : Vert
- `warning` : Orange

---

### 2. Composant : RecentProjectsList

**Fichier** : `src/components/dashboard/RecentProjectsList.jsx`

**Responsabilité** : Afficher les 3-5 projets les plus récents avec statut et statistiques

**Props** :
```javascript
{
  projects: Array,           // Liste des projets
  loading: boolean,
  onViewAll: () => void      // Callback "Voir tous les projets"
}
```

**Structure** :
```jsx
<Card>
  <CardContent className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold">Projets récents</h2>
      <Button variant="ghost" size="sm" onClick={onViewAll}>
        Voir tout
        <ChevronRight size={16} />
      </Button>
    </div>

    {loading ? (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}
      </div>
    ) : projects.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <Plus size={48} className="mx-auto mb-2 text-gray-300" />
        <p>Aucun projet pour le moment</p>
        <Button variant="primary" size="sm" className="mt-4">
          Créer mon premier projet
        </Button>
      </div>
    ) : (
      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            {/* Image miniature */}
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              {project.image_url ? (
                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                  <span className="text-2xl">🎮</span>
                </div>
              )}
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
                <Badge variant={statusColors[project.status]}>
                  {statusLabels[project.status]}
                </Badge>
              </div>

              {project.status === 'active' && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      {project.total_collected || 0}€ / {project.goal_amount}€
                    </span>
                    <span className="text-gray-600">
                      {Math.round((project.total_collected || 0) / project.goal_amount * 100)}%
                    </span>
                  </div>
                  <ProgressBar
                    value={(project.total_collected || 0) / project.goal_amount * 100}
                    size="sm"
                  />
                </div>
              )}

              {project.status === 'draft' && (
                <p className="text-sm text-gray-500 mt-1">
                  En attente de publication
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate(`/projects/${project.id}/edit`)}>
                <Edit size={16} />
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate(`/projects/${project.id}`)}>
                <Eye size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>
```

---

### 3. Composant : QuickActions

**Fichier** : `src/components/dashboard/QuickActions.jsx`

**Responsabilité** : Afficher les actions rapides pour le créateur

**Structure** :
```jsx
<Card>
  <CardContent className="p-6">
    <h2 className="text-xl font-semibold mb-6">Actions rapides</h2>

    <div className="grid grid-cols-1 gap-3">
      <Button
        variant="primary"
        size="lg"
        className="w-full justify-start"
        onClick={() => navigate('/projects/create')}
      >
        <Plus size={20} />
        Créer un nouveau projet
      </Button>

      <Button
        variant="outline"
        size="md"
        className="w-full justify-start"
        onClick={() => navigate('/dashboard/projects')}
      >
        <FolderOpen size={18} />
        Gérer mes projets
      </Button>

      <Button
        variant="outline"
        size="md"
        className="w-full justify-start"
        onClick={() => navigate('/profile')}
      >
        <User size={18} />
        Modifier mon profil
      </Button>
    </div>
  </CardContent>
</Card>
```

---

### 4. Page : CreatorDashboardPage

**Fichier** : `src/pages/creator/CreatorDashboardPage.jsx`

**Route** : `/dashboard` (protégée)

**Responsabilité** : Page principale du dashboard créateur orchestrant tous les composants

**Structure** :
```jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '../../components/layout/Container'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { RecentProjectsList } from '../../components/dashboard/RecentProjectsList'
import { QuickActions } from '../../components/dashboard/QuickActions'
import { useAuth } from '../../hooks/useAuth'
import { getProjectsByCreator } from '../../services/projectService'
import { Target, FolderOpen, Users, TrendingUp } from 'lucide-react'

export function CreatorDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    draftProjects: 0,
    completedProjects: 0,
    totalCollected: 0,
    totalDonors: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    setLoading(true)

    try {
      const { projects: projectsData, error } = await getProjectsByCreator(user.id)

      if (error) throw error

      setProjects(projectsData || [])

      // Calculer les statistiques
      const totalCollected = projectsData.reduce((sum, p) => sum + (p.total_collected || 0), 0)
      const totalDonors = projectsData.reduce((sum, p) => sum + (p.donors_count || 0), 0)

      setStats({
        totalProjects: projectsData.length,
        activeProjects: projectsData.filter(p => p.status === 'active').length,
        draftProjects: projectsData.filter(p => p.status === 'draft').length,
        completedProjects: projectsData.filter(p => p.status === 'completed').length,
        totalCollected,
        totalDonors
      })
    } catch (err) {
      console.error('Erreur chargement dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  // Projets récents (max 5)
  const recentProjects = projects
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard Créateur
          </h1>
          <p className="text-gray-600">
            Bienvenue {user?.user_metadata?.display_name || user?.email} 👋
          </p>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<FolderOpen size={24} className="text-primary-600" />}
            label="Total projets"
            value={stats.totalProjects}
            variant="primary"
          />

          <StatsCard
            icon={<Target size={24} className="text-green-600" />}
            label="Projets actifs"
            value={stats.activeProjects}
            variant="success"
          />

          <StatsCard
            icon={<TrendingUp size={24} className="text-blue-600" />}
            label="Fonds collectés"
            value={`${stats.totalCollected.toLocaleString('fr-FR')}€`}
            variant="default"
          />

          <StatsCard
            icon={<Users size={24} className="text-purple-600" />}
            label="Donateurs"
            value={stats.totalDonors}
            variant="default"
          />
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projets récents (2/3) */}
          <div className="lg:col-span-2">
            <RecentProjectsList
              projects={recentProjects}
              loading={loading}
              onViewAll={() => navigate('/dashboard/projects')}
            />
          </div>

          {/* Actions rapides (1/3) */}
          <div className="lg:col-span-1">
            <QuickActions />

            {/* Brouillons en attente */}
            {stats.draftProjects > 0 && (
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <AlertCircle size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {stats.draftProjects} brouillon{stats.draftProjects > 1 ? 's' : ''} en attente
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Terminez et publiez vos projets pour commencer à collecter des dons
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/dashboard/projects?filter=draft')}
                      >
                        Voir les brouillons
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
```

---

## 🛠️ Services utilisés

### projectService.js

Fonctions utilisées :
- `getProjectsByCreator(creatorId)` : Récupère tous les projets avec stats (total_collected, donors_count)

**Note** : Les statistiques `total_collected` et `donors_count` sont déjà incluses dans les projets retournés par `getProjectsByCreator` grâce aux RPCs Supabase.

---

## 📊 Calculs des statistiques

### Stats globales

Les statistiques sont calculées côté frontend à partir de tous les projets :

```javascript
const stats = {
  // Comptage simple
  totalProjects: projects.length,
  activeProjects: projects.filter(p => p.status === 'active').length,
  draftProjects: projects.filter(p => p.status === 'draft').length,
  completedProjects: projects.filter(p => p.status === 'completed').length,

  // Agrégation
  totalCollected: projects.reduce((sum, p) => sum + (p.total_collected || 0), 0),
  totalDonors: projects.reduce((sum, p) => sum + (p.donors_count || 0), 0)
}
```

### Pourcentage de complétion par projet

```javascript
const completionPercentage = (totalCollected, goalAmount) => {
  if (!goalAmount || goalAmount === 0) return 0
  return Math.min(Math.round((totalCollected / goalAmount) * 100), 100)
}
```

---

## 🎨 Design et UX

### Layout

- **Grid responsive** : 4 colonnes sur desktop (stats), 2/3 + 1/3 pour le contenu principal
- **Mobile first** : Colonnes empilées sur mobile
- **Spacing cohérent** : gap-6 pour grilles, gap-8 pour sections

### Composants visuels

- **StatsCard** : Cards avec icônes colorées et valeurs proéminentes
- **RecentProjectsList** : Liste compacte avec miniatures et infos essentielles
- **QuickActions** : Boutons pleine largeur avec icônes
- **Badges de statut** : Même système que MyProjectsPage
- **ProgressBar** : Pour projets actifs

### Feedback utilisateur

- **Skeleton loaders** : Pendant chargement des stats
- **État vide** : Message + CTA si aucun projet
- **Alert brouillons** : Rappel visuel si des brouillons en attente
- **Navigation rapide** : Tous les éléments sont cliquables

---

## 🔒 Sécurité

### Protection de la route

- Route `/dashboard` protégée par `ProtectedRoute`
- Vérifie l'authentification avant accès
- Redirige vers `/login` si non connecté

### Vérification de propriété

- Les projets affichés sont filtrés par `creator_id`
- Seuls les projets appartenant à l'utilisateur connecté sont affichés

---

## 🚀 Routes à ajouter

| Route | Composant | Protection | Description |
|-------|-----------|------------|-------------|
| `/dashboard` | CreatorDashboardPage | ✓ | Dashboard principal créateur |

**Modification de App.jsx** :
- Ajouter l'import de CreatorDashboardPage
- Ajouter la route protégée `/dashboard`

---

## 📝 Fichiers à créer

```
src/
├── components/
│   └── dashboard/
│       ├── StatsCard.jsx           (nouveau)
│       ├── RecentProjectsList.jsx  (nouveau)
│       └── QuickActions.jsx        (nouveau)
└── pages/
    └── creator/
        └── CreatorDashboardPage.jsx (nouveau)
```

---

## 🔄 Fichiers à modifier

- `src/App.jsx` : Ajout de la route `/dashboard`
- `src/components/layout/Header.jsx` (optionnel) : Lien vers le dashboard

---

## 📋 Ordre d'implémentation

1. **StatsCard** → Composant de base réutilisable
2. **QuickActions** → Composant simple sans logique
3. **RecentProjectsList** → Composant avec logique de tri
4. **CreatorDashboardPage** → Orchestration finale
5. **Route dans App.jsx** → `/dashboard` → CreatorDashboardPage
6. **Lien dans Header** (optionnel) → "Dashboard" dans navigation

---

## 🧪 Tests à effectuer

### Test 1 : Accès au dashboard
1. Se connecter en tant que créateur
2. Accéder à `/dashboard`
3. ✓ Vérifier l'affichage du dashboard
4. ✓ Vérifier le message de bienvenue avec nom d'utilisateur

### Test 2 : Statistiques avec projets
1. Avoir 2-3 projets créés (draft, active)
2. Aller sur le dashboard
3. ✓ Vérifier le comptage correct des projets
4. ✓ Vérifier les projets actifs vs brouillons
5. ✓ Vérifier le montant total collecté
6. ✓ Vérifier le nombre de donateurs

### Test 3 : Statistiques vides
1. Se connecter avec un compte sans projets
2. Aller sur le dashboard
3. ✓ Vérifier que toutes les stats affichent 0
4. ✓ Vérifier l'état vide dans RecentProjectsList
5. ✓ Vérifier le CTA "Créer mon premier projet"

### Test 4 : Liste des projets récents
1. Avoir 5+ projets
2. Aller sur le dashboard
3. ✓ Vérifier l'affichage des 5 projets les plus récents
4. ✓ Vérifier l'ordre (plus récents en premier)
5. ✓ Vérifier les miniatures d'images
6. ✓ Vérifier les badges de statut
7. ✓ Vérifier les barres de progression pour projets actifs

### Test 5 : Actions rapides
1. Cliquer "Créer un nouveau projet"
2. ✓ Vérifier la redirection vers `/projects/create`
3. Revenir au dashboard
4. Cliquer "Gérer mes projets"
5. ✓ Vérifier la redirection vers `/dashboard/projects`
6. Cliquer boutons "Éditer" et "Voir" sur un projet
7. ✓ Vérifier les redirections appropriées

### Test 6 : Alert brouillons
1. Avoir au moins 1 projet en brouillon
2. Aller sur le dashboard
3. ✓ Vérifier l'affichage de l'alerte "X brouillon(s) en attente"
4. ✓ Vérifier le pluriel si plusieurs brouillons
5. Cliquer "Voir les brouillons"
6. ✓ Vérifier la redirection vers MyProjectsPage avec filtre draft

### Test 7 : Protection de route
1. Se déconnecter
2. Tenter d'accéder à `/dashboard`
3. ✓ Vérifier la redirection vers `/login`
4. Se connecter
5. ✓ Vérifier l'accès au dashboard

### Test 8 : Responsive
1. Tester sur mobile (< 768px)
2. ✓ Vérifier que les stats sont empilées (1 colonne)
3. ✓ Vérifier que le layout principal est en 1 colonne
4. Tester sur tablet (768px - 1024px)
5. ✓ Vérifier la grille 2 colonnes pour stats
6. Tester sur desktop (> 1024px)
7. ✓ Vérifier la grille 4 colonnes pour stats
8. ✓ Vérifier le layout 2/3 + 1/3

### Test 9 : Performance
1. Avoir 10+ projets
2. Aller sur le dashboard
3. ✓ Vérifier que le chargement est rapide (< 1s)
4. ✓ Vérifier l'affichage des skeletons pendant le chargement

### Test 10 : Navigation globale
1. Depuis le dashboard
2. Utiliser le lien "Voir tout" de RecentProjectsList
3. ✓ Vérifier la navigation vers MyProjectsPage
4. Revenir au dashboard
5. Utiliser les liens du Header
6. ✓ Vérifier la navigation fluide

---

## 🎯 Améliorations futures (pas dans cette phase)

### Pour Phase 12 (Polish)

1. **Graphiques** :
   - Chart de progression sur 30 jours
   - Évolution du nombre de donateurs

2. **Tendances** :
   - Ajouter les props `trend` aux StatsCard
   - Calculer l'évolution vs mois dernier

3. **Notifications** :
   - Badge de notifications dans le Header
   - Liste des dernières donations reçues

4. **Export** :
   - Bouton "Exporter les statistiques" (CSV)
   - Rapport PDF mensuel

5. **Filtres avancés** :
   - Période personnalisée pour les stats
   - Comparaison entre projets

---

## ✅ Checklist de complétion

- [ ] Composant StatsCard créé et stylisé
- [ ] Composant QuickActions créé
- [ ] Composant RecentProjectsList créé avec états (loading, empty, data)
- [ ] Page CreatorDashboardPage créée
- [ ] Calcul des statistiques fonctionnel
- [ ] Tri des projets récents correct
- [ ] Route `/dashboard` ajoutée et protégée
- [ ] Liens de navigation fonctionnels
- [ ] Design responsive (mobile, tablet, desktop)
- [ ] Alert brouillons conditionnelle
- [ ] Tous les tests manuels passent
- [ ] Serveur démarre sans erreur

---

## 📚 Documentation de référence

- **PRD Section 3.3** : Fonctionnalités Créateur
- **DESIGN_GUIDE** : Composants UI (Card, Badge, ProgressBar)
- **SUPABASE_SETUP** : Structure de la base de données
- **ACTION_PLAN** : Plan général du projet
- **PLAN_PHASE_7.md** : Référence pour MyProjectsPage et projectService

---

## 🎯 Prochaines étapes (Phase 9)

Phase 9 devrait inclure :
- Formulaire de donation sur la page détail projet
- Service de gestion des donations (donationService)
- Validation et confirmation de don
- Historique des dons pour les donateurs

---

**Dernière mise à jour** : 08 janvier 2026
**Prêt pour implémentation** : ✅
