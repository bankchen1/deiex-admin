// src/utils/__tests__/performance.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PerformanceMonitor, usePerformance } from '../performance'

describe('PerformanceMonitor', () => {
  let performanceMonitor: PerformanceMonitor

  beforeEach(() => {
    performanceMonitor = PerformanceMonitor.getInstance()
    // Clear marks between tests
    performanceMonitor['marks'].clear()
  })

  it('should be a singleton', () => {
    const instance1 = PerformanceMonitor.getInstance()
    const instance2 = PerformanceMonitor.getInstance()
    expect(instance1).toBe(instance2)
  })

  it('should mark timestamps', () => {
    performanceMonitor.mark('test-mark')
    expect(performanceMonitor['marks'].has('test-mark')).toBe(true)
  })

  it('should calculate duration between marks', () => {
    // Mock performance.now
    const originalNow = performance.now
    let now = 0
    performance.now = vi.fn(() => now)

    performanceMonitor.mark('start')
    now = 100
    performanceMonitor.mark('end')

    const duration = performanceMonitor.getDuration('start', 'end')
    expect(duration).toBe(100)

    // Restore original performance.now
    performance.now = originalNow
  })

  it('should return null for non-existent marks', () => {
    const duration = performanceMonitor.getDuration('non-existent-start', 'non-existent-end')
    expect(duration).toBeNull()
  })
})

describe('usePerformance', () => {
  let performanceHook: ReturnType<typeof usePerformance>

  beforeEach(() => {
    performanceHook = usePerformance()
    // Clear marks between tests
    const monitor = PerformanceMonitor.getInstance()
    monitor['marks'].clear()
  })

  it('should start and end marks', () => {
    const monitor = PerformanceMonitor.getInstance()

    performanceHook.startMark('test-operation')
    expect(monitor['marks'].has('test-operation_start')).toBe(true)

    performanceHook.endMark('test-operation')
    expect(monitor['marks'].has('test-operation_end')).toBe(true)
  })

  it('should get duration', () => {
    // Mock performance.now
    const originalNow = performance.now
    let now = 0
    performance.now = vi.fn(() => now)

    performanceHook.startMark('test-operation')
    now = 200
    performanceHook.endMark('test-operation')

    const duration = performanceHook.getDuration('test-operation')
    expect(duration).toBe(200)

    // Restore original performance.now
    performance.now = originalNow
  })
})
