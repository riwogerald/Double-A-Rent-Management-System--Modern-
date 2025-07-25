import React from 'react'

interface StatusBadgeProps {
  status: string
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default'
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
  const getVariant = (status: string): string => {
    if (variant) {
      return variant
    }

    // Auto-determine variant based on status
    const statusLower = status.toLowerCase()
    
    if (['active', 'occupied', 'paid', 'completed', 'approved'].includes(statusLower)) {
      return 'success'
    }
    
    if (['vacant', 'pending', 'under maintenance', 'reserved'].includes(statusLower)) {
      return 'warning'
    }
    
    if (['inactive', 'overdue', 'cancelled', 'rejected'].includes(statusLower)) {
      return 'error'
    }
    
    if (['new', 'draft'].includes(statusLower)) {
      return 'info'
    }
    
    return 'default'
  }

  const getClassNames = (variant: string): string => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
    
    switch (variant) {
      case 'success':
        return `${baseClasses} bg-success-100 text-success-800`
      case 'warning':
        return `${baseClasses} bg-warning-100 text-warning-800`
      case 'error':
        return `${baseClasses} bg-error-100 text-error-800`
      case 'info':
        return `${baseClasses} bg-primary-100 text-primary-800`
      default:
        return `${baseClasses} bg-secondary-100 text-secondary-800`
    }
  }

  const variantType = getVariant(status)

  return (
    <span className={getClassNames(variantType)}>
      {status}
    </span>
  )
}

export default StatusBadge
