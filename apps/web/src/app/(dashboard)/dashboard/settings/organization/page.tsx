'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/store/auth-store'
import { 
  Building, 
  Shield, 
  MapPin,
  FileText,
  Database,
  Server,
  Upload,
  Info,
  Lock,
  Globe,
  Calendar,
  Users,
  XCircle
} from 'lucide-react'

// Types for Organization Settings
interface OrganizationProfile {
  legalName: string
  tradeName: string
  orgType: 'Manufacturer' | 'Distributor' | 'C&F Agent' | '3PL'
  registeredAddress: string
  country: string
  state: string
  city: string
  pin: string
  timeZone: string
  businessHours: string
  contactName: string
  contactEmail: string
  contactPhone: string
}

interface OrganizationalEntity {
  id: string
  name: string
  type: 'Manufacturing Site' | 'Warehouse' | 'Cold Storage' | 'Department'
  location: string
  status: 'Active' | 'Inactive'
}

export default function OrganizationPage() {
  const { user, getPermissions } = useAuthStore()
  const permissions = getPermissions()
  
  // Only Admin can edit organization settings
  const canEdit = permissions?.canConfigureSystem && user?.role === 'ADMIN'
  
  // Mock organization profile data
  const [orgProfile, setOrgProfile] = useState<OrganizationProfile>({
    legalName: 'PharmaCommute Technologies Pvt Ltd',
    tradeName: 'PharmaCommute',
    orgType: 'Manufacturer',
    registeredAddress: '123 Pharma Street, Industrial Area',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    pin: '400001',
    timeZone: 'Asia/Kolkata (UTC+5:30)',
    businessHours: '09:00 AM - 06:00 PM',
    contactName: 'Rajesh Kumar',
    contactEmail: 'contact@pharmacommute.com',
    contactPhone: '+91-22-12345678'
  })

  // Mock compliance frameworks
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['GMP', 'GDP', '21 CFR Part 11'])
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['India', 'US'])
  
  // Mock organizational entities
  const [orgEntities] = useState<OrganizationalEntity[]>([
    { id: '1', name: 'Main Manufacturing Plant', type: 'Manufacturing Site', location: 'Mumbai, India', status: 'Active' },
    { id: '2', name: 'Central Warehouse', type: 'Warehouse', location: 'Pune, India', status: 'Active' },
    { id: '3', name: 'Cold Storage Unit A', type: 'Cold Storage', location: 'Mumbai, India', status: 'Active' },
    { id: '4', name: 'Quality Assurance Department', type: 'Department', location: 'Mumbai, India', status: 'Active' },
    { id: '5', name: 'Quality Control Department', type: 'Department', location: 'Mumbai, India', status: 'Active' },
    { id: '6', name: 'Regional Warehouse - Delhi', type: 'Warehouse', location: 'Delhi, India', status: 'Active' }
  ])

  // Mock operational defaults
  const [operationalDefaults, setOperationalDefaults] = useState({
    currency: 'INR',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    fiscalYearStart: '01-Apr',
    fiscalYearEnd: '31-Mar',
    unitSystem: 'Metric',
    fefoEnforcement: true
  })

  // Mock retention policies
  const [retentionPolicy, setRetentionPolicy] = useState({
    inventoryDataRetention: 7,
    auditLogRetention: 10,
    temperatureLogRetention: 7,
    archiveAfterExpiry: true,
    legalHoldOverride: false
  })

  // Branding file uploads
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)

  // Save handlers
  const handleSaveOrganizationProfile = () => {
    // TODO: Save to backend with audit logging
    console.log('Saving organization profile:', orgProfile)
    // Show success notification
    alert('Organization profile saved successfully!')
  }

  const handleSaveComplianceSettings = () => {
    // TODO: Save to backend with audit logging
    console.log('Saving compliance settings:', {
      frameworks: selectedFrameworks,
      markets: selectedMarkets
    })
    // Show success notification
    alert('Compliance settings saved successfully!')
  }

  const handleSaveOperationalDefaults = () => {
    // TODO: Save to backend with audit logging
    console.log('Saving operational defaults:', operationalDefaults)
    // Show success notification
    alert('Operational defaults saved successfully!')
  }

  const handleSaveBrandingConfiguration = () => {
    // TODO: Save to backend with audit logging
    // In a real implementation, you would upload the files to a server
    console.log('Saving branding configuration', {
      logoFile: logoFile?.name,
      signatureFile: signatureFile?.name
    })
    // Show success notification
    alert('Branding configuration saved successfully!')
  }

  const handleSaveRetentionPolicy = () => {
    // TODO: Save to backend with audit logging
    console.log('Saving retention policy:', retentionPolicy)
    // Show success notification
    alert('Retention policy saved successfully!')
  }

  // File upload handlers
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      setLogoFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      setSignatureFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    // Reset file input
    const input = document.getElementById('logoInput') as HTMLInputElement
    if (input) input.value = ''
  }

  const handleRemoveSignature = () => {
    setSignatureFile(null)
    setSignaturePreview(null)
    // Reset file input
    const input = document.getElementById('signatureInput') as HTMLInputElement
    if (input) input.value = ''
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Organization Settings</h1>
        <p className="text-slate-600 dark:text-slate-300">Configure company information, branding, and organizational preferences</p>
      </div>

      {!canEdit && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You have read-only access to organization settings. Only System Administrators can modify these configurations.
          </AlertDescription>
        </Alert>
      )}

      {/* Section 1: Organization Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-indigo-600" />
            <div>
              <CardTitle>Organization Profile</CardTitle>
              <CardDescription>
                Legal and operational identity information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="legalName">Legal Organization Name</Label>
                <Input
                  id="legalName"
                  value={orgProfile.legalName}
                  onChange={(e) => setOrgProfile(prev => ({ ...prev, legalName: e.target.value }))}
                  disabled={!canEdit}
                />
              </div>
              
              <div>
                <Label htmlFor="tradeName">Trade / Brand Name</Label>
                <Input
                  id="tradeName"
                  value={orgProfile.tradeName}
                  onChange={(e) => setOrgProfile(prev => ({ ...prev, tradeName: e.target.value }))}
                  disabled={!canEdit}
                />
              </div>
              
              <div>
                <Label htmlFor="orgType">Organization Type</Label>
                <Select
                  value={orgProfile.orgType}
                  onValueChange={(value) => setOrgProfile(prev => ({ ...prev, orgType: value as any }))}
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="Distributor">Distributor</SelectItem>
                    <SelectItem value="C&F Agent">C&F Agent</SelectItem>
                    <SelectItem value="3PL">3PL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="registeredAddress">Registered Address</Label>
                <Textarea
                  id="registeredAddress"
                  value={orgProfile.registeredAddress}
                  onChange={(e) => setOrgProfile(prev => ({ ...prev, registeredAddress: e.target.value }))}
                  disabled={!canEdit}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={orgProfile.country}
                    onChange={(e) => setOrgProfile(prev => ({ ...prev, country: e.target.value }))}
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={orgProfile.state}
                    onChange={(e) => setOrgProfile(prev => ({ ...prev, state: e.target.value }))}
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={orgProfile.city}
                    onChange={(e) => setOrgProfile(prev => ({ ...prev, city: e.target.value }))}
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <Label htmlFor="pin">PIN Code</Label>
                  <Input
                    id="pin"
                    value={orgProfile.pin}
                    onChange={(e) => setOrgProfile(prev => ({ ...prev, pin: e.target.value }))}
                    disabled={!canEdit}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="timeZone">Time Zone (Required)</Label>
                <Select value={orgProfile.timeZone} disabled={!canEdit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata (UTC+5:30)">Asia/Kolkata (UTC+5:30)</SelectItem>
                    <SelectItem value="America/New_York (UTC-5)">America/New_York (UTC-5)</SelectItem>
                    <SelectItem value="Europe/London (UTC+0)">Europe/London (UTC+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="businessHours">Business Hours (Optional)</Label>
                <Input
                  id="businessHours"
                  value={orgProfile.businessHours}
                  onChange={(e) => setOrgProfile(prev => ({ ...prev, businessHours: e.target.value }))}
                  disabled={!canEdit}
                />
              </div>
              
              <div>
                <Label htmlFor="contactName">Primary Contact Name</Label>
                <Input
                  id="contactName"
                  value={orgProfile.contactName}
                  onChange={(e) => setOrgProfile(prev => ({ ...prev, contactName: e.target.value }))}
                  disabled={!canEdit}
                />
              </div>
              
              <div>
                <Label htmlFor="contactEmail">Primary Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={orgProfile.contactEmail}
                  onChange={(e) => setOrgProfile(prev => ({ ...prev, contactEmail: e.target.value }))}
                  disabled={!canEdit}
                />
              </div>
              
              <div>
                <Label htmlFor="contactPhone">Primary Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={orgProfile.contactPhone}
                  onChange={(e) => setOrgProfile(prev => ({ ...prev, contactPhone: e.target.value }))}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>
          
          {canEdit && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveOrganizationProfile}>Save Organization Profile</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Regulatory & Compliance Context */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-600" />
            <div>
              <CardTitle>Regulatory & Compliance Context</CardTitle>
              <CardDescription>
                Define applicable regulatory frameworks and operating markets
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                These settings affect audits, recalls, and regulatory exports.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Compliance Frameworks</Label>
                  <div className="mt-2 space-y-2">
                    {['GMP', 'GDP', 'GxP', '21 CFR Part 11'].map((framework) => (
                      <div key={framework} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={framework}
                          checked={selectedFrameworks.includes(framework)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFrameworks([...selectedFrameworks, framework])
                            } else {
                              setSelectedFrameworks(selectedFrameworks.filter(f => f !== framework))
                            }
                          }}
                          disabled={!canEdit}
                        />
                        <Label htmlFor={framework}>{framework}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Operating Markets</Label>
                  <div className="mt-2 space-y-2">
                    {['India', 'US', 'EU', 'Multi-country'].map((market) => (
                      <div key={market} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={market}
                          checked={selectedMarkets.includes(market)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMarkets([...selectedMarkets, market])
                            } else {
                              setSelectedMarkets(selectedMarkets.filter(m => m !== market))
                            }
                          }}
                          disabled={!canEdit}
                        />
                        <Label htmlFor={market}>{market}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mfgLicense">Manufacturing License No.</Label>
                  <Input
                    id="mfgLicense"
                    defaultValue="MFG/2023/12345"
                    disabled={!canEdit}
                  />
                </div>
                
                <div>
                  <Label htmlFor="wholesaleLicense">Wholesale License No.</Label>
                  <Input
                    id="wholesaleLicense"
                    defaultValue="WHL/2023/67890"
                    disabled={!canEdit}
                  />
                </div>
                
                <div>
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input
                    id="gstin"
                    defaultValue="27AABCU9603R1ZM"
                    disabled={!canEdit}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fdaEstablishment">FDA Establishment ID (Optional)</Label>
                  <Input
                    id="fdaEstablishment"
                    placeholder="Enter FDA ID"
                    disabled={!canEdit}
                  />
                </div>
                
                <div>
                  <Label htmlFor="duns">DUNS (Optional)</Label>
                  <Input
                    id="duns"
                    placeholder="Enter DUNS number"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>
            
            {canEdit && (
              <div className="flex justify-end">
                <Button onClick={handleSaveComplianceSettings}>Save Compliance Settings</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Organizational Structure */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-600" />
            <div>
              <CardTitle>Organizational Structure</CardTitle>
              <CardDescription>
                Define company structure metadata for reporting and access scoping
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This does NOT manage inventory or master data. Used for reporting and access scoping.
              </AlertDescription>
            </Alert>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orgEntities.map((entity) => (
                  <TableRow key={entity.id}>
                    <TableCell className="font-medium">{entity.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{entity.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{entity.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={entity.status === 'Active' ? 'default' : 'secondary'}>
                        {entity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Operational Defaults */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle>Operational Defaults</CardTitle>
              <CardDescription>
                System-wide default behavior and formatting preferences
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="currency">Default Currency</Label>
                <Select
                  value={operationalDefaults.currency}
                  onValueChange={(value) => setOperationalDefaults(prev => ({ ...prev, currency: value }))}
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="language">Default Language</Label>
                <Select
                  value={operationalDefaults.language}
                  onValueChange={(value) => setOperationalDefaults(prev => ({ ...prev, language: value }))}
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="dateFormat">Default Date Format</Label>
                <Select
                  value={operationalDefaults.dateFormat}
                  onValueChange={(value) => setOperationalDefaults(prev => ({ ...prev, dateFormat: value }))}
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fiscalStart">Fiscal Year Start</Label>
                  <Input
                    id="fiscalStart"
                    value={operationalDefaults.fiscalYearStart}
                    onChange={(e) => setOperationalDefaults(prev => ({ ...prev, fiscalYearStart: e.target.value }))}
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <Label htmlFor="fiscalEnd">Fiscal Year End</Label>
                  <Input
                    id="fiscalEnd"
                    value={operationalDefaults.fiscalYearEnd}
                    onChange={(e) => setOperationalDefaults(prev => ({ ...prev, fiscalYearEnd: e.target.value }))}
                    disabled={!canEdit}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="unitSystem">Unit System</Label>
                <Select
                  value={operationalDefaults.unitSystem}
                  onValueChange={(value) => setOperationalDefaults(prev => ({ ...prev, unitSystem: value }))}
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Metric">Metric</SelectItem>
                    <SelectItem value="Imperial">Imperial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="fefoEnforcement">FEFO Enforcement Default</Label>
                <Switch
                  id="fefoEnforcement"
                  checked={operationalDefaults.fefoEnforcement}
                  onCheckedChange={(checked) => setOperationalDefaults(prev => ({ ...prev, fefoEnforcement: checked }))}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>
          
          {canEdit && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveOperationalDefaults}>Save Operational Defaults</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 5: Document & Branding Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <div>
              <CardTitle>Document & Branding Configuration</CardTitle>
              <CardDescription>
                Enterprise document consistency for audit exports and compliance documentation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyLogo">Company Logo</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden relative">
                      {logoPreview ? (
                        <>
                          <img 
                            src={logoPreview} 
                            alt="Company Logo" 
                            className="w-full h-full object-contain"
                          />
                          {canEdit && (
                            <button
                              onClick={handleRemoveLogo}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              type="button"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      ) : (
                        <Upload className="h-8 w-8 text-slate-400" />
                      )}
                    </div>
                    {canEdit && (
                      <div className="flex flex-col space-y-2">
                        <input
                          type="file"
                          id="logoInput"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          type="button"
                          onClick={() => document.getElementById('logoInput')?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {logoFile ? 'Change Logo' : 'Upload Logo'}
                        </Button>
                        {logoFile && (
                          <p className="text-xs text-slate-500">{logoFile.name}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Used in PDFs and reports (Max 5MB, PNG/JPG recommended)</p>
                </div>
                
                <div>
                  <Label htmlFor="reportHeader">Report Header Text</Label>
                  <Textarea
                    id="reportHeader"
                    placeholder="Appears at the top of all reports"
                    defaultValue="PharmaCommute Technologies Pvt Ltd - Pharmaceutical Inventory Management System"
                    disabled={!canEdit}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="reportFooter">Report Footer Text</Label>
                  <Textarea
                    id="reportFooter"
                    placeholder="Appears at the bottom of all reports"
                    defaultValue="This is a system-generated document. For queries, contact: contact@pharmacommute.com"
                    disabled={!canEdit}
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="signatoryName">Authorized Signatory Name</Label>
                  <Input
                    id="signatoryName"
                    defaultValue="Dr. Rajesh Kumar"
                    disabled={!canEdit}
                  />
                </div>
                
                <div>
                  <Label htmlFor="signatoryRole">Signatory Role</Label>
                  <Input
                    id="signatoryRole"
                    defaultValue="Director - Quality Assurance"
                    disabled={!canEdit}
                  />
                </div>
                
                <div>
                  <Label htmlFor="signature">Signature Image (Optional)</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="w-48 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden relative">
                      {signaturePreview ? (
                        <>
                          <img 
                            src={signaturePreview} 
                            alt="Signature" 
                            className="w-full h-full object-contain"
                          />
                          {canEdit && (
                            <button
                              onClick={handleRemoveSignature}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              type="button"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      ) : (
                        <Upload className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    {canEdit && (
                      <div className="flex flex-col space-y-2">
                        <input
                          type="file"
                          id="signatureInput"
                          accept="image/*"
                          onChange={handleSignatureUpload}
                          className="hidden"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          type="button"
                          onClick={() => document.getElementById('signatureInput')?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {signatureFile ? 'Change Signature' : 'Upload Signature'}
                        </Button>
                        {signatureFile && (
                          <p className="text-xs text-slate-500">{signatureFile.name}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Max 5MB, PNG/JPG recommended</p>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Used in audit exports, recall reports, and compliance documentation.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
            
            {canEdit && (
              <div className="flex justify-end">
                <Button onClick={handleSaveBrandingConfiguration}>Save Branding Configuration</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Data Retention & Archival Policy */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-orange-600" />
            <div>
              <CardTitle>Data Retention & Archival Policy</CardTitle>
              <CardDescription>
                Organization-level data lifecycle control and compliance requirements
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="inventoryRetention">Inventory Data Retention (Years)</Label>
                <Input
                  id="inventoryRetention"
                  type="number"
                  value={retentionPolicy.inventoryDataRetention}
                  onChange={(e) => setRetentionPolicy(prev => ({ ...prev, inventoryDataRetention: parseInt(e.target.value) }))}
                  disabled={!canEdit}
                />
              </div>
              
              <div>
                <Label htmlFor="auditRetention">Audit Log Retention (Years)</Label>
                <Input
                  id="auditRetention"
                  type="number"
                  value={retentionPolicy.auditLogRetention}
                  onChange={(e) => setRetentionPolicy(prev => ({ ...prev, auditLogRetention: parseInt(e.target.value) }))}
                  disabled={!canEdit}
                />
              </div>
              
              <div>
                <Label htmlFor="tempRetention">Temperature Log Retention (Years)</Label>
                <Input
                  id="tempRetention"
                  type="number"
                  value={retentionPolicy.temperatureLogRetention}
                  onChange={(e) => setRetentionPolicy(prev => ({ ...prev, temperatureLogRetention: parseInt(e.target.value) }))}
                  disabled={!canEdit}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="archiveExpiry">Archive after retention expiry</Label>
                <Switch
                  id="archiveExpiry"
                  checked={retentionPolicy.archiveAfterExpiry}
                  onCheckedChange={(checked) => setRetentionPolicy(prev => ({ ...prev, archiveAfterExpiry: checked }))}
                  disabled={!canEdit}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Archived data is read-only</Label>
                <Badge variant="destructive">Always ON</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="legalHold">Legal hold override</Label>
                <Switch
                  id="legalHold"
                  checked={retentionPolicy.legalHoldOverride}
                  onCheckedChange={(checked) => setRetentionPolicy(prev => ({ ...prev, legalHoldOverride: checked }))}
                  disabled={!canEdit}
                />
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Retention policies ensure compliance with regulatory requirements and support long-term audit capabilities.
                </AlertDescription>
              </Alert>
            </div>
          </div>
          
          {canEdit && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveRetentionPolicy}>Save Retention Policy</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 7: Environment & Deployment Metadata (Read-Only) */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Server className="h-5 w-5 text-cyan-600" />
            <div>
              <CardTitle>Environment & Deployment Metadata</CardTitle>
              <CardDescription>
                Audit and diagnostic visibility (Read-Only)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                This information is read-only and automatically managed by the system.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Label>Environment</Label>
                  <Badge variant="destructive">Production</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Label>Instance ID</Label>
                  <span className="text-sm font-mono">inst-7a8b9c0d</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Label>Deployment Region</Label>
                  <span className="text-sm">ap-south-1 (Mumbai)</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Label>Application Version</Label>
                  <Badge variant="outline">v1.2.5</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Label>Last Deployment</Label>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    <span className="text-sm">2024-01-15 14:30 IST</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
