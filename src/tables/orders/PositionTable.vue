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
import { Tag, Tooltip, Progress } from 'ant-design-vue'
import { WarningOutlined } from '@ant-design/icons-vue'
import ServerTable from '@/shared/ServerTable.vue'
import type { TableColumn } from '@/types/components'
import type { Position, PositionQueryParams } from '@/services/api/orders'
import { useOrdersStore } from '@/stores/orders'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/format'

interface Props {
  filters?: PositionQueryParams
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'view-detail', position: Position): void
  (e: 'selection-change', selectedRows: Position[]): void
}>()

const ordersStore = useOrdersStore()

const columns = ref<TableColumn[]>([
  {
    key: 'id',
    title: 'Position ID',
    dataIndex: 'id',
    width: 180,
    fixed: 'left'
  },
  {
    key: 'userId',
    title: 'User ID',
    dataIndex: 'userId',
    width: 150
  },
  {
    key: 'userNickname',
    title: 'Nickname',
    dataIndex: 'userNickname',
    width: 120
  },
  {
    key: 'symbol',
    title: 'Trading Pair',
    dataIndex: 'symbol',
    width: 120,
    filterable: true,
    filterType: 'input'
  },
  {
    key: 'side',
    title: 'Side',
    dataIndex: 'side',
    width: 100,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Long', value: 'long' },
      { label: 'Short', value: 'short' }
    ],
    render: (value: string) => {
      const color = value === 'long' ? 'green' : 'red'
      const text = value === 'long' ? 'Long' : 'Short'
      return <Tag color={color}>{text}</Tag>
    }
  },
  {
    key: 'leverage',
    title: 'Leverage',
    dataIndex: 'leverage',
    width: 100,
    align: 'right',
    render: (value: number) => `${value}x`
  },
  {
    key: 'marginMode',
    title: 'Margin Mode',
    dataIndex: 'marginMode',
    width: 120,
    render: (value: string) => {
      const text = value === 'isolated' ? 'Isolated' : 'Cross'
      return <Tag>{text}</Tag>
    }
  },
  {
    key: 'entryPrice',
    title: 'Entry Price',
    dataIndex: 'entryPrice',
    width: 130,
    align: 'right',
    render: (value: string) => formatNumber(value, 8)
  },
  {
    key: 'markPrice',
    title: 'Mark Price',
    dataIndex: 'markPrice',
    width: 130,
    align: 'right',
    render: (value: string) => formatNumber(value, 8)
  },
  {
    key: 'liquidationPrice',
    title: 'Liq. Price',
    dataIndex: 'liquidationPrice',
    width: 130,
    align: 'right',
    render: (value: string, record: Position) => {
      const markPrice = parseFloat(record.markPrice)
      const liqPrice = parseFloat(value)
      const distance = Math.abs((markPrice - liqPrice) / markPrice) * 100
      
      if (distance < 10) {
        return (
          <Tooltip title={`Only ${distance.toFixed(2)}% away from liquidation!`}>
            <span style={{ color: '#ff4d4f' }}>
              <WarningOutlined style={{ marginRight: '4px' }} />
              {formatNumber(value, 8)}
            </span>
          </Tooltip>
        )
      }
      
      return formatNumber(value, 8)
    }
  },
  {
    key: 'quantity',
    title: 'Quantity',
    dataIndex: 'quantity',
    width: 120,
    align: 'right',
    render: (value: string) => formatNumber(value, 8)
  },
  {
    key: 'margin',
    title: 'Margin',
    dataIndex: 'margin',
    width: 120,
    align: 'right',
    render: (value: string) => formatNumber(value, 8)
  },
  {
    key: 'unrealizedPnl',
    title: 'Unrealized PnL',
    dataIndex: 'unrealizedPnl',
    width: 150,
    align: 'right',
    sortable: true,
    render: (value: string, record: Position) => {
      const pnl = parseFloat(value)
      const color = pnl >= 0 ? '#52c41a' : '#ff4d4f'
      const sign = pnl >= 0 ? '+' : ''
      return (
        <div>
          <div style={{ color, fontWeight: 'bold' }}>
            {sign}
            {formatNumber(value, 8)}
          </div>
          <div style={{ color, fontSize: '12px' }}>
            ({sign}
            {record.unrealizedPnlPercent.toFixed(2)}%)
          </div>
        </div>
      )
    }
  },
  {
    key: 'riskRatio',
    title: 'Risk Ratio',
    dataIndex: 'riskRatio',
    width: 150,
    align: 'center',
    sortable: true,
    render: (value: number) => {
      const percent = value * 100
      let status: 'success' | 'normal' | 'exception' = 'success'
      let strokeColor = '#52c41a'
      
      if (percent >= 80) {
        status = 'exception'
        strokeColor = '#ff4d4f'
      } else if (percent >= 60) {
        status = 'normal'
        strokeColor = '#faad14'
      }
      
      return (
        <div>
          <Progress
            percent={percent}
            status={status}
            strokeColor={strokeColor}
            size="small"
          />
          <div style={{ fontSize: '12px', marginTop: '4px' }}>
            {percent.toFixed(2)}%
          </div>
        </div>
      )
    }
  },
  {
    key: 'createdAt',
    title: 'Created At',
    dataIndex: 'createdAt',
    width: 180,
    sortable: true,
    render: (value: string) => formatDate(value)
  },
  {
    key: 'actions',
    title: 'Actions',
    dataIndex: 'actions',
    width: 100,
    fixed: 'right',
    render: (_: unknown, record: Position) => (
      <a onClick={() => handleViewDetail(record)}>View</a>
    )
  }
])

const dataSource = computed(() => ordersStore.positions)
const loading = computed(() => ordersStore.positionsLoading)

const pagination = computed(() => ({
  total: ordersStore.positionsTotal,
  current: 1,
  pageSize: 20
}))

const rowSelection = computed(() => ({
  type: 'checkbox' as const,
  onChange: (_: string[], selectedRows: Position[]) => {
    emit('selection-change', selectedRows)
  }
}))

async function fetchData(params: any) {
  const queryParams: PositionQueryParams = {
    ...props.filters,
    page: params.page,
    pageSize: params.pageSize,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    ...params.filters
  }

  const response = await ordersStore.fetchPositions(queryParams)
  return {
    data: response.data,
    total: response.total
  }
}

function handleViewDetail(position: Position) {
  emit('view-detail', position)
}

async function handleExport(params: any) {
  const queryParams: PositionQueryParams = {
    ...props.filters,
    ...params.filters
  }
  await ordersStore.exportPositions(queryParams)
}
</script>
