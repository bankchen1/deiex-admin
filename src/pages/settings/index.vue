<template>
  <div class="settings-page">
    <a-page-header title="Settings" sub-title="Configure system settings and preferences" />

    <a-card>
      <a-tabs v-model:active-key="activeTab" @change="handleTabChange">
        <a-tab-pane key="general" tab="General">
          <General />
        </a-tab-pane>
        <a-tab-pane key="theme" tab="Theme">
          <Theme />
        </a-tab-pane>
        <a-tab-pane key="i18n" tab="Internationalization">
          <I18n />
        </a-tab-pane>
        <a-tab-pane key="cache" tab="Cache & Switches">
          <CacheAndSwitches />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import General from './General.vue'
import Theme from './Theme.vue'
import I18n from './I18n.vue'
import CacheAndSwitches from './CacheAndSwitches.vue'

const route = useRoute()
const router = useRouter()

const activeTab = ref((route.query.tab as string) || 'general')

function handleTabChange(key: string) {
  router.push({ query: { tab: key } })
}
</script>

<style scoped>
.settings-page {
  padding: 24px;
}
</style>
