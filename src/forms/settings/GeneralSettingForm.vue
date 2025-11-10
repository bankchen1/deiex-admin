<template>
  <a-form :model="formState" :rules="rules" layout="vertical" @finish="handleSubmit">
    <a-form-item label="Site Name" name="siteName">
      <a-input v-model:value="formState.siteName" placeholder="Enter site name" :maxlength="100" />
    </a-form-item>

    <a-form-item label="Logo URL" name="logo">
      <a-input v-model:value="formState.logo" placeholder="Enter logo URL" />
      <template #extra>
        <a-space v-if="formState.logo" style="margin-top: 8px">
          <span>Preview:</span>
          <img :src="formState.logo" alt="Logo" style="max-height: 40px" />
        </a-space>
      </template>
    </a-form-item>

    <a-form-item label="Operation Mode" name="operationMode">
      <a-radio-group v-model:value="formState.operationMode">
        <a-radio value="normal">
          <a-space>
            <CheckCircleOutlined style="color: #52c41a" />
            <span>Normal</span>
          </a-space>
        </a-radio>
        <a-radio value="readonly">
          <a-space>
            <WarningOutlined style="color: #faad14" />
            <span>Read-Only</span>
          </a-space>
        </a-radio>
        <a-radio value="maintenance">
          <a-space>
            <CloseCircleOutlined style="color: #ff4d4f" />
            <span>Maintenance</span>
          </a-space>
        </a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item
      v-if="formState.operationMode === 'maintenance'"
      label="Maintenance Message"
      name="maintenanceMessage"
    >
      <a-textarea
        v-model:value="formState.maintenanceMessage"
        placeholder="Enter maintenance message to display to users"
        :rows="4"
        :maxlength="500"
        show-count
      />
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type="primary" html-type="submit" :loading="loading">
          <template #icon><SaveOutlined /></template>
          Save Settings
        </a-button>
        <a-button @click="handleReset">
          <template #icon><ReloadOutlined /></template>
          Reset
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  SaveOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { GeneralSettings } from '@/services/api/facade'

interface Props {
  initialValues?: Partial<GeneralSettings>
  loading?: boolean
}

interface Emits {
  (e: 'submit', values: Partial<GeneralSettings>): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const formState = ref<Partial<GeneralSettings>>({
  siteName: '',
  logo: '',
  operationMode: 'normal',
  maintenanceMessage: '',
})

const rules: Record<string, Rule[]> = {
  siteName: [
    { required: true, message: 'Please enter site name' },
    { min: 2, max: 100, message: 'Site name must be between 2 and 100 characters' },
  ],
  logo: [{ type: 'url', message: 'Please enter a valid URL' }],
  operationMode: [{ required: true, message: 'Please select operation mode' }],
  maintenanceMessage: [
    {
      validator: (_rule, value) => {
        if (formState.value.operationMode === 'maintenance' && !value) {
          return Promise.reject('Please enter maintenance message')
        }
        return Promise.resolve()
      },
    },
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

function handleReset() {
  if (props.initialValues) {
    formState.value = { ...props.initialValues }
  }
}
</script>
