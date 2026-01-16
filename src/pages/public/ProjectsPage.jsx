import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MainLayout } from '../../components/layout/MainLayout'
import { Container } from '../../components/layout/Container'
import { Button } from '../../components/ui/Button'
import ProjectFilters from '../../components/projects/ProjectFilters'
import ProjectGrid from '../../components/projects/ProjectGrid'
import * as projectService from '../../services/projectService'
import { useAuth } from '../../hooks/useAuth'
import { useAdmin } from '../../hooks/useAdmin'
import { Plus } from 'lucide-react'

export default function ProjectsPage() {
  const navigate = useNavigate()
  const location = useLocation()
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

  // Scroll vers le haut quand l'URL change (ex: / -> /projects)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    fetchProjects()
  }, [search, status, sortBy, sortOrder])

  async function fetchProjects() {
    setLoading(true)
    setError(null)

    try {
      const filters = {
        status: status === 'all' ? undefined : status,
        search: search || undefined,
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
