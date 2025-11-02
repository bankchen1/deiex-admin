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
import type { FinanceDailyData } from '@/types/api'
import { formatNumber, formatCurrency } from '@/utils/format'

interface Props {
  dataSource: FinanceDailyData[]
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
    key: 'deposits',
    title: 'Deposits (USD)',
    dataIndex: 'deposits',
    width: 150,
    render: (value: string) => formatCurrency(value),
  },
  {
    key: 'withdrawals',
    title: 'Withdrawals (USD)',
    dataIndex: 'withdrawals',
    width: 150,
    render: (value: string) => formatCurrency(value),
  },
  {
    key: 'netInflow',
    title: 'Net Inflow (USD)',
    dataIndex: 'netInflow',
    width: 150,
    render: (value: string) => formatCurrency(value),
  },
  {
    key: 'tradingFees',
    title: 'Trading Fees (USD)',
    dataIndex: 'tradingFees',
    width: 150,
    render: (value: string) => formatCurrency(value),
  },
  {
    key: 'withdrawalFees',
    title: 'Withdrawal Fees (USD)',
    dataIndex: 'withdrawalFees',
    width: 150,
    render: (value: string) => formatCurrency(value),
  },
  {
    key: 'fundingSettlements',
    title: 'Funding Settlements (USD)',
    dataIndex: 'fundingSettlements',
    width: 180,
    render: (value: string) => formatCurrency(value),
  },
  {
    key: 'totalFees',
    title: 'Total Fees (USD)',
    dataIndex: 'totalFees',
    width: 150,
    render: (value: string) => formatCurrency(value),
  },
  {
    key: 'depositCount',
    title: 'Deposit Count',
    dataIndex: 'depositCount',
    width: 120,
    render: (value: number) => formatNumber(value),
  },
  {
    key: 'withdrawalCount',
    title: 'Withdrawal Count',
    dataIndex: 'withdrawalCount',
    width: 140,
    render: (value: number) => formatNumber(value),
  },
])

function handleExport() {
  emit('export')
}
</script>
