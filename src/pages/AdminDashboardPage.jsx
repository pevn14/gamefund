import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, FolderOpen } from 'lucide-react'
import { MainLayout } from '../components/layout/MainLayout'
import { Container } from '../components/layout/Container'
import { StatsGrid } from '../components/admin/StatsGrid'
import { Button } from '../components/ui/Button'
import { getGlobalStats } from '../services/adminService'

/**
 * Page du dashboard admin principal
 * Affichage des statistiques globales et navigation vers les sections
 */
export function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    const { data, error } = await getGlobalStats()

    if (error) {
      console.error('Error loading stats:', error)
    } else {
      setStats(data)
    }

    setLoading(false)
  }

  return (
    <MainLayout>
      <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          data-testid="admin-dashboard-title"
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Dashboard Admin
        </h1>
        <p className="text-gray-600">
          Gestion complète de la plateforme GameFund
        </p>
      </div>

      {/* Statistiques globales */}
      {loading ? (
        <div
          data-testid="admin-dashboard-loading"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded p-4 bg-white animate-pulse"
            >
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-8">
          <StatsGrid stats={stats} />
        </div>
      )}

      {/* Navigation vers les sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Gestion des projets */}
        <Link to="/admin/projects">
          <div
            data-testid="admin-nav-projects"
            className="border border-gray-200 rounded-lg p-6 bg-white hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="text-primary-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Gestion des Projets
              </h2>
            </div>
            <p className="text-gray-600 text-sm">
              Voir tous les projets, changer les statuts, suspendre ou supprimer
            </p>
            <div className="mt-4">
              <Button variant="ghost" size="sm">
                Accéder
              </Button>
            </div>
          </div>
        </Link>

        {/* Gestion des utilisateurs */}
        <Link to="/admin/users">
          <div
            data-testid="admin-nav-users"
            className="border border-gray-200 rounded-lg p-6 bg-white hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="text-primary-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Gestion des Utilisateurs
              </h2>
            </div>
            <p className="text-gray-600 text-sm">
              Voir tous les utilisateurs, suspendre, réactiver, changer les rôles
            </p>
            <div className="mt-4">
              <Button variant="ghost" size="sm">
                Accéder
              </Button>
            </div>
          </div>
        </Link>
      </div>
    </Container>
    </MainLayout>
  )
}
