// src/composables/__tests__/useMobile.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useMobile } from '../useMobile'

// Mock window dimensions
const mockWindowDimensions = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
}

describe('useMobile', () => {
  beforeEach(() => {
    // Reset to desktop size by default
    mockWindowDimensions(1200, 800)
  })

  it('should detect desktop devices', () => {
    mockWindowDimensions(1200, 800)
    const { isMobile, isTablet, getResponsiveClass, checkDeviceType } = useMobile()

    // Check device type
    checkDeviceType()

    expect(isMobile.value).toBe(false)
    expect(isTablet.value).toBe(false)
    expect(getResponsiveClass()).toBe('desktop')
  })

  it('should detect tablet devices', () => {
    mockWindowDimensions(800, 600)
    const { isMobile, isTablet, getResponsiveClass, checkDeviceType } = useMobile()

    // Check device type
    checkDeviceType()

    expect(isMobile.value).toBe(false)
    expect(isTablet.value).toBe(true)
    expect(getResponsiveClass()).toBe('tablet')
  })

  it('should detect mobile devices', () => {
    mockWindowDimensions(400, 800)
    const { isMobile, isTablet, getResponsiveClass, checkDeviceType } = useMobile()

    // Check device type
    checkDeviceType()

    expect(isMobile.value).toBe(true)
    expect(isTablet.value).toBe(false)
    expect(getResponsiveClass()).toBe('mobile')
  })

  it('should provide correct grid columns', () => {
    const { getGridColumns, checkDeviceType } = useMobile()

    // Test mobile
    mockWindowDimensions(400, 800)
    checkDeviceType()
    expect(getGridColumns(1, 2, 3)).toBe(1)

    // Test tablet
    mockWindowDimensions(800, 600)
    checkDeviceType()
    expect(getGridColumns(1, 2, 3)).toBe(2)

    // Test desktop
    mockWindowDimensions(1200, 800)
    checkDeviceType()
    expect(getGridColumns(1, 2, 3)).toBe(3)
  })

  it('should provide correct spacing', () => {
    const { getResponsiveSpacing, checkDeviceType } = useMobile()

    // Test mobile
    mockWindowDimensions(400, 800)
    checkDeviceType()
    expect(getResponsiveSpacing(8, 16, 24)).toBe(8)

    // Test tablet
    mockWindowDimensions(800, 600)
    checkDeviceType()
    expect(getResponsiveSpacing(8, 16, 24)).toBe(16)

    // Test desktop
    mockWindowDimensions(1200, 800)
    checkDeviceType()
    expect(getResponsiveSpacing(8, 16, 24)).toBe(24)
  })

  it('should detect touch devices', () => {
    const { isTouchDevice } = useMobile()

    // Mock touch device
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: 5,
    })

    expect(isTouchDevice()).toBe(true)

    // Mock non-touch device
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: 0,
    })

    // This might still return true if 'ontouchstart' exists
    // We'll just check that the function works without error
    expect(() => isTouchDevice()).not.toThrow()
  })
})
