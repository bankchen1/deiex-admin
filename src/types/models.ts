// Core Data Models

export interface AdminUser {
  id: string
  username: string
  email: string
  roles: string[]
  permissions: string[]
  avatar?: string
  lastLoginAt: string
  status: 'active' | 'disabled'
}

export interface AuditRecord {
  id: string
  adminId: string
  adminName: string
  action: string
  objectType: string
  objectId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  before?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  after?: any
  ip: string
  userAgent: string
  timestamp: string
}

export interface Version {
  id: string
  version: string
  createdAt: string
  createdBy: string
  notes: string
  tags: string[]
}

// KYC Models
export interface KycDocument {
  type: 'id_front' | 'id_back' | 'selfie' | 'proof_of_address'
  url: string
  ocrData?: Record<string, any>
  verificationStatus: 'pending' | 'verified' | 'failed'
}

export interface KycApplication {
  id: string
  userId: string
  country: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  score: number
  matchedRules: string[]
  documents: KycDocument[]
  reviewHistory: AuditRecord[]
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

// User Models
export interface CurrencyBalance {
  currency: string
  available: string
  frozen: string
  usdValue: number
}

export interface AssetSnapshot {
  totalUsd: number
  availableUsd: number
  frozenUsd: number
  currencies: Record<string, CurrencyBalance>
}

export interface User {
  id: string
  nickname: string
  email: string
  phone: string
  kycStatus: 'none' | 'pending' | 'approved' | 'rejected'
  vipLevel: number
  riskTags: string[]
  assetSnapshot: AssetSnapshot
  createdAt: string
  lastLoginAt: string
  status: 'active' | 'disabled' | 'suspended'
  country?: string
  registrationIp?: string
  twoFactorEnabled?: boolean
}

export interface LoginRecord {
  id: string
  userId: string
  ip: string
  location: string
  device: string
  userAgent: string
  timestamp: string
  success: boolean
}

export interface DeviceInfo {
  id: string
  userId: string
  deviceId: string
  deviceType: 'mobile' | 'desktop' | 'tablet'
  deviceName: string
  os: string
  browser: string
  firstSeen: string
  lastSeen: string
  trusted: boolean
}

export interface ChainAddress {
  chain: string
  address: string
  createdAt: string
}

export interface UserOrder {
  id: string
  symbol: string
  type: 'spot' | 'futures'
  side: 'buy' | 'sell'
  orderType: 'limit' | 'market' | 'stop-limit' | 'stop-market'
  price?: string
  quantity: string
  filled: string
  status: 'pending' | 'partial' | 'filled' | 'cancelled' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface UserPosition {
  id: string
  symbol: string
  side: 'long' | 'short'
  leverage: number
  entryPrice: string
  markPrice: string
  liquidationPrice: string
  quantity: string
  unrealizedPnl: string
  riskRatio: number
}

// Asset Models
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

export interface Approval {
  role: string
  adminId: string
  adminName: string
  action: 'approve' | 'reject'
  reason?: string
  timestamp: string
}

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

export interface ChainHealth {
  chain: string
  status: 'healthy' | 'degraded' | 'down'
  blockHeight: number
  lastBlockTime: string
  syncStatus: number
  nodeCount: number
  issues: string[]
}

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

// Order Models
export interface Order {
  id: string
  userId: string
  userNickname?: string
  symbol: string
  type: 'spot' | 'futures'
  side: 'buy' | 'sell'
  orderType: 'limit' | 'market' | 'stop-limit' | 'stop-market'
  price?: string
  quantity: string
  filled: string
  status: 'pending' | 'partial' | 'filled' | 'cancelled' | 'rejected'
  errorCode?: string
  matchingLatency?: number
  createdAt: string
  updatedAt: string
}

export interface FuturesOrder extends Order {
  leverage: number
  marginMode: 'isolated' | 'cross'
  positionSide: 'long' | 'short'
  liquidationPrice?: string
  fundingImpact?: string
}

export interface Position {
  id: string
  userId: string
  userNickname?: string
  symbol: string
  side: 'long' | 'short'
  leverage: number
  marginMode: 'isolated' | 'cross'
  entryPrice: string
  markPrice: string
  liquidationPrice: string
  quantity: string
  margin: string
  unrealizedPnl: string
  riskRatio: number
  createdAt: string
}

export interface Liquidation {
  id: string
  userId: string
  userNickname?: string
  symbol: string
  side: 'long' | 'short'
  leverage: number
  entryPrice: string
  liquidationPrice: string
  quantity: string
  loss: string
  timestamp: string
  reason: string
}

export interface CopyTradingRelation {
  id: string
  followerId: string
  followerNickname: string
  traderId: string
  traderNickname: string
  copyRatio: number
  maxPositionSize: string
  stopLossRatio: number
  profitShareRatio: number
  status: 'active' | 'paused' | 'stopped'
  totalProfit: string
  createdAt: string
}

// Config Models - Instruments
export interface Instrument {
  symbol: string
  displayName: Record<string, string> // i18n
  base: string
  quote: string
  type: 'spot' | 'futures'
  pricePrecision: number
  qtyStep: string
  minOrder: string
  visible: boolean
  rank: number
  region: string[]
  tags: string[]
  feeTemplateId?: string
  marginTemplateId?: string
  iconId?: string
  status: 'draft' | 'published'
  version: string
  createdAt: string
  updatedAt: string
  // Additional trading parameters
  maxOrder?: string
  maxPosition?: string
  priceTickSize?: string
  // Bindings
  oracleSource?: string
  indexSymbol?: string
  // Risk settings
  maxLeverage?: number
  maintenanceMarginRate?: number
}

// Config Models - Margin
export interface MarginTier {
  notionalFrom: string
  notionalTo: string
  initialMarginRate: number
  maintenanceMarginRate: number
  maxLeverage: number
}

export interface MarginTemplate {
  id: string
  name: string
  description?: string
  tiers: MarginTier[]
  status: 'draft' | 'published'
  version: string
  createdAt: string
  updatedAt: string
}

export interface MarginBinding {
  symbol: string
  templateId: string
  templateName: string
  status: 'draft' | 'published'
  version: string
  updatedAt: string
}

// Config Models - Fees
export interface TradingFeeTemplate {
  id: string
  vipLevel: number
  makerRate: number
  takerRate: number
  inheritFromPrevious: boolean
  description?: string
  status: 'draft' | 'published'
  version: string
  createdAt: string
  updatedAt: string
}

export interface WithdrawalFeeTemplate {
  id: string
  currency: string
  chain: string
  fixedFee: string
  percentageFee: number
  minFee: string
  dailyLimit: string
  description?: string
  status: 'draft' | 'published'
  version: string
  createdAt: string
  updatedAt: string
}

export interface FeeQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  status?: 'draft' | 'published'
  vipLevel?: number
  currency?: string
  chain?: string
}

export interface TradingFeeCreatePayload {
  vipLevel: number
  makerRate: number
  takerRate: number
  inheritFromPrevious?: boolean
  description?: string
}

export interface TradingFeeUpdatePayload {
  makerRate?: number
  takerRate?: number
  inheritFromPrevious?: boolean
  description?: string
}

export interface WithdrawalFeeCreatePayload {
  currency: string
  chain: string
  fixedFee: string
  percentageFee: number
  minFee: string
  dailyLimit: string
  description?: string
}

export interface WithdrawalFeeUpdatePayload {
  fixedFee?: string
  percentageFee?: number
  minFee?: string
  dailyLimit?: string
  description?: string
}

export interface FeeCalculationParams {
  type: 'trading' | 'withdrawal'
  vipLevel?: number
  tradingVolume?: string
  symbol?: string
  currency?: string
  chain?: string
  amount?: string
}

export interface FeeCalculationResult {
  type: 'trading' | 'withdrawal'
  vipLevel?: number
  makerFee?: string
  takerFee?: string
  withdrawalFee?: string
  effectiveRate?: number
  breakdown?: {
    fixedFee?: string
    percentageFee?: string
    totalFee?: string
  }
}

// Calendar Models
export interface FundingRule {
  id: string
  symbol: string
  period: number
  nextFundingTime: string
  calculationRule: string
  enabled: boolean
  status: 'draft' | 'published'
  version: string
  createdAt: string
  updatedAt: string
}

export interface MaintenanceWindow {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  affectedScope: string[]
  announcementPush: boolean
  status: 'draft' | 'published'
  version: string
  createdAt: string
  updatedAt: string
}

export interface Announcement {
  id: string
  title: {
    en: string
    zh?: string
    ja?: string
    ko?: string
  }
  content: {
    en: string
    zh?: string
    ja?: string
    ko?: string
  }
  type: 'event' | 'maintenance' | 'update' | 'promotion' | 'alert'
  pinned: boolean
  pushChannels: string[]
  publishTime: string
  status: 'draft' | 'published'
  version: string
  createdAt: string
  updatedAt: string
}

// Risk Models
export interface RiskCondition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains'
  value: any
}

export interface RiskAction {
  type: 'block' | 'review' | 'alert' | 'tag'
  params: Record<string, any>
}

export interface RiskRule {
  id: string
  name: string
  description?: string
  conditions: RiskCondition[]
  actions: RiskAction[]
  priority: number
  enabled: boolean
  status: 'draft' | 'published'
  version: string
  createdAt: string
  updatedAt: string
  createdBy?: string
  matchCount?: number
  lastMatchedAt?: string
}

export interface RiskLimit {
  id: string
  name: string
  description?: string
  scope: 'user' | 'country' | 'device' | 'currency'
  scopeValue?: string
  type: 'deposit' | 'withdrawal' | 'trading' | 'position'
  period: 'daily' | 'weekly' | 'monthly' | 'lifetime'
  threshold: string
  currency?: string
  enabled: boolean
  effectiveFrom?: string
  effectiveTo?: string
  createdAt: string
  updatedAt: string
  createdBy?: string
  currentUsage?: string
  usagePercentage?: number
}

export interface BlacklistEntry {
  id: string
  type: 'address' | 'device' | 'ip' | 'country' | 'email' | 'phone'
  value: string
  reason: string
  source: 'manual' | 'auto' | 'import'
  status: 'active' | 'expired' | 'removed'
  addedBy?: string
  addedAt: string
  expiresAt?: string
  removedAt?: string
  removedBy?: string
  notes?: string
  matchCount?: number
  lastMatchedAt?: string
}

export interface RiskSimulationResult {
  matched: boolean
  matchedRules: Array<{
    ruleId: string
    ruleName: string
    actions: RiskAction[]
  }>
  actions: RiskAction[]
  timestamp: string
}
