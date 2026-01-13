import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, LayoutDashboard, Menu, X, LogOut, FolderOpen, Heart, HandHeart } from 'lucide-react'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import { Container } from './Container'
import { useAuth } from '../../hooks/useAuth'

export function Header() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
    setMobileMenuOpen(false)
  }

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

          {/* Spacer pour pousser tout à droite */}
          <div className="flex-1"></div>

          {/* Auth buttons Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login">
                  <Button data-testid="header-login-button" variant="ghost" size="sm">
                    <LogIn size={18} />
                    Connexion
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button data-testid="header-signup-button" variant="primary" size="sm">
                    Inscription
                  </Button>
                </Link>
              </>
            ) : (
              <>
                 <Link to="/dashboard/projects">
                  <Button data-testid="header-projects-link" variant="ghost" size="sm">
                    <FolderOpen size={18} />
                    Mes Projets
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button data-testid="header-dashboard-link" variant="ghost" size="sm">
                    <LayoutDashboard size={18} />
                    Dashboard Createur
                  </Button>
                </Link>
                <Link to="/donor-dashboard">
                  <Button data-testid="header-donor-dashboard-link" variant="ghost" size="sm">
                    <HandHeart size={18} />
                    Dashboard Donateur
                  </Button>
                </Link>

                <div data-testid="header-user-info" className="flex items-center gap-2">
                  <Avatar
                    src={profile?.avatar_url}
                    alt={profile?.display_name || user.email}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {profile?.display_name || user.email}
                  </span>
                </div>

                <Button
                  data-testid="header-logout-button"
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Déconnexion
                </Button>
              </>
            )}
          </div>

          {/* Burger Menu Button (Mobile only) */}
          <button
            data-testid="header-mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div data-testid="header-mobile-menu" className="md:hidden border-t border-gray-200 py-4 space-y-4">
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-3">
              {user && (
                <>
                  <Link
                    data-testid="header-mobile-dashboard-link"
                    to="/dashboard"
                    className="text-gray-600 hover:text-primary-600 font-medium transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    data-testid="header-mobile-projects-link"
                    to="/dashboard/projects"
                    className="text-gray-600 hover:text-primary-600 font-medium transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mes Projets
                  </Link>
                  <Link
                    data-testid="header-mobile-donor-dashboard-link"
                    to="/donor-dashboard"
                    className="text-gray-600 hover:text-primary-600 font-medium transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard Donateur
                  </Link>
                </>
              )}
            </nav>

            {/* Auth Buttons */}
            <div className="flex flex-col gap-3 pt-3 border-t border-gray-200">
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button data-testid="header-mobile-login-button" variant="ghost" size="md" className="w-full">
                      <LogIn size={18} />
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button data-testid="header-mobile-signup-button" variant="primary" size="md" className="w-full">
                      Inscription
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div data-testid="header-mobile-user-info" className="flex items-center gap-3 pb-3">
                    <Avatar
                      src={profile?.avatar_url}
                      alt={profile?.display_name || user.email}
                      size="sm"
                    />
                    <span className="font-medium text-gray-900">
                      {profile?.display_name || user.email}
                    </span>
                  </div>
                  <Button
                    data-testid="header-mobile-logout-button"
                    variant="ghost"
                    size="md"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    <LogOut size={18} />
                    Déconnexion
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
