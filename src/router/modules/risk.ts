import type { RouteRecordRaw } from 'vue-router'

export const riskRoutes: RouteRecordRaw[] = [
  {
    path: 'risk',
    name: 'Risk',
    component: () => import('@/pages/risk/index.vue'),
    meta: {
      title: 'Risk',
      icon: 'WarningOutlined',
      permissions: ['risk.view'],
      keepAlive: true,
    },
  },
]
