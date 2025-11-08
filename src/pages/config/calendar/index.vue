<template>
  <div class="calendar-page">
    <a-page-header
      title="Calendar Configuration"
      sub-title="Manage funding rates, maintenance windows, and announcements"
    >
      <template #extra>
        <a-space>
          <RBACGuard :permissions="['config.calendar.export']">
            <a-button @click="handleExport">
              <template #icon><ExportOutlined /></template>
              Export
            </a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.calendar.import']">
            <a-button @click="handleImport">
              <template #icon><ImportOutlined /></template>
              Import
            </a-button>
          </RBACGuard>
        </a-space>
      </template>
    </a-page-header>

    <VersionBar
      v-if="calendarStore.draftExists"
      :current-version="calendarStore.currentVersion"
      :draft-exists="calendarStore.draftExists"
      :versions="calendarStore.versions"
      :on-publish="handlePublish"
      :on-rollback="handleRollback"
      :on-view-diff="handleViewDiff"
    />

    <a-card :bordered="false" style="margin-top: 16px">
      <a-tabs v-model:active-key="activeTab">
        <!-- Funding Tab -->
        <a-tab-pane key="funding" tab="Funding">
          <div style="margin-bottom: 16px">
            <a-space>
              <RBACGuard :permissions="['config.calendar.create']">
                <a-button type="primary" @click="handleCreateFunding">
                  <template #icon><PlusOutlined /></template>
                  Create Funding Rule
                </a-button>
              </RBACGuard>
              <RBACGuard :permissions="['config.calendar.delete']">
                <a-button
                  danger
                  :disabled="selectedFunding.length === 0"
                  @click="handleBatchDeleteFunding"
                >
                  <template #icon><DeleteOutlined /></template>
                  Delete Selected ({{ selectedFunding.length }})
                </a-button>
              </RBACGuard>
            </a-space>
          </div>

          <a-radio-group
            v-model:value="fundingStatus"
            button-style="solid"
            style="margin-bottom: 16px"
          >
            <a-radio-button value="published">Published</a-radio-button>
            <a-radio-button value="draft">Drafts</a-radio-button>
          </a-radio-group>

          <FundingScheduleTable
            :data-source="currentFunding"
            :loading="calendarStore.loading"
            :total="currentFundingTotal"
            @edit="handleEditFunding"
            @delete="handleDeleteFunding"
            @view="handleViewFunding"
            @fetch="handleFetchFunding"
            @selection-change="handleFundingSelectionChange"
          />
        </a-tab-pane>

        <!-- Maintenance Tab -->
        <a-tab-pane key="maintenance" tab="Maintenance">
          <div style="margin-bottom: 16px">
            <a-space>
              <RBACGuard :permissions="['config.calendar.create']">
                <a-button type="primary" @click="handleCreateMaintenance">
                  <template #icon><PlusOutlined /></template>
                  Schedule Maintenance
                </a-button>
              </RBACGuard>
              <RBACGuard :permissions="['config.calendar.delete']">
                <a-button
                  danger
                  :disabled="selectedMaintenance.length === 0"
                  @click="handleBatchDeleteMaintenance"
                >
                  <template #icon><DeleteOutlined /></template>
                  Delete Selected ({{ selectedMaintenance.length }})
                </a-button>
              </RBACGuard>
            </a-space>
          </div>

          <a-radio-group
            v-model:value="maintenanceStatus"
            button-style="solid"
            style="margin-bottom: 16px"
          >
            <a-radio-button value="published">Published</a-radio-button>
            <a-radio-button value="draft">Drafts</a-radio-button>
          </a-radio-group>

          <MaintenanceTable
            :data-source="currentMaintenance"
            :loading="calendarStore.loading"
            :total="currentMaintenanceTotal"
            @edit="handleEditMaintenance"
            @delete="handleDeleteMaintenance"
            @view="handleViewMaintenance"
            @fetch="handleFetchMaintenance"
            @selection-change="handleMaintenanceSelectionChange"
          />
        </a-tab-pane>

        <!-- Announcements Tab -->
        <a-tab-pane key="announcements" tab="Events/Announcements">
          <div style="margin-bottom: 16px">
            <a-space>
              <RBACGuard :permissions="['config.calendar.create']">
                <a-button type="primary" @click="handleCreateAnnouncement">
                  <template #icon><PlusOutlined /></template>
                  Create Announcement
                </a-button>
              </RBACGuard>
              <RBACGuard :permissions="['config.calendar.delete']">
                <a-button
                  danger
                  :disabled="selectedAnnouncements.length === 0"
                  @click="handleBatchDeleteAnnouncements"
                >
                  <template #icon><DeleteOutlined /></template>
                  Delete Selected ({{ selectedAnnouncements.length }})
                </a-button>
              </RBACGuard>
            </a-space>
          </div>

          <a-radio-group
            v-model:value="announcementStatus"
            button-style="solid"
            style="margin-bottom: 16px"
          >
            <a-radio-button value="published">Published</a-radio-button>
            <a-radio-button value="draft">Drafts</a-radio-button>
          </a-radio-group>

          <AnnouncementTable
            :data-source="currentAnnouncements"
            :loading="calendarStore.loading"
            :total="currentAnnouncementsTotal"
            @edit="handleEditAnnouncement"
            @delete="handleDeleteAnnouncement"
            @view="handleViewAnnouncement"
            @fetch="handleFetchAnnouncements"
            @selection-change="handleAnnouncementSelectionChange"
          />
        </a-tab-pane>

        <!-- Drafts Tab -->
        <a-tab-pane key="drafts" tab="Drafts">
          <a-alert
            v-if="calendarStore.draftExists"
            type="info"
            message="You have unpublished changes"
            description="Review your changes and publish them to apply to production."
            show-icon
            style="margin-bottom: 16px"
          />
          <a-empty v-else description="No draft changes" />

          <a-row v-if="calendarStore.draftExists" :gutter="16">
            <a-col :span="8">
              <a-card title="Draft Funding Rules" size="small">
                <a-list :data-source="calendarStore.draftFunding" size="small">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta
                        :title="item.symbol"
                        :description="`Period: ${item.period}h`"
                      />
                    </a-list-item>
                  </template>
                </a-list>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card title="Draft Maintenance" size="small">
                <a-list :data-source="calendarStore.draftMaintenance" size="small">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta :title="item.title" :description="item.scope" />
                    </a-list-item>
                  </template>
                </a-list>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card title="Draft Announcements" size="small">
                <a-list :data-source="calendarStore.draftAnnouncements" size="small">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta :title="item.title.en" :description="item.type" />
                    </a-list-item>
                  </template>
                </a-list>
              </a-card>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- Funding Rule Drawer -->
    <EditFundingDrawer
      v-model:open="fundingDrawerVisible"
      :funding="editingFunding"
      :mode="fundingDrawerMode"
      :loading="calendarStore.loading"
      @submit="handleFundingSubmit"
      @close="handleFundingDrawerClose"
    />

    <!-- Maintenance Drawer -->
    <EditMaintenanceDrawer
      v-model:open="maintenanceDrawerVisible"
      :maintenance="editingMaintenance"
      :mode="maintenanceDrawerMode"
      :loading="calendarStore.loading"
      @submit="handleMaintenanceSubmit"
      @close="handleMaintenanceDrawerClose"
    />

    <!-- Announcement Drawer -->
    <EditAnnouncementDrawer
      v-model:open="announcementDrawerVisible"
      :announcement="editingAnnouncement"
      :mode="announcementDrawerMode"
      :loading="calendarStore.loading"
      @submit="handleAnnouncementSubmit"
      @close="handleAnnouncementDrawerClose"
    />

    <!-- Publish Modal -->
    <PublishModal
      v-model:open="publishModalVisible"
      :diff-data="calendarStore.diffData"
      :loading="calendarStore.loading"
      :loading-diff="loadingDiff"
      @publish="handlePublishConfirm"
      @close="publishModalVisible = false"
    />

    <!-- Diff Modal -->
    <DiffModal
      v-model:open="diffModalVisible"
      :diff-data="calendarStore.diffData"
      :loading="loadingDiff"
      @close="diffModalVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { PlusOutlined, DeleteOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import { useCalendarStore } from '@/stores/calendar'
import RBACGuard from '@/shared/RBACGuard.vue'
import VersionBar from '@/shared/VersionBar.vue'
import FundingScheduleTable from '@/tables/calendar/FundingScheduleTable.vue'
import MaintenanceTable from '@/tables/calendar/MaintenanceTable.vue'
import AnnouncementTable from '@/tables/calendar/AnnouncementTable.vue'
import EditFundingDrawer from '@/modals/calendar/EditFundingDrawer.vue'
import EditMaintenanceDrawer from '@/modals/calendar/EditMaintenanceDrawer.vue'
import EditAnnouncementDrawer from '@/modals/calendar/EditAnnouncementDrawer.vue'
import PublishModal from '@/modals/calendar/PublishModal.vue'
import DiffModal from '@/modals/calendar/DiffModal.vue'
import type { FundingRule, MaintenanceWindow, Announcement } from '@/types/models'
import type { TableParams } from '@/types/components'

const calendarStore = useCalendarStore()

const activeTab = ref('funding')
const fundingStatus = ref<'published' | 'draft'>('published')
const maintenanceStatus = ref<'published' | 'draft'>('published')
const announcementStatus = ref<'published' | 'draft'>('published')

const selectedFunding = ref<FundingRule[]>([])
const selectedMaintenance = ref<MaintenanceWindow[]>([])
const selectedAnnouncements = ref<Announcement[]>([])

const fundingDrawerVisible = ref(false)
const fundingDrawerMode = ref<'create' | 'edit' | 'view'>('create')
const editingFunding = ref<FundingRule | null>(null)

const maintenanceDrawerVisible = ref(false)
const maintenanceDrawerMode = ref<'create' | 'edit' | 'view'>('create')
const editingMaintenance = ref<MaintenanceWindow | null>(null)

const announcementDrawerVisible = ref(false)
const announcementDrawerMode = ref<'create' | 'edit' | 'view'>('create')
const editingAnnouncement = ref<Announcement | null>(null)

const publishModalVisible = ref(false)
const diffModalVisible = ref(false)
const loadingDiff = ref(false)

const currentFunding = computed(() =>
  fundingStatus.value === 'published' ? calendarStore.publishedFunding : calendarStore.draftFunding
)

const currentFundingTotal = computed(() =>
  fundingStatus.value === 'published'
    ? calendarStore.publishedFundingTotal
    : calendarStore.draftFundingTotal
)

const currentMaintenance = computed(() =>
  maintenanceStatus.value === 'published'
    ? calendarStore.publishedMaintenance
    : calendarStore.draftMaintenance
)

const currentMaintenanceTotal = computed(() =>
  maintenanceStatus.value === 'published'
    ? calendarStore.publishedMaintenanceTotal
    : calendarStore.draftMaintenanceTotal
)

const currentAnnouncements = computed(() =>
  announcementStatus.value === 'published'
    ? calendarStore.publishedAnnouncements
    : calendarStore.draftAnnouncements
)

const currentAnnouncementsTotal = computed(() =>
  announcementStatus.value === 'published'
    ? calendarStore.publishedAnnouncementsTotal
    : calendarStore.draftAnnouncementsTotal
)

onMounted(async () => {
  await Promise.all([
    calendarStore.fetchPublishedFunding(),
    calendarStore.fetchPublishedMaintenance(),
    calendarStore.fetchPublishedAnnouncements(),
    calendarStore.fetchVersions(),
  ])
})

watch(fundingStatus, async (newStatus) => {
  if (newStatus === 'published') {
    await calendarStore.fetchPublishedFunding()
  } else {
    await calendarStore.fetchDraftFunding()
  }
})

watch(maintenanceStatus, async (newStatus) => {
  if (newStatus === 'published') {
    await calendarStore.fetchPublishedMaintenance()
  } else {
    await calendarStore.fetchDraftMaintenance()
  }
})

watch(announcementStatus, async (newStatus) => {
  if (newStatus === 'published') {
    await calendarStore.fetchPublishedAnnouncements()
  } else {
    await calendarStore.fetchDraftAnnouncements()
  }
})

// Funding handlers
function handleCreateFunding() {
  editingFunding.value = null
  fundingDrawerMode.value = 'create'
  fundingDrawerVisible.value = true
}

function handleEditFunding(record: FundingRule) {
  editingFunding.value = record
  fundingDrawerMode.value = 'edit'
  fundingDrawerVisible.value = true
}

function handleViewFunding(record: FundingRule) {
  editingFunding.value = record
  fundingDrawerMode.value = 'view'
  fundingDrawerVisible.value = true
}

async function handleDeleteFunding(record: FundingRule) {
  try {
    await calendarStore.deleteDraftFunding(record.id)
  } catch (error) {
    console.error('Failed to delete funding rule:', error)
  }
}

async function handleBatchDeleteFunding() {
  Modal.confirm({
    title: 'Delete Funding Rules',
    content: `Are you sure you want to delete ${selectedFunding.value.length} funding rule(s)?`,
    okText: 'Delete',
    okType: 'danger',
    onOk: async () => {
      for (const funding of selectedFunding.value) {
        await calendarStore.deleteDraftFunding(funding.id)
      }
      selectedFunding.value = []
    },
  })
}

async function handleFundingSubmit(payload: any) {
  try {
    if (fundingDrawerMode.value === 'create') {
      await calendarStore.createDraftFunding(payload)
    } else if (fundingDrawerMode.value === 'edit' && currentFunding.value) {
      await calendarStore.updateDraftFunding(currentFunding.value.id, payload)
    }
    fundingDrawerVisible.value = false
    await calendarStore.fetchDraftFunding()
  } catch (error) {
    console.error('Failed to save funding rule:', error)
  }
}

function handleFundingDrawerClose() {
  fundingDrawerVisible.value = false
  editingFunding.value = null
}

function handleFetchFunding(params: TableParams) {
  const queryParams = {
    page: params.page,
    pageSize: params.pageSize,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    status: fundingStatus.value,
  }
  if (fundingStatus.value === 'published') {
    calendarStore.fetchPublishedFunding(queryParams)
  } else {
    calendarStore.fetchDraftFunding(queryParams)
  }
}

function handleFundingSelectionChange(keys: string[], rows: FundingRule[]) {
  selectedFunding.value = rows
}

// Maintenance handlers
function handleCreateMaintenance() {
  editingMaintenance.value = null
  maintenanceDrawerMode.value = 'create'
  maintenanceDrawerVisible.value = true
}

function handleEditMaintenance(record: MaintenanceWindow) {
  editingMaintenance.value = record
  maintenanceDrawerMode.value = 'edit'
  maintenanceDrawerVisible.value = true
}

function handleViewMaintenance(record: MaintenanceWindow) {
  editingMaintenance.value = record
  maintenanceDrawerMode.value = 'view'
  maintenanceDrawerVisible.value = true
}

async function handleDeleteMaintenance(record: MaintenanceWindow) {
  try {
    await calendarStore.deleteDraftMaintenance(record.id)
  } catch (error) {
    console.error('Failed to delete maintenance:', error)
  }
}

async function handleBatchDeleteMaintenance() {
  Modal.confirm({
    title: 'Delete Maintenance Windows',
    content: `Are you sure you want to delete ${selectedMaintenance.value.length} maintenance window(s)?`,
    okText: 'Delete',
    okType: 'danger',
    onOk: async () => {
      for (const maintenance of selectedMaintenance.value) {
        await calendarStore.deleteDraftMaintenance(maintenance.id)
      }
      selectedMaintenance.value = []
    },
  })
}

async function handleMaintenanceSubmit(payload: any) {
  try {
    if (maintenanceDrawerMode.value === 'create') {
      await calendarStore.createDraftMaintenance(payload)
    } else if (maintenanceDrawerMode.value === 'edit' && currentMaintenance.value) {
      await calendarStore.updateDraftMaintenance(currentMaintenance.value.id, payload)
    }
    maintenanceDrawerVisible.value = false
    await calendarStore.fetchDraftMaintenance()
  } catch (error) {
    console.error('Failed to save maintenance:', error)
  }
}

function handleMaintenanceDrawerClose() {
  maintenanceDrawerVisible.value = false
  editingMaintenance.value = null
}

function handleFetchMaintenance(params: TableParams) {
  const queryParams = {
    page: params.page,
    pageSize: params.pageSize,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    status: maintenanceStatus.value,
  }
  if (maintenanceStatus.value === 'published') {
    calendarStore.fetchPublishedMaintenance(queryParams)
  } else {
    calendarStore.fetchDraftMaintenance(queryParams)
  }
}

function handleMaintenanceSelectionChange(keys: string[], rows: MaintenanceWindow[]) {
  selectedMaintenance.value = rows
}

// Announcement handlers
function handleCreateAnnouncement() {
  editingAnnouncement.value = null
  announcementDrawerMode.value = 'create'
  announcementDrawerVisible.value = true
}

function handleEditAnnouncement(record: Announcement) {
  editingAnnouncement.value = record
  announcementDrawerMode.value = 'edit'
  announcementDrawerVisible.value = true
}

function handleViewAnnouncement(record: Announcement) {
  editingAnnouncement.value = record
  announcementDrawerMode.value = 'view'
  announcementDrawerVisible.value = true
}

async function handleDeleteAnnouncement(record: Announcement) {
  try {
    await calendarStore.deleteDraftAnnouncement(record.id)
  } catch (error) {
    console.error('Failed to delete announcement:', error)
  }
}

async function handleBatchDeleteAnnouncements() {
  Modal.confirm({
    title: 'Delete Announcements',
    content: `Are you sure you want to delete ${selectedAnnouncements.value.length} announcement(s)?`,
    okText: 'Delete',
    okType: 'danger',
    onOk: async () => {
      for (const announcement of selectedAnnouncements.value) {
        await calendarStore.deleteDraftAnnouncement(announcement.id)
      }
      selectedAnnouncements.value = []
    },
  })
}

async function handleAnnouncementSubmit(payload: any) {
  try {
    if (announcementDrawerMode.value === 'create') {
      await calendarStore.createDraftAnnouncement(payload)
    } else if (announcementDrawerMode.value === 'edit' && currentAnnouncement.value) {
      await calendarStore.updateDraftAnnouncement(currentAnnouncement.value.id, payload)
    }
    announcementDrawerVisible.value = false
    await calendarStore.fetchDraftAnnouncements()
  } catch (error) {
    console.error('Failed to save announcement:', error)
  }
}

function handleAnnouncementDrawerClose() {
  announcementDrawerVisible.value = false
  editingAnnouncement.value = null
}

function handleFetchAnnouncements(params: TableParams) {
  const queryParams = {
    page: params.page,
    pageSize: params.pageSize,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    status: announcementStatus.value,
  }
  if (announcementStatus.value === 'published') {
    calendarStore.fetchPublishedAnnouncements(queryParams)
  } else {
    calendarStore.fetchDraftAnnouncements(queryParams)
  }
}

function handleAnnouncementSelectionChange(keys: string[], rows: Announcement[]) {
  selectedAnnouncements.value = rows
}

// Version control handlers
async function handlePublish() {
  loadingDiff.value = true
  publishModalVisible.value = true

  try {
    await calendarStore.fetchDiff()
  } catch (error) {
    console.error('Failed to load publish data:', error)
  } finally {
    loadingDiff.value = false
  }
}

async function handlePublishConfirm(payload: { notes: string; tags?: string[] }) {
  try {
    await calendarStore.publish(payload)
    publishModalVisible.value = false
  } catch (error) {
    console.error('Failed to publish:', error)
  }
}

async function handleRollback(versionId: string) {
  Modal.confirm({
    title: 'Rollback Version',
    content:
      'Are you sure you want to rollback to this version? This will discard all current drafts.',
    okText: 'Rollback',
    okType: 'danger',
    onOk: async () => {
      try {
        await calendarStore.rollback(versionId)
      } catch (error) {
        console.error('Failed to rollback:', error)
      }
    },
  })
}

async function handleViewDiff() {
  loadingDiff.value = true
  diffModalVisible.value = true

  try {
    await calendarStore.fetchDiff()
  } catch (error) {
    console.error('Failed to load diff:', error)
  } finally {
    loadingDiff.value = false
  }
}

// Import/Export handlers
function handleExport() {
  calendarStore.exportData({ format: 'csv', status: 'published' })
}

function handleImport() {
  // Import functionality
}
</script>

<style scoped>
.calendar-page {
  padding: 24px;
}
</style>
