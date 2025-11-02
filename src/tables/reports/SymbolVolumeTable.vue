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
import { computed, h } from 'vue'
import { Tag } from 'ant-design-vue'
import ServerTable from '@/shared/ServerTable.vue'
import type { TableColumn } from '@/types/components'
import type { SymbolVolumeData } from '@/types/api'
import { formatNumber, formatCurrency, formatPercent } from '@/utils/format'

interface Props {
  dataSource: SymbolVolumeData[]
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
    key: 'symbol',
    title: 'Symbol',
    dataIndex: 'symbol',
    width: 150,
    fixed: 'left',
  },
  {
    key: 'volume',
    title: 'Volume (USD)',
    dataIndex: 'volume',
    width: 180,
    sortable: true,
    render: (value: string) => formatCurrency(value),
  },
  {
    key: 'trades',
    title: 'Trades',
    dataIndex: 'trades',
    width: 120,
    sortable: true,
    render: (value: number) => formatNumber(value),
  },
  {
    key: 'percentage',
    title: 'Market Share',
    dataIndex: 'percentage',
    width: 120,
    render: (value: number) => formatPercent(value),
  },
  {
    key: 'change24h',
    title: '24h Change',
    dataIndex: 'change24h',
    width: 120,
    render: (value: number) => {
      const color = value >= 0 ? 'success' : 'error'
      const prefix = value >= 0 ? '+' : ''
      return h(Tag, { color }, () => `${prefix}${formatPercent(value)}`)
    },
  },
])

function handleExport() {
  emit('export')
}
</script>
