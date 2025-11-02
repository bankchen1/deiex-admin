<template>
  <a-menu
    v-model:selected-keys="selectedKeys"
    v-model:open-keys="openKeys"
    mode="inline"
    theme="dark"
    :inline-collapsed="collapsed"
    class="sidebar-menu"
  >
    <template v-for="item in menuItems" :key="item.key">
      <!-- Menu item with children -->
      <a-sub-menu v-if="item.children && item.children.length > 0" :key="item.key">
        <template #icon>
          <component :is="item.icon" v-if="item.icon" />
        </template>
        <template #title>{{ item.title }}</template>
        <a-menu-item
          v-for="child in item.children"
          :key="child.key"
          @click="handleMenuClick(child.path)"
        >
          <component :is="child.icon" v-if="child.icon" />
          <span>{{ child.title }}</span>
        </a-menu-item>
      </a-sub-menu>

      <!-- Single menu item -->
      <a-menu-item v-else :key="item.key" @click="handleMenuClick(item.path)">
        <template #icon>
          <component :is="item.icon" v-if="item.icon" />
        </template>
        <span>{{ item.title }}</span>
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import type { MenuItem } from '../types'
import {
  DashboardOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  WalletOutlined,
  TransactionOutlined,
  SettingOutlined,
  WarningOutlined,
  ToolOutlined,
  BarChartOutlined,
  ControlOutlined,
  ExperimentOutlined,
} from '@ant-design/icons-vue'

interface Props {
  menuItems: MenuItem[]
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const collapsed = computed(() => appStore.collapsed)

// Selected and open keys
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

// Initialize selected and open keys based on current route
watch(
  () => route.path,
  (path) => {
    updateMenuState(path)
  },
  { immediate: true }
)

function updateMenuState(path: string) {
  // Find the matching menu item
  const findMenuItem = (items: MenuItem[], targetPath: string): MenuItem | null => {
    for (const item of items) {
      if (item.path === targetPath) {
        return item
      }
      if (item.children) {
        const found = findMenuItem(item.children, targetPath)
        if (found) return found
      }
    }
    return null
  }

  // Find parent keys for the current path
  const findParentKeys = (
    items: MenuItem[],
    targetPath: string,
    parents: string[] = []
  ): string[] => {
    for (const item of items) {
      if (item.path === targetPath) {
        return parents
      }
      if (item.children) {
        const found = findParentKeys(item.children, targetPath, [...parents, item.key])
        if (found.length > 0) return found
      }
    }
    return []
  }

  const menuItem = findMenuItem(props.menuItems, path)
  if (menuItem) {
    selectedKeys.value = [menuItem.key]
    const parents = findParentKeys(props.menuItems, path)
    openKeys.value = parents
  }
}

function handleMenuClick(path: string) {
  router.push(path)
}
</script>

<style scoped>
.sidebar-menu {
  border-right: none;
}

.sidebar-menu :deep(.ant-menu-item),
.sidebar-menu :deep(.ant-menu-submenu-title) {
  margin: 4px 8px;
  width: calc(100% - 16px);
  border-radius: 4px;
}

.sidebar-menu :deep(.ant-menu-item-selected) {
  background-color: #1890ff !important;
}

.sidebar-menu :deep(.ant-menu-submenu-selected > .ant-menu-submenu-title) {
  color: #1890ff;
}
</style>
