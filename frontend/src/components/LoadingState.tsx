interface LoadingStateProps {
  children: string
}

export function LoadingState({ children }: LoadingStateProps) {
  return (
    <p className="loading-state" role="status">
      {children}
    </p>
  )
}
