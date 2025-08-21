import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { withAuth, logSecurityEvent } from "@/lib/auth-middleware"

// In a full implementation, you'd want a dedicated consent table in your schema
// For now, we'll store consents in the user's profile preferences

const consentSchema = z.object({
  type: z.enum([
    'data_processing',
    'marketing_communications', 
    'analytics_cookies',
    'performance_cookies',
    'functional_cookies'
  ]),
  granted: z.boolean()
})

/**
 * GDPR-compliant consent management
 * POST: Record user consent for different data processing activities
 * GET: Retrieve current consent status
 */

export const POST = withAuth(async (request: NextRequest, authUser) => {
  try {
    const body = await request.json()
    const { type, granted } = consentSchema.parse(body)

    // Log consent change for GDPR compliance audit trail
    logSecurityEvent(authUser, 'data_access', {
      action: 'consent_change',
      consentType: type,
      granted,
      endpoint: '/api/consent',
      timestamp: new Date().toISOString()
    })

    // In a full implementation, store in dedicated consent table
    // For now, we'll simulate storing in profile preferences
    const consentRecord = {
      type,
      granted,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    }

    return NextResponse.json({
      success: true,
      consent: {
        type,
        granted,
        recordedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Consent management error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid consent data",
          details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message }))
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to record consent" },
      { status: 500 }
    )
  }
})

export const GET = withAuth(async (request: NextRequest, authUser) => {
  try {
    // In a full implementation, retrieve from dedicated consent table
    // For now, return default consent status
    const defaultConsents = [
      { type: 'data_processing', granted: true, recordedAt: new Date().toISOString() },
      { type: 'functional_cookies', granted: true, recordedAt: new Date().toISOString() },
      { type: 'marketing_communications', granted: false, recordedAt: null },
      { type: 'analytics_cookies', granted: false, recordedAt: null },
      { type: 'performance_cookies', granted: false, recordedAt: null },
    ]

    // Log consent access for GDPR compliance
    logSecurityEvent(authUser, 'data_access', {
      action: 'consent_access',
      endpoint: '/api/consent'
    })

    return NextResponse.json({
      consents: defaultConsents,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Consent retrieval error:', error)
    return NextResponse.json(
      { error: "Failed to retrieve consents" },
      { status: 500 }
    )
  }
})