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
      <template v-if="column.key === 'symbol'">
        <a-tag color="blue">{{ record.symbol }}</a-tag>
      </template>

      <template v-else-if="column.key === 'nextFundingTime'">
        <a-space direction="vertical" :size="0">
          <span>{{ formatDateTime(record.nextFundingTime) }}</span>
          <a-typography-text type="secondary" style="font-size: 12px">
            <ClockCircleOutlined />
            {{ getTimeRemaining(record.nextFundingTime) }}
          </a-typography-text>
        </a-space>
      </template>

      <template v-else-if="column.key === 'period'">
        <span>{{ record.period }}h</span>
      </template>

      <template v-else-if="column.key === 'calculationRule'">
        <a-tooltip :title="record.calculationRule">
          <a-typography-text ellipsis style="max-width: 200px">
            {{ record.calculationRule }}
          </a-typography-text>
        </a-tooltip>
      </template>

      <template v-else-if="column.key === 'enabled'">
        <a-tag :color="record.enabled ? 'success' : 'default'">
          {{ record.enabled ? 'Enabled' : 'Disabled' }}
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
              title="Are you sure you want to delete this funding rule?"
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
import { ref, computed } from 'vue'
import { ClockCircleOutlined } from '@ant-design/icons-vue'
import ServerTable from '@/shared/ServerTable.vue'
import RBACGuard from '@/shared/RBACGuard.vue'
import { formatDateTime } from '@/utils/date'
import type { FundingRule } from '@/types/models'
import type { TableParams } from '@/types/components'

interface Props {
  dataSource: FundingRule[]
  loading?: boolean
  total?: number
}

interface Emits {
  (e: 'edit', record: FundingRule): void
  (e: 'delete', record: FundingRule): void
  (e: 'view', record: FundingRule): void
  (e: 'fetch', params: TableParams): void
  (e: 'selection-change', keys: string[], rows: FundingRule[]): void
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
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    width: 120,
    sortable: true,
  },
  {
    title: 'Next Funding Time',
    dataIndex: 'nextFundingTime',
    key: 'nextFundingTime',
    width: 200,
    sortable: true,
  },
  {
    title: 'Period',
    dataIndex: 'period',
    key: 'period',
    width: 100,
  },
  {
    title: 'Calculation Rule',
    dataIndex: 'calculationRule',
    key: 'calculationRule',
    width: 250,
  },
  {
    title: 'Status',
    dataIndex: 'enabled',
    key: 'enabled',
    width: 100,
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

function handleSelectionChange(keys: string[], rows: FundingRule[]) {
  selectedKeys.value = keys
  emit('selection-change', keys, rows)
}

function getTimeRemaining(timestamp: string): string {
  const now = new Date().getTime()
  const target = new Date(timestamp).getTime()
  const diff = target - now

  if (diff <= 0) return 'Overdue'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `in ${days}d ${hours % 24}h`
  }

  return `in ${hours}h ${minutes}m`
}
</script>
