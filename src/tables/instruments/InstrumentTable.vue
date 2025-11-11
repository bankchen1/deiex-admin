<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :row-selection="rowSelection"
    :fetch-data="fetchData"
    enable-export
    enable-column-config
    @change="handleTableChange"
  >
    <template #toolbar>
      <a-space>
        <RBACGuard :permissions="['config.instruments.edit']">
          <a-button type="primary" :disabled="!hasSelected" @click="handleBatchShow">
            <template #icon><EyeOutlined /></template>
            Show Selected
          </a-button>
          <a-button :disabled="!hasSelected" @click="handleBatchHide">
            <template #icon><EyeInvisibleOutlined /></template>
            Hide Selected
          </a-button>
        </RBACGuard>
        <a-button @click="handleExport">
          <template #icon><ExportOutlined /></template>
          Export
        </a-button>
      </a-space>
    </template>

    <!-- Display Name with i18n -->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'displayName'">
        <div>
          <div>{{ record.displayName?.en || record.symbol }}</div>
          <div v-if="record.displayName?.zh" class="text-gray-500 text-xs">
            {{ record.displayName.zh }}
          </div>
        </div>
      </template>

      <!-- Type Badge -->
      <template v-else-if="column.key === 'type'">
        <a-tag :color="record.type === 'spot' ? 'blue' : 'purple'">
          {{ record.type.toUpperCase() }}
        </a-tag>
      </template>

      <!-- Visible with inline edit -->
      <template v-else-if="column.key === 'visible'">
        <RBACGuard :permissions="['config.instruments.edit']">
          <a-switch
            :checked="record.visible"
            :loading="editingVisible[record.symbol]"
            @change="(checked) => handleVisibleChange(record.symbol, checked)"
          />
        </RBACGuard>
        <a-tag
          v-if="!hasPermission(['config.instruments.edit'])"
          :color="record.visible ? 'green' : 'red'"
        >
          {{ record.visible ? 'Visible' : 'Hidden' }}
        </a-tag>
      </template>

      <!-- Rank with inline edit -->
      <template v-else-if="column.key === 'rank'">
        <RBACGuard :permissions="['config.instruments.edit']">
          <a-input-number
            v-model:value="record.rank"
            :min="0"
            :max="9999"
            size="small"
            style="width: 80px"
            @blur="handleRankChange(record.symbol, record.rank)"
            @press-enter="handleRankChange(record.symbol, record.rank)"
          />
        </RBACGuard>
        <span v-if="!hasPermission(['config.instruments.edit'])">
          {{ record.rank }}
        </span>
      </template>

      <!-- Region Tags -->
      <template v-else-if="column.key === 'region'">
        <a-tag v-for="r in record.region" :key="r" color="default">
          {{ r }}
        </a-tag>
      </template>

      <!-- Tags -->
      <template v-else-if="column.key === 'tags'">
        <a-tag v-for="tag in record.tags" :key="tag" color="blue">
          {{ tag }}
        </a-tag>
      </template>

      <!-- Actions -->
      <template v-else-if="column.key === 'actions'">
        <a-space>
          <RBACGuard :permissions="['config.instruments.view']">
            <a-button type="link" size="small" @click="handleView(record)"> View </a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.instruments.edit']">
            <a-button type="link" size="small" @click="handleEdit(record)"> Edit </a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.instruments.delete']">
            <a-popconfirm
              title="Are you sure you want to delete this instrument?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="handleDelete(record)"
            >
              <a-button type="link" size="small" danger> Delete </a-button>
            </a-popconfirm>
          </RBACGuard>
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { EyeOutlined, EyeInvisibleOutlined, ExportOutlined } from '@ant-design/icons-vue'
import ServerTable from '@/shared/ServerTable.vue'
import RBACGuard from '@/shared/RBACGuard.vue'
import { useInstrumentsStore } from '@/stores/instruments'
import { useAuthStore } from '@/stores/auth'
import type { Instrument } from '@/contracts/config'
import type { TableColumn } from '@/types/components'

interface Props {
  dataSource?: Instrument[]
  loading?: boolean
  isDraft?: boolean
}

interface Emits {
  (e: 'view', record: Instrument): void
  (e: 'edit', record: Instrument): void
  (e: 'delete', record: Instrument): void
  (e: 'refresh'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  isDraft: false,
})

const emit = defineEmits<Emits>()

const instrumentsStore = useInstrumentsStore()
const authStore = useAuthStore()

// State
const selectedRowKeys = ref<string[]>([])
const editingVisible = ref<Record<string, boolean>>({})
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
})

// Computed
const hasSelected = computed(() => selectedRowKeys.value.length > 0)

const hasPermission = (permissions: string[]) => {
  return authStore.hasAnyPermission(permissions)
}

// Table columns
const columns: TableColumn[] = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    width: 120,
    fixed: 'left',
    sortable: true,
  },
  {
    title: 'Display Name',
    dataIndex: 'displayName',
    key: 'displayName',
    width: 180,
  },
  {
    title: 'Base',
    dataIndex: 'base',
    key: 'base',
    width: 80,
  },
  {
    title: 'Quote',
    dataIndex: 'quote',
    key: 'quote',
    width: 80,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 100,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Spot', value: 'spot' },
      { label: 'Futures', value: 'futures' },
    ],
  },
  {
    title: 'Price Precision',
    dataIndex: 'pricePrecision',
    key: 'pricePrecision',
    width: 120,
  },
  {
    title: 'Qty Step',
    dataIndex: 'qtyStep',
    key: 'qtyStep',
    width: 120,
  },
  {
    title: 'Min Order',
    dataIndex: 'minOrder',
    key: 'minOrder',
    width: 120,
  },
  {
    title: 'Visible',
    dataIndex: 'visible',
    key: 'visible',
    width: 100,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Visible', value: true },
      { label: 'Hidden', value: false },
    ],
  },
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    width: 100,
    sortable: true,
  },
  {
    title: 'Region',
    dataIndex: 'region',
    key: 'region',
    width: 150,
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    key: 'tags',
    width: 150,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    fixed: 'right',
  },
]

// Row selection
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys
  },
  getCheckboxProps: (record: Instrument) => ({
    disabled: !hasPermission(['config.instruments.edit']),
  }),
}))

// Methods
async function fetchData(params: any) {
  try {
    const response = props.isDraft
      ? await instrumentsStore.fetchDrafts(params)
      : await instrumentsStore.fetchPublished(params)

    pagination.value.total = props.isDraft
      ? instrumentsStore.draftsTotal
      : instrumentsStore.publishedTotal

    return response
  } catch (error) {
    console.error('Failed to fetch instruments:', error)
    throw error
  }
}

function handleTableChange(pag: any, filters: any, sorter: any) {
  pagination.value = pag
}

async function handleVisibleChange(symbol: string, visible: boolean) {
  if (!props.isDraft) {
    message.warning('Can only edit draft instruments')
    return
  }

  editingVisible.value[symbol] = true
  try {
    await instrumentsStore.updateDraft(symbol, { visible })
    emit('refresh')
  } catch (error) {
    console.error('Failed to update visibility:', error)
  } finally {
    editingVisible.value[symbol] = false
  }
}

async function handleRankChange(symbol: string, rank: number) {
  if (!props.isDraft) {
    message.warning('Can only edit draft instruments')
    return
  }

  try {
    await instrumentsStore.updateDraft(symbol, { rank })
    emit('refresh')
  } catch (error) {
    console.error('Failed to update rank:', error)
  }
}

async function handleBatchShow() {
  if (!props.isDraft) {
    message.warning('Can only edit draft instruments')
    return
  }

  try {
    await instrumentsStore.batchShow(selectedRowKeys.value)
    selectedRowKeys.value = []
    emit('refresh')
  } catch (error) {
    console.error('Failed to show instruments:', error)
  }
}

async function handleBatchHide() {
  if (!props.isDraft) {
    message.warning('Can only edit draft instruments')
    return
  }

  try {
    await instrumentsStore.batchHide(selectedRowKeys.value)
    selectedRowKeys.value = []
    emit('refresh')
  } catch (error) {
    console.error('Failed to hide instruments:', error)
  }
}

function handleExport() {
  instrumentsStore.exportData({
    format: 'csv',
    status: props.isDraft ? 'draft' : 'published',
  })
}

function handleView(record: Instrument) {
  emit('view', record)
}

function handleEdit(record: Instrument) {
  emit('edit', record)
}

async function handleDelete(record: Instrument) {
  if (!props.isDraft) {
    message.warning('Can only delete draft instruments')
    return
  }

  try {
    await instrumentsStore.deleteDraft(record.symbol)
    emit('refresh')
  } catch (error) {
    console.error('Failed to delete instrument:', error)
  }
}
</script>

<style scoped>
.text-gray-500 {
  color: rgba(0, 0, 0, 0.45);
}

.text-xs {
  font-size: 12px;
}
</style>
