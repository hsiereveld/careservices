'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  MapPin,
  Euro,
  Clock,
  Calendar,
  Package
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

interface Service {
  id: string
  name: string
  description: string | null
  categoryId: string
  basePrice: number
  priceUnit: string
  serviceRadius: number
  isActive: boolean
  createdAt: string
}

interface ServiceCategory {
  id: string
  name: string
  slug: string
  description: string | null
}

export default function ProfessionalServicesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    basePrice: '',
    priceUnit: 'hour',
    serviceRadius: '25'
  })

  // Check if user is a professional
  useEffect(() => {
    if (user && user.role !== 'pro') {
      router.push('/dashboard')
    }
  }, [user, router])

  // Load services and categories
  useEffect(() => {
    loadServices()
    loadCategories()
  }, [])

  const loadServices = async () => {
    try {
      const response = await fetch('/api/services?myServices=true')
      if (response.ok) {
        const data = await response.json()
        setServices(data.services || [])
      }
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const serviceData = {
      name: formData.name,
      description: formData.description || null,
      categoryId: formData.categoryId,
      basePrice: parseFloat(formData.basePrice),
      priceUnit: formData.priceUnit,
      serviceRadius: parseInt(formData.serviceRadius)
    }

    try {
      const url = editingService 
        ? `/api/services/${editingService.id}`
        : '/api/services'
      
      const method = editingService ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      })

      if (response.ok) {
        await loadServices()
        setShowCreateForm(false)
        setEditingService(null)
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || 'Error saving service')
      }
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Error saving service')
    }
  }

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadServices()
      } else {
        const error = await response.json()
        alert(error.error || 'Error deleting service')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Error deleting service')
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description || '',
      categoryId: service.categoryId,
      basePrice: service.basePrice.toString(),
      priceUnit: service.priceUnit,
      serviceRadius: service.serviceRadius.toString()
    })
    setShowCreateForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      basePrice: '',
      priceUnit: 'hour',
      serviceRadius: '25'
    })
    setEditingService(null)
  }

  const getPriceUnitIcon = (unit: string) => {
    switch(unit) {
      case 'hour': return <Clock className="h-4 w-4" />
      case 'day': return <Calendar className="h-4 w-4" />
      case 'piece': return <Package className="h-4 w-4" />
      default: return <Euro className="h-4 w-4" />
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Diensten laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mijn Diensten</h1>
        <p className="text-muted-foreground">
          Beheer je diensten en stel je beschikbaarheid in
        </p>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingService ? 'Dienst Bewerken' : 'Nieuwe Dienst Toevoegen'}
            </CardTitle>
            <CardDescription>
              Vul de details in voor je dienst
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Naam van de dienst *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="Bijv. Huishoudelijke hulp"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categorie *</Label>
                  <select
                    id="category"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    required
                  >
                    <option value="">Selecteer categorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="price">Prijs (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                    required
                    placeholder="25.00"
                  />
                </div>

                <div>
                  <Label htmlFor="priceUnit">Prijseenheid *</Label>
                  <select
                    id="priceUnit"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.priceUnit}
                    onChange={(e) => setFormData({...formData, priceUnit: e.target.value})}
                    required
                  >
                    <option value="hour">Per uur</option>
                    <option value="day">Per dag</option>
                    <option value="piece">Per stuk</option>
                    <option value="service">Per dienst</option>
                    <option value="km">Per kilometer</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="radius">Service radius (km) *</Label>
                  <Input
                    id="radius"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.serviceRadius}
                    onChange={(e) => setFormData({...formData, serviceRadius: e.target.value})}
                    required
                    placeholder="25"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Beschrijf je dienst..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingService ? 'Opslaan' : 'Toevoegen'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false)
                    resetForm()
                  }}
                >
                  Annuleren
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add Service Button */}
      {!showCreateForm && (
        <div className="mb-6">
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nieuwe Dienst Toevoegen
          </Button>
        </div>
      )}

      {/* Services List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Nog geen diensten</h3>
              <p className="text-muted-foreground mb-4">
                Begin met het toevoegen van je eerste dienst
              </p>
              {!showCreateForm && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Eerste Dienst Toevoegen
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          services.map(service => (
            <Card key={service.id} className={!service.isActive ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>
                      {categories.find(c => c.id === service.categoryId)?.name || 'Onbekende categorie'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {service.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">€{service.basePrice}</span>
                    <span className="text-muted-foreground">
                      {getPriceUnitLabel(service.priceUnit)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{service.serviceRadius} km radius</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-muted-foreground">
                      {service.isActive ? 'Actief' : 'Inactief'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}