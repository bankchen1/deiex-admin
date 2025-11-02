import type { RouteRecordRaw } from 'vue-router'

export const strategyRoutes: RouteRecordRaw[] = [
  {
    path: 'strategies',
    redirect: '/admin/strategies/templates',
    meta: { title: 'Strategies', requiresAuth: true },
    children: [
      {
        path: 'templates',
        name: 'StrategyTemplates',
        component: () => import('@/pages/strategies/templates/index.vue'),
        meta: { title: 'Strategy Templates', requiresAuth: true },
      },
      {
        path: 'instances',
        name: 'StrategyInstances',
        component: () => import('@/pages/strategies/instances/index.vue'),
        meta: { title: 'Strategy Instances', requiresAuth: true },
      },
      {
        path: 'backtest',
        name: 'StrategyBacktest',
        component: () => import('@/pages/strategies/backtest/index.vue'),
        meta: { title: 'Strategy Backtest', requiresAuth: true },
      },
      {
        path: 'performance',
        name: 'StrategyPerformance',
        component: () => import('@/pages/strategies/performance/index.vue'),
        meta: { title: 'Strategy Performance', requiresAuth: true },
      },
      {
        path: 'monitoring',
        name: 'StrategyMonitoring',
        component: () => import('@/pages/strategies/monitoring/index.vue'),
        meta: { title: 'Strategy Monitoring', requiresAuth: true },
      },
    ],
  },
]
