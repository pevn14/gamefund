import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogIn, User, LayoutDashboard, Menu, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import { Container } from './Container'

export function Header() {
  // Pour l'instant, pas d'authentification (sera ajouté en Phase 5)
  const user = null
  const profile = null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              GameFund
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/projects"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Projets
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Auth buttons Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => console.log('Login')}
                >
                  <LogIn size={18} />
                  Connexion
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => console.log('Signup')}
                >
                  Inscription
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => console.log('Dashboard')}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Button>

                <button
                  onClick={() => console.log('Profile')}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Avatar
                    src={profile?.avatar_url}
                    alt={profile?.display_name || user.email}
                    size="sm"
                  />
                </button>
              </div>
            )}
          </div>

          {/* Burger Menu Button (Mobile only) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-3">
              <Link
                to="/projects"
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Projets
              </Link>

              {user && (
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Auth Buttons */}
            <div className="flex flex-col gap-3 pt-3 border-t border-gray-200">
              {!user ? (
                <>
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => {
                      console.log('Login')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full"
                  >
                    <LogIn size={18} />
                    Connexion
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      console.log('Signup')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full"
                  >
                    Inscription
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Avatar
                    src={profile?.avatar_url}
                    alt={profile?.display_name || user.email}
                    size="sm"
                  />
                  <span className="font-medium text-gray-900">
                    {profile?.display_name || user.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
