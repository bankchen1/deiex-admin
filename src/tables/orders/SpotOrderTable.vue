<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :row-selection="rowSelection"
    :fetch-data="fetchData"
    :enable-export="true"
    :enable-column-config="true"
    @export="handleExport"
  >
    <template #toolbar>
      <slot name="toolbar" />
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { Tag } from 'ant-design-vue'
import ServerTable from '@/shared/ServerTable.vue'
import type { TableColumn } from '@/types/components'
import type { Order, OrderQueryParams } from '@/services/api/orders'
import { useOrdersStore } from '@/stores/orders'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/format'

interface Props {
  filters?: OrderQueryParams
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'view-detail', order: Order): void
  (e: 'selection-change', selectedRows: Order[]): void
}>()

const ordersStore = useOrdersStore()

const columns = ref<TableColumn[]>([
  {
    key: 'id',
    title: 'Order ID',
    dataIndex: 'id',
    width: 180,
    fixed: 'left',
  },
  {
    key: 'userId',
    title: 'User ID',
    dataIndex: 'userId',
    width: 150,
  },
  {
    key: 'userNickname',
    title: 'Nickname',
    dataIndex: 'userNickname',
    width: 120,
  },
  {
    key: 'symbol',
    title: 'Trading Pair',
    dataIndex: 'symbol',
    width: 120,
    filterable: true,
    filterType: 'input',
  },
  {
    key: 'side',
    title: 'Direction',
    dataIndex: 'side',
    width: 100,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Buy', value: 'buy' },
      { label: 'Sell', value: 'sell' },
    ],
    render: (value: string) => {
      const color = value === 'buy' ? 'green' : 'red'
      const text = value === 'buy' ? 'Buy' : 'Sell'
      return h(Tag, { color }, () => text)
    },
  },
  {
    key: 'orderType',
    title: 'Order Type',
    dataIndex: 'orderType',
    width: 120,
    render: (value: string) => {
      const typeMap: Record<string, string> = {
        limit: 'Limit',
        market: 'Market',
        'stop-limit': 'Stop Limit',
        'stop-market': 'Stop Market',
      }
      return typeMap[value] || value
    },
  },
  {
    key: 'price',
    title: 'Price',
    dataIndex: 'price',
    width: 120,
    align: 'right',
    render: (value: string) => (value ? formatNumber(value, 8) : '-'),
  },
  {
    key: 'quantity',
    title: 'Quantity',
    dataIndex: 'quantity',
    width: 120,
    align: 'right',
    render: (value: string) => formatNumber(value, 8),
  },
  {
    key: 'filled',
    title: 'Filled',
    dataIndex: 'filled',
    width: 120,
    align: 'right',
    render: (value: string, record: Order) => {
      const filledPercent = (parseFloat(value) / parseFloat(record.quantity)) * 100
      return `${formatNumber(value, 8)} (${filledPercent.toFixed(1)}%)`
    },
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    width: 120,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Pending', value: 'pending' },
      { label: 'Partial', value: 'partial' },
      { label: 'Filled', value: 'filled' },
      { label: 'Cancelled', value: 'cancelled' },
      { label: 'Rejected', value: 'rejected' },
    ],
    render: (value: string) => {
      const statusConfig: Record<string, { color: string; text: string }> = {
        pending: { color: 'blue', text: 'Pending' },
        partial: { color: 'orange', text: 'Partial' },
        filled: { color: 'green', text: 'Filled' },
        cancelled: { color: 'default', text: 'Cancelled' },
        rejected: { color: 'red', text: 'Rejected' },
      }
      const config = statusConfig[value] || { color: 'default', text: value }
      return h(Tag, { color: config.color }, () => config.text)
    },
  },
  {
    key: 'errorCode',
    title: 'Error Code',
    dataIndex: 'errorCode',
    width: 120,
    render: (value: string) => value || '-',
  },
  {
    key: 'matchingLatency',
    title: 'Latency (ms)',
    dataIndex: 'matchingLatency',
    width: 120,
    align: 'right',
    sortable: true,
    render: (value: number) => (value ? value.toFixed(2) : '-'),
  },
  {
    key: 'createdAt',
    title: 'Created At',
    dataIndex: 'createdAt',
    width: 180,
    sortable: true,
    render: (value: string) => formatDate(value),
  },
  {
    key: 'actions',
    title: 'Actions',
    dataIndex: 'actions',
    width: 100,
    fixed: 'right',
    render: (_: unknown, record: Order) =>
      h('a', { onClick: () => handleViewDetail(record) }, 'View'),
  },
])

const dataSource = computed(() => ordersStore.spotOrders)
const loading = computed(() => ordersStore.spotOrdersLoading)

const pagination = computed(() => ({
  total: ordersStore.spotOrdersTotal,
  current: 1,
  pageSize: 20,
}))

const rowSelection = computed(() => ({
  type: 'checkbox' as const,
  onChange: (_: string[], selectedRows: Order[]) => {
    emit('selection-change', selectedRows)
  },
}))

async function fetchData(params: any) {
  const queryParams: OrderQueryParams = {
    ...props.filters,
    page: params.page,
    pageSize: params.pageSize,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    ...params.filters,
  }

  const response = await ordersStore.fetchSpotOrders(queryParams)
  return {
    data: response.data,
    total: response.total,
  }
}

function handleViewDetail(order: Order) {
  emit('view-detail', order)
}

async function handleExport(params: any) {
  const queryParams: OrderQueryParams = {
    ...props.filters,
    ...params.filters,
  }
  await ordersStore.exportSpotOrders(queryParams)
}
</script>
