<template>
  <div class="strategy-backtest-page">
    <a-page-header
      :title="$t('strategies.backtest.title')"
      :sub-title="$t('strategies.backtest.dashboard')"
    >
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleRunBacktest">
            <template #icon>
              <PlayCircleOutlined />
            </template>
            {{ $t('strategies.backtest.runBacktest') }}
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
              v-model:value="filters.templateName"
              :placeholder="$t('strategies.backtest.templateNamePlaceholder')"
              @press-enter="handleSearch"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="$t('strategies.backtest.symbol')">
            <a-select
              v-model:value="filters.symbol"
              :placeholder="$t('strategies.backtest.symbolPlaceholder')"
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
          <a-form-item :label="$t('strategies.backtest.status')">
            <a-select
              v-model:value="filters.status"
              :placeholder="$t('strategies.backtest.statusPlaceholder')"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">{{ $t('common.all') }}</a-select-option>
              <a-select-option value="completed">{{
                $t('strategies.backtest.statuses.completed')
              }}</a-select-option>
              <a-select-option value="running">{{
                $t('strategies.backtest.statuses.running')
              }}</a-select-option>
              <a-select-option value="failed">{{
                $t('strategies.backtest.statuses.failed')
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="$t('strategies.backtest.dateRange')">
            <a-range-picker
              v-model:value="dateRange"
              :placeholder="[
                $t('strategies.backtest.startDate'),
                $t('strategies.backtest.endDate'),
              ]"
              @change="handleDateRangeChange"
            />
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

    <!-- Backtest Results Table -->
    <a-card class="content-card">
      <BacktestResultTable
        :data-source="backtestResults"
        :loading="loading"
        :pagination="{
          current: currentPage,
          pageSize: pageSize,
          total: total,
        }"
        @change="handleTableChange"
        @view="handleView"
        @delete="handleDelete"
      >
        <template #toolbar>
          <span class="table-info">{{ $t('strategies.backtest.total') }}: {{ total }}</span>
        </template>
      </BacktestResultTable>
    </a-card>

    <!-- Run Backtest Drawer -->
    <RunBacktestDrawer
      v-model:open="drawerVisible"
      @submit="handleBacktestSubmit"
      @close="handleDrawerClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { PlayCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { useStrategiesStore } from '@/stores/strategies' // Will need to be created
import BacktestResultTable from '@/tables/strategies/BacktestResultTable.vue'
import RunBacktestDrawer from '@/modals/strategies/RunBacktestDrawer.vue'
import type { BacktestResult } from '@/contracts/strategies' // Will need to be created

// State
const strategiesStore = useStrategiesStore()
const { t } = useI18n()

const filters = ref({
  templateName: '',
  symbol: undefined as string | undefined,
  status: undefined as string | undefined,
})

const dateRange = ref<[dayjs.Dayjs, dayjs.Dayjs] | undefined>(undefined)

const loading = ref(false)
const drawerVisible = ref(false)

// Lifecycle
onMounted(() => {
  fetchData()
})

// Getters (computed values)
const backtestResults = computed(() => strategiesStore.backtestResults)
const total = computed(() => strategiesStore.totalBacktestResults)
const currentPage = computed(() => strategiesStore.currentPage)
const pageSize = computed(() => strategiesStore.pageSize)

// Methods
async function fetchData() {
  loading.value = true
  try {
    await strategiesStore.fetchBacktestResults({
      page: currentPage.value,
      pageSize: pageSize.value,
      templateName: filters.value.templateName,
      symbol: filters.value.symbol,
      status: filters.value.status,
      startDate: dateRange.value?.[0]?.toISOString(),
      endDate: dateRange.value?.[1]?.toISOString(),
    })
  } catch (error: any) {
    message.error(error.message || 'Failed to load backtest results')
  } finally {
    loading.value = false
  }
}

function handleFilterChange() {
  // Auto-search on filter change (optional)
}

function handleDateRangeChange(dates: [dayjs.Dayjs, dayjs.Dayjs] | undefined) {
  dateRange.value = dates
}

function handleSearch() {
  fetchData()
}

function handleResetFilters() {
  filters.value = {
    templateName: '',
    symbol: undefined,
    status: undefined,
  }
  dateRange.value = undefined
  fetchData()
}

function handleRefresh() {
  fetchData()
}

function handleTableChange(pagination: any) {
  strategiesStore.setPage(pagination.current)
  strategiesStore.setPageSize(pagination.pageSize)
  fetchData()
}

function handleRunBacktest() {
  drawerVisible.value = true
}

function handleView(record: BacktestResult) {
  // In a real implementation, navigate to backtest result detail page
  message.info(t('strategies.backtest.messages.viewNotImplemented'))
}

async function handleDelete(record: BacktestResult) {
  try {
    await strategiesStore.deleteBacktestResult(record.id)
    message.success(t('messages.deleteSuccess'))
  } catch (error: any) {
    message.error(error.message || 'Failed to delete backtest result')
  }
}

async function handleBacktestSubmit(payload: any) {
  // In a real implementation, submit to API to run backtest
  message.success(t('strategies.backtest.messages.submitted'))
  drawerVisible.value = false
  fetchData()
}

function handleDrawerClose() {
  drawerVisible.value = false
}
</script>

<style scoped>
.strategy-backtest-page {
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
