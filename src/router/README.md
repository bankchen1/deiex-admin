# Router Configuration

This directory contains the Vue Router configuration for the DEIEX Admin application.

## Structure

```
router/
├── index.ts              # Main router instance and configuration
├── guards/               # Route guards
│   └── rbac.ts          # RBAC (Role-Based Access Control) guard
└── modules/             # Modular route definitions
    ├── dashboard.ts
    ├── kyc.ts
    ├── users.ts
    ├── assets.ts
    ├── orders.ts
    ├── config.ts
    ├── risk.ts
    ├── ops.ts
    ├── reports.ts
    ├── settings.ts
    └── examples.ts
```

## Features

### 1. History Mode
The router uses HTML5 history mode for clean URLs without hash fragments.

### 2. Modular Routes
Routes are organized by functional area in separate module files for better maintainability.

### 3. Route Guards
- **Authentication Guard**: Checks if user is authenticated before accessing protected routes
- **Permission Guard**: Validates user permissions against route requirements
- **Role Guard**: Validates user roles against route requirements

### 4. Route Meta Configuration
Each route can have the following meta properties:

```typescript
interface RouteMeta {
  title?: string                    // Page title
  icon?: string                     // Icon name (Ant Design icon)
  requiresAuth?: boolean            // Whether authentication is required (default: true)
  permissions?: string | string[]   // Required permissions
  permissionMode?: 'any' | 'all'    // Permission check mode (default: 'any')
  roles?: string | string[]         // Required roles
  roleMode?: 'any' | 'all'          // Role check mode (default: 'any')
  keepAlive?: boolean               // Whether to cache the component
  hidden?: boolean                  // Whether to hide in menu
  badge?: string | number           // Badge to show in menu
  order?: number                    // Order in menu
  external?: boolean                // Whether this is an external link
  externalUrl?: string              // External link URL
  breadcrumb?: boolean              // Whether to show in breadcrumb
  activeMenu?: string               // Active menu path for highlighting
}
```

## Usage

### Creating a New Route Module

1. Create a new file in `router/modules/`:

```typescript
// router/modules/example.ts
import type { RouteRecordRaw } from 'vue-router'

export const exampleRoutes: RouteRecordRaw[] = [
  {
    path: 'example',
    name: 'Example',
    redirect: '/admin/example/list',
    meta: {
      title: 'Example',
      icon: 'AppstoreOutlined',
      permissions: ['example.view'],
    },
    children: [
      {
        path: 'list',
        name: 'ExampleList',
        component: () => import('@/pages/example/List.vue'),
        meta: {
          title: 'Example List',
          permissions: ['example.view'],
          keepAlive: true,
        },
      },
      {
        path: ':id',
        name: 'ExampleDetail',
        component: () => import('@/pages/example/Detail.vue'),
        meta: {
          title: 'Example Detail',
          permissions: ['example.view'],
          keepAlive: false,
        },
      },
    ],
  },
]
```

2. Import and add to main router in `router/index.ts`:

```typescript
import { exampleRoutes } from './modules/example'

// Add to children array
children: [
  ...dashboardRoutes,
  ...exampleRoutes,  // Add here
  // ... other routes
]
```

### Permission Modes

#### Any Permission (default)
User needs at least one of the specified permissions:

```typescript
meta: {
  permissions: ['kyc.view', 'kyc.review'],
  permissionMode: 'any'  // User needs kyc.view OR kyc.review
}
```

#### All Permissions
User needs all specified permissions:

```typescript
meta: {
  permissions: ['kyc.view', 'kyc.approve'],
  permissionMode: 'all'  // User needs kyc.view AND kyc.approve
}
```

### Role-Based Access

Similar to permissions, you can specify required roles:

```typescript
meta: {
  roles: ['admin', 'super_admin'],
  roleMode: 'any'  // User needs admin OR super_admin role
}
```

### Keep-Alive (Component Caching)

Enable component caching to preserve state when navigating away:

```typescript
meta: {
  keepAlive: true  // Component will be cached
}
```

Cached components are managed by the `useAppStore`:
- Added to cache when route is visited
- Removed from cache when tab is closed

### Public Routes

To create a route that doesn't require authentication:

```typescript
{
  path: '/public-page',
  name: 'PublicPage',
  component: () => import('@/pages/PublicPage.vue'),
  meta: {
    requiresAuth: false  // No authentication required
  }
}
```

## Route Guards

### RBAC Guard (`guards/rbac.ts`)

The RBAC guard performs the following checks in order:

1. **Session Restoration**: Restores user session from localStorage on first load
2. **Authentication Check**: Redirects to login if authentication is required and user is not authenticated
3. **Permission Check**: Validates user has required permissions (if specified)
4. **Role Check**: Validates user has required roles (if specified)

### After Navigation

After each navigation, the guard:
- Updates the page title
- Adds the page to visited views (page tabs)
- Adds the component to cached views (if keepAlive is enabled)
- Tracks page views for analytics (in production)

## Best Practices

1. **Organize by Feature**: Keep related routes in the same module file
2. **Use Lazy Loading**: Always use dynamic imports for route components
3. **Set Appropriate Permissions**: Define granular permissions for each route
4. **Enable Keep-Alive Wisely**: Only enable for list/index pages, not detail pages
5. **Provide Meaningful Titles**: Set clear, descriptive titles for all routes
6. **Use Icons Consistently**: Use Ant Design icons for menu items
7. **Handle Redirects**: Set appropriate redirect paths for parent routes

## Examples

### Simple Route
```typescript
{
  path: 'dashboard',
  name: 'Dashboard',
  component: () => import('@/pages/dashboard/index.vue'),
  meta: {
    title: 'Dashboard',
    icon: 'DashboardOutlined',
    keepAlive: true,
  },
}
```

### Route with Permissions
```typescript
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
      component: () => import('@/pages/kyc/List.vue'),
      meta: {
        title: 'KYC List',
        permissions: ['kyc.view'],
        keepAlive: true,
      },
    },
  ],
}
```

### Route with Multiple Permissions (All Required)
```typescript
{
  path: 'sensitive-data',
  name: 'SensitiveData',
  component: () => import('@/pages/SensitiveData.vue'),
  meta: {
    title: 'Sensitive Data',
    permissions: ['data.view', 'data.sensitive'],
    permissionMode: 'all',  // User must have both permissions
  },
}
```

## Troubleshooting

### Route Not Showing in Menu
- Check if `hidden: true` is set in meta
- Verify user has required permissions
- Ensure route is properly imported in `router/index.ts`

### Permission Denied Error
- Verify user has the required permissions in their profile
- Check if `permissionMode` is set correctly ('any' vs 'all')
- Ensure permissions are properly defined in the backend

### Component Not Cached
- Verify `keepAlive: true` is set in route meta
- Check that component has a `name` property
- Ensure component is not being force-refreshed

### Redirect Loop
- Check for circular redirects in route configuration
- Verify authentication state is properly initialized
- Ensure default redirect paths are valid
