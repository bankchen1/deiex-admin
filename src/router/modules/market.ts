import type { RouteRecordRaw } from 'vue-router'

export const marketRoutes: RouteRecordRaw[] = [
  {
    path: 'market',
    name: 'Market',
    redirect: '/admin/market/data',
    meta: {
      title: 'Market',
      icon: 'StockOutlined',
      permissions: ['market.view'],
    },
    children: [
      {
        path: 'data',
        name: 'MarketData',
        component: () => import('@/pages/market/data/index.vue'),
        meta: {
          title: 'Market Data',
          permissions: ['market.data.view'],
        },
      },
      {
        path: 'charts',
        name: 'MarketCharts',
        component: () => import('@/pages/market/charts/index.vue'),
        meta: {
          title: 'Market Charts',
          permissions: ['market.charts.view'],
        },
      },
      {
        path: 'symbols',
        name: 'MarketSymbols',
        component: () => import('@/pages/market/symbols/index.vue'),
        meta: {
          title: 'Trading Symbols',
          permissions: ['market.symbols.view'],
        },
      },
      {
        path: 'indices',
        name: 'MarketIndices',
        component: () => import('@/pages/market/indices/index.vue'),
        meta: {
          title: 'Market Indices',
          permissions: ['market.indices.view'],
        },
      },
      {
        path: 'news',
        name: 'MarketNews',
        component: () => import('@/pages/market/news/index.vue'),
        meta: {
          title: 'Market News',
          permissions: ['market.news.view'],
        },
      },
      {
        path: 'analysis',
        name: 'MarketAnalysis',
        component: () => import('@/pages/market/analysis/index.vue'),
        meta: {
          title: 'Market Analysis',
          permissions: ['market.analysis.view'],
        },
      },
    ],
  },
]
