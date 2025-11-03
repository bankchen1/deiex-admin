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
import { Tag, Space, Button } from 'ant-design-vue'
import ServerTable from '@/shared/ServerTable.vue'
import type { TableColumn } from '@/types/components'
import type { CopyTradingRelation, CopyTradingQueryParams } from '@/services/api/orders'
import { useOrdersStore } from '@/stores/orders'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/format'

interface Props {
  filters?: CopyTradingQueryParams
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'view-detail', relation: CopyTradingRelation): void
  (e: 'pause', relation: CopyTradingRelation): void
  (e: 'resume', relation: CopyTradingRelation): void
  (e: 'stop', relation: CopyTradingRelation): void
  (e: 'selection-change', selectedRows: CopyTradingRelation[]): void
}>()

const ordersStore = useOrdersStore()

const columns = ref<TableColumn[]>([
  {
    key: 'id',
    title: 'Relation ID',
    dataIndex: 'id',
    width: 180,
    fixed: 'left',
  },
  {
    key: 'leaderId',
    title: 'Leader ID',
    dataIndex: 'leaderId',
    width: 150,
  },
  {
    key: 'leaderNickname',
    title: 'Leader Name',
    dataIndex: 'leaderNickname',
    width: 120,
  },
  {
    key: 'followerId',
    title: 'Follower ID',
    dataIndex: 'followerId',
    width: 150,
  },
  {
    key: 'followerNickname',
    title: 'Follower Name',
    dataIndex: 'followerNickname',
    width: 120,
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    width: 120,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Paused', value: 'paused' },
      { label: 'Stopped', value: 'stopped' },
    ],
    render: (value: string) => {
      const statusConfig: Record<string, { color: string; text: string }> = {
        active: { color: 'green', text: 'Active' },
        paused: { color: 'orange', text: 'Paused' },
        stopped: { color: 'default', text: 'Stopped' },
      }
      const config = statusConfig[value] || { color: 'default', text: value }
      return <Tag color={config.color}>{config.text}</Tag>
    },
  },
  {
    key: 'copyRatio',
    title: 'Copy Ratio',
    dataIndex: 'copyRatio',
    width: 120,
    align: 'right',
    render: (value: number) => `${(value * 100).toFixed(1)}%`,
  },
  {
    key: 'maxPositionSize',
    title: 'Max Position',
    dataIndex: 'maxPositionSize',
    width: 130,
    align: 'right',
    render: (value: string) => formatNumber(value, 2),
  },
  {
    key: 'stopLossPercent',
    title: 'Stop Loss',
    dataIndex: 'stopLossPercent',
    width: 110,
    align: 'right',
    render: (value: number | undefined) => (value ? `${value.toFixed(1)}%` : '-'),
  },
  {
    key: 'takeProfitPercent',
    title: 'Take Profit',
    dataIndex: 'takeProfitPercent',
    width: 110,
    align: 'right',
    render: (value: number | undefined) => (value ? `${value.toFixed(1)}%` : '-'),
  },
  {
    key: 'profitSharePercent',
    title: 'Profit Share',
    dataIndex: 'profitSharePercent',
    width: 120,
    align: 'right',
    render: (value: number) => `${value.toFixed(1)}%`,
  },
  {
    key: 'totalProfit',
    title: 'Total Profit',
    dataIndex: 'totalProfit',
    width: 130,
    align: 'right',
    sortable: true,
    render: (value: string) => {
      const num = parseFloat(value)
      const color = num >= 0 ? '#52c41a' : '#ff4d4f'
      const sign = num >= 0 ? '+' : ''
      return (
        <span style={{ color, fontWeight: 'bold' }}>
          {sign}
          {formatNumber(value, 2)}
        </span>
      )
    },
  },
  {
    key: 'totalLoss',
    title: 'Total Loss',
    dataIndex: 'totalLoss',
    width: 130,
    align: 'right',
    sortable: true,
    render: (value: string) => {
      const num = parseFloat(value)
      if (num === 0) return '-'
      return <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>-{formatNumber(value, 2)}</span>
    },
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
    width: 200,
    fixed: 'right',
    render: (_: unknown, record: CopyTradingRelation) => (
      <Space size="small">
        <a onClick={() => handleViewDetail(record)}>View</a>
        {record.status === 'active' && <a onClick={() => handlePause(record)}>Pause</a>}
        {record.status === 'paused' && <a onClick={() => handleResume(record)}>Resume</a>}
        {record.status !== 'stopped' && (
          <a style={{ color: '#ff4d4f' }} onClick={() => handleStop(record)}>
            Stop
          </a>
        )}
      </Space>
    ),
  },
])

const dataSource = computed(() => ordersStore.copyTradingRelations)
const loading = computed(() => ordersStore.copyTradingLoading)

const pagination = computed(() => ({
  total: ordersStore.copyTradingTotal,
  current: 1,
  pageSize: 20,
}))

const rowSelection = computed(() => ({
  type: 'checkbox' as const,
  onChange: (_: string[], selectedRows: CopyTradingRelation[]) => {
    emit('selection-change', selectedRows)
  },
}))

async function fetchData(params: any) {
  const queryParams: CopyTradingQueryParams = {
    ...props.filters,
    page: params.page,
    pageSize: params.pageSize,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    ...params.filters,
  }

  const response = await ordersStore.fetchCopyTradingRelations(queryParams)
  return {
    data: response.data,
    total: response.total,
  }
}

function handleViewDetail(relation: CopyTradingRelation) {
  emit('view-detail', relation)
}

function handlePause(relation: CopyTradingRelation) {
  emit('pause', relation)
}

function handleResume(relation: CopyTradingRelation) {
  emit('resume', relation)
}

function handleStop(relation: CopyTradingRelation) {
  emit('stop', relation)
}

async function handleExport(params: any) {
  const queryParams: CopyTradingQueryParams = {
    ...props.filters,
    ...params.filters,
  }
  await ordersStore.exportCopyTrading(queryParams)
}
</script>
