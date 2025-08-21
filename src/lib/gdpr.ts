/**
 * GDPR Compliance Utilities for CareService Platform
 * 
 * This module provides utilities for handling GDPR requirements including:
 * - Data anonymization
 * - Consent management
 * - Data retention policies
 * - Audit logging
 * - Data subject rights
 */

export type ConsentType = 
  | 'data_processing'
  | 'marketing_communications'
  | 'analytics_cookies'
  | 'performance_cookies'
  | 'functional_cookies'

export type DataSubjectRight = 
  | 'access'
  | 'rectification'
  | 'erasure'
  | 'restrict_processing'
  | 'data_portability'
  | 'object_processing'

export interface ConsentRecord {
  type: ConsentType
  granted: boolean
  grantedAt?: Date
  revokedAt?: Date
  legalBasis: string
  userAgent?: string
  ipAddress?: string
}

export interface DataProcessingActivity {
  id: string
  name: string
  purpose: string
  legalBasis: string
  dataCategories: string[]
  dataSubjects: string[]
  recipients: string[]
  transferToThirdCountries: boolean
  retentionPeriod: string
  securityMeasures: string[]
}

export interface AuditLogEntry {
  id: string
  userId: string
  action: string
  dataType: string
  timestamp: Date
  userAgent?: string
  ipAddress?: string
  metadata?: Record<string, any>
}

/**
 * Data retention policies for different types of data
 */
export const DATA_RETENTION_POLICIES = {
  user_profile: '7 years after account closure',
  booking_data: '7 years for tax purposes',
  financial_transactions: '7 years for accounting',
  marketing_communications: '2 years or until consent withdrawn',
  analytics_data: '26 months',
  session_logs: '12 months',
  audit_logs: '7 years',
} as const

/**
 * Legal bases for data processing under GDPR
 */
export const LEGAL_BASES = {
  consent: 'Article 6(1)(a) - Consent',
  contract: 'Article 6(1)(b) - Contract performance',
  legal_obligation: 'Article 6(1)(c) - Legal obligation',
  vital_interests: 'Article 6(1)(d) - Vital interests',
  public_task: 'Article 6(1)(e) - Public task',
  legitimate_interests: 'Article 6(1)(f) - Legitimate interests'
} as const

/**
 * Data processing activities register for GDPR Article 30
 */
export const PROCESSING_ACTIVITIES: DataProcessingActivity[] = [
  {
    id: 'user_registration',
    name: 'User Registration and Account Management',
    purpose: 'Create and manage user accounts, provide platform access',
    legalBasis: LEGAL_BASES.contract,
    dataCategories: ['Identity data', 'Contact data', 'Technical data'],
    dataSubjects: ['Platform users'],
    recipients: ['Internal staff', 'Cloud hosting provider'],
    transferToThirdCountries: false,
    retentionPeriod: DATA_RETENTION_POLICIES.user_profile,
    securityMeasures: ['Encryption at rest', 'Access controls', 'Regular backups']
  },
  {
    id: 'service_booking',
    name: 'Service Booking and Management',
    purpose: 'Process service bookings, coordinate between clients and professionals',
    legalBasis: LEGAL_BASES.contract,
    dataCategories: ['Identity data', 'Contact data', 'Location data', 'Service preferences'],
    dataSubjects: ['Clients', 'Professionals'],
    recipients: ['Service providers', 'Payment processors'],
    transferToThirdCountries: true,
    retentionPeriod: DATA_RETENTION_POLICIES.booking_data,
    securityMeasures: ['End-to-end encryption', 'Access logging', 'Data minimization']
  },
  {
    id: 'payment_processing',
    name: 'Payment and Financial Transaction Processing',
    purpose: 'Process payments, manage commissions, tax reporting',
    legalBasis: LEGAL_BASES.contract,
    dataCategories: ['Financial data', 'Transaction data', 'Identity data'],
    dataSubjects: ['All users'],
    recipients: ['Payment service providers', 'Tax authorities', 'Banks'],
    transferToThirdCountries: true,
    retentionPeriod: DATA_RETENTION_POLICIES.financial_transactions,
    securityMeasures: ['PCI DSS compliance', 'Tokenization', 'Fraud detection']
  },
  {
    id: 'marketing_communications',
    name: 'Marketing and Communications',
    purpose: 'Send promotional materials, service updates, newsletters',
    legalBasis: LEGAL_BASES.consent,
    dataCategories: ['Contact data', 'Preference data', 'Behavioral data'],
    dataSubjects: ['Consenting users'],
    recipients: ['Email service providers'],
    transferToThirdCountries: false,
    retentionPeriod: DATA_RETENTION_POLICIES.marketing_communications,
    securityMeasures: ['Opt-out mechanisms', 'Data encryption', 'Access controls']
  }
]

/**
 * Anonymize personal data by replacing with generic values
 */
export function anonymizePersonalData(data: any): any {
  if (!data || typeof data !== 'object') return data

  const anonymized = { ...data }
  
  // Fields to anonymize
  const personalFields = [
    'email', 'firstName', 'lastName', 'name', 'phone', 'address',
    'city', 'bio', 'website', 'socialLinks'
  ]

  personalFields.forEach(field => {
    if (anonymized[field]) {
      switch (field) {
        case 'email':
          anonymized[field] = 'anonymized@example.com'
          break
        case 'firstName':
        case 'lastName':
        case 'name':
          anonymized[field] = '[ANONYMIZED]'
          break
        case 'phone':
          anonymized[field] = '+00000000000'
          break
        case 'address':
          anonymized[field] = '[ANONYMIZED ADDRESS]'
          break
        case 'city':
          anonymized[field] = '[ANONYMIZED CITY]'
          break
        case 'bio':
          anonymized[field] = '[ANONYMIZED BIO]'
          break
        case 'website':
          anonymized[field] = 'https://anonymized.example.com'
          break
        case 'socialLinks':
          anonymized[field] = {}
          break
      }
    }
  })

  // Keep anonymized timestamp
  anonymized.anonymizedAt = new Date().toISOString()
  
  return anonymized
}

/**
 * Check if data should be deleted based on retention policy
 */
export function shouldDeleteData(dataType: keyof typeof DATA_RETENTION_POLICIES, createdAt: Date): boolean {
  const now = new Date()
  const retentionPolicy = DATA_RETENTION_POLICIES[dataType]
  
  // Parse retention periods (simplified implementation)
  const yearMatch = retentionPolicy.match(/(\d+)\s*years?/)
  const monthMatch = retentionPolicy.match(/(\d+)\s*months?/)
  
  let retentionDate = new Date(createdAt)
  
  if (yearMatch) {
    retentionDate.setFullYear(retentionDate.getFullYear() + parseInt(yearMatch[1]))
  } else if (monthMatch) {
    retentionDate.setMonth(retentionDate.getMonth() + parseInt(monthMatch[1]))
  }
  
  return now > retentionDate
}

/**
 * Generate GDPR-compliant privacy notice text
 */
export function generatePrivacyNotice(activity: DataProcessingActivity): string {
  return `
Data Processing Notice

Purpose: ${activity.purpose}
Legal Basis: ${activity.legalBasis}
Data Categories: ${activity.dataCategories.join(', ')}
Recipients: ${activity.recipients.join(', ')}
Retention Period: ${activity.retentionPeriod}
International Transfers: ${activity.transferToThirdCountries ? 'Yes' : 'No'}

Your Rights:
- Right to access your personal data
- Right to rectification of inaccurate data
- Right to erasure (right to be forgotten)
- Right to restrict processing
- Right to data portability
- Right to object to processing
- Right to withdraw consent (where applicable)

Contact: privacy@careservice.es
Data Protection Officer: dpo@careservice.es
  `.trim()
}

/**
 * Validate consent requirements for data processing
 */
export function validateConsentRequirements(
  activity: DataProcessingActivity,
  consents: ConsentRecord[]
): { valid: boolean; missingConsents: ConsentType[] } {
  // Only consent-based activities require explicit consent
  if (activity.legalBasis !== LEGAL_BASES.consent) {
    return { valid: true, missingConsents: [] }
  }

  const requiredConsents: ConsentType[] = []
  const missingConsents: ConsentType[] = []

  // Determine required consents based on activity
  switch (activity.id) {
    case 'marketing_communications':
      requiredConsents.push('marketing_communications')
      break
    default:
      requiredConsents.push('data_processing')
  }

  // Check if all required consents are granted
  requiredConsents.forEach(consentType => {
    const consent = consents.find(c => c.type === consentType)
    if (!consent || !consent.granted || consent.revokedAt) {
      missingConsents.push(consentType)
    }
  })

  return {
    valid: missingConsents.length === 0,
    missingConsents
  }
}

/**
 * Create audit log entry
 */
export function createAuditLogEntry(
  userId: string,
  action: string,
  dataType: string,
  metadata?: Record<string, any>
): AuditLogEntry {
  return {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    action,
    dataType,
    timestamp: new Date(),
    metadata
  }
}

/**
 * GDPR Article 30 compliance - Record of Processing Activities
 * This should be maintained as a formal register
 */
export function generateProcessingRecord(): string {
  return `
RECORD OF PROCESSING ACTIVITIES
Article 30 GDPR Compliance

Controller: CareService Platform
Contact: legal@careservice.es
Data Protection Officer: dpo@careservice.es

${PROCESSING_ACTIVITIES.map(activity => `
Activity: ${activity.name}
ID: ${activity.id}
Purpose: ${activity.purpose}
Legal Basis: ${activity.legalBasis}
Data Categories: ${activity.dataCategories.join(', ')}
Data Subjects: ${activity.dataSubjects.join(', ')}
Recipients: ${activity.recipients.join(', ')}
Third Country Transfers: ${activity.transferToThirdCountries ? 'Yes' : 'No'}
Retention Period: ${activity.retentionPeriod}
Security Measures: ${activity.securityMeasures.join(', ')}
`).join('\n---\n')}

Last Updated: ${new Date().toISOString()}
  `.trim()
}

/**
 * Data subject rights request handler interface
 */
export interface DataSubjectRequest {
  id: string
  userId: string
  requestType: DataSubjectRight
  requestedAt: Date
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  completedAt?: Date
  rejectionReason?: string
  requestDetails?: string
  responseData?: any
}

/**
 * Process data subject rights request
 */
export function processDataSubjectRequest(request: DataSubjectRequest): Promise<DataSubjectRequest> {
  // This would typically involve complex business logic
  // For now, return a simple implementation
  return Promise.resolve({
    ...request,
    status: 'completed',
    completedAt: new Date()
  })
}