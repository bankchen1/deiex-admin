<template>
  <ServerTable
    :columns="columns"
    :data-source="mappingsStore.redirects"
    :loading="mappingsStore.loading"
    :pagination="{
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: mappingsStore.redirectsTotal,
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
          placeholder="Search by path"
          style="width: 250px"
          @search="handleSearch"
        />
        <RBACGuard :permissions="['config.mappings.create']">
          <a-button type="primary" @click="handleCreate">
            <template #icon><PlusOutlined /></template>
            Add Redirect
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
      <template v-if="column.key === 'statusCode'">
        <a-tag :color="record.statusCode === 301 ? 'blue' : 'cyan'">
          {{ record.statusCode }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'hitCount'">
        <a-statistic :value="record.hitCount" :value-style="{ fontSize: '14px' }" />
      </template>

      <template v-else-if="column.key === 'effectiveTo'">
        <span v-if="record.effectiveTo">{{ record.effectiveTo }}</span>
        <a-tag v-else color="green">Permanent</a-tag>
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <RBACGuard :permissions="['config.mappings.edit']">
            <a-button type="link" size="small" @click="handleEdit(record)"> Edit </a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.mappings.delete']">
            <a-popconfirm
              title="Are you sure you want to delete this redirect?"
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
const pagination = ref({
  current: 1,
  pageSize: 20,
})

const columns = [
  {
    title: 'Old Path',
    dataIndex: 'oldPath',
    key: 'oldPath',
    width: 250,
  },
  {
    title: 'New Path',
    dataIndex: 'newPath',
    key: 'newPath',
    width: 250,
  },
  {
    title: 'Status Code',
    dataIndex: 'statusCode',
    key: 'statusCode',
    width: 120,
  },
  {
    title: 'Hit Count',
    dataIndex: 'hitCount',
    key: 'hitCount',
    width: 120,
  },
  {
    title: 'Effective From',
    dataIndex: 'effectiveFrom',
    key: 'effectiveFrom',
    width: 180,
  },
  {
    title: 'Effective To',
    dataIndex: 'effectiveTo',
    key: 'effectiveTo',
    width: 180,
  },
  {
    title: 'Reason',
    dataIndex: 'reason',
    key: 'reason',
    ellipsis: true,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    fixed: 'right' as const,
  },
]

async function fetchData() {
  await mappingsStore.fetchRedirects({
    search: searchText.value,
    page: pagination.value.current,
    pageSize: pagination.value.pageSize,
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
  await mappingsStore.deleteRedirect(id)
  fetchData()
}

async function handleValidate() {
  await mappingsStore.validateRedirects()
}

function handleExport() {
  mappingsStore.exportMappings('redirects')
}

onMounted(() => {
  fetchData()
})
</script>
