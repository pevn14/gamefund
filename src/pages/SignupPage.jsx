import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardTitle, CardDescription } from '../components/ui/Card'
import * as authService from '../services/authService'

export default function SignupPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    // Validation
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)

    try {
      const { error: signUpError } = await authService.signUp(
        email,
        password,
        displayName
      )

      setLoading(false)

      if (signUpError) {
        setError(signUpError.message)
      } else {
        setMessage('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.')
        // Redirection après 2 secondes
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (err) {
      setLoading(false)
      setError(err.message || 'Une erreur est survenue')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Inscription
          </h1>
          <p className="text-gray-600">
            Créez votre compte GameFund
          </p>
        </div>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div data-testid="error-message" className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div data-testid="success-message" className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                  {message}
                </div>
              )}

              <Input
                data-testid="signup-display-name-input"
                label="Nom d'affichage"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                autoComplete="name"
              />

              <Input
                data-testid="signup-email-input"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <Input
                data-testid="signup-password-input"
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                helperText="Minimum 6 caractères"
              />

              <Input
                data-testid="signup-confirm-password-input"
                label="Confirmer le mot de passe"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />

              <Button
                data-testid="signup-submit-button"
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
              >
                S'inscrire
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Déjà un compte ?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
