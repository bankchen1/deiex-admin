<template>
  <div class="email-marketing-dashboard">
    <a-page-header title="Email Marketing" sub-title="Monitor email campaign performance">
      <template #extra>
        <a-button @click="handleRefresh">
          <template #icon>
            <ReloadOutlined />
          </template>
          Refresh
        </a-button>
      </template>
    </a-page-header>

    <!-- Stats Overview -->
    <a-row :gutter="16" class="stats-section">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Total Campaigns"
            :value="stats.totalCampaigns"
            :value-style="{ color: '#1890ff' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Sent Emails"
            :value="stats.sentEmails"
            :value-style="{ color: '#52c41a' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Open Rate"
            :value="stats.openRate"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#722ed1' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Click Rate"
            :value="stats.clickRate"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#faad14' }"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- Charts Section -->
    <a-row :gutter="16" class="charts-section">
      <a-col :span="12">
        <a-card title="Email Performance Trend" class="chart-card">
          <div ref="performanceChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="Campaign Success Rate" class="chart-card">
          <div ref="successRateChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" class="charts-section">
      <a-col :span="12">
        <a-card title="Top Performing Campaigns" class="table-card">
          <a-table
            :data-source="topCampaigns"
            :columns="topCampaignsColumns"
            :pagination="false"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'name'">
                <a-button type="link" size="small" @click="handleViewCampaign(record)">
                  {{ record.name }}
                </a-button>
              </template>
              <template v-else-if="column.key === 'openRate'">
                <span>{{ record.openRate }}%</span>
              </template>
              <template v-else-if="column.key === 'clickRate'">
                <span>{{ record.clickRate }}%</span>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="Subscriber Growth" class="chart-card">
          <div ref="subscriberChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Recent Campaigns -->
    <a-card title="Recent Campaigns" class="content-card">
      <EmailCampaignTable
        :data-source="recentCampaigns"
        :loading="loading"
        :pagination="{
          current: currentPage,
          pageSize: 5,
          total: totalCampaigns,
        }"
        @change="handleTableChange"
        @view="handleViewCampaign"
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { ReloadOutlined } from '@ant-design/icons-vue'
import EmailCampaignTable from '@/tables/content/EmailCampaignTable.vue'
import type { EmailCampaign } from '@/contracts/content'

// Mock data for demonstration
const mockCampaigns: EmailCampaign[] = [
  {
    id: '1',
    name: 'Welcome Series',
    templateId: '1',
    templateName: 'Welcome Email',
    subject: 'Welcome to DEIEX!',
    content: 'Thank you for joining our platform...',
    status: 'sent',
    audience: ['new-users', 'vip-users'],
    sentCount: 1250,
    openCount: 890,
    clickCount: 245,
    unsubscribeCount: 12,
    scheduleTime: '2023-06-15T10:00:00Z',
    sentAt: '2023-06-15T10:00:00Z',
    createdAt: '2023-06-15T09:00:00Z',
    updatedAt: '2023-06-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Security Alert',
    templateId: '2',
    templateName: 'Security Alert',
    subject: 'Security Alert: New Login',
    content: 'We detected a new login to your account...',
    status: 'sent',
    audience: ['all-users'],
    sentCount: 3500,
    openCount: 2100,
    clickCount: 150,
    unsubscribeCount: 5,
    scheduleTime: '2023-06-18T09:00:00Z',
    sentAt: '2023-06-18T09:00:00Z',
    createdAt: '2023-06-18T08:00:00Z',
    updatedAt: '2023-06-18T09:00:00Z',
  },
  {
    id: '3',
    name: 'Market Update',
    templateId: '3',
    templateName: 'Market Update',
    subject: 'Market Update: BTC Price Surge',
    content: 'Bitcoin price has surged 5% in the last hour...',
    status: 'scheduled',
    audience: ['active-traders'],
    sentCount: 0,
    openCount: 0,
    clickCount: 0,
    unsubscribeCount: 0,
    scheduleTime: '2023-06-20T09:00:00Z',
    createdAt: '2023-06-10T11:00:00Z',
    updatedAt: '2023-06-10T11:00:00Z',
  },
]

const mockTopCampaigns = [
  { id: '1', name: 'Welcome Series', sent: 1250, openRate: 71.2, clickRate: 19.6 },
  { id: '2', name: 'Security Alert', sent: 3500, openRate: 60.0, clickRate: 4.3 },
  { id: '4', name: 'Promotional Offer', sent: 2800, openRate: 58.6, clickRate: 12.5 },
  { id: '5', name: 'Newsletter', sent: 4200, openRate: 45.2, clickRate: 8.3 },
]

// State
const stats = ref({
  totalCampaigns: 24,
  sentEmails: 12500,
  openRate: 58.6,
  clickRate: 9.2,
})

const recentCampaigns = ref<EmailCampaign[]>(mockCampaigns)
const topCampaigns = ref(mockTopCampaigns)
const loading = ref(false)
const totalCampaigns = ref(24)
const currentPage = ref(1)

const router = useRouter()

// Chart refs
const performanceChartRef = ref<HTMLDivElement | null>(null)
const successRateChartRef = ref<HTMLDivElement | null>(null)
const subscriberChartRef = ref<HTMLDivElement | null>(null)

let performanceChart: echarts.ECharts | null = null
let successRateChart: echarts.ECharts | null = null
let subscriberChart: echarts.ECharts | null = null

// Table columns
const topCampaignsColumns = [
  {
    title: 'Campaign',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Sent',
    dataIndex: 'sent',
    key: 'sent',
  },
  {
    title: 'Open Rate',
    dataIndex: 'openRate',
    key: 'openRate',
  },
  {
    title: 'Click Rate',
    dataIndex: 'clickRate',
    key: 'clickRate',
  },
]

// Lifecycle
onMounted(() => {
  initCharts()
  updateCharts()
})

onBeforeUnmount(() => {
  performanceChart?.dispose()
  successRateChart?.dispose()
  subscriberChart?.dispose()
})

// Methods
function initCharts() {
  if (performanceChartRef.value) {
    performanceChart = echarts.init(performanceChartRef.value)
  }
  if (successRateChartRef.value) {
    successRateChart = echarts.init(successRateChartRef.value)
  }
  if (subscriberChartRef.value) {
    subscriberChart = echarts.init(subscriberChartRef.value)
  }
}

function updateCharts() {
  updatePerformanceChart()
  updateSuccessRateChart()
  updateSubscriberChart()
}

function updatePerformanceChart() {
  if (!performanceChart) return

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Sent', 'Opened', 'Clicked'],
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Sent',
        type: 'line',
        data: [1200, 1800, 2200, 2800, 3500, 4200],
        smooth: true,
      },
      {
        name: 'Opened',
        type: 'line',
        data: [800, 1200, 1500, 1900, 2400, 2800],
        smooth: true,
      },
      {
        name: 'Clicked',
        type: 'line',
        data: [120, 200, 280, 350, 420, 510],
        smooth: true,
      },
    ],
  }

  performanceChart.setOption(option, true)
}

function updateSuccessRateChart() {
  if (!successRateChart) return

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      bottom: 'bottom',
    },
    series: [
      {
        name: 'Campaign Status',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 18, name: 'Sent' },
          { value: 3, name: 'Scheduled' },
          { value: 2, name: 'Draft' },
          { value: 1, name: 'Paused' },
        ],
      },
    ],
  }

  successRateChart.setOption(option, true)
}

function updateSubscriberChart() {
  if (!subscriberChart) return

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Subscribers',
        type: 'bar',
        data: [8500, 9200, 10500, 11800, 12600, 13400],
        itemStyle: {
          color: '#1890ff',
        },
      },
    ],
  }

  subscriberChart.setOption(option, true)
}

function handleRefresh() {
  // Refresh data
  console.log('Refresh data')
}

function handleTableChange(pagination: any) {
  currentPage.value = pagination.current
  // Fetch data for new page
  console.log('Change page to:', pagination.current)
}

function handleViewCampaign(record: EmailCampaign) {
  // Navigate to campaign details
  console.log('View campaign:', record)
}
</script>

<style scoped>
.email-marketing-dashboard {
  padding: 24px 0;
}

.stats-section {
  margin-bottom: 24px;
}

.charts-section {
  margin-bottom: 24px;
}

.chart-card,
.table-card {
  height: 100%;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.content-card {
  margin-top: 16px;
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px;
  }
}
</style>
