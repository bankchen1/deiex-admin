<template>
  <a-form :model="formState" :rules="rules" layout="vertical" @finish="handleSubmit">
    <a-form-item label="Primary Color" name="primaryColor">
      <a-space>
        <input
          v-model="formState.primaryColor"
          type="color"
          style="width: 60px; height: 32px; cursor: pointer"
        />
        <a-input
          v-model:value="formState.primaryColor"
          placeholder="#1890ff"
          style="width: 120px"
        />
        <a-button size="small" @click="formState.primaryColor = '#1890ff'">
          Reset to Default
        </a-button>
      </a-space>
    </a-form-item>

    <a-form-item label="Theme Mode" name="mode">
      <a-radio-group v-model:value="formState.mode">
        <a-radio value="light">
          <a-space>
            <BulbOutlined />
            <span>Light</span>
          </a-space>
        </a-radio>
        <a-radio value="dark">
          <a-space>
            <BulbFilled />
            <span>Dark</span>
          </a-space>
        </a-radio>
        <a-radio value="auto">
          <a-space>
            <SyncOutlined />
            <span>Auto (System)</span>
          </a-space>
        </a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item label="Logo URL" name="logoUrl">
      <a-input v-model:value="formState.logoUrl" placeholder="Enter logo URL for header" />
      <template #extra>
        <a-space v-if="formState.logoUrl" style="margin-top: 8px">
          <span>Preview:</span>
          <img :src="formState.logoUrl" alt="Logo" style="max-height: 40px" />
        </a-space>
      </template>
    </a-form-item>

    <a-form-item label="Favicon URL" name="faviconUrl">
      <a-input v-model:value="formState.faviconUrl" placeholder="Enter favicon URL" />
    </a-form-item>

    <a-form-item label="Login Page Text" name="loginPageText">
      <a-input
        v-model:value="formState.loginPageText"
        placeholder="Welcome Back"
        :maxlength="100"
      />
    </a-form-item>

    <a-form-item label="Copyright Text" name="copyright">
      <a-input
        v-model:value="formState.copyright"
        placeholder="© 2024 DEIEX. All rights reserved."
        :maxlength="200"
      />
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type="primary" html-type="submit" :loading="loading">
          <template #icon><SaveOutlined /></template>
          Save Theme
        </a-button>
        <a-button @click="handleReset">
          <template #icon><ReloadOutlined /></template>
          Reset
        </a-button>
        <a-button @click="handlePreview">
          <template #icon><EyeOutlined /></template>
          Preview
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  BulbOutlined,
  BulbFilled,
  SyncOutlined,
  SaveOutlined,
  ReloadOutlined,
  EyeOutlined,
} from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { ThemeSettings } from '@/services/api/settings'

interface Props {
  initialValues?: Partial<ThemeSettings>
  loading?: boolean
}

interface Emits {
  (e: 'submit', values: Partial<ThemeSettings>): void
  (e: 'preview', values: Partial<ThemeSettings>): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const formState = ref<Partial<ThemeSettings>>({
  primaryColor: '#1890ff',
  mode: 'light',
  loginPageText: 'Welcome Back',
  copyright: '© 2024 DEIEX. All rights reserved.',
  logoUrl: '',
  faviconUrl: '',
})

const rules: Record<string, Rule[]> = {
  primaryColor: [
    { required: true, message: 'Please select primary color' },
    {
      pattern: /^#[0-9A-Fa-f]{6}$/,
      message: 'Please enter a valid hex color code',
    },
  ],
  mode: [{ required: true, message: 'Please select theme mode' }],
  logoUrl: [{ type: 'url', message: 'Please enter a valid URL' }],
  faviconUrl: [{ type: 'url', message: 'Please enter a valid URL' }],
  loginPageText: [{ max: 100, message: 'Login page text must not exceed 100 characters' }],
  copyright: [{ max: 200, message: 'Copyright text must not exceed 200 characters' }],
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

function handlePreview() {
  emit('preview', formState.value)
}
</script>
