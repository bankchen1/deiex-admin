/**
 * Assets Module Contracts
 *
 * Field contracts based on actual page usage (from field-map.json and pages analysis)
 * All fields must match exactly what pages expect to render
 */

// Deposit Entity Contracts
export interface Deposit {
  id: string
  userId: string
  userNickname?: string
  currency: string
  chain: string
  txHash: string
  amount: string
  status: 'pending' | 'confirming' | 'completed' | 'failed'
  confirmations: number
  requiredConfirmations: number
  riskFlags: string[]
  riskScore?: number
  address: string
  createdAt: string
  completedAt?: string
  notes?: string
}

// Withdrawal Entity Contracts
export interface Withdrawal {
  id: string
  userId: string
  userNickname?: string
  currency: string
  chain: string
  address: string
  amount: string
  fee: string
  status: 'pending' | 'reviewing' | 'approved' | 'processing' | 'completed' | 'rejected'
  riskScore: number
  matchedRules: string[]
  approvals: Approval[]
  txHash?: string
  createdAt: string
  completedAt?: string
  rejectedReason?: string
  notes?: string
}

export interface Approval {
  role: string
  adminId: string
  adminName: string
  action: 'approve' | 'reject'
  reason?: string
  timestamp: string
}

// Wallet Address Entity Contracts
export interface WalletAddress {
  id: string
  chain: string
  type: 'hot' | 'cold'
  address: string
  label: string
  balance: string
  balanceUsd: number
  status: 'active' | 'inactive' | 'maintenance'
  createdAt: string
  lastSyncAt: string
}

// Chain Health Entity Contracts
export interface ChainHealth {
  chain: string
  status: 'healthy' | 'degraded' | 'down'
  blockHeight: number
  lastBlockTime: string
  syncStatus: number
  nodeCount: number
  issues: string[]
}

// Retry Task Entity Contracts
export interface RetryTask {
  id: string
  type: 'deposit' | 'withdrawal'
  transactionId: string
  chain: string
  attempts: number
  maxAttempts: number
  lastError: string
  nextRetryAt: string
  createdAt: string
}

// List Response Contracts
export interface DepositListResponse {
  data: Deposit[]
  total: number
  page: number
  pageSize: number
}

export interface WithdrawalListResponse {
  data: Withdrawal[]
  total: number
  page: number
  pageSize: number
}

export interface WalletAddressListResponse {
  data: WalletAddress[]
  total: number
  page: number
  pageSize: number
}

// Detail Response Contracts
export interface DepositDetailResponse {
  deposit: Deposit
  transactionHistory?: any[]
  auditTrail?: any[]
}

export interface WithdrawalDetailResponse {
  withdrawal: Withdrawal
  transactionHistory?: any[]
  auditTrail?: any[]
}

// Query Contracts
export interface DepositQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'pending' | 'confirming' | 'completed' | 'failed'
  currency?: string
  chain?: string
  userId?: string
  search?: string
  startDate?: string
  endDate?: string
}

export interface WithdrawalQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'pending' | 'reviewing' | 'approved' | 'processing' | 'completed' | 'rejected'
  currency?: string
  chain?: string
  userId?: string
  search?: string
  startDate?: string
  endDate?: string
}

export interface WalletAddressQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  type?: 'hot' | 'cold'
  chain?: string
  status?: 'active' | 'inactive' | 'maintenance'
  search?: string
}

// Action Payload Contracts
export interface UpdateDepositNotesPayload {
  notes: string
}

export interface ApproveWithdrawalPayload {
  notes?: string
}

export interface RejectWithdrawalPayload {
  reason: string
  notes?: string
}

export interface CreateWalletAddressPayload {
  chain: string
  address: string
  label: string
  type: 'hot' | 'cold'
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

// Export Response Contract
export type AssetExportResponse = Blob

// Constants for field validation
export const DEPOSIT_STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirming', value: 'confirming' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
] as const

export const WITHDRAWAL_STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Reviewing', value: 'reviewing' },
  { label: 'Approved', value: 'approved' },
  { label: 'Processing', value: 'processing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Rejected', value: 'rejected' },
] as const

export const WALLET_ADDRESS_TYPES = [
  { label: 'Hot', value: 'hot' },
  { label: 'Cold', value: 'cold' },
] as const

export const CHAIN_STATUS_OPTIONS = [
  { label: 'Healthy', value: 'healthy' },
  { label: 'Degraded', value: 'degraded' },
  { label: 'Down', value: 'down' },
] as const
