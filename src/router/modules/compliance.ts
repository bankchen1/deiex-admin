import type { RouteRecordRaw } from 'vue-router'

export const complianceRoutes: RouteRecordRaw[] = [
  {
    path: 'compliance',
    name: 'Compliance',
    redirect: '/admin/compliance/audit',
    meta: {
      title: 'Compliance',
      icon: 'SafetyCertificateOutlined',
      permissions: ['compliance.view'],
    },
    children: [
      {
        path: 'audit',
        name: 'ComplianceAudit',
        component: () => import('@/pages/compliance/audit/index.vue'),
        meta: {
          title: 'Audit Trail',
          permissions: ['compliance.audit.view'],
        },
      },
    ],
  },
]
