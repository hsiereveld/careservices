import { NextRequest, NextResponse } from "next/server"
import { UserRole, hasPermission } from "./auth"
import { validateSession } from "./auth-session"

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
  isVerified: boolean
}

export interface AuthSession {
  user: AuthUser
  session: {
    id: string
    expiresAt: Date
  }
}

/**
 * Middleware to protect routes based on user roles
 */
export async function authMiddleware(
  request: NextRequest,
  requiredRoles?: UserRole[]
): Promise<{ success: boolean; response?: NextResponse; user?: AuthUser }> {
  try {
    // Validate session using Better-Auth
    const session = await validateSession(request.headers)
    
    // No valid session found
    if (!session?.user) {
      return {
        success: false,
        response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }
    
    // Create AuthUser from session
    const user: AuthUser = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name || '',
      role: (session.user.role || 'client') as UserRole,
      isActive: session.user.isActive ?? true,
      isVerified: session.user.isVerified ?? false,
    }
    
    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Account is deactivated' },
          { status: 403 }
        )
      }
    }
    
    // Check role permissions if required
    if (requiredRoles && requiredRoles.length > 0) {
      if (!hasPermission(user.role, requiredRoles)) {
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          )
        }
      }
    }
    
    return {
      success: true,
      user
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Route protection for different user roles
 */
export const roleProtection = {
  client: (request: NextRequest) => authMiddleware(request, ['client']),
  pro: (request: NextRequest) => authMiddleware(request, ['pro']),
  franchise: (request: NextRequest) => authMiddleware(request, ['franchise']),
  admin: (request: NextRequest) => authMiddleware(request, ['admin']),
  proAndAbove: (request: NextRequest) => authMiddleware(request, ['pro', 'franchise', 'admin']),
  franchiseAndAbove: (request: NextRequest) => authMiddleware(request, ['franchise', 'admin']),
  any: (request: NextRequest) => authMiddleware(request),
}

/**
 * Higher-order function to create protected API handlers
 */
export function withAuth(
  handler: (request: NextRequest, user: AuthUser, ...args: any[]) => Promise<Response>,
  requiredRoles?: UserRole[]
) {
  return async (request: NextRequest, ...args: any[]) => {
    const authResult = await authMiddleware(request, requiredRoles)
    
    if (!authResult.success || !authResult.user) {
      return authResult.response || NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    return handler(request, authResult.user, ...args)
  }
}

/**
 * Check if user has access to franchise data
 */
export function hasFranchiseAccess(user: AuthUser, franchiseId?: string): boolean {
  // Admin has access to all franchises
  if (user.role === 'admin') return true
  
  // Franchise owners have access to their own franchise
  // Note: This would need to be verified against the database
  if (user.role === 'franchise') return true
  
  return false
}

/**
 * Territory-based access control for franchise system
 */
export async function checkTerritoryAccess(
  user: AuthUser, 
  postalCode: string
): Promise<boolean> {
  // Admin has access to all territories
  if (user.role === 'admin') return true
  
  // For franchise users, we would need to check their territories
  // This would require a database query to verify territory ownership
  if (user.role === 'franchise') {
    // TODO: Implement territory check against database
    return true
  }
  
  return false
}

/**
 * GDPR-compliant session logging
 */
export function logSecurityEvent(
  user: AuthUser,
  event: 'login' | 'logout' | 'password_change' | 'data_access' | 'data_export' | 'data_deletion',
  metadata?: Record<string, any>
) {
  console.log(`[SECURITY] User ${user.id} (${user.role}): ${event}`, {
    userId: user.id,
    email: user.email,
    role: user.role,
    event,
    timestamp: new Date().toISOString(),
    metadata
  })
  
  // In production, this should be stored in a secure audit log
  // with proper encryption and retention policies
}