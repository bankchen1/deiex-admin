// Date Utilities
import dayjs, { type Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetweenPlugin from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

// Extend dayjs with plugins
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetweenPlugin)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

/**
 * Get current timestamp in milliseconds
 */
export const now = (): number => Date.now()

/**
 * Get current date
 */
export const today = (): Dayjs => dayjs()

/**
 * Get start of day
 */
export const startOfDay = (date?: string | number | Date): Dayjs => {
  return dayjs(date).startOf('day')
}

/**
 * Get end of day
 */
export const endOfDay = (date?: string | number | Date): Dayjs => {
  return dayjs(date).endOf('day')
}

/**
 * Get start of week
 */
export const startOfWeek = (date?: string | number | Date): Dayjs => {
  return dayjs(date).startOf('week')
}

/**
 * Get end of week
 */
export const endOfWeek = (date?: string | number | Date): Dayjs => {
  return dayjs(date).endOf('week')
}

/**
 * Get start of month
 */
export const startOfMonth = (date?: string | number | Date): Dayjs => {
  return dayjs(date).startOf('month')
}

/**
 * Get end of month
 */
export const endOfMonth = (date?: string | number | Date): Dayjs => {
  return dayjs(date).endOf('month')
}

/**
 * Get date range for last N days
 */
export const getLastNDays = (days: number): [Dayjs, Dayjs] => {
  const end = dayjs()
  const start = end.subtract(days, 'day')
  return [start, end]
}

/**
 * Get date range for last N months
 */
export const getLastNMonths = (months: number): [Dayjs, Dayjs] => {
  const end = dayjs()
  const start = end.subtract(months, 'month')
  return [start, end]
}

/**
 * Get date range for current week
 */
export const getCurrentWeek = (): [Dayjs, Dayjs] => {
  return [startOfWeek(), endOfWeek()]
}

/**
 * Get date range for current month
 */
export const getCurrentMonth = (): [Dayjs, Dayjs] => {
  return [startOfMonth(), endOfMonth()]
}

/**
 * Get date range for last week
 */
export const getLastWeek = (): [Dayjs, Dayjs] => {
  const lastWeek = dayjs().subtract(1, 'week')
  return [startOfWeek(lastWeek.toDate()), endOfWeek(lastWeek.toDate())]
}

/**
 * Get date range for last month
 */
export const getLastMonth = (): [Dayjs, Dayjs] => {
  const lastMonth = dayjs().subtract(1, 'month')
  return [startOfMonth(lastMonth.toDate()), endOfMonth(lastMonth.toDate())]
}

/**
 * Check if date is in the past
 */
export const isPast = (date: string | number | Date): boolean => {
  return dayjs(date).isBefore(dayjs())
}

/**
 * Check if date is in the future
 */
export const isFuture = (date: string | number | Date): boolean => {
  return dayjs(date).isAfter(dayjs())
}

/**
 * Check if date is today
 */
export const isToday = (date: string | number | Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'day')
}

/**
 * Check if date is between two dates
 */
export const isDateBetween = (
  date: string | number | Date,
  start: string | number | Date,
  end: string | number | Date
): boolean => {
  return dayjs(date).isBetween(start, end, null, '[]')
}

/**
 * Get difference between two dates in specified unit
 */
export const getDifference = (
  date1: string | number | Date,
  date2: string | number | Date,
  unit: 'day' | 'hour' | 'minute' | 'second' = 'day'
): number => {
  return dayjs(date1).diff(dayjs(date2), unit)
}

/**
 * Add time to date
 */
export const addTime = (
  date: string | number | Date,
  amount: number,
  unit: 'day' | 'hour' | 'minute' | 'second'
): Dayjs => {
  return dayjs(date).add(amount, unit)
}

/**
 * Subtract time from date
 */
export const subtractTime = (
  date: string | number | Date,
  amount: number,
  unit: 'day' | 'hour' | 'minute' | 'second'
): Dayjs => {
  return dayjs(date).subtract(amount, unit)
}

/**
 * Convert to UTC
 */
export const toUTC = (date: string | number | Date): Dayjs => {
  return dayjs(date).utc()
}

/**
 * Convert from UTC to local
 */
export const fromUTC = (date: string | number | Date): Dayjs => {
  return dayjs.utc(date).local()
}

/**
 * Get timezone offset in minutes
 */
export const getTimezoneOffset = (): number => {
  return new Date().getTimezoneOffset()
}

/**
 * Parse date string with format
 */
export const parseDate = (dateString: string, format: string): Dayjs => {
  return dayjs(dateString, format)
}

/**
 * Check if date string is valid
 */
export const isValidDate = (dateString: string, format?: string): boolean => {
  return format ? dayjs(dateString, format).isValid() : dayjs(dateString).isValid()
}

/**
 * Get age from birthdate
 */
export const getAge = (birthdate: string | number | Date): number => {
  return dayjs().diff(dayjs(birthdate), 'year')
}

/**
 * Get business days between two dates (excluding weekends)
 */
export const getBusinessDays = (
  start: string | number | Date,
  end: string | number | Date
): number => {
  let count = 0
  let current = dayjs(start)
  const endDate = dayjs(end)

  while (current.isSameOrBefore(endDate, 'day')) {
    const dayOfWeek = current.day()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Not Sunday (0) or Saturday (6)
      count++
    }
    current = current.add(1, 'day')
  }

  return count
}

/**
 * Format duration between two dates
 */
export const formatDuration = (
  start: string | number | Date,
  end: string | number | Date
): string => {
  const duration = dayjs(end).diff(dayjs(start))
  const days = Math.floor(duration / (1000 * 60 * 60 * 24))
  const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

/**
 * Format date as relative time (e.g., "2 hours ago", "3 days ago")
 */
export const formatRelativeTime = (date: string | number | Date): string => {
  return dayjs(date).fromNow()
}

/**
 * Format date and time in standard format
 */
export const formatDateTime = (
  date: string | number | Date,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string => {
  return dayjs(date).format(format)
}

/**
 * Format date only
 */
export const formatDate = (date: string | number | Date, format: string = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format)
}

/**
 * Format time only
 */
export const formatTime = (date: string | number | Date, format: string = 'HH:mm:ss'): string => {
  return dayjs(date).format(format)
}

export { dayjs }
