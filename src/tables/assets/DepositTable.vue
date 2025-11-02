<template>
  <ServerTable
    :columns="columns"
    :data-source="deposits"
    :loading="loading"
    :pagination="{
      current: currentPage,
      pageSize: pageSize,
      total: total,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number) => `Total ${total} items`,
    }"
    :row-selection="rowSelection"
    :fetch-data="handleFetchData"
    enable-export
    enable-column-config
    @change="handleTableChange"
    @export="handleExport"
  >
    <template #toolbar>
      <a-space>
        <a-input-search
          v-model:value="filters.userId"
          placeholder="Search by User ID"
          style="width: 200px"
          @search="handleSearch"
        />
        <a-select
          v-model:value="filters.currency"
          placeholder="Currency"
          style="width: 120px"
          allow-clear
          @change="handleSearch"
        >
          <a-select-option value="BTC">BTC</a-select-option>
          <a-select-option value="ETH">ETH</a-select-option>
          <a-select-option value="USDT">USDT</a-select-option>
          <a-select-option value="USDC">USDC</a-select-option>
        </a-select>
        <a-select
          v-model:value="filters.chain"
          placeholder="Chain"
          style="width: 120px"
          allow-clear
          @change="handleSearch"
        >
          <a-select-option value="BTC">Bitcoin</a-select-option>
          <a-select-option value="ETH">Ethereum</a-select-option>
          <a-select-option value="TRX">Tron</a-select-option>
          <a-select-option value="BSC">BSC</a-select-option>
        </a-select>
        <a-select
          v-model:value="filters.status"
          placeholder="Status"
          style="width: 140px"
          allow-clear
          @change="handleSearch"
        >
          <a-select-option value="pending">Pending</a-select-option>
          <a-select-option value="confirming">Confirming</a-select-option>
          <a-select-option value="completed">Completed</a-select-option>
          <a-select-option value="failed">Failed</a-select-option>
        </a-select>
        <a-range-picker
          v-model:value="dateRange"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          @change="handleDateChange"
        />
      </a-space>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'userId'">
        <router-link :to="`/admin/users/${record.userId}`">
          {{ record.userNickname || record.userId }}
        </router-link>
      </template>

      <template v-else-if="column.key === 'amount'">
        <span class="font-mono">{{ record.amount }} {{ record.currency }}</span>
      </template>

      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ record.status.toUpperCase() }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'confirmations'">
        <a-progress
          :percent="Math.min((record.confirmations / record.requiredConfirmations) * 100, 100)"
          :status="record.confirmations >= record.requiredConfirmations ? 'success' : 'active'"
          size="small"
        />
        <span class="text-xs text-gray-500 ml-2">
          {{ record.confirmations }}/{{ record.requiredConfirmations }}
        </span>
      </template>

      <template v-else-if="column.key === 'riskFlags'">
        <a-space v-if="record.riskFlags && record.riskFlags.length > 0">
          <a-tag v-for="flag in record.riskFlags" :key="flag" color="red">
            {{ flag }}
          </a-tag>
        </a-space>
        <span v-else class="text-gray-400">-</span>
      </template>

      <template v-else-if="column.key === 'txHash'">
        <a-tooltip :title="record.txHash">
          <span class="font-mono text-xs">{{ truncateHash(record.txHash) }}</span>
        </a-tooltip>
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleViewDetail(record)">
            View Detail
          </a-button>
        </a-space>
      </template>
    </template>
  </ServerTable>

  <TxDetailDrawer
    v-model:visible="drawerVisible"
    :deposit="selectedDeposit"
    @close="drawerVisible = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDepositsStore } from '@/stores/deposits'
import { storeToRefs } from 'pinia'
import ServerTable from '@/shared/ServerTable.vue'
import TxDetailDrawer from '@/modals/assets/TxDetailDrawer.vue'
import type { Deposit } from '@/types/models'
import type { TableColumn } from '@/types/components'
import type { Dayjs } from 'dayjs'

const depositsStore = useDepositsStore()
const { deposits, loading, total, currentPage, pageSize } = storeToRefs(depositsStore)

const filters = ref({
  userId: '',
  currency: undefined as string | undefined,
  chain: undefined as string | undefined,
  status: undefined as string | undefined,
})

const dateRange = ref<[Dayjs, Dayjs] | null>(null)
const selectedRows = ref<Deposit[]>([])
const drawerVisible = ref(false)
const selectedDeposit = ref<Deposit | null>(null)

const columns: TableColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 100,
    fixed: 'left',
  },
  {
    title: 'User',
    dataIndex: 'userId',
    key: 'userId',
    width: 150,
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
    width: 100,
  },
  {
    title: 'Chain',
    dataIndex: 'chain',
    key: 'chain',
    width: 100,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    width: 150,
    align: 'right',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: 'Confirmations',
    dataIndex: 'confirmations',
    key: 'confirmations',
    width: 180,
  },
  {
    title: 'Risk Flags',
    dataIndex: 'riskFlags',
    key: 'riskFlags',
    width: 200,
  },
  {
    title: 'Tx Hash',
    dataIndex: 'txHash',
    key: 'txHash',
    width: 150,
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    fixed: 'right',
  },
]

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRows.value.map((r) => r.id),
  onChange: (selectedRowKeys: string[], selectedRowsData: Deposit[]) => {
    selectedRows.value = selectedRowsData
  },
}))

function getStatusColor(status: string) {
  const colorMap: Record<string, string> = {
    pending: 'default',
    confirming: 'processing',
    completed: 'success',
    failed: 'error',
  }
  return colorMap[status] || 'default'
}

function truncateHash(hash: string) {
  if (!hash) return '-'
  return `${hash.slice(0, 8)}...${hash.slice(-8)}`
}

async function handleFetchData(params: any) {
  const queryParams = {
    ...filters.value,
    startTime: dateRange.value?.[0]?.toISOString(),
    endTime: dateRange.value?.[1]?.toISOString(),
    ...params,
  }
  await depositsStore.fetchList(queryParams)
  return {
    data: deposits.value,
    total: total.value,
  }
}

function handleTableChange(pagination: any) {
  depositsStore.setPage(pagination.current)
  depositsStore.setPageSize(pagination.pageSize)
}

function handleSearch() {
  depositsStore.setPage(1)
  handleFetchData({})
}

function handleDateChange() {
  handleSearch()
}

async function handleExport() {
  const queryParams = {
    ...filters.value,
    startTime: dateRange.value?.[0]?.toISOString(),
    endTime: dateRange.value?.[1]?.toISOString(),
  }
  await depositsStore.exportData(queryParams)
}

function handleViewDetail(deposit: Deposit) {
  selectedDeposit.value = deposit
  drawerVisible.value = true
}

onMounted(() => {
  handleFetchData({})
})
</script>
