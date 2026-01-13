import { useNavigate } from 'react-router-dom'
import { Card, CardImage, CardContent, CardFooter } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ProgressBar } from '../ui/ProgressBar'
import { Heart, Calendar, TrendingUp, Eye } from 'lucide-react'

export default function SupportedProjectCard({ project, userDonation }) {
  const navigate = useNavigate()

  // Calculer le pourcentage
  const percentage = Math.min(
    Math.round((project.total_collected / project.goal) * 100),
    100
  )

  // Calculer les jours restants
  function getDaysRemaining() {
    if (!project.end_date) return 0
    const now = new Date()
    const end = new Date(project.end_date)
    const diffTime = end - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(diffDays, 0)
  }

  const daysRemaining = getDaysRemaining()

  return (
    <Card
      data-testid="supported-project-card"
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* Image du projet */}
      {project.image_url && (
        <CardImage src={project.image_url} alt={project.title} />
      )}

      <CardContent className="p-6">
        {/* Header avec badge */}
        <div className="flex items-start justify-between mb-3">
          <Badge variant={project.status}>{project.status}</Badge>
          {userDonation && (
            <div
              data-testid="supported-project-donation-amount"
              className="flex items-center gap-1 bg-primary-100 px-3 py-1 rounded-full"
            >
              <Heart className="text-primary-600" size={14} />
              <span className="text-sm font-bold text-primary-700">
                {userDonation.amount}€
              </span>
            </div>
          )}
        </div>

        {/* Titre */}
        <h3
          data-testid="supported-project-title"
          className="text-xl font-bold text-gray-900 mb-2 line-clamp-2"
        >
          {project.title}
        </h3>

        {/* Tagline */}
        <p
          data-testid="supported-project-tagline"
          className="text-gray-600 text-sm mb-4 line-clamp-2"
        >
          {project.tagline}
        </p>

        {/* Barre de progression */}
        <div className="mb-4">
          <ProgressBar
            value={project.total_collected}
            max={project.goal}
            variant={percentage >= 100 ? 'success' : 'default'}
          />
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* Montant collecté */}
          <div>
            <p className="text-lg font-bold text-primary-700">
              {project.total_collected?.toLocaleString('fr-FR') || 0}€
            </p>
            <p className="text-xs text-gray-500">Collectés</p>
          </div>

          {/* Objectif */}
          <div>
            <p className="text-lg font-bold text-gray-700">
              {project.goal.toLocaleString('fr-FR')}€
            </p>
            <p className="text-xs text-gray-500">Objectif</p>
          </div>

          {/* Jours restants */}
          <div>
            <p className="text-lg font-bold text-gray-700">{daysRemaining}</p>
            <p className="text-xs text-gray-500">
              Jour{daysRemaining !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {/* Nombre de donateurs */}
          <div className="flex items-center gap-1">
            <Heart size={14} />
            <span>{project.donors_count || 0} contributeur{project.donors_count !== 1 ? 's' : ''}</span>
          </div>

          {/* Pourcentage */}
          <div className="flex items-center gap-1">
            <TrendingUp size={14} />
            <span>{percentage}%</span>
          </div>
        </div>

        {/* Bouton voir */}
        <Button
          data-testid="supported-project-view-button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/projects/${project.id}`)
          }}
        >
          <Eye size={16} />
          Voir
        </Button>
      </CardFooter>
    </Card>
  )
}
