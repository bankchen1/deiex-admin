<template>
  <div class="market-trades">
    <div class="trades-header">
      <a-button type="text" size="small" @click="refreshTrades">
        <template #icon>
          <ReloadOutlined />
        </template>
        Refresh
      </a-button>
    </div>
    <div class="trades-list">
      <a-table
        :columns="columns"
        :data-source="trades"
        :pagination="false"
        :scroll="{ y: height - 60 }"
        size="small"
        row-key="id"
        :loading="loading"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'price'">
            <span :class="record.side === 'buy' ? 'buy-trade' : 'sell-trade'">
              {{ formatPrice(record.price) }}
            </span>
          </template>
          <template v-else-if="column.key === 'quantity'">
            <span>{{ record.quantity }}</span>
          </template>
          <template v-else-if="column.key === 'side'">
            <a-tag :color="record.side === 'buy' ? 'green' : 'red'">
              {{ record.side.toUpperCase() }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'timestamp'">
            <span class="time-stamp">{{ formatTime(record.timestamp) }}</span>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import { formatDate } from '@/utils/date'
import type { MarketTrade } from '@/contracts/market'

interface Props {
  symbol: string
  limit?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  limit: 50,
  height: 400,
})

// State
const trades = ref<MarketTrade[]>([])
const loading = ref(false)
let tradeTimer: NodeJS.Timeout | null = null

// Mock data for demonstration
const generateMockTrades = (count: number): MarketTrade[] => {
  const trades: MarketTrade[] = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const side: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell'
    const price = 34000 + Math.random() * 2000
    const quantity = Math.random() * 10 + 0.1

    trades.push({
      id: `trade-${now}-${i}`,
      symbol: props.symbol,
      price: price.toFixed(2),
      quantity: quantity.toFixed(6),
      side,
      timestamp: new Date(now - i * 1000).toISOString(),
    })
  }

  return trades
}

// Columns
const columns = computed(() => [
  {
    title: 'Price',
    key: 'price',
  },
  {
    title: 'Quantity',
    key: 'quantity',
  },
  {
    title: 'Side',
    key: 'side',
  },
  {
    title: 'Time',
    key: 'timestamp',
  },
])

// Lifecycle
onMounted(() => {
  loadTrades()
  startTradePolling()
})

onUnmounted(() => {
  stopTradePolling()
})

// Methods
function loadTrades() {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    trades.value = generateMockTrades(props.limit)
    loading.value = false
  }, 500)
}

function refreshTrades() {
  loadTrades()
}

function startTradePolling() {
  // In a real implementation, this would connect to WebSocket or poll API
  tradeTimer = setInterval(() => {
    // Add new trades to the top of the list
    const newTrade = generateMockTrades(1)[0]
    trades.value = [newTrade, ...trades.value.slice(0, props.limit - 1)]
  }, 2000) // Update every 2 seconds
}

function stopTradePolling() {
  if (tradeTimer) {
    clearInterval(tradeTimer)
    tradeTimer = null
  }
}

function formatPrice(price: string) {
  return parseFloat(price).toFixed(2)
}

function formatTime(time: string) {
  return formatDate(time, 'HH:mm:ss')
}
</script>

<style scoped>
.market-trades {
  height: 100%;
}

.trades-header {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

.trades-list {
  height: calc(100% - 48px);
}

.buy-trade {
  color: #52c41a;
}

.sell-trade {
  color: #ff4d4f;
}

.time-stamp {
  font-size: 12px;
  color: #999;
}
</style>
