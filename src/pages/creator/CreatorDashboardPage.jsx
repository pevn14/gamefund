import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '../../components/layout/MainLayout'
import { Container } from '../../components/layout/Container'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { RecentProjectsList } from '../../components/dashboard/RecentProjectsList'
import { QuickActions } from '../../components/dashboard/QuickActions'
import { ProfileEditor } from '../../components/profile/ProfileEditor'
import { useAuth } from '../../hooks/useAuth'
import { getProjectsByCreator } from '../../services/projectService'
import { supabase } from '../../services/supabase'
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

      // Enrichir chaque projet avec ses stats
      const projectsWithStats = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { data: statsData } = await supabase
            .rpc('get_project_total_collected', { project_uuid: project.id })

          const { data: donorsData } = await supabase
            .rpc('get_project_donors_count', { project_uuid: project.id })

          return {
            ...project,
            total_collected: statsData || 0,
            donors_count: donorsData || 0
          }
        })
      )

      setProjects(projectsWithStats)

      // Calculer les statistiques globales
      const totalCollected = projectsWithStats.reduce((sum, p) => sum + (p.total_collected || 0), 0)
      const totalDonors = projectsWithStats.reduce((sum, p) => sum + (p.donors_count || 0), 0)

      setStats({
        totalProjects: projectsWithStats.length,
        activeProjects: projectsWithStats.filter(p => p.status === 'active').length,
        draftProjects: projectsWithStats.filter(p => p.status === 'draft').length,
        completedProjects: projectsWithStats.filter(p => p.status === 'completed').length,
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
    <MainLayout>
      <div data-testid="creator-dashboard-page" className="min-h-screen bg-gray-50 py-8">
        <Container>
          {/* Header */}
          <div className="mb-8">
            <h1 data-testid="creator-dashboard-welcome" className="text-4xl font-bold text-gray-900">
              Dashboard Créateur
            </h1>
          </div>

        {/* Statistiques principales */}
        <div data-testid="creator-dashboard-stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div data-testid="creator-dashboard-stat-total">
            <StatsCard
              icon={<FolderOpen size={24} />}
              label="Total projets"
              value={stats.totalProjects}
              variant="primary"
            />
          </div>

          <div data-testid="creator-dashboard-stat-active">
            <StatsCard
              icon={<Target size={24} />}
              label="Projets actifs"
              value={stats.activeProjects}
              variant="success"
            />
          </div>

          <div data-testid="creator-dashboard-stat-collected">
            <StatsCard
              icon={<TrendingUp size={24} />}
              label="Fonds collectés"
              value={`${stats.totalCollected.toLocaleString('fr-FR')}€`}
              variant="default"
            />
          </div>

          <div data-testid="creator-dashboard-stat-donors">
            <StatsCard
              icon={<Users size={24} />}
              label="Donateurs"
              value={stats.totalDonors}
              variant="default"
            />
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projets récents (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profil */}
            <ProfileEditor />

            {/* Projets récents ou État vide */}
            {projects.length === 0 && !loading ? (
              <div data-testid="creator-dashboard-empty" className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <FolderOpen className="text-gray-400 mx-auto mb-4" size={64} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Bienvenue sur votre dashboard !
                </h3>
                <p className="text-gray-600 mb-6">
                  Vous n'avez pas encore créé de projet. Commencez dès maintenant à donner vie à vos idées !
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/dashboard/projects/new')}
                >
                  Créer mon premier projet
                </Button>
              </div>
            ) : (
              <div data-testid="creator-dashboard-recent-projects">
                <RecentProjectsList
                  projects={recentProjects}
                  loading={loading}
                  onViewAll={() => navigate('/dashboard/projects')}
                />
              </div>
            )}

          {/* Sidebar (1/3) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Actions rapides */}
            <div data-testid="creator-dashboard-quick-actions">
              <QuickActions />
            </div>

            {/* Brouillons en attente */}
            {stats.draftProjects > 0 && (
              <Card data-testid="creator-dashboard-drafts-alert">
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
                        data-testid="view-drafts-button"
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
    </MainLayout>
  )
}
