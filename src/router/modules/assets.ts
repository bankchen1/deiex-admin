import type { RouteRecordRaw } from 'vue-router'

export const assetsRoutes: RouteRecordRaw[] = [
  {
    path: 'assets',
    name: 'Assets',
    redirect: '/admin/assets/overview',
    meta: {
      title: 'Assets',
      icon: 'WalletOutlined',
      permissions: ['assets.view'],
    },
    children: [
      {
        path: 'overview',
        name: 'AssetsOverview',
        component: () => import('@/pages/assets/Overview.vue'),
        meta: {
          title: 'Overview',
          permissions: ['assets.view'],
          keepAlive: true,
        },
      },
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
        component: () => import('@/views/assets/WalletsView.vue'),
        meta: {
          title: 'Wallets',
          permissions: ['assets.wallets.view'],
          keepAlive: true,
        },
      },
    ],
  },
]
