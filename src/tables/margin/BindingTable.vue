<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :row-selection="rowSelection"
    :fetch-data="fetchData"
    :enable-export="true"
    :enable-column-config="true"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'symbol'">
        <a-tag color="blue">{{ record.symbol }}</a-tag>
      </template>

      <template v-else-if="column.key === 'templateName'">
        {{ record.templateName }}
      </template>

      <template v-else-if="column.key === 'status'">
        <a-tag :color="record.status === 'published' ? 'green' : 'orange'">
          {{ record.status }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'updatedAt'">
        {{ formatDate(record.updatedAt) }}
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <RBACGuard :permissions="['config.margin.edit']">
            <a-button type="link" size="small" @click="handleEdit(record)">
              Change Template
            </a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.margin.delete']">
            <a-popconfirm
              title="Are you sure you want to unbind this symbol?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="handleUnbind(record)"
            >
              <a-button type="link" danger size="small"> Unbind </a-button>
            </a-popconfirm>
          </RBACGuard>
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ServerTable from '@/shared/ServerTable.vue'
import RBACGuard from '@/shared/RBACGuard.vue'
import type { MarginBinding } from '@/types/models'
import type { TableParams } from '@/types/components'
import { formatDate } from '@/utils/date'

interface Props {
  dataSource: MarginBinding[]
  loading?: boolean
  total?: number
}

interface Emits {
  (e: 'edit', record: MarginBinding): void
  (e: 'unbind', record: MarginBinding): void
  (e: 'fetch', params: TableParams): void
  (e: 'selection-change', selectedRowKeys: string[], selectedRows: MarginBinding[]): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  total: 0,
})

const emit = defineEmits<Emits>()

const selectedRowKeys = ref<string[]>([])

const columns = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    width: 150,
    sortable: true,
    filterable: true,
    filterType: 'input' as const,
  },
  {
    title: 'Template Name',
    dataIndex: 'templateName',
    key: 'templateName',
    width: 200,
    sortable: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    filterable: true,
    filterType: 'select' as const,
    filterOptions: [
      { label: 'Published', value: 'published' },
      { label: 'Draft', value: 'draft' },
    ],
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
    fixed: 'right' as const,
  },
]

const pagination = computed(() => ({
  total: props.total,
  pageSize: 20,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `Total ${total} items`,
}))

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: string[], rows: MarginBinding[]) => {
    selectedRowKeys.value = keys
    emit('selection-change', keys, rows)
  },
}))

function fetchData(params: TableParams) {
  emit('fetch', params)
}

function handleTableChange() {
  // Table change handled by ServerTable
}

function handleEdit(record: MarginBinding) {
  emit('edit', record)
}

function handleUnbind(record: MarginBinding) {
  emit('unbind', record)
}
</script>
