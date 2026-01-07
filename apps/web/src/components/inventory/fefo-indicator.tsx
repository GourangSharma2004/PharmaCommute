import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FEFOIndicatorProps {
  daysToExpiry: number
  isNearExpiry: boolean
  className?: string
}

export function FEFOIndicator({ daysToExpiry, isNearExpiry, className }: FEFOIndicatorProps) {
  if (!isNearExpiry) return null

  return (
    <div className={cn('fefo-indicator', className)}>
      <Clock className="h-3 w-3 mr-1" />
      <span>{daysToExpiry}d</span>
    </div>
  )
}
