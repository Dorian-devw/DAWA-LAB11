import React from 'react'

export function Alert({ title, description, variant = 'info' }: { title?: string; description?: string; variant?: 'info' | 'success' | 'error' }) {
  const base = 'p-3 rounded-md border'
  const cls =
    variant === 'success'
      ? base + ' bg-emerald-50 border-emerald-200 text-emerald-800'
      : variant === 'error'
      ? base + ' bg-rose-50 border-rose-200 text-rose-800'
      : base + ' bg-sky-50 border-sky-200 text-sky-800'

  return (
    <div role="status" className={cls}>
      {title && <div className="font-medium">{title}</div>}
      {description && <div className="text-sm">{description}</div>}
    </div>
  )
}

export default Alert
