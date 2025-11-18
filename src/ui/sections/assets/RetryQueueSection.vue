<template>
  <a-card :bordered="false">
    <template #title>
      <a-space>
        <span>Failed Transaction Retry Queue</span>
        <a-tag v-if="retryQueue.length > 0" color="red"> {{ retryQueue.length }} pending </a-tag>
      </a-space>
    </template>
    <template #extra>
      <a-button size="small" @click="handleRefresh">
        <template #icon>
          <ReloadOutlined />
        </template>
        Refresh
      </a-button>
    </template>
    <RetryQueueTable
      :retry-queue="retryQueue"
      :loading="loading"
      @retry="handleRetry"
      @cancel="handleCancel"
      @view-transaction="handleViewTransaction"
    />
  </a-card>
</template>

<script setup lang="ts">
import { ReloadOutlined } from '@ant-design/icons-vue'
import RetryQueueTable from '@/ui/widgets/assets/RetryQueueTable.vue'
import type { RetryTask } from '@/contracts/assets'
import type { PropType } from 'vue'

const props = defineProps({
  retryQueue: {
    type: Array as PropType<RetryTask[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['refresh', 'retry', 'cancel', 'view-transaction'])

const handleRefresh = () => {
  emit('refresh')
}

const handleRetry = (task: RetryTask) => {
  emit('retry', task)
}

const handleCancel = (task: RetryTask) => {
  emit('cancel', task)
}

const handleViewTransaction = (task: RetryTask) => {
  emit('view-transaction', task)
}
</script>
