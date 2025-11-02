<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="false"
    :enable-export="true"
    @export="handleExport"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ServerTable from '@/shared/ServerTable.vue'
import type { TableColumn } from '@/types/components'
import type { TradeDailyData } from '@/types/api'
import { formatNumber, formatCurrency } from '@/utils/format'

interface Props {
  dataSource: TradeDailyData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'export'): void
}>()

const columns = computed<TableColumn[]>(() => [
  {
    key: 'date',
    title: 'Date',
    dataIndex: 'date',
    width: 120,
    fixed: 'left',
  },
  {
    key: 'volume',
    title: 'Total Volume (USD)',
    dataIndex: 'volume',
    width: 150,
    render: (value: string) => formatCurrency(value),
  },
  {
    key: 'trades',
    title: 'Total Trades',
    dataIndex: 'trades',
    width: 120,
    render: (value: number) => formatNumber(value),
  },
  {
    key: 'makerVolume',
    title: 'Maker Volume (USD)',
    dataIndex: 'makerVolume',
    width: 150,
    render: (value: string) => formatCurrency(value),
  },
  {
    key: 'takerVolume',
    title: 'Taker Volume (USD)',
    dataIndex: 'takerVolume',
    width: 150,
    render: (value: string) => formatCurrency(value),
  },
  {
    key: 'makerTrades',
    title: 'Maker Trades',
    dataIndex: 'makerTrades',
    width: 120,
    render: (value: number) => formatNumber(value),
  },
  {
    key: 'takerTrades',
    title: 'Taker Trades',
    dataIndex: 'takerTrades',
    width: 120,
    render: (value: number) => formatNumber(value),
  },
  {
    key: 'avgTradeSize',
    title: 'Avg Trade Size (USD)',
    dataIndex: 'avgTradeSize',
    width: 150,
    render: (value: string) => formatCurrency(value),
  },
  {
    key: 'uniqueUsers',
    title: 'Unique Users',
    dataIndex: 'uniqueUsers',
    width: 120,
    render: (value: number) => formatNumber(value),
  },
])

function handleExport() {
  emit('export')
}
</script>
