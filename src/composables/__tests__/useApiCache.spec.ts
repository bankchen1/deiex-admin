// src/composables/__tests__/useApiCache.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useApiCache, CacheTTL } from '../useApiCache'
import { cacheManager } from '@/utils/cache'

describe('useApiCache', () => {
  beforeEach(() => {
    cacheManager.clear()
  })

  it('should fetch data with cache', async () => {
    const { fetchWithCache } = useApiCache()
    const fetcher = vi.fn().mockResolvedValue('test-data')

    const result = await fetchWithCache(fetcher, 'test-key', { ttl: CacheTTL.SHORT })

    expect(result).toBe('test-data')
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('should return cached data on subsequent calls', async () => {
    const { fetchWithCache } = useApiCache()
    const fetcher = vi.fn().mockResolvedValue('test-data')

    // First call
    await fetchWithCache(fetcher, 'test-key', { ttl: CacheTTL.SHORT })

    // Second call
    const result = await fetchWithCache(fetcher, 'test-key', { ttl: CacheTTL.SHORT })

    expect(result).toBe('test-data')
    expect(fetcher).toHaveBeenCalledTimes(1) // Should only be called once
  })

  it('should force refresh when forceRefresh option is true', async () => {
    const { fetchWithCache } = useApiCache()
    const fetcher = vi.fn().mockResolvedValue('test-data')

    // First call
    await fetchWithCache(fetcher, 'test-key', { ttl: CacheTTL.SHORT })

    // Second call with forceRefresh
    const result = await fetchWithCache(fetcher, 'test-key', {
      ttl: CacheTTL.SHORT,
      forceRefresh: true,
    })

    expect(result).toBe('test-data')
    expect(fetcher).toHaveBeenCalledTimes(2) // Should be called twice
  })

  it('should invalidate cache correctly', async () => {
    const { fetchWithCache, invalidateCache } = useApiCache()
    const fetcher = vi.fn().mockResolvedValue('test-data')

    // First call
    await fetchWithCache(fetcher, 'test-key', { ttl: CacheTTL.SHORT })

    // Invalidate cache
    invalidateCache('test-key')

    // Second call
    const result = await fetchWithCache(fetcher, 'test-key', { ttl: CacheTTL.SHORT })

    expect(result).toBe('test-data')
    expect(fetcher).toHaveBeenCalledTimes(2) // Should be called twice because cache was invalidated
  })

  it('should invalidate cache by pattern', async () => {
    const { fetchWithCache, invalidateCacheByPattern } = useApiCache()
    const fetcher = vi.fn().mockResolvedValue('test-data')

    // First calls
    await fetchWithCache(fetcher, 'users-list-1', { ttl: CacheTTL.SHORT })
    await fetchWithCache(fetcher, 'users-list-2', { ttl: CacheTTL.SHORT })
    await fetchWithCache(fetcher, 'orders-list', { ttl: CacheTTL.SHORT })

    // Invalidate by pattern
    invalidateCacheByPattern('users-list')

    // Second calls
    await fetchWithCache(fetcher, 'users-list-1', { ttl: CacheTTL.SHORT })
    await fetchWithCache(fetcher, 'users-list-2', { ttl: CacheTTL.SHORT })
    await fetchWithCache(fetcher, 'orders-list', { ttl: CacheTTL.SHORT })

    expect(fetcher).toHaveBeenCalledTimes(5) // 3 initial + 2 after invalidation (orders still cached)
  })

  it('should clear all cache', async () => {
    const { fetchWithCache, clearAllCache } = useApiCache()
    const fetcher = vi.fn().mockResolvedValue('test-data')

    // First calls
    await fetchWithCache(fetcher, 'test-key-1', { ttl: CacheTTL.SHORT })
    await fetchWithCache(fetcher, 'test-key-2', { ttl: CacheTTL.SHORT })

    // Clear all cache
    clearAllCache()

    // Second calls
    await fetchWithCache(fetcher, 'test-key-1', { ttl: CacheTTL.SHORT })
    await fetchWithCache(fetcher, 'test-key-2', { ttl: CacheTTL.SHORT })

    expect(fetcher).toHaveBeenCalledTimes(4) // Should be called 4 times because all cache was cleared
  })
})
