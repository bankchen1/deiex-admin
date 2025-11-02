<template>
  <div class="trade-reports-page">
    <!-- Filters -->
    <a-card :bordered="false" class="filter-card">
      <a-form layout="inline" :model="filters">
        <a-form-item label="Date Range">
          <a-range-picker
            v-model:value="dateRange"
            :presets="datePresets"
            format="YYYY-MM-DD"
            @change="handleDateChange"
          />
        </a-form-item>

        <a-form-item label="Market">
          <a-select
            v-model:value="filters.market"
            style="width: 150px"
            @change="handleFilterChange"
          >
            <a-select-option value="all">All Markets</a-select-option>
            <a-select-option value="spot">Spot</a-select-option>
            <a-select-option value="futures">Futures</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Region">
          <a-select
            v-model:value="filters.region"
            style="width: 150px"
            allow-clear
            placeholder="All Regions"
            @change="handleFilterChange"
          >
            <a-select-option value="global">Global</a-select-option>
            <a-select-option value="us">US</a-select-option>
            <a-select-option value="eu">EU</a-select-option>
            <a-select-option value="asia">Asia</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Symbol">
          <a-input
            v-model:value="filters.symbol"
            style="width: 150px"
            placeholder="e.g. BTC/USDT"
            allow-clear
            @change="handleFilterChange"
          />
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" :loading="loading" @click="fetchData">
              <template #icon><SearchOutlined /></template>
              Search
            </a-button>
            <a-button @click="handleReset">
              <template #icon><ReloadOutlined /></template>
              Reset
            </a-button>
            <a-button @click="handleExport">
              <template #icon><DownloadOutlined /></template>
              Export
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- Summary Cards -->
    <a-row :gutter="16" class="summary-cards">
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="Total Volume"
            :value="summary?.totalVolume || '0'"
            :precision="2"
            prefix="$"
            :loading="loading"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic title="Total Trades" :value="summary?.totalTrades || 0" :loading="loading" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="Avg Trade Size"
            :value="summary?.avgTradeSize || '0'"
            :precision="2"
            prefix="$"
            :loading="loading"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <div class="top-symbol-stat">
            <div class="stat-title">Top Symbol</div>
            <div class="stat-value">{{ summary?.topSymbol || '-' }}</div>
            <div class="stat-subtitle">
              {{ formatCurrency(summary?.topSymbolVolume || '0') }}
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Charts -->
    <a-row :gutter="16" class="charts-section">
      <a-col :span="12">
        <a-card title="Volume Trend" :bordered="false" :loading="loading">
          <div ref="volumeChartRef" style="height: 350px"></div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="Maker/Taker Composition" :bordered="false" :loading="loading">
          <div ref="compositionChartRef" style="height: 350px"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Tables -->
    <a-card title="Daily Trading Data" :bordered="false" class="table-card">
      <TradeDailyTable
        :data-source="tradeDailyData"
        :loading="loading"
        @export="handleExportDaily"
      />
    </a-card>

    <a-card title="Top Trading Pairs" :bordered="false" class="table-card">
      <SymbolVolumeTable
        :data-source="symbolVolumeData"
        :loading="loading"
        @export="handleExportSymbols"
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'
import * as echarts from 'echarts'
import { useReportsStore } from '@/stores/reports'
import TradeDailyTable from '@/tables/reports/TradeDailyTable.vue'
import SymbolVolumeTable from '@/tables/reports/SymbolVolumeTable.vue'
import { formatCurrency } from '@/utils/format'
import type { TradeReportParams } from '@/types/api'

const reportsStore = useReportsStore()

// State
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(7, 'days'), dayjs()])

const filters = ref<Omit<TradeReportParams, 'startDate' | 'endDate'>>({
  market: 'all',
  region: undefined,
  symbol: undefined,
})

const volumeChartRef = ref<HTMLElement>()
const compositionChartRef = ref<HTMLElement>()
let volumeChart: echarts.ECharts | null = null
let compositionChart: echarts.ECharts | null = null

// Computed
const loading = computed(() => reportsStore.loading)
const summary = computed(() => reportsStore.tradeReports?.summary)
const charts = computed(() => reportsStore.tradeReports?.charts)
const tradeDailyData = computed(() => reportsStore.tradeDailyData)
const symbolVolumeData = computed(() => reportsStore.symbolVolumeData)

const datePresets = [
  { label: 'Last 7 Days', value: [dayjs().subtract(7, 'days'), dayjs()] as [Dayjs, Dayjs] },
  { label: 'Last 30 Days', value: [dayjs().subtract(30, 'days'), dayjs()] as [Dayjs, Dayjs] },
  { label: 'Last 90 Days', value: [dayjs().subtract(90, 'days'), dayjs()] as [Dayjs, Dayjs] },
  { label: 'This Month', value: [dayjs().startOf('month'), dayjs()] as [Dayjs, Dayjs] },
  {
    label: 'Last Month',
    value: [
      dayjs().subtract(1, 'month').startOf('month'),
      dayjs().subtract(1, 'month').endOf('month'),
    ] as [Dayjs, Dayjs],
  },
]

// Methods
function getQueryParams(): TradeReportParams {
  return {
    startDate: dateRange.value[0].format('YYYY-MM-DD'),
    endDate: dateRange.value[1].format('YYYY-MM-DD'),
    ...filters.value,
  }
}

async function fetchData() {
  try {
    const params = getQueryParams()
    await Promise.all([
      reportsStore.fetchTradeReports(params),
      reportsStore.fetchTradeDailyData(params),
      reportsStore.fetchSymbolVolumeData(params),
    ])
    await nextTick()
    renderCharts()
  } catch (error) {
    message.error('Failed to fetch trade reports')
  }
}

function handleDateChange() {
  // Auto-fetch when date changes
  fetchData()
}

function handleFilterChange() {
  // Auto-fetch when filters change
  fetchData()
}

function handleReset() {
  dateRange.value = [dayjs().subtract(7, 'days'), dayjs()]
  filters.value = {
    market: 'all',
    region: undefined,
    symbol: undefined,
  }
  fetchData()
}

async function handleExport() {
  try {
    const params = getQueryParams()
    await reportsStore.exportTradeReport(params)
    message.success('Report exported successfully')
  } catch (error) {
    message.error('Failed to export report')
  }
}

function handleExportDaily() {
  // Export daily data as CSV
  const csv = convertToCSV(tradeDailyData.value)
  downloadCSV(csv, 'trade-daily-data.csv')
}

function handleExportSymbols() {
  // Export symbol data as CSV
  const csv = convertToCSV(symbolVolumeData.value)
  downloadCSV(csv, 'symbol-volume-data.csv')
}

function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) return ''

  const headers = Object.keys(data[0])
  const rows = data.map((row) => headers.map((header) => row[header]).join(','))
  return [headers.join(','), ...rows].join('\n')
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}

function renderCharts() {
  if (!charts.value) return

  // Volume Trend Chart
  if (volumeChartRef.value) {
    if (!volumeChart) {
      volumeChart = echarts.init(volumeChartRef.value)
    }

    const volumeOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        data: ['Volume', 'Trades'],
      },
      xAxis: {
        type: 'category',
        data: charts.value.volumeTrend.map((item) => item.date),
      },
      yAxis: [
        {
          type: 'value',
          name: 'Volume (USD)',
          axisLabel: {
            formatter: (value: number) => `$${(value / 1000000).toFixed(1)}M`,
          },
        },
        {
          type: 'value',
          name: 'Trades',
          axisLabel: {
            formatter: (value: number) => `${(value / 1000).toFixed(1)}K`,
          },
        },
      ],
      series: [
        {
          name: 'Volume',
          type: 'bar',
          data: charts.value.volumeTrend.map((item) => item.volume),
          itemStyle: { color: '#1890ff' },
        },
        {
          name: 'Trades',
          type: 'line',
          yAxisIndex: 1,
          data: charts.value.volumeTrend.map((item) => item.trades),
          itemStyle: { color: '#52c41a' },
        },
      ],
    }

    volumeChart.setOption(volumeOption)
  }

  // Maker/Taker Composition Chart
  if (compositionChartRef.value) {
    if (!compositionChart) {
      compositionChart = echarts.init(compositionChartRef.value)
    }

    const compositionOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        data: ['Maker', 'Taker'],
      },
      xAxis: {
        type: 'category',
        data: charts.value.makerTakerComposition.map((item) => item.date),
      },
      yAxis: {
        type: 'value',
        name: 'Volume (USD)',
        axisLabel: {
          formatter: (value: number) => `$${(value / 1000000).toFixed(1)}M`,
        },
      },
      series: [
        {
          name: 'Maker',
          type: 'bar',
          stack: 'total',
          data: charts.value.makerTakerComposition.map((item) => item.maker),
          itemStyle: { color: '#1890ff' },
        },
        {
          name: 'Taker',
          type: 'bar',
          stack: 'total',
          data: charts.value.makerTakerComposition.map((item) => item.taker),
          itemStyle: { color: '#52c41a' },
        },
      ],
    }

    compositionChart.setOption(compositionOption)
  }
}

// Lifecycle
onMounted(() => {
  fetchData()

  // Handle window resize
  window.addEventListener('resize', () => {
    volumeChart?.resize()
    compositionChart?.resize()
  })
})

// Watch for chart data changes
watch(charts, () => {
  nextTick(() => {
    renderCharts()
  })
})
</script>

<style scoped>
.trade-reports-page {
  padding: 24px;
}

.filter-card {
  margin-bottom: 16px;
}

.summary-cards {
  margin-bottom: 16px;
}

.top-symbol-stat {
  padding: 8px 0;
}

.stat-title {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 4px;
}

.stat-subtitle {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.charts-section {
  margin-bottom: 16px;
}

.table-card {
  margin-bottom: 16px;
}
</style>
