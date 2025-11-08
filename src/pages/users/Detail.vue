<template>
  <div class="user-detail-page">
    <!-- Page Header -->
    <a-page-header title="User Detail" :sub-title="`User ID: ${id}`" @back="handleBack">
      <template #extra>
        <a-space>
          <a-button :loading="loading" @click="handleRefresh">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- Loading State -->
    <div v-if="loading && !user" class="loading-container">
      <a-spin size="large" />
    </div>

    <!-- Error State -->
    <a-alert
      v-else-if="error"
      type="error"
      :message="error"
      show-icon
      closable
      @close="error = null"
    />

    <!-- Content -->
    <div v-else-if="user" class="page-content">
      <a-tabs v-model:active-key="activeTab" type="card">
        <!-- Overview Tab -->
        <a-tab-pane key="overview" tab="Overview">
          <UserOverviewSection
            :user="user"
            :session-info="sessionInfo"
            @manage-tags="handleManageTags"
            @remove-tag="handleRemoveTag"
          />
        </a-tab-pane>

        <!-- Assets Tab -->
        <a-tab-pane key="assets" tab="Assets">
          <UserAssetsSection
            :asset-snapshot="user.assetSnapshot"
            :chain-addresses="userDetail?.chainAddresses"
          />
        </a-tab-pane>

        <!-- Orders Tab -->
        <a-tab-pane key="orders" tab="Orders">
          <UserOrdersSection
            :recent-orders="userDetail?.recentOrders"
            :recent-positions="userDetail?.recentPositions"
          />
        </a-tab-pane>

        <!-- Security Tab -->
        <a-tab-pane key="security" tab="Security">
          <UserSecuritySection
            :user="user"
            :devices="userDetail?.devices"
            @reset2-f-a="handleReset2FA"
            @disable-user="handleDisableUser"
            @enable-user="handleEnableUser"
            @manage-tags="handleManageTags"
            @remove-tag="handleRemoveTag"
            @adjust-vip="handleAdjustVip"
          />
        </a-tab-pane>

        <!-- Logs Tab -->
        <a-tab-pane key="logs" tab="Logs">
          <a-card title="Audit Trail">
            <AuditTrail
              v-if="userDetail?.auditTrail && userDetail.auditTrail.length > 0"
              :records="userDetail.auditTrail"
            />
            <a-empty v-else description="No audit trail available" />
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- Modals -->
    <AdjustVipModal
      v-model:open="adjustVipModalOpen"
      :user-id="id"
      :current-vip-level="user?.vipLevel"
      @submit="handleVipSubmit"
    />

    <Reset2FAModal v-model:open="reset2FAModalOpen" :user-id="id" @submit="handleReset2FASubmit" />

    <!-- Tag Management Drawer -->
    <a-drawer
      v-model:open="tagDrawerOpen"
      title="Manage Risk Tags"
      :width="500"
      @close="tagDrawerOpen = false"
    >
      <TagForm ref="tagFormRef" :user-id="id" :current-tags="user?.riskTags" />

      <template #footer>
        <a-space>
          <a-button @click="tagDrawerOpen = false">Cancel</a-button>
          <a-button type="primary" :loading="actionLoading" @click="handleTagSubmit">
            Save Changes
          </a-button>
        </a-space>
      </template>
    </a-drawer>

    <!-- Disable User Confirmation -->
    <a-modal
      v-model:open="disableUserModalOpen"
      title="Disable User Account"
      ok-text="Confirm"
      ok-type="danger"
      @ok="handleDisableUserConfirm"
    >
      <a-form layout="vertical">
        <a-form-item label="Reason" required>
          <a-textarea
            v-model:value="disableUserForm.reason"
            placeholder="Enter reason for disabling this account"
            :rows="3"
          />
        </a-form-item>
        <a-form-item label="Notes">
          <a-textarea
            v-model:value="disableUserForm.notes"
            placeholder="Additional notes (optional)"
            :rows="2"
          />
        </a-form-item>
      </a-form>
      <a-alert
        message="Warning"
        description="Disabling this account will prevent the user from logging in and performing any actions."
        type="warning"
        show-icon
      />
    </a-modal>

    <!-- Enable User Confirmation -->
    <a-modal
      v-model:open="enableUserModalOpen"
      title="Enable User Account"
      ok-text="Confirm"
      @ok="handleEnableUserConfirm"
    >
      <a-form layout="vertical">
        <a-form-item label="Reason" required>
          <a-textarea
            v-model:value="enableUserForm.reason"
            placeholder="Enter reason for enabling this account"
            :rows="3"
          />
        </a-form-item>
        <a-form-item label="Notes">
          <a-textarea
            v-model:value="enableUserForm.notes"
            placeholder="Additional notes (optional)"
            :rows="2"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import { useUsersStore } from '@/stores/users'
import AuditTrail from '@/shared/AuditTrail.vue'
import UserOverviewSection from '@/sections/users/UserOverviewSection.vue'
import UserAssetsSection from '@/sections/users/UserAssetsSection.vue'
import UserOrdersSection from '@/sections/users/UserOrdersSection.vue'
import UserSecuritySection from '@/sections/users/UserSecuritySection.vue'
import AdjustVipModal from '@/modals/users/AdjustVipModal.vue'
import Reset2FAModal from '@/modals/users/Reset2FAModal.vue'
import TagForm from '@/forms/users/TagForm.vue'
import type { UserVipUpdatePayload as VipUpdatePayload, UserTagUpdatePayload as TagUpdatePayload, User2FAResetPayload as Reset2FAPayload } from '@/contracts/users'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const id = ref(route.params.id as string)
const activeTab = ref('overview')
const loading = ref(false)
const error = ref<string | null>(null)

// Modals
const adjustVipModalOpen = ref(false)
const reset2FAModalOpen = ref(false)
const tagDrawerOpen = ref(false)
const disableUserModalOpen = ref(false)
const enableUserModalOpen = ref(false)

// Forms
const tagFormRef = ref()
const disableUserForm = ref({
  reason: '',
  notes: '',
})
const enableUserForm = ref({
  reason: '',
  notes: '',
})

// Computed
const user = computed(() => usersStore.currentUser)
const userDetail = computed(() => usersStore.currentUserDetail)
const actionLoading = computed(() => usersStore.actionLoading)

// Debug
console.log('[User Detail Page] Initial state:', {
  user: user.value,
  userDetail: userDetail.value,
  loading: loading.value,
})

// Session info (mock data - would come from API)
const sessionInfo = computed(() => ({
  activeSessions: 2,
  trustedDevices: 3,
  lastLoginIp: user.value?.registrationIp || '-',
  lastLoginLocation: 'New York, US',
}))

onMounted(() => {
  fetchDetail()
})

async function fetchDetail() {
  loading.value = true
  error.value = null
  try {
    await usersStore.fetchById(id.value)
  } catch (e: any) {
    error.value = e.message || 'Failed to load user details'
    message.error(error.value)
  } finally {
    loading.value = false
  }
}

function handleBack() {
  router.push('/admin/users/list')
}

function handleRefresh() {
  fetchDetail()
}

// VIP Adjustment
function handleAdjustVip() {
  adjustVipModalOpen.value = true
}

async function handleVipSubmit(data: any) {
  try {
    const payload: VipUpdatePayload = {
      vipLevel: data.vipLevel,
      reason: data.reason,
      notes: data.notes,
    }
    await usersStore.updateVip(id.value, payload)
    message.success('VIP level adjustment submitted successfully')
    adjustVipModalOpen.value = false
    await fetchDetail()
  } catch (e: any) {
    message.error(e.message || 'Failed to adjust VIP level')
  }
}

// 2FA Reset
function handleReset2FA() {
  reset2FAModalOpen.value = true
}

async function handleReset2FASubmit(data: Reset2FAPayload) {
  try {
    await usersStore.reset2FA(id.value, data)
    message.success('2FA reset successfully')
    reset2FAModalOpen.value = false
    await fetchDetail()
  } catch (e: any) {
    message.error(e.message || 'Failed to reset 2FA')
  }
}

// Tag Management
function handleManageTags() {
  tagDrawerOpen.value = true
}

async function handleTagSubmit() {
  if (!tagFormRef.value) return

  const isValid = await tagFormRef.value.validate()
  if (!isValid) return

  try {
    const formData = tagFormRef.value.formData
    const payload: TagUpdatePayload = {
      tags: formData.tags,
      reason: formData.reason,
    }
    await usersStore.updateTags(id.value, payload)
    message.success('Risk tags updated successfully')
    tagDrawerOpen.value = false
    await fetchDetail()
  } catch (e: any) {
    message.error(e.message || 'Failed to update risk tags')
  }
}

async function handleRemoveTag(tag: string) {
  if (!user.value) return

  Modal.confirm({
    title: 'Remove Risk Tag',
    content: `Are you sure you want to remove the tag "${tag}"?`,
    okText: 'Remove',
    okType: 'danger',
    onOk: async () => {
      try {
        const newTags = user.value!.riskTags.filter((t) => t !== tag)
        const payload: TagUpdatePayload = {
          tags: newTags,
          reason: `Removed tag: ${tag}`,
        }
        await usersStore.updateTags(id.value, payload)
        message.success('Risk tag removed successfully')
        await fetchDetail()
      } catch (e: any) {
        message.error(e.message || 'Failed to remove risk tag')
      }
    },
  })
}

// Account Status
function handleDisableUser() {
  disableUserForm.value = { reason: '', notes: '' }
  disableUserModalOpen.value = true
}

async function handleDisableUserConfirm() {
  if (!disableUserForm.value.reason) {
    message.warning('Please enter a reason')
    return
  }

  try {
    await usersStore.disableUser(id.value, disableUserForm.value)
    message.success('User account disabled successfully')
    disableUserModalOpen.value = false
    await fetchDetail()
  } catch (e: any) {
    message.error(e.message || 'Failed to disable user account')
  }
}

function handleEnableUser() {
  enableUserForm.value = { reason: '', notes: '' }
  enableUserModalOpen.value = true
}

async function handleEnableUserConfirm() {
  if (!enableUserForm.value.reason) {
    message.warning('Please enter a reason')
    return
  }

  try {
    await usersStore.enableUser(id.value, enableUserForm.value)
    message.success('User account enabled successfully')
    enableUserModalOpen.value = false
    await fetchDetail()
  } catch (e: any) {
    message.error(e.message || 'Failed to enable user account')
  }
}
</script>

<style scoped>
.user-detail-page {
  padding: 24px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.page-content {
  margin-top: 16px;
}
</style>
