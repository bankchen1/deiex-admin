/**
 * Mock User Data Generator
 *
 * Generates consistent mock user data for testing and development.
 */

export interface MockUser {
  id: string
  email: string
  nickname: string
  status: 'active' | 'disabled' | 'suspended'
  vipLevel: number
  createdAt: string
  lastLoginAt: string
  kycStatus: 'unverified' | 'pending' | 'approved' | 'rejected'
  countryCode: string
  totalBalance: number
}

/**
 * Generate a single mock user
 */
export const generateMockUser = (id: number): MockUser => {
  const statuses: MockUser['status'][] = ['active', 'disabled', 'suspended']
  const kycStatuses: MockUser['kycStatus'][] = ['unverified', 'pending', 'approved', 'rejected']
  const countries = ['US', 'CN', 'JP', 'KR', 'SG', 'UK', 'DE', 'FR', 'CA', 'AU']

  return {
    id: `user-${id}`,
    email: `user${id}@example.com`,
    nickname: `User ${id}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    vipLevel: Math.floor(Math.random() * 5),
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    kycStatus: kycStatuses[Math.floor(Math.random() * kycStatuses.length)],
    countryCode: countries[Math.floor(Math.random() * countries.length)],
    totalBalance: parseFloat((Math.random() * 100000).toFixed(2)),
  }
}

/**
 * Generate multiple mock users
 */
export const generateMockUsers = (count: number): MockUser[] => {
  return Array.from({ length: count }, (_, i) => generateMockUser(i + 1))
}

/**
 * Generate mock user statistics
 */
export const generateMockUserStats = () => {
  return {
    totalUsers: Math.floor(Math.random() * 100000),
    activeUsers: Math.floor(Math.random() * 50000),
    newUsersToday: Math.floor(Math.random() * 1000),
    kycApproved: Math.floor(Math.random() * 40000),
    vipUsers: Math.floor(Math.random() * 5000),
  }
}
