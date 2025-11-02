<template>
  <div class="page-tabs">
    <div class="tabs-container">
      <div
        v-for="tab in appStore.visitedViews"
        :key="tab.path"
        :class="['tab-item', { active: isActive(tab.path) }]"
        @click="handleTabClick(tab)"
      >
        <span class="tab-title">{{ tab.title }}</span>
        <CloseOutlined v-if="tab.closable" class="tab-close" @click.stop="handleTabClose(tab)" />
      </div>
    </div>

    <!-- Tab Actions -->
    <a-dropdown class="tab-actions">
      <a-button type="text" size="small">
        <DownOutlined />
      </a-button>
      <template #overlay>
        <a-menu @click="handleActionClick">
          <a-menu-item key="close-others">
            <span>Close Others</span>
          </a-menu-item>
          <a-menu-item key="close-left">
            <span>Close to the Left</span>
          </a-menu-item>
          <a-menu-item key="close-right">
            <span>Close to the Right</span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="close-all">
            <span>Close All</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { CloseOutlined, DownOutlined } from '@ant-design/icons-vue'
import type { PageTab } from '@/types/store'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const isActive = (path: string) => {
  return route.path === path
}

function handleTabClick(tab: PageTab) {
  router.push(tab.path)
}

function handleTabClose(tab: PageTab) {
  appStore.removeVisitedView(tab.path)

  // If closing active tab, navigate to the last tab
  if (isActive(tab.path)) {
    const views = appStore.visitedViews
    if (views.length > 0) {
      const lastView = views[views.length - 1]
      if (lastView) {
        router.push(lastView.path)
      }
    } else {
      router.push('/admin/dashboard')
    }
  }
}

function handleActionClick({ key }: { key: string }) {
  const currentIndex = appStore.visitedViews.findIndex((v) => v.path === route.path)

  switch (key) {
    case 'close-others':
      appStore.closeOtherViews(route.path)
      break
    case 'close-left':
      appStore.closeLeftViews(currentIndex)
      break
    case 'close-right':
      appStore.closeRightViews(currentIndex)
      break
    case 'close-all':
      appStore.closeAllViews()
      router.push('/admin/dashboard')
      break
  }
}
</script>

<style scoped>
.page-tabs {
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 16px;
  height: 40px;
  overflow: hidden;
}

.tabs-container {
  flex: 1;
  display: flex;
  gap: 4px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.tabs-container::-webkit-scrollbar {
  display: none;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
  font-size: 13px;
}

.tab-item:hover {
  background: #e6f7ff;
  border-color: #91d5ff;
}

.tab-item.active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.tab-title {
  user-select: none;
}

.tab-close {
  font-size: 10px;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.tab-close:hover {
  opacity: 1;
}

.tab-item.active .tab-close {
  color: #fff;
}

.tab-actions {
  margin-left: 8px;
}
</style>
