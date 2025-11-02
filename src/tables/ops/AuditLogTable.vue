<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :scroll="{ x: 1400 }"
    row-key="id"
    @change="handleChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'timestamp'">
        {{ formatDateTime(record.timestamp) }}
      </template>

      <template v-else-if="column.key === 'adminName'">
        <div>
          <div>{{ record.adminName }}</div>
          <a-typography-text type="secondary" style="font-size: 12px">
            {{ record.adminId }}
          </a-typography-text>
        </div>
      </template>

      <template v-else-if="column.key === 'action'">
        <a-tag color="blue">{{ record.action }}</a-tag>
      </template>

      <template v-else-if="column.key === 'object'">
        <div>
          <div>{{ record.objectType }}</div>
          <a-typography-text
            :copyable="{ text: record.objectId }"
            type="secondary"
            style="font-size: 12px"
          >
            {{ record.objectId }}
          </a-typography-text>
        </div>
      </template>

      <template v-else-if="column.key === 'ip'">
        <a-typography-text :copyable="{ text: record.ip }">
          {{ record.ip }}
        </a-typography-text>
      </template>

      <template v-else-if="column.key === 'requestId'">
        <a-typography-text
          v-if="record.requestId"
          :copyable="{ text: record.requestId }"
          class="request-id"
        >
          {{ record.requestId.substring(0, 8) }}...
        </a-typography-text>
        <span v-else>-</span>
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-button type="link" size="small" @click="emit('viewDetail', record.id)">
          View Detail
        </a-button>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import type { AuditLog } from '@/services/api/ops'
import { formatDateTime } from '@/utils/date'

interface Props {
  dataSource: AuditLog[]
  loading?: boolean
  total: number
  pagination: any
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'viewDetail', id: string): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const columns = [
  {
    title: 'Timestamp',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: 180,
    sorter: true,
  },
  {
    title: 'Admin User',
    dataIndex: 'adminName',
    key: 'adminName',
    width: 180,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: 150,
  },
  {
    title: 'Object',
    dataIndex: 'objectType',
    key: 'object',
    width: 200,
  },
  {
    title: 'IP Address',
    dataIndex: 'ip',
    key: 'ip',
    width: 150,
  },
  {
    title: 'Request ID',
    dataIndex: 'requestId',
    key: 'requestId',
    width: 150,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    fixed: 'right' as const,
  },
]

function handleChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}
</script>

<style scoped>
.request-id {
  font-family: monospace;
  font-size: 12px;
}
</style>
