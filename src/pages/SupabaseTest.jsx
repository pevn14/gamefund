import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { supabase } from '../services/supabase'
import * as authService from '../services/authService'

export default function SupabaseTest() {
  const { user, profile, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [dbConnected, setDbConnected] = useState(null)
  const [dbTesting, setDbTesting] = useState(false)

  // Test de connexion à la base de données au chargement
  useEffect(() => {
    testDatabaseConnection()
  }, [])

  async function testDatabaseConnection() {
    setDbTesting(true)
    setError('')
    setMessage('')

    try {
      // Test 1: Vérifier que le client Supabase est initialisé
      if (!supabase) {
        throw new Error('Client Supabase non initialisé')
      }

      // Test 2: Faire un vrai appel réseau à Supabase pour vérifier la connexion
      // On teste avec une requête simple qui nécessite une vraie connexion
      const { data, error: healthError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true })

      if (healthError) {
        console.error('Erreur de connexion:', healthError)
        setDbConnected(false)
        setError(`Erreur: ${healthError.message}`)
        return
      }

      // Si on arrive ici, la connexion à Supabase fonctionne
      setDbConnected(true)
      setMessage('✅ Connexion à Supabase réussie ! Client configuré correctement.')

      console.log('✅ Supabase connecté')

    } catch (err) {
      console.error('Erreur:', err)
      setDbConnected(false)
      setError(`Erreur: ${err.message}`)
    } finally {
      setDbTesting(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    const { user: newUser, error: signUpError } = await authService.signUp(
      email,
      password,
      displayName
    )

    if (signUpError) {
      setError(signUpError.message)
    } else {
      setMessage('Inscription réussie ! Vérifiez votre email.')
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    const { user: loggedUser, error: signInError } = await authService.signIn(
      email,
      password
    )

    if (signInError) {
      setError(signInError.message)
    } else {
      setMessage('Connexion réussie !')
    }
  }

  const handleSignOut = async () => {
    setMessage('')
    setError('')

    const { error: signOutError } = await authService.signOut()

    if (signOutError) {
      setError(signOutError.message)
    } else {
      setMessage('Déconnexion réussie !')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Test Supabase - GameFund
        </h1>
        <p className="text-gray-600 mb-8">
          Page de test pour vérifier l'intégration Supabase
        </p>

        {/* Test connexion DB */}
        <Card className="mb-6">
          <CardContent>
            <CardTitle>Test de connexion Supabase</CardTitle>
            <div className="space-y-2">
              {dbTesting ? (
                <Badge variant="info">Test en cours...</Badge>
              ) : dbConnected === true ? (
                <Badge variant="success">✅ Connecté à Supabase</Badge>
              ) : dbConnected === false ? (
                <Badge variant="error">❌ Échec de connexion</Badge>
              ) : (
                <Badge variant="default">En attente...</Badge>
              )}
              <div className="mt-2">
                <Button onClick={testDatabaseConnection} size="sm" variant="outline">
                  Retester la connexion
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status de connexion */}
        <Card className="mb-6">
          <CardContent>
            <CardTitle>État de connexion utilisateur</CardTitle>
            {loading ? (
              <Badge variant="info">Chargement...</Badge>
            ) : user ? (
              <div className="space-y-2">
                <Badge variant="success">Connecté</Badge>
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>User ID:</strong> {user.id}
                  </p>
                  {profile && (
                    <>
                      <p>
                        <strong>Nom d'affichage:</strong> {profile.display_name}
                      </p>
                      <p>
                        <strong>Rôle:</strong> {profile.role}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Badge variant="error">Non connecté</Badge>
            )}
          </CardContent>
        </Card>

        {/* Messages */}
        {message && (
          <div data-testid="success-message" className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div data-testid="error-message" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Formulaires */}
        {!user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inscription */}
            <Card>
              <CardContent>
                <CardTitle>Inscription</CardTitle>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <Input
                    data-testid="signup-display-name-input"
                    label="Nom d'affichage"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                  <Input
                    data-testid="signup-email-input"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    data-testid="signup-password-input"
                    label="Mot de passe"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button data-testid="signup-submit-button" type="submit" variant="primary" className="w-full">
                    S'inscrire
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Connexion */}
            <Card>
              <CardContent>
                <CardTitle>Connexion</CardTitle>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <Input
                    data-testid="signin-email-input"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    data-testid="signin-password-input"
                    label="Mot de passe"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button data-testid="signin-submit-button" type="submit" variant="primary" className="w-full">
                    Se connecter
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent>
              <CardTitle>Actions</CardTitle>
              <Button data-testid="signout-button" onClick={handleSignOut} variant="danger">
                Se déconnecter
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Informations de test */}
        <Card className="mt-6">
          <CardContent>
            <CardTitle>Informations</CardTitle>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Services disponibles:</strong>
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>✅ Client Supabase initialisé</li>
                <li>✅ AuthService (signup, signin, signout)</li>
                <li>✅ ProjectService (CRUD projets)</li>
                <li>✅ DonationService (CRUD donations)</li>
                <li>✅ useAuth hook avec AuthContext</li>
              </ul>
              <p className="mt-4">
                <strong>Configuration:</strong>
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>URL Supabase: {import.meta.env.VITE_SUPABASE_URL ? '✅ Configurée' : '❌ Manquante'}</li>
                <li>Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurée' : '❌ Manquante'}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
