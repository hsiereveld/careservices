'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RequireRole } from '@/contexts/auth-context'
import { 
  Calendar as CalendarIcon,
  Clock,
  User,
  DollarSign,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from 'date-fns'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'

interface Appointment {
  id: string
  clientName: string
  serviceName: string
  scheduledDate: string
  duration: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  amount: number
  location?: string
  notes?: string
}

interface TimeSlot {
  time: string
  available: boolean
  appointment?: Appointment
}

export default function ProfessionalCalendarPage() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('')

  // Form state for new appointment
  const [formData, setFormData] = useState({
    clientId: '',
    serviceId: '',
    scheduledDate: '',
    duration: 60,
    notes: ''
  })

  useEffect(() => {
    loadAppointments()
  }, [currentDate, viewMode])

  const loadAppointments = async () => {
    try {
      const startDate = viewMode === 'month' 
        ? startOfMonth(currentDate)
        : viewMode === 'week'
        ? startOfWeek(currentDate, { weekStartsOn: 1 })
        : currentDate

      const endDate = viewMode === 'month'
        ? endOfMonth(currentDate)
        : viewMode === 'week'
        ? endOfWeek(currentDate, { weekStartsOn: 1 })
        : currentDate

      const response = await fetch(`/api/bookings/calendar?start=${startDate.toISOString()}&end=${endDate.toISOString()}`)
      if (response.ok) {
        const data = await response.json()
        setAppointments(data.appointments || [])
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    if (viewMode === 'month') {
      setViewMode('day')
      setCurrentDate(date)
    }
  }

  const navigatePeriod = (direction: 'prev' | 'next') => {
    const offset = direction === 'prev' ? -1 : 1
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1))
    } else if (viewMode === 'week') {
      setCurrentDate(addDays(currentDate, offset * 7))
    } else {
      setCurrentDate(addDays(currentDate, offset))
    }
  }

  const getDaysInView = () => {
    if (viewMode === 'month') {
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)
      const startWeek = startOfWeek(start, { weekStartsOn: 1 })
      const endWeek = endOfWeek(end, { weekStartsOn: 1 })
      return eachDayOfInterval({ start: startWeek, end: endWeek })
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 })
      const end = endOfWeek(currentDate, { weekStartsOn: 1 })
      return eachDayOfInterval({ start, end })
    } else {
      return [currentDate]
    }
  }

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.scheduledDate), date)
    )
  }

  const getTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const dayAppointments = getAppointmentsForDay(date)
    
    for (let hour = 8; hour < 20; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`
      const appointment = dayAppointments.find(apt => {
        const aptHour = new Date(apt.scheduledDate).getHours()
        return aptHour === hour
      })
      
      slots.push({
        time,
        available: !appointment,
        appointment
      })
    }
    
    return slots
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'completed': return 'text-blue-600 bg-blue-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return null
    }
  }

  return (
    <RequireRole roles={['pro']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">Manage your appointments and availability</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'default' : 'outline'}
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {viewMode === 'month' && format(currentDate, 'MMMM yyyy')}
                {viewMode === 'week' && `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`}
                {viewMode === 'day' && format(currentDate, 'EEEE, MMMM d, yyyy')}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigatePeriod('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigatePeriod('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading calendar...</p>
              </div>
            ) : viewMode === 'month' ? (
              /* Month View */
              <div>
                <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium">
                      {day}
                    </div>
                  ))}
                  {getDaysInView().map((date, index) => {
                    const dayAppointments = getAppointmentsForDay(date)
                    const isCurrentMonth = isSameMonth(date, currentDate)
                    const isSelectedDay = selectedDate && isSameDay(date, selectedDate)
                    const isTodayDate = isToday(date)
                    
                    return (
                      <div
                        key={index}
                        onClick={() => handleDateClick(date)}
                        className={`
                          bg-white p-2 min-h-[80px] cursor-pointer hover:bg-gray-50 transition-colors
                          ${!isCurrentMonth ? 'opacity-50' : ''}
                          ${isSelectedDay ? 'ring-2 ring-primary' : ''}
                          ${isTodayDate ? 'bg-primary-50' : ''}
                        `}
                      >
                        <div className="text-sm font-medium mb-1">
                          {format(date, 'd')}
                        </div>
                        {dayAppointments.slice(0, 2).map((apt, idx) => (
                          <div
                            key={idx}
                            className={`text-xs p-1 mb-1 rounded truncate ${getStatusColor(apt.status)}`}
                          >
                            {format(new Date(apt.scheduledDate), 'HH:mm')} {apt.clientName}
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayAppointments.length - 2} more
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : viewMode === 'day' ? (
              /* Day View */
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {getTimeSlots(currentDate).map(slot => (
                    <div
                      key={slot.time}
                      className={`
                        flex items-center gap-4 p-3 rounded-lg border
                        ${slot.available ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'}
                      `}
                    >
                      <div className="w-20 text-sm font-medium">
                        {slot.time}
                      </div>
                      {slot.appointment ? (
                        <div className="flex-1">
                          <div className={`p-3 rounded-lg ${getStatusColor(slot.appointment.status)}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  {slot.appointment.clientName}
                                </div>
                                <div className="text-sm mt-1">{slot.appointment.serviceName}</div>
                                <div className="flex items-center gap-4 mt-2 text-xs">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {slot.appointment.duration} min
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    €{slot.appointment.amount}
                                  </span>
                                  {slot.appointment.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {slot.appointment.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(slot.appointment.status)}
                                <span className="text-xs">{slot.appointment.status}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              setSelectedTimeSlot(slot.time)
                              setShowAddModal(true)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add appointment
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Week View */
              <div className="overflow-x-auto">
                <div className="grid grid-cols-8 gap-px bg-gray-200 min-w-[800px]">
                  <div className="bg-gray-50 p-2"></div>
                  {getDaysInView().map(date => (
                    <div
                      key={date.toISOString()}
                      className={`bg-gray-50 p-2 text-center ${isToday(date) ? 'bg-primary-50' : ''}`}
                    >
                      <div className="text-sm font-medium">{format(date, 'EEE')}</div>
                      <div className="text-lg">{format(date, 'd')}</div>
                    </div>
                  ))}
                  {[...Array(12)].map((_, hourIndex) => {
                    const hour = hourIndex + 8
                    return (
                      <React.Fragment key={hour}>
                        <div className="bg-white p-2 text-sm text-right pr-3">
                          {hour}:00
                        </div>
                        {getDaysInView().map(date => {
                          const dayAppointments = getAppointmentsForDay(date)
                          const appointment = dayAppointments.find(apt => {
                            const aptHour = new Date(apt.scheduledDate).getHours()
                            return aptHour === hour
                          })
                          
                          return (
                            <div
                              key={`${date.toISOString()}-${hour}`}
                              className="bg-white p-1 min-h-[60px] border-t"
                              onClick={() => handleDateClick(date)}
                            >
                              {appointment && (
                                <div className={`text-xs p-1 rounded ${getStatusColor(appointment.status)}`}>
                                  <div className="font-medium truncate">{appointment.clientName}</div>
                                  <div className="truncate">{appointment.serviceName}</div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your next scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments
                .filter(apt => new Date(apt.scheduledDate) >= new Date())
                .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                .slice(0, 5)
                .map(appointment => (
                  <div key={appointment.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                      </div>
                      <div>
                        <div className="font-medium">{appointment.clientName}</div>
                        <div className="text-sm text-muted-foreground">{appointment.serviceName}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(new Date(appointment.scheduledDate), 'MMM d, yyyy - HH:mm')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">€{appointment.amount}</div>
                      <div className="text-xs text-muted-foreground">{appointment.duration} min</div>
                    </div>
                  </div>
                ))}
              
              {appointments.filter(apt => new Date(apt.scheduledDate) >= new Date()).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming appointments
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireRole>
  )
}