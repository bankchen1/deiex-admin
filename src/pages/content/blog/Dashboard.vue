<template>
  <div class="blog-dashboard">
    <a-row :gutter="16" class="stats-section">
      <a-col :span="6">
        <a-card>
          <a-statistic title="Total Articles" :value="stats.totalArticles" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Published"
            :value="stats.published"
            :value-style="{ color: '#52c41a' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="Drafts" :value="stats.drafts" :value-style="{ color: '#faad14' }" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Featured"
            :value="stats.featured"
            :value-style="{ color: '#722ed1' }"
          />
        </a-card>
      </a-col>
    </a-row>

    <a-card title="Recent Articles" :bordered="false" class="content-card">
      <template #extra>
        <a-button type="primary" @click="handleCreateArticle">Create Article</a-button>
      </template>
      <a-list :data-source="recentArticles" :loading="loading">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <a-button type="link" @click="handleViewArticle(item)">{{
                  item.title.en
                }}</a-button>
                <a-tag v-if="item.featured" color="gold" style="margin-left: 8px">Featured</a-tag>
              </template>
              <template #description>
                <div class="article-meta">
                  <span>{{ item.category?.name.en }}</span>
                  <span>•</span>
                  <span>{{ formatDate(item.createdAt) }}</span>
                  <span>•</span>
                  <a-tag :color="getStatusColor(item.status)">{{
                    getStatusText(item.status)
                  }}</a-tag>
                </div>
              </template>
            </a-list-item-meta>
            <template #actions>
              <a-button type="link" size="small" @click="handleEditArticle(item)">Edit</a-button>
              <a-button type="link" size="small" @click="handleViewArticle(item)">View</a-button>
            </template>
          </a-list-item>
        </template>
        <template #footer>
          <div class="list-footer">
            <a-button type="primary" ghost @click="handleManageArticles"
              >Manage All Articles</a-button
            >
            <a-button @click="handleManageCategories">Manage Categories</a-button>
            <a-button @click="handleManageComments">Manage Comments</a-button>
          </div>
        </template>
      </a-list>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/date'
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
    status: 'published',
    featured: false,
    tags: ['market', 'analysis'],
    viewCount: 890,
    likeCount: 28,
    commentCount: 5,
    publishedAt: '2023-06-10T10:00:00Z',
    version: '1.0',
    createdAt: '2023-06-10T10:00:00Z',
    updatedAt: '2023-06-10T10:00:00Z',
  },
  {
    id: '3',
    title: { en: 'How to Secure Your Crypto Wallet' },
    slug: 'how-to-secure-your-crypto-wallet',
    summary: { en: 'Best practices for crypto wallet security' },
    content: { en: 'Full content here...' },
    categoryId: '1',
    category: mockCategories[0],
    authorId: '1',
    authorName: 'Admin User',
    status: 'draft',
    featured: false,
    tags: ['security', 'wallet'],
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    version: '1.0',
    createdAt: '2023-06-20T10:00:00Z',
    updatedAt: '2023-06-20T10:00:00Z',
  },
]

// State
const stats = ref({
  totalArticles: 12,
  published: 8,
  drafts: 3,
  featured: 2,
})

const recentArticles = ref<Article[]>(mockArticles.slice(0, 5))
const loading = ref(false)

const router = useRouter()

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

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    draft: 'orange',
    published: 'green',
    archived: 'red',
  }
  return colorMap[status] || 'default'
}

function getStatusText(status: string): string {
  const textMap: Record<string, string> = {
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
  }
  return textMap[status] || status
}

function handleCreateArticle() {
  router.push('/admin/content/blog/articles')
}

function handleViewArticle(article: Article) {
  router.push(`/admin/content/blog/articles/${article.id}`)
}

function handleEditArticle(article: Article) {
  router.push(`/admin/content/blog/articles/${article.id}/edit`)
}

function handleManageArticles() {
  router.push('/admin/content/blog/articles')
}

function handleManageCategories() {
  router.push('/admin/content/blog/categories')
}

function handleManageComments() {
  router.push('/admin/content/blog/comments')
}
</script>

<style scoped>
.blog-dashboard {
  padding: 24px 0;
}

.stats-section {
  margin-bottom: 24px;
}

.content-card {
  margin-top: 16px;
}

.article-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #666;
  font-size: 12px;
}

.list-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
</style>
