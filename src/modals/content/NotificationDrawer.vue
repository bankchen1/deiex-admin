<template>
  <a-drawer
    v-model:open="visible"
    :title="drawerTitle"
    width="520"
    :body-style="{ paddingBottom: '80px' }"
    @close="handleClose"
  >
    <a-descriptions :column="1" bordered>
      <a-descriptions-item label="Title">
        {{ notification?.title }}
      </a-descriptions-item>
      <a-descriptions-item label="Template">
        {{ notification?.templateName }}
      </a-descriptions-item>
      <a-descriptions-item label="Content">
        <div class="notification-content" v-html="notification?.content"></div>
      </a-descriptions-item>
      <a-descriptions-item label="Channels">
        <a-space>
          <a-tag
            v-for="channel in notification?.channels"
            :key="channel"
            :color="getChannelColor(channel)"
          >
            {{ channel.toUpperCase() }}
          </a-tag>
        </a-space>
      </a-descriptions-item>
      <a-descriptions-item label="Status">
        <a-tag :color="getStatusColor(notification?.status)">
          {{ getStatusText(notification?.status) }}
        </a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="Priority">
        <a-tag :color="getPriorityColor(notification?.priority)">
          {{ getPriorityText(notification?.priority) }}
        </a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="Recipient">
        <div v-if="notification?.userEmail">{{ notification.userEmail }}</div>
        <div v-if="notification?.userPhone">{{ notification.userPhone }}</div>
        <div v-if="notification?.userId">User ID: {{ notification.userId }}</div>
      </a-descriptions-item>
      <a-descriptions-item label="Created At">
        {{ notification?.createdAt ? formatDate(notification.createdAt) : '' }}
      </a-descriptions-item>
      <a-descriptions-item label="Sent At">
        {{ notification?.sentAt ? formatDate(notification.sentAt) : 'Not sent yet' }}
      </a-descriptions-item>
      <a-descriptions-item v-if="notification?.failedReason" label="Failed Reason">
        <span class="error-text">{{ notification.failedReason }}</span>
      </a-descriptions-item>
    </a-descriptions>

    <template #footer>
      <a-space>
        <a-button @click="handleClose">Close</a-button>
        <a-button v-if="notification?.status === 'failed'" type="primary" @click="handleResend">
          Resend
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { formatDate } from '@/utils/date'
import type { Notification } from '@/types/models'

interface Props {
  open?: boolean
  notification?: Notification | null
  mode?: 'view'
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
  (e: 'resend', notification: Notification): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  notification: null,
  mode: 'view',
})

const emit = defineEmits<Emits>()

const visible = ref(false)

// Computed
const drawerTitle = computed(() => {
  return 'View Notification'
})

// Watchers
watch(
  () => props.open,
  (newVal) => {
    visible.value = newVal
  }
)

// Helper functions
function getChannelColor(channel: string): string {
  const colorMap: Record<string, string> = {
    email: 'blue',
    sms: 'green',
    push: 'purple',
  }
  return colorMap[channel] || 'default'
}

function getStatusColor(status?: string): string {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    sent: 'green',
    failed: 'red',
  }
  return status ? colorMap[status] || 'default' : 'default'
}

function getStatusText(status?: string): string {
  const textMap: Record<string, string> = {
    pending: 'Pending',
    sent: 'Sent',
    failed: 'Failed',
  }
  return status ? textMap[status] || status : ''
}

function getPriorityColor(priority?: string): string {
  const colorMap: Record<string, string> = {
    low: 'default',
    normal: 'blue',
    high: 'red',
  }
  return priority ? colorMap[priority] || 'default' : 'default'
}

function getPriorityText(priority?: string): string {
  const textMap: Record<string, string> = {
    low: 'Low',
    normal: 'Normal',
    high: 'High',
  }
  return priority ? textMap[priority] || priority : ''
}

// Methods
function handleClose() {
  visible.value = false
  emit('update:open', false)
  emit('close')
}

function handleResend() {
  if (props.notification) {
    emit('resend', props.notification)
    handleClose()
  }
}
</script>

<style scoped>
.notification-content {
  white-space: pre-wrap;
  line-height: 1.5;
}

.error-text {
  color: #ff4d4f;
}
</style>
