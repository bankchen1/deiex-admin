<template>
  <div class="instruments-page">
    <!-- Version Bar -->
    <VersionBar
      :current-version="currentVersion"
      :draft-exists="draftExists"
      :versions="versions"
      :on-publish="handleOpenPublishModal"
      :on-rollback="handleRollback"
      :on-view-diff="handleViewDiff"
    />

    <!-- Page Header -->
    <div class="page-header">
      <a-space direction="vertical" style="width: 100%" :size="16">
        <!-- Stats Section -->
        <a-row :gutter="16">
          <a-col :span="6">
            <a-card size="small">
              <a-statistic
                title="Total Instruments"
                :value="stats.total"
                :prefix="h(AppstoreOutlined)"
              />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card size="small">
              <a-statistic title="Spot" :value="stats.spot" :value-style="{ color: '#1890ff' }" />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card size="small">
              <a-statistic
                title="Futures"
                :value="stats.futures"
                :value-style="{ color: '#722ed1' }"
              />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card size="small">
              <a-statistic
                title="Drafts"
                :value="stats.drafts"
                :value-style="{ color: stats.drafts > 0 ? '#faad14' : '#52c41a' }"
              />
            </a-card>
          </a-col>
        </a-row>

        <!-- Filter Section -->
        <a-card size="small">
          <a-form layout="inline">
            <a-form-item label="Search">
              <a-input
                v-model:value="filters.search"
                placeholder="Search by symbol, base, quote..."
                style="width: 250px"
                allow-clear
                @press-enter="handleSearch"
              >
                <template #prefix><SearchOutlined /></template>
              </a-input>
            </a-form-item>
            <a-form-item label="Type">
              <a-select
                v-model:value="filters.type"
                style="width: 120px"
                allow-clear
                @change="handleSearch"
              >
                <a-select-option value="all">All</a-select-option>
                <a-select-option value="spot">Spot</a-select-option>
                <a-select-option value="futures">Futures</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Visible">
              <a-select
                v-model:value="filters.visible"
                style="width: 120px"
                allow-clear
                @change="handleSearch"
              >
                <a-select-option :value="true">Visible</a-select-option>
                <a-select-option :value="false">Hidden</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Region">
              <a-select
                v-model:value="filters.region"
                style="width: 120px"
                allow-clear
                @change="handleSearch"
              >
                <a-select-option value="global">Global</a-select-option>
                <a-select-option value="us">US</a-select-option>
                <a-select-option value="eu">EU</a-select-option>
                <a-select-option value="asia">Asia</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="handleSearch">
                  <template #icon><SearchOutlined /></template>
                  Search
                </a-button>
                <a-button @click="handleReset">Reset</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </a-space>
    </div>

    <!-- Tabs -->
    <a-card :tab-list="tabList" :active-tab-key="activeTab" @tab-change="handleTabChange">
      <template #customTab="item">
        <span>
          {{ item.key }}
          <a-badge
            v-if="item.key === 'Drafts' && stats.drafts > 0"
            :count="stats.drafts"
            :number-style="{ backgroundColor: '#faad14' }"
          />
        </span>
      </template>

      <!-- Action Buttons -->
      <template #tabBarExtraContent>
        <a-space>
          <RBACGuard :permissions="['config.instruments.create']">
            <a-button type="primary" @click="handleCreate">
              <template #icon><PlusOutlined /></template>
              Create Instrument
            </a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.instruments.import']">
            <a-button @click="handleOpenImportModal">
              <template #icon><ImportOutlined /></template>
              Bulk Import
            </a-button>
          </RBACGuard>
        </a-space>
      </template>

      <!-- Table -->
      <InstrumentTable
        :data-source="currentData"
        :loading="loading"
        :is-draft="activeTab === 'Drafts'"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
        @refresh="handleRefresh"
      />
    </a-card>

    <!-- Modals -->
    <EditInstrumentDrawer
      v-model:open="editDrawerOpen"
      :instrument="selectedInstrument"
      :mode="drawerMode"
      @success="handleRefresh"
    />

    <BulkImportModal v-model:open="importModalOpen" @success="handleRefresh" />

    <PublishModal v-model:open="publishModalOpen" @success="handleRefresh" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  AppstoreOutlined,
  SearchOutlined,
  PlusOutlined,
  ImportOutlined,
} from '@ant-design/icons-vue'
import VersionBar from '@/shared/VersionBar.vue'
import RBACGuard from '@/shared/RBACGuard.vue'
import InstrumentTable from '@/tables/instruments/InstrumentTable.vue'
import EditInstrumentDrawer from '@/modals/instruments/EditInstrumentDrawer.vue'
import BulkImportModal from '@/modals/instruments/BulkImportModal.vue'
import PublishModal from '@/modals/instruments/PublishModal.vue'
import { useInstrumentsStore } from '@/stores/instruments'
import type { Instrument } from '@/contracts/config'

// Store
const instrumentsStore = useInstrumentsStore()

// State
const loading = ref(false)
const activeTab = ref('All')
const filters = ref({
  search: '',
  type: 'all',
  visible: undefined as boolean | undefined,
  region: undefined as string | undefined,
})
const selectedInstrument = ref<Instrument | undefined>()
const editDrawerOpen = ref(false)
const drawerMode = ref<'create' | 'edit' | 'view'>('create')
const importModalOpen = ref(false)
const publishModalOpen = ref(false)

// Computed
const currentVersion = computed(() => instrumentsStore.currentVersion)
const draftExists = computed(() => instrumentsStore.draftExists)
const versions = computed(() => instrumentsStore.versions)

const stats = computed(() => {
  const published = instrumentsStore.published
  const drafts = instrumentsStore.drafts

  return {
    total: published.length,
    spot: published.filter((i) => i.type === 'spot').length,
    futures: published.filter((i) => i.type === 'futures').length,
    drafts: drafts.length,
  }
})

const currentData = computed(() => {
  switch (activeTab.value) {
    case 'All':
      return instrumentsStore.published
    case 'Spot':
      return instrumentsStore.published.filter((i) => i.type === 'spot')
    case 'Futures':
      return instrumentsStore.published.filter((i) => i.type === 'futures')
    case 'Hidden':
      return instrumentsStore.published.filter((i) => !i.visible)
    case 'Drafts':
      return instrumentsStore.drafts
    default:
      return instrumentsStore.published
  }
})

// Tab list
const tabList = [
  { key: 'All', tab: 'All' },
  { key: 'Spot', tab: 'Spot' },
  { key: 'Futures', tab: 'Futures' },
  { key: 'Hidden', tab: 'Hidden' },
  { key: 'Drafts', tab: 'Drafts' },
]

// Lifecycle
onMounted(() => {
  fetchData()
  instrumentsStore.fetchVersions()
})

// Methods
async function fetchData() {
  loading.value = true
  try {
    await Promise.all([
      instrumentsStore.fetchPublished(filters.value),
      instrumentsStore.fetchDrafts(filters.value),
    ])
  } catch (error) {
    console.error('Failed to fetch instruments:', error)
  } finally {
    loading.value = false
  }
}

function handleTabChange(key: string) {
  activeTab.value = key
}

function handleSearch() {
  fetchData()
}

function handleReset() {
  filters.value = {
    search: '',
    type: 'all',
    visible: undefined,
    region: undefined,
  }
  fetchData()
}

function handleRefresh() {
  fetchData()
}

function handleCreate() {
  selectedInstrument.value = undefined
  drawerMode.value = 'create'
  editDrawerOpen.value = true
}

function handleView(record: Instrument) {
  selectedInstrument.value = record
  drawerMode.value = 'view'
  editDrawerOpen.value = true
}

function handleEdit(record: Instrument) {
  selectedInstrument.value = record
  drawerMode.value = 'edit'
  editDrawerOpen.value = true
}

function handleDelete(record: Instrument) {
  // Deletion is handled in the table component
}

function handleOpenImportModal() {
  importModalOpen.value = true
}

function handleOpenPublishModal() {
  if (!draftExists.value) {
    message.warning('No drafts to publish')
    return
  }
  publishModalOpen.value = true
}

function handleViewDiff() {
  // Open diff viewer modal or navigate to diff page
  message.info('Diff viewer coming soon')
}

async function handleRollback(versionId: string) {
  Modal.confirm({
    title: 'Rollback to Previous Version',
    content:
      'Are you sure you want to rollback to this version? This will replace current published instruments.',
    okText: 'Rollback',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk: async () => {
      try {
        await instrumentsStore.rollback(versionId)
        handleRefresh()
      } catch (error) {
        console.error('Failed to rollback:', error)
      }
    },
  })
}
</script>

<style scoped>
.instruments-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 16px;
}
</style>
