'use client'

import { RequireRole } from '@/contexts/auth-context'
import { useTranslations } from '@/lib/i18n-context'
import { useProfessionalDashboardStats } from '@/lib/hooks/use-api'
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
import { format } from 'date-fns'

export default function ProfessionalDashboard() {
  const { t } = useTranslations()
  const { data: stats, isLoading } = useProfessionalDashboardStats()

  return (
    <RequireRole roles={['pro']}>
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
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : `$${stats?.monthlyEarnings?.toFixed(2) || '0.00'}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.earningsChange > 0 ? '+' : ''}{stats?.earningsChange || 0}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : stats?.activeClients || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.newClientsThisWeek || 0} new this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : stats?.upcomingAppointments || 0}
                </div>
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
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : stats?.averageRating?.toFixed(1) || '0.0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on {stats?.totalReviews || 0} reviews
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
                    <span className="text-sm text-gray-600">{stats?.performanceMetrics?.bookingRate || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${stats?.performanceMetrics?.bookingRate || 0}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm text-gray-600">
                      {stats?.performanceMetrics?.responseTime > 0 
                        ? `< ${Math.round(stats.performanceMetrics.responseTime)} hours`
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${stats?.performanceMetrics?.responseTime > 0 
                          ? Math.min((stats.performanceMetrics.responseTime / 24) * 100, 100) 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Client Satisfaction</span>
                    <span className="text-sm text-gray-600">{stats?.averageRating?.toFixed(1) || '0.0'}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(stats?.averageRating || 0) * 20}%` }}
                    ></div>
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
                Your appointments for today, {format(new Date(), 'MMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading today's schedule...
                </div>
              ) : stats?.todaySchedule?.length > 0 ? (
                <div className="space-y-4">
                  {stats.todaySchedule.map((appointment) => {
                    const isCompleted = appointment.status === 'completed'
                    const isPending = appointment.status === 'pending'
                    
                    return (
                      <div 
                        key={appointment.id} 
                        className={`flex items-center justify-between p-4 border rounded-lg ${
                          isCompleted ? 'bg-green-50 border-green-200' :
                          isPending ? 'bg-yellow-50 border-yellow-200' :
                          'bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isCompleted ? 'bg-green-100' :
                            isPending ? 'bg-yellow-100' :
                            'bg-primary-100'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            ) : isPending ? (
                              <AlertCircle className="w-6 h-6 text-yellow-600" />
                            ) : (
                              <span className="text-primary-600 font-medium">
                                {appointment.clientName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{appointment.clientName}</h3>
                            <p className="text-sm text-gray-500">{appointment.serviceName}</p>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {format(new Date(appointment.scheduledDate), 'h:mm a')} 
                              {isCompleted ? ' (Completed)' : isPending ? ' (Pending Confirmation)' : ''}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold ${
                            isCompleted ? 'text-green-600' :
                            isPending ? 'text-yellow-600' :
                            'text-gray-900'
                          }`}>
                            ${appointment.amount?.toFixed(2) || '0.00'}
                          </span>
                          {isCompleted ? (
                            <span className="text-sm text-green-600">✓</span>
                          ) : isPending ? (
                            <Button variant="outline" size="sm">Confirm</Button>
                          ) : (
                            <Button size="sm">Start</Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No appointments scheduled for today
                </div>
              )}
              
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
              <div className="text-center py-8 text-muted-foreground">
                Messages system coming soon...
              </div>
              
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/dashboard/professional/messages">
                  View All Messages
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
    </RequireRole>
  )
}