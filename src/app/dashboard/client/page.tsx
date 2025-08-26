'use client'

import { RequireRole } from '@/contexts/auth-context'
import { useTranslations } from '@/lib/i18n-context'
import { useServices, useServiceCategories, useProfile, useClientDashboardStats } from '@/lib/hooks/use-api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  Star, 
  Plus,
  Clock,
  MapPin,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function ClientDashboard() {
  const { t } = useTranslations()
  const { data: services, isLoading: servicesLoading } = useServices()
  const { data: categories, isLoading: categoriesLoading } = useServiceCategories()  
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: stats, isLoading: statsLoading } = useClientDashboardStats()

  const isLoading = profileLoading || statsLoading

  return (
    <RequireRole roles={['client']}>
      <div className="space-y-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {profile?.firstName 
                ? t('dashboard.client.welcome_name', `Welcome back, ${profile.firstName}!`, { name: profile.firstName })
                : t('dashboard.client.welcome', 'Welcome back!')
              }
            </h1>
            <p className="text-gray-600">
              {t('dashboard.client.subtitle', 'Find and book trusted professionals for your care needs.')}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : stats?.activeBookings || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.monthlyBookings > 0 ? `+${stats.monthlyBookings} this month` : 'No bookings yet'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorite Professionals</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : stats?.favoritePros || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ready to book again
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : stats?.unreadMessages || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  New responses available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reviews Given</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : stats?.reviewsGiven || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Help others choose
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
                  Book a Service
                </CardTitle>
                <CardDescription>
                  Find and book trusted professionals near you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {categories?.slice(0, 4).map((category) => (
                    <Button key={category.id} asChild variant="outline" size="sm">
                      <Link href={`/dashboard/client/services?category=${category.slug}`}>
                        {category.name}
                      </Link>
                    </Button>
                  ))}
                </div>
                <Button asChild className="w-full">
                  <Link href="/dashboard/client/services">
                    Browse All Services
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest bookings and interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Loading recent activity...
                    </div>
                  ) : stats?.recentActivity?.length > 0 ? (
                    stats.recentActivity.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.status === 'completed' ? 'bg-green-500' :
                          activity.status === 'confirmed' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.status === 'completed' ? 'Booking completed' :
                             activity.status === 'confirmed' ? 'Booking confirmed' :
                             'New booking'} with {activity.professionalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.serviceName} • {format(new Date(activity.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No recent activity
                    </div>
                  )}
                </div>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href="/dashboard/client/activity">
                    View All Activity
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Your scheduled services for the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading appointments...
                </div>
              ) : stats?.upcomingAppointments?.length > 0 ? (
                <div className="space-y-4">
                  {stats.upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {appointment.professionalInitials}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{appointment.professionalName}</h3>
                          <p className="text-sm text-gray-500">{appointment.serviceName}</p>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {format(new Date(appointment.scheduledDate), 'MMM d, yyyy h:mm a')}
                            <MapPin className="w-3 h-3 ml-3 mr-1" />
                            Your Location
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Message
                        </Button>
                        <Button size="sm">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming appointments
                </div>
              )}
              
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/dashboard/client/bookings">
                  View All Bookings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
    </RequireRole>
  )
}