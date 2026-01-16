import { useAuth } from './useAuth'

/**
 * Hook pour vérifier si l'utilisateur connecté est un admin
 * @returns {{ isAdmin: boolean, loading: boolean }}
 */
export function useAdmin() {
  const { profile, loading: authLoading } = useAuth()

  const isAdmin = profile?.role === 'admin'

  return {
    isAdmin,
    loading: authLoading
  }
}
