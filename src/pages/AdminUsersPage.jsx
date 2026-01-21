import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { MainLayout } from '../components/layout/MainLayout'
import { Container } from '../components/layout/Container'
import { Button } from '../components/ui/Button'
import { getAllUsers, toggleUserStatus, updateUserRole } from '../services/adminService'

/**
 * Page de gestion des utilisateurs pour l'admin
 * Vue en tableau avec actions rapides
 */
export function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    const { data, error } = await getAllUsers()

    if (error) {
      console.error('Error loading users:', error)
    } else {
      setUsers(data || [])
    }

    setLoading(false)
  }

  const handleToggleStatus = async (userId, currentStatus, userEmail) => {
    const newStatus = !currentStatus
    const action = newStatus ? 'réactiver' : 'suspendre'
    const confirmed = window.confirm(
      `${action.charAt(0).toUpperCase() + action.slice(1)} l'utilisateur "${userEmail}" ?`
    )
    if (!confirmed) return

    const { error } = await toggleUserStatus(userId, newStatus)

    if (error) {
      console.error('Error toggling user status:', error)
      alert('Erreur lors de la modification du statut')
    } else {
      loadUsers()
    }
  }

  const handleRoleChange = async (userId, newRole, userEmail) => {
    const confirmed = window.confirm(
      `Changer le rôle de "${userEmail}" en "${newRole}" ?`
    )
    if (!confirmed) return

    const { error } = await updateUserRole(userId, newRole)

    if (error) {
      console.error('Error updating role:', error)
      alert('Erreur lors de la modification du rôle')
    } else {
      loadUsers()
    }
  }

  const getRoleBadge = (role) => {
    const colors = {
      user: 'bg-gray-100 text-gray-800',
      admin: 'bg-purple-100 text-purple-800',
    }

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded ${
          colors[role] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {role}
      </span>
    )
  }

  return (
    <MainLayout>
      <Container data-testid="admin-users-page" className="py-8">
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
            data-testid="admin-users-title"
            className="text-3xl font-bold text-gray-900"
          >
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {users.length} utilisateur{users.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div
          data-testid="admin-users-loading"
          className="text-center py-12 text-gray-500"
        >
          Chargement...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Aucun utilisateur trouvé
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table
            data-testid="admin-users-table"
            className="w-full border-collapse border border-gray-200"
          >
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold">
                  Nom
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold">
                  Rôle
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold">
                  Statut
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold">
                  Créé le
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} data-testid="admin-user-row" className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 text-sm">
                    {user.email}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-sm">
                    {user.display_name || '-'}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-sm">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-sm">
                    {user.is_active ? (
                      <span className="text-green-600 font-medium">Actif</span>
                    ) : (
                      <span className="text-red-600 font-medium">Suspendu</span>
                    )}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-sm">
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-sm">
                    <div className="flex flex-col gap-1">
                      <select
                        data-testid="admin-user-role-select"
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value, user.email)
                        }
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                      <button
                        data-testid="admin-user-status-toggle"
                        onClick={() =>
                          handleToggleStatus(user.id, user.is_active, user.email)
                        }
                        className={`text-xs hover:underline ${
                          user.is_active ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {user.is_active ? 'Suspendre' : 'Réactiver'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
    </MainLayout>
  )
}
