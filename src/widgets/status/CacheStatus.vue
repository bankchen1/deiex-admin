<template>
  <a-card title="Cache Status" :loading="loading">
    <a-space direction="vertical" style="width: 100%" :size="16">
      <a-row :gutter="[16, 16]">
        <a-col v-for="cache in caches" :key="cache.name" :xs="24" :sm="12" :md="8">
          <a-card size="small" :bordered="false" class="cache-card">
            <template #title>
              <a-space>
                <component
                  :is="getStatusIcon(cache.status)"
                  :style="{ color: getStatusColor(cache.status) }"
                />
                <span>{{ cache.name }}</span>
              </a-space>
            </template>
            <a-descriptions :column="1" size="small">
              <a-descriptions-item label="Status">
                <a-tag :color="getStatusColor(cache.status)">
                  {{ cache.status.toUpperCase() }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Last Refresh">
                {{ formatDate(cache.lastRefresh) }}
              </a-descriptions-item>
              <a-descriptions-item label="Size">
                {{ formatSize(cache.size) }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
      </a-row>

      <a-divider />

      <a-space>
        <a-button type="primary" :loading="refreshing" @click="handleRefreshAll">
          <template #icon><ReloadOutlined /></template>
          Refresh All Caches
        </a-button>
        <a-button danger :loading="clearing" @click="handleClearAll">
          <template #icon><DeleteOutlined /></template>
          Clear All Caches
        </a-button>
      </a-space>
    </a-space>
  </a-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { formatDate } from '@/utils/date'

interface CacheInfo {
  name: string
  status: 'healthy' | 'stale' | 'error'
  lastRefresh: string
  size: number
}

interface Props {
  caches: CacheInfo[]
  loading?: boolean
}

interface Emits {
  (e: 'refresh', targets: string[]): void
  (e: 'clear', targets: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const refreshing = ref(false)
const clearing = ref(false)

const allCacheNames = computed(() => props.caches.map((c) => c.name))

function getStatusIcon(status: string) {
  switch (status) {
    case 'healthy':
      return CheckCircleOutlined
    case 'stale':
      return WarningOutlined
    case 'error':
      return CloseCircleOutlined
    default:
      return CheckCircleOutlined
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'healthy':
      return '#52c41a'
    case 'stale':
      return '#faad14'
    case 'error':
      return '#ff4d4f'
    default:
      return '#d9d9d9'
  }
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

async function handleRefreshAll() {
  Modal.confirm({
    title: 'Refresh All Caches',
    content: 'Are you sure you want to refresh all caches? This may take a few moments.',
    okText: 'Refresh',
    cancelText: 'Cancel',
    onOk: async () => {
      refreshing.value = true
      try {
        emit('refresh', allCacheNames.value)
        message.success('All caches refreshed successfully')
      } catch (error) {
        message.error('Failed to refresh caches')
      } finally {
        refreshing.value = false
      }
    },
  })
}

async function handleClearAll() {
  Modal.confirm({
    title: 'Clear All Caches',
    content: 'Are you sure you want to clear all caches? This will remove all cached data.',
    okText: 'Clear',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk: async () => {
      clearing.value = true
      try {
        emit('clear', allCacheNames.value)
        message.success('All caches cleared successfully')
      } catch (error) {
        message.error('Failed to clear caches')
      } finally {
        clearing.value = false
      }
    },
  })
}
</script>

<style scoped>
.cache-card {
  background: #fafafa;
}

.cache-card :deep(.ant-card-head) {
  min-height: 40px;
  padding: 8px 12px;
}

.cache-card :deep(.ant-card-body) {
  padding: 12px;
}
</style>
