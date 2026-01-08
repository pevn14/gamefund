import { useState, useRef, useEffect } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from './Button'

/**
 * Composant ImageUpload
 * Permet de sélectionner et prévisualiser une image avant upload
 *
 * @param {Object} props
 * @param {Function} props.onChange - Callback appelé quand une image est sélectionnée
 * @param {string} props.value - URL de l'image actuelle (si édition)
 * @param {string} props.label - Label du champ
 * @param {boolean} props.required - Si le champ est requis
 * @param {string} props.error - Message d'erreur à afficher
 * @param {string} props.aspectRatio - Ratio d'aspect de la prévisualisation ('video' par défaut)
 */
export function ImageUpload({
  onChange,
  value,
  label = "Image du projet",
  required = false,
  error = null,
  aspectRatio = 'video', // 'video' (16:9) ou 'square' (1:1)
  className = ''
}) {
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square'
  }

  // Mettre à jour la prévisualisation si value change de l'extérieur (pour édition uniquement)
  useEffect(() => {
    // Seulement si value est une URL (string), pas un File object
    if (value && typeof value === 'string' && value !== preview) {
      setPreview(value)
    } else if (!value && preview) {
      // Réinitialiser si value est null/undefined
      setPreview(null)
    }
  }, [value])

  const handleFileSelect = (file) => {
    if (!file) return

    // Validation du type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide')
      return
    }

    // Validation de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB')
      return
    }

    // Créer une prévisualisation
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.onerror = (error) => {
      console.error('Erreur lors de la lecture du fichier:', error)
      alert('Erreur lors de la lecture du fichier')
    }
    reader.readAsDataURL(file)

    // Notifier le parent
    if (onChange) {
      onChange(file)
    }
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    handleFileSelect(file)
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (onChange) {
      onChange(null)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Zone d'upload */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          ${aspectClasses[aspectRatio]}
          relative border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-primary-500 bg-primary-50'
            : preview
              ? 'border-transparent'
              : 'border-gray-300 hover:border-primary-400 bg-gray-50 hover:bg-gray-100'
          }
          ${error ? 'border-red-500' : ''}
        `}
      >
        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {preview ? (
          /* Prévisualisation de l'image */
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />

            {/* Bouton de suppression */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleRemove()
              }}
              className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors z-10"
            >
              <X size={18} />
            </button>

            {/* Overlay au hover */}
            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-40 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
              <div className="pointer-events-auto">
                <Button variant="secondary" size="sm">
                  <Upload size={16} />
                  Changer l'image
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Zone d'upload vide */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className={`
              p-4 rounded-full mb-4 transition-colors
              ${isDragging ? 'bg-primary-100' : 'bg-gray-200'}
            `}>
              {isDragging ? (
                <Upload size={32} className="text-primary-600" />
              ) : (
                <ImageIcon size={32} className="text-gray-400" />
              )}
            </div>

            <p className="text-sm font-medium text-gray-700 mb-1">
              {isDragging ? 'Déposez votre image ici' : 'Cliquez pour uploader ou glissez-déposez'}
            </p>

            <p className="text-xs text-gray-500">
              PNG, JPG ou GIF (max. 5MB)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Recommandé: 1920x1080px
            </p>
          </div>
        )}
      </div>

      {/* Message d'erreur */}
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Aide contextuelle */}
      {!error && !preview && (
        <p className="mt-2 text-xs text-gray-500">
          Format recommandé : 1920x1080px (16:9) pour une qualité optimale
        </p>
      )}
    </div>
  )
}
