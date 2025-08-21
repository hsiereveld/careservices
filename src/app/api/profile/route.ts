import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { profile, user } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { withAuth } from "@/lib/auth-middleware"
import { logSecurityEvent } from "@/lib/auth-middleware"

// Profile update schema
const profileUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  dateOfBirth: z.string().datetime().optional(),
  address: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  postalCode: z.string().min(5).optional(),
  province: z.string().min(2).optional(),
  bio: z.string().max(1000).optional(),
  website: z.string().url().optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional(),
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
  }).optional(),
  preferences: z.record(z.string(), z.any()).optional(),
})

// Get user profile
export const GET = withAuth(async (request: NextRequest, authUser) => {
  try {
    // Get user profile with full user details
    const userProfile = await db
      .select({
        // User fields
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        // Profile fields
        profileId: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        dateOfBirth: profile.dateOfBirth,
        address: profile.address,
        city: profile.city,
        postalCode: profile.postalCode,
        province: profile.province,
        country: profile.country,
        bio: profile.bio,
        website: profile.website,
        socialLinks: profile.socialLinks,
        preferences: profile.preferences,
        profileCreatedAt: profile.createdAt,
        profileUpdatedAt: profile.updatedAt,
      })
      .from(user)
      .leftJoin(profile, eq(user.id, profile.userId))
      .where(eq(user.id, authUser.id))
      .limit(1)

    if (!userProfile.length) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Log profile access for GDPR compliance
    logSecurityEvent(authUser, 'data_access', { 
      dataType: 'profile',
      endpoint: '/api/profile'
    })

    const userData = userProfile[0]

    return NextResponse.json({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        preferredLanguage: userData.preferredLanguage,
        isActive: userData.isActive,
        isVerified: userData.isVerified,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
      profile: userData.profileId ? {
        id: userData.profileId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        dateOfBirth: userData.dateOfBirth,
        address: userData.address,
        city: userData.city,
        postalCode: userData.postalCode,
        province: userData.province,
        country: userData.country,
        bio: userData.bio,
        website: userData.website,
        socialLinks: userData.socialLinks,
        preferences: userData.preferences,
        createdAt: userData.profileCreatedAt,
        updatedAt: userData.profileUpdatedAt,
      } : null
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
})

// Update user profile
export const PUT = withAuth(async (request: NextRequest, authUser) => {
  try {
    const body = await request.json()
    const validatedData = profileUpdateSchema.parse(body)

    // Check if profile exists
    const existingProfile = await db
      .select({ id: profile.id })
      .from(profile)
      .where(eq(profile.userId, authUser.id))
      .limit(1)

    if (!existingProfile.length) {
      // Create new profile if it doesn't exist
      const profileData = {
        id: `profile_${Date.now()}`,
        userId: authUser.id,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        address: validatedData.address,
        city: validatedData.city,
        postalCode: validatedData.postalCode,
        province: validatedData.province,
        bio: validatedData.bio,
        website: validatedData.website,
        socialLinks: validatedData.socialLinks,
        preferences: validatedData.preferences,
        country: 'ES',
        updatedAt: new Date(),
        createdAt: new Date(),
      }

      const newProfile = await db.insert(profile).values(profileData).returning()

      // Log profile creation for GDPR compliance
      logSecurityEvent(authUser, 'data_access', { 
        dataType: 'profile',
        action: 'create',
        endpoint: '/api/profile'
      })

      return NextResponse.json({
        success: true,
        profile: newProfile[0]
      })
    } else {
      // Update existing profile
      const updateData = {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        address: validatedData.address,
        city: validatedData.city,
        postalCode: validatedData.postalCode,
        province: validatedData.province,
        bio: validatedData.bio,
        website: validatedData.website,
        socialLinks: validatedData.socialLinks,
        preferences: validatedData.preferences,
        updatedAt: new Date(),
      }

      const updatedProfile = await db
        .update(profile)
        .set(updateData)
        .where(eq(profile.userId, authUser.id))
        .returning()

      // Log profile update for GDPR compliance
      logSecurityEvent(authUser, 'data_access', { 
        dataType: 'profile',
        action: 'update',
        endpoint: '/api/profile',
        changedFields: Object.keys(validatedData)
      })

      return NextResponse.json({
        success: true,
        profile: updatedProfile[0]
      })
    }

  } catch (error) {
    console.error('Profile update error:', error)
    
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
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
})

// Delete user profile (GDPR compliance)
export const DELETE = withAuth(async (request: NextRequest, authUser) => {
  try {
    // In a real application, this might soft-delete or anonymize data
    // rather than hard delete, depending on business requirements
    
    // Log deletion request for GDPR compliance
    logSecurityEvent(authUser, 'data_deletion', { 
      dataType: 'profile',
      endpoint: '/api/profile'
    })

    // Delete profile
    await db.delete(profile).where(eq(profile.userId, authUser.id))

    return NextResponse.json({
      success: true,
      message: "Profile deleted successfully"
    })

  } catch (error) {
    console.error('Profile deletion error:', error)
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    )
  }
})