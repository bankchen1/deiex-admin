/**
 * Zod schemas for Assets module validation
 *
 * Runtime validation schemas for asset data entities
 */

import { z } from 'zod'

// Deposit entity schema
export const DepositSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userNickname: z.string().optional(),
  currency: z.string(),
  chain: z.string(),
  txHash: z.string(),
  amount: z.string(),
  status: z.enum(['pending', 'confirming', 'completed', 'failed']),
  confirmations: z.number(),
  requiredConfirmations: z.number(),
  riskFlags: z.array(z.string()),
  riskScore: z.number().optional(),
  address: z.string(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  notes: z.string().optional(),
})

// Approval entity schema
export const ApprovalSchema = z.object({
  role: z.string(),
  adminId: z.string(),
  adminName: z.string(),
  action: z.enum(['approve', 'reject']),
  reason: z.string().optional(),
  timestamp: z.string().datetime(),
})

// Withdrawal entity schema
export const WithdrawalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userNickname: z.string().optional(),
  currency: z.string(),
  chain: z.string(),
  address: z.string(),
  amount: z.string(),
  fee: z.string(),
  status: z.enum(['pending', 'reviewing', 'approved', 'processing', 'completed', 'rejected']),
  riskScore: z.number(),
  matchedRules: z.array(z.string()),
  approvals: z.array(ApprovalSchema),
  txHash: z.string().optional(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  rejectedReason: z.string().optional(),
  notes: z.string().optional(),
})

// Wallet address entity schema
export const WalletAddressSchema = z.object({
  id: z.string(),
  chain: z.string(),
  type: z.enum(['hot', 'cold']),
  address: z.string(),
  label: z.string(),
  balance: z.string(),
  balanceUsd: z.number(),
  status: z.enum(['active', 'inactive', 'maintenance']),
  createdAt: z.string().datetime(),
  lastSyncAt: z.string().datetime(),
})

// Chain health entity schema
export const ChainHealthSchema = z.object({
  chain: z.string(),
  status: z.enum(['healthy', 'degraded', 'down']),
  blockHeight: z.number(),
  lastBlockTime: z.string().datetime(),
  syncStatus: z.number(),
  nodeCount: z.number(),
  issues: z.array(z.string()),
})

// Retry task entity schema
export const RetryTaskSchema = z.object({
  id: z.string(),
  type: z.enum(['deposit', 'withdrawal']),
  transactionId: z.string(),
  chain: z.string(),
  attempts: z.number(),
  maxAttempts: z.number(),
  lastError: z.string(),
  nextRetryAt: z.string().datetime(),
  createdAt: z.string().datetime(),
})

// Deposit list response schema
export const DepositListResponseSchema = z.object({
  data: z.array(DepositSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})

// Withdrawal list response schema
export const WithdrawalListResponseSchema = z.object({
  data: z.array(WithdrawalSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})

// Wallet address list response schema
export const WalletAddressListResponseSchema = z.object({
  data: z.array(WalletAddressSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})

// Deposit detail response schema
export const DepositDetailResponseSchema = z.object({
  deposit: DepositSchema,
  transactionHistory: z.array(z.any()).optional(),
  auditTrail: z.array(z.any()).optional(),
})

// Withdrawal detail response schema
export const WithdrawalDetailResponseSchema = z.object({
  withdrawal: WithdrawalSchema,
  transactionHistory: z.array(z.any()).optional(),
  auditTrail: z.array(z.any()).optional(),
})

// Deposit query parameters schema
export const DepositQueryParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  sortField: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  status: z.enum(['pending', 'confirming', 'completed', 'failed']).optional(),
  currency: z.string().optional(),
  chain: z.string().optional(),
  userId: z.string().optional(),
  search: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Withdrawal query parameters schema
export const WithdrawalQueryParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  sortField: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  status: z
    .enum(['pending', 'reviewing', 'approved', 'processing', 'completed', 'rejected'])
    .optional(),
  currency: z.string().optional(),
  chain: z.string().optional(),
  userId: z.string().optional(),
  search: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Wallet address query parameters schema
export const WalletAddressQueryParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  sortField: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  type: z.enum(['hot', 'cold']).optional(),
  chain: z.string().optional(),
  status: z.enum(['active', 'inactive', 'maintenance']).optional(),
  search: z.string().optional(),
})

// Update deposit notes payload schema
export const UpdateDepositNotesPayloadSchema = z.object({
  notes: z.string(),
})

// Approve withdrawal payload schema
export const ApproveWithdrawalPayloadSchema = z.object({
  notes: z.string().optional(),
})

// Reject withdrawal payload schema
export const RejectWithdrawalPayloadSchema = z.object({
  reason: z.string().min(1),
  notes: z.string().optional(),
})

// Create wallet address payload schema
export const CreateWalletAddressPayloadSchema = z.object({
  chain: z.string().min(1),
  address: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['hot', 'cold']),
})

// API response wrapper schema
export const AssetsApiResponseSchema = z.object({
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
export const AssetsValidationSchemas = {
  Deposit: DepositSchema,
  Approval: ApprovalSchema,
  Withdrawal: WithdrawalSchema,
  WalletAddress: WalletAddressSchema,
  ChainHealth: ChainHealthSchema,
  RetryTask: RetryTaskSchema,
  DepositListResponse: DepositListResponseSchema,
  WithdrawalListResponse: WithdrawalListResponseSchema,
  WalletAddressListResponse: WalletAddressListResponseSchema,
  DepositDetailResponse: DepositDetailResponseSchema,
  WithdrawalDetailResponse: WithdrawalDetailResponseSchema,
  DepositQueryParams: DepositQueryParamsSchema,
  WithdrawalQueryParams: WithdrawalQueryParamsSchema,
  WalletAddressQueryParams: WalletAddressQueryParamsSchema,
  UpdateDepositNotesPayload: UpdateDepositNotesPayloadSchema,
  ApproveWithdrawalPayload: ApproveWithdrawalPayloadSchema,
  RejectWithdrawalPayload: RejectWithdrawalPayloadSchema,
  CreateWalletAddressPayload: CreateWalletAddressPayloadSchema,
  ApiResponse: AssetsApiResponseSchema,
}
