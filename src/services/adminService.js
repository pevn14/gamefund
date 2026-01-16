import { supabase } from './supabase'

/**
 * Récupère les statistiques globales de la plateforme
 * @returns {Promise<{data, error}>}
 */
export async function getGlobalStats() {
  try {
    // Total utilisateurs
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    if (usersError) throw usersError

    // Utilisateurs suspendus
    const { count: suspendedUsers, error: suspendedError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', false)

    if (suspendedError) throw suspendedError

    // Total projets
    const { count: totalProjects, error: projectsError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })

    if (projectsError) throw projectsError

    // Projets actifs
    const { count: activeProjects, error: activeError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    if (activeError) throw activeError

    // Total donations et montant
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select('amount')
      .eq('cancelled', false)

    if (donationsError) throw donationsError

    const totalDonations = donations?.length || 0
    const totalAmount = donations?.reduce((sum, d) => sum + d.amount, 0) || 0

    return {
      data: {
        totalUsers: totalUsers || 0,
        totalProjects: totalProjects || 0,
        activeProjects: activeProjects || 0,
        totalDonations,
        totalAmount,
        suspendedUsers: suspendedUsers || 0,
      },
      error: null,
    }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Récupère tous les projets avec leurs statistiques
 * @returns {Promise<{data, error}>}
 */
export async function getAllProjects() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select(
      `
      *,
      creator:profiles!creator_id(id, display_name, email, is_active)
    `
    )
    .order('created_at', { ascending: false })

  if (error) return { data: null, error }

  // Calculer le montant collecté pour chaque projet
  const projectsWithStats = await Promise.all(
    projects.map(async (project) => {
      const { data: donations, error: donError } = await supabase
        .from('donations')
        .select('amount')
        .eq('project_id', project.id)
        .eq('cancelled', false)

      const collected = donations?.reduce((sum, d) => sum + d.amount, 0) || 0

      return {
        ...project,
        current_amount: collected,
      }
    })
  )

  return { data: projectsWithStats, error: null }
}

/**
 * Récupère tous les utilisateurs
 * @returns {Promise<{data, error}>}
 */
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Change le statut d'un projet
 * @param {string} projectId
 * @param {string} newStatus - 'draft'|'active'|'completed'|'failed'|'cancelled'|'suspended'
 * @returns {Promise<{data, error}>}
 */
export async function updateProjectStatus(projectId, newStatus) {
  const { data, error } = await supabase
    .from('projects')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .single()

  return { data, error }
}

/**
 * Active ou désactive un utilisateur
 * @param {string} userId
 * @param {boolean} isActive
 * @returns {Promise<{data, error}>}
 */
export async function toggleUserStatus(userId, isActive) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

/**
 * Change le rôle d'un utilisateur
 * @param {string} userId
 * @param {string} newRole - 'user'|'admin'
 * @returns {Promise<{data, error}>}
 */
export async function updateUserRole(userId, newRole) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

/**
 * Met à jour la deadline d'un projet
 * @param {string} projectId
 * @param {string} newDeadline - Date au format ISO
 * @returns {Promise<{data, error}>}
 */
export async function updateProjectDeadline(projectId, newDeadline) {
  const { data, error } = await supabase
    .from('projects')
    .update({ deadline: newDeadline, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .single()

  return { data, error }
}

/**
 * Supprime définitivement un projet (hard delete)
 * ATTENTION: Seulement si le projet est en statut 'cancelled'
 * @param {string} projectId
 * @returns {Promise<{error}>}
 */
export async function deleteProject(projectId) {
  const { error } = await supabase.from('projects').delete().eq('id', projectId)

  return { error }
}

// Export par défaut pour faciliter l'import
export const adminService = {
  getGlobalStats,
  getAllProjects,
  getAllUsers,
  updateProjectStatus,
  updateProjectDeadline,
  toggleUserStatus,
  updateUserRole,
  deleteProject,
}
