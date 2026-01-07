import { Link } from 'react-router-dom'
import { Card, CardImage, CardContent, CardFooter, CardTitle, CardDescription } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'

function getDaysRemaining(deadline) {
  const now = new Date()
  const end = new Date(deadline)
  const diffTime = end - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Terminé'
  if (diffDays === 0) return 'Dernier jour !'
  if (diffDays === 1) return '1 jour restant'
  return `${diffDays} jours restants`
}

function truncateText(text, maxLength = 100) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

function formatAmount(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount)
}

export default function ProjectCard({ project }) {
  const {
    id,
    title,
    description,
    image_url,
    goal_amount,
    deadline,
    status,
    total_collected = 0,
    donors_count = 0,
    creator
  } = project

  const daysRemaining = getDaysRemaining(deadline)

  return (
    <Link to={`/projects/${id}`} className="block">
      <Card hover>
        <CardImage
          src={image_url || `https://picsum.photos/seed/${id}/800/400`}
          alt={title}
        />
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <Badge variant={status}>{status === 'active' ? 'Actif' : status}</Badge>
            <span className="text-xs text-gray-500">{daysRemaining}</span>
          </div>

          <CardTitle>{title}</CardTitle>
          <CardDescription>{truncateText(description)}</CardDescription>

          <div className="mt-4">
            <ProgressBar
              value={total_collected}
              max={goal_amount}
              variant="success"
              showPercentage
              animated
            />
          </div>

          <div className="flex items-center justify-between text-sm mt-3">
            <span className="font-semibold text-gray-900">
              {formatAmount(total_collected)} € / {formatAmount(goal_amount)} €
            </span>
            <span className="text-gray-600">
              {donors_count} {donors_count <= 1 ? 'donateur' : 'donateurs'}
            </span>
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Avatar
                src={creator?.avatar_url}
                alt={creator?.display_name}
                size="sm"
              />
              <span className="text-sm text-gray-700">{creator?.display_name || 'Anonyme'}</span>
            </div>
            <Button variant="primary" size="sm">
              Voir le projet
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
