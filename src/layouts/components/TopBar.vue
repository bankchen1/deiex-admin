<template>
  <div class="top-bar">
    <!-- Left: Collapse trigger -->
    <div class="top-bar-left">
      <a-button type="text" class="trigger" @click="toggleSidebar">
        <MenuFoldOutlined v-if="!appStore.collapsed" />
        <MenuUnfoldOutlined v-else />
      </a-button>

      <!-- Environment Badge -->
      <a-tag :color="environmentColor" class="env-badge">
        {{ environmentLabel }}
      </a-tag>
    </div>

    <!-- Right: Actions -->
    <div class="top-bar-right">
      <!-- Global Search -->
      <a-tooltip :title="t('common.search') + ' (Cmd/Ctrl + K)'">
        <a-button type="text" class="action-btn" @click="openGlobalSearch">
          <SearchOutlined />
        </a-button>
      </a-tooltip>

      <!-- Language Switcher -->
      <a-dropdown>
        <a-button type="text" class="action-btn">
          <GlobalOutlined />
          <span class="action-text">{{ currentLocaleLabel }}</span>
        </a-button>
        <template #overlay>
          <a-menu @click="handleLocaleChange">
            <a-menu-item
              v-for="locale in availableLocales"
              :key="locale.value"
              :class="{ 'ant-menu-item-selected': locale.value === appStore.locale }"
            >
              {{ locale.label }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <!-- Theme Switcher -->
      <a-tooltip :title="themeTooltip">
        <a-button type="text" class="action-btn" @click="toggleTheme">
          <BulbOutlined v-if="appStore.theme === 'light'" />
          <BulbFilled v-else />
        </a-button>
      </a-tooltip>

      <!-- Notifications -->
      <a-badge :count="unreadCount" :offset="[-5, 5]">
        <a-button type="text" class="action-btn" @click="openNotifications">
          <BellOutlined />
        </a-button>
      </a-badge>

      <!-- Admin Profile -->
      <a-dropdown>
        <div class="admin-profile">
          <a-avatar :size="32" :src="authStore.user?.avatar">
            {{ authStore.user?.username?.charAt(0).toUpperCase() }}
          </a-avatar>
          <span class="admin-name">{{ authStore.user?.username }}</span>
          <DownOutlined class="dropdown-icon" />
        </div>
        <template #overlay>
          <a-menu @click="handleProfileMenuClick">
            <a-menu-item key="profile">
              <UserOutlined />
              <span>{{ t('common.view') }}</span>
            </a-menu-item>
            <a-menu-item key="settings">
              <SettingOutlined />
              <span>{{ t('settings.title') }}</span>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="logout">
              <LogoutOutlined />
              <span>{{ t('common.close') }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <!-- Global Search Modal -->
    <a-modal
      v-model:open="searchVisible"
      :title="t('common.search')"
      :footer="null"
      width="600px"
      @cancel="closeGlobalSearch"
    >
      <a-input
        v-model:value="searchQuery"
        :placeholder="t('common.search')"
        size="large"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <div v-if="searchResults.length > 0" class="search-results">
        <a-list :data-source="searchResults" size="small">
          <template #renderItem="{ item }">
            <a-list-item @click="navigateToResult(item)">
              <a-list-item-meta :title="item.title" :description="item.description" />
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useLocale } from '@/composables'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  GlobalOutlined,
  BulbOutlined,
  BulbFilled,
  BellOutlined,
  DownOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()
const { t } = useI18n()
const { availableLocales, currentLocaleOption, changeLocale } = useLocale()

// Environment
const environmentLabel = computed(() => {
  const env = appStore.environment
  return env === 'production' ? 'PROD' : env === 'staging' ? 'STAGE' : 'DEV'
})

const environmentColor = computed(() => {
  const env = appStore.environment
  return env === 'production' ? 'red' : env === 'staging' ? 'orange' : 'green'
})

// Locale
const currentLocaleLabel = computed(() => currentLocaleOption.value.label)

// Theme
const themeTooltip = computed(() => {
  return appStore.theme === 'light' ? t('settings.darkMode') : t('settings.lightMode')
})

// Notifications
const unreadCount = ref(0)

// Global Search
const searchVisible = ref(false)
const searchQuery = ref('')
const searchResults = ref<any[]>([])

// Functions
function toggleSidebar() {
  appStore.toggleSidebar()
}

function handleLocaleChange({ key }: { key: string }) {
  changeLocale(key)
  message.success(t('messages.operationSuccess'))
}

function toggleTheme() {
  const newTheme = appStore.theme === 'light' ? 'dark' : 'light'
  appStore.setTheme(newTheme)
  message.success(t('messages.operationSuccess'))
}

function openGlobalSearch() {
  searchVisible.value = true
  searchQuery.value = ''
  searchResults.value = []
}

function closeGlobalSearch() {
  searchVisible.value = false
}

function handleSearch() {
  // TODO: Implement actual search logic
  console.log('Searching for:', searchQuery.value)
  // Mock search results
  searchResults.value = [
    { title: 'Dashboard', description: 'Main dashboard page', path: '/admin/dashboard' },
    { title: 'KYC List', description: 'KYC applications', path: '/admin/kyc/list' },
  ]
}

function navigateToResult(item: any) {
  router.push(item.path)
  closeGlobalSearch()
}

function openNotifications() {
  message.info(t('common.info'))
}

function handleProfileMenuClick({ key }: { key: string }) {
  switch (key) {
    case 'profile':
      message.info(t('common.info'))
      break
    case 'settings':
      router.push('/admin/settings/general')
      break
    case 'logout':
      authStore.logout()
      router.push('/login')
      message.success(t('messages.operationSuccess'))
      break
  }
}

// Keyboard shortcut for global search
function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    openGlobalSearch()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.env-badge {
  font-weight: 600;
  font-size: 12px;
}

.action-btn {
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-text {
  font-size: 14px;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.admin-profile:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.admin-name {
  font-size: 14px;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.search-results {
  margin-top: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.search-results :deep(.ant-list-item) {
  cursor: pointer;
  padding: 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.search-results :deep(.ant-list-item:hover) {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
