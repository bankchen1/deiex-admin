<template>
  <div class="fees-page">
    <a-page-header title="Fee Configuration" sub-title="Manage trading and withdrawal fees">
      <template #extra>
        <a-space>
          <RBACGuard :permissions="['config.fees.validate']">
            <a-button :loading="feesStore.loading" @click="handleValidateConsistency">
              <template #icon><CheckCircleOutlined /></template>
              Validate Consistency
            </a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.fees.export']">
            <a-button @click="handleExport">
              <template #icon><ExportOutlined /></template>
              Export
            </a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.fees.import']">
            <a-button @click="handleImport">
              <template #icon><ImportOutlined /></template>
              Import
            </a-button>
          </RBACGuard>
        </a-space>
      </template>
    </a-page-header>

    <VersionBar
      v-if="feesStore.draftExists"
      :current-version="feesStore.currentVersion"
      :draft-exists="feesStore.draftExists"
      :versions="feesStore.versions"
      :on-publish="handlePublish"
      :on-rollback="handleRollback"
      :on-view-diff="handleViewDiff"
    />

    <a-card :bordered="false" style="margin-top: 16px">
      <a-tabs v-model:active-key="activeTab">
        <!-- Trading Fees Tab -->
        <a-tab-pane key="trading" tab="Trading Fees">
          <div style="margin-bottom: 16px">
            <a-space>
              <RBACGuard :permissions="['config.fees.create']">
                <a-button type="primary" @click="handleCreateTradingFee">
                  <template #icon><PlusOutlined /></template>
                  Create Tier
                </a-button>
              </RBACGuard>
              <RBACGuard :permissions="['config.fees.delete']">
                <a-button
                  danger
                  :disabled="selectedTradingFees.length === 0"
                  @click="handleBatchDeleteTradingFees"
                >
                  <template #icon><DeleteOutlined /></template>
                  Delete Selected ({{ selectedTradingFees.length }})
                </a-button>
              </RBACGuard>
            </a-space>
          </div>

          <a-radio-group
            v-model:value="tradingFeeStatus"
            button-style="solid"
            style="margin-bottom: 16px"
          >
            <a-radio-button value="published">Published</a-radio-button>
            <a-radio-button value="draft">Drafts</a-radio-button>
          </a-radio-group>

          <TradingFeeTable
            :data-source="currentTradingFees"
            :loading="feesStore.loading"
            :total="currentTradingFeesTotal"
            @edit="handleEditTradingFee"
            @delete="handleDeleteTradingFee"
            @view="handleViewTradingFee"
            @fetch="handleFetchTradingFees"
            @selection-change="handleTradingFeeSelectionChange"
          />
        </a-tab-pane>

        <!-- Withdrawal Fees Tab -->
        <a-tab-pane key="withdrawal" tab="Withdrawal Fees">
          <div style="margin-bottom: 16px">
            <a-space>
              <RBACGuard :permissions="['config.fees.create']">
                <a-button type="primary" @click="handleCreateWithdrawalFee">
                  <template #icon><PlusOutlined /></template>
                  Create Fee
                </a-button>
              </RBACGuard>
              <RBACGuard :permissions="['config.fees.delete']">
                <a-button
                  danger
                  :disabled="selectedWithdrawalFees.length === 0"
                  @click="handleBatchDeleteWithdrawalFees"
                >
                  <template #icon><DeleteOutlined /></template>
                  Delete Selected ({{ selectedWithdrawalFees.length }})
                </a-button>
              </RBACGuard>
            </a-space>
          </div>

          <a-radio-group
            v-model:value="withdrawalFeeStatus"
            button-style="solid"
            style="margin-bottom: 16px"
          >
            <a-radio-button value="published">Published</a-radio-button>
            <a-radio-button value="draft">Drafts</a-radio-button>
          </a-radio-group>

          <WithdrawalFeeTable
            :data-source="currentWithdrawalFees"
            :loading="feesStore.loading"
            :total="currentWithdrawalFeesTotal"
            @edit="handleEditWithdrawalFee"
            @delete="handleDeleteWithdrawalFee"
            @view="handleViewWithdrawalFee"
            @fetch="handleFetchWithdrawalFees"
            @selection-change="handleWithdrawalFeeSelectionChange"
          />
        </a-tab-pane>

        <!-- Calculator Tab -->
        <a-tab-pane key="calculator" tab="Calculator">
          <a-row :gutter="16">
            <a-col :span="12">
              <FeeCalculator />
            </a-col>
            <a-col :span="12">
              <a-card title="Calculator Guide" :bordered="false">
                <a-typography-paragraph>
                  Use the fee calculator to estimate fees for different scenarios.
                </a-typography-paragraph>
                <a-typography-title :level="5">Trading Fees</a-typography-title>
                <a-typography-paragraph>
                  <ul>
                    <li>
                      <strong>Maker Fee:</strong> Fee charged when you add liquidity to the order
                      book
                    </li>
                    <li>
                      <strong>Taker Fee:</strong> Fee charged when you remove liquidity from the
                      order book
                    </li>
                    <li><strong>VIP Level:</strong> Higher VIP levels typically have lower fees</li>
                  </ul>
                </a-typography-paragraph>
                <a-typography-title :level="5">Withdrawal Fees</a-typography-title>
                <a-typography-paragraph>
                  <ul>
                    <li><strong>Fixed Fee:</strong> Base fee charged for each withdrawal</li>
                    <li>
                      <strong>Percentage Fee:</strong> Additional fee based on withdrawal amount
                    </li>
                    <li><strong>Minimum Fee:</strong> The minimum fee that will be charged</li>
                    <li>
                      <strong>Daily Limit:</strong> Maximum amount that can be withdrawn per day
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
            v-if="feesStore.draftExists"
            type="info"
            message="You have unpublished changes"
            description="Review your changes and publish them to apply to production."
            show-icon
            style="margin-bottom: 16px"
          />
          <a-empty v-else description="No draft changes" />

          <a-row v-if="feesStore.draftExists" :gutter="16">
            <a-col :span="12">
              <a-card title="Draft Trading Fees" size="small">
                <a-list :data-source="feesStore.draftTradingFees" size="small">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta
                        :title="`VIP ${item.vipLevel}`"
                        :description="`Maker: ${formatRate(item.makerRate)}, Taker: ${formatRate(item.takerRate)}`"
                      />
                    </a-list-item>
                  </template>
                </a-list>
              </a-card>
            </a-col>
            <a-col :span="12">
              <a-card title="Draft Withdrawal Fees" size="small">
                <a-list :data-source="feesStore.draftWithdrawalFees" size="small">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta
                        :title="`${item.currency} (${item.chain})`"
                        :description="`Fixed: ${item.fixedFee}, Min: ${item.minFee}`"
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

    <!-- Trading Fee Modal -->
    <NewTierModal
      v-model:open="tradingFeeModalVisible"
      :trading-fee="currentTradingFee"
      :mode="tradingFeeModalMode"
      :loading="feesStore.loading"
      @submit="handleTradingFeeSubmit"
      @close="handleTradingFeeModalClose"
    />

    <!-- Withdrawal Fee Drawer -->
    <EditWithdrawalFeeDrawer
      v-model:open="withdrawalFeeDrawerVisible"
      :withdrawal-fee="currentWithdrawalFee"
      :mode="withdrawalFeeDrawerMode"
      :loading="feesStore.loading"
      @submit="handleWithdrawalFeeSubmit"
      @close="handleWithdrawalFeeDrawerClose"
    />

    <!-- Bulk Import Modal -->
    <BulkImportModal
      v-model:open="bulkImportModalVisible"
      :loading="feesStore.loading"
      @submit="handleBulkImportSubmit"
      @close="bulkImportModalVisible = false"
    />

    <!-- Publish Modal -->
    <PublishModal
      v-model:open="publishModalVisible"
      :diff-data="feesStore.diffData"
      :loading="feesStore.loading"
      :loading-diff="loadingDiff"
      @publish="handlePublishConfirm"
      @close="publishModalVisible = false"
    />

    <!-- Diff Modal -->
    <DiffModal
      v-model:open="diffModalVisible"
      :diff-data="feesStore.diffData"
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
  CheckCircleOutlined,
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { useFeesStore } from '@/stores/fees'
import RBACGuard from '@/shared/RBACGuard.vue'
import VersionBar from '@/shared/VersionBar.vue'
import TradingFeeTable from '@/tables/fees/TradingFeeTable.vue'
import WithdrawalFeeTable from '@/tables/fees/WithdrawalFeeTable.vue'
import FeeCalculator from '@/widgets/calc/FeeCalculator.vue'
import NewTierModal from '@/modals/fees/NewTierModal.vue'
import EditWithdrawalFeeDrawer from '@/modals/fees/EditWithdrawalFeeDrawer.vue'
import BulkImportModal from '@/modals/fees/BulkImportModal.vue'
import PublishModal from '@/modals/fees/PublishModal.vue'
import DiffModal from '@/modals/fees/DiffModal.vue'
import type { TradingFeeTemplate, WithdrawalFeeTemplate } from '@/contracts/fees'
import type { TableParams } from '@/types/components'

const feesStore = useFeesStore()

const activeTab = ref('trading')
const tradingFeeStatus = ref<'published' | 'draft'>('published')
const withdrawalFeeStatus = ref<'published' | 'draft'>('published')

const selectedTradingFees = ref<TradingFeeTemplate[]>([])
const selectedWithdrawalFees = ref<WithdrawalFeeTemplate[]>([])

const tradingFeeModalVisible = ref(false)
const tradingFeeModalMode = ref<'create' | 'edit' | 'view'>('create')
const currentTradingFee = ref<TradingFeeTemplate | null>(null)

const withdrawalFeeDrawerVisible = ref(false)
const withdrawalFeeDrawerMode = ref<'create' | 'edit' | 'view'>('create')
const currentWithdrawalFee = ref<WithdrawalFeeTemplate | null>(null)

const bulkImportModalVisible = ref(false)
const publishModalVisible = ref(false)
const diffModalVisible = ref(false)
const loadingDiff = ref(false)

const currentTradingFees = computed(() =>
  tradingFeeStatus.value === 'published'
    ? feesStore.publishedTradingFees
    : feesStore.draftTradingFees
)

const currentTradingFeesTotal = computed(() =>
  tradingFeeStatus.value === 'published'
    ? feesStore.publishedTradingFeesTotal
    : feesStore.draftTradingFeesTotal
)

const currentWithdrawalFees = computed(() =>
  withdrawalFeeStatus.value === 'published'
    ? feesStore.publishedWithdrawalFees
    : feesStore.draftWithdrawalFees
)

const currentWithdrawalFeesTotal = computed(() =>
  withdrawalFeeStatus.value === 'published'
    ? feesStore.publishedWithdrawalFeesTotal
    : feesStore.draftWithdrawalFeesTotal
)

onMounted(async () => {
  await Promise.all([
    feesStore.fetchPublishedTradingFees(),
    feesStore.fetchPublishedWithdrawalFees(),
    feesStore.fetchVersions(),
  ])
})

watch(tradingFeeStatus, async (newStatus) => {
  if (newStatus === 'published') {
    await feesStore.fetchPublishedTradingFees()
  } else {
    await feesStore.fetchDraftTradingFees()
  }
})

watch(withdrawalFeeStatus, async (newStatus) => {
  if (newStatus === 'published') {
    await feesStore.fetchPublishedWithdrawalFees()
  } else {
    await feesStore.fetchDraftWithdrawalFees()
  }
})

// Trading Fee handlers
function handleCreateTradingFee() {
  currentTradingFee.value = null
  tradingFeeModalMode.value = 'create'
  tradingFeeModalVisible.value = true
}

function handleEditTradingFee(record: TradingFeeTemplate) {
  currentTradingFee.value = record
  tradingFeeModalMode.value = 'edit'
  tradingFeeModalVisible.value = true
}

function handleViewTradingFee(record: TradingFeeTemplate) {
  currentTradingFee.value = record
  tradingFeeModalMode.value = 'view'
  tradingFeeModalVisible.value = true
}

async function handleDeleteTradingFee(record: TradingFeeTemplate) {
  try {
    await feesStore.deleteDraftTradingFee(record.id)
  } catch (error) {
    console.error('Failed to delete trading fee:', error)
  }
}

async function handleBatchDeleteTradingFees() {
  Modal.confirm({
    title: 'Delete Trading Fees',
    content: `Are you sure you want to delete ${selectedTradingFees.value.length} trading fee(s)?`,
    okText: 'Delete',
    okType: 'danger',
    onOk: async () => {
      for (const fee of selectedTradingFees.value) {
        await feesStore.deleteDraftTradingFee(fee.id)
      }
      selectedTradingFees.value = []
    },
  })
}

async function handleTradingFeeSubmit(payload: any) {
  try {
    if (tradingFeeModalMode.value === 'create') {
      await feesStore.createDraftTradingFee(payload)
    } else if (tradingFeeModalMode.value === 'edit' && currentTradingFee.value) {
      await feesStore.updateDraftTradingFee(currentTradingFee.value.id, payload)
    }
    tradingFeeModalVisible.value = false
    await feesStore.fetchDraftTradingFees()
  } catch (error) {
    console.error('Failed to save trading fee:', error)
  }
}

function handleTradingFeeModalClose() {
  tradingFeeModalVisible.value = false
  currentTradingFee.value = null
}

function handleFetchTradingFees(params: TableParams) {
  const queryParams = {
    page: params.page,
    pageSize: params.pageSize,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    status: tradingFeeStatus.value,
  }
  if (tradingFeeStatus.value === 'published') {
    feesStore.fetchPublishedTradingFees(queryParams)
  } else {
    feesStore.fetchDraftTradingFees(queryParams)
  }
}

function handleTradingFeeSelectionChange(keys: string[], rows: TradingFeeTemplate[]) {
  selectedTradingFees.value = rows
}

// Withdrawal Fee handlers
function handleCreateWithdrawalFee() {
  currentWithdrawalFee.value = null
  withdrawalFeeDrawerMode.value = 'create'
  withdrawalFeeDrawerVisible.value = true
}

function handleEditWithdrawalFee(record: WithdrawalFeeTemplate) {
  currentWithdrawalFee.value = record
  withdrawalFeeDrawerMode.value = 'edit'
  withdrawalFeeDrawerVisible.value = true
}

function handleViewWithdrawalFee(record: WithdrawalFeeTemplate) {
  currentWithdrawalFee.value = record
  withdrawalFeeDrawerMode.value = 'view'
  withdrawalFeeDrawerVisible.value = true
}

async function handleDeleteWithdrawalFee(record: WithdrawalFeeTemplate) {
  try {
    await feesStore.deleteDraftWithdrawalFee(record.id)
  } catch (error) {
    console.error('Failed to delete withdrawal fee:', error)
  }
}

async function handleBatchDeleteWithdrawalFees() {
  Modal.confirm({
    title: 'Delete Withdrawal Fees',
    content: `Are you sure you want to delete ${selectedWithdrawalFees.value.length} withdrawal fee(s)?`,
    okText: 'Delete',
    okType: 'danger',
    onOk: async () => {
      for (const fee of selectedWithdrawalFees.value) {
        await feesStore.deleteDraftWithdrawalFee(fee.id)
      }
      selectedWithdrawalFees.value = []
    },
  })
}

async function handleWithdrawalFeeSubmit(payload: any) {
  try {
    if (withdrawalFeeDrawerMode.value === 'create') {
      await feesStore.createDraftWithdrawalFee(payload)
    } else if (withdrawalFeeDrawerMode.value === 'edit' && currentWithdrawalFee.value) {
      await feesStore.updateDraftWithdrawalFee(currentWithdrawalFee.value.id, payload)
    }
    withdrawalFeeDrawerVisible.value = false
    await feesStore.fetchDraftWithdrawalFees()
  } catch (error) {
    console.error('Failed to save withdrawal fee:', error)
  }
}

function handleWithdrawalFeeDrawerClose() {
  withdrawalFeeDrawerVisible.value = false
  currentWithdrawalFee.value = null
}

function handleFetchWithdrawalFees(params: TableParams) {
  const queryParams = {
    page: params.page,
    pageSize: params.pageSize,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    status: withdrawalFeeStatus.value,
  }
  if (withdrawalFeeStatus.value === 'published') {
    feesStore.fetchPublishedWithdrawalFees(queryParams)
  } else {
    feesStore.fetchDraftWithdrawalFees(queryParams)
  }
}

function handleWithdrawalFeeSelectionChange(keys: string[], rows: WithdrawalFeeTemplate[]) {
  selectedWithdrawalFees.value = rows
}

// Version control handlers
async function handlePublish() {
  loadingDiff.value = true
  publishModalVisible.value = true

  try {
    await feesStore.fetchDiff()
  } catch (error) {
    console.error('Failed to load publish data:', error)
  } finally {
    loadingDiff.value = false
  }
}

async function handlePublishConfirm(payload: { notes: string; tags?: string[] }) {
  try {
    await feesStore.publish(payload)
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
        await feesStore.rollback(versionId)
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
    await feesStore.fetchDiff()
  } catch (error) {
    console.error('Failed to load diff:', error)
  } finally {
    loadingDiff.value = false
  }
}

// Import/Export handlers
function handleExport() {
  feesStore.exportData({ format: 'csv', status: 'published' })
}

function handleImport() {
  bulkImportModalVisible.value = true
}

async function handleBulkImportSubmit(payload: any) {
  try {
    await feesStore.importData(payload)
    bulkImportModalVisible.value = false
  } catch (error) {
    console.error('Failed to import:', error)
  }
}

// Consistency validation
async function handleValidateConsistency() {
  try {
    await feesStore.validateConsistency()
    if (feesStore.consistencyReport && !feesStore.consistencyReport.valid) {
      Modal.warning({
        title: 'Inconsistencies Found',
        content: `Found ${feesStore.consistencyReport.inconsistencies.length} inconsistencies with frontend fees. Please review and fix them.`,
        width: 600,
      })
    }
  } catch (error) {
    console.error('Failed to validate consistency:', error)
  }
}

function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(4)}%`
}
</script>

<style scoped>
.fees-page {
  padding: 24px;
}
</style>
