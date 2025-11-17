/**
 * Zod schemas for Users module validation
 *
 * Runtime validation schemas for user data entities
 */

import { z } from 'zod'

// User entity schema
export const UserSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  email: z.string().email(),
  phone: z.string(),
  kycStatus: z.enum(['none', 'pending', 'approved', 'rejected']),
  vipLevel: z.number().int().min(0).max(5),
  riskTags: z.array(z.string()),
  assetSnapshot: z.object({
    totalUsd: z.number(),
    availableUsd: z.number(),
    frozenUsd: z.number(),
    currencies: z.record(
      z.string(),
      z.object({
        currency: z.string(),
        available: z.string(),
        frozen: z.string(),
        usdValue: z.number(),
      })
    ),
  }),
  createdAt: z.string().datetime(),
  lastLoginAt: z.string().datetime(),
  status: z.enum(['active', 'disabled', 'suspended']),
  country: z.string().optional(),
  registrationIp: z.string().optional(),
  twoFactorEnabled: z.boolean().optional(),
})

// Asset snapshot schema
export const AssetSnapshotSchema = z.object({
  totalUsd: z.number(),
  availableUsd: z.number(),
  frozenUsd: z.number(),
  currencies: z.record(
    z.string(),
    z.object({
      currency: z.string(),
      available: z.string(),
      frozen: z.string(),
      usdValue: z.number(),
    })
  ),
})

// Currency balance schema
export const CurrencyBalanceSchema = z.object({
  currency: z.string(),
  available: z.string(),
  frozen: z.string(),
  usdValue: z.number(),
})

// Login record schema
export const LoginRecordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  ip: z.string(),
  location: z.string(),
  device: z.string(),
  userAgent: z.string(),
  timestamp: z.string().datetime(),
  success: z.boolean(),
})

// Device info schema
export const DeviceInfoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  deviceId: z.string(),
  deviceType: z.enum(['mobile', 'desktop', 'tablet']),
  deviceName: z.string(),
  os: z.string(),
  browser: z.string(),
  firstSeen: z.string().datetime(),
  lastSeen: z.string().datetime(),
  trusted: z.boolean(),
})

// User list response schema
export const UserListResponseSchema = z.object({
  data: z.array(UserSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})

// User detail response schema
export const UserDetailResponseSchema = z.object({
  user: UserSchema,
  loginRecords: z.array(LoginRecordSchema).optional(),
  devices: z.array(DeviceInfoSchema).optional(),
  chainAddresses: z.array(z.any()).optional(),
  recentOrders: z.array(z.any()).optional(),
  recentPositions: z.array(z.any()).optional(),
  auditTrail: z.array(z.any()).optional(),
})

// User stats schema
export const UserStatsSchema = z.object({
  total: z.number(),
  active: z.number(),
  disabled: z.number(),
  suspended: z.number(),
  todayRegistrations: z.number(),
  kycPending: z.number(),
  kycApproved: z.number(),
})

// User query parameters schema
export const UserQueryParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  sortField: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  status: z.enum(['active', 'disabled', 'suspended', 'all']).optional(),
  vipLevel: z.number().optional(),
  kycStatus: z.enum(['none', 'pending', 'approved', 'rejected']).optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// User VIP update payload schema
export const UserVipUpdatePayloadSchema = z.object({
  vipLevel: z.number().int().min(0).max(5),
  reason: z.string().min(1),
  notes: z.string().optional(),
})

// User tag update payload schema
export const UserTagUpdatePayloadSchema = z.object({
  tags: z.array(z.string()),
  reason: z.string().min(1),
})

// User 2FA reset payload schema
export const User2FAResetPayloadSchema = z.object({
  reason: z.string().min(1),
  notes: z.string().optional(),
})

// User disable payload schema
export const UserDisablePayloadSchema = z.object({
  reason: z.string().min(1),
  notes: z.string().optional(),
})

// User enable payload schema
export const UserEnablePayloadSchema = z.object({
  reason: z.string().min(1),
  notes: z.string().optional(),
})

// API response wrapper schema
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z
    .object({
      code: z.union([z.number(), z.string()]),
      message: z.string(),
      details: z.any().optional(),
    })
    .optional(),
  meta: z
    .object({
      pagination: z
        .object({
          page: z.number(),
          pageSize: z.number(),
          total: z.number(),
        })
        .optional(),
    })
    .optional(),
})

// Export all schemas
export const UsersValidationSchemas = {
  User: UserSchema,
  AssetSnapshot: AssetSnapshotSchema,
  CurrencyBalance: CurrencyBalanceSchema,
  LoginRecord: LoginRecordSchema,
  DeviceInfo: DeviceInfoSchema,
  UserListResponse: UserListResponseSchema,
  UserDetailResponse: UserDetailResponseSchema,
  UserStats: UserStatsSchema,
  UserQueryParams: UserQueryParamsSchema,
  UserVipUpdatePayload: UserVipUpdatePayloadSchema,
  UserTagUpdatePayload: UserTagUpdatePayloadSchema,
  User2FAResetPayload: User2FAResetPayloadSchema,
  UserDisablePayload: UserDisablePayloadSchema,
  UserEnablePayload: UserEnablePayloadSchema,
  ApiResponse: ApiResponseSchema,
}
