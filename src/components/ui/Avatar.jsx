import { User } from 'lucide-react'

export function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  className = ''
}) {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  }

  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 48,
  }

  if (!src) {
    return (
      <div className={`${sizes[size]} rounded-full bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}>
        {fallback || <User size={iconSizes[size]} />}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover border-2 border-gray-200 ${className}`}
    />
  )
}
