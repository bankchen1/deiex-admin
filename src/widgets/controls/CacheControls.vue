<template>
  <a-card title="Cache Management" :loading="loading">
    <a-space direction="vertical" style="width: 100%" :size="16">
      <a-alert
        message="Cache Information"
        description="Manage application caches to ensure data freshness. Refreshing caches will reload data from the source, while clearing will remove all cached data."
        type="info"
        show-icon
      />

      <a-list :data-source="caches" :loading="loading">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #avatar>
                <a-avatar :style="{ backgroundColor: getStatusColor(item.status) }">
                  <template #icon>
                    <component :is="getStatusIcon(item.status)" />
                  </template>
                </a-avatar>
              </template>
              <template #title>
                <a-space>
                  <span>{{ item.name }}</span>
                  <a-tag :color="getStatusColor(item.status)">
                    {{ item.status.toUpperCase() }}
                  </a-tag>
                </a-space>
              </template>
              <template #description>
                <a-space direction="vertical" size="small">
                  <span>Last Refresh: {{ formatDate(item.lastRefresh) }}</span>
                  <span>Size: {{ formatSize(item.size) }}</span>
                </a-space>
              </template>
            </a-list-item-meta>
            <template #actions>
              <a-button
                type="link"
                size="small"
                :loading="refreshingCache === item.name"
                @click="handleRefresh(item.name)"
              >
                <template #icon><ReloadOutlined /></template>
                Refresh
              </a-button>
              <a-button
                type="link"
                size="small"
                danger
                :loading="clearingCache === item.name"
                @click="handleClear(item.name)"
              >
                <template #icon><DeleteOutlined /></template>
                Clear
              </a-button>
            </template>
          </a-list-item>
        </template>
      </a-list>

      <a-divider />

      <a-space>
        <a-button type="primary" :loading="refreshingAll" @click="handleRefreshAll">
          <template #icon><ReloadOutlined /></template>
          Refresh All
        </a-button>
        <a-button danger :loading="clearingAll" @click="handleClearAll">
          <template #icon><DeleteOutlined /></template>
          Clear All
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
import { Modal, message } from 'ant-design-vue'
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

const refreshingCache = ref<string | null>(null)
const clearingCache = ref<string | null>(null)
const refreshingAll = ref(false)
const clearingAll = ref(false)

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

function handleRefresh(cacheName: string) {
  Modal.confirm({
    title: 'Refresh Cache',
    content: `Are you sure you want to refresh the ${cacheName} cache?`,
    okText: 'Refresh',
    cancelText: 'Cancel',
    onOk: async () => {
      refreshingCache.value = cacheName
      try {
        emit('refresh', [cacheName])
        message.success(`${cacheName} cache refreshed successfully`)
      } catch (error) {
        console.error(`[CacheControls] Failed to refresh cache "${cacheName}"`, error)
        message.error(`Failed to refresh ${cacheName} cache`)
      } finally {
        refreshingCache.value = null
      }
    },
  })
}

function handleClear(cacheName: string) {
  Modal.confirm({
    title: 'Clear Cache',
    content: `Are you sure you want to clear the ${cacheName} cache? This will remove all cached data.`,
    okText: 'Clear',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk: async () => {
      clearingCache.value = cacheName
      try {
        emit('clear', [cacheName])
        message.success(`${cacheName} cache cleared successfully`)
      } catch (error) {
        console.error(`[CacheControls] Failed to clear cache "${cacheName}"`, error)
        message.error(`Failed to clear ${cacheName} cache`)
      } finally {
        clearingCache.value = null
      }
    },
  })
}

function handleRefreshAll() {
  Modal.confirm({
    title: 'Refresh All Caches',
    content: 'Are you sure you want to refresh all caches? This may take a few moments.',
    okText: 'Refresh',
    cancelText: 'Cancel',
    onOk: async () => {
      refreshingAll.value = true
      try {
        emit('refresh', allCacheNames.value)
        message.success('All caches refreshed successfully')
      } catch (error) {
        console.error('[CacheControls] Failed to refresh caches', error)
        message.error('Failed to refresh caches')
      } finally {
        refreshingAll.value = false
      }
    },
  })
}

function handleClearAll() {
  Modal.confirm({
    title: 'Clear All Caches',
    content: 'Are you sure you want to clear all caches? This will remove all cached data.',
    okText: 'Clear',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk: async () => {
      clearingAll.value = true
      try {
        emit('clear', allCacheNames.value)
        message.success('All caches cleared successfully')
      } catch (error) {
        console.error('[CacheControls] Failed to clear caches', error)
        message.error('Failed to clear caches')
      } finally {
        clearingAll.value = false
      }
    },
  })
}
</script>
