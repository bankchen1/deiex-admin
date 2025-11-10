<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :enable-export="true"
    @change="handleTableChange"
    @export="handleExport"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'timestamp'">
        {{ formatDate(record.timestamp) }}
      </template>

      <template v-else-if="column.key === 'adminName'">
        {{ record.adminName }}
      </template>

      <template v-else-if="column.key === 'action'">
        <a-tag :color="getActionColor(record.action)">
          {{ record.action }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'objectType'">
        <a-tag>{{ record.objectType }}</a-tag>
      </template>

      <template v-else-if="column.key === 'objectId'">
        <a-typography-text copyable>{{ record.objectId }}</a-typography-text>
      </template>

      <template v-else-if="column.key === 'ip'">
        {{ record.ip }}
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-button type="link" size="small" @click="handleViewDetail(record)">
          View Details
        </a-button>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ServerTable from '@/shared/ServerTable.vue'
import { formatDate } from '@/utils/date'
import type { AuditLog } from '@/services/api/facade'
import type { TableColumn } from '@/types/components'

interface Props {
  dataSource: AuditLog[]
  loading?: boolean
  pagination?: any
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'viewDetail', record: AuditLog): void
  (e: 'export'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const columns = computed<TableColumn[]>(() => [
  {
    title: 'Timestamp',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: 180,
    sortable: true,
  },
  {
    title: 'Admin User',
    dataIndex: 'adminName',
    key: 'adminName',
    width: 150,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: 120,
  },
  {
    title: 'Object Type',
    dataIndex: 'objectType',
    key: 'objectType',
    width: 120,
  },
  {
    title: 'Object ID',
    dataIndex: 'objectId',
    key: 'objectId',
    width: 200,
  },
  {
    title: 'IP Address',
    dataIndex: 'ip',
    key: 'ip',
    width: 150,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    fixed: 'right',
  },
])

function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}

function handleViewDetail(record: AuditLog) {
  emit('viewDetail', record)
}

function handleExport() {
  emit('export')
}

function getActionColor(action: string): string {
  const colorMap: Record<string, string> = {
    create: 'green',
    update: 'blue',
    delete: 'red',
    approve: 'cyan',
    reject: 'orange',
    disable: 'red',
    enable: 'green',
  }
  return colorMap[action.toLowerCase()] || 'default'
}
</script>
