import { supabase } from './supabase'

/**
 * Récupère toutes les donations d'un projet
 * @param {string} projectId
 * @returns {Promise<{donations, error}>}
 */
export async function getDonationsByProject(projectId) {
  const { data, error } = await supabase
    .from('donations')
    .select(`
      *,
      donor:profiles!donor_id(id, display_name, avatar_url)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  return { donations: data, error }
}

/**
 * Récupère toutes les donations d'un donateur
 * @param {string} donorId
 * @returns {Promise<{donations, error}>}
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

  return { donations: data, error }
}

/**
 * Récupère une donation spécifique
 * @param {string} donationId
 * @returns {Promise<{donation, error}>}
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

  return { donation: data, error }
}

/**
 * Crée une nouvelle donation
 * @param {Object} donationData
 * @param {string} donationData.project_id
 * @param {string} donationData.donor_id
 * @param {number} donationData.amount
 * @param {string} donationData.message - Optionnel
 * @returns {Promise<{donation, error}>}
 */
export async function createDonation(donationData) {
  const { data, error } = await supabase
    .from('donations')
    .insert([donationData])
    .select()
    .single()

  return { donation: data, error }
}

/**
 * Met à jour une donation existante
 * @param {string} donationId
 * @param {Object} updates
 * @returns {Promise<{donation, error}>}
 */
export async function updateDonation(donationId, updates) {
  const { data, error } = await supabase
    .from('donations')
    .update(updates)
    .eq('id', donationId)
    .select()
    .single()

  return { donation: data, error }
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
 * @returns {Promise<{stats, error}>}
 */
export async function getDonorStats(donorId) {
  const { data, error } = await supabase
    .from('donations')
    .select('amount, project_id')
    .eq('donor_id', donorId)
    .eq('cancelled', false)

  if (error) return { stats: null, error }

  const totalDonated = data.reduce((sum, donation) => sum + donation.amount, 0)
  const projectsSupported = new Set(data.map((d) => d.project_id)).size

  return {
    stats: {
      totalDonated,
      projectsSupported,
      donationsCount: data.length,
    },
    error: null,
  }
}

/**
 * Vérifie si un utilisateur a déjà fait un don à un projet
 * @param {string} projectId
 * @param {string} donorId
 * @returns {Promise<{hasDonated, error}>}
 */
export async function hasUserDonatedToProject(projectId, donorId) {
  const { data, error } = await supabase
    .from('donations')
    .select('id')
    .eq('project_id', projectId)
    .eq('donor_id', donorId)
    .eq('cancelled', false)
    .limit(1)

  if (error) return { hasDonated: false, error }

  return { hasDonated: data.length > 0, error: null }
}
