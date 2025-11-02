<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :row-selection="rowSelection"
    enable-export
    enable-column-config
    @change="handleTableChange"
  >
    <template #toolbar>
      <a-space>
        <a-input-search
          v-model:value="searchText"
          placeholder="Search by key or text"
          style="width: 300px"
          @search="handleSearch"
        />
        <a-select
          v-model:value="selectedModule"
          placeholder="Filter by module"
          style="width: 200px"
          allow-clear
          @change="handleModuleChange"
        >
          <a-select-option value="">All Modules</a-select-option>
          <a-select-option v-for="module in modules" :key="module" :value="module">
            {{ module }}
          </a-select-option>
        </a-select>
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          Add Entry
        </a-button>
        <a-button @click="handleBulkImport">
          <template #icon><ImportOutlined /></template>
          Bulk Import
        </a-button>
        <a-button @click="handleExport">
          <template #icon><ExportOutlined /></template>
          Export
        </a-button>
        <a-button @click="handleScanMissing">
          <template #icon><ScanOutlined /></template>
          Scan Missing Keys
        </a-button>
      </a-space>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'key'">
        <a-typography-text code>{{ record.key }}</a-typography-text>
      </template>

      <template v-else-if="column.key === 'en'">
        <a-typography-paragraph :ellipsis="{ rows: 2, expandable: true }" style="margin: 0">
          {{ record.en }}
        </a-typography-paragraph>
      </template>

      <template v-else-if="column.key === 'zh'">
        <a-typography-paragraph :ellipsis="{ rows: 2, expandable: true }" style="margin: 0">
          {{ record.zh }}
        </a-typography-paragraph>
      </template>

      <template v-else-if="column.key === 'module'">
        <a-tag color="blue">{{ record.module }}</a-tag>
      </template>

      <template v-else-if="column.key === 'lastUpdated'">
        {{ formatDate(record.lastUpdated) }}
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleEdit(record)">
            <template #icon><EditOutlined /></template>
            Edit
          </a-button>
          <a-popconfirm
            title="Are you sure you want to delete this entry?"
            ok-text="Delete"
            cancel-text="Cancel"
            @confirm="handleDelete(record)"
          >
            <a-button type="link" size="small" danger>
              <template #icon><DeleteOutlined /></template>
              Delete
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ImportOutlined,
  ExportOutlined,
  ScanOutlined,
} from '@ant-design/icons-vue'
import ServerTable from '@/shared/ServerTable.vue'
import { formatDate } from '@/utils/date'
import type { I18nEntry } from '@/services/api/settings'
import type { TableColumn } from '@/types/components'

interface Props {
  dataSource: I18nEntry[]
  loading?: boolean
  pagination?: any
  modules?: string[]
}

interface Emits {
  (e: 'change', params: any): void
  (e: 'add'): void
  (e: 'edit', record: I18nEntry): void
  (e: 'delete', record: I18nEntry): void
  (e: 'bulkImport'): void
  (e: 'export'): void
  (e: 'scanMissing'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  modules: () => [],
})

const emit = defineEmits<Emits>()

const searchText = ref('')
const selectedModule = ref('')

const columns: TableColumn[] = [
  {
    title: 'Key',
    dataIndex: 'key',
    key: 'key',
    width: 250,
    fixed: 'left',
    sortable: true,
  },
  {
    title: 'English',
    dataIndex: 'en',
    key: 'en',
    width: 300,
  },
  {
    title: 'Chinese',
    dataIndex: 'zh',
    key: 'zh',
    width: 300,
  },
  {
    title: 'Module',
    dataIndex: 'module',
    key: 'module',
    width: 120,
    filterable: true,
  },
  {
    title: 'Last Updated',
    dataIndex: 'lastUpdated',
    key: 'lastUpdated',
    width: 180,
    sortable: true,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 180,
    fixed: 'right',
  },
]

const rowSelection = {
  type: 'checkbox' as const,
  onChange: (selectedRowKeys: string[], selectedRows: I18nEntry[]) => {
    console.log('Selected:', selectedRowKeys, selectedRows)
  },
}

function handleTableChange(params: any) {
  emit('change', params)
}

function handleSearch() {
  emit('change', { search: searchText.value })
}

function handleModuleChange() {
  emit('change', { module: selectedModule.value })
}

function handleAdd() {
  emit('add')
}

function handleEdit(record: I18nEntry) {
  emit('edit', record)
}

function handleDelete(record: I18nEntry) {
  emit('delete', record)
}

function handleBulkImport() {
  emit('bulkImport')
}

function handleExport() {
  emit('export')
}

function handleScanMissing() {
  emit('scanMissing')
}
</script>
