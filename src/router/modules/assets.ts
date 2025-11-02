import type { RouteRecordRaw } from 'vue-router'

export const assetsRoutes: RouteRecordRaw[] = [
  {
    path: 'assets',
    name: 'Assets',
    redirect: '/admin/assets/deposits',
    meta: {
      title: 'Assets',
      icon: 'WalletOutlined',
      permissions: ['assets.view'],
    },
    children: [
      {
        path: 'deposits',
        name: 'Deposits',
        component: () => import('@/pages/assets/Deposits.vue'),
        meta: {
          title: 'Deposits',
          permissions: ['assets.deposits.view'],
          keepAlive: true,
        },
      },
      {
        path: 'withdrawals',
        name: 'Withdrawals',
        component: () => import('@/pages/assets/Withdrawals.vue'),
        meta: {
          title: 'Withdrawals',
          permissions: ['assets.withdrawals.view'],
          keepAlive: true,
        },
      },
      {
        path: 'wallets',
        name: 'Wallets',
        component: () => import('@/pages/assets/Wallets.vue'),
        meta: {
          title: 'Wallets',
          permissions: ['assets.wallets.view'],
          keepAlive: true,
        },
      },
    ],
  },
]
