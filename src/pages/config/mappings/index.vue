<template>
  <div class="mappings-page">
    <a-page-header
      title="Mappings Configuration"
      sub-title="Manage navigation, redirects, and page-API relationships"
    >
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
        <!-- Nav to API Tab -->
        <a-tab-pane key="nav-to-api" tab="Nav → API">
          <NavToApiTable @create="handleCreateNavMapping" @edit="handleEditNavMapping" />
        </a-tab-pane>

        <!-- Route Migration Tab -->
        <a-tab-pane key="redirects" tab="Route Migration">
          <a-space direction="vertical" size="large" style="width: 100%">
            <!-- Redirect Graph -->
            <a-card title="Redirect Visualization">
              <RedirectGraph :data="mappingsStore.redirectGraph" :loading="mappingsStore.loading" />
              <template #extra>
                <a-button :loading="mappingsStore.loading" @click="handleLoadGraph">
                  <template #icon><NodeIndexOutlined /></template>
                  Load Graph
                </a-button>
              </template>
            </a-card>

            <!-- Redirect Table -->
            <RedirectTable @create="handleCreateRedirect" @edit="handleEditRedirect" />
          </a-space>
        </a-tab-pane>

        <!-- Page to API Tab -->
        <a-tab-pane key="page-to-api" tab="Page → API">
          <PageApiMatrix
            :data="mappingsStore.pageApiRelations"
            :loading="mappingsStore.loading"
            @scan="handleScanPageApi"
            @validate="handleValidatePageApi"
            @edit="handleEditPageApi"
            @view-details="handleViewPageApiDetails"
          />
        </a-tab-pane>
      </a-tabs>

      <!-- Validation Results -->
      <a-card
        v-if="mappingsStore.validationResult && !mappingsStore.validationResult.valid"
        title="Validation Issues"
        style="margin-top: 16px"
      >
        <a-alert
          v-if="mappingsStore.hasBrokenLinks"
          type="error"
          message="Broken Links Detected"
          style="margin-bottom: 16px"
        >
          <template #description>
            <ul>
              <li v-for="link in mappingsStore.validationResult.brokenLinks" :key="link">
                {{ link }}
              </li>
            </ul>
          </template>
        </a-alert>

        <a-alert
          v-if="mappingsStore.hasRedundantLinks"
          type="warning"
          message="Redundant Links Detected"
          style="margin-bottom: 16px"
        >
          <template #description>
            <ul>
              <li v-for="link in mappingsStore.validationResult.redundantLinks" :key="link">
                {{ link }}
              </li>
            </ul>
          </template>
        </a-alert>

        <a-alert
          v-if="mappingsStore.validationResult.warnings.length > 0"
          type="info"
          message="Warnings"
        >
          <template #description>
            <ul>
              <li v-for="warning in mappingsStore.validationResult.warnings" :key="warning">
                {{ warning }}
              </li>
            </ul>
          </template>
        </a-alert>
      </a-card>
    </div>

    <!-- Edit Nav Mapping Modal -->
    <EditMappingModal
      v-model:visible="navMappingModalVisible"
      :initial-data="currentNavMapping"
      :mode="navMappingMode"
      :loading="mappingsStore.loading"
      type="nav-to-api"
      @submit="handleNavMappingSubmit"
    />

    <!-- Edit Redirect Modal -->
    <EditMappingModal
      v-model:visible="redirectModalVisible"
      :initial-data="currentRedirect"
      :mode="redirectMode"
      :loading="mappingsStore.loading"
      type="redirect"
      @submit="handleRedirectSubmit"
    />

    <!-- Edit Page API Modal -->
    <EditMappingModal
      v-model:visible="pageApiModalVisible"
      :initial-data="currentPageApi"
      :mode="pageApiMode"
      :loading="mappingsStore.loading"
      type="page-to-api"
      @submit="handlePageApiSubmit"
    />

    <!-- Bulk Sync Modal -->
    <BulkSyncModal
      v-model:visible="bulkSyncModalVisible"
      :loading="mappingsStore.loading"
      @submit="handleBulkSync"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ReloadOutlined, NodeIndexOutlined } from '@ant-design/icons-vue'
import { useMappingsStore } from '@/stores/mappings'
import NavToApiTable from '@/tables/mappings/NavToApiTable.vue'
import RedirectTable from '@/tables/mappings/RedirectTable.vue'
import RedirectGraph from '@/widgets/graph/RedirectGraph.vue'
import PageApiMatrix from '@/widgets/graph/PageApiMatrix.vue'
import EditMappingModal from '@/modals/mappings/EditMappingModal.vue'
import BulkSyncModal from '@/modals/mappings/BulkSyncModal.vue'
import type { NavToApiMapping, RouteRedirect, PageApiRelation } from '@/services/api/facade'

const mappingsStore = useMappingsStore()

const activeTab = ref('nav-to-api')

// Nav Mapping state
const navMappingModalVisible = ref(false)
const navMappingMode = ref<'create' | 'edit'>('create')
const currentNavMapping = ref<Partial<NavToApiMapping>>()

// Redirect state
const redirectModalVisible = ref(false)
const redirectMode = ref<'create' | 'edit'>('create')
const currentRedirect = ref<Partial<RouteRedirect>>()

// Page API state
const pageApiModalVisible = ref(false)
const pageApiMode = ref<'create' | 'edit'>('create')
const currentPageApi = ref<Partial<PageApiRelation>>()

// Bulk sync state
const bulkSyncModalVisible = ref(false)

// Nav Mapping handlers
function handleCreateNavMapping() {
  navMappingMode.value = 'create'
  currentNavMapping.value = undefined
  navMappingModalVisible.value = true
}

function handleEditNavMapping(record: NavToApiMapping) {
  navMappingMode.value = 'edit'
  currentNavMapping.value = record
  navMappingModalVisible.value = true
}

async function handleNavMappingSubmit(data: Partial<NavToApiMapping>) {
  if (navMappingMode.value === 'create') {
    await mappingsStore.createNavMapping(data as any)
  } else if (currentNavMapping.value?.id) {
    await mappingsStore.updateNavMapping(currentNavMapping.value.id, data)
  }
  navMappingModalVisible.value = false
}

// Redirect handlers
function handleCreateRedirect() {
  redirectMode.value = 'create'
  currentRedirect.value = undefined
  redirectModalVisible.value = true
}

function handleEditRedirect(record: RouteRedirect) {
  redirectMode.value = 'edit'
  currentRedirect.value = record
  redirectModalVisible.value = true
}

async function handleRedirectSubmit(data: Partial<RouteRedirect>) {
  if (redirectMode.value === 'create') {
    await mappingsStore.createRedirect(data as any)
  } else if (currentRedirect.value?.id) {
    await mappingsStore.updateRedirect(currentRedirect.value.id, data)
  }
  redirectModalVisible.value = false
}

async function handleLoadGraph() {
  await mappingsStore.fetchRedirectGraph()
}

// Page API handlers
function handleEditPageApi(record: PageApiRelation) {
  pageApiMode.value = 'edit'
  currentPageApi.value = record
  pageApiModalVisible.value = true
}

function handleViewPageApiDetails(record: PageApiRelation) {
  // Could open a detailed view modal
  console.log('View details:', record)
}

async function handlePageApiSubmit(data: Partial<PageApiRelation>) {
  if (currentPageApi.value?.pageKey) {
    await mappingsStore.updatePageApiRelation(currentPageApi.value.pageKey, data)
  }
  pageApiModalVisible.value = false
}

async function handleScanPageApi() {
  await mappingsStore.scanPageApiRelations()
}

async function handleValidatePageApi() {
  await mappingsStore.validatePageApiRelations()
}

// Bulk sync handlers
async function handleBulkSync(payload: any) {
  await mappingsStore.bulkSyncNavMappings(payload)
  bulkSyncModalVisible.value = false
}

async function handleRefresh() {
  if (activeTab.value === 'nav-to-api') {
    await mappingsStore.fetchNavMappings()
  } else if (activeTab.value === 'redirects') {
    await mappingsStore.fetchRedirects()
    await mappingsStore.fetchRedirectGraph()
  } else if (activeTab.value === 'page-to-api') {
    await mappingsStore.fetchPageApiRelations()
  }
}

onMounted(async () => {
  await mappingsStore.fetchNavMappings()
})
</script>

<style scoped>
.mappings-page {
  padding: 24px;
}

.page-content {
  margin-top: 16px;
}
</style>
