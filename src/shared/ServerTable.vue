<template>
  <div class="server-table">
    <!-- Table toolbar -->
    <div v-if="enableColumnConfig || enableExport || $slots.toolbar" class="table-toolbar">
      <div class="toolbar-left">
        <slot name="toolbar" />
      </div>
      <div class="toolbar-right">
        <a-space>
          <!-- Selection info -->
          <span v-if="selectedRows.length > 0" class="selection-info">
            {{ selectedRows.length }} item(s) selected
          </span>

          <a-button v-if="enableColumnConfig" @click="showColumnConfig = true">
            <template #icon><SettingOutlined /></template>
            Columns
          </a-button>

          <a-dropdown v-if="enableExport">
            <a-button :loading="exporting">
              <template #icon><DownloadOutlined /></template>
              Export
            </a-button>
            <template #overlay>
              <a-menu @click="handleExport">
                <a-menu-item key="csv">Export as CSV</a-menu-item>
                <a-menu-item key="json">Export as JSON</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-space>
      </div>
    </div>

    <!-- Table -->
    <a-table
      :columns="processedColumns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="paginationConfig"
      :row-selection="rowSelection ? rowSelectionConfig : undefined"
      :row-key="rowKey"
      :scroll="scroll"
      @change="handleTableChange"
    >
      <!-- Pass through all slots -->
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </a-table>

    <!-- Column configuration modal -->
    <a-modal
      v-model:open="showColumnConfig"
      title="Configure Columns"
      @ok="handleSaveColumnConfig"
      @cancel="handleCancelColumnConfig"
    >
      <div class="column-config-content">
        <a-space direction="vertical" style="width: 100%">
          <div class="column-config-actions">
            <a-button size="small" @click="selectAllColumns">Select All</a-button>
            <a-button size="small" @click="deselectAllColumns">Deselect All</a-button>
            <a-button size="small" @click="resetColumnConfig">Reset</a-button>
          </div>

          <a-checkbox-group v-model:value="selectedColumnKeys" style="width: 100%">
            <div v-for="column in columns" :key="column.key" class="column-config-item">
              <a-checkbox :value="column.key">
                {{ column.title }}
              </a-checkbox>
            </div>
          </a-checkbox-group>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { SettingOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import type { TableProps, TableColumnType } from 'ant-design-vue'
import { exportTableToCSV, exportTableToJSON, generateFilename } from '@/utils/download'

interface TableColumn extends TableColumnType {
  key: string
  title: string
  dataIndex: string
  width?: number
  fixed?: 'left' | 'right'
  sortable?: boolean
  filterable?: boolean
  filterType?: 'input' | 'select' | 'date-range'
  filterOptions?: SelectOption[]
}

interface SelectOption {
  label: string
  value: string | number
}

interface PaginationConfig {
  current: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  pageSizeOptions?: string[]
}

interface RowSelectionConfig {
  type?: 'checkbox' | 'radio'
  selectedRowKeys?: (string | number)[]
  onChange?: (selectedRowKeys: (string | number)[], selectedRows: any[]) => void
}

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

interface Props {
  columns: TableColumn[]
  dataSource?: any[]
  loading?: boolean
  pagination?: PaginationConfig
  rowSelection?: RowSelectionConfig
  fetchData?: (params: TableParams) => Promise<TableResponse>
  enableExport?: boolean
  enableColumnConfig?: boolean
  rowKey?: string | ((record: any) => string)
  scroll?: { x?: number | string; y?: number | string }
  storageKey?: string
}

interface Emits {
  (e: 'change', params: TableParams): void
  (e: 'selectionChange', selectedRowKeys: (string | number)[], selectedRows: any[]): void
}

const props = withDefaults(defineProps<Props>(), {
  dataSource: () => [],
  loading: false,
  pagination: () => ({
    current: 1,
    pageSize: 20,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50', '100'],
  }),
  enableExport: false,
  enableColumnConfig: false,
  rowKey: 'id',
  scroll: () => ({ x: 'max-content' }),
})

const emit = defineEmits<Emits>()

// State
const showColumnConfig = ref(false)
const selectedColumnKeys = ref<string[]>([])
const selectedRows = ref<any[]>([])
const exporting = ref(false)
const currentParams = ref<TableParams>({
  page: props.pagination.current,
  pageSize: props.pagination.pageSize,
})

// Column configuration storage key
const getStorageKey = () => {
  return props.storageKey || `table_columns_${props.columns.map((c) => c.key).join('_')}`
}

// Process columns to add sorting and filtering capabilities
const processedColumns = computed(() => {
  const columns = props.enableColumnConfig
    ? props.columns.filter((column) => selectedColumnKeys.value.includes(column.key))
    : props.columns

  return columns.map((column) => {
    const processed: TableColumnType = { ...column }

    // Add sorter if sortable
    if (column.sortable) {
      processed.sorter = true
    }

    // Add filters if filterable
    if (column.filterable) {
      if (column.filterType === 'select' && column.filterOptions) {
        processed.filters = column.filterOptions.map((opt) => ({
          text: opt.label,
          value: opt.value,
        }))
      } else if (column.filterType === 'input') {
        processed.customFilterDropdown = true
      }
    }

    return processed
  })
})

// Pagination configuration
const paginationConfig = computed<TableProps['pagination']>(() => {
  if (!props.pagination) return false

  return {
    ...props.pagination,
    showTotal: (total: number) => `Total ${total} items`,
  }
})

// Row selection configuration
const rowSelectionConfig = computed<TableProps['rowSelection']>(() => {
  if (!props.rowSelection) return undefined

  return {
    type: props.rowSelection.type || 'checkbox',
    selectedRowKeys: props.rowSelection.selectedRowKeys || [],
    onChange: handleSelectionChange,
  }
})

// Handle selection change
function handleSelectionChange(selectedRowKeys: (string | number)[], rows: any[]): void {
  selectedRows.value = rows
  emit('selectionChange', selectedRowKeys, rows)

  // Call the original onChange if provided
  if (props.rowSelection?.onChange) {
    props.rowSelection.onChange(selectedRowKeys, rows)
  }
}

// Handle table change (pagination, sorting, filtering)
async function handleTableChange(pagination: any, filters: any, sorter: any): Promise<void> {
  const params: TableParams = {
    page: pagination.current,
    pageSize: pagination.pageSize,
    filters: {},
  }

  // Handle sorting
  if (sorter.field) {
    params.sortField = sorter.field
    params.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'
  }

  // Handle filters
  if (filters) {
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key].length > 0) {
        params.filters![key] = filters[key]
      }
    })
  }

  currentParams.value = params
  emit('change', params)

  // Fetch data if fetchData function is provided
  if (props.fetchData) {
    await props.fetchData(params)
  }
}

// Handle export
async function handleExport({ key }: { key: string }): Promise<void> {
  exporting.value = true

  try {
    // Get data to export (either selected rows or all data)
    const dataToExport = selectedRows.value.length > 0 ? selectedRows.value : props.dataSource

    // Get visible column keys
    const visibleCols = props.enableColumnConfig
      ? props.columns.filter((col) => selectedColumnKeys.value.includes(col.key))
      : props.columns

    const columnKeys = visibleCols.map((col) => col.dataIndex)
    const filename = generateFilename('export', key)

    if (key === 'csv') {
      exportTableToCSV(dataToExport, columnKeys, filename)
    } else if (key === 'json') {
      exportTableToJSON(dataToExport, filename)
    }
  } catch (error) {
    console.error('Export failed:', error)
  } finally {
    exporting.value = false
  }
}

// Load column configuration from localStorage
function loadColumnConfig(): void {
  if (!props.enableColumnConfig) return

  const storageKey = getStorageKey()
  const saved = localStorage.getItem(storageKey)

  if (saved) {
    try {
      const savedKeys = JSON.parse(saved)
      // Validate that saved keys exist in current columns
      const validKeys = savedKeys.filter((key: string) =>
        props.columns.some((col) => col.key === key)
      )
      selectedColumnKeys.value =
        validKeys.length > 0 ? validKeys : props.columns.map((col) => col.key)
    } catch (error) {
      console.error('Failed to load column config:', error)
      // Default to all columns
      selectedColumnKeys.value = props.columns.map((col) => col.key)
    }
  } else {
    // Default to all columns
    selectedColumnKeys.value = props.columns.map((col) => col.key)
  }
}

// Save column configuration to localStorage
function handleSaveColumnConfig(): void {
  if (selectedColumnKeys.value.length === 0) {
    console.warn('At least one column must be selected')
    return
  }

  const storageKey = getStorageKey()
  localStorage.setItem(storageKey, JSON.stringify(selectedColumnKeys.value))
  showColumnConfig.value = false
}

// Cancel column configuration
function handleCancelColumnConfig(): void {
  // Reload from storage to revert changes
  loadColumnConfig()
  showColumnConfig.value = false
}

// Select all columns
function selectAllColumns(): void {
  selectedColumnKeys.value = props.columns.map((col) => col.key)
}

// Deselect all columns
function deselectAllColumns(): void {
  selectedColumnKeys.value = []
}

// Reset column configuration
function resetColumnConfig(): void {
  selectedColumnKeys.value = props.columns.map((col) => col.key)
}

// Watch for column changes
watch(
  () => props.columns,
  (newColumns) => {
    if (!props.enableColumnConfig) return

    // Update selected columns if new columns are added
    const currentKeys = new Set(selectedColumnKeys.value)
    const newColumnKeys = newColumns.map((col) => col.key)

    // Remove keys that no longer exist
    selectedColumnKeys.value = selectedColumnKeys.value.filter((key) => newColumnKeys.includes(key))

    // Add new columns
    const newCols = newColumns.filter((col) => !currentKeys.has(col.key))
    if (newCols.length > 0) {
      selectedColumnKeys.value = [...selectedColumnKeys.value, ...newCols.map((col) => col.key)]
    }
  },
  { deep: true }
)

// Watch for row selection changes from parent
watch(
  () => props.rowSelection?.selectedRowKeys,
  (newKeys) => {
    if (newKeys && props.dataSource) {
      // Update selected rows based on keys
      const keyGetter =
        typeof props.rowKey === 'function'
          ? props.rowKey
          : (record: any) => record[props.rowKey as string]

      selectedRows.value = props.dataSource.filter((record) => newKeys.includes(keyGetter(record)))
    }
  },
  { immediate: true }
)

// Initialize
onMounted(() => {
  loadColumnConfig()
})

// Expose methods for parent components
defineExpose({
  loadColumnConfig,
  resetColumnConfig,
  getSelectedRows: () => selectedRows.value,
  clearSelection: () => {
    selectedRows.value = []
  },
})
</script>

<style scoped>
.server-table {
  width: 100%;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 0;
}

.toolbar-left {
  flex: 1;
}

.toolbar-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.selection-info {
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
}

.column-config-content {
  max-height: 400px;
  overflow-y: auto;
}

.column-config-actions {
  display: flex;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 12px;
}

.column-config-item {
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.column-config-item:last-child {
  border-bottom: none;
}
</style>
