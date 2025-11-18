# Vue Query Configuration

This file sets up the Vue Query client with default configurations for the application.

```typescript
import { VueQueryPlugin, QueryClient, QueryClientConfig } from '@tanstack/vue-query'

// Create a new QueryClient instance with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Set a default stale time of 5 minutes
      staleTime: 5 * 60 * 1000,
      // Set a default cache time of 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Retry failed queries up to 3 times
      retry: 3,
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
      // Don't refetch on mount by default if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry failed mutations up to 3 times
      retry: 3,
    },
  },
})

// Vue Query plugin options
const vueQueryPluginOptions: QueryClientConfig = {
  queryClient,
}

export { queryClient, vueQueryPluginOptions }
export default VueQueryPlugin