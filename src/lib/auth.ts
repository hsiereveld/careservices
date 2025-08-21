import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"
import { user, account, session, verification } from "./schema"
import { nanoid } from "nanoid"

export type UserRole = 'client' | 'pro' | 'franchise' | 'admin'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      account,
      session,
      verification,
    }
  }),
  
  // Enhanced session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    }
  },

  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: false, // We'll handle verification separately
  },

  // Social providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // Advanced configuration
  advanced: {
    generateId: () => nanoid(),
    crossSubDomainCookies: {
      enabled: false
    }
  },

  // Trusted origins for CORS
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "https://careservice.vercel.app"
  ],

  // Rate limiting
  rateLimit: {
    enabled: true,
    window: 15 * 60, // 15 minutes
    max: 10, // 10 attempts per window
  }
})

// Helper functions for role management
export const hasPermission = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole)
}

export const isAdmin = (userRole: UserRole): boolean => {
  return userRole === 'admin'
}

export const isFranchise = (userRole: UserRole): boolean => {
  return userRole === 'franchise' || userRole === 'admin'
}

export const isPro = (userRole: UserRole): boolean => {
  return ['pro', 'franchise', 'admin'].includes(userRole)
}

export const isClient = (userRole: UserRole): boolean => {
  return userRole === 'client'
}