<template>
  <div class="market-charts">
    <a-page-header title="Market Charts" sub-title="Advanced market analysis and visualization">
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

    <!-- Chart Types -->
    <a-tabs v-model:active-key="activeTab" @change="handleTabChange">
      <a-tab-pane key="kline" tab="K-Line Chart">
        <KlineChart :symbol="selectedSymbol" :interval="chartInterval" :height="500" />
      </a-tab-pane>
      <a-tab-pane key="depth" tab="Market Depth">
        <MarketDepth :symbol="selectedSymbol" :height="500" />
      </a-tab-pane>
      <a-tab-pane key="heatmap" tab="Market Heatmap">
        <MarketHeatmap :symbols="watchlistSymbols" :height="500" />
      </a-tab-pane>
    </a-tabs>

    <!-- Chart Controls -->
    <a-card :bordered="false" class="chart-controls">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form layout="inline">
            <a-form-item label="Interval">
              <a-select
                v-model:value="chartInterval"
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
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :span="8">
          <a-form layout="inline">
            <a-form-item label="Indicators">
              <a-select
                v-model:value="selectedIndicators"
                mode="multiple"
                style="width: 200px"
                placeholder="Select indicators"
                :options="indicatorOptions"
              />
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :span="8">
          <a-space>
            <a-button @click="handleSaveChart">
              <template #icon>
                <SaveOutlined />
              </template>
              Save Chart
            </a-button>
            <a-button @click="handleExportData">
              <template #icon>
                <DownloadOutlined />
              </template>
              Export Data
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ReloadOutlined, SaveOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import KlineChart from '@/widgets/charts/KlineChart.vue'
import MarketDepth from '@/widgets/market/MarketDepth.vue'
import MarketHeatmap from '@/widgets/market/MarketHeatmap.vue'

// State
const selectedSymbol = ref('BTC/USDT')
const activeTab = ref('kline')
const chartInterval = ref('1h')
const selectedIndicators = ref<string[]>(['MA', 'EMA'])

// Options
const symbolOptions = [
  { label: 'BTC/USDT', value: 'BTC/USDT' },
  { label: 'ETH/USDT', value: 'ETH/USDT' },
  { label: 'BNB/USDT', value: 'BNB/USDT' },
  { label: 'XRP/USDT', value: 'XRP/USDT' },
]

const indicatorOptions = [
  { label: 'Moving Average (MA)', value: 'MA' },
  { label: 'Exponential MA (EMA)', value: 'EMA' },
  { label: 'Relative Strength Index (RSI)', value: 'RSI' },
  { label: 'Bollinger Bands', value: 'BB' },
  { label: 'MACD', value: 'MACD' },
  { label: 'Stochastic Oscillator', value: 'STOCH' },
]

const watchlistSymbols = ref([
  'BTC/USDT',
  'ETH/USDT',
  'BNB/USDT',
  'XRP/USDT',
  'ADA/USDT',
  'DOGE/USDT',
  'SOL/USDT',
  'DOT/USDT',
])

// Methods
function handleSymbolChange(value: string) {
  selectedSymbol.value = value
}

function handleTabChange(key: string) {
  activeTab.value = key
}

function handleIntervalChange(value: string) {
  chartInterval.value = value
}

function handleRefresh() {
  // Refresh chart data
  console.log('Refreshing chart data')
}

function handleSaveChart() {
  // Save current chart configuration
  console.log('Saving chart configuration')
}

function handleExportData() {
  // Export chart data
  console.log('Exporting chart data')
}
</script>

<style scoped>
.market-charts {
  padding: 24px;
}

.chart-controls {
  margin-top: 24px;
}
</style>
