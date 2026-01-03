export function Skeleton({ className = '', variant = 'default' }) {
  const variants = {
    default: 'skeleton',
    circle: 'skeleton rounded-full',
    text: 'skeleton h-4 rounded-sm',
  }

  return <div className={`${variants[variant]} ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <Skeleton className="aspect-video" />
      <div className="p-6">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-2 w-full mb-2" />
        <div className="flex justify-between mt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}
