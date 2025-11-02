<template>
  <a-card :title="title" :bordered="bordered" size="small">
    <a-space direction="vertical" style="width: 100%" :size="16">
      <div v-if="targetTime" class="countdown-display">
        <a-statistic-countdown :value="targetTimestamp" :format="format" @finish="handleFinish">
          <template #prefix>
            <ClockCircleOutlined />
          </template>
        </a-statistic-countdown>
      </div>

      <a-alert v-if="isOverdue" type="warning" message="Event is overdue" show-icon />

      <div v-if="description" class="countdown-description">
        <a-typography-text type="secondary">{{ description }}</a-typography-text>
      </div>

      <a-divider v-if="showDetails" style="margin: 8px 0" />

      <div v-if="showDetails" class="countdown-details">
        <a-descriptions :column="1" size="small">
          <a-descriptions-item label="Event">{{ eventName }}</a-descriptions-item>
          <a-descriptions-item label="Start Time">
            {{ formatDateTime(targetTime) }}
          </a-descriptions-item>
          <a-descriptions-item v-if="endTime" label="End Time">
            {{ formatDateTime(endTime) }}
          </a-descriptions-item>
          <a-descriptions-item v-if="type" label="Type">
            <a-tag :color="getTypeColor(type)">{{ type }}</a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-space>
  </a-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ClockCircleOutlined } from '@ant-design/icons-vue'
import { formatDateTime } from '@/utils/date'

interface Props {
  title?: string
  targetTime: string
  endTime?: string
  eventName?: string
  description?: string
  type?: 'funding' | 'maintenance' | 'announcement' | 'event'
  format?: string
  bordered?: boolean
  showDetails?: boolean
}

interface Emits {
  (e: 'finish'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Countdown',
  format: 'D [days] H [hours] m [minutes] s [seconds]',
  bordered: true,
  showDetails: false,
})

const emit = defineEmits<Emits>()

const targetTimestamp = computed(() => new Date(props.targetTime).getTime())

const isOverdue = computed(() => {
  return targetTimestamp.value < Date.now()
})

function handleFinish() {
  emit('finish')
}

function getTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    funding: 'blue',
    maintenance: 'orange',
    announcement: 'green',
    event: 'purple',
  }
  return colorMap[type] || 'default'
}
</script>

<style scoped>
.countdown-display {
  text-align: center;
  padding: 16px 0;
}

.countdown-display :deep(.ant-statistic-content) {
  font-size: 24px;
  font-weight: 600;
}

.countdown-description {
  text-align: center;
}

.countdown-details {
  background: #fafafa;
  padding: 12px;
  border-radius: 4px;
}
</style>
