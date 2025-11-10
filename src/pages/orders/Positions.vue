<template>
  <div class="positions-page">
    <!-- Risk Radar Widget -->
    <a-row :gutter="16" style="margin-bottom: 16px">
      <a-col :span="24">
        <LiquidationRadar :positions="ordersStore.positions" />
      </a-col>
    </a-row>

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

          <a-form-item label="Side">
            <a-select
              v-model:value="filters.side"
              placeholder="All"
              style="width: 120px"
              allow-clear
            >
              <a-select-option value="long">Long</a-select-option>
              <a-select-option value="short">Short</a-select-option>
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

          <a-form-item label="Risk Ratio">
            <a-space>
              <a-input-number
                v-model:value="filters.riskRatioMin"
                placeholder="Min"
                :min="0"
                :max="1"
                :step="0.1"
                style="width: 100px"
              />
              <span>-</span>
              <a-input-number
                v-model:value="filters.riskRatioMax"
                placeholder="Max"
                :min="0"
                :max="1"
                :step="0.1"
                style="width: 100px"
              />
            </a-space>
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
            title="Total Positions"
            :value="ordersStore.positionsTotal"
            :value-style="{ color: '#1890ff' }"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            title="High Risk (≥60%)"
            :value="highRiskCount"
            :value-style="{ color: '#ff4d4f' }"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            title="Total Unrealized PnL"
            :value="totalUnrealizedPnl"
            :precision="2"
            :value-style="{ color: totalUnrealizedPnl >= 0 ? '#52c41a' : '#ff4d4f' }"
            prefix="$"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            title="Avg Risk Ratio"
            :value="avgRiskRatio"
            :precision="2"
            suffix="%"
            :value-style="{ color: avgRiskRatio >= 60 ? '#ff4d4f' : '#52c41a' }"
          />
        </a-col>
      </a-row>

      <!-- Table Section -->
      <div class="table-section">
        <PositionTable
          :filters="appliedFilters"
          @view-detail="handleViewDetail"
          @selection-change="handleSelectionChange"
        >
          <template #toolbar>
            <a-space>
              <a-button :disabled="selectedPositions.length === 0" @click="handleBatchExport">
                <template #icon>
                  <ExportOutlined />
                </template>
                Export Selected ({{ selectedPositions.length }})
              </a-button>
            </a-space>
          </template>
        </PositionTable>
      </div>
    </a-card>

    <!-- Position Detail Drawer -->
    <a-drawer
      :open="detailDrawerOpen"
      :title="`Position Details - ${selectedPosition?.id || ''}`"
      width="720"
      @close="handleCloseDetail"
    >
      <a-spin :spinning="detailLoading">
        <div v-if="selectedPosition" class="position-detail">
          <a-card title="Position Information" :bordered="false">
            <a-descriptions :column="2" bordered size="small">
              <a-descriptions-item label="Position ID">
                {{ selectedPosition.id }}
              </a-descriptions-item>
              <a-descriptions-item label="User ID">
                <a @click="handleViewUser(selectedPosition.userId)">
                  {{ selectedPosition.userId }}
                </a>
              </a-descriptions-item>
              <a-descriptions-item label="Symbol">
                <strong>{{ selectedPosition.symbol }}</strong>
              </a-descriptions-item>
              <a-descriptions-item label="Side">
                <a-tag :color="selectedPosition.side === 'long' ? 'green' : 'red'">
                  {{ selectedPosition.side === 'long' ? 'Long' : 'Short' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Leverage">
                {{ selectedPosition.leverage }}x
              </a-descriptions-item>
              <a-descriptions-item label="Margin Mode">
                <a-tag>
                  {{ selectedPosition.marginMode === 'isolated' ? 'Isolated' : 'Cross' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Entry Price">
                {{ formatNumber(selectedPosition.entryPrice, 8) }}
              </a-descriptions-item>
              <a-descriptions-item label="Mark Price">
                {{ formatNumber(selectedPosition.markPrice, 8) }}
              </a-descriptions-item>
              <a-descriptions-item label="Liquidation Price">
                {{ formatNumber(selectedPosition.liquidationPrice, 8) }}
              </a-descriptions-item>
              <a-descriptions-item label="Quantity">
                {{ formatNumber(selectedPosition.quantity, 8) }}
              </a-descriptions-item>
              <a-descriptions-item label="Margin">
                {{ formatNumber(selectedPosition.margin, 8) }}
              </a-descriptions-item>
              <a-descriptions-item label="Unrealized PnL">
                <span
                  :style="{
                    color: parseFloat(selectedPosition.unrealizedPnl) >= 0 ? '#52c41a' : '#ff4d4f',
                    fontWeight: 'bold',
                  }"
                >
                  {{ formatNumber(selectedPosition.unrealizedPnl, 8) }}
                  ({{ selectedPosition.unrealizedPnlPercent.toFixed(2) }}%)
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="Risk Ratio">
                <a-progress
                  :percent="selectedPosition.riskRatio * 100"
                  :status="selectedPosition.riskRatio >= 0.8 ? 'exception' : 'normal'"
                  :stroke-color="
                    selectedPosition.riskRatio >= 0.8
                      ? '#ff4d4f'
                      : selectedPosition.riskRatio >= 0.6
                        ? '#faad14'
                        : '#52c41a'
                  "
                />
              </a-descriptions-item>
              <a-descriptions-item label="Created At">
                {{ formatDate(selectedPosition.createdAt) }}
              </a-descriptions-item>
              <a-descriptions-item label="Updated At">
                {{ formatDate(selectedPosition.updatedAt) }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </div>
      </a-spin>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SearchOutlined, ExportOutlined } from '@ant-design/icons-vue'
import LiquidationRadar from '@/widgets/risk/LiquidationRadar.vue'
import PositionTable from '@/tables/orders/PositionTable.vue'
import type { Position, PositionQueryParams } from '@/services/api/facade'
import { useOrdersStore } from '@/stores/orders'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/format'

const router = useRouter()
const ordersStore = useOrdersStore()

// Filters
const filters = reactive<PositionQueryParams>({
  symbol: undefined,
  side: undefined,
  userId: undefined,
  riskRatioMin: undefined,
  riskRatioMax: undefined,
})

const appliedFilters = ref<PositionQueryParams>({})

// Selection
const selectedPositions = ref<Position[]>([])

// Detail Drawer
const detailDrawerOpen = ref(false)
const selectedPosition = ref<Position | null>(null)
const detailLoading = ref(false)

// Computed Stats
const highRiskCount = computed(() => {
  return ordersStore.positions.filter((p) => p.riskRatio >= 0.6).length
})

const totalUnrealizedPnl = computed(() => {
  return ordersStore.positions.reduce((sum, p) => sum + parseFloat(p.unrealizedPnl), 0)
})

const avgRiskRatio = computed(() => {
  if (ordersStore.positions.length === 0) return 0
  const sum = ordersStore.positions.reduce((sum, p) => sum + p.riskRatio, 0)
  return (sum / ordersStore.positions.length) * 100
})

function handleSearch() {
  appliedFilters.value = { ...filters }
}

function handleReset() {
  filters.symbol = undefined
  filters.side = undefined
  filters.userId = undefined
  filters.riskRatioMin = undefined
  filters.riskRatioMax = undefined
  appliedFilters.value = {}
}

function handleSelectionChange(rows: Position[]) {
  selectedPositions.value = rows
}

async function handleViewDetail(position: Position) {
  selectedPosition.value = position
  detailDrawerOpen.value = true

  // Optionally fetch full details
  if (position.id) {
    detailLoading.value = true
    try {
      await ordersStore.fetchPositionById(position.id)
      selectedPosition.value = ordersStore.currentPosition
    } finally {
      detailLoading.value = false
    }
  }
}

function handleCloseDetail() {
  detailDrawerOpen.value = false
  selectedPosition.value = null
}

function handleViewUser(userId: string) {
  router.push(`/admin/users/${userId}`)
}

async function handleBatchExport() {
  await ordersStore.exportPositions({
    ...appliedFilters.value,
  })
}
</script>

<style scoped>
.positions-page {
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

.position-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
