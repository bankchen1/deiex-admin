<template>
  <div class="retention-reports-page">
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

        <a-form-item label="Cohort Type">
          <a-select
            v-model:value="filters.cohortType"
            style="width: 150px"
            @change="handleFilterChange"
          >
            <a-select-option value="daily">Daily</a-select-option>
            <a-select-option value="weekly">Weekly</a-select-option>
            <a-select-option value="monthly">Monthly</a-select-option>
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
            title="DAU (Daily Active Users)"
            :value="summary?.dau || 0"
            :loading="loading"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="WAU (Weekly Active Users)"
            :value="summary?.wau || 0"
            :loading="loading"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="MAU (Monthly Active Users)"
            :value="summary?.mau || 0"
            :loading="loading"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic title="New Users" :value="summary?.newUsers || 0" :loading="loading" />
        </a-card>
      </a-col>
    </a-row>

    <!-- Metrics Cards -->
    <a-row :gutter="16" class="metrics-cards">
      <a-col :span="8">
        <a-card :bordered="false" size="small">
          <a-statistic title="Active Users" :value="summary?.activeUsers || 0" :loading="loading" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :bordered="false" size="small">
          <a-statistic
            title="Retention Rate"
            :value="summary?.retentionRate || 0"
            :precision="2"
            suffix="%"
            :loading="loading"
          />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :bordered="false" size="small">
          <a-statistic
            title="Conversion Rate"
            :value="summary?.conversionRate || 0"
            :precision="2"
            suffix="%"
            :loading="loading"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- Charts -->
    <a-row :gutter="16" class="charts-section">
      <a-col :span="12">
        <a-card title="DAU/WAU/MAU Trend" :bordered="false" :loading="loading">
          <div ref="dauChartRef" style="height: 350px"></div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="Conversion Funnel" :bordered="false" :loading="loading">
          <FunnelChart :data="funnelChartData" />
        </a-card>
      </a-col>
    </a-row>

    <!-- Cohort Analysis -->
    <a-card title="Cohort Retention Analysis" :bordered="false" class="cohort-card">
      <CohortChart :data="cohortChartData" :days="cohortDays" :height="500" />
    </a-card>

    <!-- Tables -->
    <a-card title="Retention Data" :bordered="false" class="table-card">
      <RetentionTable
        :data-source="retentionData"
        :loading="loading"
        @export="handleExportRetention"
      />
    </a-card>

    <a-card title="Conversion Funnel Details" :bordered="false" class="table-card">
      <FunnelTable :data-source="funnelData" :loading="loading" @export="handleExportFunnel" />
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
import RetentionTable from '@/tables/reports/RetentionTable.vue'
import FunnelTable from '@/tables/reports/FunnelTable.vue'
import FunnelChart from '@/widgets/charts/FunnelChart.vue'
import CohortChart from '@/widgets/charts/CohortChart.vue'
import { formatNumber } from '@/utils/format'
import type { RetentionReportParams } from '@/types/api'

const reportsStore = useReportsStore()

// State
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(30, 'days'), dayjs()])

const filters = ref<Omit<RetentionReportParams, 'startDate' | 'endDate'>>({
  cohortType: 'daily',
  region: undefined,
})

const dauChartRef = ref<HTMLElement>()
let dauChart: echarts.ECharts | null = null

// Computed
const loading = computed(() => reportsStore.loading)
const summary = computed(() => reportsStore.retentionReports?.summary)
const charts = computed(() => reportsStore.retentionReports?.charts)
const retentionData = computed(() => reportsStore.retentionData)
const funnelData = computed(() => reportsStore.funnelData)

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

const funnelChartData = computed(() => {
  if (!charts.value?.retentionFunnel) return []
  return charts.value.retentionFunnel.map((item) => ({
    name: item.stage,
    value: item.users,
  }))
})

const cohortChartData = computed(() => {
  if (!retentionData.value || retentionData.value.length === 0) return []

  return retentionData.value.map((cohort) => ({
    cohortDate: cohort.cohortDate,
    retentionRates: [
      cohort.day0 / cohort.cohortSize,
      cohort.day1 / cohort.cohortSize,
      cohort.day3 / cohort.cohortSize,
      cohort.day7 / cohort.cohortSize,
      cohort.day14 / cohort.cohortSize,
      cohort.day30 / cohort.cohortSize,
      cohort.day60 / cohort.cohortSize,
      cohort.day90 / cohort.cohortSize,
    ],
  }))
})

const cohortDays = ['Day 0', 'Day 1', 'Day 3', 'Day 7', 'Day 14', 'Day 30', 'Day 60', 'Day 90']

// Methods
function getQueryParams(): RetentionReportParams {
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
      reportsStore.fetchRetentionReports(params),
      reportsStore.fetchRetentionData(params),
      reportsStore.fetchFunnelData(params),
    ])
    await nextTick()
    renderCharts()
  } catch (error) {
    message.error('Failed to fetch retention reports')
  }
}

function handleDateChange() {
  fetchData()
}

function handleFilterChange() {
  fetchData()
}

function handleReset() {
  dateRange.value = [dayjs().subtract(30, 'days'), dayjs()]
  filters.value = {
    cohortType: 'daily',
    region: undefined,
  }
  fetchData()
}

async function handleExport() {
  try {
    const params = getQueryParams()
    await reportsStore.exportRetentionReport(params)
    message.success('Report exported successfully')
  } catch (error) {
    message.error('Failed to export report')
  }
}

function handleExportRetention() {
  const csv = convertToCSV(retentionData.value)
  downloadCSV(csv, 'retention-data.csv')
}

function handleExportFunnel() {
  const csv = convertToCSV(funnelData.value)
  downloadCSV(csv, 'funnel-data.csv')
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

  // DAU/WAU/MAU Trend Chart
  if (dauChartRef.value) {
    if (!dauChart) {
      dauChart = echarts.init(dauChartRef.value)
    }

    const dauOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        data: ['DAU', 'WAU', 'MAU'],
      },
      xAxis: {
        type: 'category',
        data: charts.value.dauTrend.map((item) => item.date),
      },
      yAxis: {
        type: 'value',
        name: 'Users',
        axisLabel: {
          formatter: (value: number) => formatNumber(value),
        },
      },
      series: [
        {
          name: 'DAU',
          type: 'line',
          data: charts.value.dauTrend.map((item) => item.dau),
          itemStyle: { color: '#1890ff' },
          smooth: true,
        },
        {
          name: 'WAU',
          type: 'line',
          data: charts.value.dauTrend.map((item) => item.wau),
          itemStyle: { color: '#52c41a' },
          smooth: true,
        },
        {
          name: 'MAU',
          type: 'line',
          data: charts.value.dauTrend.map((item) => item.mau),
          itemStyle: { color: '#faad14' },
          smooth: true,
        },
      ],
    }

    dauChart.setOption(dauOption)
  }
}

// Lifecycle
onMounted(() => {
  fetchData()

  // Handle window resize
  window.addEventListener('resize', () => {
    dauChart?.resize()
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
.retention-reports-page {
  padding: 24px;
}

.filter-card {
  margin-bottom: 16px;
}

.summary-cards {
  margin-bottom: 16px;
}

.metrics-cards {
  margin-bottom: 16px;
}

.charts-section {
  margin-bottom: 16px;
}

.cohort-card {
  margin-bottom: 16px;
}

.table-card {
  margin-bottom: 16px;
}
</style>
