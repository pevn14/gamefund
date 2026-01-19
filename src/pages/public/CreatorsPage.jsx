import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MainLayout } from '../../components/layout/MainLayout'
import { Container } from '../../components/layout/Container'
import { CreatorsGrid } from '../../components/creators/CreatorsGrid'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { getCreatorsWithProjects } from '../../services/profileService'
import { Users, LogIn } from 'lucide-react'

export function CreatorsPage() {
  const { user } = useAuth()
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      loadCreators()
    } else {
      setLoading(false)
    }
  }, [user])

  async function loadCreators() {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await getCreatorsWithProjects()

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setCreators(data || [])
    }

    setLoading(false)
  }

  return (
    <MainLayout>
      <Container>
        <div className="py-12" data-testid="creators-page">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary-600" />
            </div>

            <h1
              className="text-3xl font-bold text-gray-900 mb-4"
              data-testid="creators-page-title"
            >
              Nos Créateurs
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez les créateurs de jeux vidéo qui utilisent GameFund pour financer leurs projets.
            </p>
          </div>

          {/* Contenu */}
          {!user ? (
            /* Non connecté : Message de connexion */
            <div
              className="max-w-md mx-auto text-center py-12"
              data-testid="creators-page-login-message"
            >
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                <p className="text-gray-700 mb-6">
                  Connectez-vous pour découvrir tous les créateurs de la plateforme et suivre leurs projets.
                </p>

                <div className="space-y-3">
                  <Link to="/login" className="block">
                    <Button
                      variant="primary"
                      className="w-full"
                      data-testid="creators-page-login-button"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Se connecter
                    </Button>
                  </Link>

                  <p className="text-sm text-gray-600">
                    Pas encore de compte ?{' '}
                    <Link
                      to="/signup"
                      className="text-primary-600 hover:underline"
                      data-testid="creators-page-signup-link"
                    >
                      S'inscrire
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Connecté : Liste des créateurs */
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <CreatorsGrid creators={creators} loading={loading} />
            </>
          )}
        </div>
      </Container>
    </MainLayout>
  )
}
