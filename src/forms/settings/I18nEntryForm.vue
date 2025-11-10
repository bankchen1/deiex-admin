<template>
  <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical" @finish="handleSubmit">
    <a-form-item label="Key" name="key">
      <a-input
        v-model:value="formState.key"
        placeholder="e.g., common.save"
        :disabled="mode === 'edit'"
      />
      <template #extra>
        Use dot notation for nested keys (e.g., common.save, kyc.status.pending)
      </template>
    </a-form-item>

    <a-form-item label="Module" name="module">
      <a-select
        v-model:value="formState.module"
        placeholder="Select module"
        show-search
        allow-clear
      >
        <a-select-option value="common">Common</a-select-option>
        <a-select-option value="nav">Navigation</a-select-option>
        <a-select-option value="dashboard">Dashboard</a-select-option>
        <a-select-option value="kyc">KYC</a-select-option>
        <a-select-option value="users">Users</a-select-option>
        <a-select-option value="assets">Assets</a-select-option>
        <a-select-option value="orders">Orders</a-select-option>
        <a-select-option value="config">Config</a-select-option>
        <a-select-option value="risk">Risk</a-select-option>
        <a-select-option value="ops">Ops</a-select-option>
        <a-select-option value="reports">Reports</a-select-option>
        <a-select-option value="settings">Settings</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="English Text" name="en">
      <a-textarea
        v-model:value="formState.en"
        placeholder="Enter English translation"
        :rows="3"
        :maxlength="500"
        show-count
      />
    </a-form-item>

    <a-form-item label="Chinese Text" name="zh">
      <a-textarea
        v-model:value="formState.zh"
        placeholder="Enter Chinese translation"
        :rows="3"
        :maxlength="500"
        show-count
      />
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type="primary" html-type="submit" :loading="loading">
          <template #icon><SaveOutlined /></template>
          {{ mode === 'create' ? 'Create' : 'Update' }}
        </a-button>
        <a-button @click="handleCancel"> Cancel </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { SaveOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { I18nEntry } from '@/services/api/facade'

interface Props {
  initialValues?: Partial<I18nEntry>
  mode?: 'create' | 'edit'
  loading?: boolean
}

interface Emits {
  (e: 'submit', values: Partial<I18nEntry>): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formRef = ref()
const formState = ref<Partial<I18nEntry>>({
  key: '',
  module: '',
  en: '',
  zh: '',
})

const rules: Record<string, Rule[]> = {
  key: [
    { required: true, message: 'Please enter key' },
    {
      pattern: /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/,
      message: 'Key must use lowercase letters, numbers, and dots only',
    },
  ],
  module: [{ required: true, message: 'Please select module' }],
  en: [
    { required: true, message: 'Please enter English text' },
    { max: 500, message: 'Text must not exceed 500 characters' },
  ],
  zh: [
    { required: true, message: 'Please enter Chinese text' },
    { max: 500, message: 'Text must not exceed 500 characters' },
  ],
}

watch(
  () => props.initialValues,
  (newValues) => {
    if (newValues) {
      formState.value = { ...newValues }
    }
  },
  { immediate: true, deep: true }
)

function handleSubmit() {
  emit('submit', formState.value)
}

function handleCancel() {
  emit('cancel')
}
</script>
