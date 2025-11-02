<template>
  <div class="user-security-section">
    <a-row :gutter="16">
      <!-- 2FA Status -->
      <a-col :span="12">
        <a-card title="Two-Factor Authentication">
          <a-descriptions :column="1" bordered size="small">
            <a-descriptions-item label="Status">
              <a-tag :color="user.twoFactorEnabled ? 'green' : 'default'">
                {{ user.twoFactorEnabled ? 'Enabled' : 'Disabled' }}
              </a-tag>
            </a-descriptions-item>
          </a-descriptions>

          <a-divider />

          <RBACGuard :permissions="['users.reset_2fa']">
            <a-button v-if="user.twoFactorEnabled" danger block @click="handleReset2FA">
              <template #icon><SafetyOutlined /></template>
              Reset 2FA
            </a-button>
          </RBACGuard>
        </a-card>
      </a-col>

      <!-- Account Status -->
      <a-col :span="12">
        <a-card title="Account Status">
          <a-descriptions :column="1" bordered size="small">
            <a-descriptions-item label="Status">
              <a-tag :color="getStatusColor(user.status)">
                {{ getStatusText(user.status) }}
              </a-tag>
            </a-descriptions-item>
          </a-descriptions>

          <a-divider />

          <RBACGuard :permissions="['users.manage_status']">
            <a-space direction="vertical" style="width: 100%">
              <a-button v-if="user.status === 'active'" danger block @click="handleDisableUser">
                <template #icon><StopOutlined /></template>
                Disable Account
              </a-button>
              <a-button v-else type="primary" block @click="handleEnableUser">
                <template #icon><CheckCircleOutlined /></template>
                Enable Account
              </a-button>
            </a-space>
          </RBACGuard>
        </a-card>
      </a-col>

      <!-- Risk Tags -->
      <a-col :span="24" style="margin-top: 16px">
        <a-card title="Risk Tags">
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
              Manage Risk Tags
            </a-button>
          </RBACGuard>
        </a-card>
      </a-col>

      <!-- VIP Level Adjustment -->
      <a-col :span="24" style="margin-top: 16px">
        <a-card title="VIP Level">
          <a-descriptions :column="1" bordered size="small">
            <a-descriptions-item label="Current VIP Level">
              <a-tag :color="getVipColor(user.vipLevel)"> VIP {{ user.vipLevel }} </a-tag>
            </a-descriptions-item>
          </a-descriptions>

          <a-divider />

          <RBACGuard :permissions="['users.adjust_vip']">
            <a-button type="primary" block @click="handleAdjustVip">
              <template #icon><CrownOutlined /></template>
              Adjust VIP Level
            </a-button>
            <a-alert
              v-if="user.vipLevel >= 3"
              message="Dual Approval Required"
              description="VIP level 3 and above require approval from another administrator."
              type="info"
              show-icon
              style="margin-top: 12px"
            />
          </RBACGuard>
        </a-card>
      </a-col>

      <!-- Devices -->
      <a-col :span="24" style="margin-top: 16px">
        <a-card title="Trusted Devices">
          <a-list v-if="devices && devices.length > 0" :data-source="devices" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <span>{{ item.deviceName }}</span>
                    <a-tag v-if="item.trusted" color="green" size="small" style="margin-left: 8px">
                      Trusted
                    </a-tag>
                  </template>
                  <template #description>
                    <div class="device-details">
                      <div>{{ item.os }} - {{ item.browser }}</div>
                      <div>
                        <span class="text-muted">Last seen:</span>
                        {{ formatDate(item.lastSeen) }}
                      </div>
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
          <a-empty v-else description="No devices found" :image="Empty.PRESENTED_IMAGE_SIMPLE" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { Empty } from 'ant-design-vue'
import {
  SafetyOutlined,
  StopOutlined,
  CheckCircleOutlined,
  TagsOutlined,
  CrownOutlined,
} from '@ant-design/icons-vue'
import RBACGuard from '@/shared/RBACGuard.vue'
import type { User, DeviceInfo } from '@/types/models'
import { formatDate } from '@/utils/date'

interface Props {
  user: User
  devices?: DeviceInfo[]
}

interface Emits {
  (e: 'reset2FA'): void
  (e: 'disableUser'): void
  (e: 'enableUser'): void
  (e: 'manageTags'): void
  (e: 'removeTag', tag: string): void
  (e: 'adjustVip'): void
}

withDefaults(defineProps<Props>(), {
  devices: () => [],
})

const emit = defineEmits<Emits>()

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

function getVipColor(level: number): string {
  if (level === 0) return 'default'
  if (level <= 2) return 'blue'
  if (level <= 4) return 'purple'
  return 'gold'
}

function handleReset2FA() {
  emit('reset2FA')
}

function handleDisableUser() {
  emit('disableUser')
}

function handleEnableUser() {
  emit('enableUser')
}

function handleManageTags() {
  emit('manageTags')
}

function handleRemoveTag(tag: string) {
  emit('removeTag', tag)
}

function handleAdjustVip() {
  emit('adjustVip')
}
</script>

<style scoped>
.user-security-section {
  /* Styles */
}

.device-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

.text-muted {
  color: #999;
}
</style>
