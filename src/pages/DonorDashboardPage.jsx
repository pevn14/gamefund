import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { donationService } from '../services/donationService'
import { projectService } from '../services/projectService'
import { useAuth } from '../hooks/useAuth'
import { MainLayout } from '../components/layout/MainLayout'
import { Container } from '../components/layout/Container'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import SupportedProjectCard from '../components/projects/SupportedProjectCard'
import RecentDonationsList from '../components/donations/RecentDonationsList'
import { Heart, TrendingUp, FolderOpen, AlertCircle, ArrowRight } from 'lucide-react'

export default function DonorDashboardPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)
  const [supportedProjects, setSupportedProjects] = useState([])
  const [recentDonations, setRecentDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    } else {
      navigate('/login')
    }
  }, [user])

  async function loadDashboardData() {
    setLoading(true)
    setError(null)

    try {
      // Charger les statistiques du donateur
      const { data: statsData, error: statsError } = await donationService.getDonorStats(user.id)
      if (statsError) throw statsError
      setStats(statsData)

      // Charger toutes les donations du donateur
      const { data: donationsData, error: donationsError } = await donationService.getDonationsByDonor(
        user.id
      )
      if (donationsError) throw donationsError

      // Extraire les 5 donations les plus récentes
      const recent = (donationsData || []).slice(0, 5)
      setRecentDonations(recent)

      // Extraire les projets uniques soutenus (actifs uniquement)
      const projectIds = [...new Set(donationsData?.map((d) => d.project_id) || [])]

      // Charger les détails de chaque projet soutenu
      const projectsPromises = projectIds.map((projectId) =>
        projectService.getProjectById(projectId)
      )
      const projectsResults = await Promise.all(projectsPromises)

      // Filtrer les projets actifs et enrichir avec les données de donation
      const activeProjects = projectsResults
        .filter((result) => result.data && result.data.status === 'active')
        .map((result) => {
          const project = result.data
          // Trouver la donation de l'utilisateur pour ce projet
          const userDonation = donationsData?.find((d) => d.project_id === project.id)
          return {
            ...project,
            userDonation
          }
        })
        .slice(0, 6) // Limiter à 6 projets

      setSupportedProjects(activeProjects)
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du tableau de bord')
    } finally {
      setLoading(false)
    }
  }

  // État de chargement
  if (loading) {
    return (
      <MainLayout>
        <Container data-testid="donor-dashboard-loading" className="py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </Container>
      </MainLayout>
    )
  }

  // État d'erreur
  if (error) {
    return (
      <MainLayout>
        <Container data-testid="donor-dashboard-error" className="py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-bold text-red-900 mb-2">Erreur de chargement</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <Button variant="primary" onClick={loadDashboardData}>
              Réessayer
            </Button>
          </div>
        </Container>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Container data-testid="donor-dashboard-page" className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Heart className="text-primary-600" size={32} />
          Dashboard Donateur
        </h1>
        <p className="text-gray-600">
          Suivez vos contributions et découvrez l'impact de vos dons.
        </p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div
          data-testid="donor-dashboard-stats"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Total donné */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary-500 rounded-full p-2">
                <Heart className="text-white" size={20} />
              </div>
              <span className="text-sm font-medium text-primary-900">Total donné</span>
            </div>
            <p className="text-3xl font-bold text-primary-900">
              {stats.total_donated?.toLocaleString('fr-FR') || 0}€
            </p>
            <p className="text-xs text-primary-700 mt-1">
              Merci pour votre générosité !
            </p>
          </div>

          {/* Projets soutenus */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500 rounded-full p-2">
                <FolderOpen className="text-white" size={20} />
              </div>
              <span className="text-sm font-medium text-blue-900">Projets soutenus</span>
            </div>
            <p className="text-3xl font-bold text-blue-900">
              {stats.projects_supported || 0}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {stats.projects_supported === 0
                ? 'Aucun projet soutenu'
                : `Vous avez contribué à ${stats.projects_supported} projet${
                    stats.projects_supported !== 1 ? 's' : ''
                  }`}
            </p>
          </div>

          {/* Projets réussis */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500 rounded-full p-2">
                <TrendingUp className="text-white" size={20} />
              </div>
              <span className="text-sm font-medium text-green-900">Projets réussis</span>
            </div>
            <p className="text-3xl font-bold text-green-900">
              {stats.successful_projects || 0}
            </p>
            <p className="text-xs text-green-700 mt-1">
              {stats.successful_projects === 0
                ? 'Aucun projet financé'
                : `${stats.successful_projects} projet${
                    stats.successful_projects !== 1 ? 's ont' : ' a'
                  } atteint leur objectif`}
            </p>
          </div>
        </div>
      )}

      {/* Projets soutenus */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FolderOpen size={24} />
              Projets que vous soutenez
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {supportedProjects.length === 0
                ? 'Vous ne soutenez aucun projet actif pour le moment'
                : `${supportedProjects.length} projet${
                    supportedProjects.length !== 1 ? 's actifs' : ' actif'
                  }`}
            </p>
          </div>
          <Link to="/my-donations">
            <Button
              data-testid="donor-dashboard-view-all-button"
              variant="outline"
            >
              <ArrowRight size={18} />
              Voir tous mes dons
            </Button>
          </Link>
        </div>

        {supportedProjects.length === 0 ? (
          <div
            data-testid="donor-dashboard-no-projects"
            className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center"
          >
            <FolderOpen className="text-gray-400 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Aucun projet actif soutenu
            </h3>
            <p className="text-gray-600 mb-6">
              Découvrez de nouveaux projets et faites la différence !
            </p>
            <Button
              data-testid="donor-dashboard-browse-projects-button"
              variant="primary"
              onClick={() => navigate('/')}
            >
              <FolderOpen size={18} />
              Découvrir les projets
            </Button>
          </div>
        ) : (
          <div
            data-testid="donor-dashboard-projects-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {supportedProjects.map((project) => (
              <SupportedProjectCard
                key={project.id}
                project={project}
                userDonation={project.userDonation}
              />
            ))}
          </div>
        )}
      </div>

      {/* Donations récentes */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart size={24} />
            Donations récentes
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Vos 5 dernières contributions
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <RecentDonationsList donations={recentDonations} />

          {recentDonations.length > 0 && (
            <div className="mt-6 pt-6 border-t text-center">
              <Link to="/my-donations">
                <Button
                  data-testid="donor-dashboard-view-history-button"
                  variant="secondary"
                >
                  <ArrowRight size={18} />
                  Voir tous mes dons
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Message d'encouragement */}
      {stats && stats.total_donated > 0 && (
        <div className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">
            🎉 Merci pour votre générosité !
          </h3>
          <p className="text-primary-100 mb-4">
            Grâce à vos {stats.total_donated?.toLocaleString('fr-FR')}€ de dons, vous avez aidé{' '}
            {stats.projects_supported} projet{stats.projects_supported !== 1 ? 's' : ''} à se réaliser.
          </p>
          <Button
            data-testid="donor-dashboard-continue-button"
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Continuer à soutenir des projets
          </Button>
        </div>
      )}
    </Container>
    </MainLayout>
  )
}
