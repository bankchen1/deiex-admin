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

      <!-- Subject column -->
      <template v-else-if="column.key === 'subject'">
        <div class="subject-cell">
          {{ getLocalizedText(record.subject) }}
        </div>
      </template>

      <!-- Status column -->
      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ getStatusText(record.status) }}
        </a-tag>
      </template>

      <!-- Variables column -->
      <template v-else-if="column.key === 'variables'">
        <a-space wrap>
          <a-tag
            v-for="variable in record.variables?.slice(0, 3)"
            :key="variable"
            color="blue"
            size="small"
          >
            {{ variable }}
          </a-tag>
          <a-tag
            v-if="record.variables && record.variables.length > 3"
            color="default"
            size="small"
          >
            +{{ record.variables.length - 3 }}
          </a-tag>
        </a-space>
      </template>

      <!-- Actions column -->
      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleView(record)">View</a-button>
          <a-button type="link" size="small" @click="handleEdit(record)">Edit</a-button>
          <a-popconfirm
            title="Are you sure you want to delete this template?"
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
import type { EmailTemplate } from '@/types/models'

interface Props {
  dataSource: EmailTemplate[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'view', record: EmailTemplate): void
  (e: 'edit', record: EmailTemplate): void
  (e: 'delete', record: EmailTemplate): void
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
    title: 'Subject',
    key: 'subject',
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
      { label: 'Draft', value: 'draft' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  {
    title: 'Variables',
    key: 'variables',
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
    draft: 'orange',
    active: 'green',
    inactive: 'red',
  }
  return colorMap[status] || 'default'
}

function getStatusText(status: string): string {
  const textMap: Record<string, string> = {
    draft: 'Draft',
    active: 'Active',
    inactive: 'Inactive',
  }
  return textMap[status] || status
}

function getLocalizedText(textObj: Record<string, string> | undefined): string {
  if (!textObj) return ''

  // Try to get text in current locale first
  const currentLocale = localStorage.getItem('locale') || 'en'
  if (textObj[currentLocale]) {
    return textObj[currentLocale]
  }

  // Fallback to English
  if (textObj.en) {
    return textObj.en
  }

  // Fallback to first available language
  const keys = Object.keys(textObj)
  if (keys.length > 0) {
    return textObj[keys[0]]
  }

  return ''
}

// Event handlers
function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}

function handleView(record: EmailTemplate) {
  emit('view', record)
}

function handleEdit(record: EmailTemplate) {
  emit('edit', record)
}

function handleDelete(record: EmailTemplate) {
  emit('delete', record)
}
</script>

<style scoped>
.subject-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}
</style>
