import { Card, CardContent } from '../ui/Card'

/**
 * Composant de carte de statistique
 * Affiche une métrique avec icône, label et valeur
 */
export function StatsCard({ icon, label, value, trend, variant = 'default' }) {
  // Couleurs de fond selon le variant
  const variantColors = {
    default: 'bg-gray-100',
    primary: 'bg-primary-100',
    success: 'bg-green-100',
    warning: 'bg-amber-100'
  }

  // Couleurs d'icône selon le variant
  const iconColors = {
    default: 'text-gray-600',
    primary: 'text-primary-600',
    success: 'text-green-600',
    warning: 'text-amber-600'
  }

  const bgColor = variantColors[variant] || variantColors.default
  const iconColor = iconColors[variant] || iconColors.default

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${bgColor}`}>
              <div className={iconColor}>
                {icon}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>

          {trend && (
            <div className="text-right">
              <div className={`text-sm font-medium ${trend.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {trend.label}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
