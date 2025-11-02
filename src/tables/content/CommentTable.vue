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
      <!-- Article Title column -->
      <template v-if="column.key === 'articleTitle'">
        <a-button type="link" size="small" @click="handleViewArticle(record)">
          {{ record.articleTitle }}
        </a-button>
      </template>

      <!-- User column -->
      <template v-else-if="column.key === 'user'">
        <div class="user-info">
          <div>{{ record.userName }}</div>
          <div class="user-email">{{ record.userEmail }}</div>
        </div>
      </template>

      <!-- Content column -->
      <template v-else-if="column.key === 'content'">
        <div class="comment-content">
          {{ record.content }}
        </div>
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
          <a-button
            v-if="record.status === 'pending'"
            type="link"
            size="small"
            @click="handleApprove(record)"
          >
            Approve
          </a-button>
          <a-button
            v-if="record.status === 'pending'"
            type="link"
            size="small"
            @click="handleReject(record)"
          >
            Reject
          </a-button>
          <a-popconfirm
            title="Are you sure you want to delete this comment?"
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
import type { Comment } from '@/types/models'

interface Props {
  dataSource: Comment[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'viewArticle', record: Comment): void
  (e: 'approve', record: Comment): void
  (e: 'reject', record: Comment): void
  (e: 'delete', record: Comment): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

// Table columns configuration
const columns = computed(() => [
  {
    title: 'Article',
    key: 'articleTitle',
    width: 200,
    fixed: 'left',
  },
  {
    title: 'User',
    key: 'user',
    width: 150,
  },
  {
    title: 'Content',
    key: 'content',
    width: 300,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Pending', value: 'pending' },
      { label: 'Approved', value: 'approved' },
      { label: 'Rejected', value: 'rejected' },
    ],
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    key: 'ip',
    width: 120,
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
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
  }
  return colorMap[status] || 'default'
}

function getStatusText(status: string): string {
  const textMap: Record<string, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  }
  return textMap[status] || status
}

// Event handlers
function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}

function handleViewArticle(record: Comment) {
  emit('viewArticle', record)
}

function handleApprove(record: Comment) {
  emit('approve', record)
}

function handleReject(record: Comment) {
  emit('reject', record)
}

function handleDelete(record: Comment) {
  emit('delete', record)
}
</script>

<style scoped>
.user-info {
  display: flex;
  flex-direction: column;
}

.user-email {
  font-size: 12px;
  color: #999;
}

.comment-content {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
