<template>
  <div class="blog-page">
    <a-page-header title="Blog Management" sub-title="Manage blog articles and categories">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon>
              <PlusOutlined />
            </template>
            Create Article
          </a-button>
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
          <a-form-item label="Category">
            <a-select
              v-model:value="filters.categoryId"
              placeholder="All Categories"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All Categories</a-select-option>
              <a-select-option
                v-for="category in categoryOptions"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </a-select-option>
            </a-select>
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
              <a-select-option value="draft">Draft</a-select-option>
              <a-select-option value="published">Published</a-select-option>
              <a-select-option value="archived">Archived</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="Search">
            <a-input
              v-model:value="filters.search"
              placeholder="Search by title or content"
              @press-enter="handleSearch"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="Featured">
            <a-select
              v-model:value="filters.featured"
              placeholder="All"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All</a-select-option>
              <a-select-option :value="true">Featured</a-select-option>
              <a-select-option :value="false">Not Featured</a-select-option>
            </a-select>
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

    <!-- Articles Table -->
    <a-card class="content-card">
      <ArticleTable
        :data-source="articles"
        :loading="loading"
        :pagination="{
          current: currentPage,
          pageSize: pageSize,
          total: total,
        }"
        @change="handleTableChange"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
        @toggle-featured="handleToggleFeatured"
      >
        <template #toolbar>
          <span class="table-info">Total: {{ total }} articles</span>
        </template>
      </ArticleTable>
    </a-card>

    <!-- Create/Edit Drawer -->
    <ArticleDrawer
      v-model:open="drawerVisible"
      :article="currentArticle"
      :mode="drawerMode"
      @submit="handleArticleSubmit"
      @close="handleDrawerClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue'
import ArticleTable from '@/tables/content/ArticleTable.vue'
import ArticleDrawer from '@/modals/content/ArticleDrawer.vue'
import type { Article, Category } from '@/types/models'

// Mock data for demonstration
const mockCategories: Category[] = [
  {
    id: '1',
    name: { en: 'Technology' },
    slug: 'technology',
    sortOrder: 1,
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: { en: 'Market Insights' },
    slug: 'market-insights',
    sortOrder: 2,
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
]

const mockArticles: Article[] = [
  {
    id: '1',
    title: { en: 'Understanding Blockchain Technology' },
    slug: 'understanding-blockchain-technology',
    summary: { en: 'A comprehensive guide to blockchain technology' },
    content: { en: 'Full content here...' },
    categoryId: '1',
    category: mockCategories[0],
    authorId: '1',
    authorName: 'Admin User',
    status: 'published',
    featured: true,
    tags: ['blockchain', 'technology'],
    viewCount: 1250,
    likeCount: 42,
    commentCount: 8,
    publishedAt: '2023-06-15T10:00:00Z',
    version: '1.0',
    createdAt: '2023-06-15T10:00:00Z',
    updatedAt: '2023-06-15T10:00:00Z',
  },
  {
    id: '2',
    title: { en: 'Market Analysis Q2 2023' },
    slug: 'market-analysis-q2-2023',
    summary: { en: 'Quarterly market analysis report' },
    content: { en: 'Full content here...' },
    categoryId: '2',
    category: mockCategories[1],
    authorId: '1',
    authorName: 'Admin User',
    status: 'draft',
    featured: false,
    tags: ['market', 'analysis'],
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    version: '1.0',
    createdAt: '2023-06-20T10:00:00Z',
    updatedAt: '2023-06-20T10:00:00Z',
  },
]

// State
const filters = ref({
  categoryId: undefined as string | undefined,
  status: undefined as string | undefined,
  search: '',
  featured: undefined as boolean | undefined,
})

const articles = ref<Article[]>(mockArticles)
const loading = ref(false)
const total = ref(2)
const currentPage = ref(1)
const pageSize = ref(20)

const drawerVisible = ref(false)
const drawerMode = ref<'create' | 'edit' | 'view'>('create')
const currentArticle = ref<Article | null>(null)

// Computed
const categoryOptions = computed(() => mockCategories)

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
    categoryId: undefined,
    status: undefined,
    search: '',
    featured: undefined,
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

function handleCreate() {
  currentArticle.value = null
  drawerMode.value = 'create'
  drawerVisible.value = true
}

function handleView(record: Article) {
  currentArticle.value = record
  drawerMode.value = 'view'
  drawerVisible.value = true
}

function handleEdit(record: Article) {
  currentArticle.value = record
  drawerMode.value = 'edit'
  drawerVisible.value = true
}

function handleDelete(record: Article) {
  // In a real implementation, delete from API
  articles.value = articles.value.filter((article) => article.id !== record.id)
  total.value -= 1
  message.success('Article deleted successfully')
}

function handleToggleFeatured(record: Article, featured: boolean) {
  // In a real implementation, update via API
  const index = articles.value.findIndex((article) => article.id === record.id)
  if (index !== -1) {
    articles.value[index] = { ...record, featured }
    message.success(`Article ${featured ? 'featured' : 'unfeatured'} successfully`)
  }
}

async function handleArticleSubmit(payload: any) {
  // In a real implementation, save to API
  if (drawerMode.value === 'create') {
    const newArticle: Article = {
      id: (articles.value.length + 1).toString(),
      ...payload,
      authorId: '1',
      authorName: 'Admin User',
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    articles.value.unshift(newArticle)
    total.value += 1
    message.success('Article created successfully')
  } else if (drawerMode.value === 'edit' && currentArticle.value) {
    const index = articles.value.findIndex((article) => article.id === currentArticle.value!.id)
    if (index !== -1) {
      articles.value[index] = {
        ...currentArticle.value,
        ...payload,
        updatedAt: new Date().toISOString(),
      }
      message.success('Article updated successfully')
    }
  }

  drawerVisible.value = false
  fetchData()
}

function handleDrawerClose() {
  drawerVisible.value = false
  currentArticle.value = null
}
</script>

<style scoped>
.blog-page {
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
