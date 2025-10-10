import React from 'react'
import { clsx } from 'clsx'

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  className,
  disabled,
  loading,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none'
  
  const variants = {
    primary: 'bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md focus:ring-offset-white dark:focus:ring-offset-gray-800',
    secondary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md focus:ring-offset-white dark:focus:ring-offset-gray-800',
    outline: 'border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md focus:ring-offset-white dark:border-gray-600 dark:text-gray-300 dark:hover:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-offset-white dark:hover:bg-gray-700 dark:text-gray-300 dark:focus:ring-offset-gray-800'
  }
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  }
  
  return (
    <button
      ref={ref}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button