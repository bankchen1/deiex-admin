<template>
  <div class="transaction-monitoring">
    <a-page-header
      title="Transaction Monitoring"
      sub-title="Real-time monitoring of all platform transactions"
    >
      <template #extra>
        <a-space>
          <a-select
            v-model:value="filterStatus"
            style="width: 150px"
            placeholder="All Status"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="pending">Pending</a-select-option>
            <a-select-option value="completed">Completed</a-select-option>
            <a-select-option value="failed">Failed</a-select-option>
            <a-select-option value="cancelled">Cancelled</a-select-option>
            <a-select-option value="suspicious">Suspicious</a-select-option>
          </a-select>
          <a-select
            v-model:value="filterType"
            style="width: 150px"
            placeholder="All Types"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="deposit">Deposit</a-select-option>
            <a-select-option value="withdrawal">Withdrawal</a-select-option>
            <a-select-option value="transfer">Transfer</a-select-option>
            <a-select-option value="trade">Trade</a-select-option>
          </a-select>
          <a-range-picker
            v-model:value="dateRange"
            format="YYYY-MM-DD"
            @change="handleDateChange"
          />
          <a-button @click="handleRefresh">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- Summary Cards -->
    <a-row :gutter="16" class="summary-section">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Total Transactions"
            :value="summary.total"
            :precision="0"
            :value-style="{ color: '#1890ff' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Pending"
            :value="summary.pending"
            :precision="0"
            :value-style="{ color: '#faad14' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Completed"
            :value="summary.completed"
            :precision="0"
            :value-style="{ color: '#52c41a' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Suspicious"
            :value="summary.suspicious"
            :precision="0"
            :value-style="{ color: '#ff4d4f' }"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- Real-time Feed -->
    <a-row :gutter="16" class="feed-section">
      <a-col :span="24">
        <a-card title="Real-time Transaction Feed" :bordered="false">
          <a-table
            :data-source="transactions"
            :columns="columns"
            :pagination="{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
            }"
            :loading="loading"
            row-key="id"
            :row-class-name="getRowClassName"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'id'">
                <a @click="handleViewDetails(record)">{{ record.id }}</a>
              </template>

              <template v-else-if="column.key === 'type'">
                <a-tag :color="getTypeColor(record.type)">{{ record.type }}</a-tag>
              </template>

              <template v-else-if="column.key === 'amount'">
                <span class="amount">{{ formatCurrency(record.amount, record.currency) }}</span>
              </template>

              <template v-else-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
              </template>

              <template v-else-if="column.key === 'timestamp'">
                <span>{{ formatDate(record.timestamp) }}</span>
              </template>

              <template v-else-if="column.key === 'actions'">
                <a-space>
                  <a-button type="link" size="small" @click="handleViewDetails(record)"
                    >Details</a-button
                  >
                  <a-button
                    v-if="record.status === 'suspicious'"
                    type="link"
                    size="small"
                    @click="handleApprove(record)"
                    >Approve</a-button
                  >
                  <a-button
                    v-if="record.status === 'suspicious'"
                    type="link"
                    size="small"
                    danger
                    @click="handleReject(record)"
                    >Reject</a-button
                  >
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>

    <!-- Transaction Details Drawer -->
    <a-drawer
      v-model:open="detailDrawerOpen"
      title="Transaction Details"
      width="600"
      @close="handleCloseDetail"
    >
      <a-descriptions v-if="selectedTransaction" :column="1" bordered>
        <a-descriptions-item label="Transaction ID">
          {{ selectedTransaction.id }}
        </a-descriptions-item>
        <a-descriptions-item label="Type">
          <a-tag :color="getTypeColor(selectedTransaction.type)">{{
            selectedTransaction.type
          }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Status">
          <a-tag :color="getStatusColor(selectedTransaction.status)">{{
            selectedTransaction.status
          }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Amount">
          {{ formatCurrency(selectedTransaction.amount, selectedTransaction.currency) }}
        </a-descriptions-item>
        <a-descriptions-item label="Currency">
          {{ selectedTransaction.currency }}
        </a-descriptions-item>
        <a-descriptions-item label="Timestamp">
          {{ formatDate(selectedTransaction.timestamp) }}
        </a-descriptions-item>
        <a-descriptions-item label="User ID">
          {{ selectedTransaction.userId }}
        </a-descriptions-item>
        <a-descriptions-item label="User Email">
          {{ selectedTransaction.userEmail }}
        </a-descriptions-item>
        <a-descriptions-item v-if="selectedTransaction.fromAddress" label="From Address">
          {{ selectedTransaction.fromAddress }}
        </a-descriptions-item>
        <a-descriptions-item v-if="selectedTransaction.toAddress" label="To Address">
          {{ selectedTransaction.toAddress }}
        </a-descriptions-item>
        <a-descriptions-item v-if="selectedTransaction.fee" label="Fee">
          {{ formatCurrency(selectedTransaction.fee, selectedTransaction.currency) }}
        </a-descriptions-item>
        <a-descriptions-item v-if="selectedTransaction.notes" label="Notes">
          {{ selectedTransaction.notes }}
        </a-descriptions-item>
      </a-descriptions>

      <a-divider v-if="selectedTransaction && selectedTransaction.status === 'suspicious'" />

      <div
        v-if="selectedTransaction && selectedTransaction.status === 'suspicious'"
        class="action-buttons"
      >
        <a-button type="primary" @click="handleApprove(selectedTransaction)"
          >Approve Transaction</a-button
        >
        <a-button danger @click="handleReject(selectedTransaction)">Reject Transaction</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'

// Types
interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'transfer' | 'trade'
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'suspicious'
  amount: number
  currency: string
  userId: string
  userEmail: string
  timestamp: string
  fromAddress?: string
  toAddress?: string
  fee?: number
  notes?: string
}

interface TransactionSummary {
  total: number
  pending: number
  completed: number
  suspicious: number
}

// State
const loading = ref(false)
const detailDrawerOpen = ref(false)
const selectedTransaction = ref<Transaction | null>(null)
const filterStatus = ref<string | undefined>(undefined)
const filterType = ref<string | undefined>(undefined)
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(1, 'day'), dayjs()])

// Summary data
const summary = reactive<TransactionSummary>({
  total: 24567,
  pending: 123,
  completed: 24120,
  suspicious: 15,
})

// Pagination
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
})

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001234',
    type: 'deposit',
    status: 'completed',
    amount: 5000.0,
    currency: 'USDT',
    userId: 'USR-00123',
    userEmail: 'user@example.com',
    timestamp: '2024-01-15 14:30:25',
    fromAddress: '0x1234567890abcdef1234567890abcdef12345678',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    fee: 5.0,
  },
  {
    id: 'TXN-001235',
    type: 'withdrawal',
    status: 'pending',
    amount: 2500.0,
    currency: 'BTC',
    userId: 'USR-00456',
    userEmail: 'user2@example.com',
    timestamp: '2024-01-15 14:28:12',
    fromAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    toAddress: '0x1234567890abcdef1234567890abcdef12345678',
    fee: 0.0025,
  },
  {
    id: 'TXN-001236',
    type: 'transfer',
    status: 'suspicious',
    amount: 15000.0,
    currency: 'ETH',
    userId: 'USR-00789',
    userEmail: 'user3@example.com',
    timestamp: '2024-01-15 14:25:45',
    fromAddress: '0x1234567890abcdef1234567890abcdef12345678',
    toAddress: '0x9876543210fedcba9876543210fedcba98765432',
    fee: 0.015,
    notes: 'Large transfer to new address',
  },
  {
    id: 'TXN-001237',
    type: 'trade',
    status: 'completed',
    amount: 750.5,
    currency: 'USDT',
    userId: 'USR-00123',
    userEmail: 'user@example.com',
    timestamp: '2024-01-15 14:22:33',
    fee: 0.75,
  },
  {
    id: 'TXN-001238',
    type: 'deposit',
    status: 'failed',
    amount: 10000.0,
    currency: 'USDC',
    userId: 'USR-00345',
    userEmail: 'user4@example.com',
    timestamp: '2024-01-15 14:20:18',
    fromAddress: '0x567890abcdef1234567890abcdef1234567890ab',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    notes: 'Insufficient funds',
  },
]

const transactions = ref<Transaction[]>(mockTransactions)

// Columns
const columns = [
  {
    title: 'Transaction ID',
    dataIndex: 'id',
    key: 'id',
    width: 180,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 100,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    width: 120,
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
    width: 100,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: 'Timestamp',
    dataIndex: 'timestamp',
    key: 'timestamp',
    width: 180,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 180,
  },
]

// Methods
function getTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    deposit: 'blue',
    withdrawal: 'orange',
    transfer: 'purple',
    trade: 'green',
  }
  return colorMap[type] || 'default'
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    completed: 'green',
    failed: 'red',
    cancelled: 'gray',
    suspicious: 'volcano',
  }
  return colorMap[status] || 'default'
}

function getRowClassName(record: Transaction): string {
  if (record.status === 'suspicious') {
    return 'suspicious-row'
  }
  return ''
}

function formatCurrency(amount: number, currency: string): string {
  return `${amount.toFixed(2)} ${currency}`
}

function formatDate(timestamp: string): string {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

function handleRefresh() {
  console.log('Refreshing transactions')
}

function handleFilterChange() {
  console.log('Filters changed')
}

function handleDateChange(dates: [Dayjs, Dayjs] | null) {
  if (dates) {
    console.log('Date range changed:', dates)
  }
}

function handleTableChange(pagination: any) {
  console.log('Table changed:', pagination)
}

function handleViewDetails(record: Transaction) {
  selectedTransaction.value = record
  detailDrawerOpen.value = true
}

function handleCloseDetail() {
  detailDrawerOpen.value = false
}

function handleApprove(record: Transaction) {
  console.log('Approving transaction:', record.id)
  detailDrawerOpen.value = false
}

function handleReject(record: Transaction) {
  console.log('Rejecting transaction:', record.id)
  detailDrawerOpen.value = false
}
</script>

<style scoped>
.transaction-monitoring {
  padding: 24px;
}

.summary-section {
  margin-bottom: 24px;
}

.feed-section {
  margin-bottom: 24px;
}

.amount {
  font-weight: 500;
}

.suspicious-row {
  background-color: #fff2f0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

:deep(.ant-drawer-body) {
  padding: 24px;
}
</style>
