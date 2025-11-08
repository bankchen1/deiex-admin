<template>
  <a-drawer
    v-model:open="visible"
    title="User Quick View"
    :width="600"
    :closable="true"
    @close="handleClose"
  >
    <a-spin :spinning="loading">
      <div v-if="user" class="quick-view-content">
        <!-- User Basic Info -->
        <a-card title="Basic Information" :bordered="false" class="info-card">
          <a-descriptions :column="1" size="small">
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
          </a-descriptions>
        </a-card>

        <!-- Assets -->
        <a-card title="Assets" :bordered="false" class="info-card">
          <div class="asset-summary">
            <div class="asset-item">
              <div class="asset-label">Total</div>
              <div class="asset-value total">
                {{ formatCurrency(user.assetSnapshot?.totalUsd || 0) }}
              </div>
            </div>
            <div class="asset-item">
              <div class="asset-label">Available</div>
              <div class="asset-value available">
                {{ formatCurrency(user.assetSnapshot?.availableUsd || 0) }}
              </div>
            </div>
            <div class="asset-item">
              <div class="asset-label">Frozen</div>
              <div class="asset-value frozen">
                {{ formatCurrency(user.assetSnapshot?.frozenUsd || 0) }}
              </div>
            </div>
          </div>

          <a-divider />

          <div v-if="user.assetSnapshot?.currencies" class="currency-list">
            <div
              v-for="(balance, currency) in user.assetSnapshot.currencies"
              :key="currency"
              class="currency-item"
            >
              <div class="currency-name">{{ currency }}</div>
              <div class="currency-balance">
                <div>Available: {{ balance.available }}</div>
                <div>Frozen: {{ balance.frozen }}</div>
                <div class="usd-value">≈ {{ formatCurrency(balance.usdValue) }}</div>
              </div>
            </div>
          </div>
        </a-card>

        <!-- Recent Logins -->
        <a-card title="Recent Logins" :bordered="false" class="info-card">
          <a-list
            v-if="loginRecords && loginRecords.length > 0"
            :data-source="loginRecords.slice(0, 5)"
            size="small"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <span>{{ item.location || 'Unknown Location' }}</span>
                    <a-tag v-if="!item.success" color="red" size="small" style="margin-left: 8px">
                      Failed
                    </a-tag>
                  </template>
                  <template #description>
                    <div class="login-details">
                      <div>
                        <EnvironmentOutlined />
                        {{ item.ip }}
                      </div>
                      <div>
                        <LaptopOutlined />
                        {{ item.device }}
                      </div>
                      <div>
                        <ClockCircleOutlined />
                        {{ formatDate(item.timestamp) }}
                      </div>
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
          <a-empty v-else description="No login records" />
        </a-card>

        <!-- Devices -->
        <a-card title="Devices" :bordered="false" class="info-card">
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
                        <span class="text-muted">First seen:</span>
                        {{ formatDate(item.firstSeen) }}
                      </div>
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
          <a-empty v-else description="No devices found" />
        </a-card>

        <!-- Actions -->
        <div class="drawer-actions">
          <a-button type="primary" @click="handleViewDetail"> View Full Details </a-button>
        </div>
      </div>

      <a-empty v-else description="No user data" />
    </a-spin>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { EnvironmentOutlined, LaptopOutlined, ClockCircleOutlined } from '@ant-design/icons-vue'
import { useUsersStore } from '@/stores/users'
import type { User, LoginRecord, DeviceInfo } from '@/contracts/users'
import { formatDate } from '@/utils/date'
import { formatCurrency } from '@/utils/format'

interface Props {
  open: boolean
  userId?: string
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'viewDetail', userId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = ref(false)
const loading = ref(false)
const user = ref<User | null>(null)
const loginRecords = ref<LoginRecord[]>([])
const devices = ref<DeviceInfo[]>([])
const usersStore = useUsersStore()

// Watch for open prop changes
watch(
  () => props.open,
  (newVal) => {
    visible.value = newVal
    if (newVal && props.userId) {
      fetchUserData()
    }
  },
  { immediate: true }
)

// Watch for visible changes
watch(visible, (newVal) => {
  emit('update:open', newVal)
})

async function fetchUserData() {
  if (!props.userId) return

  loading.value = true
  try {
    // Fetch user details using store instead of direct API call
    const response = await usersStore.fetchUserDetail(props.userId)
    user.value = response.user
    loginRecords.value = response.loginRecords || []
    devices.value = response.devices || []
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  } finally {
    loading.value = false
  }
}

function handleClose() {
  visible.value = false
}

function handleViewDetail() {
  if (props.userId) {
    emit('viewDetail', props.userId)
    handleClose()
  }
}

// Helper functions
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
</script>

<style scoped>
.quick-view-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  margin-bottom: 0;
}

.asset-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.asset-item {
  text-align: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.asset-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.asset-value {
  font-size: 18px;
  font-weight: 600;
}

.asset-value.total {
  color: #1890ff;
}

.asset-value.available {
  color: #52c41a;
}

.asset-value.frozen {
  color: #faad14;
}

.currency-list {
  max-height: 200px;
  overflow-y: auto;
}

.currency-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.currency-item:last-child {
  border-bottom: none;
}

.currency-name {
  font-weight: 600;
  font-size: 14px;
}

.currency-balance {
  text-align: right;
  font-size: 12px;
}

.currency-balance > div {
  margin-bottom: 2px;
}

.usd-value {
  color: #999;
}

.login-details,
.device-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

.login-details > div,
.device-details > div {
  display: flex;
  align-items: center;
  gap: 4px;
}

.text-muted {
  color: #999;
}

.drawer-actions {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
