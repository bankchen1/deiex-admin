<template>
  <a-card :bordered="false" class="time-series-chart" :loading="loading">
    <template #title>
      <div class="chart-header">
        <span>{{ title }}</span>
        <a-radio-group
          v-if="showTimeRange"
          v-model:value="selectedRange"
          size="small"
          @change="handleRangeChange"
        >
          <a-radio-button value="7d">7D</a-radio-button>
          <a-radio-button value="30d">30D</a-radio-button>
          <a-radio-button value="90d">90D</a-radio-button>
        </a-radio-group>
      </div>
    </template>
    <div ref="chartRef" class="chart-container"></div>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface SeriesData {
  name: string
  data: [string, number][]
  color?: string
}

interface Props {
  title: string
  series: SeriesData[]
  loading?: boolean
  showTimeRange?: boolean
  yAxisFormatter?: (value: number) => string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showTimeRange: true,
})

const emit = defineEmits<{
  (e: 'rangeChange', range: string): void
}>()

const chartRef = ref<HTMLElement>()
const chartInstance = ref<echarts.ECharts>()
const selectedRange = ref('7d')

const initChart = () => {
  if (!chartRef.value) return

  chartInstance.value = echarts.init(chartRef.value)

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: props.series.map((s) => s.name),
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: props.yAxisFormatter || ((value: number) => value.toString()),
      },
    },
    series: props.series.map((s) => ({
      name: s.name,
      type: 'line',
      smooth: true,
      data: s.data,
      itemStyle: s.color ? { color: s.color } : undefined,
      lineStyle: s.color ? { color: s.color } : undefined,
      areaStyle: {
        opacity: 0.1,
      },
    })),
  }

  chartInstance.value.setOption(option)
}

const handleResize = () => {
  chartInstance.value?.resize()
}

const handleRangeChange = () => {
  emit('rangeChange', selectedRange.value)
}

watch(
  () => props.series,
  () => {
    nextTick(() => {
      initChart()
    })
  },
  { deep: true }
)

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance.value?.dispose()
})
</script>

<style scoped>
.time-series-chart {
  height: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  width: 100%;
  height: 350px;
}
</style>
