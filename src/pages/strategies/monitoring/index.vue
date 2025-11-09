<template>
  <div class="strategy-monitoring-page">
    <a-page-header
      :title="$t('strategies.monitoring.title')"
      :sub-title="$t('strategies.monitoring.dashboard')"
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
          <a-form-item :label="$t('strategies.monitoring.strategy')">
            <a-select
              v-model:value="filters.strategyId"
              :placeholder="$t('strategies.monitoring.strategyPlaceholder')"
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
          <a-form-item :label="$t('strategies.monitoring.symbol')">
            <a-select
              v-model:value="filters.symbol"
              :placeholder="$t('strategies.monitoring.symbolPlaceholder')"
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
          <a-form-item :label="$t('strategies.monitoring.status')">
            <a-select
              v-model:value="filters.status"
              :placeholder="$t('strategies.monitoring.statusPlaceholder')"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">{{ $t('common.all') }}</a-select-option>
              <a-select-option value="running">{{
                $t('strategies.monitoring.statuses.running')
              }}</a-select-option>
              <a-select-option value="paused">{{
                $t('strategies.monitoring.statuses.paused')
              }}</a-select-option>
              <a-select-option value="stopped">{{
                $t('strategies.monitoring.statuses.stopped')
              }}</a-select-option>
              <a-select-option value="error">{{
                $t('strategies.monitoring.statuses.error')
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :label="$t('strategies.monitoring.timeRange')">
            <a-range-picker
              v-model:value="dateRange"
              :placeholder="[
                $t('strategies.monitoring.startTime'),
                $t('strategies.monitoring.endTime'),
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

    <!-- Real-time Monitoring -->
    <a-row :gutter="16" class="monitoring-row">
      <a-col :span="24">
        <a-card :title="$t('strategies.monitoring.realTimeMonitoring')" class="monitoring-card">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-statistic
                :title="$t('strategies.monitoring.activeStrategies')"
                :value="realTimeMetrics.activeStrategies"
              />
            </a-col>
            <a-col :span="12">
              <a-statistic
                :title="$t('strategies.monitoring.totalPnl')"
                :value="realTimeMetrics.totalPnl"
                :precision="2"
                :value-style="
                  realTimeMetrics.totalPnl >= 0 ? { color: '#52c41a' } : { color: '#f5222d' }
                "
              />
            </a-col>
          </a-row>
          <a-row :gutter="16" style="margin-top: 16px">
            <a-col :span="8">
              <a-statistic
                :title="$t('strategies.monitoring.openPositions')"
                :value="realTimeMetrics.openPositions"
              />
            </a-col>
            <a-col :span="8">
              <a-statistic
                :title="$t('strategies.monitoring.pendingOrders')"
                :value="realTimeMetrics.pendingOrders"
              />
            </a-col>
            <a-col :span="8">
              <a-statistic
                :title="$t('strategies.monitoring.riskAlerts')"
                :value="realTimeMetrics.riskAlerts"
                :value-style="{ color: '#f5222d' }"
              />
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>

    <!-- Strategy Instances Table -->
    <a-card :title="$t('strategies.monitoring.runningInstances')" class="instances-card">
      <StrategyInstanceMonitorTable
        :data-source="instances"
        :loading="loading"
        :pagination="{
          current: currentPage,
          pageSize: pageSize,
          total: total,
        }"
        @change="handleTableChange"
        @view="handleView"
        @pause="handlePause"
        @stop="handleStop"
        @restart="handleRestart"
      />
    </a-card>

    <!-- Performance Charts -->
    <a-row :gutter="16" class="charts-row">
      <a-col :span="12">
        <a-card :title="$t('strategies.monitoring.pnlChart')" class="chart-card">
          <div ref="pnlChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card :title="$t('strategies.monitoring.positionsChart')" class="chart-card">
          <div ref="positionsChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Recent Logs -->
    <a-card :title="$t('strategies.monitoring.recentLogs')" class="logs-card">
      <a-table
        :data-source="recentLogs"
        :columns="logColumns"
        :pagination="false"
        size="small"
        :scroll="{ y: 300 }"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'timestamp'">
            <span>{{ $t('strategies.monitoring.timestamp') }}</span>
          </template>
          <template v-else-if="column.key === 'strategy'">
            <span>{{ $t('strategies.monitoring.strategy') }}</span>
          </template>
          <template v-else-if="column.key === 'level'">
            <span>{{ $t('strategies.monitoring.level') }}</span>
          </template>
          <template v-else-if="column.key === 'message'">
            <span>{{ $t('strategies.monitoring.message') }}</span>
          </template>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'timestamp'">
            <span>{{ formatDate(record.timestamp) }}</span>
          </template>
          <template v-else-if="column.key === 'strategy'">
            <a-tag color="blue">{{ record.strategyName }}</a-tag>
          </template>
          <template v-else-if="column.key === 'level'">
            <a-tag :color="getLogLevelColor(record.level)">
              {{ getLogLevelText(record.level) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'message'">
            <span :class="`log-message log-${record.level.toLowerCase()}`">{{
              record.message
            }}</span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStrategiesStore } from '@/stores/strategies'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { ReloadOutlined } from '@ant-design/icons-vue'
import StrategyInstanceMonitorTable from '@/tables/strategies/StrategyInstanceMonitorTable.vue'
import type { StrategyInstance } from '@/contracts/strategies'
import { formatDate } from '@/utils/date'

// State
const strategiesStore = useStrategiesStore()
const { t } = useI18n()

// Computed getters that map to store values
const strategyInstances = computed(() => strategiesStore.strategyInstances)
const instances = computed(() => strategiesStore.strategyInstances)
const total = computed(() => strategiesStore.strategyInstancesTotal)

const recentLogs = ref([])

const filters = ref({
  strategyId: undefined as string | undefined,
  symbol: undefined as string | undefined,
  status: undefined as string | undefined,
})

const dateRange = ref<[dayjs.Dayjs, dayjs.Dayjs] | undefined>(undefined)

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)

const realTimeMetrics = ref({
  activeStrategies: 0,
  totalPnl: 0,
  openPositions: 0,
  pendingOrders: 0,
  riskAlerts: 0,
})

const filters = ref({
  strategyId: undefined as string | undefined,
  symbol: undefined as string | undefined,
  status: undefined as string | undefined,
})

const dateRange = ref<[dayjs.Dayjs, dayjs.Dayjs] | undefined>(undefined)

const loading = ref(false)
const total = ref(2)
const currentPage = ref(1)
const pageSize = ref(20)

const realTimeMetrics = ref({
  activeStrategies: 2,
  totalPnl: 1175,
  openPositions: 3,
  pendingOrders: 1,
  riskAlerts: 1,
})

// Chart refs
const pnlChartRef = ref<HTMLDivElement | null>(null)
const positionsChartRef = ref<HTMLDivElement | null>(null)

let pnlChart: echarts.ECharts | null = null
let positionsChart: echarts.ECharts | null = null

// Log columns
const logColumns = [
  {
    title: t('strategies.monitoring.timestamp'),
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: 180,
  },
  {
    title: t('strategies.monitoring.strategy'),
    dataIndex: 'strategyName',
    key: 'strategy',
    width: 150,
  },
  {
    title: t('strategies.monitoring.level'),
    dataIndex: 'level',
    key: 'level',
    width: 100,
  },
  {
    title: t('strategies.monitoring.message'),
    dataIndex: 'message',
    key: 'message',
  },
]

// Lifecycle
onMounted(() => {
  initCharts()
  updateCharts()
})

onBeforeUnmount(() => {
  pnlChart?.dispose()
  positionsChart?.dispose()
})

// Methods
function initCharts() {
  if (pnlChartRef.value) {
    pnlChart = echarts.init(pnlChartRef.value)
  }
  if (positionsChartRef.value) {
    positionsChart = echarts.init(positionsChartRef.value)
  }
}

function updateCharts() {
  updatePnlChart()
  updatePositionsChart()
}

function updatePnlChart() {
  if (!pnlChart) return

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `$${value.toFixed(0)}`,
      },
    },
    series: [
      {
        name: t('strategies.monitoring.pnl'),
        type: 'line',
        data: [0, 120, 350, 800, 650, 980, 1175],
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

  pnlChart.setOption(option, true)
}

function updatePositionsChart() {
  if (!positionsChart) return

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
        name: t('strategies.monitoring.positions'),
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
          { value: 2, name: 'BTCUSDT' },
          { value: 1, name: 'ETHUSDT' },
        ],
      },
    ],
  }

  positionsChart.setOption(option, true)
}

function getLogLevelColor(level: string) {
  const colorMap: Record<string, string> = {
    info: 'blue',
    warning: 'orange',
    error: 'red',
  }
  return colorMap[level] || 'default'
}

function getLogLevelText(level: string) {
  const textMap: Record<string, string> = {
    info: t('strategies.monitoring.levels.info'),
    warning: t('strategies.monitoring.levels.warning'),
    error: t('strategies.monitoring.levels.error'),
  }
  return textMap[level] || level
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
    strategyId: undefined,
    symbol: undefined,
    status: undefined,
  }
  dateRange.value = undefined
}

function handleRefresh() {
  // Refresh handler
}

function handleTableChange(pagination: any) {
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize
}

function handleView(record: StrategyInstance) {
  // View handler
}

function handlePause(record: StrategyInstance) {
  // Pause handler
}

function handleStop(record: StrategyInstance) {
  // Stop handler
}

function handleRestart(record: StrategyInstance) {
  // Restart handler
}
</script>

<style scoped>
.strategy-monitoring-page {
  padding: 24px;
}

.filter-card {
  margin-bottom: 16px;
}

.monitoring-row {
  margin-bottom: 16px;
}

.monitoring-card {
  height: 100%;
}

.instances-card {
  margin-top: 16px;
}

.charts-row {
  margin-top: 16px;
}

.chart-card {
  height: 100%;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.logs-card {
  margin-top: 16px;
}

.log-message {
  font-family: monospace;
  font-size: 12px;
}

.log-error {
  color: #f5222d;
}

.log-warning {
  color: #faad14;
}

.log-info {
  color: #1890ff;
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px;
  }
}
</style>
