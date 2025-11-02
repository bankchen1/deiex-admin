<template>
  <div class="user-behavior-analytics">
    <a-page-header
      title="User Behavior Analytics"
      sub-title="Analyze user engagement and behavior patterns"
    >
      <template #extra>
        <a-space>
          <a-range-picker
            v-model:value="dateRange"
            format="YYYY-MM-DD"
            @change="handleDateChange"
          />
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
        <a-card>
          <a-statistic
            title="Active Users"
            :value="summary.activeUsers"
            :precision="0"
            :value-style="{ color: '#1890ff' }"
          >
            <template #suffix>
              <ArrowUpOutlined v-if="summary.activeUsersChange > 0" style="color: #52c41a" />
              <ArrowDownOutlined v-else style="color: #ff4d4f" />
              {{ Math.abs(summary.activeUsersChange) }}%
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Session Duration"
            :value="summary.avgSessionDuration"
            :precision="1"
            suffix="min"
            :value-style="{ color: '#52c41a' }"
          >
            <template #suffix>
              <ArrowUpOutlined v-if="summary.sessionDurationChange > 0" style="color: #52c41a" />
              <ArrowDownOutlined v-else style="color: #ff4d4f" />
              {{ Math.abs(summary.sessionDurationChange) }}%
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Page Views"
            :value="summary.pageViews"
            :precision="0"
            :value-style="{ color: '#722ed1' }"
          >
            <template #suffix>
              <ArrowUpOutlined v-if="summary.pageViewsChange > 0" style="color: #52c41a" />
              <ArrowDownOutlined v-else style="color: #ff4d4f" />
              {{ Math.abs(summary.pageViewsChange) }}%
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Conversion Rate"
            :value="summary.conversionRate"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#faad14' }"
          >
            <template #suffix>
              <ArrowUpOutlined v-if="summary.conversionChange > 0" style="color: #52c41a" />
              <ArrowDownOutlined v-else style="color: #ff4d4f" />
              {{ Math.abs(summary.conversionChange) }}%
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- Charts Section -->
    <a-row :gutter="16" class="charts-section">
      <a-col :span="16">
        <a-card title="User Activity Over Time" :bordered="false">
          <div ref="activityChartRef" style="height: 400px" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="User Engagement" :bordered="false">
          <div ref="engagementChartRef" style="height: 400px" />
        </a-card>
      </a-col>
    </a-row>

    <!-- User Segments -->
    <a-row :gutter="16" class="segments-section">
      <a-col :span="24">
        <a-card title="User Segments" :bordered="false">
          <a-tabs v-model:active-key="activeTab">
            <a-tab-pane key="retention" tab="User Retention">
              <div ref="retentionChartRef" style="height: 300px" />
            </a-tab-pane>
            <a-tab-pane key="flow" tab="User Flow">
              <div ref="flowChartRef" style="height: 300px" />
            </a-tab-pane>
            <a-tab-pane key="geography" tab="Geographic Distribution">
              <a-table
                :data-source="geographicData"
                :columns="geographicColumns"
                :pagination="{ pageSize: 10 }"
                row-key="country"
              />
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>

    <!-- Top Pages and Actions -->
    <a-row :gutter="16" class="behavior-section">
      <a-col :span="12">
        <a-card title="Top Pages" :bordered="false">
          <a-table
            :data-source="topPages"
            :columns="topPagesColumns"
            :pagination="{ pageSize: 10 }"
            size="small"
            row-key="path"
          />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="Top Actions" :bordered="false">
          <a-table
            :data-source="topActions"
            :columns="topActionsColumns"
            :pagination="{ pageSize: 10 }"
            size="small"
            row-key="action"
          />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import {
  ReloadOutlined,
  DownloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import dayjs, { Dayjs } from 'dayjs'

// Types
interface UserBehaviorSummary {
  activeUsers: number
  activeUsersChange: number
  avgSessionDuration: number
  sessionDurationChange: number
  pageViews: number
  pageViewsChange: number
  conversionRate: number
  conversionChange: number
}

interface GeographicData {
  country: string
  users: number
  percentage: number
}

interface PageData {
  path: string
  views: number
  bounceRate: number
}

interface ActionData {
  action: string
  count: number
  successRate: number
}

// State
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(7, 'days'), dayjs()])
const activeTab = ref('retention')
const activityChartRef = ref<HTMLDivElement>()
const engagementChartRef = ref<HTMLDivElement>()
const retentionChartRef = ref<HTMLDivElement>()
const flowChartRef = ref<HTMLDivElement>()
let activityChart: echarts.ECharts | null = null
let engagementChart: echarts.ECharts | null = null
let retentionChart: echarts.ECharts | null = null
let flowChart: echarts.ECharts | null = null

// Summary data
const summary = reactive<UserBehaviorSummary>({
  activeUsers: 12543,
  activeUsersChange: 5.2,
  avgSessionDuration: 12.8,
  sessionDurationChange: 2.1,
  pageViews: 45678,
  pageViewsChange: 3.5,
  conversionRate: 4.2,
  conversionChange: 1.8,
})

// Mock data
const geographicData = ref<GeographicData[]>([
  { country: 'United States', users: 3420, percentage: 27.3 },
  { country: 'Germany', users: 1875, percentage: 15.0 },
  { country: 'Japan', users: 1560, percentage: 12.5 },
  { country: 'United Kingdom', users: 1320, percentage: 10.6 },
  { country: 'Canada', users: 1100, percentage: 8.8 },
  { country: 'Australia', users: 875, percentage: 7.0 },
  { country: 'Others', users: 2393, percentage: 18.8 },
])

const topPages = ref<PageData[]>([
  { path: '/market', views: 12500, bounceRate: 12.5 },
  { path: '/login', views: 8900, bounceRate: 8.2 },
  { path: '/dashboard', views: 7600, bounceRate: 5.8 },
  { path: '/trade', views: 6500, bounceRate: 15.3 },
  { path: '/wallet', views: 5400, bounceRate: 7.9 },
  { path: '/profile', views: 4300, bounceRate: 18.2 },
  { path: '/orders', views: 3800, bounceRate: 9.1 },
  { path: '/support', views: 2700, bounceRate: 22.4 },
])

const topActions = ref<ActionData[]>([
  { action: 'Login', count: 8900, successRate: 98.5 },
  { action: 'Place Order', count: 6500, successRate: 97.2 },
  { action: 'Deposit', count: 4300, successRate: 96.8 },
  { action: 'Withdraw', count: 2100, successRate: 95.3 },
  { action: 'KYC Verification', count: 1800, successRate: 89.7 },
  { action: 'Change Password', count: 1200, successRate: 99.1 },
  { action: 'Enable 2FA', count: 950, successRate: 94.2 },
  { action: 'Contact Support', count: 750, successRate: 87.5 },
])

// Columns
const geographicColumns = [
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
    width: 200,
  },
  {
    title: 'Users',
    dataIndex: 'users',
    key: 'users',
    width: 120,
  },
  {
    title: 'Percentage',
    dataIndex: 'percentage',
    key: 'percentage',
    width: 120,
    customRender: ({ value }: { value: number }) => `${value}%`,
  },
]

const topPagesColumns = [
  {
    title: 'Page',
    dataIndex: 'path',
    key: 'path',
    width: 300,
  },
  {
    title: 'Views',
    dataIndex: 'views',
    key: 'views',
    width: 120,
  },
  {
    title: 'Bounce Rate',
    dataIndex: 'bounceRate',
    key: 'bounceRate',
    width: 120,
    customRender: ({ value }: { value: number }) => `${value}%`,
  },
]

const topActionsColumns = [
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: 200,
  },
  {
    title: 'Count',
    dataIndex: 'count',
    key: 'count',
    width: 120,
  },
  {
    title: 'Success Rate',
    dataIndex: 'successRate',
    key: 'successRate',
    width: 120,
    customRender: ({ value }: { value: number }) => `${value}%`,
  },
]

// Methods
function handleRefresh() {
  console.log('Refreshing user behavior analytics')
}

function handleExport() {
  console.log('Exporting user behavior analytics report')
}

function handleDateChange(dates: [Dayjs, Dayjs] | null) {
  if (dates) {
    console.log('Date range changed:', dates)
  }
}

function initCharts() {
  // Activity chart
  if (activityChartRef.value) {
    activityChart = echarts.init(activityChartRef.value)
    const activityOption = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Active Users', 'Page Views', 'Session Duration'],
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Active Users',
          type: 'line',
          smooth: true,
          data: [8000, 9500, 11000, 10500, 12000, 11500, 9800],
        },
        {
          name: 'Page Views',
          type: 'line',
          smooth: true,
          data: [35000, 42000, 51000, 48000, 55000, 52000, 45000],
        },
        {
          name: 'Session Duration',
          type: 'line',
          smooth: true,
          data: [10, 11.5, 12.8, 12.2, 13.5, 12.8, 11.9],
        },
      ],
    }
    activityChart.setOption(activityOption)
  }

  // Engagement chart
  if (engagementChartRef.value) {
    engagementChart = echarts.init(engagementChartRef.value)
    const engagementOption = {
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          name: 'Engagement',
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 65, name: 'High Engagement' },
            { value: 25, name: 'Medium Engagement' },
            { value: 10, name: 'Low Engagement' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
    engagementChart.setOption(engagementOption)
  }

  // Retention chart
  if (retentionChartRef.value) {
    retentionChart = echarts.init(retentionChartRef.value)
    const retentionOption = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b0}: {c0}%',
      },
      xAxis: {
        type: 'category',
        data: ['Day 1', 'Day 7', 'Day 14', 'Day 30'],
      },
      yAxis: {
        type: 'value',
        max: 100,
        min: 0,
      },
      series: [
        {
          data: [78, 52, 35, 18],
          type: 'line',
          smooth: true,
          areaStyle: {},
        },
      ],
    }
    retentionChart.setOption(retentionOption)
  }

  // Flow chart
  if (flowChartRef.value) {
    flowChart = echarts.init(flowChartRef.value)
    const flowOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      series: [
        {
          name: 'User Flow',
          type: 'funnel',
          left: '10%',
          top: 60,
          bottom: 60,
          width: '80%',
          min: 0,
          max: 100,
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside',
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid',
            },
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
          },
          emphasis: {
            label: {
              fontSize: 20,
            },
          },
          data: [
            { value: 100, name: 'Visitors' },
            { value: 75, name: 'Registered' },
            { value: 50, name: 'Verified' },
            { value: 30, name: 'Active Traders' },
            { value: 15, name: 'Regular Traders' },
          ],
        },
      ],
    }
    flowChart.setOption(flowOption)
  }
}

function resizeCharts() {
  if (activityChart) activityChart.resize()
  if (engagementChart) engagementChart.resize()
  if (retentionChart) retentionChart.resize()
  if (flowChart) flowChart.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', resizeCharts)
})

onUnmounted(() => {
  if (activityChart) activityChart.dispose()
  if (engagementChart) engagementChart.dispose()
  if (retentionChart) retentionChart.dispose()
  if (flowChart) flowChart.dispose()
  window.removeEventListener('resize', resizeCharts)
})
</script>

<style scoped>
.user-behavior-analytics {
  padding: 24px;
}

.summary-section {
  margin-bottom: 24px;
}

.charts-section {
  margin-bottom: 24px;
}

.segments-section {
  margin-bottom: 24px;
}

.behavior-section {
  margin-bottom: 24px;
}
</style>
