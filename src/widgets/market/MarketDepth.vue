<template>
  <div ref="depthChartRef" class="market-depth" :style="{ height: height + 'px' }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'
import type { MarketDepth } from '@/contracts/market'

interface Props {
  symbol: string
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
})

// State
const depthChartRef = ref<HTMLElement>()
let depthChartInstance: EChartsType | null = null
let depthTimer: NodeJS.Timeout | null = null

// Mock data for demonstration
const generateMockDepthData = (): MarketDepth => {
  const bids: [string, string][] = []
  const asks: [string, string][] = []

  // Generate bids (buy orders)
  let bidPrice = 34950
  let bidAccumulated = 0
  for (let i = 0; i < 50; i++) {
    const quantity = Math.random() * 2 + 0.5
    bidAccumulated += quantity
    bids.push([bidPrice.toFixed(2), bidAccumulated.toFixed(4)])
    bidPrice -= Math.random() * 10 + 1
  }

  // Generate asks (sell orders)
  let askPrice = 35050
  let askAccumulated = 0
  for (let i = 0; i < 50; i++) {
    const quantity = Math.random() * 2 + 0.5
    askAccumulated += quantity
    asks.push([askPrice.toFixed(2), askAccumulated.toFixed(4)])
    askPrice += Math.random() * 10 + 1
  }

  return {
    symbol: props.symbol,
    bids,
    asks,
    lastUpdateId: Date.now(),
  }
}

// Lifecycle
onMounted(() => {
  initDepthChart()
  startDepthPolling()
})

onUnmounted(() => {
  destroyDepthChart()
  stopDepthPolling()
})

// Watchers
watch(
  () => props.symbol,
  () => {
    updateDepthChart()
  }
)

// Methods
function initDepthChart() {
  if (depthChartRef.value) {
    depthChartInstance = echarts.init(depthChartRef.value)
    updateDepthChart()
  }
}

function destroyDepthChart() {
  if (depthChartInstance) {
    depthChartInstance.dispose()
    depthChartInstance = null
  }
}

function updateDepthChart() {
  if (!depthChartInstance) return

  const depthData = generateMockDepthData()

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
      bottom: 40,
    },
    xAxis: {
      type: 'value',
      scale: true,
      splitLine: {
        show: true,
      },
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitLine: {
        show: false,
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: 'Bids',
        type: 'line',
        data: depthData.bids,
        showSymbol: false,
        lineStyle: {
          color: '#14b143',
        },
        areaStyle: {
          color: '#14b143',
          opacity: 0.3,
        },
      },
      {
        name: 'Asks',
        type: 'line',
        data: depthData.asks,
        showSymbol: false,
        lineStyle: {
          color: '#ef232a',
        },
        areaStyle: {
          color: '#ef232a',
          opacity: 0.3,
        },
      },
    ],
  }

  depthChartInstance.setOption(option, true)
}

function startDepthPolling() {
  // In a real implementation, this would connect to WebSocket or poll API
  depthTimer = setInterval(() => {
    // Update depth chart with new data
    updateDepthChart()
  }, 5000) // Update every 5 seconds
}

function stopDepthPolling() {
  if (depthTimer) {
    clearInterval(depthTimer)
    depthTimer = null
  }
}
</script>

<style scoped>
.market-depth {
  width: 100%;
}
</style>
