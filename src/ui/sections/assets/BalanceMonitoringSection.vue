<template>
  <a-card title="Balance Monitoring" :bordered="false" class="mb-6">
    <template #extra>
      <a-space>
        <a-button size="small" @click="handleRefresh">
          <template #icon>
            <ReloadOutlined />
          </template>
          Refresh
        </a-button>
      </a-space>
    </template>
    <BalanceTable :balances="balances" :loading="loading" />
  </a-card>
</template>

<script setup lang="ts">
import { ReloadOutlined } from '@ant-design/icons-vue'
import BalanceTable from '@/ui/widgets/assets/BalanceTable.vue'
import type { PropType } from 'vue'

interface ChainBalance {
  chain: string
  hotBalance: string
  hotBalanceUsd: number
  coldBalance: string
  coldBalanceUsd: number
  totalBalance: string
  totalBalanceUsd: number
  hotRatio: number
  status: 'healthy' | 'degraded' | 'down'
  lastSyncAt: string
}

const props = defineProps({
  balances: {
    type: Array as PropType<ChainBalance[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['refresh'])

const handleRefresh = () => {
  emit('refresh')
}
</script>
