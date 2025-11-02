<!--
  RBACGuard Component
  
  A permission-based rendering guard component that conditionally displays content
  based on user permissions.
  
  Features:
  - Single or multiple permission checks
  - 'all' or 'any' mode for multiple permissions
  - Fallback slot for unauthorized access
  - Integrates with auth store for permission checking
  
  Usage Examples:
  
  1. Single permission check:
  <RBACGuard permissions="kyc.review">
    <a-button>Review KYC</a-button>
  </RBACGuard>
  
  2. Multiple permissions with 'any' mode (default):
  <RBACGuard :permissions="['kyc.review', 'kyc.approve']">
    <a-button>Approve KYC</a-button>
  </RBACGuard>
  
  3. Multiple permissions with 'all' mode:
  <RBACGuard :permissions="['kyc.review', 'kyc.approve']" mode="all">
    <a-button>Approve KYC</a-button>
  </RBACGuard>
  
  4. With fallback content:
  <RBACGuard permissions="admin.settings">
    <a-button type="primary">Edit Settings</a-button>
    <template #fallback>
      <a-button disabled>Edit Settings (No Permission)</a-button>
    </template>
  </RBACGuard>
  
  5. With custom fallback message:
  <RBACGuard :permissions="['user.delete']">
    <a-button danger>Delete User</a-button>
    <template #fallback>
      <a-tooltip title="You don't have permission to delete users">
        <a-button disabled danger>Delete User</a-button>
      </a-tooltip>
    </template>
  </RBACGuard>
-->

<template>
  <slot v-if="hasAccess" />
  <slot v-else name="fallback" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Props {
  /**
   * Permission(s) required to access the content
   * Can be a single permission string or an array of permissions
   */
  permissions?: string | string[]

  /**
   * Mode for checking multiple permissions
   * - 'all': User must have all specified permissions
   * - 'any': User must have at least one of the specified permissions
   * @default 'any'
   */
  mode?: 'all' | 'any'
}

const props = withDefaults(defineProps<Props>(), {
  permissions: () => [],
  mode: 'any',
})

const authStore = useAuthStore()

// Normalize permissions to array
const permissionsArray = computed(() => {
  if (!props.permissions) return []
  return Array.isArray(props.permissions) ? props.permissions : [props.permissions]
})

// Check if user has required permissions
const hasAccess = computed(() => {
  // If no permissions specified, allow access
  if (permissionsArray.value.length === 0) return true

  // Check based on mode
  if (props.mode === 'all') {
    return authStore.checkAllPermissions(permissionsArray.value)
  } else {
    return authStore.checkAnyPermission(permissionsArray.value)
  }
})
</script>
