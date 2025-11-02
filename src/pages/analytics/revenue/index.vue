<template>
  <div class="revenue-analytics">
    <a-page-header
      title="Revenue Analytics"
      sub-title="Fee revenue analysis and financial performance metrics"
    >
      <template #extra>
        <a-space>
          <a-range-picker
            v-model:value="dateRange"
            format="YYYY-MM-DD"
            @change="handleDateChange"
          />
          <a-select
            v-model:value="selectedRevenueType"
            placeholder="All Revenue Types"
            style="width: 180px"
            @change="handleRevenueTypeChange"
          >
            <a-select-option value="">All Revenue Types</a-select-option>
            <a-select-option value="trading">Trading Fees</a-select-option>
            <a-select-option value="withdrawal">Withdrawal Fees</a-select-option>
            <a-select-option value="other">Other Fees</a-select-option>
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
        <a-card :loading="analyticsStore.revenueLoading">
          <a-statistic
            title="Total Revenue"
            :value="analyticsStore.revenueSummary.totalRevenue"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#1890ff' }"
          >
            <template #suffix>
              <div class="change-indicator">
                <ArrowUpOutlined
                  v-if="analyticsStore.revenueSummary.revenueChange > 0"
                  style="color: #52c41a"
                />
                <ArrowDownOutlined v-else style="color: #ff4d4f" />
                {{ Math.abs(analyticsStore.revenueSummary.revenueChange) }}%
              </div>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :loading="analyticsStore.revenueLoading">
          <a-statistic
            title="Trading Fees"
            :value="analyticsStore.revenueSummary.tradingFees"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#52c41a' }"
          >
            <template #suffix>
              <div class="change-indicator">
                <ArrowUpOutlined
                  v-if="analyticsStore.revenueSummary.tradingFeesChange > 0"
                  style="color: #52c41a"
                />
                <ArrowDownOutlined v-else style="color: #ff4d4f" />
                {{ Math.abs(analyticsStore.revenueSummary.tradingFeesChange) }}%
              </div>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :loading="analyticsStore.revenueLoading">
          <a-statistic
            title="Withdrawal Fees"
            :value="analyticsStore.revenueSummary.withdrawalFees"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#722ed1' }"
          >
            <template #suffix>
              <div class="change-indicator">
                <ArrowUpOutlined
                  v-if="analyticsStore.revenueSummary.withdrawalFeesChange > 0"
                  style="color: #52c41a"
                />
                <ArrowDownOutlined v-else style="color: #ff4d4f" />
                {{ Math.abs(analyticsStore.revenueSummary.withdrawalFeesChange) }}%
              </div>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :loading="analyticsStore.revenueLoading">
          <a-statistic
            title="Other Fees"
            :value="analyticsStore.revenueSummary.otherFees"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#faad14' }"
          >
            <template #suffix>
              <div class="change-indicator">
                <ArrowUpOutlined
                  v-if="analyticsStore.revenueSummary.otherFeesChange > 0"
                  style="color: #52c41a"
                />
                <ArrowDownOutlined v-else style="color: #ff4d4f" />
                {{ Math.abs(analyticsStore.revenueSummary.otherFeesChange) }}%
              </div>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- Revenue Trend Chart -->
    <a-row :gutter="16" class="charts-section">
      <a-col :span="16">
        <a-card
          title="Revenue Trend Over Time"
          :bordered="false"
          :loading="analyticsStore.revenueLoading"
        >
          <div ref="revenueTrendChartRef" style="height: 400px" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="Revenue by Type" :bordered="false" :loading="analyticsStore.revenueLoading">
          <div ref="revenueTypeChartRef" style="height: 400px" />
        </a-card>
      </a-col>
    </a-row>

    <!-- Revenue by Instrument -->
    <a-row :gutter="16" class="instrument-section">
      <a-col :span="12">
        <a-card
          title="Revenue by Instrument"
          :bordered="false"
          :loading="analyticsStore.revenueLoading"
        >
          <div ref="instrumentRevenueChartRef" style="height: 350px" />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card
          title="Fee Revenue Details"
          :bordered="false"
          :loading="analyticsStore.revenueLoading"
        >
          <a-table
            :data-source="analyticsStore.feeRevenueByType"
            :columns="feeTypeColumns"
            :pagination="false"
            row-key="type"
            size="small"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- Revenue by Instrument Table -->
    <a-row :gutter="16" class="revenue-details-section">
      <a-col :span="24">
        <a-card
          title="Instrument Revenue Breakdown"
          :bordered="false"
          :loading="analyticsStore.revenueLoading"
        >
          <a-table
            :data-source="analyticsStore.revenueByInstrument"
            :columns="instrumentColumns"
            :pagination="{ pageSize: 10 }"
            row-key="instrument"
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
const selectedRevenueType = ref('')
const revenueTrendChartRef = ref<HTMLDivElement>()
const revenueTypeChartRef = ref<HTMLDivElement>()
const instrumentRevenueChartRef = ref<HTMLDivElement>()
let revenueTrendChart: echarts.ECharts | null = null
let revenueTypeChart: echarts.ECharts | null = null
let instrumentRevenueChart: echarts.ECharts | null = null

// Table Columns
const feeTypeColumns = [
  {
    title: 'Fee Type',
    dataIndex: 'type',
    key: 'type',
    width: 200,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    width: 150,
    sorter: (a: any, b: any) => a.amount - b.amount,
    customRender: ({ value }: { value: number }) =>
      `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  {
    title: 'Count',
    dataIndex: 'count',
    key: 'count',
    width: 100,
    sorter: (a: any, b: any) => a.count - b.count,
    customRender: ({ value }: { value: number }) => value.toLocaleString(),
  },
  {
    title: 'Percentage',
    dataIndex: 'percentage',
    key: 'percentage',
    width: 100,
    sorter: (a: any, b: any) => a.percentage - b.percentage,
    customRender: ({ value }: { value: number }) => `${value.toFixed(1)}%`,
  },
]

const instrumentColumns = [
  {
    title: 'Instrument',
    dataIndex: 'instrument',
    key: 'instrument',
    width: 180,
  },
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    width: 120,
  },
  {
    title: 'Revenue',
    dataIndex: 'revenue',
    key: 'revenue',
    width: 180,
    sorter: (a: any, b: any) => a.revenue - b.revenue,
    customRender: ({ value }: { value: number }) =>
      `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  {
    title: 'Percentage',
    dataIndex: 'percentage',
    key: 'percentage',
    width: 120,
    sorter: (a: any, b: any) => a.percentage - b.percentage,
    customRender: ({ value }: { value: number }) => `${value.toFixed(1)}%`,
  },
]

// Methods
async function loadData() {
  const params = {
    startDate: dateRange.value[0].format('YYYY-MM-DD'),
    endDate: dateRange.value[1].format('YYYY-MM-DD'),
    revenueType: selectedRevenueType.value || undefined,
  }
  await analyticsStore.fetchRevenueAnalytics(params)
}

function handleRefresh() {
  loadData()
}

function handleExport() {
  console.log('Exporting revenue analytics report')
  // Implement export logic
}

function handleDateChange() {
  loadData()
}

function handleRevenueTypeChange() {
  loadData()
}

function initCharts() {
  // Revenue Trend Chart
  if (revenueTrendChartRef.value) {
    revenueTrendChart = echarts.init(revenueTrendChartRef.value)
    updateRevenueTrendChart()
  }

  // Revenue Type Chart
  if (revenueTypeChartRef.value) {
    revenueTypeChart = echarts.init(revenueTypeChartRef.value)
    updateRevenueTypeChart()
  }

  // Instrument Revenue Chart
  if (instrumentRevenueChartRef.value) {
    instrumentRevenueChart = echarts.init(instrumentRevenueChartRef.value)
    updateInstrumentRevenueChart()
  }
}

function updateRevenueTrendChart() {
  if (!revenueTrendChart || !analyticsStore.revenueTrend.length) return

  const dates = analyticsStore.revenueTrend.map((item) => item.date)
  const trading = analyticsStore.revenueTrend.map((item) => item.trading)
  const withdrawal = analyticsStore.revenueTrend.map((item) => item.withdrawal)
  const other = analyticsStore.revenueTrend.map((item) => item.other)
  const total = analyticsStore.revenueTrend.map((item) => item.total)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['Trading Fees', 'Withdrawal Fees', 'Other Fees', 'Total Revenue'],
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
    yAxis: {
      type: 'value',
      name: 'Revenue ($)',
      axisLabel: {
        formatter: (value: number) => `$${(value / 1000).toFixed(0)}K`,
      },
    },
    series: [
      {
        name: 'Trading Fees',
        type: 'line',
        smooth: true,
        stack: 'Total',
        data: trading,
        areaStyle: {},
        itemStyle: {
          color: '#1890ff',
        },
      },
      {
        name: 'Withdrawal Fees',
        type: 'line',
        smooth: true,
        stack: 'Total',
        data: withdrawal,
        areaStyle: {},
        itemStyle: {
          color: '#52c41a',
        },
      },
      {
        name: 'Other Fees',
        type: 'line',
        smooth: true,
        stack: 'Total',
        data: other,
        areaStyle: {},
        itemStyle: {
          color: '#faad14',
        },
      },
      {
        name: 'Total Revenue',
        type: 'line',
        smooth: true,
        data: total,
        lineStyle: {
          color: '#722ed1',
          width: 3,
        },
        itemStyle: {
          color: '#722ed1',
        },
      },
    ],
  }

  revenueTrendChart.setOption(option)
}

function updateRevenueTypeChart() {
  if (!revenueTypeChart || !analyticsStore.feeRevenueByType.length) return

  const data = analyticsStore.feeRevenueByType.map((item) => ({
    value: item.amount,
    name: item.type,
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
        name: 'Revenue',
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

  revenueTypeChart.setOption(option)
}

function updateInstrumentRevenueChart() {
  if (!instrumentRevenueChart || !analyticsStore.revenueByInstrument.length) return

  const instruments = analyticsStore.revenueByInstrument.map((item) => item.instrument)
  const revenues = analyticsStore.revenueByInstrument.map((item) => item.revenue)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        const param = params[0]
        return `${param.name}<br/>Revenue: $${param.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: instruments,
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Revenue ($)',
      axisLabel: {
        formatter: (value: number) => `$${(value / 1000).toFixed(0)}K`,
      },
    },
    series: [
      {
        name: 'Revenue',
        type: 'bar',
        data: revenues,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#1890ff' },
            { offset: 1, color: '#096dd9' },
          ]),
        },
        barWidth: '60%',
      },
    ],
  }

  instrumentRevenueChart.setOption(option)
}

function resizeCharts() {
  if (revenueTrendChart) revenueTrendChart.resize()
  if (revenueTypeChart) revenueTypeChart.resize()
  if (instrumentRevenueChart) instrumentRevenueChart.resize()
}

// Watch for data changes
watch(
  () => analyticsStore.revenueTrend,
  () => {
    updateRevenueTrendChart()
  }
)

watch(
  () => analyticsStore.feeRevenueByType,
  () => {
    updateRevenueTypeChart()
  }
)

watch(
  () => analyticsStore.revenueByInstrument,
  () => {
    updateInstrumentRevenueChart()
  }
)

// Lifecycle
onMounted(async () => {
  await loadData()
  initCharts()
  window.addEventListener('resize', resizeCharts)
})

onUnmounted(() => {
  if (revenueTrendChart) revenueTrendChart.dispose()
  if (revenueTypeChart) revenueTypeChart.dispose()
  if (instrumentRevenueChart) instrumentRevenueChart.dispose()
  window.removeEventListener('resize', resizeCharts)
})
</script>

<style scoped>
.revenue-analytics {
  padding: 24px;
}

.summary-section {
  margin-bottom: 24px;
}

.charts-section {
  margin-bottom: 24px;
}

.instrument-section {
  margin-bottom: 24px;
}

.revenue-details-section {
  margin-bottom: 24px;
}

.change-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}
</style>
