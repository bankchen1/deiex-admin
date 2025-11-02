<template>
  <div class="spot-orders-page">
    <a-card :bordered="false">
      <!-- Filter Section -->
      <div class="filter-section">
        <a-form layout="inline" :model="filters">
          <a-form-item label="Trading Pair">
            <a-input
              v-model:value="filters.symbol"
              placeholder="e.g. BTC/USDT"
              style="width: 180px"
              allow-clear
            />
          </a-form-item>

          <a-form-item label="Direction">
            <a-select
              v-model:value="filters.side"
              placeholder="All"
              style="width: 120px"
              allow-clear
            >
              <a-select-option value="buy">Buy</a-select-option>
              <a-select-option value="sell">Sell</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="Status">
            <a-select
              v-model:value="filters.status"
              placeholder="All"
              style="width: 140px"
              allow-clear
            >
              <a-select-option value="pending">Pending</a-select-option>
              <a-select-option value="partial">Partial</a-select-option>
              <a-select-option value="filled">Filled</a-select-option>
              <a-select-option value="cancelled">Cancelled</a-select-option>
              <a-select-option value="rejected">Rejected</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="User ID">
            <a-input
              v-model:value="filters.userId"
              placeholder="User ID"
              style="width: 180px"
              allow-clear
            />
          </a-form-item>

          <a-form-item label="Time Range">
            <a-range-picker
              v-model:value="timeRange"
              :show-time="{ format: 'HH:mm' }"
              format="YYYY-MM-DD HH:mm"
              style="width: 360px"
              @change="handleTimeRangeChange"
            />
          </a-form-item>

          <a-form-item>
            <a-space>
              <a-button type="primary" @click="handleSearch">
                <template #icon>
                  <SearchOutlined />
                </template>
                Search
              </a-button>
              <a-button @click="handleReset">Reset</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>

      <!-- Table Section -->
      <div class="table-section">
        <SpotOrderTable
          :filters="appliedFilters"
          @view-detail="handleViewDetail"
          @selection-change="handleSelectionChange"
        >
          <template #toolbar>
            <a-space>
              <a-button :disabled="selectedOrders.length === 0" @click="handleBatchExport">
                <template #icon>
                  <ExportOutlined />
                </template>
                Export Selected ({{ selectedOrders.length }})
              </a-button>
            </a-space>
          </template>
        </SpotOrderTable>
      </div>
    </a-card>

    <!-- Order Detail Drawer -->
    <OrderDetailDrawer
      :open="detailDrawerOpen"
      :order="selectedOrder"
      :loading="detailLoading"
      @close="handleCloseDetail"
      @view-user="handleViewUser"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { SearchOutlined, ExportOutlined } from '@ant-design/icons-vue'
import type { Dayjs } from 'dayjs'
import SpotOrderTable from '@/tables/orders/SpotOrderTable.vue'
import OrderDetailDrawer from '@/modals/orders/OrderDetailDrawer.vue'
import type { Order, OrderQueryParams } from '@/services/api/orders'
import { useOrdersStore } from '@/stores/orders'

const router = useRouter()
const ordersStore = useOrdersStore()

// Filters
const filters = reactive<OrderQueryParams>({
  symbol: undefined,
  side: undefined,
  status: undefined,
  userId: undefined,
  startTime: undefined,
  endTime: undefined,
})

const appliedFilters = ref<OrderQueryParams>({})
const timeRange = ref<[Dayjs, Dayjs] | null>(null)

// Selection
const selectedOrders = ref<Order[]>([])

// Detail Drawer
const detailDrawerOpen = ref(false)
const selectedOrder = ref<Order | null>(null)
const detailLoading = ref(false)

function handleTimeRangeChange(dates: [Dayjs, Dayjs] | null) {
  if (dates && dates.length === 2) {
    filters.startTime = dates[0].toISOString()
    filters.endTime = dates[1].toISOString()
  } else {
    filters.startTime = undefined
    filters.endTime = undefined
  }
}

function handleSearch() {
  appliedFilters.value = { ...filters }
}

function handleReset() {
  filters.symbol = undefined
  filters.side = undefined
  filters.status = undefined
  filters.userId = undefined
  filters.startTime = undefined
  filters.endTime = undefined
  timeRange.value = null
  appliedFilters.value = {}
}

function handleSelectionChange(rows: Order[]) {
  selectedOrders.value = rows
}

async function handleViewDetail(order: Order) {
  selectedOrder.value = order
  detailDrawerOpen.value = true

  // Optionally fetch full details
  if (order.id) {
    detailLoading.value = true
    try {
      await ordersStore.fetchSpotOrderById(order.id)
      selectedOrder.value = ordersStore.currentSpotOrder
    } finally {
      detailLoading.value = false
    }
  }
}

function handleCloseDetail() {
  detailDrawerOpen.value = false
  selectedOrder.value = null
}

function handleViewUser(userId: string) {
  router.push(`/admin/users/${userId}`)
}

async function handleBatchExport() {
  const orderIds = selectedOrders.value.map((o) => o.id)
  // In a real implementation, you would pass the order IDs to the export function
  await ordersStore.exportSpotOrders({
    ...appliedFilters.value,
    // Add orderIds filter if supported by API
  })
}
</script>

<style scoped>
.spot-orders-page {
  padding: 24px;
}

.filter-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.filter-section :deep(.ant-form-item) {
  margin-bottom: 8px;
}

.table-section {
  margin-top: 16px;
}
</style>
