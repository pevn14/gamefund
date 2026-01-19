import { Link } from 'react-router-dom'
import { MainLayout } from '../../components/layout/MainLayout'
import { Container } from '../../components/layout/Container'
import { HelpCircle, ArrowLeft } from 'lucide-react'
import { Button } from '../../components/ui/Button'

export function FaqPage() {
  return (
    <MainLayout>
      <Container>
        <div className="py-16 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-primary-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            FAQ
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Vous avez des questions sur GameFund ? Cette page regroupera bientôt les réponses aux questions les plus fréquentes.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-md mx-auto mb-8">
            <p className="text-amber-800 text-sm">
              Page en construction. FAQ à venir prochainement.
            </p>
          </div>

          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </Container>
    </MainLayout>
  )
}
