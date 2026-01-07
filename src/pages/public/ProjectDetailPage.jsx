import { useParams, Link } from 'react-router-dom'
import { MainLayout } from '../../components/layout/MainLayout'
import { Container } from '../../components/layout/Container'
import { Button } from '../../components/ui/Button'

export default function ProjectDetailPage() {
  const { id } = useParams()

  return (
    <MainLayout>
      <div className="bg-gray-50 py-12">
        <Container>
          <div className="max-w-3xl mx-auto text-center py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Page en construction
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              La page de détail du projet sera disponible dans la Phase 7.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              ID du projet: <code className="bg-gray-200 px-2 py-1 rounded">{id}</code>
            </p>
            <Link to="/">
              <Button variant="primary">
                Retour à la galerie
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </MainLayout>
  )
}
