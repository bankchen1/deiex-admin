<template>
  <div class="finance-reports-page">
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

        <a-form-item label="Type">
          <a-select v-model:value="filters.type" style="width: 180px" @change="handleFilterChange">
            <a-select-option value="all">All Types</a-select-option>
            <a-select-option value="deposit">Deposits</a-select-option>
            <a-select-option value="withdrawal">Withdrawals</a-select-option>
            <a-select-option value="fee">Fees</a-select-option>
            <a-select-option value="funding">Funding</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Currency">
          <a-input
            v-model:value="filters.currency"
            style="width: 150px"
            placeholder="e.g. USDT"
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
            title="Total Deposits"
            :value="summary?.totalDeposits || '0'"
            :precision="2"
            prefix="$"
            :loading="loading"
          >
            <template #suffix>
              <div class="stat-count">{{ summary?.depositCount || 0 }} txs</div>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="Total Withdrawals"
            :value="summary?.totalWithdrawals || '0'"
            :precision="2"
            prefix="$"
            :loading="loading"
          >
            <template #suffix>
              <div class="stat-count">{{ summary?.withdrawalCount || 0 }} txs</div>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="Net Inflow"
            :value="summary?.netInflow || '0'"
            :precision="2"
            prefix="$"
            :value-style="getNetInflowStyle()"
            :loading="loading"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bordered="false">
          <a-statistic
            title="Total Fee Income"
            :value="summary?.totalFeeIncome || '0'"
            :precision="2"
            prefix="$"
            :loading="loading"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- Fee Breakdown Cards -->
    <a-row :gutter="16" class="fee-breakdown">
      <a-col :span="8">
        <a-card :bordered="false" size="small">
          <a-statistic
            title="Trading Fees"
            :value="summary?.tradingFees || '0'"
            :precision="2"
            prefix="$"
            :loading="loading"
          />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :bordered="false" size="small">
          <a-statistic
            title="Withdrawal Fees"
            :value="summary?.withdrawalFees || '0'"
            :precision="2"
            prefix="$"
            :loading="loading"
          />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :bordered="false" size="small">
          <a-statistic
            title="Funding Settlements"
            :value="summary?.fundingSettlements || '0'"
            :precision="2"
            prefix="$"
            :loading="loading"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- Charts -->
    <a-row :gutter="16" class="charts-section">
      <a-col :span="12">
        <a-card title="Deposit/Withdrawal Trend" :bordered="false" :loading="loading">
          <StackedBar
            :data="inflowChartData"
            :x-axis-data="inflowChartXAxis"
            :y-axis-name="'Amount (USD)'"
            :y-axis-formatter="formatChartValue"
          />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="Fee Income Trend" :bordered="false" :loading="loading">
          <StackedBar
            :data="feeChartData"
            :x-axis-data="feeChartXAxis"
            :y-axis-name="'Fee Income (USD)'"
            :y-axis-formatter="formatChartValue"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- Tables -->
    <a-card title="Daily Finance Data" :bordered="false" class="table-card">
      <FinanceDailyTable
        :data-source="financeDailyData"
        :loading="loading"
        @export="handleExportDaily"
      />
    </a-card>

    <a-card title="Fee Income by Currency" :bordered="false" class="table-card">
      <FeeIncomeTable :data-source="feeIncomeData" :loading="loading" @export="handleExportFees" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'
import { useReportsStore } from '@/stores/reports'
import FinanceDailyTable from '@/tables/reports/FinanceDailyTable.vue'
import FeeIncomeTable from '@/tables/reports/FeeIncomeTable.vue'
import StackedBar from '@/widgets/charts/StackedBar.vue'
import type { FinanceReportParams } from '@/types/api'

const reportsStore = useReportsStore()

// State
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(7, 'days'), dayjs()])

const filters = ref<Omit<FinanceReportParams, 'startDate' | 'endDate'>>({
  type: 'all',
  currency: undefined,
})

// Computed
const loading = computed(() => reportsStore.loading)
const summary = computed(() => reportsStore.financeReports?.summary)
const charts = computed(() => reportsStore.financeReports?.charts)
const financeDailyData = computed(() => reportsStore.financeDailyData)
const feeIncomeData = computed(() => reportsStore.feeIncomeData)

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

const inflowChartData = computed(() => {
  if (!charts.value?.inflowTrend) return []
  return [
    {
      name: 'Deposits',
      data: charts.value.inflowTrend.map((item) => parseFloat(item.deposits)),
    },
    {
      name: 'Withdrawals',
      data: charts.value.inflowTrend.map((item) => parseFloat(item.withdrawals)),
    },
  ]
})

const inflowChartXAxis = computed(() => {
  return charts.value?.inflowTrend.map((item) => item.date) || []
})

const feeChartData = computed(() => {
  if (!charts.value?.feeIncomeTrend) return []
  return [
    {
      name: 'Trading Fees',
      data: charts.value.feeIncomeTrend.map((item) => parseFloat(item.trading)),
    },
    {
      name: 'Withdrawal Fees',
      data: charts.value.feeIncomeTrend.map((item) => parseFloat(item.withdrawal)),
    },
  ]
})

const feeChartXAxis = computed(() => {
  return charts.value?.feeIncomeTrend.map((item) => item.date) || []
})

// Methods
function getQueryParams(): FinanceReportParams {
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
      reportsStore.fetchFinanceReports(params),
      reportsStore.fetchFinanceDailyData(params),
      reportsStore.fetchFeeIncomeData(params),
    ])
  } catch (error) {
    message.error('Failed to fetch finance reports')
  }
}

function handleDateChange() {
  fetchData()
}

function handleFilterChange() {
  fetchData()
}

function handleReset() {
  dateRange.value = [dayjs().subtract(7, 'days'), dayjs()]
  filters.value = {
    type: 'all',
    currency: undefined,
  }
  fetchData()
}

async function handleExport() {
  try {
    const params = getQueryParams()
    await reportsStore.exportFinanceReport(params)
    message.success('Report exported successfully')
  } catch (error) {
    message.error('Failed to export report')
  }
}

function handleExportDaily() {
  const csv = convertToCSV(financeDailyData.value)
  downloadCSV(csv, 'finance-daily-data.csv')
}

function handleExportFees() {
  const csv = convertToCSV(feeIncomeData.value)
  downloadCSV(csv, 'fee-income-data.csv')
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

function getNetInflowStyle() {
  const netInflow = parseFloat(summary.value?.netInflow || '0')
  return {
    color: netInflow >= 0 ? '#52c41a' : '#f5222d',
  }
}

function formatChartValue(value: number): string {
  return `$${(value / 1000000).toFixed(1)}M`
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.finance-reports-page {
  padding: 24px;
}

.filter-card {
  margin-bottom: 16px;
}

.summary-cards {
  margin-bottom: 16px;
}

.fee-breakdown {
  margin-bottom: 16px;
}

.stat-count {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 4px;
}

.charts-section {
  margin-bottom: 16px;
}

.table-card {
  margin-bottom: 16px;
}
</style>
