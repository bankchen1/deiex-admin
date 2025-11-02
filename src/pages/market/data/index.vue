<template>
  <div class="market-dashboard">
    <a-page-header title="Market Dashboard" sub-title="Real-time market data and analytics">
      <template #extra>
        <a-space>
          <a-select
            v-model:value="selectedSymbol"
            style="width: 200px"
            placeholder="Select trading pair"
            :options="symbolOptions"
            @change="handleSymbolChange"
          />
          <a-button @click="handleRefresh">
            <template #icon>
              <ReloadOutlined />
            </template>
            Refresh
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- Market Summary Cards -->
    <a-row :gutter="16" class="summary-section">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Last Price"
            :value="marketData.lastPrice"
            :precision="marketData.pricePrecision"
            :value-style="{ color: marketData.priceChange.startsWith('-') ? '#ff4d4f' : '#52c41a' }"
          >
            <template #prefix>
              <span class="currency-symbol">{{ marketData.quote }}</span>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="24h Change"
            :value="parseFloat(marketData.priceChangePercent)"
            :precision="2"
            suffix="%"
            :value-style="{ color: marketData.priceChange.startsWith('-') ? '#ff4d4f' : '#52c41a' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="24h High"
            :value="marketData.highPrice"
            :precision="marketData.pricePrecision"
          >
            <template #prefix>
              <span class="currency-symbol">{{ marketData.quote }}</span>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="24h Volume"
            :value="marketData.volume"
            :precision="marketData.volumePrecision"
          >
            <template #prefix>
              <span class="currency-symbol">{{ marketData.base }}</span>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- Chart and Order Book -->
    <a-row :gutter="16" class="main-content">
      <a-col :span="16">
        <a-card title="Price Chart" :bordered="false" class="chart-card">
          <template #extra>
            <a-select
              v-model:value="chartInterval"
              size="small"
              style="width: 120px"
              @change="handleIntervalChange"
            >
              <a-select-option value="1m">1 Minute</a-select-option>
              <a-select-option value="5m">5 Minutes</a-select-option>
              <a-select-option value="15m">15 Minutes</a-select-option>
              <a-select-option value="1h">1 Hour</a-select-option>
              <a-select-option value="4h">4 Hours</a-select-option>
              <a-select-option value="1d">1 Day</a-select-option>
            </a-select>
          </template>
          <KlineChart :symbol="selectedSymbol" :interval="chartInterval" :height="400" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="Order Book" :bordered="false" class="orderbook-card">
          <MarketDepth :symbol="selectedSymbol" :height="400" />
        </a-card>
      </a-col>
    </a-row>

    <!-- Market Trades -->
    <a-row :gutter="16" class="trades-section">
      <a-col :span="24">
        <a-card title="Market Trades" :bordered="false" class="trades-card">
          <MarketTrades :symbol="selectedSymbol" :limit="50" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import KlineChart from '@/widgets/charts/KlineChart.vue'
import MarketDepth from '@/widgets/market/MarketDepth.vue'
import MarketTrades from '@/widgets/market/MarketTrades.vue'
import type { MarketSummary } from '@/types/models'

// Mock data for demonstration
const mockMarketData: Record<string, MarketSummary> = {
  'BTC/USDT': {
    symbol: 'BTC/USDT',
    displayName: { en: 'Bitcoin / Tether' },
    base: 'BTC',
    quote: 'USDT',
    lastPrice: '35000.50',
    priceChange: '1250.25',
    priceChangePercent: '3.70',
    highPrice: '35500.00',
    lowPrice: '34200.00',
    volume: '12500.50',
    quoteVolume: '437517500.00',
    volumePrecision: 4,
    pricePrecision: 2,
    status: 'trading',
  },
  'ETH/USDT': {
    symbol: 'ETH/USDT',
    displayName: { en: 'Ethereum / Tether' },
    base: 'ETH',
    quote: 'USDT',
    lastPrice: '2800.75',
    priceChange: '-45.25',
    priceChangePercent: '-1.59',
    highPrice: '2850.00',
    lowPrice: '2780.00',
    volume: '45000.25',
    quoteVolume: '126000700.00',
    volumePrecision: 4,
    pricePrecision: 2,
    status: 'trading',
  },
}

// State
const selectedSymbol = ref('BTC/USDT')
const chartInterval = ref('1h')
const marketData = ref<MarketSummary>(mockMarketData['BTC/USDT'])

// Options
const symbolOptions = [
  { label: 'BTC/USDT', value: 'BTC/USDT' },
  { label: 'ETH/USDT', value: 'ETH/USDT' },
  { label: 'BNB/USDT', value: 'BNB/USDT' },
  { label: 'XRP/USDT', value: 'XRP/USDT' },
]

// Lifecycle
onMounted(() => {
  startDataPolling()
})

onUnmounted(() => {
  stopDataPolling()
})

// Methods
let pollingTimer: NodeJS.Timeout | null = null

function startDataPolling() {
  // In a real implementation, this would connect to WebSocket or poll API
  pollingTimer = setInterval(() => {
    // Update market data with random changes for demo
    updateMarketData()
  }, 5000)
}

function stopDataPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

function updateMarketData() {
  const data = { ...mockMarketData[selectedSymbol.value] }

  // Simulate price changes for demo
  const changePercent = (Math.random() - 0.5) * 0.1 // -5% to +5%
  const change = parseFloat(data.lastPrice) * changePercent
  const newPrice = parseFloat(data.lastPrice) + change

  data.lastPrice = newPrice.toFixed(data.pricePrecision)
  data.priceChange = change.toFixed(data.pricePrecision)
  data.priceChangePercent = (changePercent * 100).toFixed(2)

  marketData.value = data
}

function handleSymbolChange(value: string) {
  selectedSymbol.value = value
  marketData.value = mockMarketData[value]
}

function handleIntervalChange(value: string) {
  chartInterval.value = value
}

function handleRefresh() {
  updateMarketData()
}
</script>

<style scoped>
.market-dashboard {
  padding: 24px;
}

.summary-section {
  margin-bottom: 24px;
}

.main-content {
  margin-bottom: 24px;
}

.currency-symbol {
  font-size: 14px;
  color: #666;
}

.chart-card,
.orderbook-card,
.trades-card {
  height: 100%;
}
</style>
