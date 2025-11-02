// Vue Router Type Declarations
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // Page title
    title?: string
    // Icon name (Ant Design icon)
    icon?: string
    // Whether authentication is required (default: true)
    requiresAuth?: boolean
    // Required permissions (any or all based on permissionMode)
    permissions?: string | string[]
    // Permission check mode: 'any' (default) or 'all'
    permissionMode?: 'any' | 'all'
    // Required roles (any or all based on roleMode)
    roles?: string | string[]
    // Role check mode: 'any' (default) or 'all'
    roleMode?: 'any' | 'all'
    // Whether to keep the component alive (for caching)
    keepAlive?: boolean
    // Whether to hide in menu
    hidden?: boolean
    // Badge text or count to show in menu
    badge?: string | number
    // Order in menu (lower numbers appear first)
    order?: number
    // Whether this is an external link
    external?: boolean
    // External link URL
    externalUrl?: string
    // Breadcrumb configuration
    breadcrumb?: boolean
    // Active menu path (for highlighting parent menu)
    activeMenu?: string
  }
}
