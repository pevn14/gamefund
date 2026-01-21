import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projectService } from '../services/projectService'
import { donationService } from '../services/donationService'
import { useAuth } from '../hooks/useAuth'
import { Container } from '../components/layout/Container'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import DonationsList from '../components/donations/DonationsList'
import { ArrowLeft, Heart, TrendingUp, Users, Coins, Download, AlertCircle } from 'lucide-react'

export default function ProjectDonationsPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [project, setProject] = useState(null)
  const [stats, setStats] = useState(null)
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProjectAndDonations()
  }, [projectId])

  async function loadProjectAndDonations() {
    setLoading(true)
    setError(null)

    try {
      // Charger le projet
      const { data: projectData, error: projectError } = await projectService.getProjectById(projectId)
      if (projectError) throw projectError
      if (!projectData) throw new Error('Projet introuvable')

      // Vérifier que l'utilisateur est le créateur
      if (!user || projectData.creator_id !== user.id) {
        navigate('/my-projects')
        return
      }

      setProject(projectData)

      // Charger les statistiques
      const { data: statsData, error: statsError } = await projectService.getProjectStats(projectId)
      if (statsError) throw statsError

      setStats(statsData)

      // Charger les donations
      const { data: donationsData, error: donationsError } = await donationService.getDonationsByProject(
        projectId
      )
      if (donationsError) throw donationsError

      setDonations(donationsData || [])
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des donations')
    } finally {
      setLoading(false)
    }
  }

  // Exporter les donations en CSV
  function exportToCSV() {
    if (donations.length === 0) return

    // Headers CSV
    const headers = ['Date', 'Donateur', 'Email', 'Montant', 'Message']

    // Lignes CSV
    const rows = donations.map((donation) => {
      const date = new Date(donation.created_at).toLocaleDateString('fr-FR')
      const donor = donation.donor?.display_name || 'Anonyme'
      const email = donation.donor?.email || 'N/A'
      const amount = donation.amount
      const message = donation.message ? `"${donation.message.replace(/"/g, '""')}"` : 'N/A'
      return [date, donor, email, amount, message].join(',')
    })

    // Créer le CSV
    const csv = [headers.join(','), ...rows].join('\n')

    // Télécharger le fichier
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `donations_${project.title.replace(/\s+/g, '_')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculer la donation moyenne
  function getAverageDonation() {
    if (donations.length === 0) return 0
    const total = donations.reduce((sum, d) => sum + d.amount, 0)
    return Math.round(total / donations.length)
  }

  // État de chargement
  if (loading) {
    return (
      <Container data-testid="project-donations-loading" className="py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </Container>
    )
  }

  // État d'erreur
  if (error) {
    return (
      <Container data-testid="project-donations-error" className="py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-red-900 mb-2">Erreur de chargement</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <Button variant="primary" onClick={() => navigate('/my-projects')}>
            Retour à mes projets
          </Button>
        </div>
      </Container>
    )
  }

  const averageDonation = getAverageDonation()

  return (
    <Container data-testid="project-donations-page" className="py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          data-testid="project-donations-back-button"
          variant="ghost"
          onClick={() => navigate('/my-projects')}
          className="mb-4"
        >
          <ArrowLeft size={18} />
          Retour à mes projets
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={project.status}>{project.status}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {project.title}
            </h1>
            <p className="text-gray-600">
              Gérez les donations reçues pour votre projet
            </p>
          </div>

          {donations.length > 0 && (
            <Button
              data-testid="project-donations-export-button"
              variant="outline"
              onClick={exportToCSV}
            >
              <Download size={18} />
              Exporter en CSV
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div
          data-testid="project-donations-stats"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {/* Total collecté */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary-500 rounded-full p-2">
                <TrendingUp className="text-white" size={20} />
              </div>
              <span className="text-sm font-medium text-primary-900">Total collecté</span>
            </div>
            <p className="text-3xl font-bold text-primary-900">
              {stats.total_collected?.toLocaleString('fr-FR') || 0}€
            </p>
            <p className="text-xs text-primary-700 mt-1">
              sur {project.goal.toLocaleString('fr-FR')}€ (
              {Math.round((stats.total_collected / project.goal) * 100)}%)
            </p>
          </div>

          {/* Nombre de donations */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500 rounded-full p-2">
                <Heart className="text-white" size={20} />
              </div>
              <span className="text-sm font-medium text-blue-900">Donations</span>
            </div>
            <p className="text-3xl font-bold text-blue-900">
              {donations.length}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {donations.length === 0
                ? 'Aucune donation'
                : `${donations.length} contribution${donations.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Nombre de donateurs */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500 rounded-full p-2">
                <Users className="text-white" size={20} />
              </div>
              <span className="text-sm font-medium text-green-900">Contributeurs</span>
            </div>
            <p className="text-3xl font-bold text-green-900">
              {stats.donors_count || 0}
            </p>
            <p className="text-xs text-green-700 mt-1">
              {stats.donors_count === 0
                ? 'Aucun contributeur'
                : `${stats.donors_count} personne${stats.donors_count !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Donation moyenne */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-yellow-500 rounded-full p-2">
                <Coins className="text-white" size={20} />
              </div>
              <span className="text-sm font-medium text-yellow-900">Moyenne</span>
            </div>
            <p className="text-3xl font-bold text-yellow-900">
              {averageDonation.toLocaleString('fr-FR')}€
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              par donation
            </p>
          </div>
        </div>
      )}

      {/* Liste des donations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Heart size={20} />
            Toutes les donations ({donations.length})
          </h2>
        </div>

        {donations.length === 0 ? (
          <div
            data-testid="project-donations-empty"
            className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center"
          >
            <Heart className="text-gray-400 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Aucune donation pour le moment
            </h3>
            <p className="text-gray-600 mb-6">
              Votre projet n'a pas encore reçu de donations. Partagez-le pour attirer des contributeurs !
            </p>
            <Button
              data-testid="project-donations-share-button"
              variant="primary"
              onClick={() => navigate(`/projects/${projectId}`)}
            >
              Voir la page du projet
            </Button>
          </div>
        ) : (
          <div data-testid="project-donations-list">
            <DonationsList
              donations={donations}
              variant="default"
              showActions={false}
            />
          </div>
        )}
      </div>

      {/* Messages d'encouragement */}
      {donations.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top donateurs */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
              <TrendingUp size={18} />
              Top donateur
            </h3>
            {(() => {
              const topDonation = [...donations].sort((a, b) => b.amount - a.amount)[0]
              return (
                <div className="flex items-center justify-between">
                  <span className="text-purple-700">
                    {topDonation.donor?.display_name || 'Anonyme'}
                  </span>
                  <span className="text-2xl font-bold text-purple-900">
                    {topDonation.amount.toLocaleString('fr-FR')}€
                  </span>
                </div>
              )
            })()}
          </div>

          {/* Dernière donation */}
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-pink-900 mb-4 flex items-center gap-2">
              <Heart size={18} />
              Dernière donation
            </h3>
            {(() => {
              const lastDonation = donations[0]
              const date = new Date(lastDonation.created_at).toLocaleDateString('fr-FR')
              return (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-pink-700">
                      {lastDonation.donor?.display_name || 'Anonyme'}
                    </span>
                    <span className="text-2xl font-bold text-pink-900">
                      {lastDonation.amount.toLocaleString('fr-FR')}€
                    </span>
                  </div>
                  <p className="text-xs text-pink-600">Le {date}</p>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </Container>
  )
}
