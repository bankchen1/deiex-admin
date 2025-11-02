<template>
  <ServerTable
    :columns="columns"
    :data-source="mappingsStore.navMappings"
    :loading="mappingsStore.loading"
    :pagination="{
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: mappingsStore.navMappingsTotal,
      showSizeChanger: true,
      showQuickJumper: true,
    }"
    :enable-export="true"
    @change="handleTableChange"
    @export="handleExport"
  >
    <template #toolbar>
      <a-space>
        <a-input-search
          v-model:value="searchText"
          placeholder="Search by nav key or label"
          style="width: 250px"
          @search="handleSearch"
        />
        <a-select
          v-model:value="statusFilter"
          placeholder="Filter by status"
          style="width: 150px"
          allow-clear
          @change="handleSearch"
        >
          <a-select-option value="active">Active</a-select-option>
          <a-select-option value="deprecated">Deprecated</a-select-option>
        </a-select>
        <RBACGuard :permissions="['config.mappings.create']">
          <a-button type="primary" @click="handleCreate">
            <template #icon><PlusOutlined /></template>
            Add Mapping
          </a-button>
        </RBACGuard>
        <RBACGuard :permissions="['config.mappings.validate']">
          <a-button @click="handleValidate">
            <template #icon><CheckCircleOutlined /></template>
            Validate
          </a-button>
        </RBACGuard>
      </a-space>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
        <a-tag :color="record.status === 'active' ? 'green' : 'orange'">
          {{ record.status }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'method'">
        <a-tag :color="getMethodColor(record.method)">
          {{ record.method }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <RBACGuard :permissions="['config.mappings.edit']">
            <a-button type="link" size="small" @click="handleEdit(record)"> Edit </a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.mappings.delete']">
            <a-popconfirm
              title="Are you sure you want to delete this mapping?"
              @confirm="handleDelete(record.id)"
            >
              <a-button type="link" danger size="small">Delete</a-button>
            </a-popconfirm>
          </RBACGuard>
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { useMappingsStore } from '@/stores/mappings'
import ServerTable from '@/shared/ServerTable.vue'
import RBACGuard from '@/shared/RBACGuard.vue'

interface Emits {
  (e: 'create'): void
  (e: 'edit', record: any): void
}

const emit = defineEmits<Emits>()

const mappingsStore = useMappingsStore()

const searchText = ref('')
const statusFilter = ref<string>()
const pagination = ref({
  current: 1,
  pageSize: 20,
})

const columns = [
  {
    title: 'Nav Key',
    dataIndex: 'navKey',
    key: 'navKey',
    width: 200,
  },
  {
    title: 'Nav Label',
    dataIndex: 'navLabel',
    key: 'navLabel',
    width: 200,
  },
  {
    title: 'API Endpoint',
    dataIndex: 'apiEndpoint',
    key: 'apiEndpoint',
    width: 300,
  },
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method',
    width: 100,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 180,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    fixed: 'right' as const,
  },
]

function getMethodColor(method: string) {
  const colors: Record<string, string> = {
    GET: 'blue',
    POST: 'green',
    PUT: 'orange',
    PATCH: 'purple',
    DELETE: 'red',
  }
  return colors[method] || 'default'
}

async function fetchData() {
  await mappingsStore.fetchNavMappings({
    status: statusFilter.value,
    search: searchText.value,
  })
}

function handleTableChange(pag: any) {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchData()
}

function handleSearch() {
  pagination.value.current = 1
  fetchData()
}

function handleCreate() {
  emit('create')
}

function handleEdit(record: any) {
  emit('edit', record)
}

async function handleDelete(id: string) {
  await mappingsStore.deleteNavMapping(id)
  fetchData()
}

async function handleValidate() {
  await mappingsStore.validateNavMappings()
}

function handleExport() {
  mappingsStore.exportMappings('nav-to-api')
}

onMounted(() => {
  fetchData()
})
</script>
