import type { RouteRecordRaw } from 'vue-router'

export const riskRoutes: RouteRecordRaw[] = [
  {
    path: 'risk',
    name: 'Risk',
    redirect: '/admin/risk/rules',
    meta: {
      title: 'Risk',
      icon: 'WarningOutlined',
      permissions: ['risk.view'],
    },
    children: [
      {
        path: 'rules',
        name: 'RiskRules',
        component: () => import('@/pages/risk/Rules.vue'),
        meta: {
          title: 'Risk Rules',
          permissions: ['risk.rules.view'],
          keepAlive: true,
        },
      },
      {
        path: 'limits',
        name: 'RiskLimits',
        component: () => import('@/pages/risk/Limits.vue'),
        meta: {
          title: 'Limits',
          permissions: ['risk.limits.view'],
          keepAlive: true,
        },
      },
      {
        path: 'blacklist',
        name: 'Blacklist',
        component: () => import('@/pages/risk/Blacklist.vue'),
        meta: {
          title: 'Blacklist',
          permissions: ['risk.blacklist.view'],
          keepAlive: true,
        },
      },
    ],
  },
]
