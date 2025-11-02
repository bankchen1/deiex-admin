<template>
  <div class="copy-trading-page">
    <a-card :bordered="false">
      <!-- Filter Section -->
      <div class="filter-section">
        <a-form layout="inline" :model="filters">
          <a-form-item label="Leader ID">
            <a-input
              v-model:value="filters.leaderId"
              placeholder="Leader ID"
              style="width: 180px"
              allow-clear
            />
          </a-form-item>

          <a-form-item label="Follower ID">
            <a-input
              v-model:value="filters.followerId"
              placeholder="Follower ID"
              style="width: 180px"
              allow-clear
            />
          </a-form-item>

          <a-form-item label="Status">
            <a-select
              v-model:value="filters.status"
              placeholder="All"
              style="width: 140px"
              allow-clear
            >
              <a-select-option value="active">Active</a-select-option>
              <a-select-option value="paused">Paused</a-select-option>
              <a-select-option value="stopped">Stopped</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-space>
              <a-button type="primary" @click="handleSearch">
                <template #icon>
                  <SearchOutlined />
                </template>
                Search
              </a-button>
              <a-button @click="handleReset">Reset</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>

      <!-- Stats Section -->
      <a-row :gutter="16" style="margin-bottom: 16px">
        <a-col :span="6">
          <a-statistic
            title="Total Relations"
            :value="ordersStore.copyTradingTotal"
            :value-style="{ color: '#1890ff' }"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            title="Active Relations"
            :value="activeCount"
            :value-style="{ color: '#52c41a' }"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            title="Total Profit"
            :value="totalProfit"
            :precision="2"
            :value-style="{ color: totalProfit >= 0 ? '#52c41a' : '#ff4d4f' }"
            prefix="$"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            title="Avg Profit Share"
            :value="avgProfitShare"
            :precision="1"
            suffix="%"
            :value-style="{ color: '#faad14' }"
          />
        </a-col>
      </a-row>

      <!-- Table Section -->
      <div class="table-section">
        <CopyTradingTable
          :filters="appliedFilters"
          @view-detail="handleViewDetail"
          @pause="handlePause"
          @resume="handleResume"
          @stop="handleStop"
          @selection-change="handleSelectionChange"
        >
          <template #toolbar>
            <a-space>
              <a-button :disabled="selectedRelations.length === 0" @click="handleBatchExport">
                <template #icon>
                  <ExportOutlined />
                </template>
                Export Selected ({{ selectedRelations.length }})
              </a-button>
            </a-space>
          </template>
        </CopyTradingTable>
      </div>
    </a-card>

    <!-- Detail/Edit Drawer -->
    <a-drawer
      :open="detailDrawerOpen"
      :title="`Copy Trading Configuration - ${selectedRelation?.id || ''}`"
      width="720"
      @close="handleCloseDetail"
    >
      <a-spin :spinning="detailLoading">
        <div v-if="selectedRelation" class="relation-detail">
          <!-- Basic Information -->
          <a-card title="Relation Information" :bordered="false" class="detail-card">
            <a-descriptions :column="2" bordered size="small">
              <a-descriptions-item label="Relation ID">
                {{ selectedRelation.id }}
              </a-descriptions-item>
              <a-descriptions-item label="Status">
                <a-tag
                  :color="
                    selectedRelation.status === 'active'
                      ? 'green'
                      : selectedRelation.status === 'paused'
                        ? 'orange'
                        : 'default'
                  "
                >
                  {{ selectedRelation.status.toUpperCase() }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Leader ID">
                <a @click="handleViewUser(selectedRelation.leaderId)">
                  {{ selectedRelation.leaderId }}
                </a>
              </a-descriptions-item>
              <a-descriptions-item label="Leader Name">
                {{ selectedRelation.leaderNickname }}
              </a-descriptions-item>
              <a-descriptions-item label="Follower ID">
                <a @click="handleViewUser(selectedRelation.followerId)">
                  {{ selectedRelation.followerId }}
                </a>
              </a-descriptions-item>
              <a-descriptions-item label="Follower Name">
                {{ selectedRelation.followerNickname }}
              </a-descriptions-item>
              <a-descriptions-item label="Total Profit">
                <span
                  :style="{
                    color: parseFloat(selectedRelation.totalProfit) >= 0 ? '#52c41a' : '#ff4d4f',
                    fontWeight: 'bold',
                  }"
                >
                  {{ formatNumber(selectedRelation.totalProfit, 2) }}
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="Total Loss">
                <span style="color: #ff4d4f; font-weight: bold">
                  {{ formatNumber(selectedRelation.totalLoss, 2) }}
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="Created At">
                {{ formatDate(selectedRelation.createdAt) }}
              </a-descriptions-item>
              <a-descriptions-item label="Updated At">
                {{ formatDate(selectedRelation.updatedAt) }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>

          <!-- Configuration Form -->
          <a-card title="Configuration" :bordered="false" class="detail-card">
            <CopyTradingConfigForm
              :initial-data="selectedRelation"
              :loading="updateLoading"
              submit-text="Update Configuration"
              @submit="handleUpdateConfig"
              @cancel="handleCloseDetail"
            />
          </a-card>
        </div>
      </a-spin>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { SearchOutlined, ExportOutlined } from '@ant-design/icons-vue'
import CopyTradingTable from '@/tables/orders/CopyTradingTable.vue'
import CopyTradingConfigForm from '@/forms/copy-trading/CopyTradingConfigForm.vue'
import type { CopyTradingRelation, CopyTradingQueryParams } from '@/services/api/orders'
import { useOrdersStore } from '@/stores/orders'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/format'

const router = useRouter()
const ordersStore = useOrdersStore()

// Filters
const filters = reactive<CopyTradingQueryParams>({
  leaderId: undefined,
  followerId: undefined,
  status: undefined,
})

const appliedFilters = ref<CopyTradingQueryParams>({})

// Selection
const selectedRelations = ref<CopyTradingRelation[]>([])

// Detail Drawer
const detailDrawerOpen = ref(false)
const selectedRelation = ref<CopyTradingRelation | null>(null)
const detailLoading = ref(false)
const updateLoading = ref(false)

// Computed Stats
const activeCount = computed(() => {
  return ordersStore.copyTradingRelations.filter((r) => r.status === 'active').length
})

const totalProfit = computed(() => {
  return ordersStore.copyTradingRelations.reduce(
    (sum, r) => sum + parseFloat(r.totalProfit) - parseFloat(r.totalLoss),
    0
  )
})

const avgProfitShare = computed(() => {
  if (ordersStore.copyTradingRelations.length === 0) return 0
  const sum = ordersStore.copyTradingRelations.reduce((sum, r) => sum + r.profitSharePercent, 0)
  return sum / ordersStore.copyTradingRelations.length
})

function handleSearch() {
  appliedFilters.value = { ...filters }
}

function handleReset() {
  filters.leaderId = undefined
  filters.followerId = undefined
  filters.status = undefined
  appliedFilters.value = {}
}

function handleSelectionChange(rows: CopyTradingRelation[]) {
  selectedRelations.value = rows
}

async function handleViewDetail(relation: CopyTradingRelation) {
  selectedRelation.value = relation
  detailDrawerOpen.value = true

  // Optionally fetch full details
  if (relation.id) {
    detailLoading.value = true
    try {
      await ordersStore.fetchCopyTradingById(relation.id)
      selectedRelation.value = ordersStore.currentCopyTrading
    } finally {
      detailLoading.value = false
    }
  }
}

function handleCloseDetail() {
  detailDrawerOpen.value = false
  selectedRelation.value = null
}

function handleViewUser(userId: string) {
  router.push(`/admin/users/${userId}`)
}

async function handlePause(relation: CopyTradingRelation) {
  Modal.confirm({
    title: 'Pause Copy Trading',
    content: `Are you sure you want to pause this copy trading relation?`,
    onOk: async () => {
      try {
        await ordersStore.pauseCopyTrading(relation.id)
        message.success('Copy trading paused successfully')
      } catch (error) {
        message.error('Failed to pause copy trading')
      }
    },
  })
}

async function handleResume(relation: CopyTradingRelation) {
  Modal.confirm({
    title: 'Resume Copy Trading',
    content: `Are you sure you want to resume this copy trading relation?`,
    onOk: async () => {
      try {
        await ordersStore.resumeCopyTrading(relation.id)
        message.success('Copy trading resumed successfully')
      } catch (error) {
        message.error('Failed to resume copy trading')
      }
    },
  })
}

async function handleStop(relation: CopyTradingRelation) {
  Modal.confirm({
    title: 'Stop Copy Trading',
    content: `Are you sure you want to permanently stop this copy trading relation? This action cannot be undone.`,
    okText: 'Stop',
    okType: 'danger',
    onOk: async () => {
      try {
        await ordersStore.stopCopyTrading(relation.id)
        message.success('Copy trading stopped successfully')
      } catch (error) {
        message.error('Failed to stop copy trading')
      }
    },
  })
}

async function handleUpdateConfig(data: any) {
  if (!selectedRelation.value) return

  updateLoading.value = true
  try {
    await ordersStore.updateCopyTrading(selectedRelation.value.id, {
      copyRatio: data.copyRatio,
      maxPositionSize: data.maxPositionSize.toString(),
      stopLossPercent: data.stopLossPercent,
      takeProfitPercent: data.takeProfitPercent,
      profitSharePercent: data.profitSharePercent,
    })
    message.success('Configuration updated successfully')
    handleCloseDetail()
  } catch (error) {
    message.error('Failed to update configuration')
  } finally {
    updateLoading.value = false
  }
}

async function handleBatchExport() {
  await ordersStore.exportCopyTrading({
    ...appliedFilters.value,
  })
}
</script>

<style scoped>
.copy-trading-page {
  padding: 24px;
}

.filter-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.filter-section :deep(.ant-form-item) {
  margin-bottom: 8px;
}

.table-section {
  margin-top: 16px;
}

.relation-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-card {
  margin-bottom: 0;
}
</style>
