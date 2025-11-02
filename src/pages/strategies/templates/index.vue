<template>
  <div class="strategy-templates-page">
    <a-page-header title="Strategy Templates" sub-title="Manage trading strategy templates">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon>
              <PlusOutlined />
            </template>
            Create Template
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
              v-model:value="filters.category"
              placeholder="All Categories"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All Categories</a-select-option>
              <a-select-option value="trend">Trend Following</a-select-option>
              <a-select-option value="mean-reversion">Mean Reversion</a-select-option>
              <a-select-option value="arbitrage">Arbitrage</a-select-option>
              <a-select-option value="market-making">Market Making</a-select-option>
              <a-select-option value="other">Other</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="Risk Level">
            <a-select
              v-model:value="filters.riskLevel"
              placeholder="All Risk Levels"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All Risk Levels</a-select-option>
              <a-select-option value="low">Low</a-select-option>
              <a-select-option value="medium">Medium</a-select-option>
              <a-select-option value="high">High</a-select-option>
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
              <a-select-option value="active">Active</a-select-option>
              <a-select-option value="inactive">Inactive</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="Search">
            <a-input
              v-model:value="filters.search"
              placeholder="Search by name or description"
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

    <!-- Templates Table -->
    <a-card class="content-card">
      <StrategyTemplateTable
        :data-source="templates"
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
        @clone="handleClone"
      >
        <template #toolbar>
          <span class="table-info">Total: {{ total }} templates</span>
        </template>
      </StrategyTemplateTable>
    </a-card>

    <!-- Create/Edit Drawer -->
    <StrategyTemplateDrawer
      v-model:open="drawerVisible"
      :template="currentTemplate"
      :mode="drawerMode"
      @submit="handleTemplateSubmit"
      @close="handleDrawerClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue'
import StrategyTemplateTable from '@/tables/strategies/StrategyTemplateTable.vue'
import StrategyTemplateDrawer from '@/modals/strategies/StrategyTemplateDrawer.vue'
import type { StrategyTemplate } from '@/types/models'

// Mock data for demonstration
const mockTemplates: StrategyTemplate[] = [
  {
    id: '1',
    name: 'Moving Average Crossover',
    description: 'A classic trend-following strategy based on moving average crossovers',
    category: 'trend',
    parameters: {
      fastPeriod: 10,
      slowPeriod: 30,
      takeProfit: 2.0,
      stopLoss: 1.0,
    },
    code: '// Strategy code here...',
    riskLevel: 'medium',
    maxDrawdown: '15.5',
    expectedReturn: '25.0',
    status: 'active',
    version: '1.0',
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'RSI Mean Reversion',
    description: 'A mean-reversion strategy based on RSI indicator',
    category: 'mean-reversion',
    parameters: {
      rsiPeriod: 14,
      overbought: 70,
      oversold: 30,
      takeProfit: 1.5,
      stopLoss: 0.8,
    },
    code: '// Strategy code here...',
    riskLevel: 'low',
    maxDrawdown: '8.2',
    expectedReturn: '18.5',
    status: 'active',
    version: '1.2',
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2023-02-20T14:30:00Z',
    updatedAt: '2023-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Grid Trading',
    description: 'A market-making strategy that places buy and sell orders in a grid',
    category: 'market-making',
    parameters: {
      gridSpacing: 1.0,
      orderSize: 0.1,
      maxOrders: 10,
      stopLoss: 5.0,
    },
    code: '// Strategy code here...',
    riskLevel: 'high',
    maxDrawdown: '30.0',
    expectedReturn: '45.0',
    status: 'inactive',
    version: '2.1',
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2023-03-10T09:15:00Z',
    updatedAt: '2023-03-10T09:15:00Z',
  },
]

// State
const filters = ref({
  category: undefined as string | undefined,
  riskLevel: undefined as string | undefined,
  status: undefined as string | undefined,
  search: '',
})

const templates = ref<StrategyTemplate[]>(mockTemplates)
const loading = ref(false)
const total = ref(3)
const currentPage = ref(1)
const pageSize = ref(20)

const drawerVisible = ref(false)
const drawerMode = ref<'create' | 'edit' | 'view'>('create')
const currentTemplate = ref<StrategyTemplate | null>(null)

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
    category: undefined,
    riskLevel: undefined,
    status: undefined,
    search: '',
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
  currentTemplate.value = null
  drawerMode.value = 'create'
  drawerVisible.value = true
}

function handleView(record: StrategyTemplate) {
  currentTemplate.value = record
  drawerMode.value = 'view'
  drawerVisible.value = true
}

function handleEdit(record: StrategyTemplate) {
  currentTemplate.value = record
  drawerMode.value = 'edit'
  drawerVisible.value = true
}

function handleDelete(record: StrategyTemplate) {
  // In a real implementation, delete from API
  templates.value = templates.value.filter((template) => template.id !== record.id)
  total.value -= 1
  message.success('Strategy template deleted successfully')
}

function handleClone(record: StrategyTemplate) {
  const clonedTemplate: StrategyTemplate = {
    ...record,
    id: (templates.value.length + 1).toString(),
    name: `${record.name} (Copy)`,
    version: '1.0',
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  templates.value.push(clonedTemplate)
  total.value += 1
  message.success('Strategy template cloned successfully')
}

async function handleTemplateSubmit(payload: any) {
  // In a real implementation, save to API
  if (drawerMode.value === 'create') {
    const newTemplate: StrategyTemplate = {
      id: (templates.value.length + 1).toString(),
      ...payload,
      version: '1.0',
      createdBy: 'admin',
      updatedBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    templates.value.unshift(newTemplate)
    total.value += 1
    message.success('Strategy template created successfully')
  } else if (drawerMode.value === 'edit' && currentTemplate.value) {
    const index = templates.value.findIndex((template) => template.id === currentTemplate.value!.id)
    if (index !== -1) {
      templates.value[index] = {
        ...currentTemplate.value,
        ...payload,
        updatedBy: 'admin',
        updatedAt: new Date().toISOString(),
      }
      message.success('Strategy template updated successfully')
    }
  }

  drawerVisible.value = false
  fetchData()
}

function handleDrawerClose() {
  drawerVisible.value = false
  currentTemplate.value = null
}
</script>

<style scoped>
.strategy-templates-page {
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
