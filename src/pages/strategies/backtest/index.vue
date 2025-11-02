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
import BacktestResultTable from '@/tables/strategies/BacktestResultTable.vue'
import RunBacktestDrawer from '@/modals/strategies/RunBacktestDrawer.vue'
import type { BacktestResult } from '@/types/models'

// Mock data for demonstration
const mockBacktestResults: BacktestResult[] = [
  {
    id: '1001',
    strategyId: '1',
    strategyName: 'Moving Average Crossover',
    symbol: 'BTCUSDT',
    startTime: '2023-01-01T00:00:00Z',
    endTime: '2023-12-31T23:59:59Z',
    initialCapital: '10000',
    finalCapital: '12500',
    totalReturn: '2500',
    totalReturnPercent: '25.0',
    maxDrawdown: '15.5',
    sharpeRatio: '1.8',
    winRate: '65.5',
    totalTrades: 145,
    profitableTrades: 95,
    avgTradeReturn: '1.72',
    maxConsecutiveWins: 8,
    maxConsecutiveLosses: 3,
    parameters: {
      fastPeriod: 10,
      slowPeriod: 30,
      takeProfit: 2.0,
      stopLoss: 1.0,
    },
    status: 'completed',
    createdAt: '2023-05-01T10:00:00Z',
    updatedAt: '2023-05-01T10:00:00Z',
  },
  {
    id: '1002',
    strategyId: '2',
    strategyName: 'RSI Mean Reversion',
    symbol: 'ETHUSDT',
    startTime: '2023-01-01T00:00:00Z',
    endTime: '2023-12-31T23:59:59Z',
    initialCapital: '5000',
    finalCapital: '4925',
    totalReturn: '-75',
    totalReturnPercent: '-1.5',
    maxDrawdown: '8.2',
    sharpeRatio: '0.9',
    winRate: '58.2',
    totalTrades: 88,
    profitableTrades: 51,
    avgTradeReturn: '-0.85',
    maxConsecutiveWins: 5,
    maxConsecutiveLosses: 4,
    parameters: {
      rsiPeriod: 14,
      overbought: 70,
      oversold: 30,
      takeProfit: 1.5,
      stopLoss: 0.8,
    },
    status: 'completed',
    createdAt: '2023-05-10T14:30:00Z',
    updatedAt: '2023-05-10T14:30:00Z',
  },
]

// State
const { t } = useI18n()
const backtestResults = ref<BacktestResult[]>(mockBacktestResults)

const filters = ref({
  templateName: '',
  symbol: undefined as string | undefined,
  status: undefined as string | undefined,
})

const dateRange = ref<[dayjs.Dayjs, dayjs.Dayjs] | undefined>(undefined)

const loading = ref(false)
const total = ref(2)
const currentPage = ref(1)
const pageSize = ref(20)

const drawerVisible = ref(false)

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
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize
  fetchData()
}

function handleRunBacktest() {
  drawerVisible.value = true
}

function handleView(record: BacktestResult) {
  // In a real implementation, navigate to backtest result detail page
  message.info(t('strategies.backtest.messages.viewNotImplemented'))
}

function handleDelete(record: BacktestResult) {
  // In a real implementation, delete from API
  backtestResults.value = backtestResults.value.filter((result) => result.id !== record.id)
  total.value -= 1
  message.success(t('messages.deleteSuccess'))
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
