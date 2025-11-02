<template>
  <div class="general-settings-page">
    <a-page-header
      title="General Settings"
      sub-title="Configure site-wide settings and cache management"
    />

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="12">
        <a-card title="Site Configuration" :loading="settingsStore.loading">
          <GeneralSettingForm
            :initial-values="settingsStore.generalSettings || undefined"
            :loading="settingsStore.loading"
            @submit="handleUpdateSettings"
          />
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="12">
        <CacheStatus
          :caches="caches"
          :loading="settingsStore.loading"
          @refresh="handleRefreshCache"
          @clear="handleClearCache"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useSettingsStore } from '@/stores/settings'
import GeneralSettingForm from '@/forms/settings/GeneralSettingForm.vue'
import CacheStatus from '@/widgets/status/CacheStatus.vue'
import type { GeneralSettings } from '@/services/api/settings'

const settingsStore = useSettingsStore()

const caches = computed(() => {
  if (!settingsStore.cacheStatus?.caches) {
    return []
  }
  return settingsStore.cacheStatus.caches
})

onMounted(async () => {
  await Promise.all([settingsStore.fetchGeneralSettings(), settingsStore.fetchCacheStatus()])
})

async function handleUpdateSettings(values: Partial<GeneralSettings>) {
  try {
    await settingsStore.updateGeneralSettings(values)
    message.success('General settings updated successfully')
  } catch (error) {
    message.error('Failed to update general settings')
  }
}

async function handleRefreshCache(targets: string[]) {
  try {
    await settingsStore.refreshCache(targets)
    message.success('Cache refreshed successfully')
  } catch (error) {
    message.error('Failed to refresh cache')
  }
}

async function handleClearCache(targets: string[]) {
  try {
    await settingsStore.clearCache(targets)
    message.success('Cache cleared successfully')
  } catch (error) {
    message.error('Failed to clear cache')
  }
}
</script>

<style scoped>
.general-settings-page {
  padding: 24px;
}
</style>
