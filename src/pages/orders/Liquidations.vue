<template>
  <div class="liquidations-page">
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

      <!-- Stats Section -->
      <a-row :gutter="16" style="margin-bottom: 16px">
        <a-col :span="6">
          <a-statistic
            title="Total Liquidations"
            :value="ordersStore.liquidationsTotal"
            :value-style="{ color: '#ff4d4f' }"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            title="Total Loss"
            :value="totalLoss"
            :precision="2"
            :value-style="{ color: '#ff4d4f' }"
            prefix="$"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            title="Avg Loss %"
            :value="avgLossPercent"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#ff4d4f' }"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            title="Avg Leverage"
            :value="avgLeverage"
            :precision="1"
            suffix="x"
            :value-style="{ color: '#faad14' }"
          />
        </a-col>
      </a-row>

      <!-- Table Section -->
      <div class="table-section">
        <LiquidationTable
          :filters="appliedFilters"
          @view-detail="handleViewDetail"
          @selection-change="handleSelectionChange"
        >
          <template #toolbar>
            <a-space>
              <a-button :disabled="selectedLiquidations.length === 0" @click="handleBatchExport">
                <template #icon>
                  <ExportOutlined />
                </template>
                Export Selected ({{ selectedLiquidations.length }})
              </a-button>
            </a-space>
          </template>
        </LiquidationTable>
      </div>
    </a-card>

    <!-- Liquidation Detail Drawer -->
    <a-drawer
      :open="detailDrawerOpen"
      :title="`Liquidation Details - ${selectedLiquidation?.id || ''}`"
      width="900"
      @close="handleCloseDetail"
    >
      <a-spin :spinning="detailLoading">
        <div v-if="selectedLiquidation" class="liquidation-detail">
          <!-- Basic Information -->
          <a-card title="Liquidation Information" :bordered="false" class="detail-card">
            <a-descriptions :column="2" bordered size="small">
              <a-descriptions-item label="Liquidation ID">
                {{ selectedLiquidation.id }}
              </a-descriptions-item>
              <a-descriptions-item label="User ID">
                <a @click="handleViewUser(selectedLiquidation.userId)">
                  {{ selectedLiquidation.userId }}
                </a>
              </a-descriptions-item>
              <a-descriptions-item label="Nickname">
                {{ selectedLiquidation.userNickname || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="Symbol">
                <strong>{{ selectedLiquidation.symbol }}</strong>
              </a-descriptions-item>
              <a-descriptions-item label="Side">
                <a-tag :color="selectedLiquidation.side === 'long' ? 'green' : 'red'">
                  {{ selectedLiquidation.side === 'long' ? 'Long' : 'Short' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Leverage">
                {{ selectedLiquidation.leverage }}x
              </a-descriptions-item>
              <a-descriptions-item label="Entry Price">
                {{ formatNumber(selectedLiquidation.entryPrice, 8) }}
              </a-descriptions-item>
              <a-descriptions-item label="Liquidation Price">
                {{ formatNumber(selectedLiquidation.liquidationPrice, 8) }}
              </a-descriptions-item>
              <a-descriptions-item label="Quantity">
                {{ formatNumber(selectedLiquidation.quantity, 8) }}
              </a-descriptions-item>
              <a-descriptions-item label="Loss">
                <span style="color: #ff4d4f; font-weight: bold">
                  -{{ formatNumber(selectedLiquidation.loss, 8) }} (-{{
                    selectedLiquidation.lossPercent.toFixed(2)
                  }}%)
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="Reason" :span="2">
                <a-tag color="red">{{ selectedLiquidation.reason }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Liquidated At" :span="2">
                {{ formatDate(selectedLiquidation.liquidatedAt) }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>

          <!-- Timeline -->
          <LiqTimeline :timeline="selectedLiquidation.timeline" />
        </div>
      </a-spin>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SearchOutlined, ExportOutlined } from '@ant-design/icons-vue'
import type { Dayjs } from 'dayjs'
import LiquidationTable from '@/tables/orders/LiquidationTable.vue'
import LiqTimeline from '@/widgets/timeline/LiqTimeline.vue'
import type { Liquidation, LiquidationQueryParams } from '@/services/api/orders'
import { useOrdersStore } from '@/stores/orders'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/format'

const router = useRouter()
const ordersStore = useOrdersStore()

// Filters
const filters = reactive<LiquidationQueryParams>({
  symbol: undefined,
  userId: undefined,
  startTime: undefined,
  endTime: undefined,
})

const appliedFilters = ref<LiquidationQueryParams>({})
const timeRange = ref<[Dayjs, Dayjs] | null>(null)

// Selection
const selectedLiquidations = ref<Liquidation[]>([])

// Detail Drawer
const detailDrawerOpen = ref(false)
const selectedLiquidation = ref<Liquidation | null>(null)
const detailLoading = ref(false)

// Computed Stats
const totalLoss = computed(() => {
  return ordersStore.liquidations.reduce((sum, l) => sum + parseFloat(l.loss), 0)
})

const avgLossPercent = computed(() => {
  if (ordersStore.liquidations.length === 0) return 0
  const sum = ordersStore.liquidations.reduce((sum, l) => sum + l.lossPercent, 0)
  return sum / ordersStore.liquidations.length
})

const avgLeverage = computed(() => {
  if (ordersStore.liquidations.length === 0) return 0
  const sum = ordersStore.liquidations.reduce((sum, l) => sum + l.leverage, 0)
  return sum / ordersStore.liquidations.length
})

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
  filters.userId = undefined
  filters.startTime = undefined
  filters.endTime = undefined
  timeRange.value = null
  appliedFilters.value = {}
}

function handleSelectionChange(rows: Liquidation[]) {
  selectedLiquidations.value = rows
}

async function handleViewDetail(liquidation: Liquidation) {
  selectedLiquidation.value = liquidation
  detailDrawerOpen.value = true

  // Optionally fetch full details
  if (liquidation.id) {
    detailLoading.value = true
    try {
      await ordersStore.fetchLiquidationById(liquidation.id)
      selectedLiquidation.value = ordersStore.currentLiquidation
    } finally {
      detailLoading.value = false
    }
  }
}

function handleCloseDetail() {
  detailDrawerOpen.value = false
  selectedLiquidation.value = null
}

function handleViewUser(userId: string) {
  router.push(`/admin/users/${userId}`)
}

async function handleBatchExport() {
  await ordersStore.exportLiquidations({
    ...appliedFilters.value,
  })
}
</script>

<style scoped>
.liquidations-page {
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

.liquidation-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-card {
  margin-bottom: 0;
}
</style>
