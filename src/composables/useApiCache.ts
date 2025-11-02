import { ref } from 'vue'
import { cacheManager, generateCacheKey, withCache } from '@/utils/cache'

/**
 * Composable for API response caching
 * Automatically caches GET requests with configurable TTL
 */
export function useApiCache() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch data with caching
   */
  const fetchWithCache = async <T>(
    fetcher: () => Promise<T>,
    cacheKey: string,
    options?: {
      ttl?: number
      forceRefresh?: boolean
    }
  ): Promise<T> => {
    loading.value = true
    error.value = null

    try {
      // Force refresh bypasses cache
      if (options?.forceRefresh) {
        cacheManager.delete(cacheKey)
      }

      const data = await withCache(fetcher, cacheKey, options?.ttl)
      loading.value = false
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch data'
      loading.value = false
      throw e
    }
  }

  /**
   * Invalidate cache for a specific key
   */
  const invalidateCache = (cacheKey: string) => {
    cacheManager.delete(cacheKey)
  }

  /**
   * Invalidate cache by pattern (prefix)
   */
  const invalidateCacheByPattern = (pattern: string) => {
    const stats = cacheManager.getStats()
    stats.keys.forEach((key) => {
      if (key.startsWith(pattern)) {
        cacheManager.delete(key)
      }
    })
  }

  /**
   * Clear all cache
   */
  const clearAllCache = () => {
    cacheManager.clear()
  }

  return {
    loading,
    error,
    fetchWithCache,
    invalidateCache,
    invalidateCacheByPattern,
    clearAllCache,
    generateCacheKey,
  }
}

/**
 * Cache TTL presets (in milliseconds)
 */
export const CacheTTL = {
  SHORT: 1 * 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 15 * 60 * 1000, // 15 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
} as const
