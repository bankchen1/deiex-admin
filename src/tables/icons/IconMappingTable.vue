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
      <a-space>
        <a-input-search
          v-model:value="filters.symbol"
          placeholder="Search by symbol"
          style="width: 200px"
          @search="handleSearch"
        />
      </a-space>
    </template>

    <template #actions>
      <a-space>
        <RBACGuard permissions="config.icons.create">
          <a-button type="primary" @click="handleCreate">
            <template #icon><PlusOutlined /></template>
            New Mapping
          </a-button>
        </RBACGuard>
        <RBACGuard permissions="config.icons.delete">
          <a-button danger :disabled="selectedRowKeys.length === 0" @click="handleBatchDelete">
            <template #icon><DeleteOutlined /></template>
            Delete Selected ({{ selectedRowKeys.length }})
          </a-button>
        </RBACGuard>
      </a-space>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'icon'">
        <div class="icon-cell">
          <img :src="record.iconUrl" :alt="record.iconName" class="icon-thumbnail" />
          <span>{{ record.iconName }}</span>
        </div>
      </template>

      <template v-else-if="column.key === 'symbol'">
        <a-tag color="blue">{{ record.symbol }}</a-tag>
      </template>

      <template v-else-if="column.key === 'createdAt'">
        {{ formatDate(record.createdAt) }}
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <RBACGuard permissions="config.icons.update">
            <a-tooltip title="Edit">
              <a-button type="link" size="small" @click="handleEdit(record)">
                <template #icon><EditOutlined /></template>
              </a-button>
            </a-tooltip>
          </RBACGuard>
          <RBACGuard permissions="config.icons.delete">
            <a-tooltip title="Delete">
              <a-button type="link" danger size="small" @click="handleDelete(record)">
                <template #icon><DeleteOutlined /></template>
              </a-button>
            </a-tooltip>
          </RBACGuard>
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import ServerTable from '@/shared/ServerTable.vue'
import RBACGuard from '@/shared/RBACGuard.vue'
import { useIconsStore } from '@/stores/icons'
import type { IconMapping, IconMappingQueryParams } from '@/services/api/facade'
import type { TableParams } from '@/types/components'
import { formatDate } from '@/utils/date'

interface Emits {
  (e: 'create'): void
  (e: 'edit', mapping: IconMapping): void
}

const emit = defineEmits<Emits>()

const iconsStore = useIconsStore()
const loading = ref(false)
const dataSource = ref<IconMapping[]>([])
const selectedRowKeys = ref<string[]>([])

// Filters
const filters = reactive({
  symbol: '',
})

// Pagination
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `Total ${total} items`,
})

// Row selection
const rowSelection = {
  selectedRowKeys: selectedRowKeys,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys
  },
}

// Table columns
const columns = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    title: 'Icon',
    key: 'icon',
    width: 200,
  },
  {
    title: 'Icon ID',
    dataIndex: 'iconId',
    key: 'iconId',
    width: 200,
  },
  {
    title: 'Created At',
    key: 'createdAt',
    width: 160,
    sortable: true,
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 160,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    fixed: 'right',
  },
]

// Fetch data
async function fetchData(params: TableParams) {
  loading.value = true

  try {
    const queryParams: IconMappingQueryParams = {
      page: params.page,
      pageSize: params.pageSize,
      sortField: params.sortField,
      sortOrder: params.sortOrder,
      symbol: filters.symbol || undefined,
    }

    const response = await iconsStore.fetchMappings(queryParams)
    dataSource.value = response.data.items
    pagination.total = response.data.total

    return response
  } catch (error: any) {
    message.error(error.message || 'Failed to fetch icon mappings')
    throw error
  } finally {
    loading.value = false
  }
}

// Handlers
function handleSearch() {
  pagination.current = 1
  fetchData({
    page: pagination.current,
    pageSize: pagination.pageSize,
  })
}

function handleCreate() {
  emit('create')
}

function handleEdit(record: IconMapping) {
  emit('edit', record)
}

function handleDelete(record: IconMapping) {
  Modal.confirm({
    title: 'Delete Mapping',
    content: `Are you sure you want to delete the mapping for "${record.symbol}"?`,
    okText: 'Delete',
    okType: 'danger',
    onOk: async () => {
      try {
        await iconsStore.deleteMapping(record.id)
        message.success('Mapping deleted successfully')
        fetchData({
          page: pagination.current,
          pageSize: pagination.pageSize,
        })
      } catch (error: any) {
        message.error(error.message || 'Failed to delete mapping')
      }
    },
  })
}

function handleBatchDelete() {
  Modal.confirm({
    title: 'Delete Selected Mappings',
    content: `Are you sure you want to delete ${selectedRowKeys.value.length} mapping(s)?`,
    okText: 'Delete',
    okType: 'danger',
    onOk: async () => {
      try {
        // Delete mappings one by one
        await Promise.all(selectedRowKeys.value.map((id) => iconsStore.deleteMapping(id)))
        message.success(`Successfully deleted ${selectedRowKeys.value.length} mapping(s)`)
        selectedRowKeys.value = []
        fetchData({
          page: pagination.current,
          pageSize: pagination.pageSize,
        })
      } catch (error: any) {
        message.error(error.message || 'Failed to delete mappings')
      }
    },
  })
}

async function handleExport() {
  try {
    await iconsStore.exportMappings({
      page: 1,
      pageSize: 10000,
      symbol: filters.symbol || undefined,
    })
    message.success('Export completed')
  } catch (error: any) {
    message.error(error.message || 'Export failed')
  }
}
</script>

<style scoped>
.icon-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-thumbnail {
  width: 24px;
  height: 24px;
  object-fit: contain;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 2px;
  background: white;
}
</style>
