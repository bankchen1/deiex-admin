<template>
  <a-modal
    v-model:open="isVisible"
    title="Disable Task"
    width="500px"
    ok-text="Disable"
    ok-type="danger"
    @ok="handleConfirm"
    @cancel="handleCancel"
  >
    <div class="disable-task-content">
      <a-alert message="Confirm Task Disable" type="warning" show-icon style="margin-bottom: 16px">
        <template #description>
          Disabling this task will prevent it from running on its schedule. You can re-enable it
          later.
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
        <a-descriptions-item label="Current Status">
          <a-tag :color="task.status === 'enabled' ? 'green' : 'default'">
            {{ task.status.toUpperCase() }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item v-if="task.nextRunAt" label="Next Scheduled Run">
          {{ formatDateTime(task.nextRunAt) }}
        </a-descriptions-item>
      </a-descriptions>

      <a-form style="margin-top: 16px">
        <a-form-item label="Reason (Optional)">
          <a-textarea
            v-model:value="reason"
            placeholder="Enter reason for disabling this task"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ScheduledTask } from '@/services/api/ops'
import { formatDateTime } from '@/utils/date'

interface Props {
  visible: boolean
  task: ScheduledTask | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', reason?: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const reason = ref('')

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

watch(
  () => props.visible,
  (newVisible) => {
    if (!newVisible) {
      reason.value = ''
    }
  }
)

function handleConfirm() {
  emit('confirm', reason.value || undefined)
}

function handleCancel() {
  isVisible.value = false
}
</script>

<style scoped>
.disable-task-content {
  padding: 8px 0;
}
</style>
