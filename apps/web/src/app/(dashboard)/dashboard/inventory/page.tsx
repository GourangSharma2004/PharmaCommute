'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BatchTable } from '@/components/inventory/batch-table'
import { useAuthStore } from '@/store/auth-store'
import { Batch, BatchStatus, InventoryFilters } from '@/types/inventory'
import { Search, Filter, Plus, Download } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Mock data - would come from API
const MOCK_BATCHES: Batch[] = [
  {
    id: '1',
    batchNumber: 'ABC123',
    productId: 'prod-1',
    productName: 'Paracetamol 500mg',
    productCode: 'PCM500',
    supplierId: 'sup-1',
    supplierName: 'PharmaCorp Ltd',
    manufacturedDate: '2024-01-15',
    expiryDate: '2025-01-15',
    receivedDate: '2024-01-20',
    status: BatchStatus.AVAILABLE,
    quantity: 10000,
    availableQuantity: 8500,
    reservedQuantity: 1500,
    uom: 'Tablets',
    warehouseName: 'Main Warehouse',
    daysToExpiry: 45,
    isNearExpiry: true,
    coaReference: 'COA-ABC123-2024',
  },
  {
    id: '2',
    batchNumber: 'XYZ789',
    productId: 'prod-2',
    productName: 'Amoxicillin 250mg',
    productCode: 'AMX250',
    supplierId: 'sup-2',
    supplierName: 'MediSupply Inc',
    manufacturedDate: '2024-02-01',
    expiryDate: '2026-02-01',
    receivedDate: '2024-02-05',
    status: BatchStatus.QUARANTINE,
    quantity: 5000,
    availableQuantity: 0,
    reservedQuantity: 0,
    uom: 'Capsules',
    warehouseName: 'QC Lab',
    daysToExpiry: 365,
    isNearExpiry: false,
    coaReference: null,
  },
  {
    id: '3',
    batchNumber: 'DEF456',
    productId: 'prod-3',
    productName: 'Insulin 100IU/ml',
    productCode: 'INS100',
    supplierId: 'sup-3',
    supplierName: 'BioPharm Solutions',
    manufacturedDate: '2024-03-01',
    expiryDate: '2024-12-01',
    receivedDate: '2024-03-05',
    status: BatchStatus.BLOCKED,
    quantity: 1000,
    availableQuantity: 0,
    reservedQuantity: 0,
    uom: 'Vials',
    warehouseName: 'Cold Storage A',
    daysToExpiry: -30,
    isNearExpiry: false,
    coaReference: 'COA-DEF456-2024',
  },
]

export default function InventoryPage() {
  const { getPermissions } = useAuthStore()
  const permissions = getPermissions()
  
  const [filters, setFilters] = useState<InventoryFilters>({})
  const [isLoading, setIsLoading] = useState(false)

  // Filter batches based on current filters
  const filteredBatches = useMemo(() => {
    return MOCK_BATCHES.filter(batch => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!batch.batchNumber.toLowerCase().includes(searchLower) &&
            !batch.productName.toLowerCase().includes(searchLower) &&
            !batch.productCode.toLowerCase().includes(searchLower)) {
          return false
        }
      }
      
      if (filters.status && batch.status !== filters.status) {
        return false
      }
      
      return true
    })
  }, [filters])

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: filteredBatches.length,
      available: filteredBatches.filter(b => b.status === BatchStatus.AVAILABLE).length,
      quarantine: filteredBatches.filter(b => b.status === BatchStatus.QUARANTINE).length,
      blocked: filteredBatches.filter(b => b.status === BatchStatus.BLOCKED).length,
      nearExpiry: filteredBatches.filter(b => b.isNearExpiry).length,
    }
  }, [filteredBatches])

  if (!permissions) return null

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-600">Batch-level inventory tracking with FEFO optimization</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {permissions.canCreateInventory && (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Movement
            </Button>
          )}
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-slate-600">Total Batches</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <p className="text-sm text-slate-600">Available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.quarantine}</div>
            <p className="text-sm text-slate-600">Quarantine</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
            <p className="text-sm text-slate-600">Blocked</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.nearExpiry}</div>
            <p className="text-sm text-slate-600">Near Expiry</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search batches, products..."
                  className="pl-10"
                  value={filters.search || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
            
            <Select
              value={filters.status || ''}
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                status: value ? value as BatchStatus : undefined 
              }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value={BatchStatus.AVAILABLE}>Available</SelectItem>
                <SelectItem value={BatchStatus.QUARANTINE}>Quarantine</SelectItem>
                <SelectItem value={BatchStatus.BLOCKED}>Blocked</SelectItem>
                <SelectItem value={BatchStatus.EXPIRED}>Expired</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => setFilters({})}
              disabled={Object.keys(filters).length === 0}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Batch table */}
      <BatchTable 
        batches={filteredBatches} 
        isLoading={isLoading}
      />
    </div>
  )
}
