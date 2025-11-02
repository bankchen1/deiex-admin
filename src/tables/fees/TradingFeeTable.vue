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
      <template v-if="column.key === 'vipLevel'">
        <a-tag color="blue">VIP {{ record.vipLevel }}</a-tag>
      </template>

      <template v-else-if="column.key === 'makerRate'">
        {{ formatRate(record.makerRate) }}
      </template>

      <template v-else-if="column.key === 'takerRate'">
        {{ formatRate(record.takerRate) }}
      </template>

      <template v-else-if="column.key === 'inheritFromPrevious'">
        <a-tag v-if="record.inheritFromPrevious" color="green">Yes</a-tag>
        <a-tag v-else color="default">No</a-tag>
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
              title="Are you sure you want to delete this fee tier?"
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
import type { TradingFeeTemplate } from '@/types/models'
import type { TableParams } from '@/types/components'

interface Props {
  dataSource: TradingFeeTemplate[]
  loading?: boolean
  total?: number
}

interface Emits {
  (e: 'fetch', params: TableParams): void
  (e: 'view', record: TradingFeeTemplate): void
  (e: 'edit', record: TradingFeeTemplate): void
  (e: 'delete', record: TradingFeeTemplate): void
  (e: 'selection-change', keys: string[], rows: TradingFeeTemplate[]): void
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
    title: 'VIP Level',
    dataIndex: 'vipLevel',
    key: 'vipLevel',
    width: 120,
    sortable: true,
  },
  {
    title: 'Maker Rate',
    dataIndex: 'makerRate',
    key: 'makerRate',
    width: 150,
    sortable: true,
  },
  {
    title: 'Taker Rate',
    dataIndex: 'takerRate',
    key: 'takerRate',
    width: 150,
    sortable: true,
  },
  {
    title: 'Inherit',
    dataIndex: 'inheritFromPrevious',
    key: 'inheritFromPrevious',
    width: 100,
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
  onChange: (selectedRowKeys: string[], selectedRows: TradingFeeTemplate[]) => {
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
