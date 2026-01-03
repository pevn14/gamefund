export function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const baseClasses = "inline-flex items-center gap-1.5 font-medium rounded-full uppercase tracking-wide"

  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-primary-100 text-primary-700",
    success: "bg-accent-100 text-accent-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    // Statuts de projets
    draft: "bg-gray-100 text-gray-700",
    active: "bg-accent-100 text-accent-700",
    completed: "bg-primary-100 text-primary-700",
    failed: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-700",
    suspended: "bg-yellow-100 text-yellow-700",
  }

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  }

  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}
