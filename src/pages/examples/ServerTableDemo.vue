<template>
  <div class="server-table-demo">
    <a-card title="ServerTable Component Demo" style="margin-bottom: 24px">
      <a-space direction="vertical" style="width: 100%" :size="24">
        <!-- Demo 1: Basic Table with Server-side Pagination -->
        <div>
          <h3>1. Server-side Pagination, Sorting, and Filtering</h3>
          <ServerTable
            :columns="basicColumns"
            :data-source="tableData"
            :loading="loading"
            :pagination="pagination"
            :fetch-data="fetchData"
            @change="handleTableChange"
          >
            <template #toolbar>
              <a-space>
                <a-input-search
                  v-model:value="searchText"
                  placeholder="Search users..."
                  style="width: 200px"
                  @search="handleSearch"
                />
                <a-button @click="handleRefresh">
                  <template #icon><ReloadOutlined /></template>
                  Refresh
                </a-button>
              </a-space>
            </template>
          </ServerTable>
        </div>

        <!-- Demo 2: Table with Row Selection -->
        <div>
          <h3>2. Row Selection (Single and Batch)</h3>
          <a-alert
            v-if="selectedRowKeys.length > 0"
            :message="`${selectedRowKeys.length} row(s) selected`"
            type="info"
            show-icon
            closable
            style="margin-bottom: 16px"
          />
          <ServerTable
            :columns="basicColumns"
            :data-source="tableData"
            :loading="loading"
            :pagination="pagination"
            :row-selection="{
              type: 'checkbox',
              selectedRowKeys: selectedRowKeys,
              onChange: handleSelectionChange,
            }"
            @change="handleTableChange"
          >
            <template #toolbar>
              <a-space>
                <a-button
                  type="primary"
                  :disabled="selectedRowKeys.length === 0"
                  @click="handleBatchAction"
                >
                  Batch Action
                </a-button>
                <a-button
                  danger
                  :disabled="selectedRowKeys.length === 0"
                  @click="handleBatchDelete"
                >
                  Batch Delete
                </a-button>
              </a-space>
            </template>
          </ServerTable>
        </div>

        <!-- Demo 3: Table with Column Configuration -->
        <div>
          <h3>3. Column Configuration with localStorage Persistence</h3>
          <ServerTable
            :columns="configurableColumns"
            :data-source="tableData"
            :loading="loading"
            :pagination="pagination"
            enable-column-config
            storage-key="demo_table_columns"
          />
        </div>

        <!-- Demo 4: Table with Export Functionality -->
        <div>
          <h3>4. Export Functionality (CSV/JSON)</h3>
          <ServerTable
            :columns="basicColumns"
            :data-source="tableData"
            :loading="loading"
            :pagination="pagination"
            enable-export
            enable-column-config
            storage-key="demo_export_table"
          />
        </div>

        <!-- Demo 5: Complete Example with All Features -->
        <div>
          <h3>5. Complete Example (All Features)</h3>
          <ServerTable
            :columns="fullColumns"
            :data-source="tableData"
            :loading="loading"
            :pagination="pagination"
            :row-selection="{
              type: 'checkbox',
              selectedRowKeys: fullSelectedKeys,
              onChange: handleFullSelectionChange,
            }"
            enable-export
            enable-column-config
            storage-key="demo_full_table"
            @change="handleTableChange"
          >
            <template #toolbar>
              <a-space>
                <a-input-search
                  v-model:value="searchText"
                  placeholder="Search..."
                  style="width: 200px"
                  @search="handleSearch"
                />
                <a-select
                  v-model:value="statusFilter"
                  placeholder="Filter by status"
                  style="width: 150px"
                  allow-clear
                  @change="handleStatusFilter"
                >
                  <a-select-option value="active">Active</a-select-option>
                  <a-select-option value="inactive">Inactive</a-select-option>
                  <a-select-option value="pending">Pending</a-select-option>
                </a-select>
                <a-button @click="handleRefresh">
                  <template #icon><ReloadOutlined /></template>
                  Refresh
                </a-button>
              </a-space>
            </template>

            <!-- Custom column rendering -->
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">
                  {{ record.status }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="handleView(record)"> View </a-button>
                  <a-button type="link" size="small" @click="handleEdit(record)"> Edit </a-button>
                  <a-button type="link" size="small" danger @click="handleDelete(record)">
                    Delete
                  </a-button>
                </a-space>
              </template>
            </template>
          </ServerTable>
        </div>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import ServerTable from '@/shared/ServerTable.vue'

// Mock data
const generateMockData = (page: number, pageSize: number) => {
  const data = []
  const start = (page - 1) * pageSize
  for (let i = start; i < start + pageSize; i++) {
    data.push({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + (i % 50),
      status: ['active', 'inactive', 'pending'][i % 3],
      role: ['Admin', 'User', 'Manager'][i % 3],
      createdAt: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
    })
  }
  return data
}

// State
const loading = ref(false)
const tableData = ref(generateMockData(1, 20))
const searchText = ref('')
const statusFilter = ref<string>()
const selectedRowKeys = ref<(string | number)[]>([])
const fullSelectedKeys = ref<(string | number)[]>([])

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 100,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50', '100'],
})

// Basic columns
const basicColumns = [
  {
    key: 'id',
    title: 'ID',
    dataIndex: 'id',
    width: 80,
    sortable: true,
  },
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    width: 150,
    sortable: true,
  },
  {
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
    width: 200,
  },
  {
    key: 'age',
    title: 'Age',
    dataIndex: 'age',
    width: 100,
    sortable: true,
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
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' },
    ],
  },
]

// Configurable columns (more columns for testing column config)
const configurableColumns = [
  ...basicColumns,
  {
    key: 'role',
    title: 'Role',
    dataIndex: 'role',
    width: 120,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Admin', value: 'Admin' },
      { label: 'User', value: 'User' },
      { label: 'Manager', value: 'Manager' },
    ],
  },
  {
    key: 'createdAt',
    title: 'Created At',
    dataIndex: 'createdAt',
    width: 150,
    sortable: true,
  },
]

// Full columns with action column
const fullColumns = [
  ...configurableColumns,
  {
    key: 'action',
    title: 'Action',
    dataIndex: 'action',
    width: 200,
    fixed: 'right',
  },
]

// Fetch data (simulating server-side pagination)
async function fetchData(params: any) {
  loading.value = true

  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update pagination
    pagination.current = params.page
    pagination.pageSize = params.pageSize

    // Generate mock data
    tableData.value = generateMockData(params.page, params.pageSize)

    console.log('Fetch params:', params)

    return {
      data: tableData.value,
      total: pagination.total,
    }
  } catch (error) {
    message.error('Failed to fetch data')
    throw error
  } finally {
    loading.value = false
  }
}

// Handle table change
function handleTableChange(params: any) {
  console.log('Table changed:', params)
}

// Handle search
function handleSearch(value: string) {
  console.log('Search:', value)
  message.info(`Searching for: ${value}`)
}

// Handle refresh
function handleRefresh() {
  fetchData({
    page: pagination.current,
    pageSize: pagination.pageSize,
  })
  message.success('Data refreshed')
}

// Handle status filter
function handleStatusFilter(value: string) {
  console.log('Status filter:', value)
  message.info(`Filtering by status: ${value || 'All'}`)
}

// Handle selection change
function handleSelectionChange(keys: (string | number)[], rows: any[]) {
  selectedRowKeys.value = keys
  console.log('Selected rows:', rows)
}

// Handle full selection change
function handleFullSelectionChange(keys: (string | number)[], rows: any[]) {
  fullSelectedKeys.value = keys
  console.log('Full selected rows:', rows)
}

// Handle batch action
function handleBatchAction() {
  message.success(`Batch action on ${selectedRowKeys.value.length} items`)
}

// Handle batch delete
function handleBatchDelete() {
  message.warning(`Batch delete ${selectedRowKeys.value.length} items`)
  selectedRowKeys.value = []
}

// Handle view
function handleView(record: any) {
  message.info(`View: ${record.name}`)
}

// Handle edit
function handleEdit(record: any) {
  message.info(`Edit: ${record.name}`)
}

// Handle delete
function handleDelete(record: any) {
  message.warning(`Delete: ${record.name}`)
}

// Get status color
function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    active: 'green',
    inactive: 'red',
    pending: 'orange',
  }
  return colors[status] || 'default'
}
</script>

<style scoped>
.server-table-demo {
  padding: 24px;
}

h3 {
  margin-bottom: 16px;
  color: #1890ff;
}
</style>
