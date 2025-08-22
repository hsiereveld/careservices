import { auth } from "./auth"
import { headers } from "next/headers"
import { cache } from "react"

/**
 * Get the current session from Better-Auth
 * This is cached per request to avoid multiple database calls
 * Works the same in development and production
 */
export const getSession = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    
    if (!session?.user) {
      return null
    }
    
    // Return session with default values for custom fields
    // The actual user data with custom fields should be fetched from the database
    return {
      ...session,
      user: {
        ...session.user,
        role: 'client' as const, // Default role
        isActive: true,
        isVerified: false,
        preferredLanguage: 'es',
      }
    }
  } catch (error) {
    console.error('Failed to get session:', error)
    return null
  }
})

/**
 * Validate session from request headers
 * Used in API routes - works the same in development and production
 */
export async function validateSession(requestHeaders: Headers) {
  try {
    const session = await auth.api.getSession({
      headers: requestHeaders,
    })
    
    if (!session?.user) {
      return null
    }
    
    // Return session with default values for custom fields
    // The actual user data with custom fields should be fetched from the database
    return {
      ...session,
      user: {
        ...session.user,
        role: 'client' as const, // Default role
        isActive: true,
        isVerified: false,
        preferredLanguage: 'es',
      }
    }
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

/**
 * Check if user has required role
 */
export function hasRequiredRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
}

/**
 * Server-side session hook for server components
 */
export async function getServerSession() {
  const session = await getSession()
  
  if (!session?.user) {
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }
  }
  
  return {
    user: session.user,
    isAuthenticated: true,
    isLoading: false,
  }
}