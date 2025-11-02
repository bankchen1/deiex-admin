import type { RouteRecordRaw } from 'vue-router'

export const ordersRoutes: RouteRecordRaw[] = [
  {
    path: 'orders',
    name: 'Orders',
    redirect: '/admin/orders/spot',
    meta: {
      title: 'Orders',
      icon: 'TransactionOutlined',
      permissions: ['orders.view'],
    },
    children: [
      {
        path: 'spot',
        name: 'SpotOrders',
        component: () => import('@/pages/orders/SpotOrders.vue'),
        meta: {
          title: 'Spot Orders',
          permissions: ['orders.spot.view'],
          keepAlive: true,
        },
      },
      {
        path: 'futures',
        name: 'FuturesOrders',
        component: () => import('@/pages/orders/FuturesOrders.vue'),
        meta: {
          title: 'Futures Orders',
          permissions: ['orders.futures.view'],
          keepAlive: true,
        },
      },
      {
        path: 'positions',
        name: 'Positions',
        component: () => import('@/pages/orders/Positions.vue'),
        meta: {
          title: 'Positions',
          permissions: ['orders.positions.view'],
          keepAlive: true,
        },
      },
      {
        path: 'liquidations',
        name: 'Liquidations',
        component: () => import('@/pages/orders/Liquidations.vue'),
        meta: {
          title: 'Liquidations',
          permissions: ['orders.liquidations.view'],
          keepAlive: true,
        },
      },
      {
        path: 'copy-trading',
        name: 'CopyTrading',
        component: () => import('@/pages/orders/CopyTrading.vue'),
        meta: {
          title: 'Copy Trading',
          permissions: ['orders.copy-trading.view'],
          keepAlive: true,
        },
      },
    ],
  },
]
