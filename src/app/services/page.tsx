'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search,
  MapPin,
  Euro,
  Star,
  Filter,
  ChevronDown
} from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string | null
  categoryId: string
  basePrice: number
  priceUnit: string
  serviceRadius: number
  rating: number | null
  totalReviews: number
  providerName?: string
}

interface ServiceCategory {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [sortBy, setSortBy] = useState('relevance')

  useEffect(() => {
    loadCategories()
    searchServices()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/service-categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const searchServices = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('q', searchQuery)
      if (selectedCategory) params.append('categoryId', selectedCategory)
      if (postalCode) params.append('location', postalCode)
      if (sortBy) params.append('sortBy', sortBy)

      const response = await fetch(`/api/services/search?${params}`)
      if (response.ok) {
        const data = await response.json()
        setServices(data.services || [])
      }
    } catch (error) {
      console.error('Error searching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchServices()
  }

  const getPriceUnitLabel = (unit: string) => {
    switch(unit) {
      case 'hour': return 'per uur'
      case 'day': return 'per dag'
      case 'piece': return 'per stuk'
      case 'service': return 'per dienst'
      case 'km': return 'per km'
      default: return unit
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">Vind de Perfecte Dienst</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Ontdek professionele dienstverleners in jouw buurt
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Zoek naar diensten..."
                    className="pl-10 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Postcode"
                    className="pl-10 h-12"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    maxLength={5}
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="h-12">
                Zoeken
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <select
              className="px-3 py-1.5 rounded-md border border-input bg-background"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                searchServices()
              }}
            >
              <option value="">Alle categorieën</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
            <select
              className="px-3 py-1.5 rounded-md border border-input bg-background"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                searchServices()
              }}
            >
              <option value="relevance">Relevantie</option>
              <option value="price_asc">Prijs (laag naar hoog)</option>
              <option value="price_desc">Prijs (hoog naar laag)</option>
              <option value="rating">Beste beoordeling</option>
              <option value="distance">Dichtsbij</option>
            </select>
          </div>

          {/* Results count */}
          <div className="ml-auto text-sm text-muted-foreground">
            {services.length} diensten gevonden
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Diensten zoeken...</p>
          </div>
        ) : services.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Geen diensten gevonden</h3>
              <p className="text-muted-foreground">
                Probeer je zoekopdracht aan te passen of verwijder filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map(service => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription>
                        {categories.find(c => c.id === service.categoryId)?.name}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      <Euro className="h-3 w-3 mr-1" />
                      {service.basePrice}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {service.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    {/* Price */}
                    <div className="flex items-center gap-2 text-sm">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">€{service.basePrice}</span>
                      <span className="text-muted-foreground">
                        {getPriceUnitLabel(service.priceUnit)}
                      </span>
                    </div>

                    {/* Service Area */}
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{service.serviceRadius} km service gebied</span>
                    </div>

                    {/* Rating */}
                    {service.rating && (
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{service.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">
                          ({service.totalReviews} reviews)
                        </span>
                      </div>
                    )}

                    {/* Provider */}
                    {service.providerName && (
                      <div className="text-sm text-muted-foreground">
                        Door: {service.providerName}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1" size="sm">
                      Meer Info
                    </Button>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}