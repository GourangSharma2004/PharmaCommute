'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BatchStatusBadge } from './batch-status-badge'
import { FEFOIndicator } from './fefo-indicator'
import { Batch } from '@/types/inventory'
import { useAuthStore } from '@/store/auth-store'
import { MoreHorizontal, Eye, Edit, Package } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BatchTableProps {
  batches: Batch[]
  isLoading?: boolean
}

export function BatchTable({ batches, isLoading }: BatchTableProps) {
  const { getPermissions } = useAuthStore()
  const permissions = getPermissions()

  if (isLoading) {
    return <BatchTableSkeleton />
  }

  if (batches.length === 0) {
    return <BatchTableEmpty />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatQuantity = (quantity: number, uom: string) => {
    return `${quantity.toLocaleString()} ${uom}`
  }

  return (
    <div className="pharma-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch Number</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch) => (
            <TableRow key={batch.id} className="hover:bg-slate-50">
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <span>{batch.batchNumber}</span>
                  <FEFOIndicator 
                    daysToExpiry={batch.daysToExpiry}
                    isNearExpiry={batch.isNearExpiry}
                  />
                </div>
              </TableCell>
              
              <TableCell>
                <div>
                  <div className="font-medium">{batch.productName}</div>
                  <div className="text-sm text-slate-500">{batch.productCode}</div>
                </div>
              </TableCell>
              
              <TableCell>
                <span className="text-sm">{batch.supplierName}</span>
              </TableCell>
              
              <TableCell>
                <div>
                  <div className="text-sm">{formatDate(batch.expiryDate)}</div>
                  <div className="text-xs text-slate-500">
                    {batch.daysToExpiry > 0 ? `${batch.daysToExpiry} days` : 'Expired'}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <span className="text-sm">{formatQuantity(batch.quantity, batch.uom)}</span>
              </TableCell>
              
              <TableCell>
                <div>
                  <div className="text-sm font-medium text-green-600">
                    {formatQuantity(batch.availableQuantity, batch.uom)}
                  </div>
                  {batch.reservedQuantity > 0 && (
                    <div className="text-xs text-slate-500">
                      {formatQuantity(batch.reservedQuantity, batch.uom)} reserved
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <BatchStatusBadge status={batch.status} />
              </TableCell>
              
              <TableCell>
                <span className="text-sm">{batch.warehouseName}</span>
              </TableCell>
              
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    
                    {permissions?.canUpdateInventory && (
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Batch
                      </DropdownMenuItem>
                    )}
                    
                    {permissions?.canCreateInventory && batch.availableQuantity > 0 && (
                      <DropdownMenuItem>
                        <Package className="mr-2 h-4 w-4" />
                        Create Movement
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function BatchTableSkeleton() {
  return (
    <div className="pharma-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch Number</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
              <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
              <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
              <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
              <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
              <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
              <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
              <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
              <TableCell><div className="h-4 bg-slate-200 rounded animate-pulse"></div></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function BatchTableEmpty() {
  return (
    <div className="pharma-card p-12 text-center">
      <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">No batches found</h3>
      <p className="text-slate-500 mb-4">
        No inventory batches match your current filters.
      </p>
      <Button variant="outline">
        Clear Filters
      </Button>
    </div>
  )
}
