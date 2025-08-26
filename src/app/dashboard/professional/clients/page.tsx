'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { RequireRole } from '@/contexts/auth-context'
import { 
  Search,
  User,
  Calendar,
  DollarSign,
  Star,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  FileText,
  TrendingUp,
  Filter
} from 'lucide-react'
import { format } from 'date-fns'

interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  totalBookings: number
  totalSpent: number
  averageRating: number
  lastBooking?: string
  nextBooking?: string
  status: 'active' | 'inactive' | 'new'
  joinedDate: string
  notes?: string
}

interface ClientStats {
  totalClients: number
  activeClients: number
  newClientsThisMonth: number
  totalRevenue: number
  averageBookingValue: number
  repeatClientRate: number
}

export default function ProfessionalClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [stats, setStats] = useState<ClientStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'new'>('all')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  useEffect(() => {
    loadClients()
    loadStats()
  }, [])

  useEffect(() => {
    filterClients()
  }, [searchTerm, filterStatus, clients])

  const loadClients = async () => {
    try {
      const response = await fetch('/api/professional/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data.clients || [])
      }
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/professional/clients/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error loading client stats:', error)
    }
  }

  const filterClients = () => {
    let filtered = [...clients]

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(client => client.status === filterStatus)
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(client =>
        client.firstName.toLowerCase().includes(search) ||
        client.lastName.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search) ||
        client.phone?.toLowerCase().includes(search)
      )
    }

    setFilteredClients(filtered)
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">New</Badge>
      default:
        return null
    }
  }

  const ClientDetailsModal = ({ client }: { client: Client }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{client.firstName} {client.lastName}</CardTitle>
              <CardDescription>Client since {format(new Date(client.joinedDate), 'MMM d, yyyy')}</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedClient(null)}
            >
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{client.address}, {client.city}</span>
                </div>
              )}
            </div>
          </div>

          {/* Booking History */}
          <div>
            <h3 className="font-semibold mb-3">Booking History</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Bookings</div>
                <div className="text-2xl font-bold">{client.totalBookings}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Spent</div>
                <div className="text-2xl font-bold">€{client.totalSpent.toFixed(2)}</div>
              </div>
              {client.lastBooking && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Last Booking</div>
                  <div className="font-medium">{format(new Date(client.lastBooking), 'MMM d, yyyy')}</div>
                </div>
              )}
              {client.nextBooking && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Next Booking</div>
                  <div className="font-medium text-green-700">{format(new Date(client.nextBooking), 'MMM d, yyyy')}</div>
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          {client.averageRating > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Rating</h3>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(client.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="font-medium">{client.averageRating.toFixed(1)}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          {client.notes && (
            <div>
              <h3 className="font-semibold mb-3">Notes</h3>
              <p className="text-sm text-muted-foreground">{client.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading clients...</p>
        </div>
      </div>
    )
  }

  return (
    <RequireRole roles={['pro']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Clients</h1>
          <p className="text-muted-foreground">Manage and view your client relationships</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClients}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +{stats.newClientsThisMonth} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeClients}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Booked in last 30 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{stats.totalRevenue.toFixed(0)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg €{stats.averageBookingValue.toFixed(2)}/booking
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Repeat Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.repeatClientRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Clients with 2+ bookings
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('active')}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('inactive')}
                >
                  Inactive
                </Button>
                <Button
                  variant={filterStatus === 'new' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('new')}
                >
                  New
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No clients found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search criteria' : 'Start building your client base'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClients.map(client => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedClient(client)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {client.firstName} {client.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">{client.email}</div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {client.totalBookings} bookings
                          </span>
                          <span className="text-xs text-muted-foreground">
                            €{client.totalSpent.toFixed(2)} total
                          </span>
                          {client.averageRating > 0 && (
                            <span className="text-xs flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                              {client.averageRating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {client.nextBooking && (
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Next booking</div>
                          <div className="text-sm font-medium text-green-600">
                            {format(new Date(client.nextBooking), 'MMM d')}
                          </div>
                        </div>
                      )}
                      {getStatusBadge(client.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Details Modal */}
        {selectedClient && <ClientDetailsModal client={selectedClient} />}
      </div>
    </RequireRole>
  )
}