<template>
  <a-form
    :model="formState"
    :rules="rules"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    @finish="handleSubmit"
  >
    <a-form-item label="Old Path" name="oldPath">
      <a-input
        v-model:value="formState.oldPath"
        placeholder="e.g., /old/path"
        :disabled="mode === 'edit'"
      />
    </a-form-item>

    <a-form-item label="New Path" name="newPath">
      <a-input v-model:value="formState.newPath" placeholder="e.g., /new/path" />
    </a-form-item>

    <a-form-item label="Status Code" name="statusCode">
      <a-radio-group v-model:value="formState.statusCode">
        <a-radio :value="301">301 (Permanent)</a-radio>
        <a-radio :value="302">302 (Temporary)</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item label="Effective From" name="effectiveFrom">
      <a-date-picker
        v-model:value="formState.effectiveFrom"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
        style="width: 100%"
      />
    </a-form-item>

    <a-form-item label="Effective To" name="effectiveTo">
      <a-date-picker
        v-model:value="formState.effectiveTo"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
        style="width: 100%"
        placeholder="Leave empty for permanent redirect"
      />
    </a-form-item>

    <a-form-item label="Reason" name="reason">
      <a-textarea v-model:value="formState.reason" placeholder="Reason for redirect" :rows="3" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
      <a-space>
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ mode === 'create' ? 'Create' : 'Update' }}
        </a-button>
        <a-button @click="handleCancel">Cancel</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { RouteRedirect } from '@/services/api/config.mappings'
import dayjs, { type Dayjs } from 'dayjs'

interface Props {
  initialData?: Partial<RouteRedirect>
  mode?: 'create' | 'edit'
  loading?: boolean
}

interface Emits {
  (e: 'submit', data: Partial<RouteRedirect>): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formState = ref<any>({
  oldPath: '',
  newPath: '',
  statusCode: 301,
  effectiveFrom: dayjs(),
  effectiveTo: null,
  reason: '',
})

const rules: Record<string, Rule[]> = {
  oldPath: [
    { required: true, message: 'Please enter old path' },
    { pattern: /^\//, message: 'Path must start with /' },
  ],
  newPath: [
    { required: true, message: 'Please enter new path' },
    { pattern: /^\//, message: 'Path must start with /' },
  ],
  statusCode: [{ required: true, message: 'Please select status code' }],
  effectiveFrom: [{ required: true, message: 'Please select effective from date' }],
}

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formState.value = {
        ...newData,
        effectiveFrom: newData.effectiveFrom ? dayjs(newData.effectiveFrom) : dayjs(),
        effectiveTo: newData.effectiveTo ? dayjs(newData.effectiveTo) : null,
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  const data = {
    ...formState.value,
    effectiveFrom: formState.value.effectiveFrom?.format('YYYY-MM-DD HH:mm:ss'),
    effectiveTo: formState.value.effectiveTo?.format('YYYY-MM-DD HH:mm:ss') || undefined,
  }
  emit('submit', data)
}

function handleCancel() {
  emit('cancel')
}
</script>
