'use client'

import { RequireRole } from '@/contexts/auth-context'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Star, 
  TrendingUp,
  Clock,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react'
import Link from 'next/link'

export default function ProfessionalDashboard() {
  return (
    <RequireRole roles={['pro']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Professional Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your services, clients, and earnings all in one place.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month's Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,847</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">
                  +3 new this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">
                  Next 3 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8</div>
                <p className="text-xs text-muted-foreground">
                  Based on 127 reviews
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link href="/dashboard/professional/calendar/new">
                    <Calendar className="w-4 h-4 mr-2" />
                    Add Appointment
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/dashboard/professional/services/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Service
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/dashboard/professional/clients">
                    <Users className="w-4 h-4 mr-2" />
                    View Clients
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/dashboard/professional/messages">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
                <CardDescription>
                  Your professional metrics this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Booking Rate</span>
                    <span className="text-sm text-gray-600">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm text-gray-600">&lt; 2 hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Client Satisfaction</span>
                    <span className="text-sm text-gray-600">4.8/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                Your appointments for today, {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Emma Wilson</h3>
                      <p className="text-sm text-gray-500">House Cleaning</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        9:00 AM - 12:00 PM (Completed)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600">$75</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 font-medium">MJ</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Michael Johnson</h3>
                      <p className="text-sm text-gray-500">Elderly Care</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        2:00 PM - 6:00 PM
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold">$120</span>
                    <Button size="sm">Start</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Lisa Chen</h3>
                      <p className="text-sm text-gray-500">Childcare</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        7:00 PM - 10:00 PM (Pending Confirmation)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-yellow-600">$90</span>
                    <Button variant="outline" size="sm">Confirm</Button>
                  </div>
                </div>
              </div>
              
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/dashboard/professional/calendar">
                  View Full Calendar
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>
                Latest communications with your clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">SL</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Sarah Lopez</p>
                    <p className="text-sm text-gray-600 truncate">
                      Hi! Could we reschedule tomorrow's appointment to 3 PM instead?
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm">Reply</Button>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">RW</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Robert Williams</p>
                    <p className="text-sm text-gray-600 truncate">
                      Thank you for the excellent service today! Left a 5-star review.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm">Reply</Button>
                </div>
              </div>
              
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/dashboard/professional/messages">
                  View All Messages
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RequireRole>
  )
}