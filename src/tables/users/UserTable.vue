<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :row-selection="rowSelection"
    :enable-export="true"
    :enable-column-config="true"
    row-key="id"
    storage-key="users_table_columns"
    @change="handleTableChange"
  >
    <template #toolbar>
      <slot name="toolbar" />
    </template>

    <!-- Custom column renderers -->
    <template #bodyCell="{ column, record }">
      <!-- ID column -->
      <template v-if="column.key === 'id'">
        <a-button type="link" size="small" @click="handleView(record)">
          {{ record.id }}
        </a-button>
      </template>

      <!-- Email/Phone column -->
      <template v-else-if="column.key === 'contact'">
        <div class="contact-info">
          <div v-if="record.email">
            <MailOutlined />
            {{ maskEmail(record.email) }}
          </div>
          <div v-if="record.phone">
            <PhoneOutlined />
            {{ maskPhone(record.phone) }}
          </div>
        </div>
      </template>

      <!-- KYC Status column -->
      <template v-else-if="column.key === 'kycStatus'">
        <a-tag :color="getKycStatusColor(record.kycStatus)">
          {{ getKycStatusText(record.kycStatus) }}
        </a-tag>
      </template>

      <!-- VIP Level column -->
      <template v-else-if="column.key === 'vipLevel'">
        <a-tag :color="getVipColor(record.vipLevel)"> VIP {{ record.vipLevel }} </a-tag>
      </template>

      <!-- Risk Tags column -->
      <template v-else-if="column.key === 'riskTags'">
        <a-space v-if="record.riskTags && record.riskTags.length > 0" size="small">
          <a-tag v-for="(tag, index) in record.riskTags.slice(0, 2)" :key="index" color="red">
            {{ tag }}
          </a-tag>
          <a-tooltip v-if="record.riskTags.length > 2" :title="getRemainingTags(record.riskTags)">
            <a-tag color="default"> +{{ record.riskTags.length - 2 }} </a-tag>
          </a-tooltip>
        </a-space>
        <span v-else class="text-muted">-</span>
      </template>

      <!-- Asset Snapshot column -->
      <template v-else-if="column.key === 'assetSnapshot'">
        <div class="asset-snapshot">
          <div class="total-usd">
            {{ formatCurrency(record.assetSnapshot?.totalUsd || 0) }}
          </div>
          <div class="asset-detail">
            <span class="available">
              {{ formatCurrency(record.assetSnapshot?.availableUsd || 0) }}
            </span>
            /
            <span class="frozen">
              {{ formatCurrency(record.assetSnapshot?.frozenUsd || 0) }}
            </span>
          </div>
        </div>
      </template>

      <!-- Status column -->
      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ getStatusText(record.status) }}
        </a-tag>
      </template>

      <!-- Actions column -->
      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleView(record)"> View </a-button>
          <a-button type="link" size="small" @click="handleQuickView(record)">
            Quick View
          </a-button>
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MailOutlined, PhoneOutlined } from '@ant-design/icons-vue'
import ServerTable from '@/shared/ServerTable.vue'
import type { User } from '@/types/models'
import { formatDate } from '@/utils/date'
import { formatCurrency } from '@/utils/format'

interface Props {
  dataSource: User[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
  selectedRowKeys?: string[]
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'view', record: User): void
  (e: 'quickView', record: User): void
  (e: 'update:selectedRowKeys', keys: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selectedRowKeys: () => [],
})

const emit = defineEmits<Emits>()

// Table columns configuration
const columns = computed(() => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 120,
    fixed: 'left',
    sortable: true,
  },
  {
    title: 'Nickname',
    dataIndex: 'nickname',
    key: 'nickname',
    width: 150,
    sortable: true,
  },
  {
    title: 'Email / Phone',
    key: 'contact',
    width: 200,
  },
  {
    title: 'KYC Status',
    dataIndex: 'kycStatus',
    key: 'kycStatus',
    width: 120,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'None', value: 'none' },
      { label: 'Pending', value: 'pending' },
      { label: 'Approved', value: 'approved' },
      { label: 'Rejected', value: 'rejected' },
    ],
  },
  {
    title: 'VIP Level',
    dataIndex: 'vipLevel',
    key: 'vipLevel',
    width: 100,
    sortable: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'VIP 0', value: 0 },
      { label: 'VIP 1', value: 1 },
      { label: 'VIP 2', value: 2 },
      { label: 'VIP 3', value: 3 },
      { label: 'VIP 4', value: 4 },
      { label: 'VIP 5', value: 5 },
    ],
  },
  {
    title: 'Risk Tags',
    dataIndex: 'riskTags',
    key: 'riskTags',
    width: 180,
  },
  {
    title: 'Asset Snapshot',
    key: 'assetSnapshot',
    width: 180,
    sortable: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Disabled', value: 'disabled' },
      { label: 'Suspended', value: 'suspended' },
    ],
  },
  {
    title: 'Last Login',
    dataIndex: 'lastLoginAt',
    key: 'lastLoginAt',
    width: 180,
    sortable: true,
    customRender: ({ text }: { text: string }) => formatDate(text),
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 180,
    fixed: 'right',
  },
])

// Row selection configuration
const rowSelection = computed(() => ({
  selectedRowKeys: props.selectedRowKeys,
  onChange: (selectedRowKeys: string[]) => {
    emit('update:selectedRowKeys', selectedRowKeys)
  },
}))

// Helper functions
function maskEmail(email: string): string {
  if (!email) return ''
  const [username, domain] = email.split('@')
  if (username.length <= 3) {
    return `${username[0]}***@${domain}`
  }
  return `${username.slice(0, 3)}***@${domain}`
}

function maskPhone(phone: string): string {
  if (!phone) return ''
  if (phone.length <= 7) {
    return `${phone.slice(0, 3)}****`
  }
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`
}

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

function getRemainingTags(tags: string[]): string {
  return tags.slice(2).join(', ')
}

// Event handlers
function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}

function handleView(record: User) {
  emit('view', record)
}

function handleQuickView(record: User) {
  emit('quickView', record)
}
</script>

<style scoped>
.text-muted {
  color: #999;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

.contact-info > div {
  display: flex;
  align-items: center;
  gap: 4px;
}

.asset-snapshot {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.total-usd {
  font-weight: 600;
  font-size: 14px;
}

.asset-detail {
  font-size: 12px;
  color: #666;
}

.asset-detail .available {
  color: #52c41a;
}

.asset-detail .frozen {
  color: #faad14;
}
</style>
