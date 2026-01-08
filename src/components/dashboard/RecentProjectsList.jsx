import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { Skeleton } from '../ui/Skeleton'
import { Plus, ChevronRight, Edit, Eye } from 'lucide-react'

/**
 * Composant de liste des projets récents pour le dashboard
 * Affiche les 5 projets les plus récents avec stats
 */
export function RecentProjectsList({ projects, loading, onViewAll }) {
  const navigate = useNavigate()

  const statusColors = {
    draft: 'secondary',
    active: 'success',
    completed: 'primary',
    failed: 'danger'
  }

  const statusLabels = {
    draft: 'Brouillon',
    active: 'Actif',
    completed: 'Terminé',
    failed: 'Échoué'
  }

  return (
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
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-gray-400" />
            </div>
            <p className="mb-2 font-medium text-gray-700">Aucun projet pour le moment</p>
            <p className="text-sm mb-6">Créez votre premier projet pour commencer</p>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/projects/create')}
            >
              <Plus size={18} />
              Créer mon premier projet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map(project => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Image miniature */}
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  {project.image_url && project.image_url !== '' ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                      <span className="text-2xl">🎮</span>
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {project.title}
                    </h3>
                    <Badge variant={statusColors[project.status]}>
                      {statusLabels[project.status]}
                    </Badge>
                  </div>

                  {project.status === 'active' && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">
                          {project.total_collected || 0}€ / {project.goal_amount}€
                        </span>
                        <span className="text-gray-600">
                          {Math.round(((project.total_collected || 0) / project.goal_amount) * 100)}%
                        </span>
                      </div>
                      <ProgressBar
                        value={((project.total_collected || 0) / project.goal_amount) * 100}
                        size="sm"
                      />
                    </div>
                  )}

                  {project.status === 'draft' && (
                    <p className="text-sm text-gray-500">
                      En attente de publication
                    </p>
                  )}

                  {project.status === 'completed' && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ Objectif atteint !
                    </p>
                  )}

                  {project.status === 'failed' && (
                    <p className="text-sm text-red-600">
                      Campagne terminée sans succès
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/projects/${project.id}/edit`)}
                    title="Éditer"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/projects/${project.id}`)}
                    title="Voir"
                  >
                    <Eye size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
