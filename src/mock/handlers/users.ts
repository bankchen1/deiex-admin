/**
 * Users Mock Handlers
 *
 * Mock handlers that align with the contracts defined in src/contracts/users.ts
 * All responses must pass contract validation
 */

import type {
  UserListResponse,
  UserDetailResponse,
  UserStats,
  UserQueryParams,
  UserVipUpdatePayload,
  UserTagUpdatePayload,
  User2FAResetPayload,
  UserDisablePayload,
  UserEnablePayload,
  UserExportResponse,
} from '@/contracts/users'

// Load mock data
let mockData = {
  users: [] as any[],
  stats: {} as any,
}

// Initialize mock data if not done already
if (mockData.users.length === 0) {
  // In real implementation, this would load from src/mock/examples/users.json
  // For now, we'll create sample data
  mockData.users = [
    {
      id: 'user_001',
      nickname: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone: '+1-555-0101',
      kycStatus: 'approved',
      vipLevel: 3,
      riskTags: ['high_value'],
      assetSnapshot: {
        totalUsd: 125000.5,
        availableUsd: 120000.25,
        frozenUsd: 5000.25,
        currencies: {
          BTC: {
            currency: 'BTC',
            available: '0.56789000',
            frozen: '0.00100000',
            usdValue: 34073.4,
          },
          ETH: {
            currency: 'ETH',
            available: '5.12345678',
            frozen: '0.00500000',
            usdValue: 15370.2,
          },
          USDT: {
            currency: 'USDT',
            available: '75556.65',
            frozen: '4990.05',
            usdValue: 75556.65,
          },
        },
      },
      createdAt: '2023-01-15T09:30:00Z',
      lastLoginAt: '2024-11-01T14:22:45Z',
      status: 'active',
      country: 'US',
      registrationIp: '192.168.1.100',
      twoFactorEnabled: true,
    },
    {
      id: 'user_002',
      nickname: 'Bob Smith',
      email: 'bob.smith@example.com',
      phone: '+1-555-0102',
      kycStatus: 'pending',
      vipLevel: 1,
      riskTags: ['new_user'],
      assetSnapshot: {
        totalUsd: 2500.0,
        availableUsd: 2500.0,
        frozenUsd: 0,
        currencies: {
          USDT: {
            currency: 'USDT',
            available: '2500.00',
            frozen: '0.00',
            usdValue: 2500.0,
          },
        },
      },
      createdAt: '2024-10-20T11:45:30Z',
      lastLoginAt: '2024-11-05T08:15:20Z',
      status: 'active',
      country: 'CA',
      registrationIp: '203.0.113.5',
    },
    {
      id: 'user_003',
      nickname: 'Carol Davis',
      email: 'carol.davis@example.com',
      phone: '+1-555-0103',
      kycStatus: 'rejected',
      vipLevel: 0,
      riskTags: ['high_risk', 'fraud_attempt'],
      assetSnapshot: {
        totalUsd: 0,
        availableUsd: 0,
        frozenUsd: 0,
        currencies: {},
      },
      createdAt: '2024-08-10T16:20:15Z',
      lastLoginAt: '2024-08-11T10:30:45Z',
      status: 'suspended',
      country: 'RU',
      registrationIp: '198.51.100.10',
    },
    {
      id: 'user_004',
      nickname: 'David Wilson',
      email: 'david.wilson@example.com',
      phone: '+1-555-0104',
      kycStatus: 'approved',
      vipLevel: 5,
      riskTags: ['vip_client', 'whitelisted'],
      assetSnapshot: {
        totalUsd: 2500000.75,
        availableUsd: 1800000.25,
        frozenUsd: 700000.5,
        currencies: {
          BTC: {
            currency: 'BTC',
            available: '45.12345678',
            frozen: '12.00000000',
            usdValue: 2707407.41,
          },
          ETH: {
            currency: 'ETH',
            available: '85.12345678',
            frozen: '45.00000000',
            usdValue: 25537.04,
          },
          USDT: {
            currency: 'USDT',
            available: '200000.00',
            frozen: '50000.00',
            usdValue: 200000.0,
          },
          XRP: {
            currency: 'XRP',
            available: '50000.00000000',
            frozen: '10000.00000000',
            usdValue: 20000.0,
          },
        },
      },
      createdAt: '2022-03-05T14:10:20Z',
      lastLoginAt: '2024-11-07T20:45:30Z',
      status: 'active',
      country: 'JP',
      registrationIp: '192.0.2.200',
      twoFactorEnabled: true,
    },
    {
      id: 'user_005',
      nickname: 'Emma Thompson',
      email: 'emma.thompson@example.com',
      phone: '+1-555-0105',
      kycStatus: 'none',
      vipLevel: 0,
      riskTags: [],
      assetSnapshot: {
        totalUsd: 50.0,
        availableUsd: 50.0,
        frozenUsd: 0,
        currencies: {
          USDT: {
            currency: 'USDT',
            available: '50.00',
            frozen: '0.00',
            usdValue: 50.0,
          },
        },
      },
      createdAt: '2024-11-05T09:15:00Z',
      lastLoginAt: '2024-11-05T09:15:30Z',
      status: 'active',
      country: 'GB',
      registrationIp: '203.0.113.150',
    },
  ]

  mockData.stats = {
    total: 1500,
    active: 1420,
    disabled: 35,
    suspended: 45,
    todayRegistrations: 12,
    kycPending: 89,
    kycApproved: 1200,
  }
}

/**
 * Handler for listing users with pagination and filtering
 */
export async function handleListUsers(params: UserQueryParams): Promise<UserListResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

  // Apply filters if provided
  let filteredUsers = [...mockData.users]

  if (params.status && params.status !== 'all') {
    filteredUsers = filteredUsers.filter((user) => user.status === params.status)
  }

  if (params.vipLevel !== undefined) {
    filteredUsers = filteredUsers.filter((user) => user.vipLevel === params.vipLevel)
  }

  if (params.kycStatus) {
    filteredUsers = filteredUsers.filter((user) => user.kycStatus === params.kycStatus)
  }

  if (params.tags && params.tags.length > 0) {
    filteredUsers = filteredUsers.filter((user) =>
      params.tags?.every((tag) => user.riskTags.includes(tag))
    )
  }

  if (params.search) {
    const searchTerm = params.search.toLowerCase()
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.id.toLowerCase().includes(searchTerm) ||
        (user.email && user.email.toLowerCase().includes(searchTerm)) ||
        (user.phone && user.phone.toLowerCase().includes(searchTerm)) ||
        (user.nickname && user.nickname.toLowerCase().includes(searchTerm))
    )
  }

  // Apply sorting if provided
  if (params.sortField) {
    filteredUsers.sort((a, b) => {
      const valA = a[params.sortField!] || ''
      const valB = b[params.sortField!] || ''

      if (typeof valA === 'string' && typeof valB === 'string') {
        return params.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }

      if (params.sortOrder === 'asc') {
        return valA < valB ? -1 : valA > valB ? 1 : 0
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0
      }
    })
  }

  // Apply pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize)

  return {
    data: paginatedUsers,
    total: filteredUsers.length,
    page,
    pageSize,
  }
}

/**
 * Handler for getting a user by ID
 */
export async function handleGetUserById(id: string): Promise<UserDetailResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300))

  const user = mockData.users.find((u) => u.id === id)
  if (!user) {
    throw new Error(`User with ID ${id} not found`)
  }

  // Generate detailed response with additional data
  return {
    user,
    loginRecords: [
      {
        id: 'login_001',
        userId: id,
        ip: '192.168.1.100',
        location: 'New York, US',
        device: 'Chrome on Windows',
        userAgent: 'Mozilla/5.0...',
        timestamp: '2024-11-01T14:22:45Z',
        success: true,
      },
      {
        id: 'login_002',
        userId: id,
        ip: '203.0.113.25',
        location: 'Toronto, CA',
        device: 'Safari on iPhone',
        userAgent: 'Mozilla/5.0...',
        timestamp: '2024-10-30T09:15:30Z',
        success: true,
      },
    ],
    devices: [
      {
        id: 'device_001',
        userId: id,
        deviceId: 'device_a1b2c3d4',
        deviceType: 'desktop',
        deviceName: 'Work Laptop',
        os: 'Windows 10',
        browser: 'Chrome',
        firstSeen: '2023-01-15T09:30:00Z',
        lastSeen: '2024-11-01T14:22:45Z',
        trusted: true,
      },
    ],
    chainAddresses: [
      {
        id: 'addr_001',
        chain: 'Bitcoin',
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        createdAt: '2023-02-01T12:00:00Z',
        lastUsed: '2024-10-15T08:30:00Z',
      },
    ],
    recentOrders: [
      {
        id: 'order_001',
        symbol: 'BTC/USDT',
        type: 'spot',
        side: 'buy',
        orderType: 'limit',
        price: '60000.00',
        quantity: '0.1',
        filled: '0.05',
        status: 'partial',
        createdAt: '2024-10-29T10:30:00Z',
        updatedAt: '2024-10-29T10:32:15Z',
      },
    ],
    recentPositions: [
      {
        id: 'pos_001',
        symbol: 'BTC/USDT',
        side: 'long',
        leverage: 5,
        marginMode: 'isolated',
        entryPrice: '59500.00',
        markPrice: '60200.00',
        liquidationPrice: '57000.00',
        quantity: '0.05',
        margin: '600.00',
        unrealizedPnl: '35.00',
        riskRatio: 0.15,
        createdAt: '2024-10-29T10:25:00Z',
      },
    ],
    auditTrail: [
      {
        id: 'audit_001',
        action: 'VIP_LEVEL_UPDATED',
        timestamp: '2024-09-15T14:30:00Z',
        by: 'admin_001',
        details: 'VIP level updated from 2 to 3',
      },
    ],
  }
}

/**
 * Handler for getting user statistics
 */
export async function handleGetUserStats(params?: {
  startDate?: string
  endDate?: string
}): Promise<UserStats> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 100))

  // For simplicity, return the same stats; in real app, this might filter by date
  return { ...mockData.stats }
}

/**
 * Handler for updating user VIP level
 */
export async function handleUpdateUserVip(id: string, payload: UserVipUpdatePayload): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300))

  const userIndex = mockData.users.findIndex((u) => u.id === id)
  if (userIndex === -1) {
    throw new Error(`User with ID ${id} not found`)
  }

  // Update the user's VIP level
  mockData.users[userIndex] = {
    ...mockData.users[userIndex],
    vipLevel: payload.vipLevel,
  }

  // Return updated user
  return mockData.users[userIndex]
}

/**
 * Handler for updating user risk tags
 */
export async function handleUpdateUserTags(
  id: string,
  payload: UserTagUpdatePayload
): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300))

  const userIndex = mockData.users.findIndex((u) => u.id === id)
  if (userIndex === -1) {
    throw new Error(`User with ID ${id} not found`)
  }

  // Update the user's risk tags
  mockData.users[userIndex] = {
    ...mockData.users[userIndex],
    riskTags: payload.tags,
  }

  // Return updated user
  return mockData.users[userIndex]
}

/**
 * Handler for resetting user 2FA
 */
export async function handleResetUser2FA(id: string, payload: User2FAResetPayload): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))

  const userIndex = mockData.users.findIndex((u) => u.id === id)
  if (userIndex === -1) {
    throw new Error(`User with ID ${id} not found`)
  }

  // Reset 2FA for the user
  mockData.users[userIndex] = {
    ...mockData.users[userIndex],
    twoFactorEnabled: false,
  }

  // Return updated user
  return mockData.users[userIndex]
}

/**
 * Handler for disabling a user account
 */
export async function handleDisableUser(id: string, payload: UserDisablePayload): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))

  const userIndex = mockData.users.findIndex((u) => u.id === id)
  if (userIndex === -1) {
    throw new Error(`User with ID ${id} not found`)
  }

  // Update user status to disabled
  mockData.users[userIndex] = {
    ...mockData.users[userIndex],
    status: 'disabled',
  }

  // Return updated user
  return mockData.users[userIndex]
}

/**
 * Handler for enabling a user account
 */
export async function handleEnableUser(id: string, payload: UserEnablePayload): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))

  const userIndex = mockData.users.findIndex((u) => u.id === id)
  if (userIndex === -1) {
    throw new Error(`User with ID ${id} not found`)
  }

  // Update user status to active
  mockData.users[userIndex] = {
    ...mockData.users[userIndex],
    status: 'active',
  }

  // Return updated user
  return mockData.users[userIndex]
}

/**
 * Handler for exporting user data
 */
export async function handleExportUsers(params: UserQueryParams): Promise<UserExportResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

  // In a real implementation, this would filter the users based on params
  // and return a Blob with CSV data
  const csvContent =
    'id,nickname,email,phone,kycStatus,vipLevel,status\n' +
    mockData.users
      .map(
        (user) =>
          `"${user.id}","${user.nickname}","${user.email}","${user.phone}","${user.kycStatus}",${user.vipLevel},"${user.status}"`
      )
      .join('\n')

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
}
