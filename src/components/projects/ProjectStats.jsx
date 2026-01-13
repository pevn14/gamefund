import { TrendingUp, Users, Target, Calendar } from 'lucide-react'

export default function ProjectStats({
  goal,
  totalCollected,
  donorsCount,
  daysRemaining,
  variant = 'detailed'
}) {
  // Calculer le pourcentage
  const percentage = Math.min(Math.round((totalCollected / goal) * 100), 100)

  // Calculer le pourcentage restant
  const remainingAmount = Math.max(goal - totalCollected, 0)

  // Format compact pour les cartes de projets
  if (variant === 'compact') {
    return (
      <div data-testid="project-stats-compact" className="space-y-3">
        {/* Barre de progression */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-2xl font-bold text-gray-900">
              {totalCollected.toLocaleString('fr-FR')}€
            </span>
            <span className="text-sm text-gray-600">
              sur {goal.toLocaleString('fr-FR')}€
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Stats en ligne */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Users size={14} />
            <span>{donorsCount} donateur{donorsCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar size={14} />
            <span>{daysRemaining} jour{daysRemaining !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    )
  }

  // Format détaillé pour la page de détail du projet
  return (
    <div data-testid="project-stats-detailed" className="space-y-6">
      {/* Montant collecté */}
      <div>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-4xl font-bold text-gray-900">
            {totalCollected.toLocaleString('fr-FR')}€
          </span>
          <span className="text-lg text-gray-600">
            collectés sur {goal.toLocaleString('fr-FR')}€
          </span>
        </div>

        {/* Barre de progression */}
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Pourcentage */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-medium text-primary-700">
            {percentage}% de l'objectif atteint
          </span>
          {remainingAmount > 0 && (
            <span className="text-sm text-gray-600">
              {remainingAmount.toLocaleString('fr-FR')}€ restant{remainingAmount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Nombre de donateurs */}
        <div
          data-testid="project-stats-donors"
          className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-500 rounded-full p-2">
              <Users className="text-white" size={20} />
            </div>
            <span className="text-sm font-medium text-blue-900">Contributeurs</span>
          </div>
          <p className="text-3xl font-bold text-blue-900">
            {donorsCount}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            {donorsCount === 0
              ? 'Soyez le premier donateur !'
              : `${donorsCount} personne${donorsCount !== 1 ? 's ont' : ' a'} contribué`}
          </p>
        </div>

        {/* Jours restants */}
        <div
          data-testid="project-stats-days"
          className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-500 rounded-full p-2">
              <Calendar className="text-white" size={20} />
            </div>
            <span className="text-sm font-medium text-purple-900">Temps restant</span>
          </div>
          <p className="text-3xl font-bold text-purple-900">
            {daysRemaining}
          </p>
          <p className="text-xs text-purple-700 mt-1">
            jour{daysRemaining !== 1 ? 's' : ''} pour atteindre l'objectif
          </p>
        </div>

        {/* Objectif */}
        <div
          data-testid="project-stats-goal"
          className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-500 rounded-full p-2">
              <Target className="text-white" size={20} />
            </div>
            <span className="text-sm font-medium text-green-900">Objectif</span>
          </div>
          <p className="text-3xl font-bold text-green-900">
            {goal.toLocaleString('fr-FR')}€
          </p>
          <p className="text-xs text-green-700 mt-1">
            {percentage >= 100
              ? 'Objectif atteint !'
              : `${100 - percentage}% restant à collecter`}
          </p>
        </div>
      </div>

      {/* Message de succès si objectif atteint */}
      {percentage >= 100 && (
        <div
          data-testid="project-stats-success"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 flex items-center gap-3"
        >
          <TrendingUp size={24} />
          <div>
            <p className="font-bold text-lg">🎉 Objectif atteint !</p>
            <p className="text-sm text-green-100">
              Ce projet a dépassé son objectif de financement grâce à {donorsCount} contributeur{donorsCount !== 1 ? 's' : ''}.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
