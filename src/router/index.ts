// Router Setup
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { setupRouterGuards } from './guards/rbac'

// Import modular routes
import { dashboardRoutes } from './modules/dashboard'
import { kycRoutes } from './modules/kyc'
import { usersRoutes } from './modules/users'
import { assetsRoutes } from './modules/assets'
import { ordersRoutes } from './modules/orders'
import { marketRoutes } from './modules/market'
import { strategyRoutes } from './modules/strategies'
import { analyticsRoutes } from './modules/analytics'
import { configRoutes } from './modules/config'
import { riskRoutes } from './modules/risk'
import { complianceRoutes } from './modules/compliance'
import { monitoringRoutes } from './modules/monitoring'
import { contentRoutes } from './modules/content'
import { opsRoutes } from './modules/ops'
import { reportsRoutes } from './modules/reports'
import { settingsRoutes } from './modules/settings'
import { examplesRoutes } from './modules/examples'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/admin/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/layouts/AdminShell.vue'),
    meta: { requiresAuth: true },
    children: [
      ...dashboardRoutes,
      ...kycRoutes,
      ...usersRoutes,
      ...assetsRoutes,
      ...ordersRoutes,
      ...marketRoutes,
      ...strategyRoutes,
      ...analyticsRoutes,
      ...configRoutes,
      ...riskRoutes,
      ...complianceRoutes,
      ...monitoringRoutes,
      ...contentRoutes,
      ...opsRoutes,
      ...reportsRoutes,
      ...settingsRoutes,
      ...examplesRoutes,
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/error/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Setup route guards
setupRouterGuards(router)

export default router
