<template>
  <div class="category-page">
    <a-page-header title="Category Management" sub-title="Manage blog categories">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon>
              <PlusOutlined />
            </template>
            Create Category
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

    <!-- Categories Table -->
    <a-card class="content-card">
      <CategoryTable
        :data-source="categories"
        :loading="loading"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
        @sort="handleSort"
      >
        <template #toolbar>
          <span class="table-info">Total: {{ categories.length }} categories</span>
        </template>
      </CategoryTable>
    </a-card>

    <!-- Create/Edit Drawer -->
    <CategoryDrawer
      v-model:open="drawerVisible"
      :category="currentCategory"
      :mode="drawerMode"
      :categories="categories"
      @submit="handleCategorySubmit"
      @close="handleDrawerClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import CategoryTable from '@/tables/content/CategoryTable.vue'
import CategoryDrawer from '@/modals/content/CategoryDrawer.vue'
import type { Category } from '@/types/models'

// Mock data for demonstration
const mockCategories: Category[] = [
  {
    id: '1',
    name: { en: 'Technology' },
    slug: 'technology',
    description: 'Technology related articles',
    sortOrder: 1,
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: { en: 'Market Insights' },
    slug: 'market-insights',
    description: 'Market analysis and insights',
    sortOrder: 2,
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: { en: 'Tutorials' },
    slug: 'tutorials',
    description: 'Step by step guides',
    sortOrder: 3,
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
]

// State
const categories = ref<Category[]>(mockCategories)
const loading = ref(false)

const drawerVisible = ref(false)
const drawerMode = ref<'create' | 'edit' | 'view'>('create')
const currentCategory = ref<Category | null>(null)

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

function handleRefresh() {
  fetchData()
}

function handleCreate() {
  currentCategory.value = null
  drawerMode.value = 'create'
  drawerVisible.value = true
}

function handleView(record: Category) {
  currentCategory.value = record
  drawerMode.value = 'view'
  drawerVisible.value = true
}

function handleEdit(record: Category) {
  currentCategory.value = record
  drawerMode.value = 'edit'
  drawerVisible.value = true
}

function handleDelete(record: Category) {
  // In a real implementation, delete from API
  categories.value = categories.value.filter((category) => category.id !== record.id)
  message.success('Category deleted successfully')
}

function handleSort(sortedCategories: Category[]) {
  // In a real implementation, update sort order via API
  categories.value = sortedCategories
  message.success('Category order updated successfully')
}

async function handleCategorySubmit(payload: any) {
  // In a real implementation, save to API
  if (drawerMode.value === 'create') {
    const newCategory: Category = {
      id: (categories.value.length + 1).toString(),
      ...payload,
      sortOrder: categories.value.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    categories.value.push(newCategory)
    message.success('Category created successfully')
  } else if (drawerMode.value === 'edit' && currentCategory.value) {
    const index = categories.value.findIndex(
      (category) => category.id === currentCategory.value!.id
    )
    if (index !== -1) {
      categories.value[index] = {
        ...currentCategory.value,
        ...payload,
        updatedAt: new Date().toISOString(),
      }
      message.success('Category updated successfully')
    }
  }

  drawerVisible.value = false
  fetchData()
}

function handleDrawerClose() {
  drawerVisible.value = false
  currentCategory.value = null
}
</script>

<style scoped>
.category-page {
  padding: 24px;
}

.content-card {
  margin-top: 16px;
}

.table-info {
  color: #666;
  font-size: 14px;
}
</style>
