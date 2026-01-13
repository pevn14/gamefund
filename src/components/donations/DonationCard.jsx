import { useState } from 'react'
import { donationService } from '../../services/donationService'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Heart, Calendar, Coins, Edit, Trash2 } from 'lucide-react'

export default function DonationCard({
  donation,
  variant = 'default',
  showActions = false,
  onUpdate,
  onDelete
}) {
  const { user, profile } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newAmount, setNewAmount] = useState(donation.amount.toString())
  const [newMessage, setNewMessage] = useState(donation.message || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Vérifier si l'utilisateur peut modifier/supprimer cette donation
  const canModify = user && donation.donor_id === user.id && showActions

  // Formater la date
  const formattedDate = new Date(donation.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  // Validation du montant
  function validateAmount() {
    const numAmount = Number(newAmount)
    if (!newAmount || isNaN(numAmount)) {
      return 'Le montant est requis'
    }
    if (numAmount < 1) {
      return 'Le montant doit être d\'au moins 1€'
    }
    if (!Number.isInteger(numAmount)) {
      return 'Le montant doit être un nombre entier'
    }
    return null
  }

  // Validation du message
  function validateMessage() {
    if (newMessage.length > 500) {
      return 'Le message ne peut pas dépasser 500 caractères'
    }
    return null
  }

  // Modifier la donation
  async function handleUpdate() {
    setError(null)

    const amountError = validateAmount()
    if (amountError) {
      setError(amountError)
      return
    }

    const messageError = validateMessage()
    if (messageError) {
      setError(messageError)
      return
    }

    setLoading(true)
    try {
      const { data, error: updateError } = await donationService.updateDonation(
        donation.id,
        {
          amount: Number(newAmount),
          message: newMessage.trim() || null
        }
      )

      if (updateError) throw updateError

      setShowEditModal(false)
      if (onUpdate) {
        onUpdate(data)
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la modification')
    } finally {
      setLoading(false)
    }
  }

  // Supprimer la donation
  async function handleDelete() {
    setLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await donationService.deleteDonation(donation.id)

      if (deleteError) throw deleteError

      setShowDeleteModal(false)
      if (onDelete) {
        onDelete(donation.id)
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la suppression')
      setShowDeleteModal(false)
    } finally {
      setLoading(false)
    }
  }

  // Variant compact pour MyDonationsPage
  if (variant === 'compact') {
    return (
      <div
        data-testid="donation-card-compact"
        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="bg-primary-100 rounded-full p-3">
            <Heart className="text-primary-600" size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {donation.project?.title || 'Projet inconnu'}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-primary-700">
            {donation.amount.toLocaleString('fr-FR')}€
          </p>
          {canModify && (
            <div className="flex gap-2 mt-2">
              <Button
                data-testid="donation-edit-button"
                variant="ghost"
                size="sm"
                onClick={() => setShowEditModal(true)}
              >
                <Edit size={14} />
                Modifier
              </Button>
              <Button
                data-testid="donation-delete-button"
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={14} />
                Supprimer
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Variant default pour ProjectDonationsPage
  return (
    <>
      <Card data-testid="donation-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar du donateur */}
            <Avatar
              name={donation.donor?.display_name || 'Anonyme'}
              size="lg"
            />

            <div className="flex-1">
              {/* Header avec nom et montant */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">
                    {donation.donor?.display_name || 'Donateur anonyme'}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Calendar size={14} />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-full">
                  <Coins className="text-primary-600" size={18} />
                  <span className="font-bold text-primary-700">
                    {donation.amount.toLocaleString('fr-FR')}€
                  </span>
                </div>
              </div>

              {/* Message du donateur */}
              {donation.message && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4 border-l-4 border-primary-500">
                  <p className="text-gray-700 italic">
                    "{donation.message}"
                  </p>
                </div>
              )}

              {/* Actions (si applicable) */}
              {canModify && (
                <div className="flex gap-3 mt-4 pt-4 border-t">
                  <Button
                    data-testid="donation-edit-button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditModal(true)}
                  >
                    <Edit size={16} />
                    Modifier
                  </Button>
                  <Button
                    data-testid="donation-delete-button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de modification */}
      {showEditModal && (
        <Modal
          data-testid="donation-edit-modal"
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Modifier votre don"
        >
          <div className="space-y-4">
            <Input
              data-testid="donation-edit-amount-input"
              label="Nouveau montant *"
              type="number"
              min="1"
              step="1"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              icon={Coins}
              helperText="Montant minimum : 1€"
            />

            <Textarea
              data-testid="donation-edit-message-input"
              label="Message au créateur (optionnel)"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Laissez un message d'encouragement..."
              maxLength={500}
            />

            {error && (
              <div
                data-testid="donation-edit-error-message"
                className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm"
              >
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowEditModal(false)}
                className="flex-1"
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                data-testid="donation-edit-confirm-button"
                type="button"
                variant="primary"
                onClick={handleUpdate}
                className="flex-1"
                loading={loading}
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && (
        <Modal
          data-testid="donation-delete-modal"
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Supprimer votre don"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Êtes-vous sûr de vouloir supprimer ce don de {donation.amount}€ ?
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Cette action est irréversible. Le montant sera retiré du total collecté pour ce projet.
              </p>
            </div>

            {error && (
              <div
                data-testid="donation-delete-error-message"
                className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm"
              >
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                data-testid="donation-delete-confirm-button"
                type="button"
                variant="danger"
                onClick={handleDelete}
                className="flex-1"
                loading={loading}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
