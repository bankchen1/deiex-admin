// Settings Contracts

// General Settings
export interface GeneralSettings {
  siteName: string
  siteDescription: string
  siteLogo?: string
  siteFavicon?: string
  siteUrl: string
  contactEmail: string
  supportEmail: string
  termsUrl: string
  privacyUrl: string
  maintenanceMode: boolean
  maintenanceMessage: string
  registrationEnabled: boolean
  kycRequired: boolean
  withdrawalVerificationRequired: boolean
  dailyWithdrawalLimit: number
  dailyWithdrawalLimitCurrency: string
  createdAt: string
  updatedAt: string
}

// Theme Settings
export interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  borderRadius: number // in pixels
  fontFamily: string
  fontSize: 'small' | 'medium' | 'large'
  darkMode: boolean
  themePreset: 'default' | 'dark' | 'light' | 'custom'
  customTheme?: {
    colors: {
      primary: string
      secondary: string
      background: string
      surface: string
      text: string
      textSecondary: string
      border: string
      success: string
      warning: string
      error: string
    }
    spacing: {
      unit: number // base spacing unit in pixels
      xs: number
      sm: number
      md: number
      lg: number
      xl: number
    }
  }
  createdAt: string
  updatedAt: string
}

// I18n
export interface I18nEntry {
  key: string
  en: string
  zh: string
  module: string
  description?: string
  lastUpdated: string
  lastUpdatedBy?: string
}

// Feature Flags
export interface FeatureFlag {
  key: string
  name: string
  description: string
  enabled: boolean
  rolloutPercentage: number // 0-100
  tags: string[]
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

// Cache
export interface CacheStatus {
  size: number // number of items in cache
  memoryUsage: number // in bytes
  hitRate: number // percentage
  avgResponseTime: number // in milliseconds
  lastUpdated: string
  cacheType: 'memory' | 'redis' | 'file'
  targets: Array<{
    name: string
    size: number
    memoryUsage: number
    enabled: boolean
  }>
}
