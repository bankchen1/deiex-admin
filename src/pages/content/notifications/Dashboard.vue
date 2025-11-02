<template>
  <div class="notification-dashboard">
    <a-row :gutter="16" class="stats-section">
      <a-col :span="6">
        <a-card>
          <a-statistic title="Total Notifications" :value="stats.total" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="Pending" :value="stats.pending" :value-style="{ color: '#faad14' }" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="Sent" :value="stats.sent" :value-style="{ color: '#52c41a' }" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="Failed" :value="stats.failed" :value-style="{ color: '#ff4d4f' }" />
        </a-card>
      </a-col>
    </a-row>

    <a-card title="Recent Notifications" :bordered="false" class="content-card">
      <template #extra>
        <a-button type="primary" @click="handleCreateTemplate">Create Template</a-button>
      </template>
      <a-list :data-source="recentNotifications" :loading="loading">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <span>{{ item.title }}</span>
                <a-tag v-if="item.priority === 'high'" color="red" style="margin-left: 8px"
                  >High</a-tag
                >
              </template>
              <template #description>
                <div class="notification-meta">
                  <span>{{ item.templateName }}</span>
                  <span>•</span>
                  <span>{{ formatDate(item.createdAt) }}</span>
                  <span>•</span>
                  <a-tag :color="getStatusColor(item.status)">{{
                    getStatusText(item.status)
                  }}</a-tag>
                </div>
              </template>
            </a-list-item-meta>
            <template #actions>
              <a-button type="link" size="small" @click="handleViewNotification(item)"
                >View</a-button
              >
            </template>
          </a-list-item>
        </template>
        <template #footer>
          <div class="list-footer">
            <a-button type="primary" ghost @click="handleManageNotifications"
              >Manage Notifications</a-button
            >
            <a-button @click="handleManageTemplates">Manage Templates</a-button>
          </div>
        </template>
      </a-list>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/date'
import type { Notification } from '@/types/models'

// Mock data for demonstration
const mockNotifications: Notification[] = [
  {
    id: '1',
    templateId: '1',
    templateName: 'Welcome Email',
    title: 'Welcome to DEIEX!',
    content: 'Thank you for joining our platform...',
    channels: ['email'],
    status: 'sent',
    priority: 'normal',
    sentAt: '2023-06-15T10:00:00Z',
    createdAt: '2023-06-15T10:00:00Z',
    updatedAt: '2023-06-15T10:00:00Z',
  },
  {
    id: '2',
    templateId: '2',
    templateName: 'Security Alert',
    title: 'Security Alert: New Login',
    content: 'We detected a new login to your account...',
    channels: ['email', 'sms'],
    status: 'sent',
    priority: 'high',
    sentAt: '2023-06-14T15:30:00Z',
    createdAt: '2023-06-14T15:30:00Z',
    updatedAt: '2023-06-14T15:30:00Z',
  },
  {
    id: '3',
    templateId: '3',
    templateName: 'Market Update',
    title: 'Market Update: BTC Price Surge',
    content: 'Bitcoin price has surged 5% in the last hour...',
    channels: ['push'],
    status: 'pending',
    priority: 'normal',
    createdAt: '2023-06-16T09:00:00Z',
    updatedAt: '2023-06-16T09:00:00Z',
  },
]

// State
const stats = ref({
  total: 42,
  pending: 3,
  sent: 35,
  failed: 4,
})

const recentNotifications = ref<Notification[]>(mockNotifications)
const loading = ref(false)

const router = useRouter()

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

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    sent: 'green',
    failed: 'red',
  }
  return colorMap[status] || 'default'
}

function getStatusText(status: string): string {
  const textMap: Record<string, string> = {
    pending: 'Pending',
    sent: 'Sent',
    failed: 'Failed',
  }
  return textMap[status] || status
}

function handleCreateTemplate() {
  router.push('/admin/content/notifications/templates/create')
}

function handleViewNotification(notification: Notification) {
  router.push(`/admin/content/notifications/${notification.id}`)
}

function handleManageNotifications() {
  router.push('/admin/content/notifications/list')
}

function handleManageTemplates() {
  router.push('/admin/content/notifications/templates')
}
</script>

<style scoped>
.notification-dashboard {
  padding: 24px 0;
}

.stats-section {
  margin-bottom: 24px;
}

.content-card {
  margin-top: 16px;
}

.notification-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #666;
  font-size: 12px;
}

.list-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
</style>
