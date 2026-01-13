import { useState, useEffect } from 'react'
import { donationService } from '../../services/donationService'
import DonationCard from './DonationCard'
import { Skeleton } from '../ui/Skeleton'
import { Heart, AlertCircle } from 'lucide-react'

export default function DonationsList({
  projectId,
  donorId,
  variant = 'default',
  showActions = false,
  limit = null,
  onDonationUpdate,
  donations: externalDonations = null
}) {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Si les donations sont passées en prop, les utiliser directement
    if (externalDonations !== null) {
      setDonations(externalDonations)
      setLoading(false)
      return
    }

    // Sinon, charger les donations
    loadDonations()
  }, [projectId, donorId, limit, externalDonations])

  async function loadDonations() {
    setLoading(true)
    setError(null)

    try {
      let result

      // Charger les donations selon le contexte
      if (projectId) {
        result = await donationService.getDonationsByProject(projectId)
      } else if (donorId) {
        result = await donationService.getDonationsByDonor(donorId)
      } else {
        throw new Error('projectId ou donorId requis')
      }

      if (result.error) throw result.error

      // Appliquer la limite si spécifiée
      let donationsList = result.data || []
      if (limit && donationsList.length > limit) {
        donationsList = donationsList.slice(0, limit)
      }

      setDonations(donationsList)
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des donations')
    } finally {
      setLoading(false)
    }
  }

  // Gérer la mise à jour d'une donation
  function handleDonationUpdate(updatedDonation) {
    setDonations((prev) =>
      prev.map((d) => (d.id === updatedDonation.id ? updatedDonation : d))
    )
    if (onDonationUpdate) {
      onDonationUpdate(updatedDonation)
    }
  }

  // Gérer la suppression d'une donation
  function handleDonationDelete(donationId) {
    setDonations((prev) => prev.filter((d) => d.id !== donationId))
    if (onDonationUpdate) {
      onDonationUpdate(null) // Signaler qu'une donation a été supprimée
    }
  }

  // État de chargement
  if (loading) {
    return (
      <div data-testid="donations-list-loading" className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // État d'erreur
  if (error) {
    return (
      <div
        data-testid="donations-list-error"
        className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
      >
        <AlertCircle className="text-red-500 mx-auto mb-3" size={40} />
        <p className="text-red-700 font-medium mb-1">Erreur de chargement</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    )
  }

  // État vide
  if (donations.length === 0) {
    return (
      <div
        data-testid="donations-list-empty"
        className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center"
      >
        <Heart className="text-gray-400 mx-auto mb-4" size={48} />
        <p className="text-gray-600 font-medium mb-1">Aucune donation</p>
        <p className="text-gray-500 text-sm">
          {projectId
            ? 'Ce projet n\'a pas encore reçu de donations.'
            : 'Vous n\'avez pas encore fait de donations.'}
        </p>
      </div>
    )
  }

  // Liste des donations
  return (
    <div data-testid="donations-list" className="space-y-4">
      {donations.map((donation) => (
        <DonationCard
          key={donation.id}
          donation={donation}
          variant={variant}
          showActions={showActions}
          onUpdate={handleDonationUpdate}
          onDelete={handleDonationDelete}
        />
      ))}
    </div>
  )
}
