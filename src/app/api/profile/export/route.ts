import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { 
  user, 
  profile, 
  booking, 
  service, 
  review, 
  transaction,
  availability,
  calendarIntegration,
  subscription
} from "@/lib/schema"
import { eq } from "drizzle-orm"
import { withAuth, logSecurityEvent } from "@/lib/auth-middleware"

/**
 * GDPR-compliant data export endpoint
 * Exports all user data in a structured format
 */
export const GET = withAuth(async (request: NextRequest, authUser) => {
  try {
    // Log data export request for GDPR compliance
    logSecurityEvent(authUser, 'data_export', { 
      endpoint: '/api/profile/export',
      format: 'json'
    })

    // Collect all user data from different tables
    const userData = await Promise.all([
      // Basic user information
      db.select().from(user).where(eq(user.id, authUser.id)).limit(1),
      
      // Profile information
      db.select().from(profile).where(eq(profile.userId, authUser.id)),
      
      // Bookings as client
      db.select().from(booking).where(eq(booking.clientId, authUser.id)),
      
      // Bookings as professional
      db.select().from(booking).where(eq(booking.proId, authUser.id)),
      
      // Services (if professional)
      db.select().from(service).where(eq(service.proId, authUser.id)),
      
      // Reviews given
      db.select().from(review).where(eq(review.reviewerId, authUser.id)),
      
      // Reviews received
      db.select().from(review).where(eq(review.revieweeId, authUser.id)),
      
      // Financial transactions
      db.select().from(transaction).where(eq(transaction.userId, authUser.id)),
      
      // Availability settings (if professional)
      db.select().from(availability).where(eq(availability.proId, authUser.id)),
      
      // Calendar integrations
      db.select().from(calendarIntegration).where(eq(calendarIntegration.userId, authUser.id)),
      
      // Subscriptions as client
      db.select().from(subscription).where(eq(subscription.clientId, authUser.id)),
      
      // Subscriptions as professional
      db.select().from(subscription).where(eq(subscription.proId, authUser.id)),
    ])

    // Structure the exported data
    const exportData = {
      exportInfo: {
        exportedAt: new Date().toISOString(),
        userId: authUser.id,
        exportFormat: 'json',
        dataVersion: '1.0',
      },
      personalInformation: {
        user: userData[0][0] || null,
        profile: userData[1][0] || null,
      },
      bookingHistory: {
        asClient: userData[2] || [],
        asProfessional: userData[3] || [],
      },
      services: userData[4] || [],
      reviews: {
        given: userData[5] || [],
        received: userData[6] || [],
      },
      financialData: userData[7] || [],
      professionalSettings: {
        availability: userData[8] || [],
        calendarIntegrations: userData[9] || [],
      },
      subscriptions: {
        asClient: userData[10] || [],
        asProfessional: userData[11] || [],
      },
      gdprInformation: {
        dataRetentionPolicy: "Data is retained as per our Privacy Policy and applicable law",
        dataProcessingLawfulBasis: "Contract performance and legitimate interests",
        dataControllerContact: "privacy@careservice.es",
        userRights: [
          "Right to access personal data",
          "Right to rectification",
          "Right to erasure",
          "Right to restrict processing",
          "Right to data portability",
          "Right to object to processing"
        ]
      }
    }

    // Remove sensitive information from export
    const sanitizedData = sanitizeExportData(exportData)

    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `careservice-data-export-${authUser.id}-${timestamp}.json`

    // Return as downloadable JSON file
    return new NextResponse(JSON.stringify(sanitizedData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Export-Date': new Date().toISOString(),
        'X-User-ID': authUser.id,
      }
    })

  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    )
  }
})

/**
 * Sanitize export data by removing sensitive information
 */
function sanitizeExportData(data: Record<string, unknown>) {
  const sanitized = JSON.parse(JSON.stringify(data))

  // Remove password hashes and authentication tokens
  if (sanitized.personalInformation?.user) {
    delete sanitized.personalInformation.user.password
  }

  // Remove sensitive payment information
  if (sanitized.financialData) {
    sanitized.financialData = sanitized.financialData.map((transaction: Record<string, unknown>) => ({
      ...transaction,
      paymentIntentId: transaction.paymentIntentId ? '[REDACTED]' : null,
      // Keep amount and currency for transparency, but remove payment details
    }))
  }

  // Remove access tokens from calendar integrations
  if (sanitized.professionalSettings?.calendarIntegrations) {
    sanitized.professionalSettings.calendarIntegrations = sanitized.professionalSettings.calendarIntegrations.map((integration: Record<string, unknown>) => ({
      ...integration,
      accessToken: '[REDACTED]',
      refreshToken: '[REDACTED]',
    }))
  }

  // Remove internal system IDs that are not relevant to the user
  const removeInternalIds = (obj: unknown): unknown => {
    if (Array.isArray(obj)) {
      return obj.map(removeInternalIds)
    } else if (obj && typeof obj === 'object') {
      const cleaned = { ...obj }
      // Keep user-relevant IDs but remove internal references
      delete cleaned.ipAddress
      delete cleaned.userAgent
      return Object.fromEntries(
        Object.entries(cleaned).map(([key, value]) => [key, removeInternalIds(value)])
      )
    }
    return obj
  }

  return removeInternalIds(sanitized)
}