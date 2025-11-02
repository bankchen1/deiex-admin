/**
 * Cache utility for API responses and other data
 * Implements TTL (Time To Live) based caching
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private defaultTTL: number = 5 * 60 * 1000 // 5 minutes default

  /**
   * Set a cache entry with TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    }
    this.cache.set(key, entry)
  }

  /**
   * Get a cache entry if it exists and is not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    const now = Date.now()
    const age = now - entry.timestamp

    // Check if cache entry has expired
    if (age > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Check if a cache entry exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Delete a specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Clear expired cache entries
   */
  clearExpired(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    this.cache.forEach((entry, key) => {
      const age = now - entry.timestamp
      if (age > entry.ttl) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach((key) => this.cache.delete(key))
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

// Singleton instance
export const cacheManager = new CacheManager()

/**
 * Generate cache key from URL and params
 */
export function generateCacheKey(url: string, params?: Record<string, any>): string {
  if (!params) {
    return url
  }

  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${JSON.stringify(params[key])}`)
    .join('&')

  return `${url}?${sortedParams}`
}

/**
 * Cache decorator for API methods
 */
export function withCache<T>(
  fetcher: () => Promise<T>,
  cacheKey: string,
  ttl?: number
): Promise<T> {
  // Check cache first
  const cached = cacheManager.get<T>(cacheKey)
  if (cached !== null) {
    return Promise.resolve(cached)
  }

  // Fetch and cache
  return fetcher().then((data) => {
    cacheManager.set(cacheKey, data, ttl)
    return data
  })
}

/**
 * LocalStorage cache with expiration
 */
export class LocalStorageCache {
  private prefix: string

  constructor(prefix: string = 'app_cache_') {
    this.prefix = prefix
  }

  /**
   * Set item in localStorage with TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || 24 * 60 * 60 * 1000, // 24 hours default for localStorage
    }

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(entry))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }

  /**
   * Get item from localStorage if not expired
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key)
      if (!item) {
        return null
      }

      const entry: CacheEntry<T> = JSON.parse(item)
      const now = Date.now()
      const age = now - entry.timestamp

      // Check if expired
      if (age > entry.ttl) {
        this.delete(key)
        return null
      }

      return entry.data
    } catch (e) {
      console.error('Failed to read from localStorage:', e)
      return null
    }
  }

  /**
   * Delete item from localStorage
   */
  delete(key: string): void {
    localStorage.removeItem(this.prefix + key)
  }

  /**
   * Clear all items with this prefix
   */
  clear(): void {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key)
      }
    })
  }

  /**
   * Clear expired items
   */
  clearExpired(): void {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        const item = localStorage.getItem(key)
        if (item) {
          try {
            const entry: CacheEntry<any> = JSON.parse(item)
            const now = Date.now()
            const age = now - entry.timestamp
            if (age > entry.ttl) {
              localStorage.removeItem(key)
            }
          } catch (e) {
            // Invalid entry, remove it
            localStorage.removeItem(key)
          }
        }
      }
    })
  }
}

// Singleton for localStorage cache
export const localStorageCache = new LocalStorageCache()

// Periodically clear expired cache entries (every 5 minutes)
if (typeof window !== 'undefined') {
  setInterval(
    () => {
      cacheManager.clearExpired()
      localStorageCache.clearExpired()
    },
    5 * 60 * 1000
  )
}
