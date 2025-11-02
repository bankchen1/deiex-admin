<template>
  <div ref="heatmapRef" class="market-heatmap" :style="{ height: height + 'px' }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface SymbolData {
  symbol: string
  base: string
  quote: string
  price: number
  change: number
  volume: number
}

const props = withDefaults(
  defineProps<{
    symbols?: string[]
    height?: number
  }>(),
  {
    symbols: () => [
      'BTC/USDT',
      'ETH/USDT',
      'BNB/USDT',
      'XRP/USDT',
      'ADA/USDT',
      'DOGE/USDT',
      'SOL/USDT',
      'DOT/USDT',
    ],
    height: 400,
  }
)

const heatmapRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

// Mock data generator
function generateMockData(): SymbolData[] {
  return props.symbols.map((symbol) => {
    const [base, quote] = symbol.split('/')
    return {
      symbol,
      base,
      quote,
      price: parseFloat((Math.random() * 100000).toFixed(2)),
      change: parseFloat(((Math.random() - 0.5) * 20).toFixed(2)),
      volume: parseFloat((Math.random() * 1000000).toFixed(2)),
    }
  })
}

function initChart() {
  if (!heatmapRef.value) return

  chart = echarts.init(heatmapRef.value)

  const data = generateMockData()

  // Prepare heatmap data
  const heatmapData = data.map((item, index) => [
    index % 4, // x axis (row)
    Math.floor(index / 4), // y axis (column)
    item.change, // value (color intensity)
  ])

  // Symbol names for labels
  const symbolNames = data.map((item) => item.symbol)

  const option = {
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const index = params.data[0] + params.data[1] * 4
        const item = data[index]
        return `${item.symbol}<br/>Price: $${item.price.toFixed(2)}<br/>Change: ${item.change > 0 ? '+' : ''}${item.change}%<br/>Volume: ${item.volume.toLocaleString()}`
      },
    },
    grid: {
      height: '80%',
      top: '10%',
    },
    xAxis: {
      type: 'category',
      data: ['Row 1', 'Row 2', 'Row 3', 'Row 4'],
      splitArea: {
        show: true,
      },
    },
    yAxis: {
      type: 'category',
      data: ['Col 1', 'Col 2', 'Col 3'],
      splitArea: {
        show: true,
      },
    },
    visualMap: {
      min: -10,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
    },
    series: [
      {
        name: 'Market Heatmap',
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true,
          formatter: (params: any) => {
            const index = params.data[0] + params.data[1] * 4
            return symbolNames[index]
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }

  chart.setOption(option)
}

function resizeChart() {
  if (chart) {
    chart.resize()
  }
}

watch(
  () => props.height,
  () => {
    resizeChart()
  }
)

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
  if (chart) {
    chart.dispose()
  }
  window.removeEventListener('resize', resizeChart)
})
</script>

<style scoped>
.market-heatmap {
  width: 100%;
}
</style>
