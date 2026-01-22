export function Card({ children, hover = false, className = '', ...props }) {
  const hoverClasses = hover
    ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    : ""

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${hoverClasses} ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardImage({ src, alt, className = '', ...props }) {
  return (
    <div className={`aspect-video overflow-hidden bg-gray-100 ${className}`} {...props}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
    </div>
  )
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 ${className}`} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-sm text-gray-600 mt-2 ${className}`} {...props}>
      {children}
    </p>
  )
}
