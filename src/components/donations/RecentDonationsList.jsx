import { useNavigate } from 'react-router-dom'
import { Avatar } from '../ui/Avatar'
import { Heart, Calendar, ArrowRight } from 'lucide-react'

export default function RecentDonationsList({ donations }) {
  const navigate = useNavigate()

  if (!donations || donations.length === 0) {
    return (
      <div
        data-testid="recent-donations-empty"
        className="text-center py-8 text-gray-500"
      >
        <Heart className="mx-auto mb-3 text-gray-400" size={40} />
        <p>Aucune donation récente</p>
      </div>
    )
  }

  return (
    <div data-testid="recent-donations-list" className="space-y-3">
      {donations.map((donation) => {
        const date = new Date(donation.created_at).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short'
        })

        return (
          <div
            key={donation.id}
            data-testid="recent-donation-item"
            className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            onClick={() => navigate(`/projects/${donation.project_id}`)}
          >
            {/* Icône donation */}
            <div className="bg-primary-100 rounded-full p-2 flex-shrink-0">
              <Heart className="text-primary-600" size={18} />
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {donation.project?.title || 'Projet inconnu'}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Calendar size={12} />
                <span>{date}</span>
              </div>
            </div>

            {/* Montant */}
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-primary-700">
                {donation.amount}€
              </p>
            </div>

            {/* Flèche */}
            <ArrowRight className="text-gray-400 flex-shrink-0" size={16} />
          </div>
        )
      })}
    </div>
  )
}
