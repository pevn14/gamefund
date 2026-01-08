import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '../../components/layout/Container'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { ImageUpload } from '../../components/ui/ImageUpload'
import { Card, CardContent } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'
import { createProject, uploadProjectImage, updateProject } from '../../services/projectService'
import { ArrowLeft, Save, Eye } from 'lucide-react'

/**
 * Page de création d'un projet
 * Permet aux créateurs de créer un nouveau projet de crowdfunding
 */
export function CreateProjectPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_amount: '',
    deadline: '',
    image: null
  })

  // Met à jour un champ du formulaire
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Réinitialise l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {}

    // Titre
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères'
    } else if (formData.title.length > 200) {
      newErrors.title = 'Le titre ne peut pas dépasser 200 caractères'
    }

    // Description
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise'
    } else if (formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères'
    }

    // Montant cible
    const goalAmount = parseFloat(formData.goal_amount)
    if (!formData.goal_amount) {
      newErrors.goal_amount = 'Le montant cible est requis'
    } else if (isNaN(goalAmount) || goalAmount <= 0) {
      newErrors.goal_amount = 'Le montant doit être supérieur à 0'
    } else if (goalAmount < 100) {
      newErrors.goal_amount = 'Le montant minimum est de 100€'
    }

    // Date d'échéance
    if (!formData.deadline) {
      newErrors.deadline = 'La date d\'échéance est requise'
    } else {
      const deadlineDate = new Date(formData.deadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (deadlineDate <= today) {
        newErrors.deadline = 'La date d\'échéance doit être dans le futur'
      }

      // Optionnel: limiter à max 90 jours
      const maxDate = new Date()
      maxDate.setDate(maxDate.getDate() + 90)
      if (deadlineDate > maxDate) {
        newErrors.deadline = 'La date d\'échéance ne peut pas dépasser 90 jours'
      }
    }

    // Image
    if (!formData.image) {
      newErrors.image = 'Une image est requise'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Sauvegarde en tant que brouillon
  const handleSaveDraft = async () => {
    if (!user) {
      alert('Vous devez être connecté')
      return
    }

    setLoading(true)

    try {
      // Créer le projet en mode draft
      const projectData = {
        creator_id: user.id,
        title: formData.title.trim() || 'Brouillon sans titre',
        description: formData.description.trim() || 'Description à compléter',
        goal_amount: parseFloat(formData.goal_amount) || 100,
        deadline: formData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        image_url: '' // Chaîne vide au lieu de null
      }

      const { project, error } = await createProject(projectData)

      if (error) throw error

      // Upload de l'image si présente
      if (formData.image && project) {
        const { url, error: uploadError } = await uploadProjectImage(formData.image, project.id)

        if (uploadError) {
          console.error('Erreur upload image:', uploadError)
        } else if (url) {
          // Mettre à jour le projet avec l'URL de l'image
          await updateProject(project.id, { image_url: url })
        }
      }

      alert('Brouillon sauvegardé avec succès !')
      navigate('/dashboard/projects')
    } catch (err) {
      console.error('Erreur sauvegarde brouillon:', err)
      alert('Erreur lors de la sauvegarde du brouillon')
    } finally {
      setLoading(false)
    }
  }

  // Publication du projet
  const handlePublish = async () => {
    if (!user) {
      alert('Vous devez être connecté')
      return
    }

    // Valider le formulaire
    if (!validateForm()) {
      alert('Veuillez corriger les erreurs avant de publier')
      return
    }

    setLoading(true)

    try {
      // Créer le projet en mode draft d'abord
      const projectData = {
        creator_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        goal_amount: parseFloat(formData.goal_amount),
        deadline: formData.deadline,
        status: 'draft',
        image_url: '' // Chaîne vide au lieu de null
      }

      const { project, error } = await createProject(projectData)

      if (error) throw error

      // Upload de l'image
      if (formData.image && project) {
        const { url, error: uploadError } = await uploadProjectImage(formData.image, project.id)

        if (uploadError) throw uploadError

        // Mettre à jour le projet avec l'URL et publier
        const { error: updateError } = await updateProject(project.id, {
          image_url: url,
          status: 'active'
        })

        if (updateError) throw updateError
      }

      alert('Projet publié avec succès ! 🎉')
      navigate(`/projects/${project.id}`)
    } catch (err) {
      console.error('Erreur publication projet:', err)
      alert('Erreur lors de la publication du projet')
    } finally {
      setLoading(false)
    }
  }

  // Calcule la date minimum (demain)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // Calcule la date maximum (90 jours)
  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 90)
    return maxDate.toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Créer un projet
          </h1>
          <p className="text-gray-600">
            Présentez votre jeu vidéo et commencez à collecter des fonds
          </p>
        </div>

        {/* Formulaire */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de base */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Informations de base</h2>

                <div className="space-y-6">
                  {/* Titre */}
                  <Input
                    data-testid="project-title-input"
                    label="Titre du projet"
                    placeholder="Ex: Mystic Quest - Un RPG épique"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    error={errors.title}
                    required
                    maxLength={200}
                  />

                  <div className="text-xs text-gray-500 -mt-4">
                    {formData.title.length}/200 caractères
                  </div>

                  {/* Description */}
                  <Textarea
                    data-testid="project-description-input"
                    label="Description"
                    placeholder="Décrivez votre projet en détail : l'histoire, le gameplay, les fonctionnalités principales..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    error={errors.description}
                    required
                    rows={8}
                  />

                  <div className="text-xs text-gray-500 -mt-4">
                    Minimum 10 caractères - {formData.description.length} actuellement
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image du projet */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Image du projet</h2>

                <ImageUpload
                  label="Image de bannière"
                  value={null}
                  onChange={(file) => handleChange('image', file)}
                  error={errors.image}
                  required
                  aspectRatio="video"
                />
              </CardContent>
            </Card>

            {/* Objectifs financiers */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Objectifs et échéance</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Montant cible */}
                  <Input
                    data-testid="project-goal-input"
                    label="Montant cible"
                    type="number"
                    placeholder="Ex: 50000"
                    value={formData.goal_amount}
                    onChange={(e) => handleChange('goal_amount', e.target.value)}
                    error={errors.goal_amount}
                    required
                    min={100}
                    step={100}
                    suffix="€"
                  />

                  {/* Date d'échéance */}
                  <Input
                    data-testid="project-deadline-input"
                    label="Date d'échéance"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                    error={errors.deadline}
                    required
                    min={getMinDate()}
                    max={getMaxDate()}
                  />
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Conseil :</strong> Fixez un objectif réaliste.
                    Les projets avec des objectifs atteignables ont plus de chances de réussir.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* Card Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Actions</h3>

                  <div className="space-y-3">
                    {/* Bouton Publier */}
                    <Button
                      data-testid="publish-project-button"
                      variant="primary"
                      size="md"
                      className="w-full"
                      onClick={handlePublish}
                      loading={loading}
                      disabled={loading}
                    >
                      <Eye size={18} />
                      Publier le projet
                    </Button>

                    {/* Bouton Sauvegarder brouillon */}
                    <Button
                      data-testid="save-draft-button"
                      variant="outline"
                      size="md"
                      className="w-full"
                      onClick={handleSaveDraft}
                      disabled={loading}
                    >
                      <Save size={18} />
                      Sauvegarder en brouillon
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      <strong>Publier :</strong> Votre projet sera visible publiquement
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      <strong>Brouillon :</strong> Vous pourrez continuer plus tard
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Card Conseils */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Conseils</h3>

                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-600 font-bold">✓</span>
                      <span>Utilisez une image attrayante et en haute qualité</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-600 font-bold">✓</span>
                      <span>Décrivez clairement votre vision du jeu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-600 font-bold">✓</span>
                      <span>Fixez un objectif financier réaliste</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-600 font-bold">✓</span>
                      <span>Donnez-vous assez de temps (30-60 jours recommandés)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
