<script setup lang="ts">
// Main App Component
import { ConfigProvider } from 'ant-design-vue'
import { useLocale } from '@/composables'
import DebugPanel from '@/components/DebugPanel.vue'

const { antdLocale } = useLocale()

// 只在开发环境显示调试面板
const showDebug = import.meta.env.DEV
</script>

<template>
  <ConfigProvider :locale="antdLocale">
    <router-view />
    <DebugPanel v-if="showDebug" />
  </ConfigProvider>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
