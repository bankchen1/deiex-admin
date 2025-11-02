// Formatting Utilities
import dayjs from 'dayjs'
import { DATE_FORMAT, DATETIME_FORMAT, TIME_FORMAT } from './constants'

/**
 * Format currency value
 */
export const formatCurrency = (
  value: number | string,
  currency = 'USD',
  locale = 'en-US'
): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '-'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

/**
 * Format number with specified decimals
 */
export const formatNumber = (value: number | string, decimals = 2): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '-'

  return num.toFixed(decimals)
}

/**
 * Format number with thousands separator
 */
export const formatNumberWithCommas = (value: number | string, decimals = 2): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '-'

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

/**
 * Format large numbers with K, M, B suffixes
 */
export const formatCompactNumber = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '-'

  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
  return num.toFixed(2)
}

/**
 * Format date
 */
export const formatDate = (date: string | number | Date, format = DATE_FORMAT): string => {
  if (!date) return '-'
  return dayjs(date).format(format)
}

/**
 * Format datetime
 */
export const formatDateTime = (date: string | number | Date, format = DATETIME_FORMAT): string => {
  if (!date) return '-'
  return dayjs(date).format(format)
}

/**
 * Format time
 */
export const formatTime = (date: string | number | Date, format = TIME_FORMAT): string => {
  if (!date) return '-'
  return dayjs(date).format(format)
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | number | Date): string => {
  if (!date) return '-'
  return dayjs(date).fromNow()
}

/**
 * Format percentage
 */
export const formatPercent = (value: number, decimals = 2): string => {
  if (isNaN(value)) return '-'
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format percentage from basis points
 */
export const formatBasisPoints = (value: number): string => {
  if (isNaN(value)) return '-'
  return `${(value / 100).toFixed(2)}%`
}

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  if (isNaN(bytes)) return '-'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Format phone number with masking
 */
export const formatPhoneMasked = (phone: string): string => {
  if (!phone || phone.length < 4) return phone
  return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4)
}

/**
 * Format email with masking
 */
export const formatEmailMasked = (email: string): string => {
  if (!email || !email.includes('@')) return email

  const parts = email.split('@')
  const username = parts[0]
  const domain = parts[1]

  if (!username || !domain || username.length <= 2) return email

  const visibleChars = Math.min(2, Math.floor(username.length / 3))
  const maskedUsername = username.slice(0, visibleChars) + '***' + username.slice(-visibleChars)

  return `${maskedUsername}@${domain}`
}

/**
 * Format address with masking (show first and last few characters)
 */
export const formatAddressMasked = (address: string, startChars = 6, endChars = 4): string => {
  if (!address || address.length <= startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

/**
 * Format transaction hash with masking
 */
export const formatTxHashMasked = (hash: string): string => {
  return formatAddressMasked(hash, 8, 6)
}

/**
 * Format crypto amount with proper precision
 */
export const formatCryptoAmount = (amount: number | string, decimals = 8): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '-'

  // Remove trailing zeros
  return parseFloat(num.toFixed(decimals)).toString()
}

/**
 * Format duration in milliseconds to human readable
 */
export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`
  return `${(ms / 3600000).toFixed(1)}h`
}

/**
 * Format status badge text
 */
export const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
