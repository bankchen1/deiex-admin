<template>
  <div class="dashboard-page">
    <!-- Page Header -->
    <div class="page-header">
      <h2>Dashboard</h2>
      <a-space>
        <a-range-picker
          v-model:value="dateRange"
          :presets="datePresets"
          @change="handleDateRangeChange"
        />
        <a-button :icon="h(ReloadOutlined)" @click="handleRefresh">Refresh</a-button>
      </a-space>
    </div>

    <!-- Stats Section -->
    <StatsSection :stats="dashboardStore.stats" :loading="dashboardStore.statsLoading" />

    <!-- Charts Section -->
    <ChartsSection
      :charts="dashboardStore.charts"
      :loading="dashboardStore.chartsLoading"
      @range-change="handleChartRangeChange"
    />

    <!-- Operations Queue Section -->
    <OpsQueueSection
      :alerts="dashboardStore.alerts"
      :loading="dashboardStore.alertsLoading"
      @item-click="handleAlertClick"
      @view-all="handleViewAll"
    />

    <!-- Alert Detail Drawer -->
    <AlertDetailDrawer
      v-model:open="alertDrawerVisible"
      :alert-id="selectedAlertId"
      @resolved="handleAlertResolved"
      @navigate="handleNavigateFromAlert"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { ReloadOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'
import { useDashboardStore } from '@/stores/dashboard'
import StatsSection from '@/sections/dashboard/StatsSection.vue'
import ChartsSection from '@/sections/dashboard/ChartsSection.vue'
import OpsQueueSection from '@/sections/dashboard/OpsQueueSection.vue'
import AlertDetailDrawer from '@/modals/alerts/AlertDetailDrawer.vue'
import type { TodoItem } from '@/widgets/list/TodoList.vue'

const router = useRouter()
const dashboardStore = useDashboardStore()

const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(7, 'days'), dayjs()])
const alertDrawerVisible = ref(false)
const selectedAlertId = ref<string>()

const datePresets = [
  { label: 'Last 7 Days', value: [dayjs().subtract(7, 'days'), dayjs()] as [Dayjs, Dayjs] },
  { label: 'Last 30 Days', value: [dayjs().subtract(30, 'days'), dayjs()] as [Dayjs, Dayjs] },
  { label: 'Last 90 Days', value: [dayjs().subtract(90, 'days'), dayjs()] as [Dayjs, Dayjs] },
]

const loadDashboardData = async () => {
  const params = {
    startDate: dateRange.value[0].format('YYYY-MM-DD'),
    endDate: dateRange.value[1].format('YYYY-MM-DD'),
  }

  await dashboardStore.refreshDashboard(params)
}

const handleDateRangeChange = () => {
  loadDashboardData()
}

const handleChartRangeChange = (range: string) => {
  // Update date range based on chart selection
  const rangeMap: Record<string, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
  }
  const days = rangeMap[range] || 7
  dateRange.value = [dayjs().subtract(days, 'days'), dayjs()]
  loadDashboardData()
}

const handleRefresh = () => {
  loadDashboardData()
}

const handleAlertClick = (item: TodoItem) => {
  selectedAlertId.value = item.id
  alertDrawerVisible.value = true
}

const handleAlertResolved = () => {
  // Refresh alerts list
  dashboardStore.fetchAlerts({ status: 'pending', limit: 10 })
}

const handleViewAll = (type: string) => {
  // Navigate to the appropriate page based on type
  const routeMap: Record<string, string> = {
    kyc: '/admin/kyc',
    withdrawals: '/admin/assets/withdrawals',
    orders: '/admin/orders/spot',
    alerts: '/admin/risk/alerts',
  }
  const route = routeMap[type]
  if (route) {
    router.push(route)
  }
}

const handleNavigateFromAlert = (item: any) => {
  // Navigate to related object
  const typeRouteMap: Record<string, string> = {
    kyc: '/admin/kyc',
    user: '/admin/users',
    withdrawal: '/admin/assets/withdrawals',
    order: '/admin/orders/spot',
  }
  const route = typeRouteMap[item.type]
  if (route) {
    router.push(`${route}/${item.id}`)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}
</style>
