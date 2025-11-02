<template>
  <div class="redirect-graph">
    <a-spin :spinning="loading">
      <div ref="chartRef" style="width: 100%; height: 500px"></div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface Props {
  data: {
    nodes: Array<{ id: string; name: string; category?: number }>
    edges: Array<{ source: string; target: string; value?: number }>
  } | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value || !props.data) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value)

  const option: EChartsOption = {
    title: {
      text: 'Route Redirect Graph',
      left: 'center',
    },
    tooltip: {
      formatter: (params: any) => {
        if (params.dataType === 'edge') {
          return `${params.data.source} → ${params.data.target}<br/>Redirects: ${params.data.value || 0}`
        }
        return params.data.name
      },
    },
    legend: {
      data: ['Active Routes', 'Deprecated Routes', 'Redirect Chains'],
      bottom: 10,
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: props.data.nodes.map((node) => ({
          id: node.id,
          name: node.name,
          category: node.category || 0,
          symbolSize: 50,
          label: {
            show: true,
          },
        })),
        links: props.data.edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
          value: edge.value || 1,
          lineStyle: {
            width: Math.max(1, (edge.value || 1) / 10),
            curveness: 0.2,
          },
        })),
        categories: [
          { name: 'Active Routes' },
          { name: 'Deprecated Routes' },
          { name: 'Redirect Chains' },
        ],
        roam: true,
        label: {
          position: 'right',
          formatter: '{b}',
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 10,
          },
        },
        force: {
          repulsion: 500,
          edgeLength: [100, 200],
          gravity: 0.1,
        },
      },
    ],
  }

  chartInstance.setOption(option)
}

function handleResize() {
  chartInstance?.resize()
}

watch(
  () => props.data,
  () => {
    initChart()
  },
  { deep: true }
)

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.redirect-graph {
  width: 100%;
  background: #fff;
  padding: 16px;
  border-radius: 4px;
}
</style>
