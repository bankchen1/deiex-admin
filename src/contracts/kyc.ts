/**
 * KYC Module Contracts
 *
 * Field contracts based on actual page usage (from field-map.json and pages analysis)
 * All fields must match exactly what pages expect to render
 */

// KYC Document Entity Contracts
export interface KycDocument {
  type: 'id_front' | 'id_back' | 'selfie' | 'proof_of_address'
  url: string
  ocrData?: Record<string, any>
  verificationStatus: 'pending' | 'verified' | 'failed'
}

// KYC Application Entity Contracts
export interface KycApplication {
  id: string
  userId: string
  country: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  score: number
  matchedRules: string[]
  documents: KycDocument[]
  reviewHistory: any[] // This may reference AuditRecord from models
  // Additional fields for detail view
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  nationality?: string
  address?: string
  city?: string
  postalCode?: string
  reviewedAt?: string
  reviewedBy?: string
  reviewNotes?: string
  riskLevel?: 'low' | 'medium' | 'high'
}

// List Response Contract
export interface KycApplicationListResponse {
  data: KycApplication[]
  total: number
  page: number
  pageSize: number
}

// Detail Response Contract
export interface KycApplicationDetailResponse {
  application: KycApplication
  user?: any // User details associated with the application
  reviewHistory?: any[]
  auditTrail?: any[]
}

// Statistics Contract
export interface KycStats {
  total: number
  pending: number
  approved: number
  rejected: number
  todaySubmissions: number
  avgProcessingTime: number // in hours
}

// Query Contracts
export interface KycApplicationQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'pending' | 'approved' | 'rejected'
  country?: string
  riskLevel?: 'low' | 'medium' | 'high'
  userId?: string
  search?: string
  startDate?: string
  endDate?: string
}

// Action Payload Contracts
export interface ApproveKycApplicationPayload {
  reviewNotes?: string
  riskLevel?: 'low' | 'medium' | 'high'
}

export interface RejectKycApplicationPayload {
  reason: string
  reviewNotes?: string
}

// Response Wrapper Contract
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      total: number
    }
  }
}

// Constants for field validation
export const KYC_STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
] as const

export const KYC_DOCUMENT_TYPES = [
  { label: 'ID Front', value: 'id_front' },
  { label: 'ID Back', value: 'id_back' },
  { label: 'Selfie', value: 'selfie' },
  { label: 'Proof of Address', value: 'proof_of_address' },
] as const

export const VERIFICATION_STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Verified', value: 'verified' },
  { label: 'Failed', value: 'failed' },
] as const

export const RISK_LEVEL_OPTIONS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
] as const
