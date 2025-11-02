<template>
  <div class="theme-settings-page">
    <a-page-header
      title="Theme Settings"
      sub-title="Customize the look and feel of the admin panel"
    />

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="12">
        <a-card title="Theme Configuration" :loading="settingsStore.loading">
          <ThemeForm
            :initial-values="settingsStore.themeSettings || undefined"
            :loading="settingsStore.loading"
            @submit="handleUpdateTheme"
            @preview="handlePreview"
          />
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="12">
        <ThemePreview :theme="previewTheme" :site-name="generalSettings?.siteName" />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useSettingsStore } from '@/stores/settings'
import ThemeForm from '@/forms/settings/ThemeForm.vue'
import ThemePreview from '@/widgets/preview/ThemePreview.vue'
import type { ThemeSettings } from '@/services/api/settings'

const settingsStore = useSettingsStore()

const previewTheme = ref<Partial<ThemeSettings>>({
  primaryColor: '#1890ff',
  mode: 'light',
  loginPageText: 'Welcome Back',
  copyright: '© 2024 DEIEX. All rights reserved.',
})

const generalSettings = computed(() => settingsStore.generalSettings)

onMounted(async () => {
  await Promise.all([settingsStore.fetchThemeSettings(), settingsStore.fetchGeneralSettings()])

  if (settingsStore.themeSettings) {
    previewTheme.value = { ...settingsStore.themeSettings }
  }
})

async function handleUpdateTheme(values: Partial<ThemeSettings>) {
  try {
    await settingsStore.updateThemeSettings(values)
    previewTheme.value = { ...values }
    message.success('Theme settings updated successfully')
  } catch (error) {
    message.error('Failed to update theme settings')
  }
}

function handlePreview(values: Partial<ThemeSettings>) {
  previewTheme.value = { ...values }
}
</script>

<style scoped>
.theme-settings-page {
  padding: 24px;
}
</style>
