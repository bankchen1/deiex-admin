// RBAC Route Guard
import type { Router } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Restore session on first load
    if (!authStore.isAuthenticated && !authStore.loading) {
      authStore.restoreSession()
    }

    // Check authentication requirement
    const requiresAuth = to.meta.requiresAuth !== false // Default to true

    if (requiresAuth && !authStore.isAuthenticated) {
      // Redirect to login with return URL
      next({
        name: 'Login',
        query: { redirect: to.fullPath },
      })
      return
    }

    // Skip permission check for non-authenticated routes
    if (!requiresAuth) {
      next()
      return
    }

    // Check permissions if specified
    if (to.meta.permissions) {
      const permissions = Array.isArray(to.meta.permissions)
        ? to.meta.permissions
        : [to.meta.permissions]

      const permissionMode = (to.meta.permissionMode as string) || 'any'
      const hasPermission =
        permissionMode === 'all'
          ? authStore.checkAllPermissions(permissions)
          : authStore.checkAnyPermission(permissions)

      if (!hasPermission) {
        message.error('You do not have permission to access this page')
        // Redirect to dashboard or previous page
        if (from.name) {
          next(false) // Stay on current page
        } else {
          next({ name: 'Dashboard' })
        }
        return
      }
    }

    // Check roles if specified
    if (to.meta.roles) {
      const roles = Array.isArray(to.meta.roles) ? to.meta.roles : [to.meta.roles]
      const userRoles = authStore.userRoles

      const roleMode = (to.meta.roleMode as string) || 'any'
      const hasRole =
        roleMode === 'all'
          ? roles.every((role) => userRoles.includes(role))
          : roles.some((role) => userRoles.includes(role))

      if (!hasRole && !userRoles.includes('super_admin')) {
        message.error('You do not have the required role to access this page')
        if (from.name) {
          next(false)
        } else {
          next({ name: 'Dashboard' })
        }
        return
      }
    }

    next()
  })

  router.afterEach((to) => {
    // Update page title
    const title = to.meta.title as string
    document.title = title ? `${title} - DEIEX Admin` : 'DEIEX Admin'

    // Add to visited views if it has a title
    if (title && to.path.startsWith('/admin/')) {
      const appStore = useAppStore()
      appStore.addVisitedView({
        name: to.name as string,
        path: to.path,
        title: title,
        closable: to.path !== '/admin/dashboard', // Dashboard is not closable
      })

      // Add to cached views if keepAlive is enabled
      if (to.meta.keepAlive && to.name) {
        appStore.addCachedView(to.name as string)
      }
    }

    // Track page view for analytics (if needed)
    if (import.meta.env.PROD) {
      // Example: analytics.trackPageView(to.path)
    }
  })

  // Global error handler
  router.onError((error) => {
    console.error('Router error:', error)
    message.error('Navigation failed. Please try again.')
  })
}
