<template>
  <div class="cache-switches-page">
    <a-page-header
      title="Cache & Feature Switches"
      sub-title="Manage application caches and feature flags"
    />

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="12">
        <CacheControls
          :caches="caches"
          :loading="settingsStore.loading"
          @refresh="handleRefreshCache"
          @clear="handleClearCache"
        />
      </a-col>

      <a-col :xs="24" :lg="12">
        <FeatureToggle
          :features="settingsStore.featureFlags"
          :loading="settingsStore.loading"
          @toggle="handleToggleFeature"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useSettingsStore } from '@/stores/settings'
import CacheControls from '@/widgets/controls/CacheControls.vue'
import FeatureToggle from '@/widgets/toggle/FeatureToggle.vue'

const settingsStore = useSettingsStore()

const caches = computed(() => {
  if (!settingsStore.cacheStatus?.caches) {
    return []
  }
  return settingsStore.cacheStatus.caches
})

onMounted(async () => {
  await Promise.all([settingsStore.fetchCacheStatus(), settingsStore.fetchFeatureFlags()])
})

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

async function handleToggleFeature(key: string, enabled: boolean) {
  try {
    await settingsStore.updateFeatureFlag(key, enabled)
    message.success(`Feature ${enabled ? 'enabled' : 'disabled'} successfully`)
  } catch (error) {
    message.error('Failed to update feature flag')
  }
}
</script>

<style scoped>
.cache-switches-page {
  padding: 24px;
}
</style>
