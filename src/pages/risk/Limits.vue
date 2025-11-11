<template>
  <div class="risk-limits-page">
    <a-page-header title="Risk Limits" :ghost="false">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon><PlusOutlined /></template>
            New Limit
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
        <a-form-item label="Scope">
          <a-select
            v-model:value="filters.scope"
            placeholder="All Scopes"
            style="width: 150px"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="user">User</a-select-option>
            <a-select-option value="country">Country</a-select-option>
            <a-select-option value="device">Device</a-select-option>
            <a-select-option value="currency">Currency</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Type">
          <a-select
            v-model:value="filters.type"
            placeholder="All Types"
            style="width: 150px"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="deposit">Deposit</a-select-option>
            <a-select-option value="withdrawal">Withdrawal</a-select-option>
            <a-select-option value="trading">Trading</a-select-option>
            <a-select-option value="position">Position</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>

      <a-tabs v-model:active-key="activeTab" @change="handleTabChange">
        <a-tab-pane key="user" tab="User Limits">
          <ServerTable
            :columns="columns"
            :data-source="filteredLimits"
            :loading="riskStore.limitsLoading"
            :pagination="pagination"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'name'">
                <a @click="handleView(record)">{{ record.name }}</a>
              </template>

              <template v-else-if="column.key === 'scope'">
                <a-tag color="blue">{{ record.scope }}</a-tag>
                <span v-if="record.scopeValue" style="margin-left: 8px">
                  {{ record.scopeValue }}
                </span>
              </template>

              <template v-else-if="column.key === 'type'">
                <a-tag :color="getTypeColor(record.type)">{{ record.type }}</a-tag>
              </template>

              <template v-else-if="column.key === 'threshold'">
                <strong>{{ formatAmount(record.threshold) }}</strong>
                <span v-if="record.currency" style="margin-left: 4px">{{ record.currency }}</span>
              </template>

              <template v-else-if="column.key === 'usage'">
                <a-progress
                  :percent="record.usagePercentage || 0"
                  :status="getUsageStatus(record.usagePercentage)"
                  :format="
                    () =>
                      `${formatAmount(record.currentUsage || '0')} / ${formatAmount(record.threshold)}`
                  "
                />
              </template>

              <template v-else-if="column.key === 'enabled'">
                <a-switch
                  :checked="record.enabled"
                  :loading="switchLoading[record.id]"
                  @change="(checked) => handleToggleEnabled(record, checked)"
                />
              </template>

              <template v-else-if="column.key === 'operation'">
                <a-space>
                  <a @click="handleEdit(record)">Edit</a>
                  <a-popconfirm
                    title="Are you sure you want to delete this limit?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="handleDelete(record)"
                  >
                    <a style="color: #ff4d4f">Delete</a>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </ServerTable>
        </a-tab-pane>

        <a-tab-pane key="country" tab="Country Limits">
          <ServerTable
            :columns="columns"
            :data-source="filteredLimits"
            :loading="riskStore.limitsLoading"
            :pagination="pagination"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'name'">
                <a @click="handleView(record)">{{ record.name }}</a>
              </template>

              <template v-else-if="column.key === 'scope'">
                <a-tag color="blue">{{ record.scope }}</a-tag>
                <span v-if="record.scopeValue" style="margin-left: 8px">
                  {{ record.scopeValue }}
                </span>
              </template>

              <template v-else-if="column.key === 'type'">
                <a-tag :color="getTypeColor(record.type)">{{ record.type }}</a-tag>
              </template>

              <template v-else-if="column.key === 'threshold'">
                <strong>{{ formatAmount(record.threshold) }}</strong>
                <span v-if="record.currency" style="margin-left: 4px">{{ record.currency }}</span>
              </template>

              <template v-else-if="column.key === 'usage'">
                <a-progress
                  :percent="record.usagePercentage || 0"
                  :status="getUsageStatus(record.usagePercentage)"
                  :format="
                    () =>
                      `${formatAmount(record.currentUsage || '0')} / ${formatAmount(record.threshold)}`
                  "
                />
              </template>

              <template v-else-if="column.key === 'enabled'">
                <a-switch
                  :checked="record.enabled"
                  :loading="switchLoading[record.id]"
                  @change="(checked) => handleToggleEnabled(record, checked)"
                />
              </template>

              <template v-else-if="column.key === 'operation'">
                <a-space>
                  <a @click="handleEdit(record)">Edit</a>
                  <a-popconfirm
                    title="Are you sure you want to delete this limit?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="handleDelete(record)"
                  >
                    <a style="color: #ff4d4f">Delete</a>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </ServerTable>
        </a-tab-pane>

        <a-tab-pane key="device" tab="Device Limits">
          <ServerTable
            :columns="columns"
            :data-source="filteredLimits"
            :loading="riskStore.limitsLoading"
            :pagination="pagination"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'name'">
                <a @click="handleView(record)">{{ record.name }}</a>
              </template>

              <template v-else-if="column.key === 'scope'">
                <a-tag color="blue">{{ record.scope }}</a-tag>
                <span v-if="record.scopeValue" style="margin-left: 8px">
                  {{ record.scopeValue }}
                </span>
              </template>

              <template v-else-if="column.key === 'type'">
                <a-tag :color="getTypeColor(record.type)">{{ record.type }}</a-tag>
              </template>

              <template v-else-if="column.key === 'threshold'">
                <strong>{{ formatAmount(record.threshold) }}</strong>
                <span v-if="record.currency" style="margin-left: 4px">{{ record.currency }}</span>
              </template>

              <template v-else-if="column.key === 'usage'">
                <a-progress
                  :percent="record.usagePercentage || 0"
                  :status="getUsageStatus(record.usagePercentage)"
                  :format="
                    () =>
                      `${formatAmount(record.currentUsage || '0')} / ${formatAmount(record.threshold)}`
                  "
                />
              </template>

              <template v-else-if="column.key === 'enabled'">
                <a-switch
                  :checked="record.enabled"
                  :loading="switchLoading[record.id]"
                  @change="(checked) => handleToggleEnabled(record, checked)"
                />
              </template>

              <template v-else-if="column.key === 'operation'">
                <a-space>
                  <a @click="handleEdit(record)">Edit</a>
                  <a-popconfirm
                    title="Are you sure you want to delete this limit?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="handleDelete(record)"
                  >
                    <a style="color: #ff4d4f">Delete</a>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </ServerTable>
        </a-tab-pane>

        <a-tab-pane key="currency" tab="Currency Limits">
          <ServerTable
            :columns="columns"
            :data-source="filteredLimits"
            :loading="riskStore.limitsLoading"
            :pagination="pagination"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'name'">
                <a @click="handleView(record)">{{ record.name }}</a>
              </template>

              <template v-else-if="column.key === 'scope'">
                <a-tag color="blue">{{ record.scope }}</a-tag>
                <span v-if="record.scopeValue" style="margin-left: 8px">
                  {{ record.scopeValue }}
                </span>
              </template>

              <template v-else-if="column.key === 'type'">
                <a-tag :color="getTypeColor(record.type)">{{ record.type }}</a-tag>
              </template>

              <template v-else-if="column.key === 'threshold'">
                <strong>{{ formatAmount(record.threshold) }}</strong>
                <span v-if="record.currency" style="margin-left: 4px">{{ record.currency }}</span>
              </template>

              <template v-else-if="column.key === 'usage'">
                <a-progress
                  :percent="record.usagePercentage || 0"
                  :status="getUsageStatus(record.usagePercentage)"
                  :format="
                    () =>
                      `${formatAmount(record.currentUsage || '0')} / ${formatAmount(record.threshold)}`
                  "
                />
              </template>

              <template v-else-if="column.key === 'enabled'">
                <a-switch
                  :checked="record.enabled"
                  :loading="switchLoading[record.id]"
                  @change="(checked) => handleToggleEnabled(record, checked)"
                />
              </template>

              <template v-else-if="column.key === 'operation'">
                <a-space>
                  <a @click="handleEdit(record)">Edit</a>
                  <a-popconfirm
                    title="Are you sure you want to delete this limit?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="handleDelete(record)"
                  >
                    <a style="color: #ff4d4f">Delete</a>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </ServerTable>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- Edit/Create Drawer -->
    <a-drawer
      v-model:open="drawerVisible"
      :title="drawerMode === 'create' ? 'Create Risk Limit' : 'Edit Risk Limit'"
      width="720"
      :body-style="{ paddingBottom: '80px' }"
    >
      <LimitForm
        :initial-data="currentLimit"
        :mode="drawerMode"
        :loading="riskStore.limitsLoading"
        @submit="handleFormSubmit"
        @cancel="drawerVisible = false"
      />
    </a-drawer>

    <!-- View Drawer -->
    <a-drawer v-model:open="viewDrawerVisible" title="Limit Details" width="720">
      <a-descriptions v-if="currentLimit" :column="1" bordered>
        <a-descriptions-item label="Limit Name">
          {{ currentLimit.name }}
        </a-descriptions-item>
        <a-descriptions-item label="Description">
          {{ currentLimit.description || 'N/A' }}
        </a-descriptions-item>
        <a-descriptions-item label="Scope">
          <a-tag color="blue">{{ currentLimit.scope }}</a-tag>
          <span v-if="currentLimit.scopeValue" style="margin-left: 8px">
            {{ currentLimit.scopeValue }}
          </span>
        </a-descriptions-item>
        <a-descriptions-item label="Type">
          <a-tag :color="getTypeColor(currentLimit.type)">{{ currentLimit.type }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Period">
          {{ currentLimit.period }}
        </a-descriptions-item>
        <a-descriptions-item label="Threshold">
          {{ formatAmount(currentLimit.threshold) }}
          <span v-if="currentLimit.currency" style="margin-left: 4px">{{
            currentLimit.currency
          }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="Current Usage">
          {{ formatAmount(currentLimit.currentUsage || '0') }}
          ({{ currentLimit.usagePercentage || 0 }}%)
        </a-descriptions-item>
        <a-descriptions-item label="Enabled">
          <a-badge
            :status="currentLimit.enabled ? 'success' : 'default'"
            :text="currentLimit.enabled ? 'Yes' : 'No'"
          />
        </a-descriptions-item>
        <a-descriptions-item label="Effective From">
          {{ currentLimit.effectiveFrom || 'N/A' }}
        </a-descriptions-item>
        <a-descriptions-item label="Effective To">
          {{ currentLimit.effectiveTo || 'N/A' }}
        </a-descriptions-item>
        <a-descriptions-item label="Created At">
          {{ currentLimit.createdAt }}
        </a-descriptions-item>
        <a-descriptions-item label="Updated At">
          {{ currentLimit.updatedAt }}
        </a-descriptions-item>
      </a-descriptions>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { PlusOutlined, ExportOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRiskStore } from '@/stores/risk'
import ServerTable from '@/shared/ServerTable.vue'
import LimitForm from '@/forms/risk/LimitForm.vue'
import type { RiskLimit } from '@/contracts/risk'
import type { TableColumn } from '@/types/components'

const riskStore = useRiskStore()

const activeTab = ref('user')
const drawerVisible = ref(false)
const viewDrawerVisible = ref(false)
const drawerMode = ref<'create' | 'edit'>('create')
const currentLimit = ref<RiskLimit | null>(null)
const switchLoading = ref<Record<string, boolean>>({})

const filters = reactive({
  scope: undefined as string | undefined,
  type: undefined as string | undefined,
})

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
})

const columns: TableColumn[] = [
  {
    title: 'Limit Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    fixed: 'left',
  },
  {
    title: 'Scope',
    dataIndex: 'scope',
    key: 'scope',
    width: 150,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 120,
  },
  {
    title: 'Period',
    dataIndex: 'period',
    key: 'period',
    width: 100,
  },
  {
    title: 'Threshold',
    dataIndex: 'threshold',
    key: 'threshold',
    width: 150,
  },
  {
    title: 'Current Usage',
    key: 'usage',
    width: 250,
  },
  {
    title: 'Enabled',
    dataIndex: 'enabled',
    key: 'enabled',
    width: 100,
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 180,
  },
  {
    title: 'Operation',
    key: 'operation',
    width: 150,
    fixed: 'right',
  },
]

const filteredLimits = computed(() => {
  let limits = riskStore.limits.filter((limit) => limit.scope === activeTab.value)

  if (filters.type) {
    limits = limits.filter((limit) => limit.type === filters.type)
  }

  return limits
})

onMounted(() => {
  loadData()
})

async function loadData() {
  try {
    await riskStore.fetchLimits({ scope: activeTab.value })
  } catch (error) {
    console.error('Failed to load risk limits:', error)
  }
}

function handleTabChange(key: string) {
  activeTab.value = key
  loadData()
}

function handleFilterChange() {
  loadData()
}

function handleTableChange(params: any) {
  console.log('Table changed:', params)
}

function handleCreate() {
  currentLimit.value = null
  drawerMode.value = 'create'
  drawerVisible.value = true
}

function handleEdit(record: RiskLimit) {
  currentLimit.value = record
  drawerMode.value = 'edit'
  drawerVisible.value = true
}

function handleView(record: RiskLimit) {
  currentLimit.value = record
  viewDrawerVisible.value = true
}

async function handleDelete(record: RiskLimit) {
  try {
    await riskStore.deleteLimit(record.id)
    message.success('Limit deleted successfully')
  } catch (error) {
    console.error('Failed to delete limit:', error)
  }
}

async function handleToggleEnabled(record: RiskLimit, enabled: boolean) {
  switchLoading.value[record.id] = true
  try {
    await riskStore.updateLimit(record.id, { enabled })
    message.success(`Limit ${enabled ? 'enabled' : 'disabled'} successfully`)
  } catch (error) {
    console.error('Failed to toggle limit:', error)
  } finally {
    setTimeout(() => {
      switchLoading.value[record.id] = false
    }, 500)
  }
}

async function handleFormSubmit(data: Partial<RiskLimit>) {
  try {
    if (drawerMode.value === 'create') {
      await riskStore.createLimit(data)
    } else if (currentLimit.value) {
      await riskStore.updateLimit(currentLimit.value.id, data)
    }
    drawerVisible.value = false
    await loadData()
  } catch (error) {
    console.error('Failed to save limit:', error)
  }
}

async function handleExport() {
  try {
    await riskStore.exportLimits('json')
  } catch (error) {
    console.error('Failed to export limits:', error)
  }
}

function formatAmount(amount: string): string {
  const num = parseFloat(amount)
  if (isNaN(num)) return amount
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    deposit: 'green',
    withdrawal: 'orange',
    trading: 'blue',
    position: 'purple',
  }
  return colors[type] || 'default'
}

function getUsageStatus(percentage?: number): 'success' | 'normal' | 'exception' {
  if (!percentage) return 'normal'
  if (percentage >= 90) return 'exception'
  if (percentage >= 70) return 'normal'
  return 'success'
}
</script>

<style scoped>
.risk-limits-page {
  padding: 24px;
}
</style>
