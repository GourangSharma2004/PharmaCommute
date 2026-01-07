import { Badge } from '@/components/ui/badge'
import { BatchStatus } from '@/types/inventory'
import { cn } from '@/lib/utils'

interface BatchStatusBadgeProps {
  status: BatchStatus
  className?: string
}

const statusConfig = {
  [BatchStatus.AVAILABLE]: {
    label: 'Available',
    className: 'status-badge-available',
  },
  [BatchStatus.QUARANTINE]: {
    label: 'Quarantine',
    className: 'status-badge-quarantine',
  },
  [BatchStatus.BLOCKED]: {
    label: 'Blocked',
    className: 'status-badge-blocked',
  },
  [BatchStatus.EXPIRED]: {
    label: 'Expired',
    className: 'status-badge-expired',
  },
  [BatchStatus.RESERVED]: {
    label: 'Reserved',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  [BatchStatus.ISSUED]: {
    label: 'Issued',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
}

export function BatchStatusBadge({ status, className }: BatchStatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
