import { supabase } from './supabase'

/**
 * Inscription d'un nouvel utilisateur
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<{user, error}>}
 */
export async function signUp(email, password, displayName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  })

  if (error) return { user: null, error }

  // Le profil sera créé automatiquement via le trigger handle_new_user
  return { user: data.user, error: null }
}

/**
 * Connexion d'un utilisateur existant
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user, error}>}
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { user: null, error }

  return { user: data.user, error: null }
}

/**
 * Déconnexion de l'utilisateur actuel
 * @returns {Promise<{error}>}
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Récupère la session active
 * @returns {Promise<{session, error}>}
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { session: data.session, error }
}

/**
 * Récupère l'utilisateur actuellement connecté
 * @returns {Promise<{user, error}>}
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser()
  return { user: data.user, error }
}

/**
 * Récupère le profil complet de l'utilisateur
 * @param {string} userId
 * @returns {Promise<{profile, error}>}
 */
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return { profile: data, error }
}

/**
 * Met à jour le profil utilisateur
 * @param {string} userId
 * @param {Object} updates - Champs à mettre à jour
 * @returns {Promise<{profile, error}>}
 */
export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { profile: data, error }
}

/**
 * Réinitialisation du mot de passe
 * @param {string} email
 * @returns {Promise<{error}>}
 */
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  return { error }
}

/**
 * Mise à jour du mot de passe
 * @param {string} newPassword
 * @returns {Promise<{error}>}
 */
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  return { error }
}
