/**
 * KYC Mock Handlers
 * 
 * Mock handlers that align with the contracts defined in src/contracts/kyc.ts
 * All responses must pass contract validation
 */

import type { 
  KycApplicationListResponse, 
  KycApplicationDetailResponse, 
  KycStats,
  KycApplicationQueryParams,
  ApproveKycApplicationPayload,
  RejectKycApplicationPayload
} from '@/contracts/kyc'

// Load mock data
let mockData = {
  applications: [] as any[],
  stats: {} as any
}

// Initialize mock data if not done already
if (mockData.applications.length === 0) {
  mockData.applications = [
    {
      id: "kyc_001",
      userId: "user_001",
      country: "US",
      submittedAt: "2024-11-01T09:30:00Z",
      status: "approved",
      score: 95,
      matchedRules: [],
      documents: [
        {
          type: "id_front",
          url: "https://example.com/docs/id_front_001.jpg",
          verificationStatus: "verified"
        },
        {
          type: "id_back", 
          url: "https://example.com/docs/id_back_001.jpg",
          verificationStatus: "verified"
        },
        {
          type: "selfie",
          url: "https://example.com/docs/selfie_001.jpg", 
          verificationStatus: "verified"
        }
      ],
      reviewHistory: [],
      firstName: "Alice",
      lastName: "Johnson",
      dateOfBirth: "1990-05-15",
      nationality: "US",
      address: "123 Main St",
      city: "New York",
      postalCode: "10001",
      reviewedAt: "2024-11-01T14:22:45Z",
      reviewedBy: "admin_001",
      reviewNotes: "All documents verified successfully",
      riskLevel: "low"
    },
    {
      id: "kyc_002",
      userId: "user_002",
      country: "CA",
      submittedAt: "2024-11-05T11:45:00Z",
      status: "pending",
      score: 65,
      matchedRules: ["new_user"],
      documents: [
        {
          type: "id_front",
          url: "https://example.com/docs/id_front_002.jpg",
          verificationStatus: "pending"
        },
        {
          type: "selfie",
          url: "https://example.com/docs/selfie_002.jpg",
          verificationStatus: "pending"
        }
      ],
      reviewHistory: [],
      firstName: "Bob",
      lastName: "Smith",
      dateOfBirth: "1985-12-03",
      nationality: "CA",
      address: "456 Oak Ave",
      city: "Toronto",
      postalCode: "M4W 1N5"
    },
    {
      id: "kyc_003",
      userId: "user_003",
      country: "RU",
      submittedAt: "2024-11-07T16:20:00Z",
      status: "rejected",
      score: 30,
      matchedRules: ["high_risk_country"],
      documents: [
        {
          type: "id_front",
          url: "https://example.com/docs/id_front_003.jpg",
          verificationStatus: "failed"
        },
        {
          type: "proof_of_address",
          url: "https://example.com/docs/address_003.jpg",
          verificationStatus: "failed"
        }
      ],
      reviewHistory: [],
      firstName: "Carol",
      lastName: "Davis",
      dateOfBirth: "1992-08-22",
      nationality: "RU",
      address: "789 Red Square",
      city: "Moscow",
      postalCode: "103000",
      reviewedAt: "2024-11-08T10:15:00Z",
      reviewedBy: "admin_002",
      reviewNotes: "Document verification failed, possible fraud",
      riskLevel: "high"
    },
    {
      id: "kyc_004",
      userId: "user_004",
      country: "JP",
      submittedAt: "2024-11-06T14:30:00Z",
      status: "pending",
      score: 80,
      matchedRules: [],
      documents: [
        {
          type: "id_front",
          url: "https://example.com/docs/id_front_004.jpg",
          verificationStatus: "verified"
        },
        {
          type: "id_back",
          url: "https://example.com/docs/id_back_004.jpg",
          verificationStatus: "verified"
        },
        {
          type: "selfie",
          url: "https://example.com/docs/selfie_004.jpg",
          verificationStatus: "pending"
        },
        {
          type: "proof_of_address",
          url: "https://example.com/docs/address_004.jpg",
          verificationStatus: "pending"
        }
      ],
      reviewHistory: [],
      firstName: "David",
      lastName: "Wilson",
      dateOfBirth: "1980-03-10",
      nationality: "JP",
      address: "101 Sakura St",
      city: "Tokyo",
      postalCode: "100-0001"
    },
    {
      id: "kyc_005",
      userId: "user_005",
      country: "GB",
      submittedAt: "2024-11-08T08:15:00Z",
      status: "pending",
      score: 45,
      matchedRules: ["low_quality_docs"],
      documents: [
        {
          type: "id_front",
          url: "https://example.com/docs/id_front_005.jpg",
          verificationStatus: "failed"
        }
      ],
      reviewHistory: [],
      firstName: "Emma",
      lastName: "Thompson",
      dateOfBirth: "1995-11-25",
      nationality: "GB",
      address: "202 Queen St",
      city: "London",
      postalCode: "SW1A 1AA"
    }
  ];

  mockData.stats = {
    total: 1250,
    pending: 245,
    approved: 950,
    rejected: 55,
    todaySubmissions: 12,
    avgProcessingTime: 4.5
  };
}

/**
 * Handler for listing KYC applications with pagination and filtering
 */
export async function handleListApplications(params: KycApplicationQueryParams): Promise<KycApplicationListResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
  
  // Apply filters if provided
  let filteredApplications = [...mockData.applications];
  
  if (params.status) {
    filteredApplications = filteredApplications.filter(app => app.status === params.status);
  }
  
  if (params.country) {
    filteredApplications = filteredApplications.filter(app => app.country === params.country);
  }
  
  if (params.riskLevel) {
    filteredApplications = filteredApplications.filter(app => app.riskLevel === params.riskLevel);
  }
  
  if (params.userId) {
    filteredApplications = filteredApplications.filter(app => app.userId === params.userId);
  }
  
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    filteredApplications = filteredApplications.filter(app => 
      app.id.toLowerCase().includes(searchTerm) ||
      (app.firstName && app.firstName.toLowerCase().includes(searchTerm)) ||
      (app.lastName && app.lastName.toLowerCase().includes(searchTerm)) ||
      (app.userId && app.userId.toLowerCase().includes(searchTerm))
    );
  }
  
  // Apply sorting if provided
  if (params.sortField) {
    filteredApplications.sort((a, b) => {
      const valA = a[params.sortField!] || '';
      const valB = b[params.sortField!] || '';
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return params.sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      
      if (params.sortOrder === 'asc') {
        return valA < valB ? -1 : valA > valB ? 1 : 0;
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0;
      }
    });
  }
  
  // Apply pagination
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;
  const startIndex = (page - 1) * pageSize;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + pageSize);
  
  return {
    data: paginatedApplications,
    total: filteredApplications.length,
    page,
    pageSize
  };
}

/**
 * Handler for getting a KYC application by ID
 */
export async function handleGetApplicationById(id: string): Promise<KycApplicationDetailResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
  
  const application = mockData.applications.find(app => app.id === id);
  if (!application) {
    throw new Error(`KYC Application with ID ${id} not found`);
  }
  
  // Generate detailed response with additional data
  return {
    application,
    user: {
      id: application.userId,
      nickname: `${application.firstName} ${application.lastName}`,
      email: `${application.firstName.toLowerCase()}.${application.lastName.toLowerCase()}@example.com`,
      phone: "+1-555-0101",
      kycStatus: application.status,
      vipLevel: 0,
      riskTags: [],
      createdAt: "2023-01-15T09:30:00Z",
      lastLoginAt: "2024-11-01T14:22:45Z",
      status: "active"
    },
    reviewHistory: application.reviewHistory || [],
    auditTrail: [
      {
        id: "audit_001",
        action: "KYC_SUBMITTED",
        timestamp: application.submittedAt,
        by: application.userId,
        details: "KYC application submitted with documents"
      },
      ...(application.status !== 'pending' ? [{
        id: "audit_002",
        action: application.status === 'approved' ? "KYC_APPROVED" : "KYC_REJECTED",
        timestamp: application.reviewedAt || new Date().toISOString(),
        by: application.reviewedBy || 'system',
        details: `KYC application ${application.status} by admin review`
      }] : [])
    ]
  };
}

/**
 * Handler for getting KYC statistics
 */
export async function handleGetStats(params?: { startDate?: string; endDate?: string }): Promise<KycStats> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 100));
  
  // For simplicity, return the same stats; in real app, this might filter by date
  return { ...mockData.stats };
}

/**
 * Handler for approving a KYC application
 */
export async function handleApproveApplication(id: string, payload: ApproveKycApplicationPayload): Promise<any> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
  
  const appIndex = mockData.applications.findIndex(app => app.id === id);
  if (appIndex === -1) {
    throw new Error(`KYC Application with ID ${id} not found`);
  }
  
  // Update the application status and details
  mockData.applications[appIndex] = {
    ...mockData.applications[appIndex],
    status: 'approved',
    reviewedAt: new Date().toISOString(),
    reviewedBy: 'admin_current', // This would be determined from context
    reviewNotes: payload.reviewNotes,
    riskLevel: payload.riskLevel || 'low'
  };
  
  // Return updated application
  return mockData.applications[appIndex];
}

/**
 * Handler for rejecting a KYC application
 */
export async function handleRejectApplication(id: string, payload: RejectKycApplicationPayload): Promise<any> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
  
  const appIndex = mockData.applications.findIndex(app => app.id === id);
  if (appIndex === -1) {
    throw new Error(`KYC Application with ID ${id} not found`);
  }
  
  // Update the application status and details
  mockData.applications[appIndex] = {
    ...mockData.applications[appIndex],
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
    reviewedBy: 'admin_current', // This would be determined from context
    reviewNotes: payload.reviewNotes,
    riskLevel: 'high'
  };
  
  // Return updated application
  return mockData.applications[appIndex];
}