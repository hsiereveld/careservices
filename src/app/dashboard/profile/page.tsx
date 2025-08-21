'use client'

import { useAuth } from '@/contexts/auth-context'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ProfileForm } from '@/components/dashboard/profile/profile-form'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/sign-in?redirect=/dashboard/profile')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your personal information and account preferences.
          </p>
        </div>

        <ProfileForm role={user.role} />
      </div>
    </DashboardLayout>
  )
}