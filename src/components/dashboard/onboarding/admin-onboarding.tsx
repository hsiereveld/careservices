'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Shield, 
  Settings, 
  BarChart,
  CheckCircle,
  Database,
  Bell,
  Users,
  Lock,
  Server
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
}

interface AdminOnboardingProps {
  step: OnboardingStep
  onStepComplete: (stepId: string) => void
  isCompleted: boolean
}

export function AdminOnboarding({ step, onStepComplete, isCompleted }: AdminOnboardingProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [monitoringSettings, setMonitoringSettings] = useState<string[]>([])

  const permissionGroups = [
    { id: 'user_management', name: 'User Management', description: 'Create, edit, and deactivate user accounts' },
    { id: 'franchise_oversight', name: 'Franchise Oversight', description: 'Monitor and manage franchise operations' },
    { id: 'professional_approval', name: 'Professional Approval', description: 'Review and approve professional applications' },
    { id: 'system_configuration', name: 'System Configuration', description: 'Modify platform settings and features' },
    { id: 'financial_access', name: 'Financial Access', description: 'View revenue reports and transaction data' },
    { id: 'security_management', name: 'Security Management', description: 'Manage security policies and access controls' },
  ]

  const monitoringOptions = [
    { id: 'user_activity', name: 'User Activity Alerts', description: 'Unusual login patterns or account activity' },
    { id: 'system_performance', name: 'System Performance', description: 'Server load, response times, and uptime' },
    { id: 'security_events', name: 'Security Events', description: 'Failed logins, unauthorized access attempts' },
    { id: 'business_metrics', name: 'Business Metrics', description: 'Revenue, bookings, and growth indicators' },
    { id: 'error_tracking', name: 'Error Tracking', description: 'Application errors and system failures' },
  ]

  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) 
        ? prev.filter(id => id !== permId)
        : [...prev, permId]
    )
  }

  const toggleMonitoring = (monitorId: string) => {
    setMonitoringSettings(prev => 
      prev.includes(monitorId) 
        ? prev.filter(id => id !== monitorId)
        : [...prev, monitorId]
    )
  }

  const handleComplete = () => {
    onStepComplete(step.id)
  }

  const renderStepContent = () => {
    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Admin Access Setup
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Configure your administrative access to the CareService platform. 
                You'll have oversight of all operations, users, and system settings.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Card className="text-center p-4">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium">User Management</h4>
                <p className="text-sm text-gray-500">Oversee all platform users</p>
              </Card>
              <Card className="text-center p-4">
                <BarChart className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium">Analytics & Reports</h4>
                <p className="text-sm text-gray-500">Monitor platform performance</p>
              </Card>
              <Card className="text-center p-4">
                <Server className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-medium">System Control</h4>
                <p className="text-sm text-gray-500">Manage platform settings</p>
              </Card>
            </div>
            <Button onClick={handleComplete} className="w-full max-w-md">
              Begin Admin Setup
            </Button>
          </div>
        )

      case 'permissions':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Lock className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Configure Access Permissions</h3>
              <p className="text-gray-600">Select the administrative functions you need access to</p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-3">
              {permissionGroups.map((permission) => (
                <button
                  key={permission.id}
                  onClick={() => togglePermission(permission.id)}
                  className={`w-full p-4 text-left border rounded-lg transition-all ${
                    selectedPermissions.includes(permission.id)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{permission.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                    </div>
                    {selectedPermissions.includes(permission.id) && (
                      <CheckCircle className="w-5 h-5 text-primary-600 ml-3" />
                    )}
                  </div>
                </button>
              ))}
              
              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Security Note</h4>
                    <p className="text-sm text-yellow-700">
                      These permissions can be modified later by other administrators. 
                      All administrative actions are logged for security auditing.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleComplete} 
                className="w-full"
                disabled={selectedPermissions.length === 0}
              >
                Save Permissions
              </Button>
            </div>
          </div>
        )

      case 'monitoring':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Bell className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Setup Monitoring & Alerts</h3>
              <p className="text-gray-600">Configure what you want to be notified about</p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="space-y-3">
                {monitoringOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleMonitoring(option.id)}
                    className={`w-full p-4 text-left border rounded-lg transition-all ${
                      monitoringSettings.includes(option.id)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{option.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                      {monitoringSettings.includes(option.id) && (
                        <CheckCircle className="w-5 h-5 text-primary-600 ml-3" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              <Card className="p-4">
                <h4 className="font-medium mb-3">Notification Methods</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Email notifications</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Dashboard alerts</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">SMS for critical issues</span>
                  </label>
                </div>
              </Card>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <BarChart className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Dashboard Analytics</h4>
                    <p className="text-sm text-blue-700">
                      Your admin dashboard will show real-time metrics for all selected monitoring options. 
                      You can customize the layout and frequency of updates.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleComplete} className="w-full">
                Complete Setup
              </Button>
            </div>
          </div>
        )

      default:
        return <div>Unknown step</div>
    }
  }

  return (
    <div className="py-6">
      {renderStepContent()}
    </div>
  )
}