<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
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
        <a-button type="link" size="small" @click="handleView(record)">
          {{ record.name }}
        </a-button>
      </template>

      <!-- Status column -->
      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ getStatusText(record.status) }}
        </a-tag>
      </template>

      <!-- Subscribers column -->
      <template v-else-if="column.key === 'subscribers'">
        <span>{{ record.subscriberCount }}</span>
      </template>

      <!-- Criteria column -->
      <template v-else-if="column.key === 'criteria'">
        <div class="criteria-cell">
          {{ formatCriteria(record.criteria) }}
        </div>
      </template>

      <!-- Actions column -->
      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleView(record)">View</a-button>
          <a-button type="link" size="small" @click="handleEdit(record)">Edit</a-button>
          <a-popconfirm
            title="Are you sure you want to delete this segment?"
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
import type { EmailSegment } from '@/types/models'

interface Props {
  dataSource: EmailSegment[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'view', record: EmailSegment): void
  (e: 'edit', record: EmailSegment): void
  (e: 'delete', record: EmailSegment): void
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
    width: 200,
    fixed: 'left',
    sortable: true,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 250,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  {
    title: 'Subscribers',
    key: 'subscribers',
    width: 120,
    sortable: true,
  },
  {
    title: 'Criteria',
    key: 'criteria',
    width: 200,
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
    inactive: 'red',
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

function formatCriteria(criteria: Record<string, any>): string {
  const keys = Object.keys(criteria)
  if (keys.length === 0) return 'No criteria'

  // Format criteria for display
  return keys.map((key) => `${key}: ${criteria[key]}`).join(', ')
}

// Event handlers
function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}

function handleView(record: EmailSegment) {
  emit('view', record)
}

function handleEdit(record: EmailSegment) {
  emit('edit', record)
}

function handleDelete(record: EmailSegment) {
  emit('delete', record)
}
</script>

<style scoped>
.criteria-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
</style>
