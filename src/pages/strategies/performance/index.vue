<template>
  <div class="strategy-performance-page">
    <a-page-header
      :title="$t('strategies.performance.title')"
      :sub-title="$t('strategies.performance.dashboard')"
    >
      <template #extra>
        <a-space>
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
          <a-form-item :label="$t('strategies.performance.strategy')">
            <a-select
              v-model:value="filters.strategyId"
              :placeholder="$t('strategies.performance.strategyPlaceholder')"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">{{ $t('common.all') }}</a-select-option>
              <a-select-option
                v-for="instance in strategyInstances"
                :key="instance.id"
                :value="instance.id"
              >
                {{ instance.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="$t('strategies.performance.symbol')">
            <a-select
              v-model:value="filters.symbol"
              :placeholder="$t('strategies.performance.symbolPlaceholder')"
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
          <a-form-item :label="$t('strategies.performance.dateRange')">
            <a-range-picker
              v-model:value="dateRange"
              :placeholder="[
                $t('strategies.performance.startDate'),
                $t('strategies.performance.endDate'),
              ]"
              @change="handleDateRangeChange"
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="$t('strategies.performance.interval')">
            <a-select
              v-model:value="filters.interval"
              :placeholder="$t('strategies.performance.intervalPlaceholder')"
              @change="handleFilterChange"
            >
              <a-select-option value="1h">{{
                $t('strategies.performance.intervals.1h')
              }}</a-select-option>
              <a-select-option value="1d">{{
                $t('strategies.performance.intervals.1d')
              }}</a-select-option>
              <a-select-option value="1w">{{
                $t('strategies.performance.intervals.1w')
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

    <!-- Performance Charts -->
    <a-row :gutter="16" class="charts-row">
      <a-col :span="24">
        <a-card :title="$t('strategies.performance.equityCurve')" class="chart-card">
          <template #extra>
            <a-button type="link" size="small" @click="toggleEquityFullscreen">
              <FullscreenOutlined />
            </a-button>
          </template>
          <div ref="equityChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" class="charts-row">
      <a-col :span="12">
        <a-card :title="$t('strategies.performance.pnlChart')" class="chart-card">
          <div ref="pnlChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card :title="$t('strategies.performance.drawdownChart')" class="chart-card">
          <div ref="drawdownChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Performance Metrics -->
    <a-card :title="$t('strategies.performance.metrics')" class="metrics-card">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-statistic
            :title="$t('strategies.performance.totalReturn')"
            :value="metrics.totalReturn"
            :precision="2"
            suffix="%"
            :value-style="metrics.totalReturn >= 0 ? { color: '#52c41a' } : { color: '#f5222d' }"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            :title="$t('strategies.performance.maxDrawdown')"
            :value="metrics.maxDrawdown"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#f5222d' }"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            :title="$t('strategies.performance.sharpeRatio')"
            :value="metrics.sharpeRatio"
            :precision="2"
            :value-style="metrics.sharpeRatio >= 1 ? { color: '#52c41a' } : { color: '#faad14' }"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            :title="$t('strategies.performance.winRate')"
            :value="metrics.winRate"
            :precision="2"
            suffix="%"
            :value-style="metrics.winRate >= 50 ? { color: '#52c41a' } : { color: '#faad14' }"
          />
        </a-col>
      </a-row>
      <a-row :gutter="16" style="margin-top: 16px">
        <a-col :span="6">
          <a-statistic
            :title="$t('strategies.performance.totalTrades')"
            :value="metrics.totalTrades"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            :title="$t('strategies.performance.avgTradeReturn')"
            :value="metrics.avgTradeReturn"
            :precision="2"
            suffix="%"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            :title="$t('strategies.performance.profitFactor')"
            :value="metrics.profitFactor"
            :precision="2"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            :title="$t('strategies.performance.maxConsecutiveWins')"
            :value="metrics.maxConsecutiveWins"
            :value-style="{ color: '#52c41a' }"
          />
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { ReloadOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import type { StrategyInstance, StrategyPerformance } from '@/types/models'

// Mock data for demonstration
const mockInstances: StrategyInstance[] = [
  {
    id: '101',
    templateId: '1',
    templateName: 'Moving Average Crossover',
    name: 'BTC MA Strategy',
    description: 'BTC strategy using MA crossover',
    symbol: 'BTCUSDT',
    parameters: {
      fastPeriod: 10,
      slowPeriod: 30,
      takeProfit: 2.0,
      stopLoss: 1.0,
    },
    status: 'running',
    riskLevel: 'medium',
    allocatedCapital: '10000',
    allocatedCurrency: 'USDT',
    currentPnl: '1250',
    currentPnlPercent: '12.5',
    maxDrawdown: '15.5',
    totalTrades: 45,
    winRate: '65.5',
    sharpeRatio: '1.8',
    createdBy: 'admin',
    createdAt: '2023-05-01T10:00:00Z',
    updatedAt: '2023-05-01T10:00:00Z',
  },
  {
    id: '102',
    templateId: '2',
    templateName: 'RSI Mean Reversion',
    name: 'ETH RSI Strategy',
    description: 'ETH strategy using RSI mean reversion',
    symbol: 'ETHUSDT',
    parameters: {
      rsiPeriod: 14,
      overbought: 70,
      oversold: 30,
      takeProfit: 1.5,
      stopLoss: 0.8,
    },
    status: 'paused',
    riskLevel: 'low',
    allocatedCapital: '5000',
    allocatedCurrency: 'USDT',
    currentPnl: '-75',
    currentPnlPercent: '-1.5',
    maxDrawdown: '8.2',
    totalTrades: 28,
    winRate: '58.2',
    sharpeRatio: '0.9',
    createdBy: 'admin',
    createdAt: '2023-05-10T14:30:00Z',
    updatedAt: '2023-05-10T14:30:00Z',
  },
]

// Mock performance data
const mockPerformanceData: StrategyPerformance[] = []
for (let i = 0; i < 30; i++) {
  const timestamp = dayjs()
    .subtract(29 - i, 'day')
    .toISOString()
  const equity = 10000 + Math.random() * 2000 - 500
  const pnl = Math.random() * 200 - 50
  const drawdown = Math.random() * 10

  mockPerformanceData.push({
    timestamp,
    strategyId: '101',
    strategyName: 'BTC MA Strategy',
    symbol: 'BTCUSDT',
    equity: equity.toFixed(2),
    pnl: pnl.toFixed(2),
    pnlPercent: ((pnl / 10000) * 100).toFixed(2),
    allocatedCapital: '10000',
    drawdown: drawdown.toFixed(2),
    totalTrades: 45,
    winRate: '65.5',
  })
}

// State
const { t } = useI18n()
const strategyInstances = ref<StrategyInstance[]>(mockInstances)
const performanceData = ref<StrategyPerformance[]>(mockPerformanceData)

const filters = ref({
  strategyId: '101',
  symbol: undefined as string | undefined,
  interval: '1d',
})

const dateRange = ref<[dayjs.Dayjs, dayjs.Dayjs] | undefined>([
  dayjs().subtract(29, 'day'),
  dayjs(),
])

const metrics = ref({
  totalReturn: 12.5,
  maxDrawdown: 8.2,
  sharpeRatio: 1.8,
  winRate: 65.5,
  totalTrades: 45,
  avgTradeReturn: 1.72,
  profitFactor: 1.85,
  maxConsecutiveWins: 8,
})

// Chart refs
const equityChartRef = ref<HTMLDivElement | null>(null)
const pnlChartRef = ref<HTMLDivElement | null>(null)
const drawdownChartRef = ref<HTMLDivElement | null>(null)

let equityChart: echarts.ECharts | null = null
let pnlChart: echarts.ECharts | null = null
let drawdownChart: echarts.ECharts | null = null

// Lifecycle
onMounted(() => {
  initCharts()
  updateCharts()
})

onBeforeUnmount(() => {
  equityChart?.dispose()
  pnlChart?.dispose()
  drawdownChart?.dispose()
})

// Watch for data changes
watch(performanceData, () => {
  updateCharts()
})

// Methods
function initCharts() {
  if (equityChartRef.value) {
    equityChart = echarts.init(equityChartRef.value)
  }
  if (pnlChartRef.value) {
    pnlChart = echarts.init(pnlChartRef.value)
  }
  if (drawdownChartRef.value) {
    drawdownChart = echarts.init(drawdownChartRef.value)
  }
}

function updateCharts() {
  updateEquityChart()
  updatePnlChart()
  updateDrawdownChart()
}

function updateEquityChart() {
  if (!equityChart) return

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const param = params[0]
        return `${param.name}<br/>${t('strategies.performance.equity')}: ${param.value}`
      },
    },
    xAxis: {
      type: 'category',
      data: performanceData.value.map((item) => dayjs(item.timestamp).format('YYYY-MM-DD')),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `$${value.toFixed(0)}`,
      },
    },
    series: [
      {
        name: t('strategies.performance.equity'),
        type: 'line',
        data: performanceData.value.map((item) => parseFloat(item.equity)),
        smooth: true,
        lineStyle: {
          color: '#1890ff',
        },
        areaStyle: {
          color: '#1890ff',
          opacity: 0.3,
        },
      },
    ],
  }

  equityChart.setOption(option, true)
}

function updatePnlChart() {
  if (!pnlChart) return

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const param = params[0]
        const value = parseFloat(param.value)
        const color = value >= 0 ? '#52c41a' : '#f5222d'
        return `${param.name}<br/>${t('strategies.performance.pnl')}: <span style="color:${color}">${value.toFixed(2)}</span>`
      },
    },
    xAxis: {
      type: 'category',
      data: performanceData.value.map((item) => dayjs(item.timestamp).format('YYYY-MM-DD')),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: t('strategies.performance.pnl'),
        type: 'bar',
        data: performanceData.value.map((item) => {
          const value = parseFloat(item.pnl)
          return {
            value,
            itemStyle: {
              color: value >= 0 ? '#52c41a' : '#f5222d',
            },
          }
        }),
      },
    ],
  }

  pnlChart.setOption(option, true)
}

function updateDrawdownChart() {
  if (!drawdownChart) return

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const param = params[0]
        return `${param.name}<br/>${t('strategies.performance.drawdown')}: ${param.value}%`
      },
    },
    xAxis: {
      type: 'category',
      data: performanceData.value.map((item) => dayjs(item.timestamp).format('YYYY-MM-DD')),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}%',
      },
    },
    series: [
      {
        name: t('strategies.performance.drawdown'),
        type: 'line',
        data: performanceData.value.map((item) => -parseFloat(item.drawdown)),
        smooth: true,
        lineStyle: {
          color: '#f5222d',
        },
        areaStyle: {
          color: '#f5222d',
          opacity: 0.3,
        },
      },
    ],
  }

  drawdownChart.setOption(option, true)
}

function handleFilterChange() {
  // Filter change handler
}

function handleDateRangeChange(dates: [dayjs.Dayjs, dayjs.Dayjs] | undefined) {
  dateRange.value = dates
}

function handleSearch() {
  // Search handler
}

function handleResetFilters() {
  filters.value = {
    strategyId: '101',
    symbol: undefined,
    interval: '1d',
  }
  dateRange.value = [dayjs().subtract(29, 'day'), dayjs()]
}

function handleRefresh() {
  // Refresh handler
}

function toggleEquityFullscreen() {
  // Fullscreen toggle handler
}
</script>

<style scoped>
.strategy-performance-page {
  padding: 24px;
}

.filter-card {
  margin-bottom: 16px;
}

.charts-row {
  margin-bottom: 16px;
}

.chart-card {
  height: 100%;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.metrics-card {
  margin-top: 16px;
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px;
  }
}
</style>
