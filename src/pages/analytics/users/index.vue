<template>
  <div class="user-analytics">
    <a-page-header
      title="User Analytics"
      sub-title="User registration, retention, and engagement metrics"
    >
      <template #extra>
        <a-space>
          <a-range-picker
            v-model:value="dateRange"
            format="YYYY-MM-DD"
            @change="handleDateChange"
          />
          <a-select
            v-model:value="selectedUserType"
            placeholder="All User Types"
            style="width: 180px"
            @change="handleUserTypeChange"
          >
            <a-select-option value="">All User Types</a-select-option>
            <a-select-option value="new">New Users</a-select-option>
            <a-select-option value="active">Active Users</a-select-option>
            <a-select-option value="dormant">Dormant Users</a-select-option>
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
        <a-card :loading="analyticsStore.usersLoading">
          <a-statistic
            title="Total Users"
            :value="analyticsStore.usersSummary.totalUsers"
            :precision="0"
            :value-style="{ color: '#1890ff' }"
          >
            <template #suffix>
              <div class="change-indicator">
                <ArrowUpOutlined
                  v-if="analyticsStore.usersSummary.totalUsersChange > 0"
                  style="color: #52c41a"
                />
                <ArrowDownOutlined v-else style="color: #ff4d4f" />
                {{ Math.abs(analyticsStore.usersSummary.totalUsersChange) }}%
              </div>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :loading="analyticsStore.usersLoading">
          <a-statistic
            title="New Users"
            :value="analyticsStore.usersSummary.newUsers"
            :precision="0"
            :value-style="{ color: '#52c41a' }"
          >
            <template #suffix>
              <div class="change-indicator">
                <ArrowUpOutlined
                  v-if="analyticsStore.usersSummary.newUsersChange > 0"
                  style="color: #52c41a"
                />
                <ArrowDownOutlined v-else style="color: #ff4d4f" />
                {{ Math.abs(analyticsStore.usersSummary.newUsersChange) }}%
              </div>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :loading="analyticsStore.usersLoading">
          <a-statistic
            title="Active Users"
            :value="analyticsStore.usersSummary.activeUsers"
            :precision="0"
            :value-style="{ color: '#722ed1' }"
          >
            <template #suffix>
              <div class="change-indicator">
                <ArrowUpOutlined
                  v-if="analyticsStore.usersSummary.activeUsersChange > 0"
                  style="color: #52c41a"
                />
                <ArrowDownOutlined v-else style="color: #ff4d4f" />
                {{ Math.abs(analyticsStore.usersSummary.activeUsersChange) }}%
              </div>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :loading="analyticsStore.usersLoading">
          <a-statistic
            title="Retention Rate"
            :value="analyticsStore.usersSummary.retentionRate"
            :precision="1"
            suffix="%"
            :value-style="{ color: '#faad14' }"
          >
            <template #suffix>
              <div class="change-indicator">
                <ArrowUpOutlined
                  v-if="analyticsStore.usersSummary.retentionChange > 0"
                  style="color: #52c41a"
                />
                <ArrowDownOutlined v-else style="color: #ff4d4f" />
                {{ Math.abs(analyticsStore.usersSummary.retentionChange) }}%
              </div>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- Registration and KYC Charts -->
    <a-row :gutter="16" class="charts-section">
      <a-col :span="12">
        <a-card
          title="User Registration Trend"
          :bordered="false"
          :loading="analyticsStore.usersLoading"
        >
          <div ref="registrationChartRef" style="height: 400px" />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card
          title="KYC Completion Rate"
          :bordered="false"
          :loading="analyticsStore.usersLoading"
        >
          <div ref="kycChartRef" style="height: 400px" />
        </a-card>
      </a-col>
    </a-row>

    <!-- VIP Distribution and Retention -->
    <a-row :gutter="16" class="distribution-section">
      <a-col :span="12">
        <a-card
          title="VIP Level Distribution"
          :bordered="false"
          :loading="analyticsStore.usersLoading"
        >
          <div ref="vipChartRef" style="height: 350px" />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card
          title="User Retention Cohort"
          :bordered="false"
          :loading="analyticsStore.usersLoading"
        >
          <a-table
            :data-source="analyticsStore.retentionMetrics"
            :columns="retentionColumns"
            :pagination="false"
            row-key="cohort"
            size="small"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- VIP Distribution Table -->
    <a-row :gutter="16" class="vip-section">
      <a-col :span="24">
        <a-card title="VIP Level Details" :bordered="false" :loading="analyticsStore.usersLoading">
          <a-table
            :data-source="analyticsStore.vipDistribution"
            :columns="vipColumns"
            :pagination="{ pageSize: 10 }"
            row-key="level"
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
const selectedUserType = ref('')
const registrationChartRef = ref<HTMLDivElement>()
const kycChartRef = ref<HTMLDivElement>()
const vipChartRef = ref<HTMLDivElement>()
let registrationChart: echarts.ECharts | null = null
let kycChart: echarts.ECharts | null = null
let vipChart: echarts.ECharts | null = null

// Table Columns
const retentionColumns = [
  {
    title: 'Cohort',
    dataIndex: 'cohort',
    key: 'cohort',
    width: 150,
  },
  {
    title: 'Day 1',
    dataIndex: 'day1',
    key: 'day1',
    width: 100,
    customRender: ({ value }: { value: number }) => `${value}%`,
  },
  {
    title: 'Day 7',
    dataIndex: 'day7',
    key: 'day7',
    width: 100,
    customRender: ({ value }: { value: number }) => `${value}%`,
  },
  {
    title: 'Day 14',
    dataIndex: 'day14',
    key: 'day14',
    width: 100,
    customRender: ({ value }: { value: number }) => (value > 0 ? `${value}%` : '-'),
  },
  {
    title: 'Day 30',
    dataIndex: 'day30',
    key: 'day30',
    width: 100,
    customRender: ({ value }: { value: number }) => (value > 0 ? `${value}%` : '-'),
  },
]

const vipColumns = [
  {
    title: 'VIP Level',
    dataIndex: 'level',
    key: 'level',
    width: 150,
  },
  {
    title: 'User Count',
    dataIndex: 'count',
    key: 'count',
    width: 150,
    sorter: (a: any, b: any) => a.count - b.count,
    customRender: ({ value }: { value: number }) => value.toLocaleString(),
  },
  {
    title: 'Percentage',
    dataIndex: 'percentage',
    key: 'percentage',
    width: 120,
    sorter: (a: any, b: any) => a.percentage - b.percentage,
    customRender: ({ value }: { value: number }) => `${value.toFixed(1)}%`,
  },
  {
    title: 'Avg Revenue',
    dataIndex: 'avgRevenue',
    key: 'avgRevenue',
    width: 150,
    sorter: (a: any, b: any) => a.avgRevenue - b.avgRevenue,
    customRender: ({ value }: { value: number }) =>
      `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
]

// Methods
async function loadData() {
  const params = {
    startDate: dateRange.value[0].format('YYYY-MM-DD'),
    endDate: dateRange.value[1].format('YYYY-MM-DD'),
    userType: selectedUserType.value || undefined,
  }
  await analyticsStore.fetchUserAnalytics(params)
}

function handleRefresh() {
  loadData()
}

function handleExport() {
  console.log('Exporting user analytics report')
  // Implement export logic
}

function handleDateChange() {
  loadData()
}

function handleUserTypeChange() {
  loadData()
}

function initCharts() {
  // Registration Chart
  if (registrationChartRef.value) {
    registrationChart = echarts.init(registrationChartRef.value)
    updateRegistrationChart()
  }

  // KYC Chart
  if (kycChartRef.value) {
    kycChart = echarts.init(kycChartRef.value)
    updateKycChart()
  }

  // VIP Chart
  if (vipChartRef.value) {
    vipChart = echarts.init(vipChartRef.value)
    updateVipChart()
  }
}

function updateRegistrationChart() {
  if (!registrationChart || !analyticsStore.registrationTrend.length) return

  const dates = analyticsStore.registrationTrend.map((item) => item.date)
  const counts = analyticsStore.registrationTrend.map((item) => item.count)
  const cumulative = analyticsStore.registrationTrend.map((item) => item.cumulative)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['New Registrations', 'Total Users'],
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
        name: 'New Users',
        position: 'left',
      },
      {
        type: 'value',
        name: 'Total Users',
        position: 'right',
      },
    ],
    series: [
      {
        name: 'New Registrations',
        type: 'bar',
        data: counts,
        yAxisIndex: 0,
        itemStyle: {
          color: '#1890ff',
        },
      },
      {
        name: 'Total Users',
        type: 'line',
        smooth: true,
        data: cumulative,
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

  registrationChart.setOption(option)
}

function updateKycChart() {
  if (!kycChart || !analyticsStore.kycCompletionRate.length) return

  const dates = analyticsStore.kycCompletionRate.map((item) => item.date)
  const submitted = analyticsStore.kycCompletionRate.map((item) => item.submitted)
  const approved = analyticsStore.kycCompletionRate.map((item) => item.approved)
  const rejected = analyticsStore.kycCompletionRate.map((item) => item.rejected)
  const pending = analyticsStore.kycCompletionRate.map((item) => item.pending)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['Submitted', 'Approved', 'Rejected', 'Pending'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dates,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Submitted',
        type: 'bar',
        stack: 'total',
        data: submitted,
        itemStyle: {
          color: '#1890ff',
        },
      },
      {
        name: 'Approved',
        type: 'bar',
        stack: 'total',
        data: approved,
        itemStyle: {
          color: '#52c41a',
        },
      },
      {
        name: 'Rejected',
        type: 'bar',
        stack: 'total',
        data: rejected,
        itemStyle: {
          color: '#ff4d4f',
        },
      },
      {
        name: 'Pending',
        type: 'bar',
        stack: 'total',
        data: pending,
        itemStyle: {
          color: '#faad14',
        },
      },
    ],
  }

  kycChart.setOption(option)
}

function updateVipChart() {
  if (!vipChart || !analyticsStore.vipDistribution.length) return

  const data = analyticsStore.vipDistribution.map((item) => ({
    value: item.count,
    name: item.level,
  }))

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'VIP Level',
        type: 'pie',
        radius: '65%',
        center: ['50%', '50%'],
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: {
          formatter: '{b}: {d}%',
        },
      },
    ],
  }

  vipChart.setOption(option)
}

function resizeCharts() {
  if (registrationChart) registrationChart.resize()
  if (kycChart) kycChart.resize()
  if (vipChart) vipChart.resize()
}

// Watch for data changes
watch(
  () => analyticsStore.registrationTrend,
  () => {
    updateRegistrationChart()
  }
)

watch(
  () => analyticsStore.kycCompletionRate,
  () => {
    updateKycChart()
  }
)

watch(
  () => analyticsStore.vipDistribution,
  () => {
    updateVipChart()
  }
)

// Lifecycle
onMounted(async () => {
  await loadData()
  initCharts()
  window.addEventListener('resize', resizeCharts)
})

onUnmounted(() => {
  if (registrationChart) registrationChart.dispose()
  if (kycChart) kycChart.dispose()
  if (vipChart) vipChart.dispose()
  window.removeEventListener('resize', resizeCharts)
})
</script>

<style scoped>
.user-analytics {
  padding: 24px;
}

.summary-section {
  margin-bottom: 24px;
}

.charts-section {
  margin-bottom: 24px;
}

.distribution-section {
  margin-bottom: 24px;
}

.vip-section {
  margin-bottom: 24px;
}

.change-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}
</style>
