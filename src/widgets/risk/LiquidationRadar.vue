<template>
  <a-card title="Liquidation Risk Radar" :bordered="false">
    <div ref="chartRef" style="width: 100%; height: 400px"></div>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { Position } from '@/services/api/facade'

interface Props {
  positions: Position[]
}

const props = defineProps<Props>()

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    updateChart()
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
})

watch(() => props.positions, updateChart, { deep: true })

function updateChart() {
  if (!chartInstance) return

  // Group positions by risk level
  const riskLevels = {
    critical: props.positions.filter((p) => p.riskRatio >= 0.8),
    high: props.positions.filter((p) => p.riskRatio >= 0.6 && p.riskRatio < 0.8),
    medium: props.positions.filter((p) => p.riskRatio >= 0.4 && p.riskRatio < 0.6),
    low: props.positions.filter((p) => p.riskRatio < 0.4),
  }

  // Prepare data for radar chart
  const indicator = [
    { name: 'Critical Risk\n(≥80%)', max: 100 },
    { name: 'High Risk\n(60-80%)', max: 100 },
    { name: 'Medium Risk\n(40-60%)', max: 100 },
    { name: 'Low Risk\n(<40%)', max: 100 },
  ]

  const data = [
    {
      value: [
        riskLevels.critical.length,
        riskLevels.high.length,
        riskLevels.medium.length,
        riskLevels.low.length,
      ],
      name: 'Position Count',
    },
  ]

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      data: ['Position Count'],
      bottom: 10,
    },
    radar: {
      indicator: indicator,
      shape: 'circle',
      splitNumber: 5,
      axisName: {
        color: '#666',
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: ['#ddd', '#ddd', '#ddd', '#ddd', '#ddd'],
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: [
            'rgba(255, 77, 79, 0.1)',
            'rgba(255, 152, 0, 0.1)',
            'rgba(255, 193, 7, 0.1)',
            'rgba(76, 175, 80, 0.1)',
          ],
        },
      },
    },
    series: [
      {
        name: 'Liquidation Risk',
        type: 'radar',
        data: data,
        areaStyle: {
          color: 'rgba(255, 77, 79, 0.3)',
        },
        lineStyle: {
          color: '#ff4d4f',
          width: 2,
        },
        itemStyle: {
          color: '#ff4d4f',
        },
      },
    ],
  }

  chartInstance.setOption(option)
}
</script>
