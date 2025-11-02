<template>
  <div class="icons-page">
    <a-page-header title="Icon Management" sub-title="Manage asset icons and symbol mappings">
      <template #extra>
        <a-space>
          <a-button @click="handleRefresh">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <div class="page-content">
      <a-tabs v-model:active-key="activeTab" type="card">
        <!-- Asset Library Tab -->
        <a-tab-pane key="assets" tab="Asset Library">
          <template #tab>
            <span>
              <PictureOutlined />
              Asset Library
            </span>
          </template>

          <a-card :bordered="false">
            <template #extra>
              <a-statistic
                title="Total Icons"
                :value="iconsStore.assetsTotal"
                :value-style="{ fontSize: '20px' }"
              />
            </template>

            <IconAssetTable
              ref="assetTableRef"
              @create="handleCreateAsset"
              @edit="handleEditAsset"
              @preview="handlePreviewAsset"
              @replace="handleReplaceAsset"
            />
          </a-card>
        </a-tab-pane>

        <!-- Symbol Mapping Tab -->
        <a-tab-pane key="mappings" tab="Symbol Mapping">
          <template #tab>
            <span>
              <LinkOutlined />
              Symbol Mapping
            </span>
          </template>

          <a-card :bordered="false">
            <template #extra>
              <a-statistic
                title="Total Mappings"
                :value="iconsStore.mappingsTotal"
                :value-style="{ fontSize: '20px' }"
              />
            </template>

            <IconMappingTable
              ref="mappingTableRef"
              @create="handleCreateMapping"
              @edit="handleEditMapping"
            />
          </a-card>
        </a-tab-pane>

        <!-- Bulk Upload Tab -->
        <a-tab-pane key="bulk-upload" tab="Bulk Upload">
          <template #tab>
            <span>
              <UploadOutlined />
              Bulk Upload
            </span>
          </template>

          <a-card :bordered="false">
            <BulkUploadForm @success="handleBulkUploadSuccess" @cancel="activeTab = 'assets'" />
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- Create/Edit Asset Drawer -->
    <a-drawer
      v-model:open="assetDrawerVisible"
      :title="assetDrawerMode === 'create' ? 'Create Icon' : 'Edit Icon'"
      width="600px"
      :body-style="{ paddingBottom: '80px' }"
    >
      <IconAssetForm
        :mode="assetDrawerMode"
        :initial-data="currentAsset"
        @success="handleAssetFormSuccess"
        @cancel="assetDrawerVisible = false"
      />
    </a-drawer>

    <!-- Create/Edit Mapping Drawer -->
    <a-drawer
      v-model:open="mappingDrawerVisible"
      :title="mappingDrawerMode === 'create' ? 'Create Mapping' : 'Edit Mapping'"
      width="600px"
      :body-style="{ paddingBottom: '80px' }"
    >
      <IconMappingForm
        :mode="mappingDrawerMode"
        :initial-data="currentMapping"
        @success="handleMappingFormSuccess"
        @cancel="mappingDrawerVisible = false"
      />
    </a-drawer>

    <!-- Preview Modal -->
    <PreviewModal
      v-model:open="previewModalVisible"
      :icon-data="previewIcon"
      :show-actions="true"
      @edit="handleEditFromPreview"
      @replace="handleReplaceFromPreview"
      @delete="handleDeleteFromPreview"
    />

    <!-- Replace Modal -->
    <ReplaceModal
      v-model:open="replaceModalVisible"
      :icon="replaceIcon"
      @success="handleReplaceSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  ReloadOutlined,
  PictureOutlined,
  LinkOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue'
import IconAssetTable from '@/tables/icons/IconAssetTable.vue'
import IconMappingTable from '@/tables/icons/IconMappingTable.vue'
import IconAssetForm from '@/forms/icons/IconAssetForm.vue'
import IconMappingForm from '@/forms/icons/IconMappingForm.vue'
import BulkUploadForm from '@/forms/icons/BulkUploadForm.vue'
import PreviewModal from '@/modals/icons/PreviewModal.vue'
import ReplaceModal from '@/modals/icons/ReplaceModal.vue'
import { useIconsStore } from '@/stores/icons'
import type { IconAsset, IconMapping, BulkUploadResult } from '@/services/api/config.icons'

const iconsStore = useIconsStore()

// Active tab
const activeTab = ref('assets')

// Table refs
const assetTableRef = ref()
const mappingTableRef = ref()

// Asset drawer state
const assetDrawerVisible = ref(false)
const assetDrawerMode = ref<'create' | 'edit'>('create')
const currentAsset = ref<IconAsset | undefined>()

// Mapping drawer state
const mappingDrawerVisible = ref(false)
const mappingDrawerMode = ref<'create' | 'edit'>('create')
const currentMapping = ref<IconMapping | undefined>()

// Preview modal state
const previewModalVisible = ref(false)
const previewIcon = ref<IconAsset | undefined>()

// Replace modal state
const replaceModalVisible = ref(false)
const replaceIcon = ref<IconAsset | undefined>()

// Handlers - Asset
function handleCreateAsset() {
  assetDrawerMode.value = 'create'
  currentAsset.value = undefined
  assetDrawerVisible.value = true
}

function handleEditAsset(icon: IconAsset) {
  assetDrawerMode.value = 'edit'
  currentAsset.value = icon
  assetDrawerVisible.value = true
}

function handlePreviewAsset(icon: IconAsset) {
  previewIcon.value = icon
  previewModalVisible.value = true
}

function handleReplaceAsset(icon: IconAsset) {
  replaceIcon.value = icon
  replaceModalVisible.value = true
}

function handleAssetFormSuccess() {
  assetDrawerVisible.value = false
  assetTableRef.value?.fetchData({
    page: 1,
    pageSize: 20,
  })
  message.success('Operation completed successfully')
}

// Handlers - Mapping
function handleCreateMapping() {
  mappingDrawerMode.value = 'create'
  currentMapping.value = undefined
  mappingDrawerVisible.value = true
}

function handleEditMapping(mapping: IconMapping) {
  mappingDrawerMode.value = 'edit'
  currentMapping.value = mapping
  mappingDrawerVisible.value = true
}

function handleMappingFormSuccess() {
  mappingDrawerVisible.value = false
  mappingTableRef.value?.fetchData({
    page: 1,
    pageSize: 20,
  })
  message.success('Operation completed successfully')
}

// Handlers - Bulk Upload
function handleBulkUploadSuccess(result: BulkUploadResult) {
  message.success(`Successfully uploaded ${result.success} icon(s)`)
  activeTab.value = 'assets'

  // Refresh asset table
  setTimeout(() => {
    assetTableRef.value?.fetchData({
      page: 1,
      pageSize: 20,
    })
  }, 500)
}

// Handlers - Preview Modal Actions
function handleEditFromPreview(icon: IconAsset) {
  previewModalVisible.value = false
  handleEditAsset(icon)
}

function handleReplaceFromPreview(icon: IconAsset) {
  previewModalVisible.value = false
  handleReplaceAsset(icon)
}

async function handleDeleteFromPreview(icon: IconAsset) {
  try {
    await iconsStore.deleteAsset(icon.id)
    message.success('Icon deleted successfully')
    previewModalVisible.value = false
    assetTableRef.value?.fetchData({
      page: 1,
      pageSize: 20,
    })
  } catch (error: any) {
    message.error(error.message || 'Failed to delete icon')
  }
}

// Handlers - Replace Modal
function handleReplaceSuccess() {
  replaceModalVisible.value = false
  assetTableRef.value?.fetchData({
    page: 1,
    pageSize: 20,
  })
  message.success('Icon files replaced successfully')
}

// Handlers - General
function handleRefresh() {
  if (activeTab.value === 'assets') {
    assetTableRef.value?.fetchData({
      page: 1,
      pageSize: 20,
    })
  } else if (activeTab.value === 'mappings') {
    mappingTableRef.value?.fetchData({
      page: 1,
      pageSize: 20,
    })
  }
  message.success('Refreshed')
}
</script>

<style scoped>
.icons-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  padding: 16px;
  overflow: auto;
}

:deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab) {
  padding: 8px 16px;
}

:deep(.ant-card) {
  margin-bottom: 0;
}
</style>
