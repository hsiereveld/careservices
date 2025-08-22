'use client'

import { RequireRole } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  MapPin, 
  Star, 
  Clock,
  Filter,
  Heart,
  User
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const serviceCategories = [
  { id: 'cleaning', name: 'House Cleaning', icon: '🏠', count: 24 },
  { id: 'elderly-care', name: 'Elderly Care', icon: '👴', count: 18 },
  { id: 'childcare', name: 'Childcare', icon: '👶', count: 32 },
  { id: 'pet-care', name: 'Pet Care', icon: '🐕', count: 15 },
  { id: 'gardening', name: 'Gardening', icon: '🌱', count: 12 },
  { id: 'tutoring', name: 'Tutoring', icon: '📚', count: 8 },
]

const featuredProfessionals = [
  {
    id: 1,
    name: 'Maria Santos',
    service: 'House Cleaning',
    rating: 4.9,
    reviews: 127,
    hourlyRate: 25,
    image: 'MS',
    badge: 'Top Rated',
    availability: 'Available today'
  },
  {
    id: 2,
    name: 'John Davis',
    service: 'Elderly Care',
    rating: 4.8,
    reviews: 89,
    hourlyRate: 30,
    image: 'JD',
    badge: 'Verified',
    availability: 'Available tomorrow'
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    service: 'Childcare',
    rating: 4.9,
    reviews: 156,
    hourlyRate: 22,
    image: 'SJ',
    badge: 'Background Check',
    availability: 'Available today'
  },
]

export default function ClientServicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  return (
    <RequireRole roles={['client']}>
      <div className="space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Find Services
            </h1>
            <p className="text-gray-600">
              Discover and book trusted professionals in your area.
            </p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search for services, professionals, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Near me
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Service Categories</CardTitle>
              <CardDescription>
                Browse professionals by service type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {serviceCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 border rounded-lg text-center hover:shadow-md transition-shadow ${
                      selectedCategory === category.id 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h3 className="font-medium text-sm text-gray-900">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.count} pros</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Professionals */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Professionals</CardTitle>
              <CardDescription>
                Top-rated professionals available in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProfessionals.map((pro) => (
                  <div key={pro.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">{pro.image}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{pro.name}</h3>
                          <p className="text-sm text-gray-500">{pro.service}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="p-2">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{pro.rating}</span>
                          <span className="text-sm text-gray-500">({pro.reviews})</span>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {pro.badge}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {pro.availability}
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold">${pro.hourlyRate}</span>
                          <span className="text-sm text-gray-500">/hour</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Profile
                        </Button>
                        <Button size="sm" className="flex-1">
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Emergency Services
                </CardTitle>
                <CardDescription>
                  Need immediate help? Find available professionals now
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="destructive">
                  Find Emergency Help
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Your Favorites
                </CardTitle>
                <CardDescription>
                  Quick access to your trusted professionals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/client/favorites">
                    View Favorites
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
    </RequireRole>
  )
}