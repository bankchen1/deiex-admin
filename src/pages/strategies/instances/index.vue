<template>
  <div class="strategy-instances-page">
    <a-page-header
      :title="$t('strategies.instances.title')"
      :sub-title="$t('strategies.instances.dashboard')"
    >
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon>
              <PlusOutlined />
            </template>
            {{ $t('strategies.instances.createInstance') }}
          </a-button>
          <a-button @click="handleRefresh">
            <template #icon>
              <ReloadOutlined />
            </template>
            {{ $t('common.refresh') }}
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- Filters -->
    <a-card class="filter-card">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item :label="$t('strategies.templates.name')">
            <a-input
              v-model:value="filters.name"
              :placeholder="$t('strategies.instances.namePlaceholder')"
              @press-enter="handleSearch"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="$t('strategies.templates.category')">
            <a-select
              v-model:value="filters.templateId"
              :placeholder="$t('strategies.instances.templatePlaceholder')"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">{{ $t('common.all') }}</a-select-option>
              <a-select-option
                v-for="template in strategyTemplates"
                :key="template.id"
                :value="template.id"
              >
                {{ template.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="$t('strategies.instances.symbol')">
            <a-select
              v-model:value="filters.symbol"
              :placeholder="$t('strategies.instances.symbolPlaceholder')"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">{{ $t('common.all') }}</a-select-option>
              <a-select-option value="BTCUSDT">BTC/USDT</a-select-option>
              <a-select-option value="ETHUSDT">ETH/USDT</a-select-option>
              <a-select-option value="BNBUSDT">BNB/USDT</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="$t('strategies.instances.status')">
            <a-select
              v-model:value="filters.status"
              :placeholder="$t('strategies.instances.statusPlaceholder')"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">{{ $t('common.all') }}</a-select-option>
              <a-select-option value="running">{{
                $t('strategies.instances.statuses.running')
              }}</a-select-option>
              <a-select-option value="paused">{{
                $t('strategies.instances.statuses.paused')
              }}</a-select-option>
              <a-select-option value="stopped">{{
                $t('strategies.instances.statuses.stopped')
              }}</a-select-option>
              <a-select-option value="error">{{
                $t('strategies.instances.statuses.error')
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-space>
            <a-button type="primary" @click="handleSearch">{{ $t('common.search') }}</a-button>
            <a-button @click="handleResetFilters">{{ $t('common.reset') }}</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>

    <!-- Instances Table -->
    <a-card class="content-card">
      <StrategyInstanceTable
        :data-source="instances"
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
        @start="handleStart"
        @stop="handleStop"
        @pause="handlePause"
      >
        <template #toolbar>
          <span class="table-info">{{ $t('strategies.instances.total') }}: {{ total }}</span>
        </template>
      </StrategyInstanceTable>
    </a-card>

    <!-- Create/Edit Drawer -->
    <StrategyInstanceDrawer
      v-model:open="drawerVisible"
      :instance="currentInstance"
      :mode="drawerMode"
      @submit="handleInstanceSubmit"
      @close="handleDrawerClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { useStrategiesStore } from '@/stores/strategies'
import StrategyInstanceTable from '@/tables/strategies/StrategyInstanceTable.vue'
import StrategyInstanceDrawer from '@/modals/strategies/StrategyInstanceDrawer.vue'
import type { StrategyInstance, StrategyTemplate } from '@/contracts/strategies'

// State
const strategiesStore = useStrategiesStore()
const { t } = useI18n()

const filters = ref({
  status: undefined as string | undefined,
  templateId: undefined as string | undefined,
  symbol: undefined as string | undefined,
  search: '',
})

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)

// Computed getters that map to store values
const instances = computed(() => strategiesStore.strategyInstances)
const total = computed(() => strategiesStore.strategyInstancesTotal)
const templates = computed(() => strategiesStore.strategyTemplates)

const drawerVisible = ref(false)
const drawerMode = ref<'create' | 'edit' | 'view'>('create')
const currentInstance = ref<StrategyInstance | null>(null)

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
    name: '',
    templateId: undefined,
    symbol: undefined,
    status: undefined,
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
  currentInstance.value = null
  drawerMode.value = 'create'
  drawerVisible.value = true
}

function handleView(record: StrategyInstance) {
  currentInstance.value = record
  drawerMode.value = 'view'
  drawerVisible.value = true
}

function handleEdit(record: StrategyInstance) {
  currentInstance.value = record
  drawerMode.value = 'edit'
  drawerVisible.value = true
}

function handleDelete(record: StrategyInstance) {
  // In a real implementation, delete from API
  instances.value = instances.value.filter((instance) => instance.id !== record.id)
  total.value -= 1
  message.success(t('messages.deleteSuccess'))
}

function handleStart(record: StrategyInstance) {
  // In a real implementation, start the strategy instance via API
  const index = instances.value.findIndex((instance) => instance.id === record.id)
  if (index !== -1) {
    instances.value[index] = {
      ...instances.value[index],
      status: 'running',
    }
    message.success(t('strategies.instances.messages.started'))
  }
}

function handleStop(record: StrategyInstance) {
  // In a real implementation, stop the strategy instance via API
  const index = instances.value.findIndex((instance) => instance.id === record.id)
  if (index !== -1) {
    instances.value[index] = {
      ...instances.value[index],
      status: 'stopped',
    }
    message.success(t('strategies.instances.messages.stopped'))
  }
}

function handlePause(record: StrategyInstance) {
  // In a real implementation, pause the strategy instance via API
  const index = instances.value.findIndex((instance) => instance.id === record.id)
  if (index !== -1) {
    instances.value[index] = {
      ...instances.value[index],
      status: 'paused',
    }
    message.success(t('strategies.instances.messages.paused'))
  }
}

async function handleInstanceSubmit(payload: any) {
  // In a real implementation, save to API
  if (drawerMode.value === 'create') {
    const newInstance: StrategyInstance = {
      id: (100 + instances.value.length + 1).toString(),
      ...payload,
      status: 'running',
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    instances.value.unshift(newInstance)
    total.value += 1
    message.success(t('messages.createSuccess'))
  } else if (drawerMode.value === 'edit' && currentInstance.value) {
    const index = instances.value.findIndex((instance) => instance.id === currentInstance.value!.id)
    if (index !== -1) {
      instances.value[index] = {
        ...currentInstance.value,
        ...payload,
        updatedAt: new Date().toISOString(),
      }
      message.success(t('messages.updateSuccess'))
    }
  }

  drawerVisible.value = false
  fetchData()
}

function handleDrawerClose() {
  drawerVisible.value = false
  currentInstance.value = null
}
</script>

<style scoped>
.strategy-instances-page {
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
