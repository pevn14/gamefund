import ProjectCard from './ProjectCard'
import { SkeletonCard } from '../ui/Skeleton'

export default function ProjectGrid({ projects, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="project-grid-skeleton">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12" data-testid="project-grid-error">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12" data-testid="project-grid-empty">
        <p className="text-gray-600 text-lg">Aucun projet trouvé</p>
        <p className="text-gray-500 text-sm mt-2">
          Essayez de modifier vos filtres de recherche
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="project-grid">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
