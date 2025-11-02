import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import type * as echarts from 'echarts'

type EChartsInstance = echarts.ECharts
type EChartsOption = echarts.EChartsOption

/**
 * Composable for lazy loading ECharts
 * This reduces initial bundle size by loading ECharts only when needed
 */
export function useLazyECharts(containerRef: Ref<HTMLElement | null>) {
  const chartInstance = ref<EChartsInstance | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  let echartsModule: typeof echarts | null = null

  const initChart = async () => {
    if (!containerRef.value) {
      error.value = 'Container element not found'
      loading.value = false
      return
    }

    try {
      // Lazy load ECharts module
      if (!echartsModule) {
        echartsModule = await import('echarts')
      }

      // Initialize chart instance
      chartInstance.value = echartsModule.init(containerRef.value)
      loading.value = false
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load ECharts'
      loading.value = false
      console.error('Failed to initialize ECharts:', e)
    }
  }

  const setOption = (option: EChartsOption, notMerge?: boolean, lazyUpdate?: boolean) => {
    if (chartInstance.value) {
      chartInstance.value.setOption(option, notMerge, lazyUpdate)
    }
  }

  const resize = () => {
    if (chartInstance.value) {
      chartInstance.value.resize()
    }
  }

  const dispose = () => {
    if (chartInstance.value) {
      chartInstance.value.dispose()
      chartInstance.value = null
    }
  }

  onMounted(() => {
    initChart()

    // Handle window resize
    window.addEventListener('resize', resize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resize)
    dispose()
  })

  return {
    chartInstance,
    loading,
    error,
    setOption,
    resize,
    dispose,
  }
}
