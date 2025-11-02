// src/utils/performance.ts
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals'

/**
 * Report web vitals metrics to analytics
 */
export function reportWebVitals() {
  // Only run in browser environment
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    onCLS(sendToAnalytics)
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  }
}

/**
 * Send metrics to analytics endpoint
 */
function sendToAnalytics(metric: any) {
  // In a real application, you would send this data to your analytics service
  // For example, using fetch or a dedicated analytics library

  // For now, we'll just log to console in development
  if (import.meta.env.DEV) {
    console.log('[Web Vitals]', metric)
  }

  // Example of sending to an analytics endpoint:
  /*
  const body = JSON.stringify(metric)
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/analytics', body)
  } else {
    fetch('/analytics', { body, method: 'POST', keepalive: true })
  }
  */
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private marks: Map<string, number> = new Map()

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  /**
   * Mark a performance timestamp
   */
  mark(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(name)
      this.marks.set(name, performance.now())
    }
  }

  /**
   * Measure time between two marks
   */
  measure(name: string, startMark: string, endMark: string): void {
    if (typeof performance !== 'undefined') {
      try {
        performance.measure(name, startMark, endMark)
      } catch (e) {
        console.warn('Performance measure failed:', e)
      }
    }
  }

  /**
   * Get duration between two marks
   */
  getDuration(startMark: string, endMark: string): number | null {
    const start = this.marks.get(startMark)
    const end = this.marks.get(endMark)

    if (start !== undefined && end !== undefined) {
      return end - start
    }

    return null
  }

  /**
   * Log performance metrics
   */
  logMetrics(): void {
    if (typeof performance !== 'undefined' && import.meta.env.DEV) {
      const entries = performance.getEntriesByType('measure')
      console.group('Performance Metrics')
      entries.forEach((entry) => {
        console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`)
      })
      console.groupEnd()
    }
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()

/**
 * Composable for performance monitoring in Vue components
 */
export function usePerformance() {
  const startMark = (name: string) => {
    performanceMonitor.mark(`${name}_start`)
  }

  const endMark = (name: string) => {
    performanceMonitor.mark(`${name}_end`)
    performanceMonitor.measure(name, `${name}_start`, `${name}_end`)
  }

  const getDuration = (name: string) => {
    return performanceMonitor.getDuration(`${name}_start`, `${name}_end`)
  }

  const logMetrics = () => {
    performanceMonitor.logMetrics()
  }

  return {
    startMark,
    endMark,
    getDuration,
    logMetrics,
  }
}
