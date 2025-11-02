import type { RouteRecordRaw } from 'vue-router'

export const kycRoutes: RouteRecordRaw[] = [
  {
    path: 'kyc',
    name: 'KYC',
    redirect: '/admin/kyc/list',
    meta: {
      title: 'KYC',
      icon: 'SafetyCertificateOutlined',
      permissions: ['kyc.view'],
    },
    children: [
      {
        path: 'list',
        name: 'KYCList',
        component: () => import('@/pages/kyc/index.vue'),
        meta: {
          title: 'KYC List',
          permissions: ['kyc.view'],
          keepAlive: true,
        },
      },
      {
        path: ':id',
        name: 'KYCDetail',
        component: () => import('@/pages/kyc/Detail.vue'),
        meta: {
          title: 'KYC Detail',
          permissions: ['kyc.view'],
          keepAlive: false,
        },
      },
    ],
  },
]
