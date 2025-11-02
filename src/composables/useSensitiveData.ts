// Sensitive Data Masking Composable
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { formatEmailMasked, formatPhoneMasked } from '@/utils/format'

export function useSensitiveData() {
  const authStore = useAuthStore()
  const isRevealed = ref(false)

  // Check if user has permission to reveal sensitive data
  const canReveal = computed(() => {
    return authStore.checkAnyPermission([
      'users.view_sensitive',
      'users.view_full',
      'admin.full_access',
    ])
  })

  function toggleReveal() {
    if (!canReveal.value) {
      return
    }
    isRevealed.value = !isRevealed.value
  }

  function maskEmail(email: string): string {
    if (!email) return ''
    if (isRevealed.value) return email
    return formatEmailMasked(email)
  }

  function maskPhone(phone: string): string {
    if (!phone) return ''
    if (isRevealed.value) return phone
    return formatPhoneMasked(phone)
  }

  function maskData(data: string, type: 'email' | 'phone'): string {
    if (!data) return ''
    if (isRevealed.value) return data

    switch (type) {
      case 'email':
        return formatEmailMasked(data)
      case 'phone':
        return formatPhoneMasked(data)
      default:
        return data
    }
  }

  return {
    isRevealed,
    canReveal,
    toggleReveal,
    maskEmail,
    maskPhone,
    maskData,
  }
}
