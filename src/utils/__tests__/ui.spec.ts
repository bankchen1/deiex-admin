// src/utils/__tests__/ui.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  debounce,
  throttle,
  formatNumber,
  formatCurrency,
  timeAgo,
  isValidEmail,
  validatePasswordStrength,
} from '../ui'

describe('UI Utilities', () => {
  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should debounce function calls', () => {
      const func = vi.fn()
      const debouncedFunc = debounce(func, 100)

      debouncedFunc()
      debouncedFunc()
      debouncedFunc()

      // Function should not be called immediately
      expect(func).not.toHaveBeenCalled()

      // Fast-forward time
      vi.advanceTimersByTime(100)

      // Function should be called once
      expect(func).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should throttle function calls', () => {
      const func = vi.fn()
      const throttledFunc = throttle(func, 100)

      throttledFunc()
      throttledFunc()
      throttledFunc()

      // Function should be called once immediately
      expect(func).toHaveBeenCalledTimes(1)

      // Fast-forward time
      vi.advanceTimersByTime(100)

      // Still only called once
      expect(func).toHaveBeenCalledTimes(1)
    })
  })

  describe('formatNumber', () => {
    it('should format numbers correctly', () => {
      expect(formatNumber(500)).toBe('500.00')
      expect(formatNumber(1500)).toBe('1.50K')
      expect(formatNumber(1500000)).toBe('1.50M')
      expect(formatNumber(1500000000)).toBe('1.50B')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56')
    })
  })

  describe('timeAgo', () => {
    it('should return correct time ago strings', () => {
      const now = new Date()

      // Just now
      expect(timeAgo(now)).toBe('just now')

      // 30 seconds ago
      const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000)
      expect(timeAgo(thirtySecondsAgo)).toBe('just now')

      // 2 minutes ago
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000)
      expect(timeAgo(twoMinutesAgo)).toBe('2 minutes ago')

      // 3 hours ago
      const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000)
      expect(timeAgo(threeHoursAgo)).toBe('3 hours ago')

      // 5 days ago
      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
      expect(timeAgo(fiveDaysAgo)).toBe('5 days ago')
    })
  })

  describe('isValidEmail', () => {
    it('should validate email addresses correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })
  })

  describe('validatePasswordStrength', () => {
    it('should validate password strength correctly', () => {
      // Weak password
      const weakPassword = validatePasswordStrength('123')
      expect(weakPassword.valid).toBe(false)
      expect(weakPassword.score).toBeLessThan(4)

      // Strong password
      const strongPassword = validatePasswordStrength('MyP@ssw0rd123')
      expect(strongPassword.valid).toBe(true)
      expect(strongPassword.score).toBe(5)
    })
  })
})
