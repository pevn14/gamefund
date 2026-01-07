import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Card, CardContent, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { supabase } from '../services/supabase'
import * as authService from '../services/authService'

export default function TestHome() {
  const { user, profile, loading } = useAuth()
  const [dbConnected, setDbConnected] = useState(null)
  const [dbTesting, setDbTesting] = useState(false)

  // Test de connexion à la base de données au chargement
  useEffect(() => {
    testDatabaseConnection()
  }, [])

  async function testDatabaseConnection() {
    setDbTesting(true)

    try {
      // Test 1: Vérifier que le client Supabase est initialisé
      if (!supabase) {
        throw new Error('Client Supabase non initialisé')
      }

      // Test 2: Faire un vrai appel réseau à Supabase pour vérifier la connexion
      const { data, error: healthError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true })

      if (healthError) {
        console.error('Erreur de connexion:', healthError)
        setDbConnected(false)
      } else {
        setDbConnected(true)
      }
    } catch (err) {
      console.error('Erreur:', err)
      setDbConnected(false)
    } finally {
      setDbTesting(false)
    }
  }

  const handleSignOut = async () => {
    await authService.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            GameFund - Pages de Test
          </h1>
          <p className="text-gray-600 mb-6">
            Environnement de développement
          </p>

          {/* Connexion Supabase */}
          <Card className="bg-white mb-4">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Connexion Supabase</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    État de la connexion au backend
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {dbTesting ? (
                    <Badge data-testid="supabase-status-testing" variant="info">Test en cours...</Badge>
                  ) : dbConnected === true ? (
                    <Badge data-testid="supabase-status-connected" variant="success">✅ Connecté</Badge>
                  ) : dbConnected === false ? (
                    <Badge data-testid="supabase-status-error" variant="error">❌ Échec</Badge>
                  ) : (
                    <Badge data-testid="supabase-status-waiting" variant="default">En attente...</Badge>
                  )}
                  <Button data-testid="supabase-retest-button" onClick={testDatabaseConnection} size="sm" variant="outline">
                    Retester
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statut utilisateur */}
          <Card className="bg-white">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Utilisateur</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    État de l'authentification
                  </p>
                </div>
                <div className="text-right">
                  {loading ? (
                    <Badge data-testid="user-status-loading" variant="info">Chargement...</Badge>
                  ) : user ? (
                    <div className="space-y-2">
                      <Badge data-testid="user-status-connected" variant="success">✅ Connecté</Badge>
                      <div className="text-sm text-gray-600">
                        <p data-testid="user-display-name"><strong>{profile?.display_name || 'Utilisateur'}</strong></p>
                        <p data-testid="user-email" className="text-xs">{user.email}</p>
                      </div>
                      <Button
                        data-testid="signout-button"
                        onClick={handleSignOut}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        Se déconnecter
                      </Button>
                    </div>
                  ) : (
                    <Badge data-testid="user-status-disconnected" variant="default">Non connecté</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Test Composants UI */}
          <Card>
            <CardContent>
              <CardTitle>Composants UI</CardTitle>
              <p className="text-sm text-gray-600 mb-4">
                Galerie de tous les composants React (Button, Card, Badge, Input, etc.)
              </p>
              <Link to="/components">
                <Button variant="primary" className="w-full">
                  Voir les composants
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Connexion */}
          <Card>
            <CardContent>
              <CardTitle>Connexion</CardTitle>
              <p className="text-sm text-gray-600 mb-4">
                Page de connexion avec formulaire email/mot de passe
              </p>
              <Link to="/login">
                <Button variant="secondary" className="w-full">
                  Se connecter
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Inscription */}
          <Card>
            <CardContent>
              <CardTitle>Inscription</CardTitle>
              <p className="text-sm text-gray-600 mb-4">
                Page d'inscription pour créer un nouveau compte
              </p>
              <Link to="/signup">
                <Button variant="secondary" className="w-full">
                  S'inscrire
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Ces pages sont uniquement pour le développement.
            En production, l'application affichera la vraie interface utilisateur.
          </p>
        </div>
      </div>
    </div>
  )
}
