import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter } from '../ui/Card'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { FolderOpen } from 'lucide-react'

export function CreatorCard({ creator }) {
  const {
    id,
    display_name,
    avatar_url,
    bio,
    projects_count = 0,
  } = creator

  return (
    <Card hover data-testid="creator-card">
      <CardContent className="p-6">
        {/* Avatar et info */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar
            src={avatar_url}
            alt={display_name}
            size="lg"
            data-testid="creator-card-avatar"
          />
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-lg text-gray-900 truncate"
              data-testid="creator-card-name"
            >
              {display_name || 'Anonyme'}
            </h3>
            <div
              className="flex items-center gap-1 text-sm text-gray-600 mt-1"
              data-testid="creator-card-projects-count"
            >
              <FolderOpen className="w-4 h-4" />
              <span>
                {projects_count} projet{projects_count > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <p
            className="text-sm text-gray-700 line-clamp-3"
            data-testid="creator-card-bio"
          >
            {bio}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Link to={`/?creator=${id}`} className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            data-testid="creator-card-view-button"
          >
            Voir les projets
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
