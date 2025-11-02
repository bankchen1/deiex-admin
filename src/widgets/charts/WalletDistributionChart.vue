<template>
  <div ref="chartRef" class="wallet-distribution-chart" style="height: 300px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

interface DistributionData {
  name: string
  value: number
}

interface Props {
  data: DistributionData[]
}

const props = defineProps<Props>()

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: ECharts | null = null

function initChart() {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ${c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Wallet Balance',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: props.data.map((item) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: item.name === 'Hot Wallet' ? '#faad14' : '#52c41a',
          },
        })),
      },
    ],
  }

  chartInstance.setOption(option)
}

function updateChart() {
  if (!chartInstance) return

  chartInstance.setOption({
    series: [
      {
        data: props.data.map((item) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: item.name === 'Hot Wallet' ? '#faad14' : '#52c41a',
          },
        })),
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
.wallet-distribution-chart {
  width: 100%;
}
</style>
