import { Link } from 'react-router-dom'
import { Container } from './Container'
import { Github, Twitter, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-24">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg" />
                <span className="text-xl font-bold text-white">GameFund</span>
              </div>
              <p className="text-sm text-gray-400">
                Soutenez les créateurs de jeux vidéo de demain.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Découvrir</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/projects" className="hover:text-white transition-colors">Projets</Link></li>
                <li><Link to="/creators" className="hover:text-white transition-colors">Créateurs</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">À propos</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">Notre mission</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Suivez-nous</h3>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors">
                  <Github size={20} />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-500">
            © {new Date().getFullYear()} GameFund. Tous droits réservés.
          </div>
        </div>
      </Container>
    </footer>
  )
}
