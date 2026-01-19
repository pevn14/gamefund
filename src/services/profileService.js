import { supabase } from './supabase'

/**
 * Récupérer un profil utilisateur
 */
export async function getProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching profile:', error)
    return { data: null, error }
  }
}

/**
 * Mettre à jour le profil (display_name, bio)
 */
export async function updateProfile(userId, { display_name, bio }) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        display_name,
        bio,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { data: null, error }
  }
}

/**
 * Upload avatar vers Supabase Storage
 */
export async function uploadAvatar(userId, file) {
  try {
    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`

    // Upload vers Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) throw uploadError

    // Récupérer l'URL publique
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(fileName)

    // Mettre à jour le profil avec la nouvelle URL
    const { data, error } = await supabase
      .from('profiles')
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return { data: null, error }
  }
}

/**
 * Supprimer l'avatar
 */
export async function deleteAvatar(userId, avatarUrl) {
  try {
    // Extraire le chemin du fichier depuis l'URL
    if (avatarUrl) {
      const path = avatarUrl.split('/avatars/')[1]
      if (path) {
        await supabase.storage.from('avatars').remove([path])
      }
    }

    // Mettre à jour le profil pour retirer l'avatar_url
    const { data, error } = await supabase
      .from('profiles')
      .update({
        avatar_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error deleting avatar:', error)
    return { data: null, error }
  }
}

/**
 * Récupérer tous les créateurs (utilisateurs avec au moins 1 projet)
 */
export async function getCreators() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
        id,
        display_name,
        avatar_url,
        bio,
        created_at,
        projects:projects(count)
      `
      )
      .eq('is_active', true)
      .gt('projects.count', 0)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Reformater les données pour avoir projects_count
    const creators = data?.map((creator) => ({
      ...creator,
      projects_count: creator.projects?.[0]?.count || 0,
    }))

    return { data: creators, error: null }
  } catch (error) {
    console.error('Error fetching creators:', error)
    return { data: null, error }
  }
}

/**
 * Récupérer les créateurs avec le nombre de projets (méthode alternative)
 */
export async function getCreatorsWithProjects() {
  try {
    // Requête RPC ou requête manuelle
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url, bio, created_at')
      .eq('is_active', true)

    if (profilesError) throw profilesError

    // Pour chaque profil, compter les projets
    const creatorsPromises = profiles.map(async (profile) => {
      const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', profile.id)

      return {
        ...profile,
        projects_count: count || 0,
      }
    })

    const creators = await Promise.all(creatorsPromises)

    // Filtrer ceux qui ont au moins 1 projet
    const creatorsWithProjects = creators
      .filter((c) => c.projects_count > 0)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return { data: creatorsWithProjects, error: null }
  } catch (error) {
    console.error('Error fetching creators with projects:', error)
    return { data: null, error }
  }
}
