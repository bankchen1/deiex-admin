import { ref, watch } from 'vue'
import { localStorageCache } from '@/utils/cache'

interface TableConfig {
  visibleColumns?: string[]
  columnWidths?: Record<string, number>
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  pageSize?: number
  filters?: Record<string, any>
}

/**
 * Composable for persisting table configurations to localStorage
 * This allows users to maintain their table preferences across sessions
 */
export function useTableConfig(tableId: string) {
  const cacheKey = `table_config_${tableId}`

  // Load saved config
  const savedConfig = localStorageCache.get<TableConfig>(cacheKey)

  const visibleColumns = ref<string[]>(savedConfig?.visibleColumns || [])
  const columnWidths = ref<Record<string, number>>(savedConfig?.columnWidths || {})
  const sortField = ref<string | undefined>(savedConfig?.sortField)
  const sortOrder = ref<'asc' | 'desc' | undefined>(savedConfig?.sortOrder)
  const pageSize = ref<number>(savedConfig?.pageSize || 20)
  const filters = ref<Record<string, any>>(savedConfig?.filters || {})

  // Save config to localStorage
  const saveConfig = () => {
    const config: TableConfig = {
      visibleColumns: visibleColumns.value,
      columnWidths: columnWidths.value,
      sortField: sortField.value,
      sortOrder: sortOrder.value,
      pageSize: pageSize.value,
      filters: filters.value,
    }

    // Cache for 30 days
    localStorageCache.set(cacheKey, config, 30 * 24 * 60 * 60 * 1000)
  }

  // Watch for changes and auto-save
  watch(
    [visibleColumns, columnWidths, sortField, sortOrder, pageSize, filters],
    () => {
      saveConfig()
    },
    { deep: true }
  )

  // Reset to defaults
  const resetConfig = () => {
    visibleColumns.value = []
    columnWidths.value = {}
    sortField.value = undefined
    sortOrder.value = undefined
    pageSize.value = 20
    filters.value = {}
    localStorageCache.delete(cacheKey)
  }

  return {
    visibleColumns,
    columnWidths,
    sortField,
    sortOrder,
    pageSize,
    filters,
    saveConfig,
    resetConfig,
  }
}
