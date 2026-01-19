import { useState, useRef } from 'react'
import { Upload, X, User } from 'lucide-react'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'

export function AvatarUpload({ currentAvatar, onUpload, onDelete, loading }) {
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 2MB')
      return
    }

    // Validation format
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Format accepté : JPG, PNG, WEBP')
      return
    }

    setError(null)

    // Prévisualisation
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload
    onUpload(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleDelete = () => {
    setPreview(null)
    setError(null)
    onDelete()
  }

  const displayAvatar = preview || currentAvatar

  return (
    <div className="flex flex-col items-center gap-4" data-testid="avatar-upload">
      {/* Avatar preview */}
      <div className="relative" data-testid="avatar-upload-preview">
        {displayAvatar ? (
          <Avatar src={displayAvatar} size="xl" alt="Avatar" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          data-testid="avatar-upload-input"
        />

        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={loading}
          data-testid="avatar-upload-button"
        >
          <Upload className="w-4 h-4 mr-2" />
          {displayAvatar ? 'Changer' : 'Ajouter'}
        </Button>

        {displayAvatar && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
            data-testid="avatar-delete-button"
          >
            <X className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        )}
      </div>

      {/* Aide et erreurs */}
      <div className="text-center">
        {error && <p className="text-sm text-red-600 mb-1">{error}</p>}
        <p className="text-xs text-gray-500">
          JPG, PNG ou WEBP. Max 2MB.
        </p>
      </div>
    </div>
  )
}
