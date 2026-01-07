import { supabase } from './supabase'

/**
 * Récupère tous les projets (avec filtres optionnels)
 * @param {Object} filters - Filtres optionnels
 * @param {string} filters.status - Statut du projet
 * @param {string} filters.search - Recherche textuelle
 * @param {string} filters.sortBy - Tri ('created_at', 'title', 'goal')
 * @param {string} filters.sortOrder - Ordre ('asc', 'desc')
 * @returns {Promise<{projects, error}>}
 */
export async function getProjects(filters = {}) {
  let query = supabase
    .from('projects')
    .select(`
      *,
      creator:profiles!creator_id(id, display_name, avatar_url)
    `)

  // Filtre par statut
  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  // Recherche textuelle
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  // Tri
  const sortBy = filters.sortBy || 'created_at'
  const sortOrder = filters.sortOrder || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  const { data, error } = await query

  if (error) return { projects: null, error }

  // Enrichir chaque projet avec ses stats
  const projectsWithStats = await Promise.all(
    data.map(async (project) => {
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

  return { projects: projectsWithStats, error: null }
}

/**
 * Récupère un projet par son ID
 * @param {string} projectId
 * @returns {Promise<{project, error}>}
 */
export async function getProjectById(projectId) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      creator:profiles!creator_id(id, display_name, avatar_url, bio)
    `)
    .eq('id', projectId)
    .single()

  return { project: data, error }
}

/**
 * Récupère les projets d'un créateur spécifique
 * @param {string} creatorId
 * @returns {Promise<{projects, error}>}
 */
export async function getProjectsByCreator(creatorId) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false })

  return { projects: data, error }
}

/**
 * Crée un nouveau projet
 * @param {Object} projectData
 * @returns {Promise<{project, error}>}
 */
export async function createProject(projectData) {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single()

  return { project: data, error }
}

/**
 * Met à jour un projet existant
 * @param {string} projectId
 * @param {Object} updates
 * @returns {Promise<{project, error}>}
 */
export async function updateProject(projectId, updates) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single()

  return { project: data, error }
}

/**
 * Supprime un projet
 * @param {string} projectId
 * @returns {Promise<{error}>}
 */
export async function deleteProject(projectId) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  return { error }
}

/**
 * Publie un projet (passe de draft à active)
 * @param {string} projectId
 * @returns {Promise<{project, error}>}
 */
export async function publishProject(projectId) {
  return updateProject(projectId, { status: 'active' })
}

/**
 * Upload une image de projet vers Supabase Storage
 * @param {File} file
 * @param {string} projectId
 * @returns {Promise<{url, error}>}
 */
export async function uploadProjectImage(file, projectId) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${projectId}-${Date.now()}.${fileExt}`
  const filePath = `${projectId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('project-images')
    .upload(filePath, file)

  if (uploadError) return { url: null, error: uploadError }

  const { data } = supabase.storage
    .from('project-images')
    .getPublicUrl(filePath)

  return { url: data.publicUrl, error: null }
}

/**
 * Récupère les statistiques d'un projet (montant collecté, nombre de donateurs)
 * @param {string} projectId
 * @returns {Promise<{stats, error}>}
 */
export async function getProjectStats(projectId) {
  const { data, error } = await supabase.rpc('get_project_total_collected', {
    project_id: projectId,
  })

  if (error) return { stats: null, error }

  return {
    stats: {
      totalCollected: data || 0,
    },
    error: null,
  }
}
