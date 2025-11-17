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
        key: 'assets-overview',
        path: '/admin/assets/overview',
        title: t('assets.overview'),
        permissions: ['assets.view'],
      },
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
      {
        key: 'wallets',
        path: '/admin/assets/wallets',
        title: t('assets.wallets'),
        permissions: ['assets.wallets.view'],
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
      {
        key: 'liquidations',
        path: '/admin/orders/liquidations',
        title: t('orders.liquidations'),
        permissions: ['orders.liquidations.view'],
      },
      {
        key: 'copy-trading',
        path: '/admin/orders/copy-trading',
        title: t('orders.copyTrading'),
        permissions: ['orders.copy-trading.view'],
      },
    ],
  },
  {
    key: 'market',
    path: '/admin/market',
    title: t('nav.market'),
    icon: 'StockOutlined',
    permissions: ['market.view'],
    children: [
      {
        key: 'market-data',
        path: '/admin/market/data',
        title: t('market.data'),
        permissions: ['market.data.view'],
      },
      {
        key: 'market-charts',
        path: '/admin/market/charts',
        title: t('market.charts'),
        permissions: ['market.charts.view'],
      },
      {
        key: 'market-symbols',
        path: '/admin/market/symbols',
        title: t('market.symbols'),
        permissions: ['market.symbols.view'],
      },
      {
        key: 'market-indices',
        path: '/admin/market/indices',
        title: t('market.indices'),
        permissions: ['market.indices.view'],
      },
      {
        key: 'market-news',
        path: '/admin/market/news',
        title: t('market.news'),
        permissions: ['market.news.view'],
      },
      {
        key: 'market-analysis',
        path: '/admin/market/analysis',
        title: t('market.analysis'),
        permissions: ['market.analysis.view'],
      },
    ],
  },
  {
    key: 'strategies',
    path: '/admin/strategies',
    title: t('nav.strategies'),
    icon: 'FundOutlined',
    permissions: ['strategies.view'],
    children: [
      {
        key: 'strategy-templates',
        path: '/admin/strategies/templates',
        title: t('strategies.templates'),
        permissions: ['strategies.templates.view'],
      },
      {
        key: 'strategy-instances',
        path: '/admin/strategies/instances',
        title: t('strategies.instances'),
        permissions: ['strategies.instances.view'],
      },
      {
        key: 'strategy-backtest',
        path: '/admin/strategies/backtest',
        title: t('strategies.backtest'),
        permissions: ['strategies.backtest.view'],
      },
      {
        key: 'strategy-performance',
        path: '/admin/strategies/performance',
        title: t('strategies.performance'),
        permissions: ['strategies.performance.view'],
      },
      {
        key: 'strategy-monitoring',
        path: '/admin/strategies/monitoring',
        title: t('strategies.monitoring'),
        permissions: ['strategies.monitoring.view'],
      },
    ],
  },
  {
    key: 'analytics',
    path: '/admin/analytics',
    title: t('nav.analytics'),
    icon: 'LineChartOutlined',
    permissions: ['analytics.view'],
    children: [
      {
        key: 'trading-analytics',
        path: '/admin/analytics/trading',
        title: t('analytics.trading'),
        permissions: ['analytics.trading.view'],
      },
      {
        key: 'user-analytics',
        path: '/admin/analytics/users',
        title: t('analytics.users'),
        permissions: ['analytics.users.view'],
      },
      {
        key: 'revenue-analytics',
        path: '/admin/analytics/revenue',
        title: t('analytics.revenue'),
        permissions: ['analytics.revenue.view'],
      },
      {
        key: 'user-behavior-analytics',
        path: '/admin/analytics/user-behavior',
        title: t('analytics.userBehavior'),
        permissions: ['analytics.user-behavior.view'],
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
  },
  {
    key: 'compliance',
    path: '/admin/compliance',
    title: t('nav.compliance'),
    icon: 'AuditOutlined',
    permissions: ['compliance.view'],
    children: [
      {
        key: 'compliance-audit',
        path: '/admin/compliance/audit',
        title: t('compliance.audit'),
        permissions: ['compliance.audit.view'],
      },
    ],
  },
  {
    key: 'monitoring',
    path: '/admin/monitoring',
    title: t('nav.monitoring'),
    icon: 'MonitorOutlined',
    permissions: ['monitoring.view'],
    children: [
      {
        key: 'transaction-monitoring',
        path: '/admin/monitoring/transactions',
        title: t('monitoring.transactions'),
        permissions: ['monitoring.transactions.view'],
      },
    ],
  },
  {
    key: 'content',
    path: '/admin/content',
    title: t('nav.content'),
    icon: 'ReadOutlined',
    permissions: ['content.view'],
    children: [
      {
        key: 'blog',
        path: '/admin/content/blog',
        title: t('content.blog'),
        permissions: ['content.blog.view'],
      },
      {
        key: 'notifications',
        path: '/admin/content/notifications',
        title: t('content.notifications'),
        permissions: ['content.notifications.view'],
      },
      {
        key: 'announcements',
        path: '/admin/content/announcements',
        title: t('content.announcements'),
        permissions: ['content.announcements.view'],
      },
      {
        key: 'email-marketing',
        path: '/admin/content/email-marketing',
        title: t('content.emailMarketing'),
        permissions: ['content.email.view'],
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
