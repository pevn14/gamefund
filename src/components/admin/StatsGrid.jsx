/**
 * Grille de statistiques pour le dashboard admin
 * Design minimaliste et dense
 */
export function StatsGrid({ stats }) {
  const statsData = [
    {
      label: 'Utilisateurs',
      value: stats?.totalUsers || 0,
      testId: 'admin-stat-users',
    },
    {
      label: 'Projets',
      value: stats?.totalProjects || 0,
      testId: 'admin-stat-projects',
    },
    {
      label: 'Projets actifs',
      value: stats?.activeProjects || 0,
      testId: 'admin-stat-active-projects',
    },
    {
      label: 'Donations',
      value: stats?.totalDonations || 0,
      testId: 'admin-stat-donations',
    },
    {
      label: 'Montant total',
      value: `${(stats?.totalAmount || 0).toLocaleString('fr-FR')} €`,
      testId: 'admin-stat-amount',
    },
    {
      label: 'Utilisateurs suspendus',
      value: stats?.suspendedUsers || 0,
      testId: 'admin-stat-suspended',
    },
  ]

  return (
    <div
      data-testid="admin-stats-grid"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    >
      {statsData.map((stat) => (
        <div
          key={stat.testId}
          data-testid={stat.testId}
          className="border border-gray-200 rounded p-4 bg-white"
        >
          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
