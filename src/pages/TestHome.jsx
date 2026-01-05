import { Link } from 'react-router-dom'
import { Card, CardContent, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export default function TestHome() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          GameFund - Pages de Test
        </h1>
        <p className="text-gray-600 mb-8">
          Environnement de développement
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Test Supabase */}
          <Card>
            <CardContent>
              <CardTitle>Test Supabase</CardTitle>
              <p className="text-sm text-gray-600 mb-4">
                Test de connexion, authentification (signup, signin, signout)
              </p>
              <Link to="/supabase-test">
                <Button variant="primary" className="w-full">
                  Tester Supabase
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
