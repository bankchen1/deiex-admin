<template>
  <div class="logs-page">
    <a-card :bordered="false">
      <!-- Filter Section -->
      <div class="filter-section">
        <a-space :size="16" wrap>
          <a-select
            v-model:value="filters.logLevel"
            placeholder="Log Level"
            style="width: 150px"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="debug">Debug</a-select-option>
            <a-select-option value="info">Info</a-select-option>
            <a-select-option value="warn">Warning</a-select-option>
            <a-select-option value="error">Error</a-select-option>
          </a-select>

          <a-input
            v-model:value="filters.source"
            placeholder="Source"
            style="width: 200px"
            allow-clear
            @change="handleFilterChange"
          />

          <a-input
            v-model:value="filters.requestId"
            placeholder="Request ID"
            style="width: 250px"
            allow-clear
            @change="handleFilterChange"
          />

          <a-input
            v-model:value="filters.apiEndpoint"
            placeholder="API Endpoint"
            style="width: 250px"
            allow-clear
            @change="handleFilterChange"
          />

          <a-input
            v-model:value="filters.account"
            placeholder="Account"
            style="width: 200px"
            allow-clear
            @change="handleFilterChange"
          />

          <a-range-picker
            v-model:value="dateRange"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            @change="handleDateRangeChange"
          />

          <a-button @click="handleReset">Reset</a-button>
          <a-button type="primary" @click="handleSearch">Search</a-button>
        </a-space>
      </div>

      <!-- Tabs -->
      <a-tabs v-model:active-key="activeTab" @change="handleTabChange">
        <a-tab-pane key="system" tab="System Logs">
          <SystemLogTable
            :data-source="logsStore.systemLogs"
            :loading="logsStore.loading"
            :total="logsStore.systemLogsTotal"
            :pagination="pagination"
            @change="handleTableChange"
            @view-detail="handleViewDetail"
          />
        </a-tab-pane>

        <a-tab-pane key="audit" tab="Audit Logs">
          <AuditLogTable
            :data-source="logsStore.auditLogs"
            :loading="logsStore.loading"
            :total="logsStore.auditLogsTotal"
            :pagination="pagination"
            @change="handleTableChange"
            @view-detail="handleViewDetail"
          />
        </a-tab-pane>

        <a-tab-pane key="error" tab="Error Logs">
          <ErrorLogTable
            :data-source="logsStore.errorLogs"
            :loading="logsStore.loading"
            :total="logsStore.errorLogsTotal"
            :pagination="pagination"
            @change="handleTableChange"
            @view-detail="handleViewDetail"
          />
        </a-tab-pane>
      </a-tabs>

      <!-- Export Button -->
      <div class="action-bar">
        <a-button type="primary" :loading="logsStore.loading" @click="handleExport">
          <template #icon><DownloadOutlined /></template>
          Export
        </a-button>
      </div>
    </a-card>

    <!-- Log Detail Drawer -->
    <LogDetailDrawer v-model:visible="detailDrawerVisible" :log-id="selectedLogId" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { DownloadOutlined } from '@ant-design/icons-vue'
import { useLogsStore } from '@/stores/logs'
import type { LogQueryParams } from '@/services/api/ops'
import SystemLogTable from '@/tables/ops/SystemLogTable.vue'
import AuditLogTable from '@/tables/ops/AuditLogTable.vue'
import ErrorLogTable from '@/tables/ops/ErrorLogTable.vue'
import LogDetailDrawer from '@/modals/ops/LogDetailDrawer.vue'
import type { Dayjs } from 'dayjs'

const logsStore = useLogsStore()

// State
const activeTab = ref<'system' | 'audit' | 'error'>('system')
const dateRange = ref<[Dayjs, Dayjs] | null>(null)
const detailDrawerVisible = ref(false)
const selectedLogId = ref<string>('')

const filters = reactive<Omit<LogQueryParams, 'page' | 'pageSize' | 'startTime' | 'endTime'>>({
  logLevel: undefined,
  source: undefined,
  requestId: undefined,
  apiEndpoint: undefined,
  account: undefined,
  sortField: 'timestamp',
  sortOrder: 'desc',
})

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `Total ${total} items`,
})

// Methods
function buildQueryParams(): LogQueryParams {
  const params: LogQueryParams = {
    page: pagination.current,
    pageSize: pagination.pageSize,
    ...filters,
  }

  if (dateRange.value) {
    params.startTime = dateRange.value[0].toISOString()
    params.endTime = dateRange.value[1].toISOString()
  }

  return params
}

async function fetchLogs() {
  const params = buildQueryParams()

  try {
    if (activeTab.value === 'system') {
      await logsStore.fetchSystemLogs(params)
      pagination.total = logsStore.systemLogsTotal
    } else if (activeTab.value === 'audit') {
      await logsStore.fetchAuditLogs(params)
      pagination.total = logsStore.auditLogsTotal
    } else if (activeTab.value === 'error') {
      await logsStore.fetchErrorLogs(params)
      pagination.total = logsStore.errorLogsTotal
    }
  } catch (error) {
    message.error('Failed to fetch logs')
  }
}

function handleTabChange() {
  pagination.current = 1
  fetchLogs()
}

function handleFilterChange() {
  // Debounce could be added here
}

function handleDateRangeChange() {
  // Auto-search on date range change
  handleSearch()
}

function handleSearch() {
  pagination.current = 1
  fetchLogs()
}

function handleReset() {
  filters.logLevel = undefined
  filters.source = undefined
  filters.requestId = undefined
  filters.apiEndpoint = undefined
  filters.account = undefined
  dateRange.value = null
  pagination.current = 1
  fetchLogs()
}

function handleTableChange(pag: any, _filters: any, sorter: any) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize

  if (sorter.field) {
    filters.sortField = sorter.field
    filters.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'
  }

  fetchLogs()
}

function handleViewDetail(logId: string) {
  selectedLogId.value = logId
  detailDrawerVisible.value = true
}

async function handleExport() {
  const params = buildQueryParams()

  try {
    await logsStore.exportLogs(activeTab.value, params)
    message.success('Logs exported successfully')
  } catch (error) {
    message.error('Failed to export logs')
  }
}

// Lifecycle
onMounted(() => {
  fetchLogs()
})
</script>

<style scoped>
.logs-page {
  padding: 24px;
}

.filter-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.action-bar {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
