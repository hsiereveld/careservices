import { createAuthClient } from "better-auth/react"
import { UserRole } from "./auth"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
  changePassword,
  resetPassword,
  sendVerificationEmail,
} = authClient

// Enhanced session hook with role information
export function useAuthSession() {
  const session = useSession()
  
  return {
    ...session,
    user: session.data?.user ? {
      ...session.data.user,
      role: 'client' as UserRole, // Default role for now
      preferredLanguage: 'es',
      phone: '',
      isActive: true,
      isVerified: false,
    } : null,
    isClient: true, // Default for now
    isPro: false,
    isFranchise: false,
    isAdmin: false,
    hasRole: (roles: UserRole[]) => roles.includes('client'),
  }
}

// Role-specific registration functions
export async function registerClient(data: {
  email: string
  password: string
  name: string
  firstName?: string
  lastName?: string
  phone?: string
  preferredLanguage?: string
}) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, role: 'client' })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Registration failed')
  }
  
  return response.json()
}

export async function registerProfessional(data: {
  email: string
  password: string
  name: string
  firstName: string
  lastName: string
  phone?: string
  address: string
  city: string
  postalCode: string
  province: string
  bio?: string
  website?: string
  preferredLanguage?: string
}) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, role: 'pro' })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Registration failed')
  }
  
  return response.json()
}

export async function registerFranchise(data: {
  email: string
  password: string
  name: string
  firstName: string
  lastName: string
  phone?: string
  address: string
  city: string
  postalCode: string
  province: string
  businessName: string
  businessRegistration: string
  preferredLanguage?: string
}) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, role: 'franchise' })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Registration failed')
  }
  
  return response.json()
}

// Profile management functions
export async function getProfile() {
  const response = await fetch('/api/profile', {
    credentials: 'include'
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch profile')
  }
  
  return response.json()
}

export async function updateProfile(data: Record<string, unknown>) {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update profile')
  }
  
  return response.json()
}

// GDPR compliance functions
export async function exportUserData() {
  const response = await fetch('/api/profile/export', {
    credentials: 'include'
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to export data')
  }
  
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
  
  return { success: true, message: 'Data export downloaded' }
}

export async function deleteAccount() {
  const response = await fetch('/api/profile', {
    method: 'DELETE',
    credentials: 'include'
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete account')
  }
  
  // Sign out after account deletion
  await signOut()
  
  return response.json()
}