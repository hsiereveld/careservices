'use client'

import { RequireRole } from '@/contexts/auth-context'
import { useTranslations } from '@/lib/i18n-context'
import { useServices, useServiceCategories, useProfile } from '@/lib/hooks/use-api'
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

export default function ClientDashboard() {
  const { t } = useTranslations()
  const { data: services, isLoading: servicesLoading } = useServices()
  const { data: categories, isLoading: categoriesLoading } = useServiceCategories()  
  const { data: profile, isLoading: profileLoading } = useProfile()

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
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorite Professionals</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
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
                <div className="text-2xl font-bold">2</div>
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
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Average 4.8 stars
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
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/client/services?category=cleaning">
                      House Cleaning
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/client/services?category=elderly-care">
                      Elderly Care
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/client/services?category=childcare">
                      Childcare
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/client/services?category=pet-care">
                      Pet Care
                    </Link>
                  </Button>
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
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Booking confirmed with Maria S.
                      </p>
                      <p className="text-xs text-gray-500">House cleaning • Today 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        New message from John D.
                      </p>
                      <p className="text-xs text-gray-500">Elderly care • Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Review requested for Sarah L.
                      </p>
                      <p className="text-xs text-gray-500">Childcare • 2 days ago</p>
                    </div>
                  </div>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 font-medium">MS</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Maria Santos</h3>
                      <p className="text-sm text-gray-500">House Cleaning</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        Today, 2:00 PM - 5:00 PM
                        <MapPin className="w-3 h-3 ml-3 mr-1" />
                        Your Home
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

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 font-medium">JD</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">John Davis</h3>
                      <p className="text-sm text-gray-500">Elderly Care</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        Tomorrow, 9:00 AM - 12:00 PM
                        <MapPin className="w-3 h-3 ml-3 mr-1" />
                        Care Facility
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
              </div>
              
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