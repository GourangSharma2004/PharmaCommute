'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { 
  Database,
  Plus,
  Edit,
  History,
  Search,
  Eye,
  Lock,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Package,
  Building,
  Users,
  Truck,
  Boxes,
  MapPin,
  Shield,
  Calendar,
  FileText,
  ChevronRight,
  Activity,
  Thermometer,
  Package2,
  Info,
  FlaskConical
} from 'lucide-react'

// Types
interface ProductMaster {
  id: string
  productName: string
  genericName: string
  strength: string
  dosageForm: string
  status: 'Draft' | 'Active' | 'Deprecated'
  approvalState: 'Approved' | 'Pending Approval' | 'Rejected' | 'Under Review'
  effectiveDate: string
  expiryDate?: string
  createdBy: string
  lastModified: string
  regulatoryId?: string
  manufacturer?: string
}

interface MasterDataMetrics {
  activeProducts: number
  pendingApprovals: number
  modifiedThisMonth: number
  emergencyChanges: number
  regulatoryExpiryRisks: number
}

// Mock data with pharma-specific details
const masterDataMetrics: MasterDataMetrics = {
  activeProducts: 847,
  pendingApprovals: 12,
  modifiedThisMonth: 23,
  emergencyChanges: 2,
  regulatoryExpiryRisks: 7,
}

const productMasters: ProductMaster[] = [
  {
    id: 'PM-001',
    productName: 'Aspirin Tablets 325mg',
    genericName: 'Acetylsalicylic Acid',
    strength: '325mg',
    dosageForm: 'Tablet',
    status: 'Active',
    approvalState: 'Approved',
    effectiveDate: '2023-01-15',
    expiryDate: '2025-12-31',
    createdBy: 'QA Manager',
    lastModified: '2024-01-10',
    regulatoryId: 'REG-ASP-001',
    manufacturer: 'PharmaCorp Ltd.',
  },
  {
    id: 'PM-002',
    productName: 'Amoxicillin Capsules 500mg',
    genericName: 'Amoxicillin Trihydrate',
    strength: '500mg',
    dosageForm: 'Capsule',
    status: 'Active',
    approvalState: 'Approved',
    effectiveDate: '2023-03-20',
    createdBy: 'QA Manager',
    lastModified: '2024-01-08',
    regulatoryId: 'REG-AMX-002',
    manufacturer: 'MediPharma Inc.',
  },
  {
    id: 'PM-003',
    productName: 'Metformin Tablets 850mg',
    genericName: 'Metformin Hydrochloride',
    strength: '850mg',
    dosageForm: 'Tablet',
    status: 'Draft',
    approvalState: 'Pending Approval',
    effectiveDate: '2024-02-01',
    createdBy: 'Product Manager',
    lastModified: '2024-01-12',
    regulatoryId: 'REG-MET-003',
    manufacturer: 'GlobalPharma Corp.',
  },
  {
    id: 'PM-004',
    productName: 'Ibuprofen Suspension 100mg/5ml',
    genericName: 'Ibuprofen',
    strength: '100mg/5ml',
    dosageForm: 'Oral Suspension',
    status: 'Active',
    approvalState: 'Under Review',
    effectiveDate: '2023-06-10',
    createdBy: 'QA Manager',
    lastModified: '2024-01-14',
    regulatoryId: 'REG-IBU-004',
    manufacturer: 'PharmaTech Solutions',
  },
  {
    id: 'PM-005',
    productName: 'Lisinopril Tablets 10mg',
    genericName: 'Lisinopril',
    strength: '10mg',
    dosageForm: 'Tablet',
    status: 'Deprecated',
    approvalState: 'Approved',
    effectiveDate: '2022-08-15',
    expiryDate: '2024-01-31',
    createdBy: 'QA Manager',
    lastModified: '2023-12-20',
    regulatoryId: 'REG-LIS-005',
    manufacturer: 'Legacy Pharma Ltd.',
  },
]

const masterDataCategories = [
  { 
    id: 'product-drug', 
    name: 'Product / Drug Master', 
    icon: Package, 
    count: 847,
    description: 'Pharmaceutical products, formulations, and drug information'
  },
  { 
    id: 'batch-lot', 
    name: 'Batch / Lot Master', 
    icon: Package2, 
    count: 1247,
    description: 'Manufacturing batches and lot tracking information'
  },
  { 
    id: 'manufacturing-site', 
    name: 'Manufacturing Site Master', 
    icon: Building, 
    count: 8,
    description: 'Manufacturing facilities and production sites'
  },
  { 
    id: 'warehouse-storage', 
    name: 'Warehouse & Storage Master', 
    icon: MapPin, 
    count: 23,
    description: 'Storage locations, warehouses, and distribution centers'
  },
  { 
    id: 'supplier', 
    name: 'Supplier Master', 
    icon: Truck, 
    count: 156,
    description: 'Approved suppliers and vendor information'
  },
  { 
    id: 'customer-distributor', 
    name: 'Customer / Distributor Master', 
    icon: Users, 
    count: 89,
    description: 'Customer accounts and distribution partners'
  },
  { 
    id: 'uom-conversion', 
    name: 'UOM & Conversion Master', 
    icon: Boxes, 
    count: 34,
    description: 'Units of measure and conversion factors'
  },
  { 
    id: 'regulatory-classification', 
    name: 'Regulatory & Classification Master', 
    icon: Shield, 
    count: 67,
    description: 'Drug classifications and regulatory categories'
  },
  { 
    id: 'change-history', 
    name: 'Master Data Change History', 
    icon: History, 
    count: 1892,
    description: 'Complete audit trail of all master data changes'
  },
]

export default function MasterDataPage() {
  const [selectedCategory, setSelectedCategory] = useState('product-drug')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [approvalFilter, setApprovalFilter] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<ProductMaster | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const filteredProducts = productMasters.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.genericName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status.toLowerCase() === statusFilter
    const matchesApproval = approvalFilter === 'all' || 
                           product.approvalState.toLowerCase().replace(' ', '-') === approvalFilter
    
    return matchesSearch && matchesStatus && matchesApproval
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">Active</Badge>
      case 'Draft':
        return <Badge variant="outline" className="text-slate-600 dark:text-slate-400">Draft</Badge>
      case 'Deprecated':
        return <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700">Deprecated</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getApprovalBadge = (approvalState: string) => {
    switch (approvalState) {
      case 'Approved':
        return <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">Approved</Badge>
      case 'Pending Approval':
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700">Pending Approval</Badge>
      case 'Under Review':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">Under Review</Badge>
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{approvalState}</Badge>
    }
  }

  const openProductDetail = (product: ProductMaster) => {
    setSelectedProduct(product)
    setIsDetailOpen(true)
  }

  const handleCreateMaster = () => {
    // Mock handler - would typically open a creation workflow
    console.log('Create Master clicked')
  }

  const handleRequestChange = () => {
    // Mock handler - would typically open change request workflow
    console.log('Request Change clicked')
  }

  const handleChangeHistory = () => {
    // Mock handler - would navigate to change history view
    console.log('Change History clicked')
  }

  return (
    <div className="space-y-6 pb-6">
      {/* 1️⃣ Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Master Data</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Governed reference data for regulated pharmaceutical operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-600 dark:text-slate-400"
            onClick={handleChangeHistory}
          >
            <History className="h-4 w-4 mr-2" />
            Change History
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRequestChange}
          >
            <Edit className="h-4 w-4 mr-2" />
            Request Change
          </Button>
          <Button 
            size="sm"
            onClick={handleCreateMaster}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Master
          </Button>
        </div>
      </div>

      {/* Governance Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
              Regulated Master Data Environment
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              All master data changes are subject to approval workflows, audit logging, and effective dating controls. 
              Emergency changes are tracked and require justification for compliance purposes.
            </p>
          </div>
        </div>
      </div>

      {/* 2️⃣ Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-green-300 dark:hover:border-green-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Products</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{masterDataMetrics.activeProducts}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">Ready for use</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-amber-300 dark:hover:border-amber-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Pending Approvals</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{masterDataMetrics.pendingApprovals}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">Awaiting review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Modified This Month</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{masterDataMetrics.modifiedThisMonth}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">Recent changes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
          masterDataMetrics.emergencyChanges > 0 
            ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10 hover:border-red-300 dark:hover:border-red-700' 
            : 'hover:border-slate-300 dark:hover:border-slate-700'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                masterDataMetrics.emergencyChanges > 0 
                  ? 'bg-red-100 dark:bg-red-900/30' 
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}>
                <AlertTriangle className={`h-5 w-5 ${
                  masterDataMetrics.emergencyChanges > 0 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-slate-600 dark:text-slate-400'
                }`} />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Emergency Changes</p>
                <p className={`text-2xl font-bold ${
                  masterDataMetrics.emergencyChanges > 0 
                    ? 'text-red-700 dark:text-red-300' 
                    : 'text-slate-900 dark:text-slate-100'
                }`}>
                  {masterDataMetrics.emergencyChanges}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {masterDataMetrics.emergencyChanges > 0 ? 'Requires review' : 'None used'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-orange-300 dark:hover:border-orange-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Expiry Risks</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{masterDataMetrics.regulatoryExpiryRisks}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">Near expiry</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3️⃣ Master Data Navigation */}
        <div className="lg:col-span-1">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4" />
                Master Categories
              </CardTitle>
              <CardDescription className="text-xs">
                Regulated reference data
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {masterDataCategories.map((category) => {
                  const Icon = category.icon
                  const isActive = selectedCategory === category.id
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all duration-200 text-left border-r-2 ${
                        isActive 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 border-blue-600 dark:border-blue-400' 
                          : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium">{category.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 truncate">{category.count} records</p>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* 4️⃣ Main Content Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Current Category Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {masterDataCategories.find(cat => cat.id === selectedCategory)?.name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {masterDataCategories.find(cat => cat.id === selectedCategory)?.description}
              </p>
            </div>
            <Badge variant="outline" className="text-slate-600 dark:text-slate-400 px-3 py-1">
              {filteredProducts.length} of {productMasters.length} records
            </Badge>
          </div>

          {/* Search and Filters */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      placeholder="Search products by name or generic..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="deprecated">Deprecated</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={approvalFilter} onValueChange={setApprovalFilter}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Approval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Approvals</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending-approval">Pending Approval</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Product Master Table */}
          {selectedCategory === 'product-drug' && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Product / Drug Master Records
                    </CardTitle>
                    <CardDescription>
                      Pharmaceutical product definitions with regulatory approval tracking
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800">
                    GxP Controlled
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-slate-200 dark:border-slate-800">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-slate-200 dark:border-slate-800">
                        <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Product Name</TableHead>
                        <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Generic Name</TableHead>
                        <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Strength</TableHead>
                        <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Dosage Form</TableHead>
                        <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Status</TableHead>
                        <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Approval State</TableHead>
                        <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Effective Date</TableHead>
                        <TableHead className="text-right font-semibold text-slate-900 dark:text-slate-100">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow 
                          key={product.id} 
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-200 dark:border-slate-800"
                        >
                          <TableCell className="font-medium">
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{product.productName}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">ID: {product.id}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600 dark:text-slate-300">{product.genericName}</TableCell>
                          <TableCell className="text-sm text-slate-600 dark:text-slate-300 font-mono">{product.strength}</TableCell>
                          <TableCell className="text-sm text-slate-600 dark:text-slate-300">{product.dosageForm}</TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getApprovalBadge(product.approvalState)}
                              {product.approvalState !== 'Approved' && (
                                <Lock className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600 dark:text-slate-300 font-mono">{product.effectiveDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openProductDetail(product)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRequestChange()}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other Categories - Placeholder */}
          {selectedCategory !== 'product-drug' && (
            <Card className="border-slate-200 dark:border-slate-800">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  {(() => {
                    const category = masterDataCategories.find(cat => cat.id === selectedCategory)
                    const Icon = category?.icon || Database
                    return (
                      <>
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                          <Icon className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                            {category?.name}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 max-w-md">
                            {category?.description}
                          </p>
                          <div className="flex items-center justify-center gap-2 mt-4">
                            <Badge variant="outline" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              GxP Controlled
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {category?.count} Records
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-500 mt-4">
                            This category interface will be available in the next release.
                          </p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 5️⃣ Product Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedProduct && (
            <>
              <SheetHeader className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle className="text-xl text-slate-900 dark:text-slate-100">
                      {selectedProduct.productName}
                    </SheetTitle>
                    <SheetDescription className="text-slate-600 dark:text-slate-400">
                      {selectedProduct.genericName} • ID: {selectedProduct.id}
                    </SheetDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(selectedProduct.status)}
                    {getApprovalBadge(selectedProduct.approvalState)}
                  </div>
                </div>
                
                {/* Governance Lock Banner */}
                {selectedProduct.approvalState !== 'Approved' && (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Governance Lock Active</p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                        This master record is locked pending approval workflow completion. All changes require proper authorization and audit documentation.
                      </p>
                    </div>
                  </div>
                )}
              </SheetHeader>

              <div className="py-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="overview" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5 bg-slate-100 dark:bg-slate-800">
                    <TabsTrigger 
                      value="overview"
                      className={activeTab === 'overview' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100' : ''}
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="packaging"
                      className={activeTab === 'packaging' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100' : ''}
                    >
                      Packaging
                    </TabsTrigger>
                    <TabsTrigger 
                      value="regulatory"
                      className={activeTab === 'regulatory' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100' : ''}
                    >
                      Regulatory
                    </TabsTrigger>
                    <TabsTrigger 
                      value="storage"
                      className={activeTab === 'storage' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100' : ''}
                    >
                      Storage
                    </TabsTrigger>
                    <TabsTrigger 
                      value="history"
                      className={activeTab === 'history' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100' : ''}
                    >
                      History
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          Product Name
                        </Label>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{selectedProduct.productName}</p>
                          <Lock className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                          <FlaskConical className="h-3 w-3" />
                          Generic Name
                        </Label>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{selectedProduct.genericName}</p>
                          <Lock className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Strength</Label>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 font-mono">{selectedProduct.strength}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Dosage Form</Label>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{selectedProduct.dosageForm}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Effective Date</Label>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 font-mono">{selectedProduct.effectiveDate}</p>
                      </div>
                      {selectedProduct.expiryDate && (
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Expiry Date</Label>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 font-mono">{selectedProduct.expiryDate}</p>
                        </div>
                      )}
                      {selectedProduct.regulatoryId && (
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Regulatory ID
                          </Label>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 font-mono">{selectedProduct.regulatoryId}</p>
                        </div>
                      )}
                      {selectedProduct.manufacturer && (
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Manufacturer</Label>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{selectedProduct.manufacturer}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="packaging" className="space-y-4">
                    <div className="text-center py-8">
                      <Boxes className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Packaging & UOM</h4>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">Package configurations, unit conversions, and labeling specifications</p>
                      <Badge variant="outline" className="text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Governed Fields
                      </Badge>
                    </div>
                  </TabsContent>

                  <TabsContent value="regulatory" className="space-y-4">
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Regulatory Information</h4>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">Drug classification, regulatory approvals, and compliance data</p>
                      <Badge variant="outline" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        High Governance
                      </Badge>
                    </div>
                  </TabsContent>

                  <TabsContent value="storage" className="space-y-4">
                    <div className="text-center py-8">
                      <Thermometer className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Storage & Shelf Life</h4>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">Storage conditions, shelf life, and stability requirements</p>
                      <Badge variant="outline" className="text-xs">
                        <Thermometer className="h-3 w-3 mr-1" />
                        Critical for Cold Chain
                      </Badge>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4">
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Change History</h4>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">Complete audit trail of all modifications and approvals</p>
                      <Badge variant="outline" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        21 CFR Part 11 Compliant
                      </Badge>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    View Approval Workflow
                  </Button>
                  <Button className="flex-1" onClick={() => handleRequestChange()}>
                    <Edit className="h-4 w-4 mr-2" />
                    Request Change
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
