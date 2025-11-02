<template>
  <div class="page-api-matrix">
    <a-card title="Page to API Relationship Matrix">
      <template #extra>
        <a-space>
          <a-input-search
            v-model:value="searchText"
            placeholder="Search pages"
            style="width: 200px"
            @search="handleSearch"
          />
          <a-select
            v-model:value="statusFilter"
            placeholder="Filter by status"
            style="width: 120px"
            allow-clear
            @change="handleSearch"
          >
            <a-select-option value="active">Active</a-select-option>
            <a-select-option value="broken">Broken</a-select-option>
          </a-select>
          <RBACGuard :permissions="['config.mappings.scan']">
            <a-button :loading="loading" @click="handleScan">
              <template #icon><SyncOutlined /></template>
              Scan
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

      <a-table
        :columns="columns"
        :data-source="filteredData"
        :loading="loading"
        :pagination="{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
        }"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'pageName'">
            <a-space>
              <span>{{ record.pageName }}</span>
              <a-tag v-if="record.status === 'broken'" color="red">Broken</a-tag>
            </a-space>
          </template>

          <template v-else-if="column.key === 'apiEndpoints'">
            <a-space direction="vertical" size="small" style="width: 100%">
              <a-tag
                v-for="endpoint in record.apiEndpoints"
                :key="endpoint"
                color="blue"
                style="margin: 2px"
              >
                {{ endpoint }}
              </a-tag>
            </a-space>
          </template>

          <template v-else-if="column.key === 'dependencies'">
            <a-space direction="vertical" size="small" style="width: 100%">
              <a-tag
                v-for="dep in record.dependencies"
                :key="dep"
                color="purple"
                style="margin: 2px"
              >
                {{ dep }}
              </a-tag>
            </a-space>
          </template>

          <template v-else-if="column.key === 'actions'">
            <a-space>
              <RBACGuard :permissions="['config.mappings.edit']">
                <a-button type="link" size="small" @click="handleEdit(record)"> Edit </a-button>
              </RBACGuard>
              <a-button type="link" size="small" @click="handleViewDetails(record)">
                Details
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { SyncOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import type { PageApiRelation } from '@/services/api/config.mappings'
import RBACGuard from '@/shared/RBACGuard.vue'

interface Props {
  data: PageApiRelation[]
  loading?: boolean
}

interface Emits {
  (e: 'scan'): void
  (e: 'validate'): void
  (e: 'edit', record: PageApiRelation): void
  (e: 'view-details', record: PageApiRelation): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const searchText = ref('')
const statusFilter = ref<string>()

const columns = [
  {
    title: 'Page Key',
    dataIndex: 'pageKey',
    key: 'pageKey',
    width: 200,
    fixed: 'left' as const,
  },
  {
    title: 'Page Name',
    dataIndex: 'pageName',
    key: 'pageName',
    width: 200,
  },
  {
    title: 'API Endpoints',
    dataIndex: 'apiEndpoints',
    key: 'apiEndpoints',
    width: 300,
  },
  {
    title: 'Dependencies',
    dataIndex: 'dependencies',
    key: 'dependencies',
    width: 250,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    fixed: 'right' as const,
  },
]

const filteredData = computed(() => {
  let result = props.data

  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    result = result.filter(
      (item) =>
        item.pageKey.toLowerCase().includes(search) || item.pageName.toLowerCase().includes(search)
    )
  }

  if (statusFilter.value) {
    result = result.filter((item) => item.status === statusFilter.value)
  }

  return result
})

function handleSearch() {
  // Search is handled by computed property
}

function handleScan() {
  emit('scan')
}

function handleValidate() {
  emit('validate')
}

function handleEdit(record: PageApiRelation) {
  emit('edit', record)
}

function handleViewDetails(record: PageApiRelation) {
  emit('view-details', record)
}
</script>

<style scoped>
.page-api-matrix {
  width: 100%;
}
</style>
