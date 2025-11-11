<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="{
      current: pagination.page,
      pageSize: pagination.pageSize,
      total: total,
    }"
    :row-selection="{
      selectedRowKeys: selectedKeys,
      onChange: handleSelectionChange,
    }"
    :enable-export="true"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'title'">
        <a-typography-text strong>{{ record.title }}</a-typography-text>
      </template>

      <template v-else-if="column.key === 'timeWindow'">
        <a-space direction="vertical" :size="0">
          <span>{{ formatDateTime(record.startTime) }}</span>
          <a-typography-text type="secondary" style="font-size: 12px">
            to {{ formatDateTime(record.endTime) }}
          </a-typography-text>
          <a-tag v-if="isUpcoming(record.startTime)" color="orange" size="small">
            <ClockCircleOutlined />
            {{ getTimeUntil(record.startTime) }}
          </a-tag>
          <a-tag v-else-if="isOngoing(record.startTime, record.endTime)" color="red" size="small">
            <WarningOutlined />
            In Progress
          </a-tag>
        </a-space>
      </template>

      <template v-else-if="column.key === 'scope'">
        <a-space direction="vertical" :size="0">
          <a-tag v-for="item in record.affectedScope" :key="item" size="small">
            {{ item }}
          </a-tag>
        </a-space>
      </template>

      <template v-else-if="column.key === 'announcementPush'">
        <a-tag :color="record.announcementPush ? 'success' : 'default'">
          {{ record.announcementPush ? 'Enabled' : 'Disabled' }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record)">
          {{ getStatus(record) }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <RBACGuard :permissions="['config.calendar.view']">
            <a-button type="link" size="small" @click="emit('view', record)">View</a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.calendar.edit']">
            <a-button type="link" size="small" @click="emit('edit', record)">Edit</a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.calendar.delete']">
            <a-popconfirm
              title="Are you sure you want to delete this maintenance window?"
              ok-text="Delete"
              cancel-text="Cancel"
              @confirm="emit('delete', record)"
            >
              <a-button type="link" size="small" danger>Delete</a-button>
            </a-popconfirm>
          </RBACGuard>
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ClockCircleOutlined, WarningOutlined } from '@ant-design/icons-vue'
import ServerTable from '@/shared/ServerTable.vue'
import RBACGuard from '@/shared/RBACGuard.vue'
import { formatDateTime } from '@/utils/date'
import type { MaintenanceWindow } from '@/contracts/calendar'
import type { TableParams } from '@/types/components'

interface Props {
  dataSource: MaintenanceWindow[]
  loading?: boolean
  total?: number
}

interface Emits {
  (e: 'edit', record: MaintenanceWindow): void
  (e: 'delete', record: MaintenanceWindow): void
  (e: 'view', record: MaintenanceWindow): void
  (e: 'fetch', params: TableParams): void
  (e: 'selection-change', keys: string[], rows: MaintenanceWindow[]): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  total: 0,
})

const emit = defineEmits<Emits>()

const pagination = ref({
  page: 1,
  pageSize: 20,
})

const selectedKeys = ref<string[]>([])

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: 200,
    sortable: true,
  },
  {
    title: 'Time Window',
    dataIndex: 'timeWindow',
    key: 'timeWindow',
    width: 250,
    sortable: true,
  },
  {
    title: 'Affected Scope',
    dataIndex: 'scope',
    key: 'scope',
    width: 200,
  },
  {
    title: 'Announcement Push',
    dataIndex: 'announcementPush',
    key: 'announcementPush',
    width: 150,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    fixed: 'right',
  },
]

function handleTableChange(pag: any, filters: any, sorter: any) {
  pagination.value = {
    page: pag.current,
    pageSize: pag.pageSize,
  }

  emit('fetch', {
    page: pag.current,
    pageSize: pag.pageSize,
    sortField: sorter.field,
    sortOrder: sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : undefined,
    filters,
  })
}

function handleSelectionChange(keys: string[], rows: MaintenanceWindow[]) {
  selectedKeys.value = keys
  emit('selection-change', keys, rows)
}

function isUpcoming(startTime: string): boolean {
  return new Date(startTime).getTime() > Date.now()
}

function isOngoing(startTime: string, endTime: string): boolean {
  const now = Date.now()
  return new Date(startTime).getTime() <= now && new Date(endTime).getTime() >= now
}

function getTimeUntil(timestamp: string): string {
  const now = Date.now()
  const target = new Date(timestamp).getTime()
  const diff = target - now

  if (diff <= 0) return 'Starting soon'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `in ${days}d ${hours % 24}h`
  }

  return `in ${hours}h ${minutes}m`
}

function getStatus(record: MaintenanceWindow): string {
  if (isOngoing(record.startTime, record.endTime)) return 'In Progress'
  if (isUpcoming(record.startTime)) return 'Scheduled'
  return 'Completed'
}

function getStatusColor(record: MaintenanceWindow): string {
  if (isOngoing(record.startTime, record.endTime)) return 'red'
  if (isUpcoming(record.startTime)) return 'orange'
  return 'default'
}
</script>
