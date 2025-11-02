import type { RouteRecordRaw } from 'vue-router'

export const reportsRoutes: RouteRecordRaw[] = [
  {
    path: 'reports',
    name: 'Reports',
    redirect: '/admin/reports/trade',
    meta: {
      title: 'Reports',
      icon: 'BarChartOutlined',
      permissions: ['reports.view'],
    },
    children: [
      {
        path: 'trade',
        name: 'ReportsTrade',
        component: () => import('@/pages/reports/Trade.vue'),
        meta: {
          title: 'Trade Reports',
          permissions: ['reports.trade.view'],
          keepAlive: true,
        },
      },
      {
        path: 'finance',
        name: 'ReportsFinance',
        component: () => import('@/pages/reports/Finance.vue'),
        meta: {
          title: 'Finance Reports',
          permissions: ['reports.finance.view'],
          keepAlive: true,
        },
      },
      {
        path: 'retention',
        name: 'ReportsRetention',
        component: () => import('@/pages/reports/Retention.vue'),
        meta: {
          title: 'Retention Reports',
          permissions: ['reports.retention.view'],
          keepAlive: true,
        },
      },
    ],
  },
]
