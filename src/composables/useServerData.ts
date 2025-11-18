import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, unref } from 'vue'
import type { Ref } from 'vue'

/**
 * Composable for managing server state with Vue Query
 *
 * This composable provides a standardized way to handle:
 * - Data fetching with caching
 * - Mutations with optimistic updates
 * - Error and loading states
 * - Pagination and filtering
 */

export interface UseServerDataOptions {
  /**
   * Whether to enable the query automatically
   * @default true
   */
  enabled?: boolean

  /**
   * Time in milliseconds after which data is considered stale
   * @default 5 * 60 * 1000 (5 minutes)
   */
  staleTime?: number

  /**
   * Time in milliseconds after which inactive data is garbage collected
   * @default 10 * 60 * 1000 (10 minutes)
   */
  cacheTime?: number

  /**
   * Whether to refetch on window focus
   * @default false
   */
  refetchOnWindowFocus?: boolean

  /**
   * Whether to refetch on mount
   * @default false
   */
  refetchOnMount?: boolean

  /**
   * Whether to refetch on reconnect
   * @default false
   */
  refetchOnReconnect?: boolean

  /**
   * Number of times to retry failed queries
   * @default 3
   */
  retry?: number
}

/**
 * Generic composable for fetching list data
 */
export function useListData<T>(
  queryKey: string | unknown[],
  fetchFunction: (params?: any) => Promise<T[]>,
  params?: Ref<any> | any,
  options: UseServerDataOptions = {}
) {
  const paramsRef = ref(params)

  const defaultOptions: UseServerDataOptions = {
    enabled: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3,
  }

  const mergedOptions = { ...defaultOptions, ...options }

  return useQuery({
    queryKey: [...(Array.isArray(queryKey) ? queryKey : [queryKey]), unref(paramsRef)],
    queryFn: async () => {
      const result = await fetchFunction(unref(paramsRef))
      return result
    },
    enabled: mergedOptions.enabled,
    staleTime: mergedOptions.staleTime,
    cacheTime: mergedOptions.cacheTime,
    refetchOnWindowFocus: mergedOptions.refetchOnWindowFocus,
    refetchOnMount: mergedOptions.refetchOnMount,
    refetchOnReconnect: mergedOptions.refetchOnReconnect,
    retry: mergedOptions.retry,
  })
}

/**
 * Generic composable for fetching detail data
 */
export function useDetailData<T>(
  queryKey: string | unknown[],
  fetchFunction: (id: string) => Promise<T>,
  id: Ref<string> | string,
  options: UseServerDataOptions = {}
) {
  const idRef = ref(id)

  const defaultOptions: UseServerDataOptions = {
    enabled: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3,
  }

  const mergedOptions = { ...defaultOptions, ...options }

  return useQuery({
    queryKey: [...(Array.isArray(queryKey) ? queryKey : [queryKey]), unref(idRef)],
    queryFn: async () => {
      if (!unref(idRef)) {
        throw new Error('ID is required to fetch detail data')
      }
      const result = await fetchFunction(unref(idRef))
      return result
    },
    enabled: mergedOptions.enabled && !!unref(idRef),
    staleTime: mergedOptions.staleTime,
    cacheTime: mergedOptions.cacheTime,
    refetchOnWindowFocus: mergedOptions.refetchOnWindowFocus,
    refetchOnMount: mergedOptions.refetchOnMount,
    refetchOnReconnect: mergedOptions.refetchOnReconnect,
    retry: mergedOptions.retry,
  })
}

/**
 * Generic composable for creating data
 */
export function useCreateData<T>(
  mutationKey: string | unknown[],
  createFunction: (data: any) => Promise<T>,
  options: any = {}
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFunction,
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: Array.isArray(mutationKey) ? mutationKey : [mutationKey],
      })

      // Call user-provided onSuccess if any
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      // Call user-provided onError if any
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}

/**
 * Generic composable for updating data
 */
export function useUpdateData<T>(
  mutationKey: string | unknown[],
  updateFunction: (id: string, data: any) => Promise<T>,
  options: any = {}
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await updateFunction(id, data)
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: Array.isArray(mutationKey) ? mutationKey : [mutationKey],
      })

      // Call user-provided onSuccess if any
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      // Call user-provided onError if any
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}

/**
 * Generic composable for deleting data
 */
export function useDeleteData<T>(
  mutationKey: string | unknown[],
  deleteFunction: (id: string) => Promise<T>,
  options: any = {}
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFunction,
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: Array.isArray(mutationKey) ? mutationKey : [mutationKey],
      })

      // Call user-provided onSuccess if any
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      // Call user-provided onError if any
      if (options.onError) {
        options.onError(error, variables, context)
      }
    },
  })
}
