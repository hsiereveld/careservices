'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuthSession } from '@/lib/auth-client'
import { UserRole } from '@/lib/auth'

interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  preferredLanguage: string
  isActive: boolean
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

interface AuthProfile {
  id: string
  firstName?: string
  lastName?: string
  dateOfBirth?: Date
  address?: string
  city?: string
  postalCode?: string
  province?: string
  country: string
  bio?: string
  website?: string
  socialLinks?: Record<string, string>
  preferences?: Record<string, unknown>
}

interface AuthContextType {
  // Session data
  user: AuthUser | null
  profile: AuthProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Role checks
  isClient: boolean
  isPro: boolean
  isFranchise: boolean
  isAdmin: boolean
  hasRole: (roles: UserRole[]) => boolean
  
  // Profile management
  refreshProfile: () => Promise<void>
  updateProfile: (data: Partial<AuthProfile>) => Promise<void>
  
  // GDPR compliance
  exportData: () => Promise<void>
  deleteAccount: () => Promise<void>
  
  // Consent management
  hasConsent: (type: ConsentType) => boolean
  grantConsent: (type: ConsentType) => Promise<void>
  revokeConsent: (type: ConsentType) => Promise<void>
}

export type ConsentType = 
  | 'data_processing'
  | 'marketing_communications'
  | 'analytics_cookies'
  | 'performance_cookies'
  | 'functional_cookies'

interface ConsentRecord {
  type: ConsentType
  granted: boolean
  grantedAt?: Date
  revokedAt?: Date
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useAuthSession()
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [consents, setConsents] = useState<ConsentRecord[]>([])
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  // Load profile when user is authenticated
  useEffect(() => {
    if (session.data?.user && !profile && !isLoadingProfile) {
      refreshProfile()
    }
  }, [session.data?.user])

  // Load user consents from localStorage (in production, this should come from server)
  useEffect(() => {
    if (session.data?.user) {
      const storedConsents = localStorage.getItem(`consents_${session.data.user.id}`)
      if (storedConsents) {
        try {
          setConsents(JSON.parse(storedConsents))
        } catch (error) {
          console.error('Failed to parse stored consents:', error)
          setConsents([])
        }
      }
    }
  }, [session.data?.user])

  const refreshProfile = async () => {
    if (!session.data?.user) return
    
    setIsLoadingProfile(true)
    try {
      const response = await fetch('/api/profile', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
      } else {
        console.error('Failed to load profile')
        setProfile(null)
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
      setProfile(null)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const updateProfile = async (data: Partial<AuthProfile>) => {
    if (!session.data?.user) return
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        const result = await response.json()
        setProfile(result.profile)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  const exportData = async () => {
    if (!session.data?.user) return
    
    try {
      const response = await fetch('/api/profile/export', {
        credentials: 'include'
      })
      
      if (response.ok) {
        // Create download link
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `careservice-data-export-${Date.now()}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to export data')
      }
    } catch (error) {
      console.error('Data export error:', error)
      throw error
    }
  }

  const deleteAccount = async () => {
    if (!session.data?.user) return
    
    try {
      const response = await fetch('/api/profile', {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.ok) {
        // Clear local data
        setProfile(null)
        setConsents([])
        localStorage.removeItem(`consents_${session.data.user.id}`)
        
        // Sign out
        window.location.href = '/auth/sign-in?message=account-deleted'
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete account')
      }
    } catch (error) {
      console.error('Account deletion error:', error)
      throw error
    }
  }

  const hasConsent = (type: ConsentType): boolean => {
    const consent = consents.find(c => c.type === type)
    return consent?.granted === true && !consent.revokedAt
  }

  const grantConsent = async (type: ConsentType) => {
    const updatedConsents = consents.filter(c => c.type !== type)
    const newConsent = {
      type,
      granted: true,
      grantedAt: new Date(),
    }
    updatedConsents.push(newConsent)

    setConsents(updatedConsents)
    
    // Save consent for both authenticated and anonymous users
    if (session?.data?.user) {
      localStorage.setItem(`consents_${session.data.user.id}`, JSON.stringify(updatedConsents))
    } else {
      // Save anonymous consent
      const anonymousConsents = localStorage.getItem('anonymous_consents')
      let allAnonymousConsents = []
      
      if (anonymousConsents) {
        try {
          allAnonymousConsents = JSON.parse(anonymousConsents)
          allAnonymousConsents = allAnonymousConsents.filter((c: any) => c.type !== type)
        } catch (error) {
          console.error('Failed to parse anonymous consents:', error)
        }
      }
      
      allAnonymousConsents.push(newConsent)
      localStorage.setItem('anonymous_consents', JSON.stringify(allAnonymousConsents))
    }
    
    // Only make API call if user is authenticated
    if (!session?.data?.user) return

    // In production, also send to server
    try {
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type, granted: true })
      })
    } catch (error) {
      console.error('Failed to save consent to server:', error)
    }
  }

  const revokeConsent = async (type: ConsentType) => {
    if (!session.data?.user) return

    const updatedConsents = consents.map(c => 
      c.type === type 
        ? { ...c, granted: false, revokedAt: new Date() }
        : c
    )

    const existingConsent = consents.find(c => c.type === type)
    if (!existingConsent) {
      updatedConsents.push({
        type,
        granted: false,
        revokedAt: new Date(),
      })
    }

    setConsents(updatedConsents)
    localStorage.setItem(`consents_${session.data.user.id}`, JSON.stringify(updatedConsents))

    // In production, also send to server
    try {
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type, granted: false })
      })
    } catch (error) {
      console.error('Failed to save consent to server:', error)
    }
  }

  const contextValue: AuthContextType = {
    user: session.user ? {
      ...session.user,
      preferredLanguage: 'es',
      phone: '',
    } : null,
    profile,
    isLoading: session.isPending || isLoadingProfile,
    isAuthenticated: !!session.data?.user,
    
    isClient: session.isClient,
    isPro: session.isPro,
    isFranchise: session.isFranchise,
    isAdmin: session.isAdmin,
    hasRole: session.hasRole,
    
    refreshProfile,
    updateProfile,
    
    exportData,
    deleteAccount,
    
    hasConsent,
    grantConsent,
    revokeConsent,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Role-based component wrapper
export function RequireRole({ 
  roles, 
  children, 
  fallback 
}: { 
  roles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { hasRole, isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  if (!isAuthenticated) {
    return fallback || <div>Please sign in to access this content.</div>
  }
  
  if (!hasRole(roles)) {
    return fallback || <div>You don't have permission to access this content.</div>
  }
  
  return <>{children}</>
}

// GDPR Consent Banner Component
export function ConsentBanner() {
  const { hasConsent, grantConsent, revokeConsent, user } = useAuth()
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check for anonymous consent in localStorage first
    const anonymousConsents = localStorage.getItem('anonymous_consents')
    let hasAnonymousConsent = false
    
    if (anonymousConsents) {
      try {
        const consents = JSON.parse(anonymousConsents)
        hasAnonymousConsent = consents.some((c: any) => 
          c.type === 'data_processing' && c.granted && !c.revokedAt
        )
      } catch (error) {
        console.error('Failed to parse anonymous consents:', error)
      }
    }
    
    // Check authenticated user consent if logged in
    const hasUserConsent = user ? hasConsent('data_processing') : false
    
    // Show banner if neither anonymous nor user consent exists
    setShowBanner(!hasAnonymousConsent && !hasUserConsent)
  }, [hasConsent, user])

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex-1 mr-4">
          <p className="text-sm">
            We use cookies and process your data to provide our services. 
            By continuing to use our platform, you consent to data processing as described in our{' '}
            <a href="/privacy-policy" className="underline">Privacy Policy</a>.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              await grantConsent('data_processing')
              await grantConsent('functional_cookies')
              setShowBanner(false)
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
          >
            Accept Essential
          </button>
          <button 
            onClick={async () => {
              await grantConsent('data_processing')
              await grantConsent('functional_cookies')
              await grantConsent('analytics_cookies')
              await grantConsent('marketing_communications')
              setShowBanner(false)
            }}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}