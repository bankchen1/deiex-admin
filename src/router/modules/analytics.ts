import type { RouteRecordRaw } from 'vue-router'

export const analyticsRoutes: RouteRecordRaw[] = [
  {
    path: 'analytics',
    name: 'Analytics',
    redirect: '/admin/analytics/trading',
    meta: {
      title: 'Analytics',
      icon: 'BarChartOutlined',
      permissions: ['analytics.view'],
    },
    children: [
      {
        path: 'trading',
        name: 'TradingAnalytics',
        component: () => import('@/pages/analytics/trading/index.vue'),
        meta: {
          title: 'Trading Analytics',
          permissions: ['analytics.trading.view'],
        },
      },
      {
        path: 'users',
        name: 'UserAnalytics',
        component: () => import('@/pages/analytics/users/index.vue'),
        meta: {
          title: 'User Analytics',
          permissions: ['analytics.users.view'],
        },
      },
      {
        path: 'revenue',
        name: 'RevenueAnalytics',
        component: () => import('@/pages/analytics/revenue/index.vue'),
        meta: {
          title: 'Revenue Analytics',
          permissions: ['analytics.revenue.view'],
        },
      },
      {
        path: 'user-behavior',
        name: 'UserBehaviorAnalytics',
        component: () => import('@/pages/analytics/user-behavior/index.vue'),
        meta: {
          title: 'User Behavior',
          permissions: ['analytics.user-behavior.view'],
        },
      },
    ],
  },
]
