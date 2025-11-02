<template>
  <div ref="chartRef" class="balance-trend-chart" style="height: 300px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

interface TrendData {
  date: string
  balance: number
}

interface Props {
  data: TrendData[]
}

const props = defineProps<Props>()

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: ECharts | null = null

function initChart() {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const param = params[0]
        return `${param.name}<br/>Balance: $${param.value.toLocaleString()}`
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data.map((item) => item.date),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `$${(value / 1000000).toFixed(1)}M`,
      },
    },
    series: [
      {
        name: 'Balance',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        sampling: 'lttb',
        itemStyle: {
          color: '#1890ff',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(24, 144, 255, 0.3)',
            },
            {
              offset: 1,
              color: 'rgba(24, 144, 255, 0.05)',
            },
          ]),
        },
        data: props.data.map((item) => item.balance),
      },
    ],
  }

  chartInstance.setOption(option)
}

function updateChart() {
  if (!chartInstance) return

  chartInstance.setOption({
    xAxis: {
      data: props.data.map((item) => item.date),
    },
    series: [
      {
        data: props.data.map((item) => item.balance),
      },
    ],
  })
}

function handleResize() {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

watch(
  () => props.data,
  () => {
    updateChart()
  },
  { deep: true }
)
</script>

<style scoped>
.balance-trend-chart {
  width: 100%;
}
</style>
