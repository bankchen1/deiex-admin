<template>
  <a-card title="Chain Health Status" size="small">
    <a-space direction="vertical" style="width: 100%" :size="16">
      <div v-for="chain in chainHealth" :key="chain.chain" class="chain-status">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center">
            <a-badge :status="getStatusBadge(chain.status)" />
            <span class="font-medium ml-2">{{ chain.chain }}</span>
          </div>
          <a-tag :color="getStatusColor(chain.status)">
            {{ chain.status.toUpperCase() }}
          </a-tag>
        </div>

        <a-descriptions :column="2" size="small" bordered>
          <a-descriptions-item label="Block Height">
            {{ chain.blockHeight.toLocaleString() }}
          </a-descriptions-item>
          <a-descriptions-item label="Last Block">
            {{ formatDateTime(chain.lastBlockTime) }}
          </a-descriptions-item>
          <a-descriptions-item label="Sync Status">
            <a-progress :percent="chain.syncStatus" size="small" />
          </a-descriptions-item>
          <a-descriptions-item label="Nodes">
            {{ chain.nodeCount }}
          </a-descriptions-item>
        </a-descriptions>

        <div v-if="chain.issues && chain.issues.length > 0" class="mt-2">
          <a-alert
            v-for="(issue, index) in chain.issues"
            :key="index"
            :message="issue"
            type="warning"
            size="small"
            show-icon
            class="mb-1"
          />
        </div>
      </div>
    </a-space>
  </a-card>
</template>

<script setup lang="ts">
import type { ChainHealth as ChainHealthType } from '@/types/models'
import { formatDateTime } from '@/utils/date'

interface Props {
  chainHealth: ChainHealthType[]
}

defineProps<Props>()

function getStatusBadge(status: string) {
  const statusMap: Record<string, 'success' | 'processing' | 'error' | 'default' | 'warning'> = {
    healthy: 'success',
    degraded: 'warning',
    down: 'error',
  }
  return statusMap[status] || 'default'
}

function getStatusColor(status: string) {
  const colorMap: Record<string, string> = {
    healthy: 'success',
    degraded: 'warning',
    down: 'error',
  }
  return colorMap[status] || 'default'
}
</script>

<style scoped>
.chain-status {
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}
</style>
