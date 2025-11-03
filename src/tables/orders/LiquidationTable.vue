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

<script setup lang="tsx">
import { ref, computed } from 'vue'
import { Tag } from 'ant-design-vue'
import ServerTable from '@/shared/ServerTable.vue'
import type { TableColumn } from '@/types/components'
import type { Liquidation, LiquidationQueryParams } from '@/services/api/orders'
import { useOrdersStore } from '@/stores/orders'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/format'

interface Props {
  filters?: LiquidationQueryParams
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'view-detail', liquidation: Liquidation): void
  (e: 'selection-change', selectedRows: Liquidation[]): void
}>()

const ordersStore = useOrdersStore()

const columns = ref<TableColumn[]>([
  {
    key: 'id',
    title: 'Liquidation ID',
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
    title: 'Side',
    dataIndex: 'side',
    width: 100,
    render: (value: string) => {
      const color = value === 'long' ? 'green' : 'red'
      const text = value === 'long' ? 'Long' : 'Short'
      return <Tag color={color}>{text}</Tag>
    },
  },
  {
    key: 'leverage',
    title: 'Leverage',
    dataIndex: 'leverage',
    width: 100,
    align: 'right',
    render: (value: number) => `${value}x`,
  },
  {
    key: 'entryPrice',
    title: 'Entry Price',
    dataIndex: 'entryPrice',
    width: 130,
    align: 'right',
    render: (value: string) => formatNumber(value, 8),
  },
  {
    key: 'liquidationPrice',
    title: 'Liq. Price',
    dataIndex: 'liquidationPrice',
    width: 130,
    align: 'right',
    render: (value: string) => formatNumber(value, 8),
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
    key: 'loss',
    title: 'Loss',
    dataIndex: 'loss',
    width: 150,
    align: 'right',
    sortable: true,
    render: (value: string, record: Liquidation) => {
      return (
        <div>
          <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>-{formatNumber(value, 8)}</div>
          <div style={{ color: '#ff4d4f', fontSize: '12px' }}>
            (-{record.lossPercent.toFixed(2)}%)
          </div>
        </div>
      )
    },
  },
  {
    key: 'reason',
    title: 'Reason',
    dataIndex: 'reason',
    width: 200,
    render: (value: string) => <Tag color="red">{value}</Tag>,
  },
  {
    key: 'liquidatedAt',
    title: 'Liquidated At',
    dataIndex: 'liquidatedAt',
    width: 180,
    sortable: true,
    render: (value: string) => formatDate(value),
  },
  {
    key: 'actions',
    title: 'Actions',
    dataIndex: 'actions',
    width: 120,
    fixed: 'right',
    render: (_: unknown, record: Liquidation) => (
      <a onClick={() => handleViewDetail(record)}>View Timeline</a>
    ),
  },
])

const dataSource = computed(() => ordersStore.liquidations)
const loading = computed(() => ordersStore.liquidationsLoading)

const pagination = computed(() => ({
  total: ordersStore.liquidationsTotal,
  current: 1,
  pageSize: 20,
}))

const rowSelection = computed(() => ({
  type: 'checkbox' as const,
  onChange: (_: string[], selectedRows: Liquidation[]) => {
    emit('selection-change', selectedRows)
  },
}))

async function fetchData(params: any) {
  const queryParams: LiquidationQueryParams = {
    ...props.filters,
    page: params.page,
    pageSize: params.pageSize,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    ...params.filters,
  }

  const response = await ordersStore.fetchLiquidations(queryParams)
  return {
    data: response.data,
    total: response.total,
  }
}

function handleViewDetail(liquidation: Liquidation) {
  emit('view-detail', liquidation)
}

async function handleExport(params: any) {
  const queryParams: LiquidationQueryParams = {
    ...props.filters,
    ...params.filters,
  }
  await ordersStore.exportLiquidations(queryParams)
}
</script>
