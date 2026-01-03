export function Container({ children, size = 'default', className = '' }) {
  const sizes = {
    sm: 'max-w-3xl',
    default: 'max-w-7xl',
    lg: 'max-w-[1400px]',
    full: 'max-w-full',
  }

  return (
    <div className={`${sizes[size]} mx-auto px-6 ${className}`}>
      {children}
    </div>
  )
}
