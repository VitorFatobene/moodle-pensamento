import type { ReactNode } from 'react'

interface EmptyStateProps {
  title?: string
  children: ReactNode
}

export function EmptyState({ title, children }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {title ? <h2>{title}</h2> : null}
      <p>{children}</p>
    </div>
  )
}
