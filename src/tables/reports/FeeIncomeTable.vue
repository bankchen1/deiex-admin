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
import type { FeeIncomeData } from '@/types/api'
import { formatCurrency, formatPercent } from '@/utils/format'

interface Props {
  dataSource: FeeIncomeData[]
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
    key: 'currency',
    title: 'Currency',
    dataIndex: 'currency',
    width: 120,
    fixed: 'left',
  },
  {
    key: 'tradingFees',
    title: 'Trading Fees (USD)',
    dataIndex: 'tradingFees',
    width: 180,
    sortable: true,
    render: (value: string) => formatCurrency(value),
  },
  {
    key: 'withdrawalFees',
    title: 'Withdrawal Fees (USD)',
    dataIndex: 'withdrawalFees',
    width: 180,
    sortable: true,
    render: (value: string) => formatCurrency(value),
  },
  {
    key: 'totalFees',
    title: 'Total Fees (USD)',
    dataIndex: 'totalFees',
    width: 180,
    sortable: true,
    render: (value: string) => formatCurrency(value),
  },
  {
    key: 'percentage',
    title: 'Percentage',
    dataIndex: 'percentage',
    width: 120,
    render: (value: number) => formatPercent(value),
  },
])

function handleExport() {
  emit('export')
}
</script>
