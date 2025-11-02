<template>
  <div class="market-news-page">
    <a-page-header title="Market News" sub-title="Manage market news and announcements">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon><PlusOutlined /></template>
            Add News
          </a-button>
          <a-button @click="handleRefresh">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
          <a-button @click="handleExport">
            <template #icon><DownloadOutlined /></template>
            Export
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- Filters -->
    <a-card :bordered="false" style="margin-bottom: 16px">
      <a-form layout="inline">
        <a-form-item label="Status">
          <a-select
            v-model:value="filters.status"
            placeholder="All Status"
            style="width: 120px"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="published">Published</a-select-option>
            <a-select-option value="draft">Draft</a-select-option>
            <a-select-option value="scheduled">Scheduled</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Category">
          <a-select
            v-model:value="filters.category"
            placeholder="All Categories"
            style="width: 150px"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="market">Market</a-select-option>
            <a-select-option value="company">Company</a-select-option>
            <a-select-option value="regulation">Regulation</a-select-option>
            <a-select-option value="technology">Technology</a-select-option>
            <a-select-option value="analysis">Analysis</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Source">
          <a-select
            v-model:value="filters.source"
            placeholder="All Sources"
            style="width: 150px"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="internal">Internal</a-select-option>
            <a-select-option value="external">External</a-select-option>
            <a-select-option value="press_release">Press Release</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input-search
            v-model:value="filters.search"
            placeholder="Search news..."
            style="width: 200px"
            @press-enter="handleSearch"
          />
        </a-form-item>
      </a-form>
    </a-card>

    <!-- News Table -->
    <a-card :bordered="false">
      <a-table
        :data-source="newsList"
        :columns="columns"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} news items`,
        }"
        :loading="loading"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <div class="news-title">
              <div class="title">{{ record.title }}</div>
              <div class="summary">{{ record.summary }}</div>
            </div>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
          </template>

          <template v-else-if="column.key === 'category'">
            <a-tag :color="getCategoryColor(record.category)">{{ record.category }}</a-tag>
          </template>

          <template v-else-if="column.key === 'source'">
            <a-tag :color="getSourceColor(record.source)">{{ record.source }}</a-tag>
          </template>

          <template v-else-if="column.key === 'author'">
            <span>{{ record.author }}</span>
          </template>

          <template v-else-if="column.key === 'publishedAt'">
            <span>{{ formatDate(record.publishedAt) }}</span>
          </template>

          <template v-else-if="column.key === 'views'">
            <span>{{ record.views }}</span>
          </template>

          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">View</a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">Edit</a-button>
              <a-popconfirm
                v-if="record.status !== 'published'"
                title="Are you sure you want to publish this news?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="handlePublish(record)"
              >
                <a-button type="link" size="small">Publish</a-button>
              </a-popconfirm>
              <a-popconfirm
                title="Are you sure you want to delete this news?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="handleDelete(record)"
              >
                <a-button type="link" size="small" danger>Delete</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- News Detail Drawer -->
    <a-drawer
      v-model:open="detailDrawerOpen"
      title="News Details"
      width="800"
      @close="handleCloseDetail"
    >
      <a-descriptions v-if="selectedNews" :column="1" bordered>
        <a-descriptions-item label="Title">
          {{ selectedNews.title }}
        </a-descriptions-item>
        <a-descriptions-item label="Summary">
          {{ selectedNews.summary }}
        </a-descriptions-item>
        <a-descriptions-item label="Status">
          <a-tag :color="getStatusColor(selectedNews.status)">{{ selectedNews.status }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Category">
          <a-tag :color="getCategoryColor(selectedNews.category)">{{
            selectedNews.category
          }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Source">
          <a-tag :color="getSourceColor(selectedNews.source)">{{ selectedNews.source }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Author">
          {{ selectedNews.author }}
        </a-descriptions-item>
        <a-descriptions-item label="Published At">
          {{ formatDate(selectedNews.publishedAt) }}
        </a-descriptions-item>
        <a-descriptions-item label="Views">
          {{ selectedNews.views }}
        </a-descriptions-item>
        <a-descriptions-item label="Tags">
          <a-tag v-for="(tag, index) in selectedNews.tags" :key="index" color="blue">
            {{ tag }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Content">
          <div class="news-content" v-html="selectedNews.content"></div>
        </a-descriptions-item>
      </a-descriptions>
    </a-drawer>

    <!-- Edit News Modal -->
    <a-modal
      v-model:open="editModalOpen"
      :title="editMode === 'create' ? 'Add New News' : 'Edit News'"
      :width="900"
      @ok="handleSave"
      @cancel="handleCancel"
    >
      <a-form :model="formState" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="16">
            <a-form-item label="Title" name="title">
              <a-input v-model:value="formState.title" placeholder="News title" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Status" name="status">
              <a-select v-model:value="formState.status">
                <a-select-option value="draft">Draft</a-select-option>
                <a-select-option value="scheduled">Scheduled</a-select-option>
                <a-select-option value="published">Published</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Summary" name="summary">
          <a-textarea v-model:value="formState.summary" placeholder="News summary" :rows="2" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="Category" name="category">
              <a-select v-model:value="formState.category" placeholder="Select category">
                <a-select-option value="market">Market</a-select-option>
                <a-select-option value="company">Company</a-select-option>
                <a-select-option value="regulation">Regulation</a-select-option>
                <a-select-option value="technology">Technology</a-select-option>
                <a-select-option value="analysis">Analysis</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Source" name="source">
              <a-select v-model:value="formState.source" placeholder="Select source">
                <a-select-option value="internal">Internal</a-select-option>
                <a-select-option value="external">External</a-select-option>
                <a-select-option value="press_release">Press Release</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Author" name="author">
              <a-input v-model:value="formState.author" placeholder="Author name" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Tags" name="tags">
          <a-select
            v-model:value="formState.tags"
            mode="tags"
            placeholder="Add tags"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="Published At" name="publishedAt">
          <a-date-picker
            v-model:value="formState.publishedAt"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="Content" name="content">
          <a-textarea v-model:value="formState.content" placeholder="News content" :rows="8" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { PlusOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'

// Types
interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  status: 'draft' | 'scheduled' | 'published'
  category: 'market' | 'company' | 'regulation' | 'technology' | 'analysis'
  source: 'internal' | 'external' | 'press_release'
  author: string
  publishedAt: string
  createdAt: string
  updatedAt: string
  views: number
  tags: string[]
}

// State
const loading = ref(false)
const detailDrawerOpen = ref(false)
const editModalOpen = ref(false)
const editMode = ref<'create' | 'edit'>('create')
const selectedNews = ref<NewsItem | null>(null)

// Forms
const formState = reactive({
  title: '',
  summary: '',
  content: '',
  status: 'draft' as 'draft' | 'scheduled' | 'published',
  category: 'market' as 'market' | 'company' | 'regulation' | 'technology' | 'analysis',
  source: 'internal' as 'internal' | 'external' | 'press_release',
  author: '',
  publishedAt: null as Dayjs | null,
  tags: [] as string[],
})

// Filters
const filters = reactive({
  status: undefined as string | undefined,
  category: undefined as string | undefined,
  source: undefined as string | undefined,
  search: '',
})

// Pagination
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
})

// Mock data
const mockNews: NewsItem[] = [
  {
    id: 'news-001',
    title: 'Bitcoin Reaches New All-Time High',
    summary: 'Bitcoin price surges to $45,000, marking a new record high.',
    content:
      "<p>Bitcoin (BTC) has reached a new all-time high price of $45,000, driven by increased institutional adoption and growing mainstream acceptance. The cryptocurrency has shown remarkable resilience despite market volatility.</p><p>Major financial institutions are increasingly adding Bitcoin to their portfolios, signaling confidence in the digital asset's long-term potential.</p>",
    status: 'published',
    category: 'market',
    source: 'internal',
    author: 'John Smith',
    publishedAt: '2024-01-15 10:30:00',
    createdAt: '2024-01-15 09:00:00',
    updatedAt: '2024-01-15 10:30:00',
    views: 12500,
    tags: ['bitcoin', 'crypto', 'market'],
  },
  {
    id: 'news-002',
    title: 'New Regulatory Framework for Crypto Exchanges',
    summary: 'Government announces comprehensive regulations for cryptocurrency exchanges.',
    content:
      '<p>The government has unveiled a new regulatory framework for cryptocurrency exchanges, aimed at protecting investors and ensuring market stability. The regulations include requirements for licensing, reporting, and customer protection measures.</p><p>Exchanges will have 90 days to comply with the new requirements, with penalties for non-compliance.</p>',
    status: 'published',
    category: 'regulation',
    source: 'external',
    author: 'Jane Doe',
    publishedAt: '2024-01-14 14:15:00',
    createdAt: '2024-01-14 12:00:00',
    updatedAt: '2024-01-14 14:15:00',
    views: 8750,
    tags: ['regulation', 'government', 'exchange'],
  },
  {
    id: 'news-003',
    title: 'DEIEX Launches New Trading Features',
    summary: 'Platform introduces advanced charting tools and margin trading.',
    content:
      '<p>DEIEX has launched several new features to enhance the trading experience, including advanced charting tools, margin trading capabilities, and improved order execution. These features are available to all users immediately.</p><p>The platform continues to invest in technology to provide the best trading experience for its users.</p>',
    status: 'draft',
    category: 'company',
    source: 'press_release',
    author: 'Marketing Team',
    publishedAt: '',
    createdAt: '2024-01-13 16:45:00',
    updatedAt: '2024-01-13 16:45:00',
    views: 0,
    tags: ['deiex', 'features', 'trading'],
  },
]

// Computed
const newsList = computed(() => {
  let result = [...mockNews]

  // Apply filters
  if (filters.status) {
    result = result.filter((s) => s.status === filters.status)
  }
  if (filters.category) {
    result = result.filter((s) => s.category === filters.category)
  }
  if (filters.source) {
    result = result.filter((s) => s.source === filters.source)
  }
  if (filters.search) {
    result = result.filter(
      (s) =>
        s.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.summary.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.content.toLowerCase().includes(filters.search.toLowerCase())
    )
  }

  return result
})

// Columns
const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: 250,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    width: 120,
  },
  {
    title: 'Source',
    dataIndex: 'source',
    key: 'source',
    width: 120,
  },
  {
    title: 'Author',
    dataIndex: 'author',
    key: 'author',
    width: 120,
  },
  {
    title: 'Published At',
    dataIndex: 'publishedAt',
    key: 'publishedAt',
    width: 180,
  },
  {
    title: 'Views',
    dataIndex: 'views',
    key: 'views',
    width: 100,
    sorter: (a: NewsItem, b: NewsItem) => a.views - b.views,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
  },
]

// Methods
function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    published: 'green',
    draft: 'orange',
    scheduled: 'blue',
  }
  return colorMap[status] || 'default'
}

function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    market: 'blue',
    company: 'purple',
    regulation: 'red',
    technology: 'cyan',
    analysis: 'green',
  }
  return colorMap[category] || 'default'
}

function getSourceColor(source: string): string {
  const colorMap: Record<string, string> = {
    internal: 'green',
    external: 'blue',
    press_release: 'purple',
  }
  return colorMap[source] || 'default'
}

function formatDate(date: string): string {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

function handleRefresh() {
  console.log('Refreshing market news')
}

function handleExport() {
  console.log('Exporting market news')
}

function handleFilterChange() {
  console.log('Filters changed')
}

function handleSearch() {
  console.log('Searching news')
}

function handleTableChange(pagination: any) {
  console.log('Table changed:', pagination)
}

function handleView(record: NewsItem) {
  selectedNews.value = record
  detailDrawerOpen.value = true
}

function handleEdit(record: NewsItem) {
  Object.assign(formState, {
    ...record,
    publishedAt: record.publishedAt ? dayjs(record.publishedAt) : null,
  })
  editMode.value = 'edit'
  editModalOpen.value = true
}

function handlePublish(record: NewsItem) {
  console.log('Publishing news:', record)
}

function handleDelete(record: NewsItem) {
  console.log('Deleting news:', record)
}

function handleCreate() {
  Object.assign(formState, {
    title: '',
    summary: '',
    content: '',
    status: 'draft',
    category: 'market',
    source: 'internal',
    author: '',
    publishedAt: null,
    tags: [],
  })
  editMode.value = 'create'
  editModalOpen.value = true
}

function handleSave() {
  console.log('Saving news:', formState)
  editModalOpen.value = false
}

function handleCancel() {
  editModalOpen.value = false
}

function handleCloseDetail() {
  detailDrawerOpen.value = false
}

onMounted(() => {
  console.log('Market news page mounted')
})
</script>

<style scoped>
.market-news-page {
  padding: 24px;
}

.news-title {
  text-align: left;
}

.title {
  font-weight: 600;
  color: #1890ff;
}

.summary {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.news-content {
  white-space: pre-wrap;
  line-height: 1.6;
}

:deep(.ant-drawer-body) {
  padding: 24px;
}
</style>
