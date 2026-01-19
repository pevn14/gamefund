import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { AvatarUpload } from './AvatarUpload'
import { useProfile } from '../../hooks/useProfile'

export function ProfileEditor() {
  const { profile, loading: profileLoading, updateProfile, uploadAvatar, deleteAvatar } = useProfile()

  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Initialiser le formulaire avec les données du profil
  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
      })
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setSuccess(false)
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(null)

    const { error: updateError } = await updateProfile(formData)

    if (updateError) {
      setError(updateError.message || 'Erreur lors de la mise à jour')
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }

    setLoading(false)
  }

  const handleAvatarUpload = async (file) => {
    setLoading(true)
    setError(null)

    const { error: uploadError } = await uploadAvatar(file)

    if (uploadError) {
      setError(uploadError.message || 'Erreur lors de l\'upload')
    }

    setLoading(false)
  }

  const handleAvatarDelete = async () => {
    setLoading(true)
    setError(null)

    const { error: deleteError } = await deleteAvatar()

    if (deleteError) {
      setError(deleteError.message || 'Erreur lors de la suppression')
    }

    setLoading(false)
  }

  const bioLength = formData.bio.length
  const bioMaxLength = 500

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-6"
      data-testid="profile-editor"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Mon Profil</h2>

      {/* Avatar */}
      <div className="mb-6">
        <AvatarUpload
          currentAvatar={profile?.avatar_url}
          onUpload={handleAvatarUpload}
          onDelete={handleAvatarDelete}
          loading={loading}
        />
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom d'affichage */}
        <Input
          label="Nom d'affichage"
          name="display_name"
          value={formData.display_name}
          onChange={handleChange}
          placeholder="Votre nom"
          required
          data-testid="profile-editor-name-input"
        />

        {/* Bio */}
        <div>
          <Textarea
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Parlez-nous de vous et de vos projets..."
            rows={5}
            maxLength={bioMaxLength}
            data-testid="profile-editor-bio-textarea"
          />
          <p
            className="text-xs text-gray-500 mt-1 text-right"
            data-testid="profile-editor-bio-counter"
          >
            {bioLength} / {bioMaxLength} caractères
          </p>
        </div>

        {/* Messages de succès/erreur */}
        {success && (
          <div
            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded"
            data-testid="profile-editor-success-message"
          >
            Profil mis à jour avec succès !
          </div>
        )}

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded"
            data-testid="profile-editor-error-message"
          >
            {error}
          </div>
        )}

        {/* Bouton */}
        <Button
          type="submit"
          variant="primary"
          loading={loading || profileLoading}
          disabled={loading || profileLoading}
          className="w-full"
          data-testid="profile-editor-save-button"
        >
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </form>
    </div>
  )
}
