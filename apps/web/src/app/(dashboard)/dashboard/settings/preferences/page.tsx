'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { usePreferencesStore } from '@/store/preferences-store'
import { 
  Palette, 
  Layout, 
  Calendar, 
  Table, 
  Bell, 
  Accessibility,
  ExternalLink,
  CheckCircle,
  Save,
  RotateCcw
} from 'lucide-react'

export default function PreferencesPage() {
  const {
    // Appearance
    theme,
    fontSize,
    tableDensity,
    setTheme,
    setFontSize,
    setTableDensity,
    
    // Layout
    defaultLandingPage,
    sidebarExpanded,
    rememberSidebarState,
    stickyHeaders,
    setDefaultLandingPage,
    setSidebarExpanded,
    setRememberSidebarState,
    setStickyHeaders,
    
    // Date & Time
    dateFormat,
    timeFormat,
    timezone,
    weekStartDay,
    setDateFormat,
    setTimeFormat,
    setTimezone,
    setWeekStartDay,
    
    // Data Display
    defaultPageSize,
    decimalPlaces,
    highlightNearExpiry,
    highlightQuarantine,
    setDefaultPageSize,
    setDecimalPlaces,
    setHighlightNearExpiry,
    setHighlightQuarantine,
    
    // Accessibility
    highContrast,
    reducedMotion,
    keyboardFocus,
    setHighContrast,
    setReducedMotion,
    setKeyboardFocus,
    
    // Actions
    resetPreferences,
  } = usePreferencesStore()

  const handleSave = () => {
    // Preferences are automatically saved via Zustand persist
    alert('Preferences saved successfully!')
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all preferences to default values?')) {
      resetPreferences()
      alert('Preferences reset to defaults!')
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Preferences</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Customize your application experience and display settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* SECTION 1: APPEARANCE */}
      <Card className="border-2 dark:border-[hsl(217.2,32.6%,25%)]">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Appearance</CardTitle>
              <CardDescription className="mt-1">
                Customize the visual appearance and styling of the application
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold dark:text-slate-200">Theme</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'light'
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/40 text-slate-900 dark:text-slate-100'
                    : 'border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] hover:border-slate-300 dark:hover:border-[hsl(217.2,32.6%,30%)] bg-white dark:bg-[hsl(217.2,32.6%,17.5%)] text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-300 dark:border-slate-500"></div>
                  <span className="font-medium">Light</span>
                </div>
                <p className={`text-xs text-left ${theme === 'light' ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>Clean, bright interface</p>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/40 text-slate-900 dark:text-slate-100'
                    : 'border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] hover:border-slate-300 dark:hover:border-[hsl(217.2,32.6%,30%)] bg-white dark:bg-[hsl(217.2,32.6%,17.5%)] text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full bg-slate-800 dark:bg-slate-600 border-2 border-slate-600 dark:border-slate-500"></div>
                  <span className="font-medium">Dark</span>
                </div>
                <p className={`text-xs text-left ${theme === 'dark' ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>Easy on the eyes</p>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'system'
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/40 text-slate-900 dark:text-slate-100'
                    : 'border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] hover:border-slate-300 dark:hover:border-[hsl(217.2,32.6%,30%)] bg-white dark:bg-[hsl(217.2,32.6%,17.5%)] text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-white to-slate-800 dark:from-slate-300 dark:to-slate-700 border-2 border-slate-300 dark:border-slate-500"></div>
                  <span className="font-medium">System</span>
                </div>
                <p className={`text-xs text-left ${theme === 'system' ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>Follows OS setting</p>
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <Label className="text-base font-semibold dark:text-slate-200">Font Size</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(['small', 'default', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    fontSize === size
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/40 text-slate-900 dark:text-slate-100'
                      : 'border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] hover:border-slate-300 dark:hover:border-[hsl(217.2,32.6%,30%)] bg-white dark:bg-[hsl(217.2,32.6%,17.5%)] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{size}</span>
                    {fontSize === size && (
                      <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className={`${
                    fontSize === size 
                      ? 'text-slate-700 dark:text-slate-200' 
                      : 'text-slate-600 dark:text-slate-400'
                  } ${
                    size === 'small' ? 'text-sm' : size === 'default' ? 'text-base' : 'text-lg'
                  }`}>
                    Sample text preview
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Table Density */}
          <div className="space-y-3">
            <Label className="text-base font-semibold dark:text-slate-200">Table Density</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(['compact', 'comfortable'] as const).map((density) => (
                <button
                  key={density}
                  onClick={() => setTableDensity(density)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    tableDensity === density
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/40 text-slate-900 dark:text-slate-100'
                      : 'border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] hover:border-slate-300 dark:hover:border-[hsl(217.2,32.6%,30%)] bg-white dark:bg-[hsl(217.2,32.6%,17.5%)] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{density}</span>
                    {tableDensity === density && (
                      <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <p className={`text-xs ${
                    tableDensity === density 
                      ? 'text-slate-600 dark:text-slate-300' 
                      : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {density === 'compact' 
                      ? 'Tighter spacing, more rows visible' 
                      : 'More breathing room, easier to read'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: LAYOUT & NAVIGATION */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Layout className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Layout & Navigation</CardTitle>
              <CardDescription className="mt-1">
                Configure default landing pages and navigation behavior
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-semibold dark:text-slate-200">Default Landing Page</Label>
            <Select value={defaultLandingPage} onValueChange={(value: 'dashboard' | 'inventory' | 'quality') => setDefaultLandingPage(value)}>
              <SelectTrigger className="w-full md:w-80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="quality">Quality & Compliance</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">Page to show after login</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium dark:text-slate-200">Sidebar Expanded by Default</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Show sidebar menu expanded when page loads</p>
              </div>
              <Button
                variant={sidebarExpanded ? "default" : "outline"}
                size="sm"
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="ml-4"
              >
                {sidebarExpanded ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium">Remember Sidebar State</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Remember sidebar expanded/collapsed state across sessions</p>
              </div>
              <Button
                variant={rememberSidebarState ? "default" : "outline"}
                size="sm"
                onClick={() => setRememberSidebarState(!rememberSidebarState)}
                className="ml-4"
              >
                {rememberSidebarState ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium">Sticky Headers</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Keep table headers visible while scrolling</p>
              </div>
              <Button
                variant={stickyHeaders ? "default" : "outline"}
                size="sm"
                onClick={() => setStickyHeaders(!stickyHeaders)}
                className="ml-4"
              >
                {stickyHeaders ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: DATE & TIME */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Date & Time</CardTitle>
              <CardDescription className="mt-1">
                Configure date formats, time display, and timezone settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-base font-semibold dark:text-slate-200">Date Format</Label>
              <Select value={dateFormat} onValueChange={(value: 'MM/DD/YYYY' | 'DD/MM/YYYY') => setDateFormat(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold dark:text-slate-200">Time Format</Label>
              <Select value={timeFormat} onValueChange={(value: '12-hour' | '24-hour') => setTimeFormat(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12-hour">12-hour (AM/PM)</SelectItem>
                  <SelectItem value="24-hour">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold dark:text-slate-200">Timezone</Label>
              <Select value={timezone} onValueChange={(value) => setTimezone(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (System)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold dark:text-slate-200">Week Start Day</Label>
              <Select value={weekStartDay} onValueChange={(value: 'monday' | 'sunday') => setWeekStartDay(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4: DATA DISPLAY */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Table className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Data Display</CardTitle>
              <CardDescription className="mt-1">
                Configure how data is presented in tables and lists (UI presentation only)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-base font-semibold dark:text-slate-200">Default Table Page Size</Label>
              <Select value={defaultPageSize.toString()} onValueChange={(value) => setDefaultPageSize(parseInt(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="25">25 rows</SelectItem>
                  <SelectItem value="50">50 rows</SelectItem>
                  <SelectItem value="100">100 rows</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 dark:text-slate-400">Number of rows shown per page in data tables</p>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold dark:text-slate-200">Numeric Format - Decimal Places</Label>
              <Select value={decimalPlaces.toString()} onValueChange={(value) => setDecimalPlaces(parseInt(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 decimal places</SelectItem>
                  <SelectItem value="1">1 decimal place</SelectItem>
                  <SelectItem value="2">2 decimal places</SelectItem>
                  <SelectItem value="3">3 decimal places</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 dark:text-slate-400">Decimal precision for quantity displays</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium dark:text-slate-200">Highlight Near-Expiry Rows</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Visual highlight for batches approaching expiry</p>
              </div>
              <Button
                variant={highlightNearExpiry ? "default" : "outline"}
                size="sm"
                onClick={() => setHighlightNearExpiry(!highlightNearExpiry)}
                className="ml-4"
              >
                {highlightNearExpiry ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium dark:text-slate-200">Highlight Quarantined Stock</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Visual highlight for stock in quarantine status</p>
              </div>
              <Button
                variant={highlightQuarantine ? "default" : "outline"}
                size="sm"
                onClick={() => setHighlightQuarantine(!highlightQuarantine)}
                className="ml-4"
              >
                {highlightQuarantine ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 5: NOTIFICATIONS (SUMMARY ONLY) */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Notifications</CardTitle>
              <CardDescription className="mt-1">
                Notification preferences summary (detailed settings available in Notifications section)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium text-green-900">Email Notifications</Label>
                <p className="text-xs text-green-700">Receive notifications via email</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-green-700">ON</span>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium text-green-900">In-App Notifications</Label>
                <p className="text-xs text-green-700">Show notifications within the application</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-green-700">ON</span>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium text-red-900">Critical Alerts</Label>
                <p className="text-xs text-red-700">Always enabled for safety and compliance</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-red-700">Always ON</span>
                <CheckCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Link href="/dashboard/settings/notifications">
                <Button variant="outline" className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Manage Notification Settings
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <p className="text-xs text-slate-500 mt-2 text-center">
                For detailed notification preferences, visit the Notifications section
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 6: ACCESSIBILITY */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Accessibility className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Accessibility</CardTitle>
              <CardDescription className="mt-1">
                Configure accessibility features for improved usability
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium dark:text-slate-200">High Contrast Mode</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Increase contrast for better visibility</p>
              </div>
              <Button
                variant={highContrast ? "default" : "outline"}
                size="sm"
                onClick={() => setHighContrast(!highContrast)}
                className="ml-4"
              >
                {highContrast ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium dark:text-slate-200">Reduced Motion</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Minimize animations and transitions</p>
              </div>
              <Button
                variant={reducedMotion ? "default" : "outline"}
                size="sm"
                onClick={() => setReducedMotion(!reducedMotion)}
                className="ml-4"
              >
                {reducedMotion ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium dark:text-slate-200">Keyboard Focus Highlights</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Show visible focus indicators for keyboard navigation</p>
              </div>
              <Button
                variant={keyboardFocus ? "default" : "outline"}
                size="sm"
                onClick={() => setKeyboardFocus(!keyboardFocus)}
                className="ml-4"
              >
                {keyboardFocus ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}