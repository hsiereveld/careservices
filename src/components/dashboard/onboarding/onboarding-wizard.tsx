'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { ClientOnboarding } from './client-onboarding'
import { ProfessionalOnboarding } from './professional-onboarding'
import { FranchiseOnboarding } from './franchise-onboarding'
import { AdminOnboarding } from './admin-onboarding'

interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
}

interface OnboardingWizardProps {
  role: 'client' | 'pro' | 'franchise' | 'admin'
  onComplete: () => void
}

export function OnboardingWizard({ role, onComplete }: OnboardingWizardProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const getRoleSteps = (): OnboardingStep[] => {
    switch (role) {
      case 'client':
        return [
          { id: 'welcome', title: 'Welcome', description: 'Get started with CareService', completed: false },
          { id: 'profile', title: 'Complete Profile', description: 'Tell us about yourself', completed: false },
          { id: 'preferences', title: 'Set Preferences', description: 'Customize your experience', completed: false },
          { id: 'services', title: 'Explore Services', description: 'Discover available services', completed: false },
        ]
      case 'pro':
        return [
          { id: 'welcome', title: 'Welcome', description: 'Join our professional network', completed: false },
          { id: 'profile', title: 'Professional Profile', description: 'Showcase your expertise', completed: false },
          { id: 'verification', title: 'Verification', description: 'Complete background checks', completed: false },
          { id: 'services', title: 'Setup Services', description: 'Define your offerings', completed: false },
          { id: 'calendar', title: 'Availability', description: 'Set your schedule', completed: false },
        ]
      case 'franchise':
        return [
          { id: 'welcome', title: 'Welcome', description: 'Start your franchise journey', completed: false },
          { id: 'business', title: 'Business Setup', description: 'Configure your franchise', completed: false },
          { id: 'territory', title: 'Service Territory', description: 'Define your coverage area', completed: false },
          { id: 'team', title: 'Build Team', description: 'Invite professionals', completed: false },
          { id: 'launch', title: 'Go Live', description: 'Launch your services', completed: false },
        ]
      case 'admin':
        return [
          { id: 'welcome', title: 'Admin Setup', description: 'Configure system access', completed: false },
          { id: 'permissions', title: 'Permissions', description: 'Set up access controls', completed: false },
          { id: 'monitoring', title: 'Monitoring', description: 'Configure alerts and reports', completed: false },
        ]
      default:
        return []
    }
  }

  const steps = getRoleSteps()
  const progress = (completedSteps.length / steps.length) * 100

  const markStepCompleted = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepCompleted = (stepId: string) => completedSteps.includes(stepId)
  const canProceed = isStepCompleted(steps[currentStep]?.id)

  const renderStepContent = () => {
    const step = steps[currentStep]
    if (!step) return null

    switch (role) {
      case 'client':
        return (
          <ClientOnboarding 
            step={step} 
            onStepComplete={markStepCompleted}
            isCompleted={isStepCompleted(step.id)}
          />
        )
      case 'pro':
        return (
          <ProfessionalOnboarding 
            step={step} 
            onStepComplete={markStepCompleted}
            isCompleted={isStepCompleted(step.id)}
          />
        )
      case 'franchise':
        return (
          <FranchiseOnboarding 
            step={step} 
            onStepComplete={markStepCompleted}
            isCompleted={isStepCompleted(step.id)}
          />
        )
      case 'admin':
        return (
          <AdminOnboarding 
            step={step} 
            onStepComplete={markStepCompleted}
            isCompleted={isStepCompleted(step.id)}
          />
        )
      default:
        return <div>Unknown role</div>
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Welcome to CareService! Let's get you set up.
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{completedSteps.length} completed</span>
              <span>{steps.length - completedSteps.length} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isStepCompleted(steps[currentStep]?.id) ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">{currentStep + 1}</span>
                </div>
              )}
              <div>
                <CardTitle>{steps[currentStep]?.title}</CardTitle>
                <CardDescription>{steps[currentStep]?.description}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-primary-500'
                  : isStepCompleted(step.id)
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button 
          onClick={nextStep}
          disabled={!canProceed}
        >
          {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}