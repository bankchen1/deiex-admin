// Constants and Error Code Mappings

export const ERROR_CODE_MAP: Record<string, string> = {
  AUTH_001: 'Invalid credentials',
  AUTH_002: 'Token expired, please login again',
  AUTH_003: 'Permission denied',
  AUTH_004: 'Account is disabled',
  AUTH_005: 'Invalid refresh token',
  KYC_001: 'KYC application not found',
  KYC_002: 'KYC already reviewed',
  KYC_003: 'Invalid KYC status transition',
  USER_001: 'User not found',
  USER_002: 'User already exists',
  USER_003: 'Invalid user status',
  ASSET_001: 'Insufficient balance',
  ASSET_002: 'Withdrawal limit exceeded',
  ASSET_003: 'Invalid withdrawal address',
  ASSET_004: 'Deposit not found',
  ASSET_005: 'Withdrawal not found',
  ORDER_001: 'Invalid order parameters',
  ORDER_002: 'Insufficient margin',
  ORDER_003: 'Order not found',
  ORDER_004: 'Order cannot be cancelled',
  CONFIG_001: 'Configuration validation failed',
  CONFIG_002: 'Version conflict, please refresh',
  CONFIG_003: 'Draft not found',
  CONFIG_004: 'Cannot rollback to this version',
  RISK_001: 'Risk rule validation failed',
  RISK_002: 'Risk limit exceeded',
  RISK_003: 'Blacklisted entity',
  SYSTEM_001: 'Internal server error',
  SYSTEM_002: 'Service unavailable',
  SYSTEM_003: 'Request timeout',
}

export const REQUEST_TIMEOUT = 30000 // 30 seconds
export const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes before expiration
export const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

export const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100']
export const DEFAULT_PAGE_SIZE = 20

export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const TIME_FORMAT = 'HH:mm:ss'
