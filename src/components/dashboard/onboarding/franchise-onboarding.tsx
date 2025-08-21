'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Building, 
  MapPin, 
  Users, 
  Rocket,
  CheckCircle,
  Mail,
  DollarSign,
  Target,
  TrendingUp
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
}

interface FranchiseOnboardingProps {
  step: OnboardingStep
  onStepComplete: (stepId: string) => void
  isCompleted: boolean
}

export function FranchiseOnboarding({ step, onStepComplete, isCompleted }: FranchiseOnboardingProps) {
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    serviceArea: '',
    targetMarket: [] as string[],
    investmentGoal: '',
    teamSize: '',
  })

  const targetMarkets = [
    { id: 'residential', name: 'Residential Clients' },
    { id: 'commercial', name: 'Commercial Clients' },
    { id: 'healthcare', name: 'Healthcare Facilities' },
    { id: 'elderly', name: 'Elderly Care' },
    { id: 'childcare', name: 'Childcare Services' },
    { id: 'emergency', name: 'Emergency Services' },
  ]

  const toggleMarket = (marketId: string) => {
    setFormData(prev => ({
      ...prev,
      targetMarket: prev.targetMarket.includes(marketId)
        ? prev.targetMarket.filter(id => id !== marketId)
        : [...prev.targetMarket, marketId]
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
              <Building className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to CareService Franchise!
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Start your journey as a franchise owner. Build and manage your own care service 
                business with our proven platform and support system.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Card className="text-center p-4">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium">Proven Business Model</h4>
                <p className="text-sm text-gray-500">Launch with our successful framework</p>
              </Card>
              <Card className="text-center p-4">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium">Professional Network</h4>
                <p className="text-sm text-gray-500">Access to verified professionals</p>
              </Card>
              <Card className="text-center p-4">
                <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-medium">Marketing Support</h4>
                <p className="text-sm text-gray-500">Tools to grow your business</p>
              </Card>
            </div>
            <Button onClick={handleComplete} className="w-full max-w-md">
              Start Franchise Setup
            </Button>
          </div>
        )

      case 'business':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Building className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Business Information</h3>
              <p className="text-gray-600">Tell us about your franchise operation</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business/Franchise Name</Label>
                <Input
                  id="businessName"
                  placeholder="CareService - Your City"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input
                  id="businessAddress"
                  placeholder="Street address, City, Province"
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investmentGoal">Investment Goal</Label>
                <select
                  id="investmentGoal"
                  className="w-full p-2 border rounded-lg"
                  value={formData.investmentGoal}
                  onChange={(e) => setFormData({ ...formData, investmentGoal: e.target.value })}
                >
                  <option value="">Select your investment level</option>
                  <option value="starter">Starter ($25K - $50K)</option>
                  <option value="standard">Standard ($50K - $100K)</option>
                  <option value="premium">Premium ($100K+)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teamSize">Expected Team Size</Label>
                <select
                  id="teamSize"
                  className="w-full p-2 border rounded-lg"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                >
                  <option value="">Select team size</option>
                  <option value="solo">Solo Operation (1-5 professionals)</option>
                  <option value="small">Small Team (6-15 professionals)</option>
                  <option value="medium">Medium Team (16-30 professionals)</option>
                  <option value="large">Large Team (30+ professionals)</option>
                </select>
              </div>
              
              <Button 
                onClick={handleComplete} 
                className="w-full"
                disabled={!formData.businessName || !formData.businessAddress}
              >
                Continue
              </Button>
            </div>
          </div>
        )

      case 'territory':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Define Service Territory</h3>
              <p className="text-gray-600">Set your coverage area and target markets</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceArea">Service Area Description</Label>
                <textarea
                  id="serviceArea"
                  className="w-full p-3 border rounded-lg h-20 resize-none"
                  placeholder="Describe your coverage area (e.g., Downtown Toronto, North York suburbs, within 25km radius...)"
                  value={formData.serviceArea}
                  onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Target Markets</Label>
                <div className="grid grid-cols-1 gap-2">
                  {targetMarkets.map((market) => (
                    <button
                      key={market.id}
                      onClick={() => toggleMarket(market.id)}
                      className={`w-full p-3 text-left border rounded transition-all ${
                        formData.targetMarket.includes(market.id)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{market.name}</span>
                        {formData.targetMarket.includes(market.id) && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Start with 2-3 target markets and expand as your team grows.
                </p>
              </div>
              
              <Button 
                onClick={handleComplete} 
                className="w-full"
                disabled={!formData.serviceArea || formData.targetMarket.length === 0}
              >
                Continue
              </Button>
            </div>
          </div>
        )

      case 'team':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Build Your Professional Team</h3>
              <p className="text-gray-600">Invite professionals to join your franchise</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Recruitment Options</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email Invitations
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Post Job Listings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Import From Network
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium mb-3">Professional Requirements</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Background verification required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Professional insurance coverage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Service-specific certifications</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Platform training completion</span>
                  </div>
                </div>
              </Card>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Success Tip:</strong> Start with a small core team of 3-5 excellent 
                  professionals. Quality over quantity leads to better reviews and growth.
                </p>
              </div>
              
              <Button onClick={handleComplete} className="w-full">
                Continue to Launch
              </Button>
            </div>
          </div>
        )

      case 'launch':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Rocket className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Ready to Launch!</h3>
              <p className="text-gray-600">Final steps to activate your franchise</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Setup Complete
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Business Information</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span>Service Territory</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span>Team Strategy</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border-primary-200 bg-primary-50">
                <h4 className="font-medium mb-3 text-primary-800">Next Steps</h4>
                <div className="space-y-2 text-sm text-primary-700">
                  <p>• Start recruiting your professional team</p>
                  <p>• Complete franchise agreement and payment</p>
                  <p>• Launch marketing in your territory</p>
                  <p>• Begin accepting client bookings</p>
                </div>
              </Card>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <DollarSign className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Investment Summary</h4>
                    <p className="text-sm text-yellow-700">
                      Franchise fee: Starting at $25,000. Monthly platform fee: 8% of gross revenue.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleComplete} className="w-full">
                Activate Franchise
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