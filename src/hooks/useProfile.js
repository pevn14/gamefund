import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import * as profileService from '../services/profileService'

export function useProfile() {
  const { user, refreshProfile: refreshAuthProfile } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Charger le profil au montage
  useEffect(() => {
    if (user?.id) {
      loadProfile()
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [user])

  async function loadProfile() {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await profileService.getProfile(user.id)

    if (fetchError) {
      setError(fetchError)
    } else {
      setProfile(data)
    }

    setLoading(false)
  }

  /**
   * Mettre à jour le profil (display_name, bio)
   */
  async function updateProfile(profileData) {
    if (!user?.id) {
      setError(new Error('User not authenticated'))
      return { data: null, error: new Error('User not authenticated') }
    }

    setLoading(true)
    setError(null)

    const { data, error: updateError } = await profileService.updateProfile(
      user.id,
      profileData
    )

    if (updateError) {
      setError(updateError)
      setLoading(false)
      return { data: null, error: updateError }
    }

    setProfile(data)
    // Rafraîchir le profil dans le contexte Auth pour mettre à jour le Header
    if (refreshAuthProfile) {
      await refreshAuthProfile()
    }
    setLoading(false)
    return { data, error: null }
  }

  /**
   * Upload avatar
   */
  async function uploadAvatar(file) {
    if (!user?.id) {
      setError(new Error('User not authenticated'))
      return { data: null, error: new Error('User not authenticated') }
    }

    setLoading(true)
    setError(null)

    const { data, error: uploadError } = await profileService.uploadAvatar(
      user.id,
      file
    )

    if (uploadError) {
      setError(uploadError)
      setLoading(false)
      return { data: null, error: uploadError }
    }

    setProfile(data)
    // Rafraîchir le profil dans le contexte Auth pour mettre à jour le Header
    if (refreshAuthProfile) {
      await refreshAuthProfile()
    }
    setLoading(false)
    return { data, error: null }
  }

  /**
   * Supprimer l'avatar
   */
  async function deleteAvatar() {
    if (!user?.id) {
      setError(new Error('User not authenticated'))
      return { data: null, error: new Error('User not authenticated') }
    }

    setLoading(true)
    setError(null)

    const { data, error: deleteError } = await profileService.deleteAvatar(
      user.id,
      profile?.avatar_url
    )

    if (deleteError) {
      setError(deleteError)
      setLoading(false)
      return { data: null, error: deleteError }
    }

    setProfile(data)
    // Rafraîchir le profil dans le contexte Auth pour mettre à jour le Header
    if (refreshAuthProfile) {
      await refreshAuthProfile()
    }
    setLoading(false)
    return { data, error: null }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    refresh: loadProfile,
  }
}
