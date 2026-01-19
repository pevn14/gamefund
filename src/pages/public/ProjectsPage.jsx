import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { MainLayout } from '../../components/layout/MainLayout'
import { Container } from '../../components/layout/Container'
import { Button } from '../../components/ui/Button'
import { Avatar } from '../../components/ui/Avatar'
import ProjectFilters from '../../components/projects/ProjectFilters'
import ProjectGrid from '../../components/projects/ProjectGrid'
import * as projectService from '../../services/projectService'
import * as profileService from '../../services/profileService'
import { useAuth } from '../../hooks/useAuth'
import { useAdmin } from '../../hooks/useAdmin'
import { Plus, X } from 'lucide-react'

export default function ProjectsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const { isAdmin } = useAdmin()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter states
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('active')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')

  // Creator filter from URL
  const creatorId = searchParams.get('creator')
  const [creatorProfile, setCreatorProfile] = useState(null)

  // Scroll vers le haut quand l'URL change (ex: / -> /projects)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Charger le profil du créateur si le filtre est actif
  useEffect(() => {
    if (creatorId) {
      loadCreatorProfile()
    } else {
      setCreatorProfile(null)
    }
  }, [creatorId])

  async function loadCreatorProfile() {
    const { data } = await profileService.getProfile(creatorId)
    if (data) {
      setCreatorProfile(data)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [search, status, sortBy, sortOrder, creatorId])

  async function fetchProjects() {
    setLoading(true)
    setError(null)

    try {
      const filters = {
        status: status === 'all' ? undefined : status,
        search: search || undefined,
        creator_id: creatorId || undefined,
        sortBy,
        sortOrder
      }

      const { projects: data, error: fetchError } = await projectService.getProjects(filters)

      if (fetchError) {
        setError(fetchError.message || 'Une erreur est survenue lors du chargement des projets')
      } else {
        setProjects(data || [])
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue')
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (sortValue) => {
    // Parse sort value (e.g., "created_at_desc" or "goal_amount_asc")
    if (sortValue.endsWith('_desc')) {
      const field = sortValue.replace('_desc', '')
      setSortBy(field)
      setSortOrder('desc')
    } else if (sortValue.endsWith('_asc')) {
      const field = sortValue.replace('_asc', '')
      setSortBy(field)
      setSortOrder('asc')
    } else {
      // Par défaut (created_at, deadline, etc.) = desc
      setSortBy(sortValue)
      setSortOrder('desc')
    }
  }

  function clearCreatorFilter() {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.delete('creator')
    setSearchParams(newSearchParams)
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 py-12" data-testid="projects-page">
        <Container>
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2" data-testid="projects-page-title">
                Découvrez les projets
              </h1>
              <p className="text-gray-600 text-lg" data-testid="projects-page-subtitle">
                Soutenez les créateurs de jeux vidéo indépendants
              </p>
            </div>

            {/* Bouton "Créer un projet" visible uniquement si connecté et pas admin */}
            {user && !isAdmin && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/projects/create')}
                className="flex-shrink-0 w-full md:w-auto"
              >
                <Plus size={20} />
                Créer un projet
              </Button>
            )}
          </div>

          {/* Bandeau de filtrage par créateur */}
          {creatorId && creatorProfile && (
            <div
              className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between"
              data-testid="projects-page-creator-filter"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={creatorProfile.avatar_url}
                  name={creatorProfile.display_name}
                  size="md"
                />
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Projets de {creatorProfile.display_name || 'ce créateur'}
                  </p>
                  <p className="text-xs text-blue-500">
                    Filtrage actif
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCreatorFilter}
                icon={<X size={16} />}
                data-testid="projects-page-clear-creator-filter"
              >
                Effacer
              </Button>
            </div>
          )}

          <ProjectFilters
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onSortChange={handleSortChange}
            initialSearch={search}
            initialStatus={status}
            initialSort={`${sortBy}${sortOrder === 'desc' && sortBy !== 'created_at' ? '_desc' : sortOrder === 'asc' && sortBy !== 'created_at' ? '_asc' : ''}`}
          />

          <ProjectGrid
            projects={projects}
            loading={loading}
            error={error}
          />
        </Container>
      </div>
    </MainLayout>
  )
}
