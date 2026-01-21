import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container } from '../../components/layout/Container'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { ImageUpload } from '../../components/ui/ImageUpload'
import { Card, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { useAuth } from '../../hooks/useAuth'
import {
  getProjectById,
  updateProject,
  uploadProjectImage,
  deleteProject,
  publishProject
} from '../../services/projectService'
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react'

/**
 * Page d'édition d'un projet
 * Permet aux créateurs de modifier leurs projets existants
 */
export function EditProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [project, setProject] = useState(null)

  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_amount: '',
    deadline: '',
    image: null,
    status: 'draft'
  })

  // Charger le projet
  useEffect(() => {
    loadProject()
  }, [id])

  const loadProject = async () => {
    if (!id) {
      navigate('/dashboard/projects')
      return
    }

    try {
      const { project: projectData, error } = await getProjectById(id)

      if (error) throw error

      if (!projectData) {
        alert('Projet non trouvé')
        navigate('/dashboard/projects')
        return
      }

      // Vérifier que l'utilisateur est bien le créateur
      if (projectData.creator_id !== user?.id) {
        alert('Vous n\'avez pas l\'autorisation de modifier ce projet')
        navigate('/')
        return
      }

      setProject(projectData)

      // Pré-remplir le formulaire
      setFormData({
        title: projectData.title || '',
        description: projectData.description || '',
        goal_amount: projectData.goal_amount || '',
        deadline: projectData.deadline?.split('T')[0] || '',
        image: null, // On garde l'URL existante pour l'affichage
        status: projectData.status || 'draft'
      })
    } catch (err) {
      console.error('Erreur chargement projet:', err)
      alert('Erreur lors du chargement du projet')
      navigate('/dashboard/projects')
    } finally {
      setLoading(false)
    }
  }

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
    }

    // Image (obligatoire seulement si pas d'image existante)
    if (!formData.image && !project?.image_url) {
      newErrors.image = 'Une image est requise'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Sauvegarder les modifications
  const handleSave = async () => {
    if (!validateForm()) {
      alert('Veuillez corriger les erreurs avant de sauvegarder')
      return
    }

    setSaving(true)

    try {
      let imageUrl = project.image_url

      // Upload de la nouvelle image si changée
      if (formData.image) {
        const { url, error: uploadError } = await uploadProjectImage(
          formData.image,
          id,
          project.image_url // Passer l'ancienne URL pour la supprimer
        )

        if (uploadError) throw uploadError
        imageUrl = url
      }

      // Mettre à jour le projet
      const updates = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        goal_amount: parseFloat(formData.goal_amount),
        deadline: formData.deadline,
        image_url: imageUrl
      }

      const { error } = await updateProject(id, updates)

      if (error) throw error

      alert('Projet mis à jour avec succès !')

      // Recharger le projet
      await loadProject()
    } catch (err) {
      console.error('Erreur sauvegarde:', err)
      alert('Erreur lors de la sauvegarde du projet')
    } finally {
      setSaving(false)
    }
  }

  // Publier le projet
  const handlePublish = async () => {
    if (!validateForm()) {
      alert('Veuillez corriger les erreurs avant de publier')
      return
    }

    if (!confirm('Êtes-vous sûr de vouloir publier ce projet ? Il sera visible publiquement.')) {
      return
    }

    setSaving(true)

    try {
      // Sauvegarder d'abord les modifications
      await handleSave()

      // Puis publier
      const { error } = await publishProject(id)

      if (error) throw error

      alert('Projet publié avec succès ! 🎉')
      navigate(`/projects/${id}`)
    } catch (err) {
      console.error('Erreur publication:', err)
      alert('Erreur lors de la publication du projet')
    } finally {
      setSaving(false)
    }
  }

  // Supprimer le projet
  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.')) {
      return
    }

    if (!confirm('Dernière confirmation : supprimer définitivement ce projet ?')) {
      return
    }

    setSaving(true)

    try {
      const { error } = await deleteProject(id)

      if (error) throw error

      alert('Projet supprimé avec succès')
      navigate('/dashboard/projects')
    } catch (err) {
      console.error('Erreur suppression:', err)
      alert('Erreur lors de la suppression du projet')
    } finally {
      setSaving(false)
    }
  }

  // Calcule la date minimum (demain)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <Container>
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-64 mb-6" />
                  <Skeleton className="h-12 w-full mb-4" />
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  const statusColors = {
    draft: 'secondary',
    active: 'success',
    completed: 'primary',
    failed: 'danger'
  }

  const statusLabels = {
    draft: 'Brouillon',
    active: 'Actif',
    completed: 'Terminé',
    failed: 'Échoué'
  }

  return (
    <div data-testid="edit-project-page" className="min-h-screen bg-gray-50 py-8">
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

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Éditer le projet
              </h1>
              <p className="text-gray-600">
                Modifiez les informations de votre projet
              </p>
            </div>

            <Badge variant={statusColors[formData.status]}>
              {statusLabels[formData.status]}
            </Badge>
          </div>
        </div>

        {/* Formulaire */}
        <div data-testid="project-form" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de base */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Informations de base</h2>

                <div className="space-y-6">
                  {/* Titre */}
                  <Input
                    data-testid="project-form-title-input"
                    label="Titre du projet"
                    placeholder="Ex: Mystic Quest - Un RPG épique"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    error={errors.title}
                    required
                    maxLength={200}
                    disabled={formData.status === 'active'}
                  />

                  {formData.status === 'active' && (
                    <div className="text-xs text-amber-600 -mt-4">
                      ⚠️ Le titre ne peut pas être modifié pour un projet actif
                    </div>
                  )}

                  <div className="text-xs text-gray-500 -mt-4">
                    {formData.title.length}/200 caractères
                  </div>

                  {/* Description */}
                  <Textarea
                    data-testid="project-form-description-input"
                    label="Description"
                    placeholder="Décrivez votre projet en détail..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    error={errors.description}
                    required
                    rows={8}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image du projet */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Image du projet</h2>

                <ImageUpload
                  label="Image de bannière"
                  value={formData.image ? URL.createObjectURL(formData.image) : project?.image_url}
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
                    data-testid="project-form-goal-input"
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
                    disabled={formData.status === 'active'}
                  />

                  {/* Date d'échéance */}
                  <Input
                    data-testid="project-form-deadline-input"
                    label="Date d'échéance"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                    error={errors.deadline}
                    required
                    min={getMinDate()}
                    disabled={formData.status === 'active'}
                  />
                </div>

                {formData.status === 'active' && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      ⚠️ Le montant cible et la date d'échéance ne peuvent pas être modifiés pour un projet actif
                    </p>
                  </div>
                )}
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
                    {/* Bouton Sauvegarder */}
                    <Button
                      data-testid="project-form-save-button"
                      variant="primary"
                      size="md"
                      className="w-full"
                      onClick={handleSave}
                      loading={saving}
                      disabled={saving}
                    >
                      <Save size={18} />
                      Sauvegarder
                    </Button>

                    {/* Bouton Publier (si brouillon) */}
                    {formData.status === 'draft' && (
                      <Button
                        data-testid="project-form-publish-button"
                        variant="success"
                        size="md"
                        className="w-full"
                        onClick={handlePublish}
                        disabled={saving}
                      >
                        <Eye size={18} />
                        Publier le projet
                      </Button>
                    )}

                    {/* Bouton Supprimer */}
                    <Button
                      data-testid="project-form-delete-button"
                      variant="danger"
                      size="md"
                      className="w-full"
                      onClick={handleDelete}
                      disabled={saving}
                    >
                      <Trash2 size={18} />
                      Supprimer le projet
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Card Informations */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Informations</h3>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">Statut :</span>
                      <span className="ml-2 font-medium">
                        {statusLabels[formData.status]}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-600">Créé le :</span>
                      <span className="ml-2 font-medium">
                        {new Date(project?.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    {project?.updated_at && (
                      <div>
                        <span className="text-gray-600">Modifié le :</span>
                        <span className="ml-2 font-medium">
                          {new Date(project.updated_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
