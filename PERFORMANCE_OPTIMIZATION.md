# Performance Optimization Guide

This document describes the performance optimizations implemented in the DEIEX Admin Vue application.

## Table of Contents

1. [Build Optimization](#build-optimization)
2. [Lazy Loading](#lazy-loading)
3. [Caching Strategies](#caching-strategies)
4. [Best Practices](#best-practices)

## Build Optimization

### Vite Configuration

The application uses advanced Vite build optimizations configured in `vite.config.ts`:

#### Manual Chunk Splitting

Vendor libraries are split into separate chunks for better caching:

- **vue-vendor**: Vue core, Pinia, Vue Router
- **ui-vendor**: Ant Design Vue components
- **chart-vendor**: ECharts library (heavy)
- **i18n-vendor**: Vue I18n
- **utils-vendor**: Axios, Day.js
- **vendor**: Other node_modules

Route-based code splitting:
- Each page module (dashboard, kyc, users, etc.) is split into separate chunks
- Heavy components (charts, modals, forms, tables) are split into dedicated chunks

#### Compression

Both Gzip and Brotli compression are enabled for production builds:

```bash
npm run build
```

This generates `.gz` and `.br` files for all assets larger than 10KB.

#### Minification

Terser is used for JavaScript minification with:
- Console.log removal in production
- Debugger statement removal
- Dead code elimination

#### Chunk Size Limits

- Warning threshold: 500KB
- Chunks exceeding this limit should be further split

### Build Commands

```bash
# Development build
npm run dev

# Production build
npm run build:production

# Staging build
npm run build:staging

# Preview production build
npm run preview
```

## Lazy Loading

### ECharts Lazy Loading

Use the `useLazyECharts` composable to lazy load chart components:

```vue
<template>
  <div ref="chartRef" style="width: 100%; height: 400px">
    <a-spin v-if="loading" />
    <a-alert v-if="error" :message="error" type="error" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLazyECharts } from '@/composables'

const chartRef = ref<HTMLElement | null>(null)
const { loading, error, setOption } = useLazyECharts(chartRef)

onMounted(() => {
  setOption({
    title: { text: 'My Chart' },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 200, 150], type: 'line' }]
  })
})
</script>
```

### Component Lazy Loading

Use the `useLazyComponent` composable for heavy modals and drawers:

```vue
<script setup lang="ts">
import { useLazyComponent } from '@/composables'

const {
  component: HeavyModal,
  loading,
  loadComponent
} = useLazyComponent(() => import('@/modals/HeavyModal.vue'))

const visible = ref(false)

const showModal = async () => {
  await loadComponent()
  visible.value = true
}
</script>

<template>
  <a-button @click="showModal">Open Modal</a-button>
  <component 
    v-if="HeavyModal" 
    :is="HeavyModal" 
    v-model:visible="visible" 
  />
</template>
```

### Virtual Scrolling for Large Tables

For tables with more than 1000 rows, use the `VirtualTable` component:

```vue
<template>
  <VirtualTable
    :columns="columns"
    :data-source="largeDataset"
    :row-height="54"
    :overscan="5"
    row-key="id"
  />
</template>

<script setup lang="ts">
import { VirtualTable } from '@/shared'

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  // ... more columns
]

const largeDataset = ref([]) // Array with 1000+ items
</script>
```

## Caching Strategies

### API Response Caching

Use the `useApiCache` composable to cache GET requests:

```typescript
import { useApiCache, CacheTTL } from '@/composables'

const { fetchWithCache, invalidateCache } = useApiCache()

// Fetch with 5-minute cache
const data = await fetchWithCache(
  () => api.getList(params),
  'users-list',
  { ttl: CacheTTL.MEDIUM }
)

// Force refresh (bypass cache)
const freshData = await fetchWithCache(
  () => api.getList(params),
  'users-list',
  { forceRefresh: true }
)

// Invalidate specific cache
invalidateCache('users-list')
```

#### Cache TTL Presets

- `CacheTTL.SHORT`: 1 minute
- `CacheTTL.MEDIUM`: 5 minutes (default)
- `CacheTTL.LONG`: 15 minutes
- `CacheTTL.VERY_LONG`: 1 hour

### Table Configuration Persistence

Use the `useTableConfig` composable to persist table settings:

```typescript
import { useTableConfig } from '@/composables'

const {
  visibleColumns,
  columnWidths,
  sortField,
  sortOrder,
  pageSize,
  filters,
  resetConfig
} = useTableConfig('users-table')

// Settings are automatically saved to localStorage
// and restored on next visit
```

### Keep-Alive Optimization

The app store implements intelligent keep-alive caching:

#### Priority Cache Views

These views are always kept in cache:
- Dashboard
- KYC List
- Users List
- Spot Orders
- Futures Orders

#### Frequency-Based Caching

- Maximum 10 views are cached simultaneously
- Least frequently visited views are removed when cache is full
- Visit counts are tracked and persisted

#### Usage

```typescript
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// Add view to cache (automatically tracked)
appStore.addCachedView('MyView')

// Get visit count
const count = appStore.getViewVisitCount('MyView')

// Clear non-priority cached views
appStore.clearCachedViews()
```

### LocalStorage Cache

For long-term data persistence:

```typescript
import { localStorageCache } from '@/utils/cache'

// Save with 24-hour TTL
localStorageCache.set('user-preferences', preferences, 24 * 60 * 60 * 1000)

// Retrieve
const preferences = localStorageCache.get('user-preferences')

// Clear expired entries
localStorageCache.clearExpired()
```

## Best Practices

### 1. Route-Level Code Splitting

Always use dynamic imports for route components:

```typescript
{
  path: '/users',
  component: () => import('@/pages/users/List.vue')
}
```

### 2. Component-Level Code Splitting

Split heavy components:

```typescript
// Instead of:
import HeavyChart from '@/widgets/charts/HeavyChart.vue'

// Use:
const HeavyChart = defineAsyncComponent(() => 
  import('@/widgets/charts/HeavyChart.vue')
)
```

### 3. Image Optimization

- Use WebP format when possible
- Lazy load images below the fold
- Use appropriate image sizes

### 4. Bundle Analysis

Analyze bundle size:

```bash
npm run build
# Check dist/js folder for chunk sizes
```

### 5. Performance Monitoring

Monitor key metrics:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Bundle Size

### 6. Cache Invalidation

Invalidate cache when data changes:

```typescript
// After creating/updating/deleting
invalidateCache('users-list')
// Or invalidate by pattern
invalidateCacheByPattern('users-')
```

### 7. Avoid Over-Caching

Don't cache:
- Real-time data (prices, orders)
- User-specific sensitive data
- Frequently changing data

### 8. Memory Management

- Clear cache periodically (automatic every 5 minutes)
- Limit cached views to 10
- Use virtual scrolling for large lists

## Performance Checklist

- [ ] Routes use dynamic imports
- [ ] Heavy components are lazy loaded
- [ ] ECharts uses lazy loading composable
- [ ] Tables with >1000 rows use VirtualTable
- [ ] API responses are cached appropriately
- [ ] Table configurations are persisted
- [ ] Keep-alive is configured for frequently visited pages
- [ ] Build output is compressed (gzip + brotli)
- [ ] Chunk sizes are within limits (<500KB)
- [ ] Console.log statements are removed in production

## Troubleshooting

### Large Bundle Size

1. Check chunk sizes in `dist/js`
2. Identify large dependencies
3. Consider lazy loading or alternatives
4. Use bundle analyzer tools

### Slow Initial Load

1. Verify code splitting is working
2. Check network waterfall
3. Ensure compression is enabled
4. Consider preloading critical resources

### Memory Leaks

1. Check for unclosed subscriptions
2. Verify component cleanup in `onUnmounted`
3. Monitor cached views count
4. Clear cache periodically

### Cache Issues

1. Check cache TTL settings
2. Verify cache invalidation logic
3. Clear browser cache
4. Check localStorage quota

## Resources

- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [Vue Performance Guide](https://vuejs.org/guide/best-practices/performance.html)
- [Web Vitals](https://web.dev/vitals/)
