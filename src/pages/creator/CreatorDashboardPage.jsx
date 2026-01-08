import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '../../components/layout/Container'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { RecentProjectsList } from '../../components/dashboard/RecentProjectsList'
import { QuickActions } from '../../components/dashboard/QuickActions'
import { useAuth } from '../../hooks/useAuth'
import { getProjectsByCreator } from '../../services/projectService'
import { Target, FolderOpen, Users, TrendingUp, AlertCircle } from 'lucide-react'

/**
 * Page Dashboard Créateur
 * Vue d'ensemble avec statistiques et projets récents
 */
export function CreatorDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    draftProjects: 0,
    completedProjects: 0,
    totalCollected: 0,
    totalDonors: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    setLoading(true)

    try {
      const { projects: projectsData, error } = await getProjectsByCreator(user.id)

      if (error) throw error

      setProjects(projectsData || [])

      // Calculer les statistiques
      const totalCollected = (projectsData || []).reduce((sum, p) => sum + (p.total_collected || 0), 0)
      const totalDonors = (projectsData || []).reduce((sum, p) => sum + (p.donors_count || 0), 0)

      setStats({
        totalProjects: (projectsData || []).length,
        activeProjects: (projectsData || []).filter(p => p.status === 'active').length,
        draftProjects: (projectsData || []).filter(p => p.status === 'draft').length,
        completedProjects: (projectsData || []).filter(p => p.status === 'completed').length,
        totalCollected,
        totalDonors
      })
    } catch (err) {
      console.error('Erreur chargement dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  // Projets récents (max 5, triés par date de création)
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard Créateur
          </h1>
          <p className="text-gray-600">
            Bienvenue {user?.user_metadata?.display_name || user?.email} 👋
          </p>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<FolderOpen size={24} />}
            label="Total projets"
            value={stats.totalProjects}
            variant="primary"
          />

          <StatsCard
            icon={<Target size={24} />}
            label="Projets actifs"
            value={stats.activeProjects}
            variant="success"
          />

          <StatsCard
            icon={<TrendingUp size={24} />}
            label="Fonds collectés"
            value={`${stats.totalCollected.toLocaleString('fr-FR')}€`}
            variant="default"
          />

          <StatsCard
            icon={<Users size={24} />}
            label="Donateurs"
            value={stats.totalDonors}
            variant="default"
          />
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projets récents (2/3) */}
          <div className="lg:col-span-2">
            <RecentProjectsList
              projects={recentProjects}
              loading={loading}
              onViewAll={() => navigate('/dashboard/projects')}
            />
          </div>

          {/* Sidebar (1/3) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Actions rapides */}
            <QuickActions />

            {/* Brouillons en attente */}
            {stats.draftProjects > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                      <AlertCircle size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {stats.draftProjects} brouillon{stats.draftProjects > 1 ? 's' : ''} en attente
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Terminez et publiez vos projets pour commencer à collecter des dons
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/dashboard/projects?filter=draft')}
                      >
                        Voir les brouillons
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Aide et conseils */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  💡 Conseils
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">✓</span>
                    <span>Mettez à jour régulièrement vos projets actifs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">✓</span>
                    <span>Répondez aux commentaires de vos donateurs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">✓</span>
                    <span>Partagez vos projets sur les réseaux sociaux</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}
