// src/composables/useMobile.ts
import { ref } from 'vue'

/**
 * Composable for mobile detection and responsive handling
 */
export function useMobile() {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const windowWidth = ref(0)
  const windowHeight = ref(0)

  /**
   * Check device type based on window width
   */
  const checkDeviceType = () => {
    if (typeof window !== 'undefined') {
      windowWidth.value = window.innerWidth
      windowHeight.value = window.innerHeight

      // Mobile: width < 768px
      isMobile.value = window.innerWidth < 768

      // Tablet: width >= 768px and < 1024px
      isTablet.value = window.innerWidth >= 768 && window.innerWidth < 1024
    }
  }

  /**
   * Add orientation change listener for mobile devices
   */
  const handleOrientationChange = () => {
    // Small delay to ensure dimensions are updated
    if (typeof window !== 'undefined') {
      setTimeout(checkDeviceType, 100)
    }
  }

  /**
   * Get responsive class based on device type
   */
  const getResponsiveClass = () => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    return 'desktop'
  }

  /**
   * Check if device is touch-enabled
   */
  const isTouchDevice = () => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0
    }
    return false
  }

  /**
   * Get appropriate grid columns based on device
   */
  const getGridColumns = (mobile: number = 1, tablet: number = 2, desktop: number = 3) => {
    if (isMobile.value) return mobile
    if (isTablet.value) return tablet
    return desktop
  }

  /**
   * Get appropriate spacing based on device
   */
  const getResponsiveSpacing = (mobile: number = 8, tablet: number = 16, desktop: number = 24) => {
    if (isMobile.value) return mobile
    if (isTablet.value) return tablet
    return desktop
  }

  /**
   * Add event listeners - call this after mounting in Vue components
   */
  const addEventListeners = () => {
    if (typeof window !== 'undefined') {
      checkDeviceType()
      window.addEventListener('resize', checkDeviceType)
      window.addEventListener('orientationchange', handleOrientationChange)
    }
  }

  /**
   * Remove event listeners - call this before unmounting in Vue components
   */
  const removeEventListeners = () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', checkDeviceType)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }

  return {
    isMobile,
    isTablet,
    windowWidth,
    windowHeight,
    checkDeviceType,
    getResponsiveClass,
    isTouchDevice,
    getGridColumns,
    getResponsiveSpacing,
    addEventListeners,
    removeEventListeners,
  }
}
