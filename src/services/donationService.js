import { supabase } from './supabase'

/**
 * Récupère toutes les donations d'un projet
 * @param {string} projectId
 * @returns {Promise<{data, error}>}
 */
export async function getDonationsByProject(projectId) {
  const { data, error } = await supabase
    .from('donations')
    .select(`
      *,
      donor:profiles!donor_id(id, display_name, avatar_url),
      project:projects(id, title)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Récupère toutes les donations d'un donateur
 * @param {string} donorId
 * @returns {Promise<{data, error}>}
 */
export async function getDonationsByDonor(donorId) {
  const { data, error } = await supabase
    .from('donations')
    .select(`
      *,
      project:projects(id, title, image_url, status, creator_id)
    `)
    .eq('donor_id', donorId)
    .order('created_at', { ascending: false })

  return { data, error }
}

/**
 * Récupère une donation spécifique
 * @param {string} donationId
 * @returns {Promise<{data, error}>}
 */
export async function getDonationById(donationId) {
  const { data, error } = await supabase
    .from('donations')
    .select(`
      *,
      donor:profiles!donor_id(id, display_name, avatar_url),
      project:projects(id, title, image_url, status, creator_id)
    `)
    .eq('id', donationId)
    .single()

  return { data, error }
}

/**
 * Crée une nouvelle donation
 * @param {Object} donationData
 * @param {string} donationData.project_id
 * @param {string} donationData.donor_id
 * @param {number} donationData.amount
 * @param {string} donationData.message - Optionnel
 * @returns {Promise<{data, error}>}
 */
export async function createDonation(donationData) {
  const { data, error } = await supabase
    .from('donations')
    .insert([donationData])
    .select()
    .single()

  return { data, error }
}

/**
 * Met à jour une donation existante
 * @param {string} donationId
 * @param {Object} updates
 * @returns {Promise<{data, error}>}
 */
export async function updateDonation(donationId, updates) {
  const { data, error } = await supabase
    .from('donations')
    .update(updates)
    .eq('id', donationId)
    .select()
    .single()

  return { data, error }
}

/**
 * Annule une donation (soft delete)
 * @param {string} donationId
 * @returns {Promise<{error}>}
 */
export async function cancelDonation(donationId) {
  const { error } = await supabase
    .from('donations')
    .update({ cancelled: true })
    .eq('id', donationId)

  return { error }
}

/**
 * Supprime définitivement une donation
 * @param {string} donationId
 * @returns {Promise<{error}>}
 */
export async function deleteDonation(donationId) {
  const { error } = await supabase
    .from('donations')
    .delete()
    .eq('id', donationId)

  return { error }
}

/**
 * Récupère les statistiques de donations d'un donateur
 * @param {string} donorId
 * @returns {Promise<{data, error}>}
 */
export async function getDonorStats(donorId) {
  const { data: donations, error } = await supabase
    .from('donations')
    .select('amount, project_id')
    .eq('donor_id', donorId)
    .eq('cancelled', false)

  if (error) return { data: null, error }

  const total_donated = donations.reduce((sum, donation) => sum + donation.amount, 0)
  const projects_supported = new Set(donations.map((d) => d.project_id)).size

  return {
    data: {
      total_donated,
      projects_supported,
      successful_projects: 0, // TODO: à implémenter plus tard avec le statut des projets
    },
    error: null,
  }
}

/**
 * Vérifie si un utilisateur a déjà fait un don à un projet
 * @param {string} projectId
 * @param {string} donorId
 * @returns {Promise<{data, error}>}
 */
export async function hasUserDonatedToProject(projectId, donorId) {
  const { data, error } = await supabase
    .from('donations')
    .select('id')
    .eq('project_id', projectId)
    .eq('donor_id', donorId)
    .eq('cancelled', false)
    .limit(1)

  if (error) return { data: false, error }

  return { data: data.length > 0, error: null }
}

// Export par défaut pour faciliter l'import
export const donationService = {
  getDonationsByProject,
  getDonationsByDonor,
  getDonationById,
  createDonation,
  updateDonation,
  cancelDonation,
  deleteDonation,
  getDonorStats,
  hasUserDonatedToProject,
}
