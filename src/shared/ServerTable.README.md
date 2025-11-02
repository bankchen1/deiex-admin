# ServerTable Component

A comprehensive, feature-rich table component with server-side pagination, sorting, filtering, column configuration, row selection, and export functionality.

## Features

- ✅ **Server-side Pagination**: Efficient handling of large datasets with configurable page sizes
- ✅ **Sorting**: Column-level sorting with server-side support
- ✅ **Filtering**: Built-in filtering with select and input filter types
- ✅ **Column Configuration**: User-customizable column visibility with localStorage persistence
- ✅ **Row Selection**: Single and batch row selection (checkbox/radio)
- ✅ **Export**: Export data to CSV or JSON formats
- ✅ **Responsive**: Adapts to different screen sizes
- ✅ **Customizable**: Extensive slot support for custom rendering

## Basic Usage

```vue
<template>
  <ServerTable
    :columns="columns"
    :data-source="data"
    :loading="loading"
    :pagination="pagination"
    @change="handleTableChange"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import ServerTable from '@/shared/ServerTable.vue'

const columns = [
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
  },
  {
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
    width: 200,
  },
]

const data = ref([])
const loading = ref(false)
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
})

function handleTableChange(params) {
  console.log('Table params:', params)
  // Fetch data from server with params
}
</script>
```

## Props

### columns
- **Type**: `TableColumn[]`
- **Required**: Yes
- **Description**: Array of column definitions

```typescript
interface TableColumn {
  key: string                    // Unique column key
  title: string                  // Column header text
  dataIndex: string              // Data field name
  width?: number                 // Column width in pixels
  fixed?: 'left' | 'right'       // Fixed column position
  sortable?: boolean             // Enable sorting
  filterable?: boolean           // Enable filtering
  filterType?: 'input' | 'select' | 'date-range'  // Filter type
  filterOptions?: SelectOption[] // Options for select filter
  render?: (value, record, index) => VNode  // Custom render function
}
```

### dataSource
- **Type**: `any[]`
- **Default**: `[]`
- **Description**: Array of data records to display

### loading
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Loading state indicator

### pagination
- **Type**: `PaginationConfig`
- **Default**: See below
- **Description**: Pagination configuration

```typescript
interface PaginationConfig {
  current: number              // Current page number
  pageSize: number            // Items per page
  total: number               // Total number of items
  showSizeChanger?: boolean   // Show page size selector
  showQuickJumper?: boolean   // Show quick jump input
  pageSizeOptions?: string[]  // Available page sizes
}

// Default value
{
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50', '100'],
}
```

### rowSelection
- **Type**: `RowSelectionConfig`
- **Default**: `undefined`
- **Description**: Row selection configuration

```typescript
interface RowSelectionConfig {
  type?: 'checkbox' | 'radio'                    // Selection type
  selectedRowKeys?: (string | number)[]          // Selected row keys
  onChange?: (keys, rows) => void                // Selection change callback
}
```

### fetchData
- **Type**: `(params: TableParams) => Promise<TableResponse>`
- **Default**: `undefined`
- **Description**: Function to fetch data from server

```typescript
interface TableParams {
  page: number
  pageSize: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
}

interface TableResponse {
  data: any[]
  total: number
}
```

### enableExport
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable export functionality (CSV/JSON)

### enableColumnConfig
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable column configuration with localStorage persistence

### rowKey
- **Type**: `string | ((record: any) => string)`
- **Default**: `'id'`
- **Description**: Unique key for each row

### scroll
- **Type**: `{ x?: number | string; y?: number | string }`
- **Default**: `{ x: 'max-content' }`
- **Description**: Scroll configuration for table

### storageKey
- **Type**: `string`
- **Default**: Auto-generated from column keys
- **Description**: localStorage key for column configuration

## Events

### change
- **Payload**: `TableParams`
- **Description**: Emitted when pagination, sorting, or filtering changes

```typescript
function handleTableChange(params: TableParams) {
  console.log('Page:', params.page)
  console.log('Page size:', params.pageSize)
  console.log('Sort field:', params.sortField)
  console.log('Sort order:', params.sortOrder)
  console.log('Filters:', params.filters)
}
```

### selectionChange
- **Payload**: `(selectedRowKeys: (string | number)[], selectedRows: any[])`
- **Description**: Emitted when row selection changes

```typescript
function handleSelectionChange(keys, rows) {
  console.log('Selected keys:', keys)
  console.log('Selected rows:', rows)
}
```

## Slots

### toolbar
Custom toolbar content (left side)

```vue
<ServerTable :columns="columns" :data-source="data">
  <template #toolbar>
    <a-space>
      <a-input-search placeholder="Search..." />
      <a-button>Filter</a-button>
    </a-space>
  </template>
</ServerTable>
```

### bodyCell
Custom cell rendering (passes through to Ant Design Table)

```vue
<ServerTable :columns="columns" :data-source="data">
  <template #bodyCell="{ column, record }">
    <template v-if="column.key === 'status'">
      <a-tag :color="getStatusColor(record.status)">
        {{ record.status }}
      </a-tag>
    </template>
  </template>
</ServerTable>
```

## Advanced Examples

### Server-side Pagination with API

```vue
<template>
  <ServerTable
    :columns="columns"
    :data-source="data"
    :loading="loading"
    :pagination="pagination"
    :fetch-data="fetchData"
    @change="handleTableChange"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import ServerTable from '@/shared/ServerTable.vue'
import { userApi } from '@/services/api/users'

const columns = [
  { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email' },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
]

const data = ref([])
const loading = ref(false)
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
})

async function fetchData(params) {
  loading.value = true
  try {
    const response = await userApi.getList(params)
    data.value = response.data
    pagination.total = response.total
    return response
  } finally {
    loading.value = false
  }
}

function handleTableChange(params) {
  fetchData(params)
}
</script>
```

### Row Selection with Batch Operations

```vue
<template>
  <ServerTable
    :columns="columns"
    :data-source="data"
    :row-selection="{
      type: 'checkbox',
      selectedRowKeys: selectedKeys,
      onChange: handleSelectionChange,
    }"
  >
    <template #toolbar>
      <a-space>
        <a-button
          type="primary"
          :disabled="selectedKeys.length === 0"
          @click="handleBatchApprove"
        >
          Batch Approve
        </a-button>
        <a-button
          danger
          :disabled="selectedKeys.length === 0"
          @click="handleBatchReject"
        >
          Batch Reject
        </a-button>
      </a-space>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import ServerTable from '@/shared/ServerTable.vue'

const selectedKeys = ref<(string | number)[]>([])
const selectedRows = ref<any[]>([])

function handleSelectionChange(keys, rows) {
  selectedKeys.value = keys
  selectedRows.value = rows
}

async function handleBatchApprove() {
  try {
    // Call API with selected IDs
    await api.batchApprove(selectedKeys.value)
    message.success(`Approved ${selectedKeys.value.length} items`)
    selectedKeys.value = []
  } catch (error) {
    message.error('Batch approve failed')
  }
}

async function handleBatchReject() {
  try {
    await api.batchReject(selectedKeys.value)
    message.success(`Rejected ${selectedKeys.value.length} items`)
    selectedKeys.value = []
  } catch (error) {
    message.error('Batch reject failed')
  }
}
</script>
```

### Column Configuration with Export

```vue
<template>
  <ServerTable
    :columns="columns"
    :data-source="data"
    :loading="loading"
    :pagination="pagination"
    enable-column-config
    enable-export
    storage-key="users_table_columns"
  >
    <template #toolbar>
      <a-input-search
        v-model:value="searchText"
        placeholder="Search users..."
        @search="handleSearch"
      />
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import ServerTable from '@/shared/ServerTable.vue'

const columns = [
  { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email' },
  { key: 'phone', title: 'Phone', dataIndex: 'phone' },
  { key: 'role', title: 'Role', dataIndex: 'role' },
  { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt' },
]

const data = ref([])
const loading = ref(false)
const searchText = ref('')
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
})

function handleSearch(value: string) {
  // Implement search logic
  console.log('Search:', value)
}
</script>
```

### Custom Cell Rendering

```vue
<template>
  <ServerTable
    :columns="columns"
    :data-source="data"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ record.status }}
        </a-tag>
      </template>
      <template v-else-if="column.key === 'avatar'">
        <a-avatar :src="record.avatar" />
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space>
          <a-button type="link" size="small" @click="handleEdit(record)">
            Edit
          </a-button>
          <a-button type="link" size="small" danger @click="handleDelete(record)">
            Delete
          </a-button>
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ServerTable from '@/shared/ServerTable.vue'

const columns = [
  { key: 'avatar', title: 'Avatar', dataIndex: 'avatar', width: 80 },
  { key: 'name', title: 'Name', dataIndex: 'name' },
  { key: 'status', title: 'Status', dataIndex: 'status' },
  { key: 'action', title: 'Action', dataIndex: 'action', fixed: 'right' },
]

const data = ref([])

function getStatusColor(status: string) {
  const colors = {
    active: 'green',
    inactive: 'red',
    pending: 'orange',
  }
  return colors[status] || 'default'
}

function handleEdit(record: any) {
  console.log('Edit:', record)
}

function handleDelete(record: any) {
  console.log('Delete:', record)
}
</script>
```

## Exposed Methods

The component exposes several methods that can be accessed via template ref:

```vue
<template>
  <ServerTable ref="tableRef" :columns="columns" :data-source="data" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ServerTable from '@/shared/ServerTable.vue'

const tableRef = ref()

// Load column configuration from localStorage
function loadConfig() {
  tableRef.value?.loadColumnConfig()
}

// Reset column configuration to default
function resetConfig() {
  tableRef.value?.resetColumnConfig()
}

// Get currently selected rows
function getSelected() {
  const rows = tableRef.value?.getSelectedRows()
  console.log('Selected rows:', rows)
}

// Clear selection
function clearSelection() {
  tableRef.value?.clearSelection()
}
</script>
```

## Styling

The component uses scoped styles and can be customized via CSS variables or by overriding the classes:

```css
/* Custom styling example */
.server-table {
  /* Your custom styles */
}

.table-toolbar {
  /* Toolbar styles */
}

.selection-info {
  /* Selection info styles */
}
```

## Best Practices

1. **Use storageKey**: Provide a unique `storageKey` when using `enableColumnConfig` to avoid conflicts between different tables
2. **Implement fetchData**: For server-side pagination, implement the `fetchData` prop for automatic data fetching
3. **Handle errors**: Always handle errors in your `fetchData` function and show appropriate messages
4. **Optimize columns**: Only include necessary columns to improve performance
5. **Use fixed columns**: Fix important columns (like ID or actions) for better UX
6. **Provide filters**: Add filters to columns with limited value sets for better data exploration

## Requirements Satisfied

This component satisfies the following requirements from the design document:

- ✅ **20.1**: Server-side pagination with configurable page sizes
- ✅ **20.2**: Column-level sorting and filtering
- ✅ **20.3**: Column configuration with localStorage persistence
- ✅ **20.4**: Single-row and batch operations via row selection
- ✅ **20.5**: Export functionality for CSV and JSON formats
- ✅ **20.7**: Filter and sort state preservation

## Related Components

- [SchemaForm](./SchemaForm.README.md) - Dynamic form generation
- [RBACGuard](./RBACGuard.vue) - Permission-based rendering
- [VersionBar](./VersionBar.vue) - Version control for configurations

## Demo

See the complete demo at `/admin/examples/server-table` or check the [ServerTableDemo.vue](../pages/examples/ServerTableDemo.vue) file.
