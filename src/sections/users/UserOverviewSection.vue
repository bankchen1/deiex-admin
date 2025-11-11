<template>
  <a-row :gutter="16">
    <!-- Basic Information -->
    <a-col :span="12">
      <a-card title="Basic Information">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="User ID">
            {{ user.id }}
          </a-descriptions-item>
          <a-descriptions-item label="Nickname">
            {{ user.nickname }}
          </a-descriptions-item>
          <a-descriptions-item label="Email">
            {{ user.email }}
          </a-descriptions-item>
          <a-descriptions-item label="Phone">
            {{ user.phone }}
          </a-descriptions-item>
          <a-descriptions-item label="Country">
            {{ user.country || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="KYC Status">
            <a-tag :color="getKycStatusColor(user.kycStatus)">
              {{ getKycStatusText(user.kycStatus) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="VIP Level">
            <a-tag :color="getVipColor(user.vipLevel)"> VIP {{ user.vipLevel }} </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Status">
            <a-tag :color="getStatusColor(user.status)">
              {{ getStatusText(user.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="2FA Enabled">
            <a-tag :color="user.twoFactorEnabled ? 'green' : 'default'">
              {{ user.twoFactorEnabled ? 'Yes' : 'No' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Registration IP">
            {{ user.registrationIp || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="Registered At">
            {{ formatDate(user.createdAt) }}
          </a-descriptions-item>
          <a-descriptions-item label="Last Login">
            {{ formatDate(user.lastLoginAt) }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </a-col>

    <!-- Risk Tags & Session Info -->
    <a-col :span="12">
      <a-card title="Risk Tags" style="margin-bottom: 16px">
        <a-space v-if="user.riskTags && user.riskTags.length > 0" wrap>
          <a-tag
            v-for="tag in user.riskTags"
            :key="tag"
            color="red"
            closable
            @close="handleRemoveTag(tag)"
          >
            {{ tag }}
          </a-tag>
        </a-space>
        <a-empty v-else description="No risk tags" :image="Empty.PRESENTED_IMAGE_SIMPLE" />

        <a-divider />

        <RBACGuard :permissions="['users.manage_tags']">
          <a-button type="dashed" block @click="handleManageTags">
            <template #icon><TagsOutlined /></template>
            Manage Tags
          </a-button>
        </RBACGuard>
      </a-card>

      <a-card title="Session Information">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="Active Sessions">
            {{ sessionInfo?.activeSessions || 0 }}
          </a-descriptions-item>
          <a-descriptions-item label="Trusted Devices">
            {{ sessionInfo?.trustedDevices || 0 }}
          </a-descriptions-item>
          <a-descriptions-item label="Last Login IP">
            {{ sessionInfo?.lastLoginIp || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="Last Login Location">
            {{ sessionInfo?.lastLoginLocation || '-' }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </a-col>

    <!-- Login Tracking Map -->
    <a-col :span="24" style="margin-top: 16px">
      <a-card title="Login Tracking">
        <div class="map-placeholder">
          <EnvironmentOutlined style="font-size: 48px; color: #ccc" />
          <p>Login location map visualization would be displayed here</p>
          <p class="text-muted">Integration with mapping service required</p>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Empty } from 'ant-design-vue'
import { EnvironmentOutlined, TagsOutlined } from '@ant-design/icons-vue'
import RBACGuard from '@/shared/RBACGuard.vue'
import type { User } from '@/contracts/users'
import { formatDate } from '@/utils/date'

interface Props {
  user: User
  sessionInfo?: {
    activeSessions: number
    trustedDevices: number
    lastLoginIp: string
    lastLoginLocation: string
  }
}

interface Emits {
  (e: 'manageTags'): void
  (e: 'removeTag', tag: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function getKycStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    none: 'default',
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
  }
  return colorMap[status] || 'default'
}

function getKycStatusText(status: string): string {
  const textMap: Record<string, string> = {
    none: 'None',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  }
  return textMap[status] || status
}

function getVipColor(level: number): string {
  if (level === 0) return 'default'
  if (level <= 2) return 'blue'
  if (level <= 4) return 'purple'
  return 'gold'
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    active: 'green',
    disabled: 'red',
    suspended: 'orange',
  }
  return colorMap[status] || 'default'
}

function getStatusText(status: string): string {
  const textMap: Record<string, string> = {
    active: 'Active',
    disabled: 'Disabled',
    suspended: 'Suspended',
  }
  return textMap[status] || status
}

function handleManageTags() {
  emit('manageTags')
}

function handleRemoveTag(tag: string) {
  emit('removeTag', tag)
}
</script>

<style scoped>
.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
}

.text-muted {
  color: #999;
  font-size: 12px;
}
</style>
