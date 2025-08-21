'use client'

import { useAuth } from '@/contexts/auth-context'
import { OnboardingWizard } from '@/components/dashboard/onboarding/onboarding-wizard'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OnboardingPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/sign-in?redirect=/onboarding')
        return
      }

      // Check if user needs onboarding (this would typically come from user profile)
      // For now, we'll show onboarding for all new users
      setShouldShowOnboarding(true)
    }
  }, [isLoading, isAuthenticated, router])

  const handleOnboardingComplete = () => {
    // Mark onboarding as complete (would typically update user profile)
    // For now, redirect to role-specific dashboard
    switch (user?.role) {
      case 'client':
        router.push('/dashboard/client')
        break
      case 'pro':
        router.push('/dashboard/professional')
        break
      case 'franchise':
        router.push('/dashboard/franchise')
        break
      case 'admin':
        router.push('/dashboard/admin')
        break
      default:
        router.push('/dashboard')
        break
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user || !shouldShowOnboarding) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <OnboardingWizard 
          role={user.role} 
          onComplete={handleOnboardingComplete}
        />
      </div>
    </div>
  )
}