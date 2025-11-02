import type { RouteRecordRaw } from 'vue-router'

export const monitoringRoutes: RouteRecordRaw[] = [
  {
    path: 'monitoring',
    name: 'Monitoring',
    redirect: '/admin/monitoring/transactions',
    meta: {
      title: 'Monitoring',
      icon: 'MonitorOutlined',
      permissions: ['monitoring.view'],
    },
    children: [
      {
        path: 'transactions',
        name: 'TransactionMonitoring',
        component: () => import('@/pages/monitoring/transactions/index.vue'),
        meta: {
          title: 'Transaction Monitoring',
          permissions: ['monitoring.transactions.view'],
        },
      },
    ],
  },
]
