<template>
  <a-modal
    v-model:open="isVisible"
    :title="isEdit ? 'Edit Task' : 'Create Task'"
    width="600px"
    :confirm-loading="tasksStore.loading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical">
      <a-form-item label="Task Name" name="name">
        <a-input v-model:value="formData.name" placeholder="Enter task name" />
      </a-form-item>

      <a-form-item label="Task Type" name="type">
        <a-select v-model:value="formData.type" placeholder="Select task type">
          <a-select-option value="data-sync">Data Sync</a-select-option>
          <a-select-option value="report-generation">Report Generation</a-select-option>
          <a-select-option value="cache-refresh">Cache Refresh</a-select-option>
          <a-select-option value="cleanup">Cleanup</a-select-option>
          <a-select-option value="notification">Notification</a-select-option>
          <a-select-option value="custom">Custom</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Schedule (Cron Expression)" name="schedule">
        <a-input v-model:value="formData.schedule" placeholder="e.g., 0 0 * * * (every hour)" />
        <div class="schedule-hint">
          <a-typography-text type="secondary" style="font-size: 12px">
            Format: second minute hour day month weekday
          </a-typography-text>
        </div>
      </a-form-item>

      <a-form-item label="Configuration" name="config">
        <JsonEditor
          v-model:value="formData.config"
          :height="200"
          placeholder="Enter task configuration as JSON"
        />
      </a-form-item>

      <a-form-item label="Status" name="enabled">
        <a-switch
          v-model:checked="formData.enabled"
          checked-children="Enabled"
          un-checked-children="Disabled"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { useTasksStore } from '@/stores/tasks'
import type { ScheduledTask, TaskSchedulePayload } from '@/services/api/facade'
import JsonEditor from '@/shared/JsonEditor.vue'

interface Props {
  visible: boolean
  task: ScheduledTask | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tasksStore = useTasksStore()
const formRef = ref<FormInstance>()

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const isEdit = computed(() => !!props.task)

const formData = ref<TaskSchedulePayload>({
  name: '',
  type: '',
  schedule: '',
  config: {},
  enabled: true,
})

const rules = {
  name: [{ required: true, message: 'Please enter task name', trigger: 'blur' }],
  type: [{ required: true, message: 'Please select task type', trigger: 'change' }],
  schedule: [
    { required: true, message: 'Please enter schedule', trigger: 'blur' },
    {
      pattern:
        /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))/,
      message: 'Invalid cron expression',
      trigger: 'blur',
    },
  ],
}

// Watch for task changes
watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      formData.value = {
        name: newTask.name,
        type: newTask.type,
        schedule: newTask.schedule,
        config: {},
        enabled: newTask.status === 'enabled',
      }
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

function resetForm() {
  formData.value = {
    name: '',
    type: '',
    schedule: '',
    config: {},
    enabled: true,
  }
  formRef.value?.resetFields()
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()

    if (isEdit.value && props.task) {
      await tasksStore.updateTask(props.task.id, formData.value)
      message.success('Task updated successfully')
    } else {
      await tasksStore.createTask(formData.value)
      message.success('Task created successfully')
    }

    emit('success')
    resetForm()
  } catch (error) {
    if (error instanceof Error) {
      message.error(error.message || 'Failed to save task')
    }
  }
}

function handleCancel() {
  resetForm()
  isVisible.value = false
}
</script>

<style scoped>
.schedule-hint {
  margin-top: 4px;
}
</style>
