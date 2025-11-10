<template>
  <a-form
    :model="formState"
    :rules="rules"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    @finish="handleSubmit"
  >
    <a-form-item label="Nav Key" name="navKey">
      <a-input
        v-model:value="formState.navKey"
        placeholder="e.g., dashboard.overview"
        :disabled="mode === 'edit'"
      />
    </a-form-item>

    <a-form-item label="Nav Label" name="navLabel">
      <a-input v-model:value="formState.navLabel" placeholder="e.g., Dashboard Overview" />
    </a-form-item>

    <a-form-item label="API Endpoint" name="apiEndpoint">
      <a-input v-model:value="formState.apiEndpoint" placeholder="e.g., /admin/dashboard/stats" />
    </a-form-item>

    <a-form-item label="HTTP Method" name="method">
      <a-select v-model:value="formState.method" placeholder="Select method">
        <a-select-option value="GET">GET</a-select-option>
        <a-select-option value="POST">POST</a-select-option>
        <a-select-option value="PUT">PUT</a-select-option>
        <a-select-option value="PATCH">PATCH</a-select-option>
        <a-select-option value="DELETE">DELETE</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Description" name="description">
      <a-textarea
        v-model:value="formState.description"
        placeholder="Optional description"
        :rows="3"
      />
    </a-form-item>

    <a-form-item label="Status" name="status">
      <a-radio-group v-model:value="formState.status">
        <a-radio value="active">Active</a-radio>
        <a-radio value="deprecated">Deprecated</a-radio>
      </a-radio-group>
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
import type { NavToApiMapping } from '@/services/api/facade'

interface Props {
  initialData?: Partial<NavToApiMapping>
  mode?: 'create' | 'edit'
  loading?: boolean
}

interface Emits {
  (e: 'submit', data: Partial<NavToApiMapping>): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formState = ref<Partial<NavToApiMapping>>({
  navKey: '',
  navLabel: '',
  apiEndpoint: '',
  method: 'GET',
  description: '',
  status: 'active',
})

const rules: Record<string, Rule[]> = {
  navKey: [
    { required: true, message: 'Please enter nav key' },
    { pattern: /^[a-z0-9.]+$/, message: 'Nav key must be lowercase alphanumeric with dots' },
  ],
  navLabel: [{ required: true, message: 'Please enter nav label' }],
  apiEndpoint: [
    { required: true, message: 'Please enter API endpoint' },
    { pattern: /^\//, message: 'API endpoint must start with /' },
  ],
  method: [{ required: true, message: 'Please select HTTP method' }],
  status: [{ required: true, message: 'Please select status' }],
}

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formState.value = { ...newData }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  emit('submit', formState.value)
}

function handleCancel() {
  emit('cancel')
}
</script>
