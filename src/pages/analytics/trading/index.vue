<template>
  <div class="trading-analytics">
    <a-page-header
      title="Trading Analytics"
      sub-title="Comprehensive trading volume and activity analysis"
    >
      <template #extra>
        <a-space>
          <a-range-picker
            v-model:value="dateRange"
            format="YYYY-MM-DD"
            @change="handleDateChange"
          />
          <a-select
            v-model:value="selectedInstrument"
            placeholder="All Instruments"
            style="width: 180px"
            @change="handleInstrumentChange"
          >
            <a-select-option value="">All Instruments</a-select-option>
            <a-select-option value="BTCUSDT">BTC/USDT</a-select-option>
            <a-select-option value="ETHUSDT">ETH/USDT</a-select-option>
            <a-select-option value="BNBUSDT">BNB/USDT</a-select-option>
            <a-select-option value="SOLUSDT">SOL/USDT</a-select-option>
          </a-select>
          <a-button @click="handleRefresh">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
          <a-button type="primary" @click="handleExport">
            <template #icon><DownloadOutlined /></template>
            Export Report
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- Summary Cards -->
    <a-row :gutter="16" class="summary-section">
      <a-col :span="6">
        <a-card :loading="analyticsStore.tradingLoading">
          <a-statistic
            title="Total Volume"
            :value="analyticsStore.tradingSummary.totalVolume"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#1890ff' }"
          >
            <template #suffix>
              <div class="change-indicator">
                <ArrowUpOutlined
                  v-if="analyticsStore.tradingSummary.volumeChange > 0"
                  style="color: #52c41a"
                />
                <ArrowDownOutlined v-else style="color: #ff4d4f" />
                {{ Math.abs(analyticsStore.tradingSummary.volumeChange) }}%
              </div>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :loading="analyticsStore.tradingLoading">
          <a-statistic
            title="Total Trades"
            :value="analyticsStore.tradingSummary.totalTrades"
            :precision="0"
            :value-style="{ color: '#52c41a' }"
          >
            <template #suffix>
              <div class="change-indicator">
                <ArrowUpOutlined
                  v-if="analyticsStore.tradingSummary.tradesChange > 0"
                  style="color: #52c41a"
                />
                <ArrowDownOutlined v-else style="color: #ff4d4f" />
                {{ Math.abs(analyticsStore.tradingSummary.tradesChange) }}%
              </div>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :loading="analyticsStore.tradingLoading">
          <a-statistic
            title="Active Traders"
            :value="analyticsStore.tradingSummary.activeUsers"
            :precision="0"
            :value-style="{ color: '#722ed1' }"
          >
            <template #suffix>
              <div class="change-indicator">
                <ArrowUpOutlined
                  v-if="analyticsStore.tradingSummary.activeUsersChange > 0"
                  style="color: #52c41a"
                />
                <ArrowDownOutlined v-else style="color: #ff4d4f" />
                {{ Math.abs(analyticsStore.tradingSummary.activeUsersChange) }}%
              </div>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :loading="analyticsStore.tradingLoading">
          <a-statistic
            title="Avg Trade Size"
            :value="analyticsStore.tradingSummary.avgTradeSize"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#faad14' }"
          >
            <template #suffix>
              <div class="change-indicator">
                <ArrowUpOutlined
                  v-if="analyticsStore.tradingSummary.avgTradeSizeChange > 0"
                  style="color: #52c41a"
                />
                <ArrowDownOutlined v-else style="color: #ff4d4f" />
                {{ Math.abs(analyticsStore.tradingSummary.avgTradeSizeChange) }}%
              </div>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- Trading Volume Chart -->
    <a-row :gutter="16" class="charts-section">
      <a-col :span="16">
        <a-card
          title="Trading Volume Over Time"
          :bordered="false"
          :loading="analyticsStore.tradingLoading"
        >
          <div ref="volumeChartRef" style="height: 400px" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card
          title="Volume by Instrument"
          :bordered="false"
          :loading="analyticsStore.tradingLoading"
        >
          <div ref="instrumentChartRef" style="height: 400px" />
        </a-card>
      </a-col>
    </a-row>

    <!-- Trading Pairs Performance -->
    <a-row :gutter="16" class="performance-section">
      <a-col :span="24">
        <a-card
          title="Trading Pairs Performance (24h)"
          :bordered="false"
          :loading="analyticsStore.tradingLoading"
        >
          <a-table
            :data-source="analyticsStore.tradingPairPerformance"
            :columns="pairColumns"
            :pagination="{ pageSize: 10 }"
            row-key="pair"
            size="middle"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- User Trading Activity -->
    <a-row :gutter="16" class="activity-section">
      <a-col :span="24">
        <a-card
          title="Top Trading Users"
          :bordered="false"
          :loading="analyticsStore.tradingLoading"
        >
          <a-table
            :data-source="analyticsStore.userTradingActivity"
            :columns="activityColumns"
            :pagination="{ pageSize: 10 }"
            row-key="userId"
            size="middle"
          />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  ReloadOutlined,
  DownloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import dayjs, { Dayjs } from 'dayjs'
import { useAnalyticsStore } from '@/stores/analytics'

// Store
const analyticsStore = useAnalyticsStore()

// State
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(30, 'days'), dayjs()])
const selectedInstrument = ref('')
const volumeChartRef = ref<HTMLDivElement>()
const instrumentChartRef = ref<HTMLDivElement>()
let volumeChart: echarts.ECharts | null = null
let instrumentChart: echarts.ECharts | null = null

// Table Columns
const pairColumns = [
  {
    title: 'Trading Pair',
    dataIndex: 'pair',
    key: 'pair',
    width: 150,
  },
  {
    title: '24h Volume',
    dataIndex: 'volume24h',
    key: 'volume24h',
    width: 150,
    customRender: ({ value }: { value: number }) => `$${value.toLocaleString()}`,
  },
  {
    title: '24h Trades',
    dataIndex: 'trades24h',
    key: 'trades24h',
    width: 120,
    customRender: ({ value }: { value: number }) => value.toLocaleString(),
  },
  {
    title: 'Price Change',
    dataIndex: 'priceChange',
    key: 'priceChange',
    width: 120,
    customRender: ({ value }: { value: number }) => {
      const color = value >= 0 ? '#52c41a' : '#ff4d4f'
      return `<span style="color: ${color}">${value >= 0 ? '+' : ''}${value}%</span>`
    },
  },
  {
    title: '24h High',
    dataIndex: 'high24h',
    key: 'high24h',
    width: 120,
    customRender: ({ value }: { value: number }) => `$${value.toLocaleString()}`,
  },
  {
    title: '24h Low',
    dataIndex: 'low24h',
    key: 'low24h',
    width: 120,
    customRender: ({ value }: { value: number }) => `$${value.toLocaleString()}`,
  },
]

const activityColumns = [
  {
    title: 'User ID',
    dataIndex: 'userId',
    key: 'userId',
    width: 120,
  },
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
    width: 150,
  },
  {
    title: 'Total Volume',
    dataIndex: 'totalVolume',
    key: 'totalVolume',
    width: 150,
    sorter: (a: any, b: any) => a.totalVolume - b.totalVolume,
    customRender: ({ value }: { value: number }) => `$${value.toLocaleString()}`,
  },
  {
    title: 'Total Trades',
    dataIndex: 'totalTrades',
    key: 'totalTrades',
    width: 120,
    sorter: (a: any, b: any) => a.totalTrades - b.totalTrades,
    customRender: ({ value }: { value: number }) => value.toLocaleString(),
  },
  {
    title: 'Avg Trade Size',
    dataIndex: 'avgTradeSize',
    key: 'avgTradeSize',
    width: 150,
    sorter: (a: any, b: any) => a.avgTradeSize - b.avgTradeSize,
    customRender: ({ value }: { value: number }) =>
      `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  {
    title: 'Last Trade',
    dataIndex: 'lastTradeTime',
    key: 'lastTradeTime',
    width: 180,
    customRender: ({ value }: { value: string }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
  },
]

// Methods
async function loadData() {
  const params = {
    startDate: dateRange.value[0].format('YYYY-MM-DD'),
    endDate: dateRange.value[1].format('YYYY-MM-DD'),
    instrument: selectedInstrument.value || undefined,
  }
  await analyticsStore.fetchTradingAnalytics(params)
}

function handleRefresh() {
  loadData()
}

function handleExport() {
  console.log('Exporting trading analytics report')
  // Implement export logic
}

function handleDateChange() {
  loadData()
}

function handleInstrumentChange() {
  loadData()
}

function initCharts() {
  // Volume Chart
  if (volumeChartRef.value) {
    volumeChart = echarts.init(volumeChartRef.value)
    updateVolumeChart()
  }

  // Instrument Chart
  if (instrumentChartRef.value) {
    instrumentChart = echarts.init(instrumentChartRef.value)
    updateInstrumentChart()
  }
}

function updateVolumeChart() {
  if (!volumeChart || !analyticsStore.tradingVolumeData.length) return

  const dates = analyticsStore.tradingVolumeData.map((item) => item.date)
  const volumes = analyticsStore.tradingVolumeData.map((item) => item.volume)
  const trades = analyticsStore.tradingVolumeData.map((item) => item.trades)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['Volume', 'Trades'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
    },
    yAxis: [
      {
        type: 'value',
        name: 'Volume ($)',
        position: 'left',
        axisLabel: {
          formatter: (value: number) => `$${(value / 1000000).toFixed(1)}M`,
        },
      },
      {
        type: 'value',
        name: 'Trades',
        position: 'right',
      },
    ],
    series: [
      {
        name: 'Volume',
        type: 'line',
        smooth: true,
        data: volumes,
        yAxisIndex: 0,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
          ]),
        },
        lineStyle: {
          color: '#1890ff',
          width: 2,
        },
        itemStyle: {
          color: '#1890ff',
        },
      },
      {
        name: 'Trades',
        type: 'line',
        smooth: true,
        data: trades,
        yAxisIndex: 1,
        lineStyle: {
          color: '#52c41a',
          width: 2,
        },
        itemStyle: {
          color: '#52c41a',
        },
      },
    ],
  }

  volumeChart.setOption(option)
}

function updateInstrumentChart() {
  if (!instrumentChart || !analyticsStore.volumeByInstrument.length) return

  const data = analyticsStore.volumeByInstrument.map((item) => ({
    value: item.volume,
    name: item.instrument,
  }))

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ${c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Volume',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: '{b}: {d}%',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: true,
        },
        data,
      },
    ],
  }

  instrumentChart.setOption(option)
}

function resizeCharts() {
  if (volumeChart) volumeChart.resize()
  if (instrumentChart) instrumentChart.resize()
}

// Watch for data changes
watch(
  () => analyticsStore.tradingVolumeData,
  () => {
    updateVolumeChart()
  }
)

watch(
  () => analyticsStore.volumeByInstrument,
  () => {
    updateInstrumentChart()
  }
)

// Lifecycle
onMounted(async () => {
  await loadData()
  initCharts()
  window.addEventListener('resize', resizeCharts)
})

onUnmounted(() => {
  if (volumeChart) volumeChart.dispose()
  if (instrumentChart) instrumentChart.dispose()
  window.removeEventListener('resize', resizeCharts)
})
</script>

<style scoped>
.trading-analytics {
  padding: 24px;
}

.summary-section {
  margin-bottom: 24px;
}

.charts-section {
  margin-bottom: 24px;
}

.performance-section {
  margin-bottom: 24px;
}

.activity-section {
  margin-bottom: 24px;
}

.change-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}
</style>
