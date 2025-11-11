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
      <!-- Title column -->
      <template v-if="column.key === 'title'">
        <div class="article-title">
          <a-button type="link" size="small" @click="handleView(record)">
            {{ getLocalizedText(record.title) }}
          </a-button>
          <a-tag v-if="record.featured" color="gold" size="small">Featured</a-tag>
        </div>
      </template>

      <!-- Category column -->
      <template v-else-if="column.key === 'category'">
        <a-tag v-if="record.category" color="blue">
          {{ getLocalizedText(record.category.name) }}
        </a-tag>
        <span v-else>-</span>
      </template>

      <!-- Status column -->
      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ getStatusText(record.status) }}
        </a-tag>
      </template>

      <!-- Tags column -->
      <template v-else-if="column.key === 'tags'">
        <a-space v-if="record.tags && record.tags.length > 0" size="small">
          <a-tag v-for="(tag, index) in record.tags.slice(0, 2)" :key="index" color="default">
            {{ tag }}
          </a-tag>
          <a-tooltip v-if="record.tags.length > 2" :title="getRemainingTags(record.tags)">
            <a-tag color="default"> +{{ record.tags.length - 2 }} </a-tag>
          </a-tooltip>
        </a-space>
        <span v-else class="text-muted">-</span>
      </template>

      <!-- Stats column -->
      <template v-else-if="column.key === 'stats'">
        <div class="article-stats">
          <div class="stat-item">
            <EyeOutlined />
            {{ record.viewCount }}
          </div>
          <div class="stat-item">
            <LikeOutlined />
            {{ record.likeCount }}
          </div>
          <div class="stat-item">
            <MessageOutlined />
            {{ record.commentCount }}
          </div>
        </div>
      </template>

      <!-- Actions column -->
      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleView(record)">View</a-button>
          <a-button type="link" size="small" @click="handleEdit(record)">Edit</a-button>
          <a-popconfirm
            title="Are you sure you want to delete this article?"
            @confirm="handleDelete(record)"
          >
            <a-button type="link" size="small" danger>Delete</a-button>
          </a-popconfirm>
          <a-switch
            v-model:checked="record.featured"
            checked-children="Featured"
            un-checked-children="Feature"
            @change="(checked) => handleToggleFeatured(record, checked as boolean)"
          />
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EyeOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue'
import ServerTable from '@/shared/ServerTable.vue'
import type { Article } from '@/contracts/content'

interface Props {
  dataSource: Article[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'view', record: Article): void
  (e: 'edit', record: Article): void
  (e: 'delete', record: Article): void
  (e: 'toggleFeatured', record: Article, featured: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

// Table columns configuration
const columns = computed(() => [
  {
    title: 'Title',
    key: 'title',
    width: 250,
    fixed: 'left',
  },
  {
    title: 'Category',
    key: 'category',
    width: 120,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
      { label: 'Archived', value: 'archived' },
    ],
  },
  {
    title: 'Tags',
    key: 'tags',
    width: 150,
  },
  {
    title: 'Stats',
    key: 'stats',
    width: 150,
  },
  {
    title: 'Published',
    dataIndex: 'publishedAt',
    key: 'publishedAt',
    width: 180,
    sortable: true,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 220,
    fixed: 'right',
  },
])

// Helper functions
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

function getRemainingTags(tags: string[]): string {
  return tags.slice(2).join(', ')
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

function handleView(record: Article) {
  emit('view', record)
}

function handleEdit(record: Article) {
  emit('edit', record)
}

function handleDelete(record: Article) {
  emit('delete', record)
}

function handleToggleFeatured(record: Article, featured: boolean) {
  emit('toggleFeatured', record, featured)
}
</script>

<style scoped>
.text-muted {
  color: #999;
}

.article-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.article-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}
</style>
