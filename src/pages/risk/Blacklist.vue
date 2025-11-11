<template>
  <div class="blacklist-page">
    <a-page-header title="Blacklist Management" :ghost="false">
      <template #extra>
        <a-space>
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
        </a-space>
      </template>
    </a-page-header>

    <a-card :bordered="false" style="margin-top: 16px">
      <!-- Filter Section -->
      <a-form layout="inline" style="margin-bottom: 16px">
        <a-form-item label="Status">
          <a-select
            v-model:value="filters.status"
            placeholder="All Status"
            style="width: 150px"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="active">Active</a-select-option>
            <a-select-option value="expired">Expired</a-select-option>
            <a-select-option value="removed">Removed</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input-search
            v-model:value="searchValue"
            placeholder="Search by value"
            style="width: 250px"
            @search="handleSearch"
          />
        </a-form-item>
      </a-form>

      <a-tabs v-model:active-key="activeTab" @change="handleTabChange">
        <a-tab-pane key="address" tab="Wallet Addresses">
          <ServerTable
            :columns="columns"
            :data-source="filteredEntries"
            :loading="riskStore.blacklistLoading"
            :pagination="pagination"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'value'">
                <a-typography-text copyable>{{ record.value }}</a-typography-text>
              </template>

              <template v-else-if="column.key === 'type'">
                <a-tag color="blue">{{ record.type }}</a-tag>
              </template>

              <template v-else-if="column.key === 'status'">
                <a-badge :status="getStatusBadge(record.status)" :text="record.status" />
              </template>

              <template v-else-if="column.key === 'source'">
                <a-tag :color="getSourceColor(record.source)">{{ record.source }}</a-tag>
              </template>

              <template v-else-if="column.key === 'operation'">
                <a-space>
                  <a @click="handleView(record)">View</a>
                  <a @click="handleEdit(record)">Edit</a>
                  <a-popconfirm
                    title="Are you sure you want to remove this entry?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="handleRemove(record)"
                  >
                    <a style="color: #ff4d4f">Remove</a>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </ServerTable>
        </a-tab-pane>

        <a-tab-pane key="device" tab="Device IDs">
          <ServerTable
            :columns="columns"
            :data-source="filteredEntries"
            :loading="riskStore.blacklistLoading"
            :pagination="pagination"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'value'">
                <a-typography-text copyable>{{ record.value }}</a-typography-text>
              </template>

              <template v-else-if="column.key === 'type'">
                <a-tag color="blue">{{ record.type }}</a-tag>
              </template>

              <template v-else-if="column.key === 'status'">
                <a-badge :status="getStatusBadge(record.status)" :text="record.status" />
              </template>

              <template v-else-if="column.key === 'source'">
                <a-tag :color="getSourceColor(record.source)">{{ record.source }}</a-tag>
              </template>

              <template v-else-if="column.key === 'operation'">
                <a-space>
                  <a @click="handleView(record)">View</a>
                  <a @click="handleEdit(record)">Edit</a>
                  <a-popconfirm
                    title="Are you sure you want to remove this entry?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="handleRemove(record)"
                  >
                    <a style="color: #ff4d4f">Remove</a>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </ServerTable>
        </a-tab-pane>

        <a-tab-pane key="ip" tab="IP Addresses">
          <ServerTable
            :columns="columns"
            :data-source="filteredEntries"
            :loading="riskStore.blacklistLoading"
            :pagination="pagination"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'value'">
                <a-typography-text copyable>{{ record.value }}</a-typography-text>
              </template>

              <template v-else-if="column.key === 'type'">
                <a-tag color="blue">{{ record.type }}</a-tag>
              </template>

              <template v-else-if="column.key === 'status'">
                <a-badge :status="getStatusBadge(record.status)" :text="record.status" />
              </template>

              <template v-else-if="column.key === 'source'">
                <a-tag :color="getSourceColor(record.source)">{{ record.source }}</a-tag>
              </template>

              <template v-else-if="column.key === 'operation'">
                <a-space>
                  <a @click="handleView(record)">View</a>
                  <a @click="handleEdit(record)">Edit</a>
                  <a-popconfirm
                    title="Are you sure you want to remove this entry?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="handleRemove(record)"
                  >
                    <a style="color: #ff4d4f">Remove</a>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </ServerTable>
        </a-tab-pane>

        <a-tab-pane key="country" tab="Countries">
          <ServerTable
            :columns="columns"
            :data-source="filteredEntries"
            :loading="riskStore.blacklistLoading"
            :pagination="pagination"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'value'">
                <a-typography-text copyable>{{ record.value }}</a-typography-text>
              </template>

              <template v-else-if="column.key === 'type'">
                <a-tag color="blue">{{ record.type }}</a-tag>
              </template>

              <template v-else-if="column.key === 'status'">
                <a-badge :status="getStatusBadge(record.status)" :text="record.status" />
              </template>

              <template v-else-if="column.key === 'source'">
                <a-tag :color="getSourceColor(record.source)">{{ record.source }}</a-tag>
              </template>

              <template v-else-if="column.key === 'operation'">
                <a-space>
                  <a @click="handleView(record)">View</a>
                  <a @click="handleEdit(record)">Edit</a>
                  <a-popconfirm
                    title="Are you sure you want to remove this entry?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="handleRemove(record)"
                  >
                    <a style="color: #ff4d4f">Remove</a>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </ServerTable>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- Add/Edit Drawer -->
    <a-drawer
      v-model:open="drawerVisible"
      :title="drawerMode === 'create' ? 'Add to Blacklist' : 'Edit Blacklist Entry'"
      width="720"
      :body-style="{ paddingBottom: '80px' }"
    >
      <BlacklistForm
        :initial-data="currentEntry"
        :mode="drawerMode"
        :loading="riskStore.blacklistLoading"
        @submit="handleFormSubmit"
        @cancel="drawerVisible = false"
      />
    </a-drawer>

    <!-- View Drawer -->
    <a-drawer v-model:open="viewDrawerVisible" title="Blacklist Entry Details" width="720">
      <a-descriptions v-if="currentEntry" :column="1" bordered>
        <a-descriptions-item label="Type">
          <a-tag color="blue">{{ currentEntry.type }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Value">
          <a-typography-text copyable>{{ currentEntry.value }}</a-typography-text>
        </a-descriptions-item>
        <a-descriptions-item label="Reason">
          {{ currentEntry.reason }}
        </a-descriptions-item>
        <a-descriptions-item label="Source">
          <a-tag :color="getSourceColor(currentEntry.source)">{{ currentEntry.source }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Status">
          <a-badge :status="getStatusBadge(currentEntry.status)" :text="currentEntry.status" />
        </a-descriptions-item>
        <a-descriptions-item label="Added By">
          {{ currentEntry.addedBy || 'System' }}
        </a-descriptions-item>
        <a-descriptions-item label="Added At">
          {{ currentEntry.addedAt }}
        </a-descriptions-item>
        <a-descriptions-item label="Expires At">
          {{ currentEntry.expiresAt || 'Never' }}
        </a-descriptions-item>
        <a-descriptions-item label="Match Count">
          {{ currentEntry.matchCount || 0 }}
        </a-descriptions-item>
        <a-descriptions-item label="Last Matched">
          {{ currentEntry.lastMatchedAt || 'Never' }}
        </a-descriptions-item>
        <a-descriptions-item label="Notes">
          {{ currentEntry.notes || 'N/A' }}
        </a-descriptions-item>
      </a-descriptions>
    </a-drawer>

    <!-- Bulk Import Modal -->
    <BulkImportModal
      ref="bulkImportModalRef"
      v-model:open="bulkImportVisible"
      :loading="riskStore.blacklistLoading"
      @import="handleImportFile"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { PlusOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRiskStore } from '@/stores/risk'
import ServerTable from '@/shared/ServerTable.vue'
import BlacklistForm from '@/forms/risk/BlacklistForm.vue'
import BulkImportModal from '@/modals/risk/BulkImportModal.vue'
import type { BlacklistEntry } from '@/contracts/risk'
import type { TableColumn } from '@/types/components'

const riskStore = useRiskStore()

const activeTab = ref('address')
const drawerVisible = ref(false)
const viewDrawerVisible = ref(false)
const bulkImportVisible = ref(false)
const drawerMode = ref<'create' | 'edit'>('create')
const currentEntry = ref<BlacklistEntry | null>(null)
const searchValue = ref('')
const bulkImportModalRef = ref()

const filters = reactive({
  status: undefined as string | undefined,
})

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
})

const columns: TableColumn[] = [
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    width: 250,
    fixed: 'left',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 120,
  },
  {
    title: 'Reason',
    dataIndex: 'reason',
    key: 'reason',
    width: 250,
  },
  {
    title: 'Source',
    dataIndex: 'source',
    key: 'source',
    width: 100,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: 'Match Count',
    dataIndex: 'matchCount',
    key: 'matchCount',
    width: 120,
  },
  {
    title: 'Added At',
    dataIndex: 'addedAt',
    key: 'addedAt',
    width: 180,
  },
  {
    title: 'Expires At',
    dataIndex: 'expiresAt',
    key: 'expiresAt',
    width: 180,
  },
  {
    title: 'Operation',
    key: 'operation',
    width: 180,
    fixed: 'right',
  },
]

const filteredEntries = computed(() => {
  let entries = riskStore.blacklistEntries.filter((entry) => entry.type === activeTab.value)

  if (filters.status) {
    entries = entries.filter((entry) => entry.status === filters.status)
  }

  if (searchValue.value) {
    entries = entries.filter((entry) =>
      entry.value.toLowerCase().includes(searchValue.value.toLowerCase())
    )
  }

  return entries
})

onMounted(() => {
  loadData()
})

async function loadData() {
  try {
    await riskStore.fetchBlacklist({ type: activeTab.value, status: filters.status })
  } catch (error) {
    console.error('Failed to load blacklist:', error)
  }
}

function handleTabChange(key: string) {
  activeTab.value = key
  loadData()
}

function handleFilterChange() {
  loadData()
}

function handleSearch() {
  // Search is handled by computed property
}

function handleTableChange(params: any) {
  console.log('Table changed:', params)
}

function handleAdd() {
  currentEntry.value = null
  drawerMode.value = 'create'
  drawerVisible.value = true
}

function handleEdit(record: BlacklistEntry) {
  currentEntry.value = record
  drawerMode.value = 'edit'
  drawerVisible.value = true
}

function handleView(record: BlacklistEntry) {
  currentEntry.value = record
  viewDrawerVisible.value = true
}

async function handleRemove(record: BlacklistEntry) {
  try {
    await riskStore.removeFromBlacklist(record.id)
    message.success('Entry removed from blacklist')
  } catch (error) {
    console.error('Failed to remove entry:', error)
  }
}

async function handleFormSubmit(data: Partial<BlacklistEntry>) {
  try {
    if (drawerMode.value === 'create') {
      await riskStore.addToBlacklist(data)
    } else if (currentEntry.value) {
      await riskStore.updateBlacklistEntry(currentEntry.value.id, data)
    }
    drawerVisible.value = false
    await loadData()
  } catch (error) {
    console.error('Failed to save entry:', error)
  }
}

function handleBulkImport() {
  bulkImportVisible.value = true
}

async function handleImportFile(file: File) {
  try {
    const result = await riskStore.bulkImportBlacklist(file)
    if (bulkImportModalRef.value) {
      bulkImportModalRef.value.setImportResult(result.data)
    }
    await loadData()
  } catch (error) {
    console.error('Failed to import blacklist:', error)
  }
}

async function handleExport() {
  try {
    await riskStore.exportBlacklist('json', activeTab.value)
  } catch (error) {
    console.error('Failed to export blacklist:', error)
  }
}

function getStatusBadge(
  status: string
): 'success' | 'processing' | 'default' | 'error' | 'warning' {
  switch (status) {
    case 'active':
      return 'success'
    case 'expired':
      return 'warning'
    case 'removed':
      return 'default'
    default:
      return 'default'
  }
}

function getSourceColor(source: string): string {
  const colors: Record<string, string> = {
    manual: 'blue',
    auto: 'orange',
    import: 'green',
  }
  return colors[source] || 'default'
}
</script>

<style scoped>
.blacklist-page {
  padding: 24px;
}
</style>
