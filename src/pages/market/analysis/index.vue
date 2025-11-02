<template>
  <div class="market-analysis-page">
    <a-page-header title="Market Analysis" sub-title="Comprehensive market analysis and insights">
      <template #extra>
        <a-space>
          <a-range-picker
            v-model:value="dateRange"
            format="YYYY-MM-DD"
            @change="handleDateChange"
          />
          <a-button @click="handleRefresh">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
          <a-button @click="handleExport">
            <template #icon><DownloadOutlined /></template>
            Export Report
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- Summary Cards -->
    <a-row :gutter="16" class="summary-section">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Market Cap"
            :value="summary.marketCap"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#1890ff' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="24h Volume"
            :value="summary.volume24h"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#52c41a' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="BTC Dominance"
            :value="summary.btcDominance"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#722ed1' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Fear & Greed"
            :value="summary.fearGreedIndex"
            :precision="0"
            :value-style="{ color: getFearGreedColor(summary.fearGreedIndex) }"
          >
            <template #suffix>
              <span class="index-label">{{ getFearGreedLabel(summary.fearGreedIndex) }}</span>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- Charts Section -->
    <a-row :gutter="16" class="charts-section">
      <a-col :span="16">
        <a-card title="Market Cap Trend" :bordered="false">
          <div ref="marketCapChartRef" style="height: 400px" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="Top Gainers/Losers" :bordered="false">
          <div ref="topMoversChartRef" style="height: 400px" />
        </a-card>
      </a-col>
    </a-row>

    <!-- Market Overview -->
    <a-row :gutter="16" class="overview-section">
      <a-col :span="24">
        <a-card title="Market Overview" :bordered="false">
          <a-tabs v-model:active-key="activeTab">
            <a-tab-pane key="1" tab="Top Cryptocurrencies">
              <a-table
                :data-source="topCryptos"
                :columns="cryptoColumns"
                :pagination="false"
                size="small"
                row-key="symbol"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'symbol'">
                    <div class="crypto-symbol">
                      <img :src="record.logo" :alt="record.name" class="crypto-logo" />
                      <div>
                        <div class="crypto-name">{{ record.name }}</div>
                        <div class="crypto-ticker">{{ record.symbol }}</div>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="column.key === 'price'">
                    <span class="price">${{ record.price.toFixed(2) }}</span>
                  </template>
                  <template v-else-if="column.key === 'change24h'">
                    <span :class="getChangeClass(record.change24h)"
                      >{{ record.change24h > 0 ? '+' : '' }}{{ record.change24h.toFixed(2) }}%</span
                    >
                  </template>
                  <template v-else-if="column.key === 'volume24h'">
                    <span>${{ formatNumber(record.volume24h) }}</span>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane key="2" tab="Market Sectors">
              <a-table
                :data-source="marketSectors"
                :columns="sectorColumns"
                :pagination="false"
                size="small"
                row-key="sector"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'sector'">
                    <span class="sector-name">{{ record.sector }}</span>
                  </template>
                  <template v-else-if="column.key === 'change24h'">
                    <span :class="getChangeClass(record.change24h)"
                      >{{ record.change24h > 0 ? '+' : '' }}{{ record.change24h.toFixed(2) }}%</span
                    >
                  </template>
                  <template v-else-if="column.key === 'marketCap'">
                    <span>${{ formatNumber(record.marketCap) }}</span>
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>

    <!-- Analysis Insights -->
    <a-row :gutter="16" class="insights-section">
      <a-col :span="24">
        <a-card title="Market Insights" :bordered="false">
          <a-list :data-source="insights" :split="false">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <div class="insight-title">
                      <a-tag :color="getInsightTypeColor(item.type)">{{ item.type }}</a-tag>
                      {{ item.title }}
                    </div>
                  </template>
                  <template #description>
                    <div class="insight-description">{{ item.description }}</div>
                    <div class="insight-timestamp">{{ formatDate(item.timestamp) }}</div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import dayjs, { Dayjs } from 'dayjs'

// Types
interface CryptoAsset {
  symbol: string
  name: string
  logo: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
}

interface MarketSector {
  sector: string
  change24h: number
  marketCap: number
  assets: number
}

interface MarketInsight {
  id: string
  type: 'bullish' | 'bearish' | 'neutral' | 'warning'
  title: string
  description: string
  timestamp: string
}

// State
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(7, 'days'), dayjs()])
const activeTab = ref('1')
const marketCapChartRef = ref<HTMLDivElement>()
const topMoversChartRef = ref<HTMLDivElement>()
let marketCapChart: echarts.ECharts | null = null
let topMoversChart: echarts.ECharts | null = null

// Summary data
const summary = reactive({
  marketCap: 2150000000000,
  volume24h: 85000000000,
  btcDominance: 48.5,
  fearGreedIndex: 62,
})

// Mock data
const topCryptos = ref<CryptoAsset[]>([
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    price: 42500.5,
    change24h: 2.5,
    volume24h: 25000000000,
    marketCap: 830000000000,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    price: 2800.75,
    change24h: -1.2,
    volume24h: 15000000000,
    marketCap: 340000000000,
  },
  {
    symbol: 'BNB',
    name: 'Binance Coin',
    logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    price: 310.25,
    change24h: 3.8,
    volume24h: 2500000000,
    marketCap: 48000000000,
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    logo: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    price: 95.5,
    change24h: 5.2,
    volume24h: 3500000000,
    marketCap: 42000000000,
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    logo: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
    price: 0.52,
    change24h: -0.8,
    volume24h: 1800000000,
    marketCap: 29000000000,
  },
])

const marketSectors = ref<MarketSector[]>([
  {
    sector: 'Payments',
    change24h: 2.5,
    marketCap: 950000000000,
    assets: 45,
  },
  {
    sector: 'DeFi',
    change24h: -1.2,
    marketCap: 65000000000,
    assets: 120,
  },
  {
    sector: 'NFT',
    change24h: 5.8,
    marketCap: 25000000000,
    assets: 85,
  },
  {
    sector: 'Web3',
    change24h: 3.2,
    marketCap: 42000000000,
    assets: 75,
  },
  {
    sector: 'Gaming',
    change24h: -2.1,
    marketCap: 18000000000,
    assets: 60,
  },
])

const insights = ref<MarketInsight[]>([
  {
    id: 'insight-001',
    type: 'bullish',
    title: 'Bitcoin shows strong momentum above $42,000',
    description:
      'Bitcoin has maintained strong support above $42,000 and shows signs of continued upward momentum with increasing trading volume.',
    timestamp: '2024-01-15 10:30:00',
  },
  {
    id: 'insight-002',
    type: 'warning',
    title: 'Ethereum gas fees spike during peak hours',
    description:
      'Network congestion on Ethereum has led to increased gas fees during peak trading hours, potentially affecting user experience.',
    timestamp: '2024-01-15 09:15:00',
  },
  {
    id: 'insight-003',
    type: 'neutral',
    title: 'Solana network performance remains stable',
    description:
      'Solana network has shown consistent performance with low transaction fees and fast confirmation times over the past 24 hours.',
    timestamp: '2024-01-15 08:45:00',
  },
])

// Columns
const cryptoColumns = [
  {
    title: 'Asset',
    dataIndex: 'symbol',
    key: 'symbol',
    width: 200,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    width: 120,
  },
  {
    title: '24h Change',
    dataIndex: 'change24h',
    key: 'change24h',
    width: 120,
  },
  {
    title: '24h Volume',
    dataIndex: 'volume24h',
    key: 'volume24h',
    width: 150,
  },
  {
    title: 'Market Cap',
    dataIndex: 'marketCap',
    key: 'marketCap',
    width: 150,
  },
]

const sectorColumns = [
  {
    title: 'Sector',
    dataIndex: 'sector',
    key: 'sector',
    width: 150,
  },
  {
    title: '24h Change',
    dataIndex: 'change24h',
    key: 'change24h',
    width: 120,
  },
  {
    title: 'Market Cap',
    dataIndex: 'marketCap',
    key: 'marketCap',
    width: 150,
  },
  {
    title: 'Assets',
    dataIndex: 'assets',
    key: 'assets',
    width: 100,
  },
]

// Methods
function getFearGreedColor(index: number): string {
  if (index >= 75) return '#52c41a' // Greed
  if (index >= 50) return '#1890ff' // Neutral
  if (index >= 25) return '#faad14' // Fear
  return '#ff4d4f' // Extreme Fear
}

function getFearGreedLabel(index: number): string {
  if (index >= 75) return 'Greed'
  if (index >= 50) return 'Neutral'
  if (index >= 25) return 'Fear'
  return 'Extreme Fear'
}

function getChangeClass(change: number): string {
  return change >= 0 ? 'text-green' : 'text-red'
}

function getInsightTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    bullish: 'green',
    bearish: 'red',
    neutral: 'blue',
    warning: 'orange',
  }
  return colorMap[type] || 'default'
}

function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K'
  }
  return num.toFixed(2)
}

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

function handleRefresh() {
  console.log('Refreshing market analysis')
}

function handleExport() {
  console.log('Exporting market analysis report')
}

function handleDateChange(dates: [Dayjs, Dayjs] | null) {
  if (dates) {
    console.log('Date range changed:', dates)
  }
}

function initCharts() {
  if (marketCapChartRef.value) {
    marketCapChart = echarts.init(marketCapChartRef.value)
    const marketCapOption = {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      yAxis: {
        type: 'value',
        name: 'Market Cap (Trillion $)',
      },
      series: [
        {
          data: [2.0, 2.1, 2.2, 2.1, 2.3, 2.4, 2.3, 2.2, 2.1, 2.2, 2.1, 2.15],
          type: 'line',
          smooth: true,
          areaStyle: {},
        },
      ],
    }
    marketCapChart.setOption(marketCapOption)
  }

  if (topMoversChartRef.value) {
    topMoversChart = echarts.init(topMoversChartRef.value)
    const topMoversOption = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Top Gainers',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 45, name: 'SOL' },
            { value: 25, name: 'BNB' },
            { value: 15, name: 'ADA' },
            { value: 10, name: 'DOT' },
            { value: 5, name: 'AVAX' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
    topMoversChart.setOption(topMoversOption)
  }
}

function resizeCharts() {
  if (marketCapChart) marketCapChart.resize()
  if (topMoversChart) topMoversChart.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', resizeCharts)
})

onUnmounted(() => {
  if (marketCapChart) marketCapChart.dispose()
  if (topMoversChart) topMoversChart.dispose()
  window.removeEventListener('resize', resizeCharts)
})
</script>

<style scoped>
.market-analysis-page {
  padding: 24px;
}

.summary-section {
  margin-bottom: 24px;
}

.index-label {
  font-size: 12px;
  margin-left: 8px;
}

.charts-section {
  margin-bottom: 24px;
}

.overview-section {
  margin-bottom: 24px;
}

.insights-section {
  margin-bottom: 24px;
}

.crypto-symbol {
  display: flex;
  align-items: center;
}

.crypto-logo {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.crypto-name {
  font-weight: 500;
}

.crypto-ticker {
  font-size: 12px;
  color: #8c8c8c;
}

.price {
  font-weight: 500;
}

.text-green {
  color: #52c41a;
}

.text-red {
  color: #ff4d4f;
}

.insight-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.insight-description {
  color: #595959;
  margin-bottom: 4px;
}

.insight-timestamp {
  font-size: 12px;
  color: #8c8c8c;
}

.sector-name {
  font-weight: 500;
}
</style>
