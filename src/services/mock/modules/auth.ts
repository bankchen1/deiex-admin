// Mock Auth Service
import type { MockResponse } from '../index'

class MockAuthService {
  private mockUsers = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@deiex.com',
      name: 'Admin User',
      roles: ['super_admin'],
      permissions: ['*'],
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      username: 'operator',
      email: 'operator@deiex.com',
      name: 'Operator User',
      roles: ['operator'],
      permissions: ['users:read', 'kyc:read', 'kyc:write', 'orders:read'],
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ]

  handle(url: string, method: string, data?: unknown): MockResponse | null {
    // Login
    if (url.includes('/auth/login') && method === 'post') {
      // Accept any username/password
      const user = this.mockUsers[0] // Always return admin user
      return {
        data: {
          success: true,
          data: {
            accessToken: 'mock-access-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
            user,
          },
          message: 'Login successful',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // Logout
    if (url.includes('/auth/logout') && method === 'post') {
      return {
        data: {
          success: true,
          data: null,
          message: 'Logout successful',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // Refresh token
    if (url.includes('/auth/refresh') && method === 'post') {
      return {
        data: {
          success: true,
          data: {
            accessToken: 'mock-access-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
          },
          message: 'Token refreshed',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    // Get current user
    if (url.includes('/auth/me') && method === 'get') {
      return {
        data: {
          success: true,
          data: this.mockUsers[0],
          message: 'User info retrieved',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }

    return null
  }
}

export const mockAuthService = new MockAuthService()
