<template>
  <ServerTable
    :columns="columns"
    :data-source="withdrawals"
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
          <a-select-option value="reviewing">Reviewing</a-select-option>
          <a-select-option value="approved">Approved</a-select-option>
          <a-select-option value="processing">Processing</a-select-option>
          <a-select-option value="completed">Completed</a-select-option>
          <a-select-option value="rejected">Rejected</a-select-option>
        </a-select>
        <a-range-picker
          v-model:value="dateRange"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          @change="handleDateChange"
        />
      </a-space>
    </template>

    <template #batchActions>
      <RBACGuard :permissions="['withdrawals.approve']">
        <a-button type="primary" :disabled="selectedRows.length === 0" @click="handleBatchApprove">
          Batch Approve
        </a-button>
      </RBACGuard>
      <RBACGuard :permissions="['withdrawals.reject']">
        <a-button danger :disabled="selectedRows.length === 0" @click="handleBatchReject">
          Batch Reject
        </a-button>
      </RBACGuard>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'userId'">
        <router-link :to="`/admin/users/${record.userId}`">
          {{ record.userNickname || record.userId }}
        </router-link>
      </template>

      <template v-else-if="column.key === 'amount'">
        <div>
          <div class="font-mono">{{ record.amount }} {{ record.currency }}</div>
          <div class="text-xs text-gray-500">Fee: {{ record.fee }} {{ record.currency }}</div>
        </div>
      </template>

      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ record.status.toUpperCase() }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'riskScore'">
        <div class="flex items-center">
          <a-progress
            type="circle"
            :percent="record.riskScore"
            :width="40"
            :status="getRiskStatus(record.riskScore)"
          />
          <span class="ml-2 text-sm">{{ record.riskScore }}</span>
        </div>
      </template>

      <template v-else-if="column.key === 'matchedRules'">
        <a-space v-if="record.matchedRules && record.matchedRules.length > 0">
          <a-tag v-for="rule in record.matchedRules.slice(0, 2)" :key="rule" color="orange">
            {{ rule }}
          </a-tag>
          <a-tag v-if="record.matchedRules.length > 2" color="orange">
            +{{ record.matchedRules.length - 2 }}
          </a-tag>
        </a-space>
        <span v-else class="text-gray-400">-</span>
      </template>

      <template v-else-if="column.key === 'approvals'">
        <div v-if="record.approvals && record.approvals.length > 0" class="space-y-1">
          <div v-for="approval in record.approvals" :key="approval.adminId" class="text-xs">
            <a-tag :color="approval.action === 'approve' ? 'green' : 'red'" size="small">
              {{ approval.role }}: {{ approval.action }}
            </a-tag>
          </div>
        </div>
        <span v-else class="text-gray-400">-</span>
      </template>

      <template v-else-if="column.key === 'address'">
        <a-tooltip :title="record.address">
          <span class="font-mono text-xs">{{ truncateAddress(record.address) }}</span>
        </a-tooltip>
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleViewDetail(record)">
            View Detail
          </a-button>
          <RBACGuard :permissions="['withdrawals.approve']">
            <a-button
              v-if="record.status === 'reviewing'"
              type="link"
              size="small"
              @click="handleApprove(record)"
            >
              Approve
            </a-button>
          </RBACGuard>
          <RBACGuard :permissions="['withdrawals.reject']">
            <a-button
              v-if="record.status === 'reviewing'"
              type="link"
              danger
              size="small"
              @click="handleReject(record)"
            >
              Reject
            </a-button>
          </RBACGuard>
        </a-space>
      </template>
    </template>
  </ServerTable>

  <TxDetailDrawer
    v-model:visible="drawerVisible"
    :withdrawal="selectedWithdrawal"
    @close="drawerVisible = false"
  />

  <ApproveModal
    v-model:visible="approveModalVisible"
    :withdrawal="selectedWithdrawal"
    :withdrawals="selectedWithdrawals"
    @success="handleApproveSuccess"
  />

  <RejectModal
    v-model:visible="rejectModalVisible"
    :withdrawal="selectedWithdrawal"
    :withdrawals="selectedWithdrawals"
    @success="handleRejectSuccess"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWithdrawalsStore } from '@/stores/withdrawals'
import { storeToRefs } from 'pinia'
import ServerTable from '@/shared/ServerTable.vue'
import RBACGuard from '@/shared/RBACGuard.vue'
import TxDetailDrawer from '@/modals/assets/TxDetailDrawer.vue'
import ApproveModal from '@/modals/assets/ApproveModal.vue'
import RejectModal from '@/modals/assets/RejectModal.vue'
import type { Withdrawal } from '@/contracts/assets'
import type { TableColumn } from '@/types/components'
import type { Dayjs } from 'dayjs'

const withdrawalsStore = useWithdrawalsStore()
const { withdrawals, loading, total, currentPage, pageSize } = storeToRefs(withdrawalsStore)

const filters = ref({
  userId: '',
  currency: undefined as string | undefined,
  chain: undefined as string | undefined,
  status: undefined as string | undefined,
})

const dateRange = ref<[Dayjs, Dayjs] | null>(null)
const selectedRows = ref<Withdrawal[]>([])
const drawerVisible = ref(false)
const approveModalVisible = ref(false)
const rejectModalVisible = ref(false)
const selectedWithdrawal = ref<Withdrawal | null>(null)
const selectedWithdrawals = ref<Withdrawal[] | null>(null)

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
    title: 'Risk Score',
    dataIndex: 'riskScore',
    key: 'riskScore',
    width: 120,
  },
  {
    title: 'Matched Rules',
    dataIndex: 'matchedRules',
    key: 'matchedRules',
    width: 200,
  },
  {
    title: 'Approvals',
    dataIndex: 'approvals',
    key: 'approvals',
    width: 180,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
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
    width: 200,
    fixed: 'right',
  },
]

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRows.value.map((r) => r.id),
  onChange: (selectedRowKeys: string[], selectedRowsData: Withdrawal[]) => {
    selectedRows.value = selectedRowsData
  },
  getCheckboxProps: (record: Withdrawal) => ({
    disabled: record.status !== 'reviewing',
  }),
}))

function getStatusColor(status: string) {
  const colorMap: Record<string, string> = {
    pending: 'default',
    reviewing: 'warning',
    approved: 'processing',
    processing: 'processing',
    completed: 'success',
    rejected: 'error',
  }
  return colorMap[status] || 'default'
}

function getRiskStatus(score: number) {
  if (score >= 70) return 'exception'
  if (score >= 40) return 'normal'
  return 'success'
}

function truncateAddress(address: string) {
  if (!address) return '-'
  return `${address.slice(0, 8)}...${address.slice(-8)}`
}

async function handleFetchData(params: any) {
  const queryParams = {
    ...filters.value,
    startTime: dateRange.value?.[0]?.toISOString(),
    endTime: dateRange.value?.[1]?.toISOString(),
    ...params,
  }
  await withdrawalsStore.fetchList(queryParams)
  return {
    data: withdrawals.value,
    total: total.value,
  }
}

function handleTableChange(pagination: any) {
  withdrawalsStore.setPage(pagination.current)
  withdrawalsStore.setPageSize(pagination.pageSize)
}

function handleSearch() {
  withdrawalsStore.setPage(1)
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
  await withdrawalsStore.exportData(queryParams)
}

function handleViewDetail(withdrawal: Withdrawal) {
  selectedWithdrawal.value = withdrawal
  drawerVisible.value = true
}

function handleApprove(withdrawal: Withdrawal) {
  selectedWithdrawal.value = withdrawal
  selectedWithdrawals.value = null
  approveModalVisible.value = true
}

function handleReject(withdrawal: Withdrawal) {
  selectedWithdrawal.value = withdrawal
  selectedWithdrawals.value = null
  rejectModalVisible.value = true
}

function handleBatchApprove() {
  if (selectedRows.value.length === 0) {
    return
  }
  // Open batch approve modal with selected rows
  selectedWithdrawal.value = null
  selectedWithdrawals.value = selectedRows.value
  approveModalVisible.value = true
}

function handleBatchReject() {
  if (selectedRows.value.length === 0) {
    return
  }
  // Open batch reject modal with selected rows
  selectedWithdrawal.value = null
  selectedWithdrawals.value = selectedRows.value
  rejectModalVisible.value = true
}

function handleApproveSuccess() {
  selectedRows.value = []
  handleFetchData({})
}

function handleRejectSuccess() {
  selectedRows.value = []
  handleFetchData({})
}

onMounted(() => {
  handleFetchData({})
})
</script>
