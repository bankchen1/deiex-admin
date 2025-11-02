<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    row-key="id"
    @change="handleTableChange"
  >
    <template #toolbar>
      <slot name="toolbar" />
    </template>

    <!-- Custom column renderers -->
    <template #bodyCell="{ column, record }">
      <!-- Name column -->
      <template v-if="column.key === 'name'">
        <a-button type="link" size="small" @click="handleView(record)">
          {{ record.name }}
        </a-button>
      </template>

      <!-- Template column -->
      <template v-else-if="column.key === 'template'">
        <span>{{ record.templateName }}</span>
      </template>

      <!-- Status column -->
      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ getStatusText(record.status) }}
        </a-tag>
      </template>

      <!-- Stats column -->
      <template v-else-if="column.key === 'stats'">
        <div class="campaign-stats">
          <div class="stat-item">
            <SendOutlined />
            {{ record.sentCount }}
          </div>
          <div class="stat-item">
            <EyeOutlined />
            {{ record.openCount }} ({{ calculateRate(record.openCount, record.sentCount) }}%)
          </div>
          <div class="stat-item">
            <LinkOutlined />
            {{ record.clickCount }} ({{ calculateRate(record.clickCount, record.sentCount) }}%)
          </div>
        </div>
      </template>

      <!-- Audience column -->
      <template v-else-if="column.key === 'audience'">
        <span>{{ record.audience?.length || 0 }} segments</span>
      </template>

      <!-- Schedule column -->
      <template v-else-if="column.key === 'schedule'">
        <div v-if="record.scheduleTime">
          <div>{{ formatDate(record.scheduleTime) }}</div>
          <a-tag v-if="isScheduled(record.scheduleTime)" color="orange" size="small">
            <ClockCircleOutlined />
            Scheduled
          </a-tag>
        </div>
        <span v-else>-</span>
      </template>

      <!-- Actions column -->
      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleView(record)">View</a-button>
          <a-button
            v-if="canEdit(record.status)"
            type="link"
            size="small"
            @click="handleEdit(record)"
          >
            Edit
          </a-button>
          <a-dropdown v-if="canPerformAction(record.status)">
            <a-button type="link" size="small">
              Actions
              <DownOutlined />
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item
                  v-if="record.status === 'draft' || record.status === 'scheduled'"
                  @click="handleStart(record)"
                >
                  Start
                </a-menu-item>
                <a-menu-item v-if="record.status === 'sending'" @click="handlePause(record)">
                  Pause
                </a-menu-item>
                <a-menu-item v-if="record.status === 'paused'" @click="handleResume(record)">
                  Resume
                </a-menu-item>
                <a-menu-item v-if="canCancel(record.status)" @click="handleCancel(record)">
                  Cancel
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  SendOutlined,
  EyeOutlined,
  LinkOutlined,
  ClockCircleOutlined,
  DownOutlined,
} from '@ant-design/icons-vue'
import ServerTable from '@/shared/ServerTable.vue'
import { formatDate } from '@/utils/date'
import type { EmailCampaign } from '@/types/models'

interface Props {
  dataSource: EmailCampaign[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'view', record: EmailCampaign): void
  (e: 'edit', record: EmailCampaign): void
  (e: 'start', record: EmailCampaign): void
  (e: 'pause', record: EmailCampaign): void
  (e: 'resume', record: EmailCampaign): void
  (e: 'cancel', record: EmailCampaign): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

// Table columns configuration
const columns = computed(() => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    fixed: 'left',
    sortable: true,
  },
  {
    title: 'Template',
    key: 'template',
    width: 150,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Draft', value: 'draft' },
      { label: 'Scheduled', value: 'scheduled' },
      { label: 'Sending', value: 'sending' },
      { label: 'Sent', value: 'sent' },
      { label: 'Paused', value: 'paused' },
      { label: 'Cancelled', value: 'cancelled' },
    ],
  },
  {
    title: 'Stats',
    key: 'stats',
    width: 200,
  },
  {
    title: 'Audience',
    key: 'audience',
    width: 120,
  },
  {
    title: 'Schedule',
    key: 'schedule',
    width: 180,
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
    sortable: true,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    fixed: 'right',
  },
])

// Helper functions
function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    draft: 'orange',
    scheduled: 'blue',
    sending: 'gold',
    sent: 'green',
    paused: 'red',
    cancelled: 'red',
  }
  return colorMap[status] || 'default'
}

function getStatusText(status: string): string {
  const textMap: Record<string, string> = {
    draft: 'Draft',
    scheduled: 'Scheduled',
    sending: 'Sending',
    sent: 'Sent',
    paused: 'Paused',
    cancelled: 'Cancelled',
  }
  return textMap[status] || status
}

function calculateRate(count: number, total: number): string {
  if (total === 0) return '0'
  return ((count / total) * 100).toFixed(1)
}

function isScheduled(scheduleTime: string): boolean {
  return new Date(scheduleTime).getTime() > Date.now()
}

function canEdit(status: string): boolean {
  return status === 'draft' || status === 'scheduled'
}

function canPerformAction(status: string): boolean {
  return ['draft', 'scheduled', 'sending', 'paused'].includes(status)
}

function canCancel(status: string): boolean {
  return ['draft', 'scheduled', 'sending', 'paused'].includes(status)
}

// Event handlers
function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}

function handleView(record: EmailCampaign) {
  emit('view', record)
}

function handleEdit(record: EmailCampaign) {
  emit('edit', record)
}

function handleStart(record: EmailCampaign) {
  emit('start', record)
}

function handlePause(record: EmailCampaign) {
  emit('pause', record)
}

function handleResume(record: EmailCampaign) {
  emit('resume', record)
}

function handleCancel(record: EmailCampaign) {
  emit('cancel', record)
}
</script>

<style scoped>
.campaign-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}
</style>
