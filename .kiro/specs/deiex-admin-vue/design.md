# Design Document

## Overview

DEIEX Admin (admin-vue) is a comprehensive Vue 3-based administration system for cryptocurrency exchange management. The system follows a layered architecture with clear separation of concerns: Layout → Page → Section → Widget/Form/Table → Shared Components. The design emphasizes reusability, type safety, and maintainability through TypeScript, modular routing, centralized state management with Pinia, and a unified API client.

### Key Design Principles

1. **Layered Architecture**: Clear separation between layout, page orchestration, business sections, and reusable widgets
2. **Version Control First**: All configuration modules support draft/publish/rollback workflows
3. **RBAC Everywhere**: Permission checks at route, page, section, and button levels
4. **Audit Trail**: Comprehensive logging of all critical operations
5. **Unified Components**: Shared components for tables, forms, modals, and data visualization
6. **Type Safety**: Full TypeScript coverage with strict mode enabled
7. **Performance**: Code splitting, lazy loading, and optimized bundle sizes


## Architecture

### Technology Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Language**: TypeScript 5.x (strict mode)
- **Build Tool**: Vite 5.x
- **State Management**: Pinia 2.x
- **Routing**: Vue Router 4.x
- **UI Library**: Ant Design Vue 4.x (primary choice)
- **HTTP Client**: Axios 1.x
- **Charts**: Apache ECharts 5.x
- **Date Handling**: Day.js
- **Form Validation**: Async-validator
- **Code Quality**: ESLint + Prettier + Husky

### Directory Structure

```
admin-vue/
├── src/
│   ├── layouts/              # Layout components
│   │   ├── AdminShell.vue    # Main admin layout
│   │   └── DocTwoCols.vue    # Documentation layout
│   ├── router/               # Route configuration
│   │   ├── index.ts          # Router instance
│   │   ├── guards/           # Route guards
│   │   │   └── rbac.ts       # RBAC guard
│   │   └── modules/          # Module routes
│   │       ├── dashboard.ts
│   │       ├── kyc.ts
│   │       ├── users.ts
│   │       ├── assets.ts
│   │       ├── orders.ts
│   │       ├── config.ts
│   │       ├── risk.ts
│   │       ├── ops.ts
│   │       ├── reports.ts
│   │       └── settings.ts
│   ├── pages/                # Page components (orchestration only)
│   │   ├── dashboard/
│   │   ├── kyc/
│   │   ├── users/
│   │   ├── assets/
│   │   ├── orders/
│   │   ├── config/
│   │   ├── risk/
│   │   ├── ops/
│   │   ├── reports/
│   │   └── settings/
│   ├── sections/             # Business logic sections
│   │   ├── dashboard/
│   │   ├── kyc/
│   │   ├── users/
│   │   └── ...
│   ├── widgets/              # Reusable widgets
│   │   ├── cards/
│   │   ├── charts/
│   │   ├── list/
│   │   ├── risk/
│   │   ├── timeline/
│   │   ├── diff/
│   │   ├── calc/
│   │   ├── status/
│   │   ├── time/
│   │   ├── calendar/
│   │   ├── graph/
│   │   ├── tree/
│   │   └── simulate/
│   ├── forms/                # Form components
│   │   ├── kyc/
│   │   ├── users/
│   │   ├── assets/
│   │   ├── instruments/
│   │   ├── margin/
│   │   ├── fees/
│   │   └── ...
│   ├── tables/               # Table components
│   │   ├── kyc/
│   │   ├── users/
│   │   ├── assets/
│   │   ├── orders/
│   │   ├── instruments/
│   │   └── ...
│   ├── modals/               # Modal and drawer components
│   │   ├── kyc/
│   │   ├── users/
│   │   ├── assets/
│   │   ├── orders/
│   │   ├── instruments/
│   │   ├── alerts/
│   │   └── diff/
│   ├── shared/               # Shared components
│   │   ├── RBACGuard.vue
│   │   ├── SchemaForm.vue
│   │   ├── IconPicker.vue
│   │   ├── VersionBar.vue
│   │   ├── SearchBar.vue
│   │   ├── ServerTable.vue
│   │   ├── ConfirmButton.vue
│   │   ├── EmptyState.vue
│   │   ├── Skeleton.vue
│   │   ├── ErrorBoundary.vue
│   │   ├── AuditTrail.vue
│   │   ├── DiffViewer.vue
│   │   ├── ImagePreview.vue
│   │   ├── DocumentViewer.vue
│   │   ├── TagPicker.vue
│   │   ├── ExportButton.vue
│   │   ├── RiskBadge.vue
│   │   ├── ImageUploader.vue
│   │   └── JsonEditor.vue
│   ├── stores/               # Pinia stores
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── app.ts
│   │   ├── dashboard.ts
│   │   ├── kyc.ts
│   │   ├── users.ts
│   │   ├── deposits.ts
│   │   ├── withdrawals.ts
│   │   ├── orders.ts
│   │   ├── instruments.ts
│   │   ├── margin.ts
│   │   ├── fees.ts
│   │   ├── calendar.ts
│   │   ├── icons.ts
│   │   ├── mappings.ts
│   │   ├── security.ts
│   │   ├── risk.ts
│   │   ├── logs.ts
│   │   ├── reports.ts
│   │   └── settings.ts
│   ├── services/             # API services
│   │   ├── api/
│   │   │   ├── AdminApiClient.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── kyc.ts
│   │   │   ├── users.ts
│   │   │   ├── assets.ts
│   │   │   ├── orders.ts
│   │   │   ├── config.instruments.ts
│   │   │   ├── config.margin.ts
│   │   │   ├── config.fees.ts
│   │   │   ├── config.calendar.ts
│   │   │   ├── config.icons.ts
│   │   │   ├── config.mappings.ts
│   │   │   ├── config.security.ts
│   │   │   ├── risk.ts
│   │   │   ├── ops.ts
│   │   │   ├── reports.ts
│   │   │   └── settings.ts
│   │   └── websocket/
│   │       └── AdminWebSocket.ts
│   ├── utils/                # Utility functions
│   │   ├── validation.ts
│   │   ├── format.ts
│   │   ├── download.ts
│   │   ├── upload.ts
│   │   ├── date.ts
│   │   ├── number.ts
│   │   ├── permission.ts
│   │   └── constants.ts
│   ├── types/                # TypeScript types
│   │   ├── api.ts
│   │   ├── models.ts
│   │   ├── store.ts
│   │   └── components.ts
│   ├── assets/               # Static assets
│   │   ├── styles/
│   │   ├── images/
│   │   └── icons/
│   ├── App.vue
│   └── main.ts
├── public/
├── .env.development
├── .env.production
├── .env.staging
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```


## Components and Interfaces

### Layout Layer

#### AdminShell.vue

The main layout component wrapping all admin pages.

**Structure:**
```vue
<template>
  <a-layout class="admin-shell">
    <a-layout-sider v-model:collapsed="collapsed">
      <SidebarNav :menu-items="filteredMenuItems" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header>
        <TopBar />
      </a-layout-header>
      <Breadcrumb />
      <PageTabs v-if="enableTabs" />
      <a-layout-content>
        <router-view v-slot="{ Component }">
          <keep-alive :include="cachedViews">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
```

**Features:**
- Collapsible sidebar with permission-filtered menu
- Environment indicator (prod/stage/dev)
- Global search
- Language/theme switcher
- Admin profile menu
- Breadcrumb navigation
- Optional page tabs (max 8, with overflow)
- Keep-alive for cached views

#### TopBar Component

**Props:**
```typescript
interface TopBarProps {
  environment: 'production' | 'staging' | 'development'
  adminUser: AdminUser
}
```

**Features:**
- Environment badge with color coding
- Global search with keyboard shortcut (Cmd/Ctrl + K)
- Language selector (i18n)
- Theme toggle (light/dark)
- Notification bell with unread count
- Admin avatar with dropdown menu


### Shared Components

#### RBACGuard.vue

Permission-based rendering guard.

```typescript
interface RBACGuardProps {
  permissions: string | string[]
  mode?: 'all' | 'any'  // all: require all permissions, any: require at least one
  fallback?: VNode | string
}
```

**Usage:**
```vue
<RBACGuard :permissions="['kyc.review', 'kyc.approve']" mode="any">
  <a-button>Approve KYC</a-button>
</RBACGuard>
```

#### SchemaForm.vue

Dynamic form generator based on JSON schema.

```typescript
interface SchemaFormProps {
  schema: FormSchema
  modelValue: Record<string, any>
  mode?: 'create' | 'edit' | 'view'
  enableDraft?: boolean
  enableDiff?: boolean
}

interface FormSchema {
  fields: FormField[]
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelWidth?: number
}

interface FormField {
  name: string
  label: string
  type: 'input' | 'select' | 'number' | 'date' | 'switch' | 'textarea' | 'json' | 'icon-picker'
  rules?: ValidationRule[]
  visible?: (values: Record<string, any>) => boolean
  disabled?: (values: Record<string, any>) => boolean
  options?: SelectOption[] | (() => Promise<SelectOption[]>)
  props?: Record<string, any>
}
```

#### ServerTable.vue

Unified table component with server-side pagination, sorting, and filtering.

```typescript
interface ServerTableProps {
  columns: TableColumn[]
  dataSource?: any[]
  loading?: boolean
  pagination?: PaginationConfig
  rowSelection?: RowSelectionConfig
  fetchData?: (params: TableParams) => Promise<TableResponse>
  enableExport?: boolean
  enableColumnConfig?: boolean
}

interface TableColumn {
  key: string
  title: string
  dataIndex: string
  width?: number
  fixed?: 'left' | 'right'
  sortable?: boolean
  filterable?: boolean
  filterType?: 'input' | 'select' | 'date-range'
  filterOptions?: SelectOption[]
  render?: (value: any, record: any, index: number) => VNode
}

interface TableParams {
  page: number
  pageSize: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
}

interface TableResponse {
  data: any[]
  total: number
}
```

#### VersionBar.vue

Version control bar for configuration modules.

```typescript
interface VersionBarProps {
  currentVersion: string
  draftExists: boolean
  versions: Version[]
  onPublish: () => Promise<void>
  onRollback: (versionId: string) => Promise<void>
  onViewDiff: () => void
}

interface Version {
  id: string
  version: string
  createdAt: string
  createdBy: string
  notes: string
  tags: string[]
}
```

#### DiffViewer.vue

Side-by-side diff viewer for configuration changes.

```typescript
interface DiffViewerProps {
  oldValue: any
  newValue: any
  format?: 'json' | 'text' | 'table'
  highlightChanges?: boolean
}
```


## Data Models

### Core Types

```typescript
// Admin User
interface AdminUser {
  id: string
  username: string
  email: string
  roles: string[]
  permissions: string[]
  avatar?: string
  lastLoginAt: string
  status: 'active' | 'disabled'
}

// KYC Application
interface KycApplication {
  id: string
  userId: string
  country: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  score: number
  matchedRules: string[]
  documents: KycDocument[]
  reviewHistory: AuditRecord[]
}

interface KycDocument {
  type: 'id_front' | 'id_back' | 'selfie' | 'proof_of_address'
  url: string
  ocrData?: Record<string, any>
  verificationStatus: 'pending' | 'verified' | 'failed'
}

// User
interface User {
  id: string
  nickname: string
  email: string
  phone: string
  kycStatus: 'none' | 'pending' | 'approved' | 'rejected'
  vipLevel: number
  riskTags: string[]
  assetSnapshot: AssetSnapshot
  createdAt: string
  lastLoginAt: string
}

interface AssetSnapshot {
  totalUsd: number
  availableUsd: number
  frozenUsd: number
  currencies: Record<string, CurrencyBalance>
}

interface CurrencyBalance {
  currency: string
  available: string
  frozen: string
  usdValue: number
}

// Deposit
interface Deposit {
  id: string
  userId: string
  currency: string
  chain: string
  txHash: string
  amount: string
  status: 'pending' | 'confirming' | 'completed' | 'failed'
  confirmations: number
  requiredConfirmations: number
  riskFlags: string[]
  createdAt: string
  completedAt?: string
}

// Withdrawal
interface Withdrawal {
  id: string
  userId: string
  currency: string
  chain: string
  address: string
  amount: string
  fee: string
  status: 'pending' | 'reviewing' | 'approved' | 'processing' | 'completed' | 'rejected'
  riskScore: number
  matchedRules: string[]
  approvals: Approval[]
  createdAt: string
  completedAt?: string
}

interface Approval {
  role: string
  adminId: string
  adminName: string
  action: 'approve' | 'reject'
  reason?: string
  timestamp: string
}

// Order
interface Order {
  id: string
  userId: string
  symbol: string
  type: 'spot' | 'futures'
  side: 'buy' | 'sell'
  orderType: 'limit' | 'market' | 'stop-limit' | 'stop-market'
  price?: string
  quantity: string
  filled: string
  status: 'pending' | 'partial' | 'filled' | 'cancelled' | 'rejected'
  errorCode?: string
  matchingLatency?: number
  createdAt: string
  updatedAt: string
}

interface FuturesOrder extends Order {
  leverage: number
  marginMode: 'isolated' | 'cross'
  positionSide: 'long' | 'short'
  liquidationPrice?: string
  fundingImpact?: string
}

// Position
interface Position {
  id: string
  userId: string
  symbol: string
  side: 'long' | 'short'
  leverage: number
  marginMode: 'isolated' | 'cross'
  entryPrice: string
  markPrice: string
  liquidationPrice: string
  quantity: string
  margin: string
  unrealizedPnl: string
  riskRatio: number
  createdAt: string
}

// Instrument
interface Instrument {
  symbol: string
  displayName: Record<string, string>  // i18n
  base: string
  quote: string
  type: 'spot' | 'futures'
  pricePrecision: number
  qtyStep: string
  minOrder: string
  visible: boolean
  rank: number
  region: string[]
  tags: string[]
  feeTemplateId?: string
  marginTemplateId?: string
  iconId?: string
  status: 'draft' | 'published'
  version: string
  createdAt: string
  updatedAt: string
}

// Margin Template
interface MarginTemplate {
  id: string
  name: string
  tiers: MarginTier[]
  status: 'draft' | 'published'
  version: string
}

interface MarginTier {
  notionalFrom: string
  notionalTo: string
  initialMarginRate: number
  maintenanceMarginRate: number
  maxLeverage: number
}

// Fee Template
interface FeeTemplate {
  id: string
  type: 'trading' | 'withdrawal'
  vipLevel?: number
  makerRate?: number
  takerRate?: number
  currency?: string
  chain?: string
  fixedFee?: string
  percentageFee?: number
  minFee?: string
  dailyLimit?: string
  status: 'draft' | 'published'
  version: string
}

// Risk Rule
interface RiskRule {
  id: string
  name: string
  conditions: RiskCondition[]
  actions: RiskAction[]
  priority: number
  enabled: boolean
  status: 'draft' | 'published'
  version: string
}

interface RiskCondition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains'
  value: any
}

interface RiskAction {
  type: 'block' | 'review' | 'alert' | 'tag'
  params: Record<string, any>
}

// Audit Record
interface AuditRecord {
  id: string
  adminId: string
  adminName: string
  action: string
  objectType: string
  objectId: string
  before?: any
  after?: any
  ip: string
  userAgent: string
  timestamp: string
}
```


## State Management (Pinia)

### Store Pattern

All stores follow a consistent pattern:

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<DataType[]>([])
  const currentItem = ref<DataType | null>(null)
  
  // Getters
  const hasData = computed(() => data.value.length > 0)
  
  // Actions
  async function fetchList(params: QueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await api.getList(params)
      data.value = response.data
      return response
    } catch (e) {
      error.value = handleError(e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  async function fetchById(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.getById(id)
      currentItem.value = response.data
      return response
    } catch (e) {
      error.value = handleError(e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  async function create(payload: CreatePayload) {
    loading.value = true
    error.value = null
    try {
      const response = await api.create(payload)
      data.value.unshift(response.data)
      return response
    } catch (e) {
      error.value = handleError(e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  async function update(id: string, payload: UpdatePayload) {
    loading.value = true
    error.value = null
    try {
      const response = await api.update(id, payload)
      const index = data.value.findIndex(item => item.id === id)
      if (index !== -1) {
        data.value[index] = response.data
      }
      if (currentItem.value?.id === id) {
        currentItem.value = response.data
      }
      return response
    } catch (e) {
      error.value = handleError(e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  function reset() {
    loading.value = false
    error.value = null
    data.value = []
    currentItem.value = null
  }
  
  return {
    // State
    loading,
    error,
    data,
    currentItem,
    // Getters
    hasData,
    // Actions
    fetchList,
    fetchById,
    create,
    update,
    reset
  }
})
```

### Key Stores

#### useAuthStore

Manages authentication state and permissions.

```typescript
interface AuthState {
  token: string | null
  refreshToken: string | null
  user: AdminUser | null
  permissions: Set<string>
  isAuthenticated: boolean
}

// Actions: login, logout, refreshToken, checkPermission, hasPermission, hasAnyPermission, hasAllPermissions
```

#### useAppStore

Manages global app state.

```typescript
interface AppState {
  collapsed: boolean
  theme: 'light' | 'dark'
  locale: string
  environment: 'production' | 'staging' | 'development'
  cachedViews: string[]
  visitedViews: PageTab[]
}

// Actions: toggleSidebar, setTheme, setLocale, addCachedView, removeCachedView, addVisitedView, removeVisitedView
```

#### Configuration Stores (with Version Control)

All configuration stores (instruments, margin, fees, calendar, icons, mappings, security) extend a base pattern:

```typescript
interface ConfigState<T> {
  loading: boolean
  error: string | null
  published: T[]
  drafts: T[]
  currentVersion: string
  versions: Version[]
  currentItem: T | null
}

// Actions: 
// - fetchPublished, fetchDrafts, fetchVersions
// - createDraft, updateDraft, deleteDraft
// - publish (with diff review), rollback
// - exportData, importData
```


## API Client Design

### AdminApiClient

Centralized HTTP client with interceptors.

```typescript
class AdminApiClient {
  private axiosInstance: AxiosInstance
  
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 30000
    })
    
    this.setupInterceptors()
  }
  
  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token
        const authStore = useAuthStore()
        if (authStore.token) {
          config.headers.Authorization = `Bearer ${authStore.token}`
        }
        
        // Add request ID
        config.headers['X-Request-ID'] = generateRequestId()
        
        // Add timestamp
        config.headers['X-Request-Time'] = Date.now().toString()
        
        return config
      },
      (error) => Promise.reject(error)
    )
    
    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response.data
      },
      async (error) => {
        const originalRequest = error.config
        
        // Handle 401 - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            const authStore = useAuthStore()
            await authStore.refreshToken()
            return this.axiosInstance(originalRequest)
          } catch (refreshError) {
            const authStore = useAuthStore()
            authStore.logout()
            router.push('/login')
            return Promise.reject(refreshError)
          }
        }
        
        // Handle other errors
        const errorMessage = this.handleError(error)
        message.error(errorMessage)
        
        return Promise.reject(error)
      }
    )
  }
  
  private handleError(error: any): string {
    if (error.response) {
      const { status, data } = error.response
      
      // Map error codes to user-friendly messages
      const errorCode = data?.code || data?.error_code
      if (errorCode && ERROR_CODE_MAP[errorCode]) {
        return ERROR_CODE_MAP[errorCode]
      }
      
      // Default messages by status
      switch (status) {
        case 400:
          return data?.message || 'Invalid request'
        case 403:
          return 'Permission denied'
        case 404:
          return 'Resource not found'
        case 500:
          return 'Server error, please try again later'
        default:
          return data?.message || 'Unknown error occurred'
      }
    } else if (error.request) {
      return 'Network error, please check your connection'
    } else {
      return error.message || 'Request failed'
    }
  }
  
  // HTTP methods
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get(url, config)
  }
  
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.post(url, data, config)
  }
  
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.put(url, data, config)
  }
  
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.patch(url, data, config)
  }
  
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.delete(url, config)
  }
}

export const apiClient = new AdminApiClient()
```

### Module API Services

Each module has its own API service file:

```typescript
// services/api/kyc.ts
import { apiClient } from './AdminApiClient'

export const kycApi = {
  getList(params: KycQueryParams) {
    return apiClient.get<ApiResponse<KycApplication[]>>('/admin/kyc', { params })
  },
  
  getById(id: string) {
    return apiClient.get<ApiResponse<KycApplication>>(`/admin/kyc/${id}`)
  },
  
  review(id: string, payload: ReviewPayload) {
    return apiClient.post<ApiResponse<KycApplication>>(`/admin/kyc/${id}/review`, payload)
  },
  
  batchReview(payload: BatchReviewPayload) {
    return apiClient.post<ApiResponse<BatchResult>>('/admin/kyc/batch-review', payload)
  },
  
  export(params: KycQueryParams) {
    return apiClient.get<Blob>('/admin/kyc/export', { 
      params, 
      responseType: 'blob' 
    })
  }
}
```


## Routing Design

### Route Structure

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards/rbac'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/auth/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminShell.vue'),
      meta: { requiresAuth: true },
      children: [
        ...dashboardRoutes,
        ...kycRoutes,
        ...usersRoutes,
        ...assetsRoutes,
        ...ordersRoutes,
        ...configRoutes,
        ...riskRoutes,
        ...opsRoutes,
        ...reportsRoutes,
        ...settingsRoutes
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/error/NotFound.vue')
    }
  ]
})

setupRouterGuards(router)

export default router
```

### Route Guards

```typescript
// router/guards/rbac.ts
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    // Check authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
    
    // Check permissions
    if (to.meta.permissions) {
      const permissions = Array.isArray(to.meta.permissions) 
        ? to.meta.permissions 
        : [to.meta.permissions]
      
      const hasPermission = to.meta.permissionMode === 'all'
        ? authStore.hasAllPermissions(permissions)
        : authStore.hasAnyPermission(permissions)
      
      if (!hasPermission) {
        message.error('You do not have permission to access this page')
        next({ name: 'Dashboard' })
        return
      }
    }
    
    next()
  })
  
  router.afterEach((to) => {
    // Update page title
    document.title = to.meta.title 
      ? `${to.meta.title} - DEIEX Admin` 
      : 'DEIEX Admin'
    
    // Track page view
    if (import.meta.env.PROD) {
      // Analytics tracking
    }
  })
}
```

### Module Routes Example

```typescript
// router/modules/config.ts
import type { RouteRecordRaw } from 'vue-router'

export const configRoutes: RouteRecordRaw[] = [
  {
    path: 'config',
    name: 'Config',
    redirect: '/admin/config/instruments',
    meta: {
      title: 'Configuration',
      icon: 'SettingOutlined',
      permissions: ['config.view']
    },
    children: [
      {
        path: 'instruments',
        name: 'ConfigInstruments',
        component: () => import('@/pages/config/instruments/index.vue'),
        meta: {
          title: 'Instruments',
          permissions: ['config.instruments.view'],
          keepAlive: true
        }
      },
      {
        path: 'margin',
        name: 'ConfigMargin',
        component: () => import('@/pages/config/margin/index.vue'),
        meta: {
          title: 'Margin',
          permissions: ['config.margin.view'],
          keepAlive: true
        }
      },
      {
        path: 'fees',
        name: 'ConfigFees',
        component: () => import('@/pages/config/fees/index.vue'),
        meta: {
          title: 'Fees',
          permissions: ['config.fees.view'],
          keepAlive: true
        }
      },
      {
        path: 'calendar',
        name: 'ConfigCalendar',
        component: () => import('@/pages/config/calendar/index.vue'),
        meta: {
          title: 'Calendar',
          permissions: ['config.calendar.view'],
          keepAlive: true
        }
      },
      {
        path: 'icons',
        name: 'ConfigIcons',
        component: () => import('@/pages/config/icons/index.vue'),
        meta: {
          title: 'Icons',
          permissions: ['config.icons.view'],
          keepAlive: true
        }
      },
      {
        path: 'mappings',
        name: 'ConfigMappings',
        component: () => import('@/pages/config/mappings/index.vue'),
        meta: {
          title: 'Mappings',
          permissions: ['config.mappings.view'],
          keepAlive: true
        }
      },
      {
        path: 'security',
        name: 'ConfigSecurity',
        component: () => import('@/pages/config/security/index.vue'),
        meta: {
          title: 'Security',
          permissions: ['config.security.view'],
          keepAlive: true
        }
      }
    ]
  }
]
```


## Error Handling

### Error Handling Strategy

1. **API Level**: AdminApiClient intercepts and maps error codes to user-friendly messages
2. **Store Level**: Stores catch errors and set error state
3. **Component Level**: Components display error states using EmptyState or inline messages
4. **Global Level**: Uncaught errors are caught by ErrorBoundary component

### Error Code Mapping

```typescript
// utils/constants.ts
export const ERROR_CODE_MAP: Record<string, string> = {
  'AUTH_001': 'Invalid credentials',
  'AUTH_002': 'Token expired, please login again',
  'AUTH_003': 'Permission denied',
  'KYC_001': 'KYC application not found',
  'KYC_002': 'KYC already reviewed',
  'USER_001': 'User not found',
  'USER_002': 'User already exists',
  'ASSET_001': 'Insufficient balance',
  'ASSET_002': 'Withdrawal limit exceeded',
  'ORDER_001': 'Invalid order parameters',
  'ORDER_002': 'Insufficient margin',
  'CONFIG_001': 'Configuration validation failed',
  'CONFIG_002': 'Version conflict, please refresh',
  // ... more error codes
}
```

### ErrorBoundary Component

```vue
<template>
  <div v-if="error" class="error-boundary">
    <a-result
      status="error"
      title="Something went wrong"
      :sub-title="error.message"
    >
      <template #extra>
        <a-button type="primary" @click="handleReset">
          Reload Page
        </a-button>
        <a-button @click="handleReport">
          Report Issue
        </a-button>
      </template>
    </a-result>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err
  console.error('ErrorBoundary caught:', err)
  
  // Report to error tracking service
  if (import.meta.env.PROD) {
    // Sentry.captureException(err)
  }
  
  return false // Prevent error from propagating
})

function handleReset() {
  error.value = null
  window.location.reload()
}

function handleReport() {
  // Open issue reporting modal
}
</script>
```


## Testing Strategy

### Unit Testing

- **Framework**: Vitest
- **Coverage Target**: 80% for utility functions and composables
- **Focus Areas**:
  - Utility functions (validation, formatting, date handling)
  - Composables (usePermission, useTable, useForm)
  - Store actions and getters
  - API service functions

### Component Testing

- **Framework**: Vitest + Vue Test Utils
- **Coverage Target**: 70% for shared components
- **Focus Areas**:
  - Shared components (RBACGuard, SchemaForm, ServerTable)
  - Form validation logic
  - Permission-based rendering
  - Event handling

### E2E Testing

- **Framework**: Playwright
- **Coverage**: Critical user flows
- **Focus Areas**:
  - Login and authentication
  - KYC review workflow
  - Configuration publish workflow
  - Withdrawal approval workflow

### Testing Best Practices

1. Use data-testid attributes for element selection
2. Mock API calls using MSW (Mock Service Worker)
3. Test user interactions, not implementation details
4. Maintain test fixtures for common data structures
5. Run tests in CI/CD pipeline before deployment


## Performance Optimization

### Code Splitting

1. **Route-based splitting**: Each page is lazy-loaded
2. **Component-based splitting**: Heavy components (charts, editors) are lazy-loaded
3. **Library splitting**: Large libraries (ECharts, Monaco Editor) are loaded on demand

### Bundle Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'antd-vendor': ['ant-design-vue'],
          'chart-vendor': ['echarts'],
          'utils': ['axios', 'dayjs', 'lodash-es']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### Caching Strategy

1. **API Response Caching**: Cache GET requests with TTL
2. **Component Caching**: Use keep-alive for frequently visited pages
3. **Asset Caching**: Long-term caching for static assets
4. **LocalStorage**: Persist user preferences and table configurations

### Rendering Optimization

1. **Virtual Scrolling**: For large tables (>1000 rows)
2. **Debounce/Throttle**: For search inputs and resize handlers
3. **Lazy Loading**: For images and heavy components
4. **Memoization**: For expensive computed properties

### Network Optimization

1. **Request Batching**: Combine multiple API calls when possible
2. **Request Cancellation**: Cancel pending requests on route change
3. **Compression**: Enable gzip/brotli compression
4. **CDN**: Serve static assets from CDN


## Security Considerations

### Authentication & Authorization

1. **JWT Tokens**: Access token (15 min) + Refresh token (7 days)
2. **Token Storage**: Store in memory, refresh token in httpOnly cookie
3. **Auto Refresh**: Refresh access token before expiration
4. **Permission Checks**: Multi-level checks (route, component, button)

### XSS Prevention

1. **Input Sanitization**: Sanitize all user inputs
2. **Output Encoding**: Use Vue's built-in escaping
3. **CSP Headers**: Implement Content Security Policy
4. **Trusted Types**: Enable Trusted Types API

### CSRF Prevention

1. **CSRF Tokens**: Include CSRF token in state-changing requests
2. **SameSite Cookies**: Set SameSite=Strict for cookies
3. **Origin Validation**: Validate request origin on server

### Data Protection

1. **Sensitive Data**: Mask sensitive data (emails, phone numbers)
2. **Audit Logging**: Log all sensitive operations
3. **Session Timeout**: Auto logout after 30 minutes of inactivity
4. **Secure Communication**: HTTPS only, no mixed content

### Dependency Security

1. **Regular Updates**: Keep dependencies up to date
2. **Vulnerability Scanning**: Use npm audit and Snyk
3. **License Compliance**: Verify license compatibility
4. **Minimal Dependencies**: Only include necessary packages


## Internationalization (i18n)

### Implementation

```typescript
// i18n/index.ts
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})
```

### Message Structure

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "delete": "Delete",
    "edit": "Edit",
    "search": "Search",
    "export": "Export",
    "import": "Import"
  },
  "nav": {
    "dashboard": "Dashboard",
    "kyc": "KYC",
    "users": "Users",
    "assets": "Assets"
  },
  "kyc": {
    "title": "KYC Management",
    "status": {
      "pending": "Pending",
      "approved": "Approved",
      "rejected": "Rejected"
    },
    "actions": {
      "review": "Review",
      "approve": "Approve",
      "reject": "Reject"
    }
  }
}
```

### Language Switching

```typescript
// composables/useLocale.ts
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'

export function useLocale() {
  const { locale, t } = useI18n()
  const appStore = useAppStore()
  
  const currentLocale = computed(() => locale.value)
  
  const availableLocales = [
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文' }
  ]
  
  function changeLocale(newLocale: string) {
    locale.value = newLocale
    appStore.setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
    
    // Update Ant Design locale
    // Update dayjs locale
  }
  
  return {
    currentLocale,
    availableLocales,
    changeLocale,
    t
  }
}
```


## Build and Deployment

### Environment Configuration

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/ws
VITE_ENV=development

# .env.staging
VITE_API_BASE_URL=https://staging-api.deiex.com/api
VITE_WS_URL=wss://staging-api.deiex.com/ws
VITE_ENV=staging

# .env.production
VITE_API_BASE_URL=https://api.deiex.com/api
VITE_WS_URL=wss://api.deiex.com/ws
VITE_ENV=production
```

### Build Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "build:staging": "vue-tsc && vite build --mode staging",
    "build:prod": "vue-tsc && vite build --mode production",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix",
    "format": "prettier --write src/",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "type-check": "vue-tsc --noEmit"
  }
}
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, staging]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Test
        run: npm run test
      
      - name: Build
        run: npm run build:prod
        if: github.ref == 'refs/heads/main'
      
      - name: Build Staging
        run: npm run build:staging
        if: github.ref == 'refs/heads/staging'
      
      - name: Deploy to CDN
        run: |
          # Upload dist/ to CDN
          # Invalidate CDN cache
```

### Docker Support

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```


## Development Workflow

### Project Setup

```bash
# Clone repository
git clone <repository-url>
cd admin-vue

# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:5173
```

### Code Style

- **ESLint**: Enforce code quality rules
- **Prettier**: Enforce code formatting
- **Husky**: Pre-commit hooks for linting and formatting
- **Commitlint**: Enforce conventional commit messages

### Git Workflow

1. **Branch Naming**:
   - `feature/xxx`: New features
   - `fix/xxx`: Bug fixes
   - `refactor/xxx`: Code refactoring
   - `docs/xxx`: Documentation updates

2. **Commit Messages**:
   ```
   feat: add KYC review functionality
   fix: resolve table pagination issue
   refactor: optimize API client error handling
   docs: update README with setup instructions
   ```

3. **Pull Request**:
   - Create PR with clear description
   - Link related issues
   - Request code review
   - Ensure CI passes
   - Squash and merge

### Component Development Guidelines

1. **File Naming**: Use PascalCase for components (e.g., `UserTable.vue`)
2. **Component Structure**:
   ```vue
   <template>
     <!-- Template -->
   </template>
   
   <script setup lang="ts">
   // Imports
   // Props & Emits
   // Composables
   // State
   // Computed
   // Methods
   // Lifecycle hooks
   </script>
   
   <style scoped>
   /* Styles */
   </style>
   ```

3. **Props Definition**:
   ```typescript
   interface Props {
     data: User[]
     loading?: boolean
   }
   
   const props = withDefaults(defineProps<Props>(), {
     loading: false
   })
   ```

4. **Emits Definition**:
   ```typescript
   interface Emits {
     (e: 'update', value: User): void
     (e: 'delete', id: string): void
   }
   
   const emit = defineEmits<Emits>()
   ```

### Documentation

- **Component Documentation**: Use JSDoc comments for complex components
- **API Documentation**: Document all API endpoints and parameters
- **README**: Keep README up to date with setup and development instructions
- **Changelog**: Maintain CHANGELOG.md for version history

