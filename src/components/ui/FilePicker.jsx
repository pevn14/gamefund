import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { Button } from './Button'

export function FilePicker({
  label,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  onFileSelect,
  onFileRemove,
  error,
  helperText,
  required = false,
  className = '',
}) {
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    // Vérifier le type
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      return 'Type de fichier non accepté'
    }

    // Vérifier la taille
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1)
      return `La taille du fichier ne doit pas dépasser ${maxSizeMB}MB`
    }

    return null
  }

  const handleFileChange = (file) => {
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      setUploadError(validationError)
      return
    }

    setUploadError(null)

    // Créer une preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Appeler le callback parent
    if (onFileSelect) {
      onFileSelect(file)
    }
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    handleFileChange(file)
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
    handleFileChange(file)
  }

  const handleRemove = () => {
    setPreview(null)
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (onFileRemove) {
      onFileRemove()
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {!preview ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8
            transition-all duration-200 cursor-pointer
            ${isDragging
              ? 'border-primary-500 bg-primary-50'
              : error || uploadError
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-3">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center
              ${isDragging ? 'bg-primary-100' : 'bg-gray-100'}
            `}>
              <Upload
                size={24}
                className={isDragging ? 'text-primary-600' : 'text-gray-400'}
              />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                Cliquez pour uploader ou glissez-déposez
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {accept.includes('image') ? 'PNG, JPG, GIF' : 'Tous fichiers'} jusqu'à {(maxSize / (1024 * 1024)).toFixed(0)}MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="absolute top-2 right-2">
            <button
              onClick={handleRemove}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-lg transition-colors"
              type="button"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ImageIcon size={16} />
              <span className="truncate flex-1">Image sélectionnée</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClick}
                type="button"
              >
                Changer
              </Button>
            </div>
          </div>
        </div>
      )}

      {(error || uploadError) && (
        <div className="mt-2 flex items-start gap-2 text-sm text-red-600">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <p>{error || uploadError}</p>
        </div>
      )}

      {helperText && !error && !uploadError && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
