import { forwardRef, useState } from 'react'

export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  rows = 4,
  maxLength,
  showCount = false,
  className = '',
  ...props
}, ref) => {
  const [count, setCount] = useState(props.defaultValue?.length || 0)

  const handleChange = (e) => {
    setCount(e.target.value.length)
    props.onChange?.(e)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        rows={rows}
        maxLength={maxLength}
        onChange={handleChange}
        className={`
          w-full px-4 py-3
          text-base text-gray-900
          bg-white border border-gray-300 rounded-lg
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
          resize-none
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />

      {showCount && maxLength && (
        <div className="mt-1.5 text-xs text-gray-500 text-right">
          {count} / {maxLength}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'
