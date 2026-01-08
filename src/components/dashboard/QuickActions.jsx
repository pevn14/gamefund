import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Plus, FolderOpen, User } from 'lucide-react'

/**
 * Composant d'actions rapides pour le dashboard créateur
 * Affiche les liens principaux vers les pages importantes
 */
export function QuickActions() {
  const navigate = useNavigate()

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">Actions rapides</h2>

        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full justify-start"
            onClick={() => navigate('/projects/create')}
          >
            <Plus size={20} />
            Créer un nouveau projet
          </Button>

          <Button
            variant="outline"
            size="md"
            className="w-full justify-start"
            onClick={() => navigate('/dashboard/projects')}
          >
            <FolderOpen size={18} />
            Gérer mes projets
          </Button>

          <Button
            variant="outline"
            size="md"
            className="w-full justify-start"
            onClick={() => navigate('/profile')}
          >
            <User size={18} />
            Modifier mon profil
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
