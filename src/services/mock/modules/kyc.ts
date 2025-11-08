// Mock KYC Service
import type { MockResponse } from '../index'

class MockKycService {
  private mockKycRecords = Array.from({ length: 50 }, (_, i) => ({
    id: `kyc-${i + 1}`,
    userId: `user-${i + 1}`,
    country: ['US', 'UK', 'CN', 'JP', 'KR', 'SG', 'DE', 'FR'][i % 8],
    submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: ['pending', 'approved', 'rejected'][i % 3] as 'pending' | 'approved' | 'rejected',
    score: Math.floor(Math.random() * 100),
    matchedRules: i % 5 === 0 ? ['high_risk_country'] : i % 7 === 0 ? ['pep_check_failed'] : [],
    documents: [
      {
        type: 'id_front' as const,
        url: `https://example.com/kyc/id_front_${i + 1}.jpg`,
        ocrData: {
          name: `User ${i + 1}`,
          idNumber: `ID${Math.random().toString().substring(2, 12)}`,
          dateOfBirth: '1990-01-01',
        },
        verificationStatus: ['pending', 'verified', 'failed'][i % 3] as
          | 'pending'
          | 'verified'
          | 'failed',
      },
      {
        type: 'id_back' as const,
        url: `https://example.com/kyc/id_back_${i + 1}.jpg`,
        verificationStatus: ['pending', 'verified', 'failed'][i % 3] as
          | 'pending'
          | 'verified'
          | 'failed',
      },
      {
        type: 'selfie' as const,
        url: `https://example.com/kyc/selfie_${i + 1}.jpg`,
        verificationStatus: ['pending', 'verified', 'failed'][i % 3] as
          | 'pending'
          | 'verified'
          | 'failed',
      },
      {
        type: 'proof_of_address' as const,
        url: `https://example.com/kyc/address_${i + 1}.jpg`,
        verificationStatus: ['pending', 'verified', 'failed'][i % 3] as
          | 'pending'
          | 'verified'
          | 'failed',
      },
    ],
    reviewHistory: [],
    firstName: `First${i + 1}`,
    lastName: `Last${i + 1}`,
    dateOfBirth: `19${80 + (i % 20)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    nationality: ['US', 'UK', 'CN', 'JP', 'KR', 'SG', 'DE', 'FR'][i % 8],
    address: `${i + 1} Main Street`,
    city: ['New York', 'London', 'Beijing', 'Tokyo', 'Seoul', 'Singapore'][i % 6],
    postalCode: `${10000 + i}`,
    reviewedAt:
      i % 3 !== 0
        ? new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
    reviewedBy: i % 3 !== 0 ? `admin-${(i % 3) + 1}` : undefined,
    reviewNotes: i % 3 === 2 ? 'Documents not clear' : i % 3 === 1 ? 'Approved' : undefined,
    riskLevel: ['low', 'medium', 'high'][i % 3] as 'low' | 'medium' | 'high',
  }))

  handle(url: string, method: string, data?: unknown): MockResponse | null {
    // KYC stats
    if (url.includes('/kyc/stats') && method === 'get') {
      const pendingCount = this.mockKycRecords.filter((k) => k.status === 'pending').length
      const approvedCount = this.mockKycRecords.filter((k) => k.status === 'approved').length
      const rejectedCount = this.mockKycRecords.filter((k) => k.status === 'rejected').length

      return {
        data: {
          success: true,
          data: {
            total: this.mockKycRecords.length,
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount,
          },
          message: 'KYC stats retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // KYC detail by ID
    if (url.match(/\/kyc\/[^/]+$/) && method === 'get') {
      const id = url.split('/').pop()
      const kyc = this.mockKycRecords.find((k) => k.id === id) || this.mockKycRecords[0]

      return {
        data: {
          success: true,
          data: kyc,
          message: 'KYC record retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // KYC list
    if (url.includes('/kyc') && method === 'get' && !url.match(/\/kyc\/[^/]+$/)) {
      const urlObj = new URL(url, 'http://localhost')
      const page = parseInt(urlObj.searchParams.get('page') || '1')
      const pageSize = parseInt(urlObj.searchParams.get('pageSize') || '10')
      const start = (page - 1) * pageSize
      const end = start + pageSize

      return {
        data: {
          success: true,
          data: {
            data: this.mockKycRecords.slice(start, end),
            total: this.mockKycRecords.length,
            page,
            pageSize,
          },
          message: 'KYC records retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    if (url.includes('/kyc') && ['post', 'put', 'patch'].includes(method)) {
      return {
        data: {
          success: true,
          data: data || {},
          message: 'KYC updated successfully',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    return null
  }
}

export const mockKycService = new MockKycService()
