import { useState } from 'react'
import { donationService } from '../../services/donationService'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Modal } from '../ui/Modal'
import { Coins, X } from 'lucide-react'

export default function DonationForm({
  projectId,
  projectTitle,
  projectGoal,
  totalCollected,
  onSuccess,
  onCancel
}) {
  const { user } = useAuth()
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Validation du montant
  function validateAmount() {
    const numAmount = Number(amount)

    if (!amount || isNaN(numAmount)) {
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
    if (message.length > 500) {
      return 'Le message ne peut pas dépasser 500 caractères'
    }
    return null
  }

  // Soumettre le formulaire (ouvre la modal de confirmation)
  function handleSubmit(e) {
    e.preventDefault()
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

    // Ouvrir modal de confirmation
    setShowConfirmation(true)
  }

  // Confirmer la donation
  async function handleConfirm() {
    setLoading(true)
    setError(null)

    try {
      const { data, error: donationError } = await donationService.createDonation({
        project_id: projectId,
        donor_id: user.id,
        amount: Number(amount),
        message: message.trim() || null
      })

      if (donationError) throw donationError

      // Succès
      setShowConfirmation(false)
      if (onSuccess) {
        onSuccess(data)
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la création de la donation')
      setShowConfirmation(false)
    } finally {
      setLoading(false)
    }
  }

  // Calculer le nouveau total si donation confirmée
  const newTotal = totalCollected + Number(amount || 0)
  const newPercentage = Math.min(Math.round((newTotal / projectGoal) * 100), 100)

  return (
    <>
      <form data-testid="donation-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Montant */}
        <Input
          data-testid="donation-form-amount-input"
          label="Montant du don *"
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="50"
          icon={Coins}
          helperText="Montant minimum : 1€"
        />

        {/* Message optionnel */}
        <Textarea
          data-testid="donation-form-message-input"
          label="Message au créateur (optionnel)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Laissez un message d'encouragement..."
          maxLength={500}
        />

        {/* Prévisualisation du nouveau total */}
        {amount && Number(amount) >= 1 && (
          <div
            data-testid="donation-form-preview"
            className="bg-primary-50 border border-primary-200 rounded-xl p-4"
          >
            <p className="text-sm text-gray-600 mb-1">
              Après votre don :
            </p>
            <p className="text-lg font-bold text-primary-700">
              {newTotal.toLocaleString('fr-FR')}€ / {projectGoal.toLocaleString('fr-FR')}€
            </p>
            <p className="text-sm text-primary-600 mt-1">
              {newPercentage}% de l'objectif
            </p>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div
            data-testid="donation-form-error"
            className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm"
          >
            {error}
          </div>
        )}

        {/* Boutons */}
        <div className="flex gap-3">
          <Button
            data-testid="donation-form-cancel-button"
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            data-testid="donation-form-submit-button"
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading}
          >
            Faire un don
          </Button>
        </div>
      </form>

      {/* Modal de confirmation */}
      {showConfirmation && (
        <Modal
          data-testid="donation-confirm-modal"
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          title="Confirmer votre don"
        >
          <div data-testid="donation-confirm-summary" className="space-y-4">
            <p className="text-gray-700">
              Vous êtes sur le point de faire un don à ce projet :
            </p>

            {/* Récapitulatif */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Projet :</span>
                <span className="font-medium">{projectTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Montant :</span>
                <span className="font-bold text-primary-700">{amount}€</span>
              </div>
              {message && (
                <div className="pt-2 border-t">
                  <span className="text-gray-600">Message :</span>
                  <p className="text-sm text-gray-700 mt-1 italic">
                    "{message}"
                  </p>
                </div>
              )}
              <div className="pt-2 border-t">
                <span className="text-gray-600">Nouveau total :</span>
                <p className="font-bold text-primary-700">
                  {newTotal.toLocaleString('fr-FR')}€ / {projectGoal.toLocaleString('fr-FR')}€
                </p>
                <p className="text-sm text-primary-600">
                  {newPercentage}% de l'objectif
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Êtes-vous sûr de vouloir confirmer ce don ?
            </p>

            {/* Boutons de confirmation */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
                disabled={loading}
              >
                Retour
              </Button>
              <Button
                data-testid="donation-confirm-button"
                type="button"
                variant="primary"
                onClick={handleConfirm}
                className="flex-1"
                loading={loading}
              >
                Confirmer le don
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
