// src/utils/__tests__/cache.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { cacheManager, generateCacheKey, withCache } from '../cache'

describe('cache utilities', () => {
  beforeEach(() => {
    cacheManager.clear()
  })

  describe('cacheManager', () => {
    it('should set and get values', () => {
      cacheManager.set('test-key', 'test-value', 5000)
      const result = cacheManager.get('test-key')
      expect(result).toBe('test-value')
    })

    it('should return null for expired values', () => {
      vi.useFakeTimers()
      cacheManager.set('test-key', 'test-value', 100) // 100ms TTL

      vi.advanceTimersByTime(150) // Advance past TTL

      const result = cacheManager.get('test-key')
      expect(result).toBeNull()
      vi.useRealTimers()
    })

    it('should delete values', () => {
      cacheManager.set('test-key', 'test-value', 5000)
      cacheManager.delete('test-key')
      const result = cacheManager.get('test-key')
      expect(result).toBeNull()
    })

    it('should clear all values', () => {
      cacheManager.set('test-key1', 'test-value1', 5000)
      cacheManager.set('test-key2', 'test-value2', 5000)
      cacheManager.clear()

      expect(cacheManager.get('test-key1')).toBeNull()
      expect(cacheManager.get('test-key2')).toBeNull()
    })

    it('should get stats', () => {
      cacheManager.set('test-key', 'test-value', 5000)
      const stats = cacheManager.getStats()

      expect(stats.size).toBe(1)
      expect(stats.keys).toContain('test-key')
    })
  })

  describe('generateCacheKey', () => {
    it('should generate correct cache key from object', () => {
      const params = { page: 1, size: 20, filter: 'test' }
      const key = generateCacheKey('users', params)
      // The order might vary, so we check for the presence of all components
      expect(key).toContain('users?')
      expect(key).toContain('filter=')
      expect(key).toContain('page=1')
      expect(key).toContain('size=20')
    })

    it('should generate correct cache key from string', () => {
      const key = generateCacheKey('users')
      expect(key).toBe('users')
    })
  })

  describe('withCache', () => {
    it('should return cached value if available', async () => {
      const fetcher = vi.fn().mockResolvedValue('fetched-data')

      // First call - should fetch
      const result1 = await withCache(fetcher, 'test-key', 5000)
      expect(result1).toBe('fetched-data')
      expect(fetcher).toHaveBeenCalledTimes(1)

      // Second call - should return cached value
      const result2 = await withCache(fetcher, 'test-key', 5000)
      expect(result2).toBe('fetched-data')
      expect(fetcher).toHaveBeenCalledTimes(1) // Still 1, because cache was used
    })

    it('should fetch new value if not cached', async () => {
      const fetcher = vi.fn().mockResolvedValue('new-data')

      const result = await withCache(fetcher, 'new-key', 5000)
      expect(result).toBe('new-data')
      expect(fetcher).toHaveBeenCalledTimes(1)
    })
  })
})
