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
          v-model:value="filters.name"
          placeholder="Search by name"
          style="width: 200px"
          @search="handleSearch"
        />
        <a-select
          v-model:value="filters.type"
          placeholder="All Types"
          style="width: 120px"
          allow-clear
          @change="handleSearch"
        >
          <a-select-option value="svg">SVG</a-select-option>
          <a-select-option value="png">PNG</a-select-option>
        </a-select>
        <TagPicker
          v-model:value="filters.tags"
          placeholder="Filter by tags"
          style="width: 200px"
          @change="handleSearch"
        />
      </a-space>
    </template>

    <template #actions>
      <a-space>
        <RBACGuard permissions="config.icons.create">
          <a-button type="primary" @click="handleCreate">
            <template #icon><PlusOutlined /></template>
            New Icon
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
      <template v-if="column.key === 'preview'">
        <div class="icon-preview-cell">
          <img :src="record.lightUrl" :alt="record.name" class="icon-thumbnail" />
          <img
            v-if="record.darkUrl"
            :src="record.darkUrl"
            :alt="record.name"
            class="icon-thumbnail dark"
          />
        </div>
      </template>

      <template v-else-if="column.key === 'name'">
        <a @click="handlePreview(record)">{{ record.name }}</a>
      </template>

      <template v-else-if="column.key === 'type'">
        <a-tag :color="record.type === 'svg' ? 'blue' : 'green'">
          {{ record.type.toUpperCase() }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'dimensions'">
        {{ record.width }}x{{ record.height }}px
      </template>

      <template v-else-if="column.key === 'fileSize'">
        {{ formatFileSize(record.fileSize) }}
      </template>

      <template v-else-if="column.key === 'hasTransparency'">
        <a-tag :color="record.hasTransparency ? 'success' : 'default'">
          {{ record.hasTransparency ? 'Yes' : 'No' }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'tags'">
        <a-space wrap>
          <a-tag v-for="tag in record.tags" :key="tag" style="margin: 2px">
            {{ tag }}
          </a-tag>
        </a-space>
      </template>

      <template v-else-if="column.key === 'createdAt'">
        {{ formatDate(record.createdAt) }}
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-tooltip title="Preview">
            <a-button type="link" size="small" @click="handlePreview(record)">
              <template #icon><EyeOutlined /></template>
            </a-button>
          </a-tooltip>
          <RBACGuard permissions="config.icons.update">
            <a-tooltip title="Edit">
              <a-button type="link" size="small" @click="handleEdit(record)">
                <template #icon><EditOutlined /></template>
              </a-button>
            </a-tooltip>
          </RBACGuard>
          <RBACGuard permissions="config.icons.update">
            <a-tooltip title="Replace">
              <a-button type="link" size="small" @click="handleReplace(record)">
                <template #icon><SwapOutlined /></template>
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
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  SwapOutlined,
} from '@ant-design/icons-vue'
import ServerTable from '@/shared/ServerTable.vue'
import RBACGuard from '@/shared/RBACGuard.vue'
import TagPicker from '@/shared/TagPicker.vue'
import { useIconsStore } from '@/stores/icons'
import type { IconAsset, IconAssetQueryParams } from '@/services/api/config.icons'
import type { TableParams } from '@/types/components'
import { formatDate } from '@/utils/date'

interface Emits {
  (e: 'create'): void
  (e: 'edit', icon: IconAsset): void
  (e: 'preview', icon: IconAsset): void
  (e: 'replace', icon: IconAsset): void
}

const emit = defineEmits<Emits>()

const iconsStore = useIconsStore()
const loading = ref(false)
const dataSource = ref<IconAsset[]>([])
const selectedRowKeys = ref<string[]>([])

// Filters
const filters = reactive({
  name: '',
  type: undefined as 'svg' | 'png' | undefined,
  tags: [] as string[],
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
    title: 'Preview',
    key: 'preview',
    width: 100,
    fixed: 'left',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 80,
  },
  {
    title: 'Dimensions',
    key: 'dimensions',
    width: 120,
  },
  {
    title: 'File Size',
    key: 'fileSize',
    width: 100,
  },
  {
    title: 'Transparency',
    key: 'hasTransparency',
    width: 120,
  },
  {
    title: 'Tags',
    key: 'tags',
    width: 200,
  },
  {
    title: 'Created At',
    key: 'createdAt',
    width: 160,
    sortable: true,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 180,
    fixed: 'right',
  },
]

// Fetch data
async function fetchData(params: TableParams) {
  loading.value = true

  try {
    const queryParams: IconAssetQueryParams = {
      page: params.page,
      pageSize: params.pageSize,
      sortField: params.sortField,
      sortOrder: params.sortOrder,
      name: filters.name || undefined,
      type: filters.type,
      tags: filters.tags.length > 0 ? filters.tags : undefined,
    }

    const response = await iconsStore.fetchAssets(queryParams)
    dataSource.value = response.data.items
    pagination.total = response.data.total

    return response
  } catch (error: any) {
    message.error(error.message || 'Failed to fetch icon assets')
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

function handleEdit(record: IconAsset) {
  emit('edit', record)
}

function handlePreview(record: IconAsset) {
  emit('preview', record)
}

function handleReplace(record: IconAsset) {
  emit('replace', record)
}

function handleDelete(record: IconAsset) {
  Modal.confirm({
    title: 'Delete Icon',
    content: `Are you sure you want to delete "${record.name}"? This action cannot be undone.`,
    okText: 'Delete',
    okType: 'danger',
    onOk: async () => {
      try {
        await iconsStore.deleteAsset(record.id)
        message.success('Icon deleted successfully')
        fetchData({
          page: pagination.current,
          pageSize: pagination.pageSize,
        })
      } catch (error: any) {
        message.error(error.message || 'Failed to delete icon')
      }
    },
  })
}

function handleBatchDelete() {
  Modal.confirm({
    title: 'Delete Selected Icons',
    content: `Are you sure you want to delete ${selectedRowKeys.value.length} icon(s)? This action cannot be undone.`,
    okText: 'Delete',
    okType: 'danger',
    onOk: async () => {
      try {
        await iconsStore.bulkDeleteAssets(selectedRowKeys.value)
        message.success(`Successfully deleted ${selectedRowKeys.value.length} icon(s)`)
        selectedRowKeys.value = []
        fetchData({
          page: pagination.current,
          pageSize: pagination.pageSize,
        })
      } catch (error: any) {
        message.error(error.message || 'Failed to delete icons')
      }
    },
  })
}

async function handleExport() {
  try {
    await iconsStore.exportAssets({
      page: 1,
      pageSize: 10000,
      name: filters.name || undefined,
      type: filters.type,
      tags: filters.tags.length > 0 ? filters.tags : undefined,
    })
    message.success('Export completed')
  } catch (error: any) {
    message.error(error.message || 'Export failed')
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}
</script>

<style scoped>
.icon-preview-cell {
  display: flex;
  gap: 8px;
  align-items: center;
}

.icon-thumbnail {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 4px;
  background: white;
}

.icon-thumbnail.dark {
  background: #1f1f1f;
}
</style>
