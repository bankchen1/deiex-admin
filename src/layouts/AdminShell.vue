<template>
  <a-layout class="admin-shell">
    <!-- Sidebar -->
    <a-layout-sider
      v-model:collapsed="appStore.collapsed"
      :trigger="null"
      collapsible
      :width="240"
      class="admin-sider"
    >
      <div class="logo">
        <img v-if="!appStore.collapsed" src="/vite.svg" alt="DEIEX" class="logo-full" />
        <img v-else src="/vite.svg" alt="DEIEX" class="logo-mini" />
      </div>
      <SidebarNav :menu-items="filteredMenuItems" />
    </a-layout-sider>

    <!-- Main Content Area -->
    <a-layout>
      <!-- Top Bar -->
      <a-layout-header class="admin-header">
        <TopBar />
      </a-layout-header>

      <!-- Breadcrumb -->
      <div class="breadcrumb-container">
        <Breadcrumb />
      </div>

      <!-- Page Tabs (optional) -->
      <PageTabs v-if="enableTabs" />

      <!-- Content -->
      <a-layout-content class="admin-content">
        <router-view v-slot="{ Component }">
          <keep-alive :include="appStore.cachedViews">
            <component :is="Component" :key="$route.fullPath" />
          </keep-alive>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import SidebarNav from './components/SidebarNav.vue'
import TopBar from './components/TopBar.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import PageTabs from './components/PageTabs.vue'
import type { MenuItem } from './types'

const appStore = useAppStore()
const authStore = useAuthStore()
const { t } = useI18n()

// Enable page tabs (can be made configurable)
const enableTabs = computed(() => true)

// Menu items configuration
const menuItems = computed<MenuItem[]>(() => [
  {
    key: 'dashboard',
    path: '/admin/dashboard',
    title: t('nav.dashboard'),
    icon: 'DashboardOutlined',
    permissions: [],
  },
  {
    key: 'kyc',
    path: '/admin/kyc',
    title: t('nav.kyc'),
    icon: 'SafetyCertificateOutlined',
    permissions: ['kyc.view'],
    children: [
      {
        key: 'kyc-list',
        path: '/admin/kyc/list',
        title: t('kyc.list'),
        permissions: ['kyc.view'],
      },
    ],
  },
  {
    key: 'users',
    path: '/admin/users',
    title: t('nav.users'),
    icon: 'UserOutlined',
    permissions: ['users.view'],
    children: [
      {
        key: 'users-list',
        path: '/admin/users/list',
        title: t('users.list'),
        permissions: ['users.view'],
      },
    ],
  },
  {
    key: 'assets',
    path: '/admin/assets',
    title: t('nav.assets'),
    icon: 'WalletOutlined',
    permissions: ['assets.view'],
    children: [
      {
        key: 'deposits',
        path: '/admin/assets/deposits',
        title: t('assets.deposits'),
        permissions: ['assets.deposits.view'],
      },
      {
        key: 'withdrawals',
        path: '/admin/assets/withdrawals',
        title: t('assets.withdrawals'),
        permissions: ['assets.withdrawals.view'],
      },
    ],
  },
  {
    key: 'orders',
    path: '/admin/orders',
    title: t('nav.orders'),
    icon: 'TransactionOutlined',
    permissions: ['orders.view'],
    children: [
      {
        key: 'spot-orders',
        path: '/admin/orders/spot',
        title: t('orders.spotOrders'),
        permissions: ['orders.spot.view'],
      },
      {
        key: 'futures-orders',
        path: '/admin/orders/futures',
        title: t('orders.futuresOrders'),
        permissions: ['orders.futures.view'],
      },
      {
        key: 'positions',
        path: '/admin/orders/positions',
        title: t('orders.positions'),
        permissions: ['orders.positions.view'],
      },
    ],
  },
  {
    key: 'config',
    path: '/admin/config',
    title: t('nav.config'),
    icon: 'SettingOutlined',
    permissions: ['config.view'],
    children: [
      {
        key: 'instruments',
        path: '/admin/config/instruments',
        title: t('config.instruments'),
        permissions: ['config.instruments.view'],
      },
      {
        key: 'margin',
        path: '/admin/config/margin',
        title: t('config.margin'),
        permissions: ['config.margin.view'],
      },
      {
        key: 'fees',
        path: '/admin/config/fees',
        title: t('config.fees'),
        permissions: ['config.fees.view'],
      },
      {
        key: 'calendar',
        path: '/admin/config/calendar',
        title: t('config.calendar'),
        permissions: ['config.calendar.view'],
      },
      {
        key: 'icons',
        path: '/admin/config/icons',
        title: t('config.icons'),
        permissions: ['config.icons.view'],
      },
      {
        key: 'mappings',
        path: '/admin/config/mappings',
        title: t('config.mappings'),
        permissions: ['config.mappings.view'],
      },
      {
        key: 'security',
        path: '/admin/config/security',
        title: t('config.security'),
        permissions: ['config.security.view'],
      },
    ],
  },
  {
    key: 'risk',
    path: '/admin/risk',
    title: t('nav.risk'),
    icon: 'WarningOutlined',
    permissions: ['risk.view'],
    children: [
      {
        key: 'risk-rules',
        path: '/admin/risk/rules',
        title: t('risk.rules'),
        permissions: ['risk.rules.view'],
      },
      {
        key: 'risk-limits',
        path: '/admin/risk/limits',
        title: t('risk.limits'),
        permissions: ['risk.limits.view'],
      },
      {
        key: 'blacklist',
        path: '/admin/risk/blacklist',
        title: t('risk.blacklist'),
        permissions: ['risk.blacklist.view'],
      },
    ],
  },
  {
    key: 'ops',
    path: '/admin/ops',
    title: t('nav.ops'),
    icon: 'ToolOutlined',
    permissions: ['ops.view'],
    children: [
      {
        key: 'logs',
        path: '/admin/ops/logs',
        title: t('ops.logs'),
        permissions: ['ops.logs.view'],
      },
      {
        key: 'tasks',
        path: '/admin/ops/tasks',
        title: t('ops.tasks'),
        permissions: ['ops.tasks.view'],
      },
    ],
  },
  {
    key: 'reports',
    path: '/admin/reports',
    title: t('nav.reports'),
    icon: 'BarChartOutlined',
    permissions: ['reports.view'],
    children: [
      {
        key: 'trade-reports',
        path: '/admin/reports/trade',
        title: t('reports.trade'),
        permissions: ['reports.trade.view'],
      },
      {
        key: 'finance-reports',
        path: '/admin/reports/finance',
        title: t('reports.finance'),
        permissions: ['reports.finance.view'],
      },
      {
        key: 'retention-reports',
        path: '/admin/reports/retention',
        title: t('reports.retention'),
        permissions: ['reports.retention.view'],
      },
    ],
  },
  {
    key: 'settings',
    path: '/admin/settings',
    title: t('nav.settings'),
    icon: 'ControlOutlined',
    permissions: ['settings.view'],
    children: [
      {
        key: 'general',
        path: '/admin/settings/general',
        title: t('settings.general'),
        permissions: ['settings.general.view'],
      },
      {
        key: 'theme',
        path: '/admin/settings/theme',
        title: t('settings.theme'),
        permissions: ['settings.theme.view'],
      },
      {
        key: 'i18n',
        path: '/admin/settings/i18n',
        title: t('settings.i18n'),
        permissions: ['settings.i18n.view'],
      },
    ],
  },
  {
    key: 'examples',
    path: '/admin/examples',
    title: 'Examples',
    icon: 'ExperimentOutlined',
    permissions: [],
    children: [
      {
        key: 'rbac-guard',
        path: '/admin/examples/rbac-guard',
        title: 'RBAC Guard Demo',
        permissions: [],
      },
      {
        key: 'schema-form',
        path: '/admin/examples/schema-form',
        title: 'Schema Form Demo',
        permissions: [],
      },
      {
        key: 'server-table',
        path: '/admin/examples/server-table',
        title: 'Server Table Demo',
        permissions: [],
      },
      {
        key: 'version-control',
        path: '/admin/examples/version-control',
        title: 'Version Control Demo',
        permissions: [],
      },
      {
        key: 'specialized-inputs',
        path: '/admin/examples/specialized-inputs',
        title: 'Specialized Inputs Demo',
        permissions: [],
      },
    ],
  },
])

// Filter menu items based on permissions
const filteredMenuItems = computed(() => {
  return filterMenuByPermissions(menuItems.value, authStore.permissions)
})

function filterMenuByPermissions(items: MenuItem[], permissions: Set<string>): MenuItem[] {
  return items
    .filter((item) => {
      // If no permissions required, show the item
      if (!item.permissions || item.permissions.length === 0) return true
      // Check if user has any of the required permissions
      return item.permissions.some((perm) => permissions.has(perm) || permissions.has('*'))
    })
    .map((item) => {
      // Recursively filter children
      if (item.children) {
        return {
          ...item,
          children: filterMenuByPermissions(item.children, permissions),
        }
      }
      return item
    })
    .filter((item) => {
      // Remove parent items with no children
      if (item.children) {
        return item.children.length > 0
      }
      return true
    })
}
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
}

.admin-sider {
  background: #001529;
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
}

.logo-full {
  height: 32px;
}

.logo-mini {
  height: 32px;
  width: 32px;
}

.admin-header {
  background: #fff;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: sticky;
  top: 0;
  z-index: 10;
}

.breadcrumb-container {
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.admin-content {
  margin: 24px;
  padding: 24px;
  background: #fff;
  min-height: calc(100vh - 200px);
}

/* Adjust layout when sidebar is collapsed */
.admin-shell :deep(.ant-layout) {
  margin-left: 240px;
  transition: margin-left 0.2s;
}

.admin-shell :deep(.ant-layout-sider-collapsed) ~ .ant-layout {
  margin-left: 80px;
}
</style>
