// Number Utilities

/**
 * Safely parse number from string
 */
export const parseNumber = (value: string | number, defaultValue = 0): number => {
  if (typeof value === 'number') return value
  const parsed = parseFloat(value)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Safely parse integer from string
 */
export const parseInt = (value: string | number, defaultValue = 0): number => {
  if (typeof value === 'number') return Math.floor(value)
  const parsed = Number.parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Round number to specified decimal places
 */
export const round = (value: number, decimals = 2): number => {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Floor number to specified decimal places
 */
export const floor = (value: number, decimals = 2): number => {
  const multiplier = Math.pow(10, decimals)
  return Math.floor(value * multiplier) / multiplier
}

/**
 * Ceil number to specified decimal places
 */
export const ceil = (value: number, decimals = 2): number => {
  const multiplier = Math.pow(10, decimals)
  return Math.ceil(value * multiplier) / multiplier
}

/**
 * Clamp number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculate percentage
 */
export const percentage = (value: number, total: number): number => {
  if (total === 0) return 0
  return (value / total) * 100
}

/**
 * Calculate percentage change
 */
export const percentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return 0
  return ((newValue - oldValue) / oldValue) * 100
}

/**
 * Sum array of numbers
 */
export const sum = (numbers: number[]): number => {
  return numbers.reduce((acc, num) => acc + num, 0)
}

/**
 * Calculate average
 */
export const average = (numbers: number[]): number => {
  if (numbers.length === 0) return 0
  return sum(numbers) / numbers.length
}

/**
 * Calculate median
 */
export const median = (numbers: number[]): number => {
  if (numbers.length === 0) return 0

  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    const left = sorted[mid - 1]
    const right = sorted[mid]
    return left !== undefined && right !== undefined ? (left + right) / 2 : 0
  }

  return sorted[mid] ?? 0
}

/**
 * Find minimum value
 */
export const min = (numbers: number[]): number => {
  if (numbers.length === 0) return 0
  return Math.min(...numbers)
}

/**
 * Find maximum value
 */
export const max = (numbers: number[]): number => {
  if (numbers.length === 0) return 0
  return Math.max(...numbers)
}

/**
 * Generate random number between min and max
 */
export const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

/**
 * Generate random integer between min and max (inclusive)
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Check if number is even
 */
export const isEven = (value: number): boolean => {
  return value % 2 === 0
}

/**
 * Check if number is odd
 */
export const isOdd = (value: number): boolean => {
  return value % 2 !== 0
}

/**
 * Convert basis points to percentage
 */
export const bpsToPercent = (bps: number): number => {
  return bps / 100
}

/**
 * Convert percentage to basis points
 */
export const percentToBps = (percent: number): number => {
  return percent * 100
}

/**
 * Calculate compound interest
 */
export const compoundInterest = (
  principal: number,
  rate: number,
  time: number,
  frequency = 1
): number => {
  return principal * Math.pow(1 + rate / frequency, frequency * time)
}

/**
 * Calculate simple interest
 */
export const simpleInterest = (principal: number, rate: number, time: number): number => {
  return principal * rate * time
}

/**
 * Format number with ordinal suffix (1st, 2nd, 3rd, etc.)
 */
export const ordinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  const suffix = s[(v - 20) % 10] || s[v] || s[0] || 'th'
  return n + suffix
}

/**
 * Check if numbers are approximately equal (within epsilon)
 */
export const approximatelyEqual = (a: number, b: number, epsilon = 0.0001): boolean => {
  return Math.abs(a - b) < epsilon
}

/**
 * Linear interpolation between two values
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t
}

/**
 * Map value from one range to another
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

/**
 * Calculate standard deviation
 */
export const standardDeviation = (numbers: number[]): number => {
  const avg = average(numbers)
  const squareDiffs = numbers.map((value) => Math.pow(value - avg, 2))
  const avgSquareDiff = average(squareDiffs)
  return Math.sqrt(avgSquareDiff)
}

/**
 * Safe division (returns 0 if divisor is 0)
 */
export const safeDivide = (dividend: number, divisor: number, defaultValue = 0): number => {
  return divisor === 0 ? defaultValue : dividend / divisor
}

/**
 * Calculate moving average
 */
export const movingAverage = (numbers: number[], windowSize: number): number[] => {
  if (numbers.length === 0) return []

  const result: number[] = []

  for (let i = 0; i < numbers.length; i++) {
    const start = Math.max(0, i - windowSize + 1)
    const window = numbers.slice(start, i + 1)
    result.push(average(window))
  }

  return result
}
