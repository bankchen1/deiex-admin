<template>
  <div class="charts-section">
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="12">
        <TimeSeries
          title="Trading Volume"
          :series="tradingVolumeSeries"
          :loading="loading"
          :y-axis-formatter="formatCurrency"
          @range-change="handleRangeChange"
        />
      </a-col>
      <a-col :xs="24" :lg="12">
        <TimeSeries
          title="Funding Rates"
          :series="fundingRatesSeries"
          :loading="loading"
          :y-axis-formatter="formatPercentage"
          @range-change="handleRangeChange"
        />
      </a-col>
      <a-col :xs="24">
        <TimeSeries
          title="Net Inflows (Deposits - Withdrawals)"
          :series="netInflowsSeries"
          :loading="loading"
          :y-axis-formatter="formatCurrency"
          @range-change="handleRangeChange"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TimeSeries from '@/widgets/charts/TimeSeries.vue'
import { formatCurrency as formatCurrencyUtil } from '@/utils/format'
import type { DashboardCharts } from '@/contracts/dashboard'

interface Props {
  charts: DashboardCharts | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'rangeChange', range: string): void
}>()

const tradingVolumeSeries = computed(() => {
  if (!props.charts?.tradingVolume) return []
  return [
    {
      name: 'Trading Volume',
      data: props.charts.tradingVolume.map((item) => [item.timestamp, item.value]),
      color: '#722ed1',
    },
  ]
})

const fundingRatesSeries = computed(() => {
  if (!props.charts?.fundingRates) return []
  return [
    {
      name: 'Funding Rate',
      data: props.charts.fundingRates.map((item) => [item.timestamp, item.value]),
      color: '#1890ff',
    },
  ]
})

const netInflowsSeries = computed(() => {
  if (!props.charts?.netInflows) return []
  return [
    {
      name: 'Net Inflows',
      data: props.charts.netInflows.map((item) => [item.timestamp, item.value]),
      color: '#52c41a',
    },
  ]
})

const formatCurrency = (value: number) => {
  return formatCurrencyUtil(value)
}

const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(4)}%`
}

const handleRangeChange = (range: string) => {
  emit('rangeChange', range)
}
</script>

<style scoped>
.charts-section {
  margin-bottom: 24px;
}
</style>
