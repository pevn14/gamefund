import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react'
import { MainLayout } from '../components/layout/MainLayout'
import { Container } from '../components/layout/Container'
import { Button } from '../components/ui/Button'
import {
  getAllProjects,
  updateProjectStatus,
  updateProjectDeadline,
  deleteProject,
} from '../services/adminService'

/**
 * Page de gestion des projets pour l'admin
 * Vue en tableau avec actions rapides, tri et filtrage
 */
export function AdminProjectsPage() {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Filtres et tri
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('created_at')
  const [sortDirection, setSortDirection] = useState('desc')

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [projects, statusFilter, searchTerm, sortField, sortDirection])

  const loadProjects = async () => {
    setLoading(true)
    const { data, error } = await getAllProjects()

    if (error) {
      console.error('Error loading projects:', error)
    } else {
      setProjects(data || [])
    }

    setLoading(false)
  }

  const applyFiltersAndSort = () => {
    let filtered = [...projects]

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter)
    }

    // Filtre par recherche (titre ou créateur)
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.creator?.display_name?.toLowerCase().includes(term) ||
          p.creator?.email?.toLowerCase().includes(term)
      )
    }

    // Tri
    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      // Cas spécial pour le créateur
      if (sortField === 'creator') {
        aVal = a.creator?.display_name || a.creator?.email || ''
        bVal = b.creator?.display_name || b.creator?.email || ''
      }

      // Cas spécial pour current_amount
      if (sortField === 'current_amount') {
        aVal = a.current_amount || 0
        bVal = b.current_amount || 0
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    })

    setFilteredProjects(filtered)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      // Inverse la direction si on clique sur le même champ
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Nouveau champ, commence par ordre décroissant
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ArrowUp size={14} className="inline ml-1" />
    ) : (
      <ArrowDown size={14} className="inline ml-1" />
    )
  }

  const handleStatusChange = async (projectId, newStatus) => {
    const confirmed = window.confirm(
      `Changer le statut de ce projet en "${newStatus}" ?`
    )
    if (!confirmed) return

    const { error } = await updateProjectStatus(projectId, newStatus)

    if (error) {
      console.error('Error updating status:', error)
      alert('Erreur lors de la mise à jour du statut')
    } else {
      loadProjects()
    }
  }

  const handleDeadlineChange = async (projectId, projectTitle) => {
    const newDate = window.prompt(
      `Nouvelle deadline pour "${projectTitle}":\n\nFormat: YYYY-MM-DD (ex: 2026-12-31)`
    )

    if (!newDate) return

    // Validation simple de la date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(newDate)) {
      alert('Format de date invalide. Utilisez YYYY-MM-DD')
      return
    }

    const { error } = await updateProjectDeadline(projectId, newDate)

    if (error) {
      console.error('Error updating deadline:', error)
      alert('Erreur lors de la mise à jour de la deadline')
    } else {
      loadProjects()
    }
  }

  const handleDelete = async (project) => {
    // Sécurité: seulement les projets cancelled peuvent être supprimés
    if (project.status !== 'cancelled') {
      alert(
        'Impossible de supprimer ce projet.\n\nSeuls les projets avec le statut "cancelled" peuvent être supprimés définitivement.'
      )
      return
    }

    const confirmed = window.confirm(
      `ATTENTION: Supprimer définitivement le projet "${project.title}" ?\n\nCette action est irréversible.`
    )
    if (!confirmed) return

    const { error } = await deleteProject(project.id)

    if (error) {
      console.error('Error deleting project:', error)
      alert('Erreur lors de la suppression')
    } else {
      loadProjects()
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-orange-100 text-orange-800',
      suspended: 'bg-purple-100 text-purple-800',
    }

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded ${
          colors[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status}
      </span>
    )
  }

  const calculateDaysRemaining = (deadline) => {
    if (!deadline) return '-'
    const now = new Date()
    const end = new Date(deadline)
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))

    if (diff < 0) return `Expiré (${Math.abs(diff)}j)`
    if (diff === 0) return "Aujourd'hui"
    return `${diff}j`
  }

  return (
    <MainLayout>
      <Container className="py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={18} />
              Retour
            </Button>
          </Link>
          <div>
            <h1
              data-testid="admin-projects-title"
              className="text-3xl font-bold text-gray-900"
            >
              Gestion des Projets
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {filteredProjects.length} projet
              {filteredProjects.length > 1 ? 's' : ''}
              {projects.length !== filteredProjects.length &&
                ` sur ${projects.length}`}
            </p>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <input
            type="text"
            placeholder="Rechercher par titre ou créateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          {/* Filtre par statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div
            data-testid="admin-projects-loading"
            className="text-center py-12 text-gray-500"
          >
            Chargement...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {projects.length === 0
              ? 'Aucun projet trouvé'
              : 'Aucun projet ne correspond aux filtres'}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table
                data-testid="admin-projects-table"
                className="w-full border-collapse border border-gray-200"
              >
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      onClick={() => handleSort('title')}
                      className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100"
                    >
                      Titre {getSortIcon('title')}
                    </th>
                    <th
                      onClick={() => handleSort('creator')}
                      className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100"
                    >
                      Créateur {getSortIcon('creator')}
                    </th>
                    <th
                      onClick={() => handleSort('status')}
                      className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100"
                    >
                      Statut {getSortIcon('status')}
                    </th>
                    <th
                      onClick={() => handleSort('goal_amount')}
                      className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100"
                    >
                      Objectif {getSortIcon('goal_amount')}
                    </th>
                    <th
                      onClick={() => handleSort('current_amount')}
                      className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100"
                    >
                      Collecté {getSortIcon('current_amount')}
                    </th>
                    <th
                      onClick={() => handleSort('deadline')}
                      className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold cursor-pointer hover:bg-gray-100"
                    >
                      Deadline {getSortIcon('deadline')}
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold">
                      Jours restants
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-primary-600 hover:underline"
                        >
                          {project.title}
                        </Link>
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        {project.creator?.display_name || project.creator?.email}
                        {!project.creator?.is_active && (
                          <span className="ml-2 text-red-600 text-xs">
                            (inactif)
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        {project.goal_amount.toLocaleString()} €
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        {project.current_amount?.toLocaleString() || 0} €
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        {project.deadline
                          ? new Date(project.deadline).toLocaleDateString('fr-FR')
                          : '-'}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        {calculateDaysRemaining(project.deadline)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">
                        <div className="flex flex-col gap-1">
                          <select
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                            value={project.status}
                            onChange={(e) =>
                              handleStatusChange(project.id, e.target.value)
                            }
                          >
                            <option value="draft">draft</option>
                            <option value="active">active</option>
                            <option value="completed">completed</option>
                            <option value="failed">failed</option>
                            <option value="cancelled">cancelled</option>
                            <option value="suspended">suspended</option>
                          </select>
                          <button
                            onClick={() =>
                              handleDeadlineChange(project.id, project.title)
                            }
                            className="text-xs text-blue-600 hover:underline text-left"
                          >
                            Changer deadline
                          </button>
                          <button
                            onClick={() => handleDelete(project)}
                            className={`text-xs text-left hover:underline ${
                              project.status === 'cancelled'
                                ? 'text-red-600'
                                : 'text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={project.status !== 'cancelled'}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note de sécurité */}
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800">
              <strong>Note:</strong> Seuls les projets avec le statut{' '}
              <code className="bg-orange-100 px-1 rounded">cancelled</code> peuvent
              être supprimés définitivement. Changez d'abord le statut en
              "cancelled" pour pouvoir supprimer un projet.
            </div>
          </>
        )}
      </Container>
    </MainLayout>
  )
}
