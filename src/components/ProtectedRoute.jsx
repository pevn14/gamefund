import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * Redirige vers /login si l'utilisateur n'est pas connecté
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Rediriger vers login si non authentifié
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Afficher le contenu si authentifié
  return children
}
