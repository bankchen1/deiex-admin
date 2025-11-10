<template>
  <a-modal
    v-model:open="isVisible"
    title="Run Task Now"
    width="500px"
    ok-text="Run"
    @ok="handleConfirm"
    @cancel="handleCancel"
  >
    <div class="run-now-content">
      <a-alert
        message="Confirm Task Execution"
        type="warning"
        show-icon
        style="margin-bottom: 16px"
      >
        <template #description>
          This will execute the task immediately, regardless of its schedule.
        </template>
      </a-alert>

      <a-descriptions v-if="task" :column="1" bordered>
        <a-descriptions-item label="Task Name">
          {{ task.name }}
        </a-descriptions-item>
        <a-descriptions-item label="Task Type">
          {{ task.type }}
        </a-descriptions-item>
        <a-descriptions-item label="Schedule">
          <a-typography-text code>{{ task.schedule }}</a-typography-text>
        </a-descriptions-item>
        <a-descriptions-item v-if="task.lastRunAt" label="Last Run">
          <div>
            {{ formatDateTime(task.lastRunAt) }}
            <a-tag
              v-if="task.lastRunStatus"
              :color="task.lastRunStatus === 'success' ? 'green' : 'red'"
              style="margin-left: 8px"
            >
              {{ task.lastRunStatus }}
            </a-tag>
          </div>
        </a-descriptions-item>
        <a-descriptions-item v-if="task.nextRunAt" label="Next Scheduled Run">
          {{ formatDateTime(task.nextRunAt) }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScheduledTask } from '@/services/api/facade'
import { formatDateTime } from '@/utils/date'

interface Props {
  visible: boolean
  task: ScheduledTask | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  isVisible.value = false
}
</script>

<style scoped>
.run-now-content {
  padding: 8px 0;
}
</style>
