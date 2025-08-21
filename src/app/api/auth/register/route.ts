import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth, UserRole } from "@/lib/auth"
import { db } from "@/lib/db"
import { profile } from "@/lib/schema"
import { nanoid } from "nanoid"

// Registration validation schemas for different roles
const baseRegistrationSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  preferredLanguage: z.string().default("es"),
  role: z.enum(['client', 'pro', 'franchise'] as const),
})

const proRegistrationSchema = baseRegistrationSchema.extend({
  role: z.literal('pro'),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(10, "Address is required for professionals"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(5, "Valid postal code is required"),
  province: z.string().min(2, "Province is required"),
  bio: z.string().optional(),
  website: z.string().url().optional(),
})

const franchiseRegistrationSchema = baseRegistrationSchema.extend({
  role: z.literal('franchise'),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(10, "Business address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(5, "Valid postal code is required"),
  province: z.string().min(2, "Province is required"),
  businessName: z.string().min(2, "Business name is required"),
  businessRegistration: z.string().min(5, "Business registration number is required"),
})

const clientRegistrationSchema = baseRegistrationSchema.extend({
  role: z.literal('client'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

// Type definitions for registration data
export type ClientRegistrationData = z.infer<typeof clientRegistrationSchema>
export type ProRegistrationData = z.infer<typeof proRegistrationSchema>
export type FranchiseRegistrationData = z.infer<typeof franchiseRegistrationSchema>

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate based on role
    let validatedData: ClientRegistrationData | ProRegistrationData | FranchiseRegistrationData
    
    switch (body.role) {
      case 'client':
        validatedData = clientRegistrationSchema.parse(body)
        break
      case 'pro':
        validatedData = proRegistrationSchema.parse(body)
        break
      case 'franchise':
        validatedData = franchiseRegistrationSchema.parse(body)
        break
      default:
        return NextResponse.json(
          { error: "Invalid role specified" },
          { status: 400 }
        )
    }

    // Better-Auth will handle duplicate email checking internally

    // Create user with Better-Auth (simplified for now)
    const userResult = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email`,
      }
    })

    if (!userResult.user) {
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      )
    }

    // Create detailed profile based on role
    const profileData = createProfileData(userResult.user.id, validatedData)
    
    if (profileData) {
      await db.insert(profile).values(profileData)
    }

    // Role-specific post-registration actions
    await handlePostRegistration(validatedData.role, userResult.user.id, validatedData)

    return NextResponse.json({
      success: true,
      user: {
        id: userResult.user.id,
        email: userResult.user.email,
        name: userResult.user.name,
        role: validatedData.role,
      },
      requiresVerification: validatedData.role !== 'client',
      message: getRegistrationMessage(validatedData.role),
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message }))
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}

function createProfileData(userId: string, data: ClientRegistrationData | ProRegistrationData | FranchiseRegistrationData) {
  const baseProfile = {
    id: nanoid(),
    userId,
    firstName: 'firstName' in data ? data.firstName : undefined,
    lastName: 'lastName' in data ? data.lastName : undefined,
    address: 'address' in data ? data.address : undefined,
    city: 'city' in data ? data.city : undefined,
    postalCode: 'postalCode' in data ? data.postalCode : undefined,
    province: 'province' in data ? data.province : undefined,
    country: 'ES',
    bio: 'bio' in data ? data.bio : undefined,
    website: 'website' in data ? data.website : undefined,
    preferences: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Add role-specific profile data
  switch (data.role) {
    case 'pro':
      return {
        ...baseProfile,
        preferences: {
          serviceRadius: 25,
          languages: ['es'],
          availableWeekdays: [1, 2, 3, 4, 5], // Monday to Friday
        }
      }
    
    case 'franchise':
      return {
        ...baseProfile,
        preferences: {
          businessName: 'businessName' in data ? data.businessName : undefined,
          businessRegistration: 'businessRegistration' in data ? data.businessRegistration : undefined,
          territories: [],
        }
      }
    
    case 'client':
      return data.firstName || data.lastName ? {
        ...baseProfile,
        preferences: {
          notificationSettings: {
            email: true,
            sms: false,
            push: true,
          }
        }
      } : null
    
    default:
      return null
  }
}

async function handlePostRegistration(role: UserRole, userId: string, data: ClientRegistrationData | ProRegistrationData | FranchiseRegistrationData) {
  switch (role) {
    case 'pro':
      // Send verification email with professional onboarding
      console.log(`Professional registration for ${userId} - verification required`)
      break
    
    case 'franchise':
      // Send franchise application for manual review
      console.log(`Franchise registration for ${userId} - manual review required`)
      // Could trigger admin notification
      break
    
    case 'client':
      // Client is ready to use the platform immediately
      console.log(`Client registration for ${userId} - ready to use platform`)
      break
  }
}

function getRegistrationMessage(role: UserRole): string {
  switch (role) {
    case 'client':
      return "Welcome to CareService! Your account is ready to use."
    
    case 'pro':
      return "Thank you for joining as a professional! Please verify your email to start offering services."
    
    case 'franchise':
      return "Thank you for your interest in franchising! Your application will be reviewed within 48 hours."
    
    default:
      return "Registration successful!"
  }
}