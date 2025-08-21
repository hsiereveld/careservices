'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Briefcase, 
  Shield, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Upload,
  User,
  Star,
  Clock
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
}

interface ProfessionalOnboardingProps {
  step: OnboardingStep
  onStepComplete: (stepId: string) => void
  isCompleted: boolean
}

export function ProfessionalOnboarding({ step, onStepComplete, isCompleted }: ProfessionalOnboardingProps) {
  const [formData, setFormData] = useState({
    bio: '',
    experience: '',
    specialties: [] as string[],
    hourlyRate: '',
    availability: [] as string[],
    certifications: [] as string[],
  })

  const serviceSpecialties = [
    { id: 'cleaning', name: 'House Cleaning' },
    { id: 'elderly-care', name: 'Elderly Care' },
    { id: 'childcare', name: 'Childcare' },
    { id: 'pet-care', name: 'Pet Care' },
    { id: 'gardening', name: 'Gardening' },
    { id: 'tutoring', name: 'Tutoring' },
  ]

  const availabilityOptions = [
    { id: 'weekdays', name: 'Weekdays' },
    { id: 'weekends', name: 'Weekends' },
    { id: 'evenings', name: 'Evenings' },
    { id: 'emergency', name: 'Emergency Calls' },
  ]

  const toggleSpecialty = (specialtyId: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialtyId)
        ? prev.specialties.filter(id => id !== specialtyId)
        : [...prev.specialties, specialtyId]
    }))
  }

  const toggleAvailability = (availId: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(availId)
        ? prev.availability.filter(id => id !== availId)
        : [...prev.availability, availId]
    }))
  }

  const handleComplete = () => {
    onStepComplete(step.id)
  }

  const renderStepContent = () => {
    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Our Professional Network!
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Join thousands of trusted professionals providing quality care services. 
                Let's get your profile set up to start receiving bookings.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Card className="text-center p-4">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-medium">Build Your Reputation</h4>
                <p className="text-sm text-gray-500">Earn reviews and grow your business</p>
              </Card>
              <Card className="text-center p-4">
                <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium">Set Your Rates</h4>
                <p className="text-sm text-gray-500">You control your pricing</p>
              </Card>
              <Card className="text-center p-4">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium">Flexible Schedule</h4>
                <p className="text-sm text-gray-500">Work when you want</p>
              </Card>
            </div>
            <Button onClick={handleComplete} className="w-full max-w-md">
              Start Setup
            </Button>
          </div>
        )

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Create Your Professional Profile</h3>
              <p className="text-gray-600">Tell clients about your experience and expertise</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <textarea
                  id="bio"
                  className="w-full p-3 border rounded-lg h-24 resize-none"
                  placeholder="Describe your experience, approach, and what makes you unique..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  placeholder="e.g., 5 years"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Service Specialties</Label>
                <div className="grid grid-cols-2 gap-2">
                  {serviceSpecialties.map((specialty) => (
                    <button
                      key={specialty.id}
                      onClick={() => toggleSpecialty(specialty.id)}
                      className={`p-2 text-sm border rounded text-center transition-all ${
                        formData.specialties.includes(specialty.id)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {specialty.name}
                      {formData.specialties.includes(specialty.id) && (
                        <CheckCircle className="w-3 h-3 inline ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleComplete} 
                className="w-full"
                disabled={!formData.bio || formData.specialties.length === 0}
              >
                Continue
              </Button>
            </div>
          </div>
        )

      case 'verification':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Complete Verification</h3>
              <p className="text-gray-600">Upload required documents to build trust with clients</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Identity Verification</h4>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-sm text-gray-600 mb-3">Government-issued ID required</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload ID
                </Button>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Background Check</h4>
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600 mb-3">Criminal background verification</p>
                <Button variant="outline" size="sm" className="w-full">
                  Start Background Check
                </Button>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Professional Certifications</h4>
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600 mb-3">Relevant licenses or certifications</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Certificates
                </Button>
              </Card>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Verification typically takes 2-3 business days. 
                  You can continue setting up your profile while we process your documents.
                </p>
              </div>
              
              <Button onClick={handleComplete} className="w-full">
                Continue Setup
              </Button>
            </div>
          </div>
        )

      case 'services':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Briefcase className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Setup Your Services</h3>
              <p className="text-gray-600">Define what you offer and your pricing</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (CAD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="hourlyRate"
                    type="number"
                    placeholder="25"
                    className="pl-8"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  />
                </div>
                <p className="text-xs text-gray-500">You can adjust this later for different services</p>
              </div>
              
              <div className="space-y-2">
                <Label>Service Availability</Label>
                <div className="space-y-2">
                  {availabilityOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleAvailability(option.id)}
                      className={`w-full p-3 text-left border rounded transition-all ${
                        formData.availability.includes(option.id)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option.name}</span>
                        {formData.availability.includes(option.id) && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleComplete} 
                className="w-full"
                disabled={!formData.hourlyRate || formData.availability.length === 0}
              >
                Continue
              </Button>
            </div>
          </div>
        )

      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Set Your Availability</h3>
              <p className="text-gray-600">Let clients know when you're available for bookings</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Weekly Schedule</h4>
                <div className="space-y-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm font-medium w-20">{day}</span>
                      <div className="flex items-center space-x-2">
                        <Input type="time" className="text-xs" placeholder="09:00" />
                        <span className="text-xs text-gray-500">to</span>
                        <Input type="time" className="text-xs" placeholder="17:00" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Flexible Scheduling</h4>
                    <p className="text-sm text-green-700">
                      You can always adjust your availability and accept bookings outside your regular hours.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleComplete} className="w-full">
                Complete Profile Setup
              </Button>
            </div>
          </div>
        )

      default:
        return <div>Unknown step</div>
    }
  }

  return (
    <div className="py-6">
      {renderStepContent()}
    </div>
  )
}