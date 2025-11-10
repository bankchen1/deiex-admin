<template>
  <div class="kyc-page">
    <!-- Page Header -->
    <a-page-header title="KYC Management" sub-title="Review and manage KYC applications">
      <template #extra>
        <a-space>
          <RBACGuard :permissions="['kyc.export']">
            <a-button :loading="exportLoading" @click="handleExport">
              <template #icon><DownloadOutlined /></template>
              Export
            </a-button>
          </RBACGuard>
          <a-button :loading="loading" @click="handleRefresh">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- KPI Cards -->
    <a-row :gutter="16" class="kpi-section">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Total Applications"
            :value="stats?.total || 0"
            :loading="statsLoading"
          >
            <template #prefix>
              <FileTextOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Pending Review"
            :value="stats?.pending || 0"
            :value-style="{ color: '#faad14' }"
            :loading="statsLoading"
          >
            <template #prefix>
              <ClockCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Approved"
            :value="stats?.approved || 0"
            :value-style="{ color: '#52c41a' }"
            :loading="statsLoading"
          >
            <template #prefix>
              <CheckCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="Rejected"
            :value="stats?.rejected || 0"
            :value-style="{ color: '#f5222d' }"
            :loading="statsLoading"
          >
            <template #prefix>
              <CloseCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- Filters and Tabs -->
    <a-card class="content-card">
      <!-- Filters -->
      <div class="filter-section">
        <a-form layout="inline" :model="filters">
          <a-form-item label="Country">
            <a-select
              v-model:value="filters.country"
              placeholder="All Countries"
              style="width: 150px"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All Countries</a-select-option>
              <a-select-option value="US">United States</a-select-option>
              <a-select-option value="UK">United Kingdom</a-select-option>
              <a-select-option value="CN">China</a-select-option>
              <a-select-option value="JP">Japan</a-select-option>
              <!-- Add more countries as needed -->
            </a-select>
          </a-form-item>

          <a-form-item label="Date Range">
            <a-range-picker
              v-model:value="filters.dateRange"
              format="YYYY-MM-DD"
              @change="handleFilterChange"
            />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="handleSearch">
              <template #icon><SearchOutlined /></template>
              Search
            </a-button>
          </a-form-item>

          <a-form-item>
            <a-button @click="handleResetFilters">Reset</a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- Tabs -->
      <a-tabs v-model:active-key="activeTab" @change="handleTabChange">
        <a-tab-pane key="all" tab="All" />
        <a-tab-pane key="pending" tab="Pending" />
        <a-tab-pane key="approved" tab="Approved" />
        <a-tab-pane key="rejected" tab="Rejected" />
      </a-tabs>

      <!-- Batch Actions -->
      <div v-if="selectedRowKeys.length > 0" class="batch-actions">
        <a-space>
          <span>{{ selectedRowKeys.length }} item(s) selected</span>
          <RBACGuard :permissions="['kyc.review']">
            <a-button type="primary" :loading="reviewLoading" @click="handleBatchApprove">
              Batch Approve
            </a-button>
            <a-button danger :loading="reviewLoading" @click="handleBatchReject">
              Batch Reject
            </a-button>
          </RBACGuard>
          <a-button @click="handleClearSelection">Clear Selection</a-button>
        </a-space>
      </div>

      <!-- Table -->
      <KycTable
        v-model:selected-row-keys="selectedRowKeys"
        :data-source="list"
        :loading="loading"
        :pagination="{
          current: currentPage,
          pageSize: pageSize,
          total: total,
        }"
        @change="handleTableChange"
        @view="handleView"
        @review="handleReview"
      >
        <template #toolbar>
          <span class="table-info">Total: {{ total }} applications</span>
        </template>
      </KycTable>
    </a-card>

    <!-- Review Drawer -->
    <ReviewDrawer
      v-model:open="reviewDrawerOpen"
      :application="currentApplication"
      @submit="handleReviewSubmit"
    />

    <!-- Batch Review Modal -->
    <a-modal
      v-model:open="batchReviewModalOpen"
      :title="`Batch ${batchAction === 'approve' ? 'Approve' : 'Reject'}`"
      @ok="handleBatchReviewSubmit"
      @cancel="batchReviewModalOpen = false"
    >
      <a-form layout="vertical">
        <a-form-item v-if="batchAction === 'reject'" label="Rejection Reason" required>
          <a-select v-model:value="batchReviewForm.reason" placeholder="Select reason">
            <a-select-option value="incomplete_documents">Incomplete Documents</a-select-option>
            <a-select-option value="invalid_documents">Invalid Documents</a-select-option>
            <a-select-option value="suspicious_activity">Suspicious Activity</a-select-option>
            <a-select-option value="high_risk_country">High Risk Country</a-select-option>
            <a-select-option value="failed_verification">Failed Verification</a-select-option>
            <a-select-option value="other">Other</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Notes">
          <a-textarea
            v-model:value="batchReviewForm.notes"
            :rows="4"
            placeholder="Add notes (optional)"
          />
        </a-form-item>

        <a-alert
          :message="`You are about to ${batchAction} ${selectedRowKeys.length} application(s)`"
          type="warning"
          show-icon
        />
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons-vue'
import { useKycStore } from '@/stores/kyc'
import RBACGuard from '@/shared/RBACGuard.vue'
import KycTable from '@/tables/kyc/KycTable.vue'
import ReviewDrawer from '@/modals/kyc/ReviewDrawer.vue'
import type { KycApplication } from '@/types/models'
import type { ReviewPayload, BatchReviewPayload } from '@/services/api/facade'
import type { Dayjs } from 'dayjs'

const router = useRouter()
const kycStore = useKycStore()

// State
const activeTab = ref<'all' | 'pending' | 'approved' | 'rejected'>('all')
const filters = ref({
  country: undefined as string | undefined,
  dateRange: undefined as [Dayjs, Dayjs] | undefined,
})
const selectedRowKeys = ref<string[]>([])
const reviewDrawerOpen = ref(false)
const currentApplication = ref<KycApplication | null>(null)
const batchReviewModalOpen = ref(false)
const batchAction = ref<'approve' | 'reject'>('approve')
const batchReviewForm = ref({
  reason: undefined as string | undefined,
  notes: '',
})

// Computed
const loading = computed(() => kycStore.loading)
const statsLoading = computed(() => kycStore.statsLoading)
const reviewLoading = computed(() => kycStore.reviewLoading)
const exportLoading = computed(() => kycStore.exportLoading)
const list = computed(() => kycStore.list)
const total = computed(() => kycStore.total)
const currentPage = computed(() => kycStore.currentPage)
const pageSize = computed(() => kycStore.pageSize)
const stats = computed(() => kycStore.stats)

// Lifecycle
onMounted(() => {
  fetchData()
  fetchStats()
})

// Watch for tab changes
watch(activeTab, () => {
  selectedRowKeys.value = []
  fetchData()
})

// Methods
async function fetchData() {
  const params: any = {
    status: activeTab.value === 'all' ? undefined : activeTab.value,
    country: filters.value.country,
  }

  if (filters.value.dateRange) {
    params.startDate = filters.value.dateRange[0].format('YYYY-MM-DD')
    params.endDate = filters.value.dateRange[1].format('YYYY-MM-DD')
  }

  try {
    await kycStore.fetchList(params)
  } catch (e: any) {
    message.error(e.message || 'Failed to fetch KYC list')
  }
}

async function fetchStats() {
  try {
    await kycStore.fetchStats()
  } catch (e: any) {
    message.error(e.message || 'Failed to fetch statistics')
  }
}

function handleTabChange() {
  kycStore.setPage(1)
  fetchData()
}

function handleFilterChange() {
  // Auto-search on filter change (optional)
}

function handleSearch() {
  kycStore.setPage(1)
  fetchData()
}

function handleResetFilters() {
  filters.value = {
    country: undefined,
    dateRange: undefined,
  }
  kycStore.setPage(1)
  fetchData()
}

function handleRefresh() {
  fetchData()
  fetchStats()
}

async function handleExport() {
  const params: any = {
    status: activeTab.value === 'all' ? undefined : activeTab.value,
    country: filters.value.country,
  }

  if (filters.value.dateRange) {
    params.startDate = filters.value.dateRange[0].format('YYYY-MM-DD')
    params.endDate = filters.value.dateRange[1].format('YYYY-MM-DD')
  }

  try {
    await kycStore.exportData(params)
    message.success('Export completed successfully')
  } catch (e: any) {
    message.error(e.message || 'Failed to export data')
  }
}

function handleTableChange(pagination: any, filters: any, sorter: any) {
  kycStore.setPage(pagination.current)
  kycStore.setPageSize(pagination.pageSize)
  fetchData()
}

function handleView(record: KycApplication) {
  router.push(`/admin/kyc/${record.id}`)
}

function handleReview(record: KycApplication) {
  currentApplication.value = record
  reviewDrawerOpen.value = true
}

async function handleReviewSubmit(payload: ReviewPayload) {
  if (!currentApplication.value) return

  try {
    await kycStore.review(currentApplication.value.id, payload)
    message.success('Review submitted successfully')
    reviewDrawerOpen.value = false
    currentApplication.value = null
    await fetchData()
    await fetchStats()
  } catch (e: any) {
    message.error(e.message || 'Failed to submit review')
  }
}

function handleBatchApprove() {
  batchAction.value = 'approve'
  batchReviewForm.value = {
    reason: undefined,
    notes: '',
  }
  batchReviewModalOpen.value = true
}

function handleBatchReject() {
  batchAction.value = 'reject'
  batchReviewForm.value = {
    reason: undefined,
    notes: '',
  }
  batchReviewModalOpen.value = true
}

async function handleBatchReviewSubmit() {
  if (batchAction.value === 'reject' && !batchReviewForm.value.reason) {
    message.warning('Please select a rejection reason')
    return
  }

  const payload: BatchReviewPayload = {
    ids: selectedRowKeys.value,
    action: batchAction.value,
    notes: batchReviewForm.value.notes,
    reason: batchReviewForm.value.reason,
  }

  try {
    const result = await kycStore.batchReview(payload)
    message.success(
      `Batch review completed: ${result.data.success} succeeded, ${result.data.failed} failed`
    )
    batchReviewModalOpen.value = false
    selectedRowKeys.value = []
    await fetchData()
    await fetchStats()
  } catch (e: any) {
    message.error(e.message || 'Failed to batch review')
  }
}

function handleClearSelection() {
  selectedRowKeys.value = []
}
</script>

<style scoped>
.kyc-page {
  padding: 24px;
}

.kpi-section {
  margin: 24px 0;
}

.content-card {
  margin-top: 16px;
}

.filter-section {
  margin-bottom: 16px;
}

.batch-actions {
  margin-bottom: 16px;
  padding: 12px;
  background: #f0f2f5;
  border-radius: 4px;
}

.table-info {
  color: #666;
  font-size: 14px;
}
</style>
