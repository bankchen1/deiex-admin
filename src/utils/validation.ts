// Validation Utilities

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (international format)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone)
}

/**
 * Validate number is within range
 */
export const validateNumberRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * Validate required field
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Validate URL
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate IP address (IPv4)
 */
export const validateIPv4 = (ip: string): boolean => {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (!ipRegex.test(ip)) return false

  const parts = ip.split('.')
  return parts.every((part) => {
    const num = parseInt(part, 10)
    return num >= 0 && num <= 255
  })
}

/**
 * Validate username (alphanumeric, underscore, hyphen, 3-20 chars)
 */
export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * Validate password strength
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}

/**
 * Validate positive number
 */
export const validatePositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0
}

/**
 * Validate non-negative number
 */
export const validateNonNegativeNumber = (value: number): boolean => {
  return !isNaN(value) && value >= 0
}

/**
 * Validate decimal places
 */
export const validateDecimalPlaces = (value: number, maxDecimals: number): boolean => {
  const parts = value.toString().split('.')
  if (parts.length === 1) return true
  const decimalPart = parts[1]
  return decimalPart ? decimalPart.length <= maxDecimals : true
}

/**
 * Validate JSON string
 */
export const validateJSON = (str: string): boolean => {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

/**
 * Validate cryptocurrency address (basic check)
 */
export const validateCryptoAddress = (address: string, chain?: string): boolean => {
  if (!address) return false

  // Basic validation - alphanumeric with specific length ranges
  if (chain === 'BTC') {
    return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) || /^bc1[a-z0-9]{39,59}$/.test(address)
  } else if (chain === 'ETH') {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  // Generic validation - check if address is defined
  return address ? /^[a-zA-Z0-9]{26,62}$/.test(address) : false
}

/**
 * Validate transaction hash
 */
export const validateTxHash = (hash: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(hash) || /^[a-fA-F0-9]{64}$/.test(hash)
}

/**
 * Validate string length
 */
export const validateLength = (str: string, min: number, max: number): boolean => {
  const length = str.trim().length
  return length >= min && length <= max
}

/**
 * Validate array length
 */
export const validateArrayLength = <T>(arr: T[], min: number, max: number): boolean => {
  return arr.length >= min && arr.length <= max
}
