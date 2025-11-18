<template>
  <UsersPage
    :users="usersData"
    :stats="statsData"
    :loading="usersLoading || statsLoading"
    :error="usersError || statsError"
    @refresh="handleRefresh"
    @update-vip="handleUpdateVip"
    @update-tags="handleUpdateTags"
    @reset-2fa="handleReset2FA"
    @disable-user="handleDisableUser"
    @enable-user="handleEnableUser"
    @export-data="handleExportData"
  />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import {
  useUsersQuery,
  useUserStatsQuery,
  useUpdateUserVipMutation,
  useUpdateUserTagsMutation,
  useResetUser2FAMutation,
  useDisableUserMutation,
  useEnableUserMutation,
  useExportUsersMutation,
} from '@/composables/useUsers'
import UsersPage from '@/ui/pages/users/UsersPage.vue'

// Queries
const {
  data: usersData,
  isLoading: usersLoading,
  error: usersError,
  refetch: refetchUsers,
} = useUsersQuery()

const {
  data: statsData,
  isLoading: statsLoading,
  error: statsError,
  refetch: refetchStats,
} = useUserStatsQuery()

// Mutations
const { mutate: updateUserVip } = useUpdateUserVipMutation()
const { mutate: updateUserTags } = useUpdateUserTagsMutation()
const { mutate: resetUser2FA } = useResetUser2FAMutation()
const { mutate: disableUser } = useDisableUserMutation()
const { mutate: enableUser } = useEnableUserMutation()
const { mutate: exportUsers } = useExportUsersMutation()

// Methods
const handleRefresh = () => {
  refetchUsers()
  refetchStats()
}

const handleUpdateVip = (payload: {
  id: string
  vipLevel: number
  reason: string
  notes?: string
}) => {
  updateUserVip(payload, {
    onSuccess: () => {
      handleRefresh()
    },
  })
}

const handleUpdateTags = (payload: { id: string; tags: string[]; reason: string }) => {
  updateUserTags(payload, {
    onSuccess: () => {
      handleRefresh()
    },
  })
}

const handleReset2FA = (id: string) => {
  resetUser2FA(id, {
    onSuccess: () => {
      handleRefresh()
    },
  })
}

const handleDisableUser = (id: string) => {
  disableUser(id, {
    onSuccess: () => {
      handleRefresh()
    },
  })
}

const handleEnableUser = (id: string) => {
  enableUser(id, {
    onSuccess: () => {
      handleRefresh()
    },
  })
}

const handleExportData = (params?: any) => {
  exportUsers(params, {
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
  })
}

// Lifecycle
onMounted(() => {
  handleRefresh()
})
</script>
