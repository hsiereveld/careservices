'use client'

import { RequireRole } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Building,
  UserCheck,
  Calendar,
  PieChart,
  AlertTriangle,
  Plus,
  Star,
  Target
} from 'lucide-react'
import Link from 'next/link'

export default function FranchiseDashboard() {
  return (
    <RequireRole roles={['franchise']}>
      <div className="space-y-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Franchise Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your franchise operations, professionals, and business performance.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$24,847</div>
                <p className="text-xs text-muted-foreground">
                  +18% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Professionals</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  +5 new this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  +23% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.7</div>
                <p className="text-xs text-muted-foreground">
                  Across all services
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Business Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
                <CardDescription>
                  Key performance indicators for your franchise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Revenue Target</span>
                    <span className="text-sm text-gray-600">83% ($24.8K / $30K)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '83%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Professional Utilization</span>
                    <span className="text-sm text-gray-600">76%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Customer Satisfaction</span>
                    <span className="text-sm text-gray-600">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common franchise management tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link href="/dashboard/franchise/professionals/invite">
                    <Plus className="w-4 h-4 mr-2" />
                    Invite New Professional
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/dashboard/franchise/analytics">
                    <PieChart className="w-4 h-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/dashboard/franchise/reports">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Generate Report
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/dashboard/franchise/settings">
                    <Building className="w-4 h-4 mr-2" />
                    Franchise Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Alerts & Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Important Alerts
              </CardTitle>
              <CardDescription>
                Items that require your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-800">3 Professional Applications Pending</h4>
                    <p className="text-sm text-yellow-700">Review and approve new professional applications.</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-800">Monthly Performance Report Ready</h4>
                    <p className="text-sm text-blue-700">Your September performance report is ready for review.</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Report
                  </Button>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-800">2 Professionals Need Recertification</h4>
                    <p className="text-sm text-red-700">Background checks and certifications expiring soon.</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Professionals */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Professionals</CardTitle>
              <CardDescription>
                Your highest-rated and most active professionals this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 font-medium">MS</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Maria Santos</h3>
                      <p className="text-sm text-gray-500">House Cleaning • 48 bookings</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                        4.9 rating • $3,240 earned
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Top Performer
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 font-medium">JD</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">John Davis</h3>
                      <p className="text-sm text-gray-500">Elderly Care • 32 bookings</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                        4.8 rating • $2,880 earned
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Consistent
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 font-medium">SJ</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Sarah Johnson</h3>
                      <p className="text-sm text-gray-500">Childcare • 41 bookings</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                        4.9 rating • $2,950 earned
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Rising Star
                    </span>
                  </div>
                </div>
              </div>
              
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/dashboard/franchise/professionals">
                  View All Professionals
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
    </RequireRole>
  )
}