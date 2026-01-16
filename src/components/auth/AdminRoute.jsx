import { Navigate } from 'react-router-dom'
import { useAdmin } from '../../hooks/useAdmin'
import { Skeleton } from '../ui/Skeleton'
import { Container } from '../layout/Container'

/**
 * Route protégée accessible uniquement aux admins
 */
export function AdminRoute({ children }) {
  const { isAdmin, loading } = useAdmin()

  // État de chargement
  if (loading) {
    return (
      <Container data-testid="admin-route-loading" className="py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </Container>
    )
  }

  // Si pas admin, rediriger vers la page d'accueil
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  // Si admin, rendre les enfants
  return children
}
