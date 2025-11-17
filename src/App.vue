<script setup lang="ts">
// Main App Component
import { ConfigProvider } from 'ant-design-vue'
import { useLocale } from '@/composables'

const { antdLocale } = useLocale()
</script>

<template>
  <ConfigProvider :locale="antdLocale">
    <router-view />
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
