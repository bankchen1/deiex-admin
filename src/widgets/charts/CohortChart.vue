<template>
  <div ref="chartRef" :style="{ height: height + 'px' }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'

interface Props {
  data: Array<{
    cohortDate: string
    retentionRates: number[]
  }>
  days: string[]
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 400,
})

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function renderChart() {
  if (!chartRef.value || !props.data || props.data.length === 0) return

  if (!chart) {
    chart = echarts.init(chartRef.value)
  }

  // Prepare heatmap data
  const heatmapData: Array<[number, number, number]> = []
  props.data.forEach((cohort, cohortIndex) => {
    cohort.retentionRates.forEach((rate, dayIndex) => {
      heatmapData.push([dayIndex, cohortIndex, rate])
    })
  })

  const option = {
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const cohort = props.data[params.data[1]]
        const day = props.days[params.data[0]]
        const rate = params.data[2]
        return `${cohort.cohortDate}<br/>${day}: ${(rate * 100).toFixed(1)}%`
      },
    },
    grid: {
      left: 100,
      right: 50,
      top: 50,
      bottom: 80,
    },
    xAxis: {
      type: 'category',
      data: props.days,
      splitArea: {
        show: true,
      },
    },
    yAxis: {
      type: 'category',
      data: props.data.map((item) => item.cohortDate),
      splitArea: {
        show: true,
      },
    },
    visualMap: {
      min: 0,
      max: 1,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 20,
      inRange: {
        color: [
          '#f7fbff',
          '#deebf7',
          '#c6dbef',
          '#9ecae1',
          '#6baed6',
          '#4292c6',
          '#2171b5',
          '#08519c',
          '#08306b',
        ],
      },
      text: ['High', 'Low'],
      formatter: (value: number) => `${(value * 100).toFixed(0)}%`,
    },
    series: [
      {
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true,
          formatter: (params: any) => `${(params.data[2] * 100).toFixed(0)}%`,
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

function handleResize() {
  chart?.resize()
}

onMounted(() => {
  renderChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

watch(
  () => [props.data, props.days],
  () => {
    renderChart()
  },
  { deep: true }
)
</script>
