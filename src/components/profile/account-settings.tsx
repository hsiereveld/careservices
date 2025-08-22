'use client'

import { useAuth } from '@/contexts/auth-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Shield, 
  Globe, 
  Bell, 
  Eye, 
  Download, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Languages
} from 'lucide-react'
import { useState } from 'react'

export function AccountSettings() {
  const { 
    user, 
    hasConsent, 
    grantConsent, 
    revokeConsent, 
    exportData, 
    deleteAccount 
  } = useAuth()
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: hasConsent('marketing_communications'),
    profileVisibility: 'public',
    language: user?.preferredLanguage || 'nl',
    timezone: 'Europe/Amsterdam'
  })
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const handleConsentChange = async (type: string, granted: boolean) => {
    if (granted) {
      await grantConsent(type)
    } else {
      await revokeConsent(type)
    }
  }

  const handleExportData = async () => {
    try {
      await exportData()
    } catch (error) {
      console.error('Failed to export data:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type "DELETE" to confirm account deletion.')
      return
    }

    if (!confirm('Are you absolutely sure? This action cannot be undone.')) {
      return
    }

    try {
      await deleteAccount()
    } catch (error) {
      console.error('Failed to delete account:', error)
      alert('Failed to delete account. Please try again.')
    }
  }

  const languages = [
    { code: 'nl', name: 'Nederlands' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
  ]

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Bell className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive important updates via email</p>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, emailNotifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
            </div>
            <Switch
              checked={preferences.pushNotifications}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, pushNotifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Marketing Communications</p>
              <p className="text-sm text-gray-600">Receive newsletters and promotional content</p>
            </div>
            <Switch
              checked={preferences.marketingEmails}
              onCheckedChange={(checked) => {
                setPreferences(prev => ({ ...prev, marketingEmails: checked }))
                handleConsentChange('marketing_communications', checked)
              }}
            />
          </div>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Eye className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Privacy Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="profileVisibility">Profile Visibility</Label>
            <select
              id="profileVisibility"
              value={preferences.profileVisibility}
              onChange={(e) => setPreferences(prev => ({ ...prev, profileVisibility: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="public">Public - Visible to everyone</option>
              <option value="registered">Registered Users - Only visible to registered users</option>
              <option value="private">Private - Only visible to you</option>
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Data Processing Consents</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Essential Data Processing</p>
                  <p className="text-xs text-gray-600">Required for basic functionality</p>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Required</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Analytics Cookies</p>
                  <p className="text-xs text-gray-600">Help us improve our service</p>
                </div>
                <Switch
                  checked={hasConsent('analytics_cookies')}
                  onCheckedChange={(checked) => handleConsentChange('analytics_cookies', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Performance Cookies</p>
                  <p className="text-xs text-gray-600">Optimize website performance</p>
                </div>
                <Switch
                  checked={hasConsent('performance_cookies')}
                  onCheckedChange={(checked) => handleConsentChange('performance_cookies', checked)}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Localization Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Languages className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Language & Region</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              value={preferences.language}
              onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              value={preferences.timezone}
              onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Europe/Amsterdam">Europe/Amsterdam (CET)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Europe/Berlin">Europe/Berlin (CET)</option>
              <option value="America/New_York">America/New_York (EST)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Data Management</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Export Your Data</p>
              <p className="text-sm text-gray-600">Download a copy of all your data</p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-800 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          {!showDeleteConfirm ? (
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          ) : (
            <div className="space-y-3">
              <div>
                <Label htmlFor="deleteConfirm">
                  Type <strong>DELETE</strong> to confirm:
                </Label>
                <Input
                  id="deleteConfirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="mt-1"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE'}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account Permanently
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button className="bg-primary-600 hover:bg-primary-700">
          <Settings className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}