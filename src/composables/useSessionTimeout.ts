// Session Timeout Composable
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue'

const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
const WARNING_BEFORE_LOGOUT = 2 * 60 * 1000 // Show warning 2 minutes before logout

export function useSessionTimeout() {
  const authStore = useAuthStore()
  const router = useRouter()

  const lastActivityTime = ref<number>(Date.now())
  const inactivityTimer = ref<number | null>(null)
  const warningTimer = ref<number | null>(null)
  const warningModal = ref<any>(null)
  const isWarningShown = ref(false)

  // Events that count as user activity
  const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

  function updateActivity() {
    lastActivityTime.value = Date.now()

    // Close warning modal if user becomes active
    if (isWarningShown.value && warningModal.value) {
      warningModal.value.destroy()
      warningModal.value = null
      isWarningShown.value = false
    }

    // Reset timers
    resetTimers()
    startTimers()
  }

  function resetTimers() {
    if (inactivityTimer.value) {
      clearTimeout(inactivityTimer.value)
      inactivityTimer.value = null
    }
    if (warningTimer.value) {
      clearTimeout(warningTimer.value)
      warningTimer.value = null
    }
  }

  function startTimers() {
    // Only start timers if user is authenticated
    if (!authStore.isAuthenticated) {
      return
    }

    // Set warning timer (show warning before auto logout)
    warningTimer.value = window.setTimeout(() => {
      showWarningModal()
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE_LOGOUT)

    // Set inactivity timer (auto logout)
    inactivityTimer.value = window.setTimeout(() => {
      handleAutoLogout()
    }, INACTIVITY_TIMEOUT)
  }

  function showWarningModal() {
    if (isWarningShown.value) {
      return
    }

    isWarningShown.value = true
    const remainingSeconds = Math.floor(WARNING_BEFORE_LOGOUT / 1000)

    warningModal.value = Modal.warning({
      title: 'Session Timeout Warning',
      content: `Your session will expire in ${remainingSeconds} seconds due to inactivity. Please click "Stay Logged In" to continue your session.`,
      okText: 'Stay Logged In',
      onOk: () => {
        isWarningShown.value = false
        updateActivity()
      },
      onCancel: () => {
        isWarningShown.value = false
        handleAutoLogout()
      },
    })
  }

  async function handleAutoLogout() {
    // Close warning modal if open
    if (warningModal.value) {
      warningModal.value.destroy()
      warningModal.value = null
    }
    isWarningShown.value = false

    // Clear timers
    resetTimers()

    // Logout user
    try {
      await authStore.logout()
    } catch (error) {
      console.error('Auto logout failed:', error)
    }

    // Redirect to login with message
    router.push({
      path: '/login',
      query: { reason: 'session_timeout' },
    })

    // Show notification
    Modal.info({
      title: 'Session Expired',
      content: 'Your session has expired due to inactivity. Please log in again.',
    })
  }

  function setupActivityListeners() {
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true })
    })
  }

  function removeActivityListeners() {
    activityEvents.forEach((event) => {
      window.removeEventListener(event, updateActivity)
    })
  }

  function startSessionTimeout() {
    if (!authStore.isAuthenticated) {
      return
    }

    setupActivityListeners()
    startTimers()
  }

  function stopSessionTimeout() {
    removeActivityListeners()
    resetTimers()

    if (warningModal.value) {
      warningModal.value.destroy()
      warningModal.value = null
    }
    isWarningShown.value = false
  }

  // Auto-start on mount if authenticated
  onMounted(() => {
    if (authStore.isAuthenticated) {
      startSessionTimeout()
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    stopSessionTimeout()
  })

  return {
    lastActivityTime,
    startSessionTimeout,
    stopSessionTimeout,
    updateActivity,
  }
}
