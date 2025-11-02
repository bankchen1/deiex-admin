<template>
  <div class="compliance-audit">
    <a-page-header title="Compliance Audit" sub-title="Audit trail and compliance monitoring">
      <template #extra>
        <a-space>
          <a-select
            v-model:value="filterCategory"
            style="width: 150px"
            placeholder="All Categories"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="user">User Activity</a-select-option>
            <a-select-option value="system">System Events</a-select-option>
            <a-select-option value="security">Security Events</a-select-option>
            <a-select-option value="financial">Financial Transactions</a-select-option>
            <a-select-option value="admin">Admin Actions</a-select-option>
          </a-select>
          <a-select
            v-model:value="filterSeverity"
            style="width: 150px"
            placeholder="All Severity"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="info">Info</a-select-option>
            <a-select-option value="warning">Warning</a-select-option>
            <a-select-option value="error">Error</a-select-option>
            <a-select-option value="critical">Critical</a-select-option>
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
          <a-button @click="handleExport">
            <template #icon><DownloadOutlined /></template>
            Export Audit Log
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- Summary Cards -->
    <a-row :gutter="16" class="summary-section">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Total Events"
            :value="summary.total"
            :precision="0"
            :value-style="{ color: '#1890ff' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Warnings"
            :value="summary.warnings"
            :precision="0"
            :value-style="{ color: '#faad14' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Errors"
            :value="summary.errors"
            :precision="0"
            :value-style="{ color: '#ff4d4f' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Critical"
            :value="summary.critical"
            :precision="0"
            :value-style="{ color: '#722ed1' }"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- Audit Trail -->
    <a-row :gutter="16" class="audit-section">
      <a-col :span="24">
        <a-card title="Audit Trail" :bordered="false">
          <a-table
            :data-source="auditEvents"
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

              <template v-else-if="column.key === 'category'">
                <a-tag :color="getCategoryColor(record.category)">{{
                  getCategoryLabel(record.category)
                }}</a-tag>
              </template>

              <template v-else-if="column.key === 'severity'">
                <a-tag :color="getSeverityColor(record.severity)">{{ record.severity }}</a-tag>
              </template>

              <template v-else-if="column.key === 'timestamp'">
                <span>{{ formatDate(record.timestamp) }}</span>
              </template>

              <template v-else-if="column.key === 'actions'">
                <a-button type="link" size="small" @click="handleViewDetails(record)"
                  >Details</a-button
                >
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>

    <!-- Event Details Drawer -->
    <a-drawer
      v-model:open="detailDrawerOpen"
      title="Event Details"
      width="600"
      @close="handleCloseDetail"
    >
      <a-descriptions v-if="selectedEvent" :column="1" bordered>
        <a-descriptions-item label="Event ID">
          {{ selectedEvent.id }}
        </a-descriptions-item>
        <a-descriptions-item label="Category">
          <a-tag :color="getCategoryColor(selectedEvent.category)">{{
            getCategoryLabel(selectedEvent.category)
          }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Severity">
          <a-tag :color="getSeverityColor(selectedEvent.severity)">{{
            selectedEvent.severity
          }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Timestamp">
          {{ formatDate(selectedEvent.timestamp) }}
        </a-descriptions-item>
        <a-descriptions-item label="User">
          {{ selectedEvent.user || 'System' }}
        </a-descriptions-item>
        <a-descriptions-item label="IP Address">
          {{ selectedEvent.ipAddress }}
        </a-descriptions-item>
        <a-descriptions-item label="Action">
          {{ selectedEvent.action }}
        </a-descriptions-item>
        <a-descriptions-item label="Resource">
          {{ selectedEvent.resource }}
        </a-descriptions-item>
        <a-descriptions-item label="Description">
          {{ selectedEvent.description }}
        </a-descriptions-item>
        <a-descriptions-item v-if="selectedEvent.details" label="Details">
          <pre class="event-details">{{ JSON.stringify(selectedEvent.details, null, 2) }}</pre>
        </a-descriptions-item>
      </a-descriptions>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'

// Types
interface AuditEvent {
  id: string
  category: 'user' | 'system' | 'security' | 'financial' | 'admin'
  severity: 'info' | 'warning' | 'error' | 'critical'
  timestamp: string
  user?: string
  ipAddress: string
  action: string
  resource: string
  description: string
  details?: Record<string, any>
}

interface AuditSummary {
  total: number
  warnings: number
  errors: number
  critical: number
}

// State
const loading = ref(false)
const detailDrawerOpen = ref(false)
const selectedEvent = ref<AuditEvent | null>(null)
const filterCategory = ref<string | undefined>(undefined)
const filterSeverity = ref<string | undefined>(undefined)
const dateRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(7, 'days'), dayjs()])

// Summary data
const summary = reactive<AuditSummary>({
  total: 15420,
  warnings: 234,
  errors: 45,
  critical: 8,
})

// Pagination
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
})

// Mock data
const mockAuditEvents: AuditEvent[] = [
  {
    id: 'AUD-001234',
    category: 'user',
    severity: 'info',
    timestamp: '2024-01-15 14:30:25',
    user: 'john.doe@example.com',
    ipAddress: '192.168.1.100',
    action: 'Login',
    resource: 'Authentication Service',
    description: 'User successfully logged in',
    details: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'New York, US',
    },
  },
  {
    id: 'AUD-001235',
    category: 'security',
    severity: 'warning',
    timestamp: '2024-01-15 14:28:12',
    user: 'jane.smith@example.com',
    ipAddress: '203.0.113.45',
    action: 'Failed Login Attempt',
    resource: 'Authentication Service',
    description: 'Multiple failed login attempts detected',
    details: {
      attempts: 5,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      location: 'Beijing, CN',
    },
  },
  {
    id: 'AUD-001236',
    category: 'financial',
    severity: 'critical',
    timestamp: '2024-01-15 14:25:45',
    user: 'admin@example.com',
    ipAddress: '192.168.1.50',
    action: 'Large Withdrawal',
    resource: 'Wallet Service',
    description: 'Large withdrawal request exceeding threshold',
    details: {
      amount: 150000,
      currency: 'USDT',
      destination: '0x9876543210fedcba9876543210fedcba98765432',
      threshold: 100000,
    },
  },
  {
    id: 'AUD-001237',
    category: 'admin',
    severity: 'info',
    timestamp: '2024-01-15 14:22:33',
    user: 'admin@example.com',
    ipAddress: '192.168.1.50',
    action: 'Configuration Change',
    resource: 'System Configuration',
    description: 'Updated trading fee configuration',
    details: {
      config: 'trading.fees',
      oldValue: '0.1%',
      newValue: '0.08%',
    },
  },
  {
    id: 'AUD-001238',
    category: 'system',
    severity: 'error',
    timestamp: '2024-01-15 14:20:18',
    ipAddress: '192.168.1.10',
    action: 'Service Error',
    resource: 'Order Matching Engine',
    description: 'Order matching service encountered an error',
    details: {
      errorCode: 'MATCH-500',
      errorMessage: 'Failed to match order due to insufficient liquidity',
      orderId: 'ORD-789012',
    },
  },
]

const auditEvents = ref<AuditEvent[]>(mockAuditEvents)

// Columns
const columns = [
  {
    title: 'Event ID',
    dataIndex: 'id',
    key: 'id',
    width: 150,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    width: 120,
  },
  {
    title: 'Severity',
    dataIndex: 'severity',
    key: 'severity',
    width: 100,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: 150,
  },
  {
    title: 'Resource',
    dataIndex: 'resource',
    key: 'resource',
    width: 150,
  },
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
    width: 150,
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
    width: 100,
  },
]

// Methods
function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    user: 'blue',
    system: 'green',
    security: 'red',
    financial: 'orange',
    admin: 'purple',
  }
  return colorMap[category] || 'default'
}

function getCategoryLabel(category: string): string {
  const labelMap: Record<string, string> = {
    user: 'User Activity',
    system: 'System Events',
    security: 'Security Events',
    financial: 'Financial Transactions',
    admin: 'Admin Actions',
  }
  return labelMap[category] || category
}

function getSeverityColor(severity: string): string {
  const colorMap: Record<string, string> = {
    info: 'blue',
    warning: 'orange',
    error: 'red',
    critical: 'volcano',
  }
  return colorMap[severity] || 'default'
}

function getRowClassName(record: AuditEvent): string {
  if (record.severity === 'critical') {
    return 'critical-row'
  }
  if (record.severity === 'error') {
    return 'error-row'
  }
  if (record.severity === 'warning') {
    return 'warning-row'
  }
  return ''
}

function formatDate(timestamp: string): string {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

function handleRefresh() {
  console.log('Refreshing audit events')
}

function handleExport() {
  console.log('Exporting audit log')
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

function handleViewDetails(record: AuditEvent) {
  selectedEvent.value = record
  detailDrawerOpen.value = true
}

function handleCloseDetail() {
  detailDrawerOpen.value = false
}

onMounted(() => {
  console.log('Compliance audit page mounted')
})
</script>

<style scoped>
.compliance-audit {
  padding: 24px;
}

.summary-section {
  margin-bottom: 24px;
}

.audit-section {
  margin-bottom: 24px;
}

.critical-row {
  background-color: #fff2f0;
}

.error-row {
  background-color: #fffbe6;
}

.warning-row {
  background-color: #fffbe6;
}

.event-details {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

:deep(.ant-drawer-body) {
  padding: 24px;
}
</style>
