import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '../../components/layout/MainLayout'
import { Container } from '../../components/layout/Container'
import { Button } from '../../components/ui/Button'
import { Card, CardImage, CardContent, CardFooter } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { useAuth } from '../../hooks/useAuth'
import { getProjectsByCreator } from '../../services/projectService'
import { Plus, Edit, Eye, Calendar, Target } from 'lucide-react'
import { supabase } from '../../services/supabase'

/**
 * Page "Mes Projets" pour les créateurs
 * Affiche tous les projets créés par l'utilisateur connecté
 */
export function MyProjectsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState('all') // 'all', 'draft', 'active', 'completed', 'failed'

  useEffect(() => {
    loadProjects()
  }, [user])

  const loadProjects = async () => {
    if (!user) return

    setLoading(true)

    try {
      const { projects: projectsData, error } = await getProjectsByCreator(user.id)

      if (error) throw error

      // Enrichir chaque projet avec ses stats
      const projectsWithStats = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { data: totalCollected } = await supabase
            .rpc('get_project_total_collected', { project_uuid: project.id })

          const { data: donorsCount } = await supabase
            .rpc('get_project_donors_count', { project_uuid: project.id })

          return {
            ...project,
            total_collected: totalCollected || 0,
            donors_count: donorsCount || 0
          }
        })
      )

      setProjects(projectsWithStats)
    } catch (err) {
      console.error('Erreur chargement projets:', err)
      alert('Erreur lors du chargement de vos projets')
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les projets selon le filtre actif
  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true
    return project.status === filter
  })

  // Compter les projets par statut
  const counts = {
    all: projects.length,
    draft: projects.filter(p => p.status === 'draft').length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    failed: projects.filter(p => p.status === 'failed').length
  }

  const statusColors = {
    draft: 'draft',
    active: 'active',
    completed: 'completed',
    failed: 'failed'
  }

  const statusLabels = {
    draft: 'Brouillon',
    active: 'Actif',
    completed: 'Terminé',
    failed: 'Échoué'
  }

  // Calcule le nombre de jours restants
  const getDaysRemaining = (deadline) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Terminé'
    if (diffDays === 0) return 'Aujourd\'hui'
    if (diffDays === 1) return '1 jour'
    return `${diffDays} jours`
  }

  // Calcule le pourcentage de complétion
  const getCompletionPercentage = (totalCollected, goalAmount) => {
    if (!goalAmount || goalAmount === 0) return 0
    return Math.min(Math.round((totalCollected / goalAmount) * 100), 100)
  }

  return (
    <MainLayout>
      <div data-testid="my-projects-page" className="min-h-screen bg-gray-50 py-8">
        <Container>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Mes Projets
            </h1>
          </div>

          <Button
            data-testid="my-projects-create-button"
            variant="primary"
            size="lg"
            onClick={() => navigate('/projects/create')}
          >
            <Plus size={20} />
            Créer un projet
          </Button>
        </div>

        {/* Filtres */}
        <div data-testid="my-projects-filter-tabs" className="mb-8 flex flex-wrap gap-3">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Tous ({counts.all})
          </Button>
          <Button
            variant={filter === 'draft' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('draft')}
          >
            Brouillons ({counts.draft})
          </Button>
          <Button
            variant={filter === 'active' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Actifs ({counts.active})
          </Button>
          <Button
            variant={filter === 'completed' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Terminés ({counts.completed})
          </Button>
          <Button
            variant={filter === 'failed' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('failed')}
          >
            Échoués ({counts.failed})
          </Button>
        </div>

        {/* Liste des projets */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card data-testid="my-projects-empty">
            <CardContent className="p-12 text-center">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {filter === 'all'
                    ? 'Aucun projet'
                    : `Aucun projet ${statusLabels[filter].toLowerCase()}`
                  }
                </h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all'
                    ? 'Créez votre premier projet de crowdfunding'
                    : 'Vous n\'avez pas encore de projet avec ce statut'
                  }
                </p>
                {filter === 'all' && (
                  <Button
                    variant="primary"
                    onClick={() => navigate('/projects/create')}
                  >
                    <Plus size={18} />
                    Créer un projet
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div data-testid="my-projects-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => {
              const percentage = getCompletionPercentage(
                project.total_collected || 0,
                project.goal_amount
              )

              return (
                <Card key={project.id} data-testid="my-project-card" hover>
                  {/* Image */}
                  {project.image_url && project.image_url !== '' ? (
                    <CardImage
                      src={project.image_url}
                      alt={project.title}
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                      <span className="text-6xl">🎮</span>
                    </div>
                  )}

                  {/* Contenu */}
                  <CardContent className="p-5">
                    {/* Statut */}
                    <div className="mb-3">
                      <Badge data-testid="my-project-card-status" variant={statusColors[project.status]}>
                        {statusLabels[project.status]}
                      </Badge>
                    </div>

                    {/* Titre */}
                    <h3 data-testid="my-project-card-title" className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {project.title}
                    </h3>

                    {/* Progression (si actif) */}
                    {project.status === 'active' && (
                      <>
                        <ProgressBar
                          value={percentage}
                          className="mb-3"
                        />

                        <div className="flex items-center justify-between text-sm mb-4">
                          <div>
                            <span className="font-bold text-gray-900">
                              {project.total_collected || 0}€
                            </span>
                            <span className="text-gray-500"> / {project.goal_amount}€</span>
                          </div>
                          <span className="text-gray-600">
                            {percentage}%
                          </span>
                        </div>
                      </>
                    )}

                    {/* Métriques */}
                    <div data-testid="my-project-card-stats" className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Target size={16} />
                        <span>Objectif : {project.goal_amount}€</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          {project.status === 'active'
                            ? `${getDaysRemaining(project.deadline)} restants`
                            : `Échéance : ${new Date(project.deadline).toLocaleDateString('fr-FR')}`
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  {/* Actions */}
                  <CardFooter className="p-5 pt-0 flex gap-2">
                    <Button
                      data-testid="my-project-card-edit-button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/projects/${project.id}/edit`)}
                    >
                      <Edit size={16} />
                      Éditer
                    </Button>
                    <Button
                      data-testid="my-project-card-view-button"
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <Eye size={16} />
                      Voir
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </Container>
    </div>
    </MainLayout>
  )
}
