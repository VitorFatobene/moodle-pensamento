interface StatusBadgeProps {
  value: string
}

type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const statusToneByValue: Record<string, StatusTone> = {
  ACEITA: 'success',
  ATIVA: 'success',
  ATIVO: 'success',
  CONCLUIDA: 'success',
  CONCLUÍDA: 'success',
  INATIVA: 'danger',
  INATIVO: 'danger',
  RECUSADA: 'danger',
  PENDENTE: 'warning',
  PUBLICADO: 'info',
}

export function StatusBadge({ value }: StatusBadgeProps) {
  const normalizedValue = value.trim().toUpperCase()
  const tone = statusToneByValue[normalizedValue] ?? 'neutral'

  return (
    <span className={`status-badge status-badge--${tone}`}>
      {value}
    </span>
  )
}
