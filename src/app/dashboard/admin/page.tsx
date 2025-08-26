'use client'

import { RequireRole } from '@/contexts/auth-context'
import { useTranslations } from '@/lib/i18n-context'
import { useAdminDashboardStats } from '@/lib/hooks/use-api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Building, 
  DollarSign, 
  TrendingUp,
  Shield,
  AlertTriangle,
  Activity,
  Database,
  Settings,
  UserCheck,
  BarChart,
  Globe,
  Server
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface Alert {
  id: number
  type: string
  title: string
  description: string
  severity: 'high' | 'medium' | 'low'
}

interface AdminActivity {
  id: number
  action: string
  timestamp: string
  type: string
}

export default function AdminDashboard() {
  const { t } = useTranslations()
  const { data: stats, isLoading } = useAdminDashboardStats()

  return (
    <RequireRole roles={['admin']}>
      <div className="space-y-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              System Administration
            </h1>
            <p className="text-gray-600">
              Monitor and manage the entire CareService platform.
            </p>
          </div>

          {/* System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : stats?.totalUsers?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.newUsersThisWeek || 0} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Franchises</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : stats?.activeFranchises || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across multiple regions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : `$${(stats?.monthlyRevenue || 0).toLocaleString()}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.revenueChange > 0 ? '+' : ''}{stats?.revenueChange || 0}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : `${stats?.systemHealth?.uptime || 99.9}%`}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Health & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  System Health
                </CardTitle>
                <CardDescription>
                  Current system status and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">API Response Time</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {isLoading ? '...' : `${stats?.systemHealth?.apiResponseTime || 0}ms`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Database Performance</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {isLoading ? '...' : stats?.systemHealth?.databasePerformance || 'Optimal'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      (stats?.systemHealth?.serverLoad || 0) > 80 ? 'bg-red-500' :
                      (stats?.systemHealth?.serverLoad || 0) > 60 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <span className="text-sm font-medium">Server Load</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {isLoading ? '...' : `${stats?.systemHealth?.serverLoad || 0}%`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Security Status</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {isLoading ? '...' : stats?.systemHealth?.securityStatus || 'Secure'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Alerts
                </CardTitle>
                <CardDescription>
                  Issues requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Loading alerts...
                  </div>
                ) : stats?.criticalAlerts?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.criticalAlerts.map((alert: Alert) => (
                      <div 
                        key={alert.id} 
                        className={`flex items-start space-x-3 p-3 border rounded-lg ${
                          alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                          'bg-yellow-50 border-yellow-200'
                        }`}
                      >
                        <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                          alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                        <div className="flex-1">
                          <h4 className={`font-medium text-sm ${
                            alert.severity === 'high' ? 'text-red-800' : 'text-yellow-800'
                          }`}>
                            {alert.title}
                          </h4>
                          <p className={`text-xs ${
                            alert.severity === 'high' ? 'text-red-700' : 'text-yellow-700'
                          }`}>
                            {alert.description}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center py-4">
                      <Button variant="outline" size="sm">
                        View All Alerts
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-green-600">
                    No critical alerts at this time
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks and system management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button asChild variant="outline" className="h-16 flex-col">
                  <Link href="/dashboard/admin/users">
                    <Users className="w-6 h-6 mb-2" />
                    Manage Users
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-16 flex-col">
                  <Link href="/dashboard/admin/franchises">
                    <Building className="w-6 h-6 mb-2" />
                    Franchises
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-16 flex-col">
                  <Link href="/dashboard/admin/security">
                    <Shield className="w-6 h-6 mb-2" />
                    Security
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-16 flex-col">
                  <Link href="/dashboard/admin/analytics">
                    <BarChart className="w-6 h-6 mb-2" />
                    Analytics
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-16 flex-col">
                  <Link href="/dashboard/admin/settings">
                    <Settings className="w-6 h-6 mb-2" />
                    Settings
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-16 flex-col">
                  <Link href="/dashboard/admin/professionals">
                    <UserCheck className="w-6 h-6 mb-2" />
                    Professionals
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-16 flex-col">
                  <Link href="/dashboard/admin/reports">
                    <Database className="w-6 h-6 mb-2" />
                    Reports
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-16 flex-col">
                  <Link href="/dashboard/admin/system">
                    <Server className="w-6 h-6 mb-2" />
                    System
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Platform Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
                <CardDescription>
                  User acquisition and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">New Users (30 days)</span>
                    <span className="text-sm text-gray-600">
                      +{isLoading ? '...' : stats?.platformGrowth?.newUsers30Days?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((stats?.platformGrowth?.newUsers30Days || 0) / 1000 * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Professionals</span>
                    <span className="text-sm text-gray-600">
                      {isLoading ? '...' : stats?.platformGrowth?.activeProfessionals?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((stats?.platformGrowth?.activeProfessionals || 0) / 5000 * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Booking Completion Rate</span>
                    <span className="text-sm text-gray-600">
                      {isLoading ? '...' : `${stats?.platformGrowth?.bookingCompletionRate || 0}%`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${stats?.platformGrowth?.bookingCompletionRate || 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Admin Activity</CardTitle>
                <CardDescription>
                  Latest administrative actions and changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Loading activity...
                  </div>
                ) : stats?.recentActivity?.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentActivity.map((activity: AdminActivity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No recent activity
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
    </RequireRole>
  )
}