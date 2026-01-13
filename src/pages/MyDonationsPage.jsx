import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { donationService } from '../services/donationService'
import { useAuth } from '../hooks/useAuth'
import { MainLayout } from '../components/layout/MainLayout'
import { Container } from '../components/layout/Container'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import DonationCard from '../components/donations/DonationCard'
import { Heart, ArrowLeft, TrendingUp, FolderOpen, AlertCircle } from 'lucide-react'

export default function MyDonationsPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const [donations, setDonations] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      loadDonations()
    } else {
      navigate('/login')
    }
  }, [user])

  async function loadDonations() {
    setLoading(true)
    setError(null)

    try {
      // Charger les donations de l'utilisateur
      const { data: donationsData, error: donationsError } = await donationService.getDonationsByDonor(
        user.id
      )
      if (donationsError) throw donationsError

      setDonations(donationsData || [])

      // Charger les statistiques du donateur
      const { data: statsData, error: statsError } = await donationService.getDonorStats(user.id)
      if (statsError) throw statsError

      setStats(statsData)
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des donations')
    } finally {
      setLoading(false)
    }
  }

  // Gérer la mise à jour d'une donation
  function handleDonationUpdate(updatedDonation) {
    if (updatedDonation) {
      setDonations((prev) =>
        prev.map((d) => (d.id === updatedDonation.id ? updatedDonation : d))
      )
    }
    // Recharger les stats
    loadDonations()
  }

  // Gérer la suppression d'une donation
  function handleDonationDelete(donationId) {
    setDonations((prev) => prev.filter((d) => d.id !== donationId))
    // Recharger les stats
    loadDonations()
  }

  // État de chargement
  if (loading) {
    return (
      <MainLayout>
        <Container data-testid="my-donations-loading" className="py-8">
          <Skeleton className="h-8 w-48 mb-6" />
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
        <Container data-testid="my-donations-error" className="py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-bold text-red-900 mb-2">Erreur de chargement</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <Button variant="primary" onClick={loadDonations}>
              Réessayer
            </Button>
          </div>
        </Container>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Container data-testid="my-donations-page" className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button
            data-testid="my-donations-back-button"
            variant="ghost"
            onClick={() => navigate('/donor-dashboard')}
            className="mb-4"
          >
            <ArrowLeft size={18} />
            Retour au tableau de bord
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="text-primary-600" size={32} />
            Mes donations
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez toutes vos contributions aux projets
          </p>
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div
          data-testid="my-donations-stats"
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
              Sur {donations.length} donation{donations.length !== 1 ? 's' : ''}
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
                : `${stats.projects_supported} projet${stats.projects_supported !== 1 ? 's' : ''} différent${stats.projects_supported !== 1 ? 's' : ''}`}
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
                ? 'Aucun projet terminé'
                : `${stats.successful_projects} projet${stats.successful_projects !== 1 ? 's ont' : ' a'} atteint leur objectif`}
            </p>
          </div>
        </div>
      )}

      {/* Liste des donations */}
      {donations.length === 0 ? (
        <div
          data-testid="my-donations-empty"
          className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center"
        >
          <Heart className="text-gray-400 mx-auto mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Aucune donation pour le moment
          </h3>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore contribué à des projets. Commencez dès maintenant !
          </p>
          <Button
            data-testid="my-donations-browse-button"
            variant="primary"
            onClick={() => navigate('/projects')}
          >
            <FolderOpen size={18} />
            Découvrir les projets
          </Button>
        </div>
      ) : (
        <div data-testid="my-donations-list" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Historique des donations ({donations.length})
            </h2>
          </div>

          {donations.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              variant="compact"
              showActions={true}
              onUpdate={handleDonationUpdate}
              onDelete={handleDonationDelete}
            />
          ))}
        </div>
      )}

      {/* Message d'aide */}
      {donations.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-sm text-blue-900 font-medium mb-2">
            💡 Bon à savoir
          </p>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Vous pouvez modifier le montant et le message de vos donations tant que le projet est actif</li>
            <li>Vous pouvez supprimer une donation à tout moment</li>
            <li>Les projets que vous soutenez sont visibles dans votre tableau de bord donateur</li>
          </ul>
        </div>
      )}
    </Container>
    </MainLayout>
  )
}
