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
      <template v-if="column.key === 'name'">
        <div>
          <div class="task-name">{{ record.name }}</div>
          <a-typography-text type="secondary" style="font-size: 12px">
            {{ record.type }}
          </a-typography-text>
        </div>
      </template>

      <template v-else-if="column.key === 'schedule'">
        <a-typography-text code>{{ record.schedule }}</a-typography-text>
      </template>

      <template v-else-if="column.key === 'status'">
        <a-tag :color="record.status === 'enabled' ? 'green' : 'default'">
          {{ record.status.toUpperCase() }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'lastRun'">
        <div v-if="record.lastRunAt">
          <div>{{ formatDateTime(record.lastRunAt) }}</div>
          <a-tag
            v-if="record.lastRunStatus"
            :color="record.lastRunStatus === 'success' ? 'green' : 'red'"
            style="margin-top: 4px"
          >
            {{ record.lastRunStatus }}
          </a-tag>
          <a-typography-text v-if="record.lastRunDuration" type="secondary" style="font-size: 12px">
            {{ record.lastRunDuration }}ms
          </a-typography-text>
        </div>
        <span v-else>-</span>
      </template>

      <template v-else-if="column.key === 'nextRun'">
        <div v-if="record.nextRunAt">
          {{ formatDateTime(record.nextRunAt) }}
        </div>
        <span v-else>-</span>
      </template>

      <template v-else-if="column.key === 'retries'">
        {{ record.retryCount }} / {{ record.maxRetries }}
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <RBACGuard permissions="ops.tasks.run">
            <a-button
              type="link"
              size="small"
              :disabled="record.status === 'disabled'"
              @click="emit('run', record)"
            >
              Run Now
            </a-button>
          </RBACGuard>

          <RBACGuard permissions="ops.tasks.manage">
            <a-button
              v-if="record.status === 'disabled'"
              type="link"
              size="small"
              @click="emit('enable', record)"
            >
              Enable
            </a-button>
            <a-button v-else type="link" size="small" @click="emit('disable', record)">
              Disable
            </a-button>
          </RBACGuard>

          <RBACGuard permissions="ops.tasks.edit">
            <a-button type="link" size="small" @click="emit('edit', record)"> Edit </a-button>
          </RBACGuard>

          <RBACGuard permissions="ops.tasks.delete">
            <a-button type="link" size="small" danger @click="emit('delete', record)">
              Delete
            </a-button>
          </RBACGuard>
        </a-space>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import type { ScheduledTask } from '@/services/api/facade'
import { formatDateTime } from '@/utils/date'
import RBACGuard from '@/shared/RBACGuard.vue'

interface Props {
  dataSource: ScheduledTask[]
  loading?: boolean
  total: number
  pagination: any
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'run', task: ScheduledTask): void
  (e: 'enable', task: ScheduledTask): void
  (e: 'disable', task: ScheduledTask): void
  (e: 'edit', task: ScheduledTask): void
  (e: 'delete', task: ScheduledTask): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const columns = [
  {
    title: 'Task Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: 'Schedule',
    dataIndex: 'schedule',
    key: 'schedule',
    width: 150,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: 'Last Run',
    dataIndex: 'lastRunAt',
    key: 'lastRun',
    width: 200,
  },
  {
    title: 'Next Run',
    dataIndex: 'nextRunAt',
    key: 'nextRun',
    width: 180,
  },
  {
    title: 'Retries',
    dataIndex: 'retryCount',
    key: 'retries',
    width: 100,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 300,
    fixed: 'right' as const,
  },
]

function handleChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}
</script>

<style scoped>
.task-name {
  font-weight: 500;
}
</style>
