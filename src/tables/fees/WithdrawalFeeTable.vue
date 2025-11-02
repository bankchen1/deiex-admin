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
    :row-selection="rowSelection"
    @fetch="handleFetch"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'currency'">
        <a-tag color="blue">{{ record.currency }}</a-tag>
      </template>

      <template v-else-if="column.key === 'chain'">
        <a-tag>{{ record.chain }}</a-tag>
      </template>

      <template v-else-if="column.key === 'fixedFee'">
        {{ record.fixedFee }} {{ record.currency }}
      </template>

      <template v-else-if="column.key === 'percentageFee'">
        {{ formatRate(record.percentageFee) }}
      </template>

      <template v-else-if="column.key === 'minFee'">
        {{ record.minFee }} {{ record.currency }}
      </template>

      <template v-else-if="column.key === 'dailyLimit'">
        {{ record.dailyLimit }} {{ record.currency }}
      </template>

      <template v-else-if="column.key === 'status'">
        <a-tag v-if="record.status === 'published'" color="success">Published</a-tag>
        <a-tag v-else color="warning">Draft</a-tag>
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <RBACGuard :permissions="['config.fees.view']">
            <a-button type="link" size="small" @click="emit('view', record)">View</a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.fees.edit']">
            <a-button type="link" size="small" @click="emit('edit', record)">Edit</a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.fees.delete']">
            <a-popconfirm
              title="Are you sure you want to delete this withdrawal fee?"
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
import ServerTable from '@/shared/ServerTable.vue'
import RBACGuard from '@/shared/RBACGuard.vue'
import type { WithdrawalFeeTemplate } from '@/types/models'
import type { TableParams } from '@/types/components'

interface Props {
  dataSource: WithdrawalFeeTemplate[]
  loading?: boolean
  total?: number
}

interface Emits {
  (e: 'fetch', params: TableParams): void
  (e: 'view', record: WithdrawalFeeTemplate): void
  (e: 'edit', record: WithdrawalFeeTemplate): void
  (e: 'delete', record: WithdrawalFeeTemplate): void
  (e: 'selection-change', keys: string[], rows: WithdrawalFeeTemplate[]): void
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

const columns = [
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
    width: 100,
    sortable: true,
  },
  {
    title: 'Chain',
    dataIndex: 'chain',
    key: 'chain',
    width: 120,
    sortable: true,
  },
  {
    title: 'Fixed Fee',
    dataIndex: 'fixedFee',
    key: 'fixedFee',
    width: 150,
  },
  {
    title: 'Percentage Fee',
    dataIndex: 'percentageFee',
    key: 'percentageFee',
    width: 150,
  },
  {
    title: 'Min Fee',
    dataIndex: 'minFee',
    key: 'minFee',
    width: 150,
  },
  {
    title: 'Daily Limit',
    dataIndex: 'dailyLimit',
    key: 'dailyLimit',
    width: 150,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 180,
    sortable: true,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    fixed: 'right',
  },
]

const rowSelection = {
  onChange: (selectedRowKeys: string[], selectedRows: WithdrawalFeeTemplate[]) => {
    emit('selection-change', selectedRowKeys, selectedRows)
  },
}

function handleFetch(params: TableParams) {
  pagination.value.page = params.page
  pagination.value.pageSize = params.pageSize
  emit('fetch', params)
}

function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(4)}%`
}
</script>
