// Mock Mode Middleware
// This middleware ensures all API calls are intercepted in mock mode

export const isMockMode = (): boolean => {
  return import.meta.env.VITE_USE_MOCK === 'true'
}

export const getMockModeInfo = () => {
  return {
    enabled: isMockMode(),
    message: isMockMode()
      ? 'Mock mode is active. All API calls return mock data. You can login with any credentials.'
      : 'Mock mode is disabled. API calls will reach the backend.',
  }
}

// Log mock mode status on app initialization
export const logMockModeStatus = () => {
  const info = getMockModeInfo()
  if (info.enabled) {
    console.log(
      '%c🎭 MOCK MODE ACTIVE',
      'background: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
    )
    console.log('%c' + info.message, 'color: #4CAF50; font-weight: bold;')
  } else {
    console.log(
      '%c🌐 LIVE MODE',
      'background: #2196F3; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
    )
  }
}
