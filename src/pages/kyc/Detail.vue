<template>
  <div class="kyc-detail-page">
    <!-- Page Header -->
    <a-page-header
      title="KYC Application Detail"
      :sub-title="`Application ID: ${id}`"
      @back="handleBack"
    >
      <template #extra>
        <a-space>
          <RBACGuard :permissions="['kyc.review']">
            <a-button v-if="application?.status === 'pending'" type="primary" @click="handleReview">
              Review Application
            </a-button>
          </RBACGuard>
          <a-button :loading="loading" @click="handleRefresh">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- Loading State -->
    <div v-if="loading && !application" class="loading-container">
      <a-spin size="large" />
    </div>

    <!-- Error State -->
    <a-alert
      v-else-if="error"
      type="error"
      :message="error"
      show-icon
      closable
      @close="error = null"
    />

    <!-- Content -->
    <div v-else-if="application" class="page-content">
      <a-tabs v-model:active-key="activeTab" type="card">
        <!-- Overview Tab -->
        <a-tab-pane key="overview" tab="Overview">
          <KycOverviewSection :application="application" />
        </a-tab-pane>

        <!-- Documents Tab -->
        <a-tab-pane key="documents" tab="Documents">
          <KycDocumentsSection :documents="application.documents" />
        </a-tab-pane>

        <!-- Risk Tab -->
        <a-tab-pane key="risk" tab="Risk">
          <KycRiskSection :application="application" />
        </a-tab-pane>

        <!-- History Tab -->
        <a-tab-pane key="history" tab="History">
          <a-card title="Review History">
            <AuditTrail
              v-if="application.reviewHistory && application.reviewHistory.length > 0"
              :records="application.reviewHistory"
            />
            <a-empty v-else description="No review history available" />
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- Review Drawer -->
    <ReviewDrawer
      v-model:open="reviewDrawerOpen"
      :application="application"
      @submit="handleReviewSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import { useKycStore } from '@/stores/kyc'
import RBACGuard from '@/shared/RBACGuard.vue'
import AuditTrail from '@/shared/AuditTrail.vue'
import KycOverviewSection from '@/sections/kyc/KycOverviewSection.vue'
import KycDocumentsSection from '@/sections/kyc/KycDocumentsSection.vue'
import KycRiskSection from '@/sections/kyc/KycRiskSection.vue'
import ReviewDrawer from '@/modals/kyc/ReviewDrawer.vue'
import type { ReviewPayload } from '@/services/api/facade'

const route = useRoute()
const router = useRouter()
const kycStore = useKycStore()

const id = ref(route.params.id as string)
const activeTab = ref('overview')
const reviewDrawerOpen = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const application = ref(kycStore.currentItem)

onMounted(() => {
  fetchDetail()
})

async function fetchDetail() {
  loading.value = true
  error.value = null
  try {
    await kycStore.fetchById(id.value)
    application.value = kycStore.currentItem
  } catch (e: any) {
    error.value = e.message || 'Failed to load KYC application'
    message.error(error.value)
  } finally {
    loading.value = false
  }
}

function handleBack() {
  router.push('/admin/kyc')
}

function handleRefresh() {
  fetchDetail()
}

function handleReview() {
  reviewDrawerOpen.value = true
}

async function handleReviewSubmit(payload: ReviewPayload) {
  try {
    await kycStore.review(id.value, payload)
    message.success('Review submitted successfully')
    reviewDrawerOpen.value = false
    await fetchDetail() // Refresh the data
  } catch (e: any) {
    message.error(e.message || 'Failed to submit review')
  }
}
</script>

<style scoped>
.kyc-detail-page {
  padding: 24px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.page-content {
  margin-top: 16px;
}
</style>
