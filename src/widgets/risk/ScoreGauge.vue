<template>
  <div ref="chartRef" class="score-gauge" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

interface Props {
  score: number
  width?: string
  height?: string
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '300px',
  title: 'KYC Score',
})

const chartRef = ref<HTMLElement>()
let chartInstance: ECharts | null = null

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

watch(
  () => props.score,
  () => {
    updateChart()
  }
)

function initChart() {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.3, '#f5222d'],
              [0.7, '#faad14'],
              [1, '#52c41a'],
            ],
          },
        },
        pointer: {
          itemStyle: {
            color: 'auto',
          },
        },
        axisTick: {
          distance: -20,
          length: 8,
          lineStyle: {
            color: '#fff',
            width: 2,
          },
        },
        splitLine: {
          distance: -20,
          length: 20,
          lineStyle: {
            color: '#fff',
            width: 4,
          },
        },
        axisLabel: {
          color: 'inherit',
          distance: 25,
          fontSize: 12,
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          color: 'inherit',
          fontSize: 32,
          offsetCenter: [0, '70%'],
        },
        title: {
          show: true,
          offsetCenter: [0, '90%'],
          fontSize: 14,
          color: '#666',
        },
        data: [
          {
            value: props.score,
            name: props.title,
          },
        ],
      },
    ],
  }

  chartInstance.setOption(option)

  // Handle window resize
  window.addEventListener('resize', handleResize)
}

function updateChart() {
  if (!chartInstance) return

  chartInstance.setOption({
    series: [
      {
        data: [
          {
            value: props.score,
            name: props.title,
          },
        ],
      },
    ],
  })
}

function handleResize() {
  chartInstance?.resize()
}
</script>

<style scoped>
.score-gauge {
  min-height: 200px;
}
</style>
