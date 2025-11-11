<template>
  <div class="email-campaigns-page">
    <a-page-header title="Email Campaigns" sub-title="Manage email marketing campaigns">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleCreate">
            <template #icon>
              <PlusOutlined />
            </template>
            Create Campaign
          </a-button>
          <a-button @click="handleRefresh">
            <template #icon>
              <ReloadOutlined />
            </template>
            Refresh
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- Filters -->
    <a-card class="filter-card">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item label="Status">
            <a-select
              v-model:value="filters.status"
              placeholder="All Status"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All Status</a-select-option>
              <a-select-option value="draft">Draft</a-select-option>
              <a-select-option value="scheduled">Scheduled</a-select-option>
              <a-select-option value="sending">Sending</a-select-option>
              <a-select-option value="sent">Sent</a-select-option>
              <a-select-option value="paused">Paused</a-select-option>
              <a-select-option value="cancelled">Cancelled</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="Template">
            <a-select
              v-model:value="filters.templateId"
              placeholder="All Templates"
              allow-clear
              @change="handleFilterChange"
            >
              <a-select-option value="">All Templates</a-select-option>
              <a-select-option value="1">Welcome Email</a-select-option>
              <a-select-option value="2">Security Alert</a-select-option>
              <a-select-option value="3">Market Update</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="Search">
            <a-input
              v-model:value="filters.search"
              placeholder="Search by name"
              @press-enter="handleSearch"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="&nbsp;">
            <a-space>
              <a-button type="primary" @click="handleSearch">Search</a-button>
              <a-button @click="handleResetFilters">Reset</a-button>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>

    <!-- Campaigns Table -->
    <a-card class="content-card">
      <EmailCampaignTable
        :data-source="campaigns"
        :loading="loading"
        :pagination="{
          current: currentPage,
          pageSize: pageSize,
          total: total,
        }"
        @change="handleTableChange"
        @view="handleView"
        @edit="handleEdit"
        @start="handleStart"
        @pause="handlePause"
        @resume="handleResume"
        @cancel="handleCancel"
      >
        <template #toolbar>
          <span class="table-info">Total: {{ total }} campaigns</span>
        </template>
      </EmailCampaignTable>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue'
import EmailCampaignTable from '@/tables/content/EmailCampaignTable.vue'
import type { EmailCampaign } from '@/contracts/content'

// Mock data for demonstration
const mockCampaigns: EmailCampaign[] = [
  {
    id: '1',
    name: 'Welcome Series',
    templateId: '1',
    templateName: 'Welcome Email',
    subject: 'Welcome to DEIEX!',
    content: 'Thank you for joining our platform...',
    status: 'sent',
    audience: ['new-users', 'vip-users'],
    sentCount: 1250,
    openCount: 890,
    clickCount: 245,
    unsubscribeCount: 12,
    scheduleTime: '2023-06-15T10:00:00Z',
    sentAt: '2023-06-15T10:00:00Z',
    createdAt: '2023-06-15T09:00:00Z',
    updatedAt: '2023-06-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Security Alert',
    templateId: '2',
    templateName: 'Security Alert',
    subject: 'Security Alert: New Login',
    content: 'We detected a new login to your account...',
    status: 'scheduled',
    audience: ['all-users'],
    sentCount: 0,
    openCount: 0,
    clickCount: 0,
    unsubscribeCount: 0,
    scheduleTime: '2023-06-20T09:00:00Z',
    createdAt: '2023-06-18T14:00:00Z',
    updatedAt: '2023-06-18T14:00:00Z',
  },
  {
    id: '3',
    name: 'Market Update',
    templateId: '3',
    templateName: 'Market Update',
    subject: 'Market Update: BTC Price Surge',
    content: 'Bitcoin price has surged 5% in the last hour...',
    status: 'draft',
    audience: ['active-traders'],
    sentCount: 0,
    openCount: 0,
    clickCount: 0,
    unsubscribeCount: 0,
    createdAt: '2023-06-10T11:00:00Z',
    updatedAt: '2023-06-10T11:00:00Z',
  },
]

// State
const filters = ref({
  status: undefined as string | undefined,
  templateId: undefined as string | undefined,
  search: '',
})

const campaigns = ref<EmailCampaign[]>(mockCampaigns)
const loading = ref(false)
const total = ref(3)
const currentPage = ref(1)
const pageSize = ref(20)

// Lifecycle
onMounted(() => {
  fetchData()
})

// Methods
async function fetchData() {
  loading.value = true
  // In a real implementation, fetch data from API
  setTimeout(() => {
    loading.value = false
  }, 500)
}

function handleFilterChange() {
  // Auto-search on filter change (optional)
}

function handleSearch() {
  fetchData()
}

function handleResetFilters() {
  filters.value = {
    status: undefined,
    templateId: undefined,
    search: '',
  }
  fetchData()
}

function handleRefresh() {
  fetchData()
}

function handleTableChange(pagination: any) {
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize
  fetchData()
}

function handleCreate() {
  // Navigate to create campaign page
  console.log('Create campaign')
}

function handleView(record: EmailCampaign) {
  // Navigate to view campaign page
  console.log('View campaign:', record)
}

function handleEdit(record: EmailCampaign) {
  // Navigate to edit campaign page
  console.log('Edit campaign:', record)
}

function handleStart(record: EmailCampaign) {
  // In a real implementation, start campaign via API
  const index = campaigns.value.findIndex((campaign) => campaign.id === record.id)
  if (index !== -1) {
    campaigns.value[index] = { ...record, status: 'sending' }
    message.success('Campaign started successfully')
  }
}

function handlePause(record: EmailCampaign) {
  // In a real implementation, pause campaign via API
  const index = campaigns.value.findIndex((campaign) => campaign.id === record.id)
  if (index !== -1) {
    campaigns.value[index] = { ...record, status: 'paused' }
    message.success('Campaign paused successfully')
  }
}

function handleResume(record: EmailCampaign) {
  // In a real implementation, resume campaign via API
  const index = campaigns.value.findIndex((campaign) => campaign.id === record.id)
  if (index !== -1) {
    campaigns.value[index] = { ...record, status: 'sending' }
    message.success('Campaign resumed successfully')
  }
}

function handleCancel(record: EmailCampaign) {
  // In a real implementation, cancel campaign via API
  const index = campaigns.value.findIndex((campaign) => campaign.id === record.id)
  if (index !== -1) {
    campaigns.value[index] = { ...record, status: 'cancelled' }
    message.success('Campaign cancelled successfully')
  }
}
</script>

<style scoped>
.email-campaigns-page {
  padding: 24px;
}

.filter-card {
  margin-bottom: 16px;
}

.content-card {
  margin-top: 16px;
}

.table-info {
  color: #666;
  font-size: 14px;
}
</style>
