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
      <template v-if="column.key === 'name'">
        <a @click="handleView(record)">{{ record.name }}</a>
      </template>

      <template v-else-if="column.key === 'tiers'">
        <a-tag color="blue">{{ record.tiers?.length || 0 }} tiers</a-tag>
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
            <a-button type="link" size="small" @click="handleEdit(record)"> Edit </a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.margin.delete']">
            <a-popconfirm
              title="Are you sure you want to delete this template?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="handleDelete(record)"
            >
              <a-button type="link" danger size="small"> Delete </a-button>
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
import type { MarginTemplate } from '@/types/models'
import type { TableParams } from '@/types/components'
import { formatDate } from '@/utils/date'

interface Props {
  dataSource: MarginTemplate[]
  loading?: boolean
  total?: number
}

interface Emits {
  (e: 'edit', record: MarginTemplate): void
  (e: 'delete', record: MarginTemplate): void
  (e: 'view', record: MarginTemplate): void
  (e: 'fetch', params: TableParams): void
  (e: 'selection-change', selectedRowKeys: string[], selectedRows: MarginTemplate[]): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  total: 0,
})

const emit = defineEmits<Emits>()

const selectedRowKeys = ref<string[]>([])

const columns = [
  {
    title: 'Template Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    sortable: true,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 250,
    ellipsis: true,
  },
  {
    title: 'Tiers',
    key: 'tiers',
    width: 100,
    align: 'center' as const,
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
    width: 150,
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
  onChange: (keys: string[], rows: MarginTemplate[]) => {
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

function handleEdit(record: MarginTemplate) {
  emit('edit', record)
}

function handleDelete(record: MarginTemplate) {
  emit('delete', record)
}

function handleView(record: MarginTemplate) {
  emit('view', record)
}
</script>
