<template>
  <div class="margin-page">
    <a-page-header
      title="Margin Configuration"
      sub-title="Manage margin templates and symbol bindings"
    >
      <template #extra>
        <a-space>
          <RBACGuard :permissions="['config.margin.export']">
            <a-button @click="handleExport">
              <template #icon><ExportOutlined /></template>
              Export
            </a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.margin.import']">
            <a-button @click="handleImport">
              <template #icon><ImportOutlined /></template>
              Import
            </a-button>
          </RBACGuard>
        </a-space>
      </template>
    </a-page-header>

    <VersionBar
      v-if="marginStore.draftExists"
      :current-version="marginStore.currentVersion"
      :draft-exists="marginStore.draftExists"
      :versions="marginStore.versions"
      :on-publish="handlePublish"
      :on-rollback="handleRollback"
      :on-view-diff="handleViewDiff"
    />

    <a-card :bordered="false" style="margin-top: 16px">
      <a-tabs v-model:active-key="activeTab">
        <!-- Templates Tab -->
        <a-tab-pane key="templates" tab="Templates">
          <div style="margin-bottom: 16px">
            <a-space>
              <RBACGuard :permissions="['config.margin.create']">
                <a-button type="primary" @click="handleCreateTemplate">
                  <template #icon><PlusOutlined /></template>
                  Create Template
                </a-button>
              </RBACGuard>
              <RBACGuard :permissions="['config.margin.delete']">
                <a-button
                  danger
                  :disabled="selectedTemplates.length === 0"
                  @click="handleBatchDeleteTemplates"
                >
                  <template #icon><DeleteOutlined /></template>
                  Delete Selected ({{ selectedTemplates.length }})
                </a-button>
              </RBACGuard>
            </a-space>
          </div>

          <a-radio-group
            v-model:value="templateStatus"
            button-style="solid"
            style="margin-bottom: 16px"
          >
            <a-radio-button value="published">Published</a-radio-button>
            <a-radio-button value="draft">Drafts</a-radio-button>
          </a-radio-group>

          <TemplateTable
            :data-source="currentTemplates"
            :loading="marginStore.loading"
            :total="currentTemplatesTotal"
            @edit="handleEditTemplate"
            @delete="handleDeleteTemplate"
            @view="handleViewTemplate"
            @fetch="handleFetchTemplates"
            @selection-change="handleTemplateSelectionChange"
          />
        </a-tab-pane>

        <!-- Bindings Tab -->
        <a-tab-pane key="bindings" tab="Bindings">
          <div style="margin-bottom: 16px">
            <a-space>
              <RBACGuard :permissions="['config.margin.edit']">
                <a-button type="primary" @click="handleBulkBind">
                  <template #icon><LinkOutlined /></template>
                  Bulk Bind
                </a-button>
              </RBACGuard>
              <RBACGuard :permissions="['config.margin.delete']">
                <a-button
                  danger
                  :disabled="selectedBindings.length === 0"
                  @click="handleBatchUnbind"
                >
                  <template #icon><DisconnectOutlined /></template>
                  Unbind Selected ({{ selectedBindings.length }})
                </a-button>
              </RBACGuard>
            </a-space>
          </div>

          <a-radio-group
            v-model:value="bindingStatus"
            button-style="solid"
            style="margin-bottom: 16px"
          >
            <a-radio-button value="published">Published</a-radio-button>
            <a-radio-button value="draft">Drafts</a-radio-button>
          </a-radio-group>

          <BindingTable
            :data-source="currentBindings"
            :loading="marginStore.loading"
            :total="currentBindingsTotal"
            @edit="handleEditBinding"
            @unbind="handleUnbindSymbol"
            @fetch="handleFetchBindings"
            @selection-change="handleBindingSelectionChange"
          />
        </a-tab-pane>

        <!-- Calculator Tab -->
        <a-tab-pane key="calculator" tab="Calculator">
          <a-row :gutter="16">
            <a-col :span="12">
              <MarginCalculator />
            </a-col>
            <a-col :span="12">
              <a-card title="Calculator Guide" :bordered="false">
                <a-typography-paragraph>
                  Use the margin calculator to estimate margin requirements for different notional
                  values and leverage levels.
                </a-typography-paragraph>
                <a-typography-paragraph>
                  <ul>
                    <li><strong>Initial Margin:</strong> The amount required to open a position</li>
                    <li>
                      <strong>Maintenance Margin:</strong> The minimum amount required to keep a
                      position open
                    </li>
                    <li>
                      <strong>Liquidation Price:</strong> The price at which the position will be
                      liquidated
                    </li>
                    <li>
                      <strong>Max Leverage:</strong> The maximum leverage allowed for the selected
                      tier
                    </li>
                  </ul>
                </a-typography-paragraph>
              </a-card>
            </a-col>
          </a-row>
        </a-tab-pane>

        <!-- Drafts Tab -->
        <a-tab-pane key="drafts" tab="Drafts">
          <a-alert
            v-if="marginStore.draftExists"
            type="info"
            message="You have unpublished changes"
            description="Review your changes and publish them to apply to production."
            show-icon
            style="margin-bottom: 16px"
          />
          <a-empty v-else description="No draft changes" />

          <a-row v-if="marginStore.draftExists" :gutter="16">
            <a-col :span="12">
              <a-card title="Draft Templates" size="small">
                <a-list :data-source="marginStore.draftTemplates" size="small">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta :title="item.name" :description="item.description" />
                    </a-list-item>
                  </template>
                </a-list>
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card title="Draft Bindings" size="small">
                <a-list :data-source="marginStore.draftBindings" size="small">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta
                        :title="item.symbol"
                        :description="`Template: ${item.templateName}`"
                      />
                    </a-list-item>
                  </template>
                </a-list>
              </a-card>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- Edit Template Drawer -->
    <EditTemplateDrawer
      v-model:open="templateDrawerVisible"
      :template="currentTemplate"
      :mode="templateDrawerMode"
      :loading="marginStore.loading"
      @submit="handleTemplateSubmit"
      @close="handleTemplateDrawerClose"
    />

    <!-- Bulk Bind Modal -->
    <BulkBindModal
      v-model:open="bulkBindModalVisible"
      :templates="marginStore.publishedTemplates"
      :loading="marginStore.loading"
      @submit="handleBulkBindSubmit"
      @close="bulkBindModalVisible = false"
    />

    <!-- Publish Modal -->
    <PublishModal
      v-model:open="publishModalVisible"
      :diff-data="marginStore.diffData"
      :impact-data="marginStore.impactEstimation"
      :loading="marginStore.loading"
      :loading-diff="loadingDiff"
      :loading-impact="loadingImpact"
      @publish="handlePublishConfirm"
      @close="publishModalVisible = false"
    />

    <!-- Diff Modal -->
    <DiffModal
      v-model:open="diffModalVisible"
      :diff-data="marginStore.diffData"
      :loading="loadingDiff"
      @close="diffModalVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  PlusOutlined,
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
  LinkOutlined,
  DisconnectOutlined,
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { useMarginStore } from '@/stores/margin'
import RBACGuard from '@/shared/RBACGuard.vue'
import VersionBar from '@/shared/VersionBar.vue'
import TemplateTable from '@/tables/margin/TemplateTable.vue'
import BindingTable from '@/tables/margin/BindingTable.vue'
import MarginCalculator from '@/widgets/calc/MarginCalculator.vue'
import EditTemplateDrawer from '@/modals/margin/EditTemplateDrawer.vue'
import BulkBindModal from '@/modals/margin/BulkBindModal.vue'
import PublishModal from '@/modals/margin/PublishModal.vue'
import DiffModal from '@/modals/margin/DiffModal.vue'
import type { MarginTemplate, MarginBinding } from '@/contracts/config'
import type { TableParams } from '@/types/components'

const marginStore = useMarginStore()

const activeTab = ref('templates')
const templateStatus = ref<'published' | 'draft'>('published')
const bindingStatus = ref<'published' | 'draft'>('published')

const selectedTemplates = ref<MarginTemplate[]>([])
const selectedBindings = ref<MarginBinding[]>([])

const templateDrawerVisible = ref(false)
const templateDrawerMode = ref<'create' | 'edit' | 'view'>('create')
const currentTemplate = ref<MarginTemplate | null>(null)

const bulkBindModalVisible = ref(false)
const publishModalVisible = ref(false)
const diffModalVisible = ref(false)
const loadingDiff = ref(false)
const loadingImpact = ref(false)

const currentTemplates = computed(() =>
  templateStatus.value === 'published' ? marginStore.publishedTemplates : marginStore.draftTemplates
)

const currentTemplatesTotal = computed(() =>
  templateStatus.value === 'published'
    ? marginStore.publishedTemplatesTotal
    : marginStore.draftTemplatesTotal
)

const currentBindings = computed(() =>
  bindingStatus.value === 'published' ? marginStore.publishedBindings : marginStore.draftBindings
)

const currentBindingsTotal = computed(() =>
  bindingStatus.value === 'published'
    ? marginStore.publishedBindingsTotal
    : marginStore.draftBindingsTotal
)

onMounted(async () => {
  await Promise.all([
    marginStore.fetchPublishedTemplates(),
    marginStore.fetchPublishedBindings(),
    marginStore.fetchVersions(),
  ])
})

watch(templateStatus, async (newStatus) => {
  if (newStatus === 'published') {
    await marginStore.fetchPublishedTemplates()
  } else {
    await marginStore.fetchDraftTemplates()
  }
})

watch(bindingStatus, async (newStatus) => {
  if (newStatus === 'published') {
    await marginStore.fetchPublishedBindings()
  } else {
    await marginStore.fetchDraftBindings()
  }
})

// Template handlers
function handleCreateTemplate() {
  currentTemplate.value = null
  templateDrawerMode.value = 'create'
  templateDrawerVisible.value = true
}

function handleEditTemplate(record: MarginTemplate) {
  currentTemplate.value = record
  templateDrawerMode.value = 'edit'
  templateDrawerVisible.value = true
}

function handleViewTemplate(record: MarginTemplate) {
  currentTemplate.value = record
  templateDrawerMode.value = 'view'
  templateDrawerVisible.value = true
}

async function handleDeleteTemplate(record: MarginTemplate) {
  try {
    await marginStore.deleteDraftTemplate(record.id)
  } catch (error) {
    console.error('Failed to delete template:', error)
  }
}

async function handleBatchDeleteTemplates() {
  Modal.confirm({
    title: 'Delete Templates',
    content: `Are you sure you want to delete ${selectedTemplates.value.length} template(s)?`,
    okText: 'Delete',
    okType: 'danger',
    onOk: async () => {
      for (const template of selectedTemplates.value) {
        await marginStore.deleteDraftTemplate(template.id)
      }
      selectedTemplates.value = []
    },
  })
}

async function handleTemplateSubmit(payload: any) {
  try {
    if (templateDrawerMode.value === 'create') {
      await marginStore.createDraftTemplate(payload)
    } else if (templateDrawerMode.value === 'edit' && currentTemplate.value) {
      await marginStore.updateDraftTemplate(currentTemplate.value.id, payload)
    }
    templateDrawerVisible.value = false
    await marginStore.fetchDraftTemplates()
  } catch (error) {
    console.error('Failed to save template:', error)
  }
}

function handleTemplateDrawerClose() {
  templateDrawerVisible.value = false
  currentTemplate.value = null
}

function handleFetchTemplates(params: TableParams) {
  const queryParams = {
    page: params.page,
    pageSize: params.pageSize,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    status: templateStatus.value,
  }
  if (templateStatus.value === 'published') {
    marginStore.fetchPublishedTemplates(queryParams)
  } else {
    marginStore.fetchDraftTemplates(queryParams)
  }
}

function handleTemplateSelectionChange(keys: string[], rows: MarginTemplate[]) {
  selectedTemplates.value = rows
}

// Binding handlers
function handleBulkBind() {
  bulkBindModalVisible.value = true
}

async function handleBulkBindSubmit(payload: { templateId: string; symbols: string[] }) {
  try {
    await marginStore.batchBind(payload.templateId, payload.symbols)
    bulkBindModalVisible.value = false
  } catch (error) {
    console.error('Failed to bulk bind:', error)
  }
}

function handleEditBinding(record: MarginBinding) {
  // Open a modal to change the template for this symbol
  message.info('Edit binding functionality')
}

async function handleUnbindSymbol(record: MarginBinding) {
  try {
    await marginStore.batchUnbind([record.symbol])
  } catch (error) {
    console.error('Failed to unbind symbol:', error)
  }
}

async function handleBatchUnbind() {
  Modal.confirm({
    title: 'Unbind Symbols',
    content: `Are you sure you want to unbind ${selectedBindings.value.length} symbol(s)?`,
    okText: 'Unbind',
    okType: 'danger',
    onOk: async () => {
      const symbols = selectedBindings.value.map((b) => b.symbol)
      await marginStore.batchUnbind(symbols)
      selectedBindings.value = []
    },
  })
}

function handleFetchBindings(params: TableParams) {
  const queryParams = {
    page: params.page,
    pageSize: params.pageSize,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    status: bindingStatus.value,
  }
  if (bindingStatus.value === 'published') {
    marginStore.fetchPublishedBindings(queryParams)
  } else {
    marginStore.fetchDraftBindings(queryParams)
  }
}

function handleBindingSelectionChange(keys: string[], rows: MarginBinding[]) {
  selectedBindings.value = rows
}

// Version control handlers
async function handlePublish() {
  loadingDiff.value = true
  loadingImpact.value = true
  publishModalVisible.value = true

  try {
    await Promise.all([marginStore.fetchDiff(), marginStore.fetchImpactEstimation()])
  } catch (error) {
    console.error('Failed to load publish data:', error)
  } finally {
    loadingDiff.value = false
    loadingImpact.value = false
  }
}

async function handlePublishConfirm(payload: { notes: string; tags?: string[] }) {
  try {
    await marginStore.publish(payload)
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
        await marginStore.rollback(versionId)
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
    await marginStore.fetchDiff()
  } catch (error) {
    console.error('Failed to load diff:', error)
  } finally {
    loadingDiff.value = false
  }
}

// Import/Export handlers
function handleExport() {
  marginStore.exportData({ format: 'csv', status: 'published' })
}

function handleImport() {
  message.info('Import functionality')
}
</script>

<style scoped>
.margin-page {
  padding: 24px;
}
</style>
