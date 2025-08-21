'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MapPin, 
  Heart, 
  Clock, 
  Search,
  CheckCircle,
  User,
  Home,
  Shield
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
}

interface ClientOnboardingProps {
  step: OnboardingStep
  onStepComplete: (stepId: string) => void
  isCompleted: boolean
}

export function ClientOnboarding({ step, onStepComplete, isCompleted }: ClientOnboardingProps) {
  const [formData, setFormData] = useState({
    location: '',
    preferences: [] as string[],
    emergencyContact: '',
    specialNeeds: '',
  })

  const serviceCategories = [
    { id: 'cleaning', name: 'House Cleaning', icon: '🏠' },
    { id: 'elderly-care', name: 'Elderly Care', icon: '👴' },
    { id: 'childcare', name: 'Childcare', icon: '👶' },
    { id: 'pet-care', name: 'Pet Care', icon: '🐕' },
    { id: 'gardening', name: 'Gardening', icon: '🌱' },
    { id: 'tutoring', name: 'Tutoring', icon: '📚' },
  ]

  const togglePreference = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(categoryId)
        ? prev.preferences.filter(id => id !== categoryId)
        : [...prev.preferences, categoryId]
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
              <Heart className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to CareService!
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're here to help you find trusted professionals for all your care needs. 
                Let's get started by setting up your profile.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Card className="text-center p-4">
                <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium">Verified Professionals</h4>
                <p className="text-sm text-gray-500">All professionals are background checked</p>
              </Card>
              <Card className="text-center p-4">
                <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium">24/7 Support</h4>
                <p className="text-sm text-gray-500">Get help whenever you need it</p>
              </Card>
              <Card className="text-center p-4">
                <MapPin className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-medium">Local Services</h4>
                <p className="text-sm text-gray-500">Find professionals in your area</p>
              </Card>
            </div>
            <Button onClick={handleComplete} className="w-full max-w-md">
              Get Started
            </Button>
          </div>
        )

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Complete Your Profile</h3>
              <p className="text-gray-600">Help us personalize your experience</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Your Location</Label>
                <Input
                  id="location"
                  placeholder="Enter your city or postal code"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <p className="text-xs text-gray-500">This helps us find professionals near you</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergency">Emergency Contact (Optional)</Label>
                <Input
                  id="emergency"
                  placeholder="Phone number for emergencies"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="needs">Special Requirements (Optional)</Label>
                <textarea
                  id="needs"
                  className="w-full p-3 border rounded-lg h-20 resize-none"
                  placeholder="Any special needs or requirements we should know about..."
                  value={formData.specialNeeds}
                  onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                />
              </div>
              
              <Button 
                onClick={handleComplete} 
                className="w-full"
                disabled={!formData.location}
              >
                Save Profile
              </Button>
            </div>
          </div>
        )

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">What Services Interest You?</h3>
              <p className="text-gray-600">Select the services you might need (you can change this later)</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => togglePreference(category.id)}
                  className={`p-4 border rounded-lg text-center transition-all ${
                    formData.preferences.includes(category.id)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h4 className="font-medium text-sm">{category.name}</h4>
                  {formData.preferences.includes(category.id) && (
                    <CheckCircle className="w-4 h-4 text-primary-600 mx-auto mt-2" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-center">
              <Button 
                onClick={handleComplete} 
                className="w-full max-w-md"
                disabled={formData.preferences.length === 0}
              >
                Continue
              </Button>
            </div>
          </div>
        )

      case 'services':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Search className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Explore Available Services</h3>
              <p className="text-gray-600">Discover trusted professionals in your area</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {formData.preferences.slice(0, 4).map((prefId) => {
                const category = serviceCategories.find(c => c.id === prefId)
                if (!category) return null
                
                return (
                  <Card key={prefId} className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{category.icon}</span>
                      <h4 className="font-medium">{category.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Find qualified professionals for {category.name.toLowerCase()} services
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Browse {category.name}
                    </Button>
                  </Card>
                )
              })}
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                You can explore all services from your dashboard
              </p>
              <Button onClick={handleComplete} className="w-full max-w-md">
                Complete Setup
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