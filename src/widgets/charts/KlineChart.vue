<template>
  <div ref="chartRef" class="kline-chart" :style="{ height: height + 'px' }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'
import type { KlineData } from '@/contracts/market'

interface Props {
  symbol: string
  interval: string
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
})

// State
const chartRef = ref<HTMLElement>()
let chartInstance: EChartsType | null = null
let dataTimer: NodeJS.Timeout | null = null

// Mock data for demonstration
const generateMockKlineData = (): KlineData[] => {
  const data: KlineData[] = []
  const now = Date.now()
  let basePrice = 35000

  for (let i = 0; i < 100; i++) {
    const openTime = now - (100 - i) * 60 * 60 * 1000 // 1 hour intervals
    const open = basePrice
    const change = (Math.random() - 0.5) * 200
    const close = open + change
    const high = Math.max(open, close) + Math.random() * 100
    const low = Math.min(open, close) - Math.random() * 100
    const volume = Math.random() * 100 + 50

    data.push({
      openTime,
      open: open.toFixed(2),
      high: high.toFixed(2),
      low: low.toFixed(2),
      close: close.toFixed(2),
      volume: volume.toFixed(2),
      closeTime: openTime + 60 * 60 * 1000,
      quoteVolume: (volume * close).toFixed(2),
      trades: Math.floor(Math.random() * 100) + 50,
      takerBuyBaseVolume: (volume * Math.random()).toFixed(2),
      takerBuyQuoteVolume: (volume * close * Math.random()).toFixed(2),
    })

    basePrice = close
  }

  return data
}

// Lifecycle
onMounted(() => {
  initChart()
  startDataPolling()
})

onUnmounted(() => {
  destroyChart()
  stopDataPolling()
})

// Watchers
watch(
  () => [props.symbol, props.interval],
  () => {
    updateChartData()
  }
)

// Methods
function initChart() {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    updateChartData()
  }
}

function destroyChart() {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}

function updateChartData() {
  if (!chartInstance) return

  const klineData = generateMockKlineData()

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    grid: {
      left: 60,
      right: 60,
      top: 20,
      bottom: 60,
    },
    xAxis: {
      type: 'category',
      data: klineData.map((item) => new Date(item.openTime).toLocaleTimeString()),
      scale: true,
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax',
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: true,
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 50,
        end: 100,
      },
      {
        show: true,
        type: 'slider',
        top: '90%',
        start: 50,
        end: 100,
      },
    ],
    series: [
      {
        name: 'Kline',
        type: 'candlestick',
        data: klineData.map((item) => [
          parseFloat(item.open),
          parseFloat(item.close),
          parseFloat(item.low),
          parseFloat(item.high),
        ]),
        itemStyle: {
          color: '#ef232a',
          color0: '#14b143',
          borderColor: '#ef232a',
          borderColor0: '#14b143',
        },
      },
    ],
  }

  chartInstance.setOption(option, true)
}

function startDataPolling() {
  // In a real implementation, this would connect to WebSocket or poll API
  dataTimer = setInterval(() => {
    // Update chart with new data
    updateChartData()
  }, 30000) // Update every 30 seconds
}

function stopDataPolling() {
  if (dataTimer) {
    clearInterval(dataTimer)
    dataTimer = null
  }
}
</script>

<style scoped>
.kline-chart {
  width: 100%;
}
</style>
