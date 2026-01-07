import { useState, useEffect } from 'react'
import { MainLayout } from '../../components/layout/MainLayout'
import { Container } from '../../components/layout/Container'
import ProjectFilters from '../../components/projects/ProjectFilters'
import ProjectGrid from '../../components/projects/ProjectGrid'
import * as projectService from '../../services/projectService'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter states
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('active')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')

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
    // Parse sort value (e.g., "created_at_desc" or "goal_amount")
    if (sortValue.endsWith('_desc')) {
      setSortBy(sortValue.replace('_desc', ''))
      setSortOrder('desc')
    } else if (sortValue.endsWith('_asc')) {
      setSortBy(sortValue.replace('_asc', ''))
      setSortOrder('asc')
    } else {
      setSortBy(sortValue)
      setSortOrder('desc')
    }
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 py-12">
        <Container>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Découvrez les projets
            </h1>
            <p className="text-gray-600 text-lg">
              Soutenez les créateurs de jeux vidéo indépendants
            </p>
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
