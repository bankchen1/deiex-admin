<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    enable-column-config
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
        <span>{{ record.name.en }}</span>
      </template>

      <!-- Status column -->
      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ getStatusText(record.status) }}
        </a-tag>
      </template>

      <!-- Actions column -->
      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleView(record)">View</a-button>
          <a-button type="link" size="small" @click="handleEdit(record)">Edit</a-button>
          <a-popconfirm
            title="Are you sure you want to delete this category?"
            @confirm="handleDelete(record)"
          >
            <a-button type="link" size="small" danger>Delete</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ServerTable from '@/shared/ServerTable.vue'
import type { Category } from '@/types/models'

interface Props {
  dataSource: Category[]
  loading?: boolean
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'view', record: Category): void
  (e: 'edit', record: Category): void
  (e: 'delete', record: Category): void
  (e: 'sort', sortedData: Category[]): void
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
    width: 150,
    fixed: 'left',
  },
  {
    title: 'Slug',
    dataIndex: 'slug',
    key: 'slug',
    width: 120,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 200,
  },
  {
    title: 'Sort Order',
    dataIndex: 'sortOrder',
    key: 'sortOrder',
    width: 100,
    sortable: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
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
    active: 'green',
    inactive: 'orange',
  }
  return colorMap[status] || 'default'
}

function getStatusText(status: string): string {
  const textMap: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
  }
  return textMap[status] || status
}

// Event handlers
function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}

function handleView(record: Category) {
  emit('view', record)
}

function handleEdit(record: Category) {
  emit('edit', record)
}

function handleDelete(record: Category) {
  emit('delete', record)
}
</script>

<style scoped>
/* Add any specific styles if needed */
</style>
