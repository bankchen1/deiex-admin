<template>
  <div ref="chartRef" :style="{ height: height + 'px' }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'

interface Props {
  data: Array<{
    name: string
    data: number[]
  }>
  xAxisData: string[]
  height?: number
  yAxisName?: string
  yAxisFormatter?: (value: number) => string
}

const props = withDefaults(defineProps<Props>(), {
  height: 350,
  yAxisName: 'Value',
  yAxisFormatter: (value: number) => value.toString(),
})

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function renderChart() {
  if (!chartRef.value || !props.data || props.data.length === 0) return

  if (!chart) {
    chart = echarts.init(chartRef.value)
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: props.data.map((item) => item.name),
    },
    xAxis: {
      type: 'category',
      data: props.xAxisData,
    },
    yAxis: {
      type: 'value',
      name: props.yAxisName,
      axisLabel: {
        formatter: props.yAxisFormatter,
      },
    },
    series: props.data.map((item, index) => ({
      name: item.name,
      type: 'bar',
      stack: 'total',
      data: item.data,
      itemStyle: {
        color: getColor(index),
      },
    })),
  }

  chart.setOption(option)
}

function getColor(index: number): string {
  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2']
  return colors[index % colors.length]
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
  () => [props.data, props.xAxisData],
  () => {
    renderChart()
  },
  { deep: true }
)
</script>
