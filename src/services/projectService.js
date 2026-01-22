import { supabase } from './supabase'

/**
 * Récupère tous les projets (avec filtres optionnels)
 * @param {Object} filters - Filtres optionnels
 * @param {string} filters.status - Statut du projet
 * @param {string} filters.search - Recherche textuelle
 * @param {string} filters.creator_id - ID du créateur
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

  // Filtre par créateur
  if (filters.creator_id) {
    query = query.eq('creator_id', filters.creator_id)
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
        goal: project.goal_amount,
        start_date: project.created_at,
        end_date: project.deadline,
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
 * @returns {Promise<{data, error}>}
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

  // Mapper goal_amount vers goal pour compatibilité avec le frontend
  if (data) {
    data.goal = data.goal_amount
    data.start_date = data.created_at
    data.end_date = data.deadline
  }

  return { data, error }
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

  // Mapper goal_amount vers goal pour compatibilité avec le frontend
  const projects = data?.map(project => ({
    ...project,
    goal: project.goal_amount,
    start_date: project.created_at,
    end_date: project.deadline
  }))

  return { projects, error }
}

/**
 * Crée un nouveau projet
 * @param {Object} projectData
 * @returns {Promise<{project, error}>}
 */
export async function createProject(projectData) {
  // Mapper les noms de colonnes du frontend vers la base de données
  const dbData = {
    ...projectData,
    // Accepter goal ou goal_amount (pour compatibilité)
    goal_amount: projectData.goal_amount || projectData.goal,
    // Accepter deadline ou end_date (pour compatibilité)
    deadline: projectData.deadline || projectData.end_date
  }

  // Supprimer les propriétés du frontend qui n'existent pas en base
  delete dbData.goal
  delete dbData.end_date
  delete dbData.start_date

  const { data, error } = await supabase
    .from('projects')
    .insert([dbData])
    .select()
    .single()

  // Mapper les colonnes de la base vers le frontend
  if (data) {
    data.goal = data.goal_amount
    data.start_date = data.created_at
    data.end_date = data.deadline
  }

  return { project: data, error }
}

/**
 * Met à jour un projet existant
 * @param {string} projectId
 * @param {Object} updates
 * @returns {Promise<{project, error}>}
 */
export async function updateProject(projectId, updates) {
  // Mapper les noms de colonnes du frontend vers la base de données
  const dbUpdates = { ...updates }

  if (updates.goal !== undefined) {
    dbUpdates.goal_amount = updates.goal
    delete dbUpdates.goal
  }

  if (updates.end_date !== undefined) {
    dbUpdates.deadline = updates.end_date
    delete dbUpdates.end_date
  }

  delete dbUpdates.start_date // created_at ne peut pas être modifié

  const { data, error } = await supabase
    .from('projects')
    .update(dbUpdates)
    .eq('id', projectId)
    .select()
    .single()

  // Mapper les colonnes de la base vers le frontend
  if (data) {
    data.goal = data.goal_amount
    data.start_date = data.created_at
    data.end_date = data.deadline
  }

  return { project: data, error }
}

/**
 * Supprime un projet et son image
 * @param {string} projectId
 * @returns {Promise<{error}>}
 */
export async function deleteProject(projectId) {
  // Récupérer le projet pour obtenir l'URL de l'image
  const { data: project } = await supabase
    .from('projects')
    .select('image_url')
    .eq('id', projectId)
    .single()

  // Supprimer l'image si elle existe
  if (project?.image_url) {
    await deleteProjectImage(project.image_url)
  }

  // Supprimer le projet de la base de données
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
 * Supprime une image du bucket Supabase Storage
 * @param {string} imageUrl - URL publique de l'image
 * @returns {Promise<{error}>}
 */
export async function deleteProjectImage(imageUrl) {
  if (!imageUrl || imageUrl === '') return { error: null }

  try {
    // Extraire le nom du fichier de l'URL
    // Format: https://...supabase.co/storage/v1/object/public/project-images/filename.jpg
    const parts = imageUrl.split('/project-images/')
    if (parts.length < 2) {
      return { error: null }
    }

    // Extraire le nom de fichier et enlever les paramètres de query éventuels
    let fileName = parts[1].split('?')[0]

    if (!fileName) {
      return { error: null }
    }

    const { error } = await supabase.storage
      .from('project-images')
      .remove([fileName])

    if (error) {
      console.error('Erreur suppression image:', error)
    }

    return { error }
  } catch (err) {
    console.error('Erreur dans deleteProjectImage:', err)
    return { error: err }
  }
}

/**
 * Upload une image de projet vers Supabase Storage
 * @param {File} file
 * @param {string} projectId
 * @param {string} oldImageUrl - URL de l'ancienne image à supprimer (optionnel)
 * @returns {Promise<{url, error}>}
 */
export async function uploadProjectImage(file, projectId, oldImageUrl = null) {
  // Supprimer l'ancienne image si elle existe
  if (oldImageUrl) {
    await deleteProjectImage(oldImageUrl)
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${projectId}-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('project-images')
    .upload(fileName, file)

  if (uploadError) return { url: null, error: uploadError }

  const { data } = supabase.storage
    .from('project-images')
    .getPublicUrl(fileName)

  return { url: data.publicUrl, error: null }
}

/**
 * Récupère les statistiques d'un projet (montant collecté, nombre de donateurs)
 * @param {string} projectId
 * @returns {Promise<{data, error}>}
 */
export async function getProjectStats(projectId) {
  const { data: totalData, error: totalError } = await supabase.rpc('get_project_total_collected', {
    project_uuid: projectId,
  })

  if (totalError) return { data: null, error: totalError }

  const { data: donorsData, error: donorsError } = await supabase.rpc('get_project_donors_count', {
    project_uuid: projectId,
  })

  if (donorsError) return { data: null, error: donorsError }

  return {
    data: {
      total_collected: totalData || 0,
      donors_count: donorsData || 0,
    },
    error: null,
  }
}

// Export par défaut pour faciliter l'import
export const projectService = {
  getProjects,
  getProjectById,
  getProjectsByCreator,
  createProject,
  updateProject,
  deleteProject,
  publishProject,
  deleteProjectImage,
  uploadProjectImage,
  getProjectStats,
}
