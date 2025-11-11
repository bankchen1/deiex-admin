<template>
  <div class="comments-page">
    <a-page-header title="Comment Management" sub-title="Manage article comments">
      <template #extra>
        <a-space>
          <a-button @click="handleRefresh">
            <template #icon>
              <ReloadOutlined />
            </template>
            Refresh
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- Filters -->
    <a-card class="filter-card">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item label="Article">
            <a-input
              v-model:value="filters.articleTitle"
              placeholder="Search by article title"
              @press-enter="handleSearch"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="Status">
            <a-select
              v-model:value="filters.status"
              placeholder="All Status"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All Status</a-select-option>
              <a-select-option value="pending">Pending</a-select-option>
              <a-select-option value="approved">Approved</a-select-option>
              <a-select-option value="rejected">Rejected</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="User">
            <a-input
              v-model:value="filters.userName"
              placeholder="Search by user name"
              @press-enter="handleSearch"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="Content">
            <a-input
              v-model:value="filters.content"
              placeholder="Search by content"
              @press-enter="handleSearch"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-space>
            <a-button type="primary" @click="handleSearch">Search</a-button>
            <a-button @click="handleResetFilters">Reset</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>

    <!-- Comments Table -->
    <a-card class="content-card">
      <CommentTable
        :data-source="comments"
        :loading="loading"
        :pagination="{
          current: currentPage,
          pageSize: pageSize,
          total: total,
        }"
        @change="handleTableChange"
        @view-article="handleViewArticle"
        @approve="handleApprove"
        @reject="handleReject"
        @delete="handleDelete"
      >
        <template #toolbar>
          <span class="table-info">Total: {{ total }} comments</span>
        </template>
      </CommentTable>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { ReloadOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons-vue'
import CommentTable from '@/tables/content/CommentTable.vue'
import type { Comment } from '@/contracts/content'

// Mock data for demonstration
const mockComments: Comment[] = [
  {
    id: '1',
    articleId: '1',
    articleTitle: 'Understanding Blockchain Technology',
    userId: '101',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    content: 'Great article! Very informative.',
    status: 'approved',
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0...',
    createdAt: '2023-06-15T10:30:00Z',
    updatedAt: '2023-06-15T10:30:00Z',
  },
  {
    id: '2',
    articleId: '1',
    articleTitle: 'Understanding Blockchain Technology',
    userId: '102',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    content: 'Could you explain more about smart contracts?',
    status: 'pending',
    ip: '192.168.1.102',
    userAgent: 'Mozilla/5.0...',
    createdAt: '2023-06-16T14:20:00Z',
    updatedAt: '2023-06-16T14:20:00Z',
  },
  {
    id: '3',
    articleId: '2',
    articleTitle: 'Market Analysis Q2 2023',
    userId: '103',
    userName: 'Bob Johnson',
    userEmail: 'bob@example.com',
    content: 'This analysis is too optimistic in my opinion.',
    status: 'rejected',
    ip: '192.168.1.103',
    userAgent: 'Mozilla/5.0...',
    createdAt: '2023-06-17T09:15:00Z',
    updatedAt: '2023-06-17T09:15:00Z',
  },
]

// State
const filters = ref({
  articleTitle: '',
  status: undefined as string | undefined,
  userName: '',
  content: '',
})

const comments = ref<Comment[]>(mockComments)
const loading = ref(false)
const total = ref(3)
const currentPage = ref(1)
const pageSize = ref(20)

// Lifecycle
onMounted(() => {
  fetchData()
})

// Methods
async function fetchData() {
  loading.value = true
  // In a real implementation, fetch data from API
  setTimeout(() => {
    loading.value = false
  }, 500)
}

function handleFilterChange() {
  // Auto-search on filter change (optional)
}

function handleSearch() {
  fetchData()
}

function handleResetFilters() {
  filters.value = {
    articleTitle: '',
    status: undefined,
    userName: '',
    content: '',
  }
  fetchData()
}

function handleRefresh() {
  fetchData()
}

function handleTableChange(pagination: any) {
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize
  fetchData()
}

function handleViewArticle(record: Comment) {
  // Navigate to article page
  console.log('View article:', record.articleId)
}

function handleApprove(record: Comment) {
  // In a real implementation, update via API
  const index = comments.value.findIndex((comment) => comment.id === record.id)
  if (index !== -1) {
    comments.value[index] = { ...record, status: 'approved' }
    message.success('Comment approved successfully')
  }
}

function handleReject(record: Comment) {
  // In a real implementation, update via API
  const index = comments.value.findIndex((comment) => comment.id === record.id)
  if (index !== -1) {
    comments.value[index] = { ...record, status: 'rejected' }
    message.success('Comment rejected successfully')
  }
}

function handleDelete(record: Comment) {
  // In a real implementation, delete from API
  comments.value = comments.value.filter((comment) => comment.id !== record.id)
  total.value -= 1
  message.success('Comment deleted successfully')
}
</script>

<style scoped>
.comments-page {
  padding: 24px;
}

.filter-card {
  margin-bottom: 16px;
}

.content-card {
  margin-top: 16px;
}

.table-info {
  color: #666;
  font-size: 14px;
}
</style>
