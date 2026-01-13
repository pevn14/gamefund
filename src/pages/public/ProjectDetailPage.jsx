import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { projectService } from '../../services/projectService'
import { donationService } from '../../services/donationService'
import { useAuth } from '../../hooks/useAuth'
import { MainLayout } from '../../components/layout/MainLayout'
import { Container } from '../../components/layout/Container'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import { Modal } from '../../components/ui/Modal'
import { Skeleton } from '../../components/ui/Skeleton'
import ProjectStats from '../../components/projects/ProjectStats'
import DonationForm from '../../components/donations/DonationForm'
import DonationsList from '../../components/donations/DonationsList'
import {
  ArrowLeft,
  Heart,
  Calendar,
  Target,
  User,
  MessageSquare,
  Share2,
  AlertCircle
} from 'lucide-react'

export default function ProjectDetailPage() {
  const { id: projectId } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  const [project, setProject] = useState(null)
  const [stats, setStats] = useState(null)
  const [hasUserDonated, setHasUserDonated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDonationForm, setShowDonationForm] = useState(false)

  useEffect(() => {
    loadProjectDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  async function loadProjectDetails() {
    setLoading(true)
    setError(null)

    try {
      // Charger le projet
      const { data: projectData, error: projectError } = await projectService.getProjectById(projectId)
      if (projectError) throw projectError
      if (!projectData) throw new Error('Projet introuvable')

      setProject(projectData)

      // Charger les statistiques
      const { data: statsData, error: statsError } = await projectService.getProjectStats(projectId)
      if (statsError) throw statsError

      setStats(statsData)

      // Vérifier si l'utilisateur a déjà donné (si connecté)
      if (user) {
        const { data: donatedData, error: donatedError } = await donationService.hasUserDonatedToProject(
          projectId,
          user.id
        )
        if (!donatedError) {
          setHasUserDonated(donatedData || false)
        }
      }
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du projet')
    } finally {
      setLoading(false)
    }
  }

  // Gérer le succès de la donation
  function handleDonationSuccess() {
    setShowDonationForm(false)
    setHasUserDonated(true)
    // Recharger les stats pour mettre à jour le total
    loadProjectDetails()
  }

  // État de chargement
  if (loading) {
    return (
      <MainLayout>
        <Container data-testid="project-detail-loading" className="py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full rounded-xl" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </Container>
      </MainLayout>
    )
  }

  // État d'erreur
  if (error) {
    return (
      <MainLayout>
        <Container data-testid="project-detail-error" className="py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-bold text-red-900 mb-2">Erreur de chargement</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Retour aux projets
            </Button>
          </div>
        </Container>
      </MainLayout>
    )
  }

  // Vérifier que le projet est chargé
  if (!project) {
    return null
  }

  // Calculer les jours restants
  function getDaysRemaining() {
    if (!project?.end_date) return 0
    const now = new Date()
    const end = new Date(project.end_date)
    const diffTime = end - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(diffDays, 0)
  }

  const daysRemaining = getDaysRemaining()

  // Vérifier si le projet accepte les dons
  const canDonate = project?.status === 'active' && daysRemaining > 0

  const formattedStartDate = project.start_date
    ? new Date(project.start_date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Date inconnue'

  return (
    <MainLayout>
      <Container data-testid="project-detail-page" className="py-8">
        {/* Bouton retour */}
        <Button
          data-testid="project-detail-back-button"
          variant="ghost"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate('/')}
          className="mb-6"
        >
          Retour aux projets
        </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header du projet */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant={project.status || 'draft'}>{project.status || 'draft'}</Badge>
                  <span className="text-sm text-gray-500">
                    Créé le {formattedStartDate}
                  </span>
                </div>
                <h1 data-testid="project-detail-title" className="text-3xl font-bold text-gray-900 mb-2">
                  {project.title || 'Projet sans titre'}
                </h1>
                <p data-testid="project-detail-tagline" className="text-lg text-gray-600">
                  {project.tagline || ''}
                </p>
              </div>

              {/* Bouton partager */}
              <Button
                data-testid="project-detail-share-button"
                variant="outline"
                icon={<Share2 size={18} />}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Lien copié dans le presse-papier !')
                }}
              >
                Partager
              </Button>
            </div>

            {/* Image du projet */}
            {project.image_url && (
              <img
                data-testid="project-detail-image"
                src={project.image_url}
                alt={project.title}
                className="w-full h-96 object-cover rounded-xl mb-6"
              />
            )}
          </div>

          {/* Description */}
          <div data-testid="project-detail-description" className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              Description du projet
            </h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {project.description || 'Aucune description disponible'}
            </p>
          </div>

          {/* Créateur */}
          <div data-testid="project-detail-creator" className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} />
              À propos du créateur
            </h2>
            <div className="flex items-center gap-4">
              <Avatar
                name={project.creator?.display_name || 'Créateur'}
                size="lg"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {project.creator?.display_name || 'Créateur anonyme'}
                </p>
                <p className="text-sm text-gray-600">
                  {project.creator?.email || 'Email non disponible'}
                </p>
              </div>
            </div>
          </div>

          {/* Liste des donations */}
          <div data-testid="project-detail-donations" className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart size={20} />
              Contributions récentes ({stats?.donors_count || 0})
            </h2>
            <DonationsList
              projectId={projectId}
              variant="default"
              showActions={false}
              limit={10}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistiques */}
          <div data-testid="project-detail-stats" className="bg-white rounded-xl border border-gray-200 p-6">
            <ProjectStats
              goal={project.goal || 0}
              totalCollected={stats?.total_collected || 0}
              donorsCount={stats?.donors_count || 0}
              daysRemaining={daysRemaining}
              variant="detailed"
            />
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {user ? (
              <>
                {/* Si l'utilisateur est le créateur */}
                {user.id === project.creator_id ? (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                      Vous êtes le créateur de ce projet
                    </p>
                    <Button
                      data-testid="project-detail-manage-button"
                      variant="primary"
                      onClick={() => navigate(`/my-projects/${projectId}/edit`)}
                      className="w-full"
                    >
                      Gérer mon projet
                    </Button>
                    <Button
                      data-testid="project-detail-view-donations-button"
                      variant="outline"
                      onClick={() => navigate(`/my-projects/${projectId}/donations`)}
                      className="w-full"
                    >
                      Voir les donations
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Si le projet accepte les dons */}
                    {canDonate ? (
                      <>
                        <Button
                          data-testid="project-detail-donate-button"
                          variant="primary"
                          icon={<Heart size={18} />}
                          onClick={() => setShowDonationForm(true)}
                          className="w-full mb-4"
                        >
                          Faire un don
                        </Button>
                        {hasUserDonated && (
                          <p className="text-sm text-green-600 text-center">
                            ✓ Vous avez déjà contribué à ce projet
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                        <p className="text-sm text-yellow-800">
                          {project.status !== 'active'
                            ? 'Ce projet n\'accepte plus de dons'
                            : 'La campagne de financement est terminée'}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Connectez-vous pour contribuer à ce projet
                </p>
                <Button
                  data-testid="project-detail-login-button"
                  variant="primary"
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Se connecter
                </Button>
              </div>
            )}
          </div>

          {/* Informations complémentaires */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Target className="text-gray-400" size={16} />
              <span className="text-gray-600">
                Objectif : <span className="font-semibold">{project.goal?.toLocaleString('fr-FR') || 0}€</span>
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="text-gray-400" size={16} />
              <span className="text-gray-600">
                {daysRemaining > 0
                  ? `${daysRemaining} jour${daysRemaining !== 1 ? 's' : ''} restant${daysRemaining !== 1 ? 's' : ''}`
                  : 'Campagne terminée'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Heart className="text-gray-400" size={16} />
              <span className="text-gray-600">
                {stats?.donors_count || 0} contributeur{stats?.donors_count !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

        {/* Modal de donation */}
        {showDonationForm && (
          <Modal
            data-testid="project-detail-donation-modal"
            isOpen={showDonationForm}
            onClose={() => setShowDonationForm(false)}
            title="Faire un don"
          >
            <DonationForm
              projectId={projectId}
              projectTitle={project.title || 'Projet'}
              projectGoal={project.goal || 0}
              totalCollected={stats?.total_collected || 0}
              onSuccess={handleDonationSuccess}
              onCancel={() => setShowDonationForm(false)}
            />
          </Modal>
        )}
      </Container>
    </MainLayout>
  )
}
