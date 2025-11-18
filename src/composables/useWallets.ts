import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, unref } from 'vue'
import type { Ref } from 'vue'
import {
  listWalletAddresses,
  getChainHealthStatus,
  getRetryQueue,
  syncBalance,
  retryTask,
  cancelTask,
  type WalletAddressQueryParams,
} from '@/services/api/facade/assets'
import type { WalletAddress, ChainHealth, RetryTask } from '@/contracts/assets'

// Query keys for caching
const QUERY_KEYS = {
  all: ['wallets'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (params: any) => [...QUERY_KEYS.lists(), params] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  chainHealth: () => [...QUERY_KEYS.all, 'chainHealth'] as const,
  retryQueue: () => [...QUERY_KEYS.all, 'retryQueue'] as const,
}

// ============= Queries =============

/**
 * Get wallet addresses list
 */
export function useWalletsQuery(
  params?: Ref<WalletAddressQueryParams> | WalletAddressQueryParams,
  options?: any
) {
  const paramsRef = ref(params)

  return useQuery({
    queryKey: QUERY_KEYS.list(unref(paramsRef)),
    queryFn: async () => {
      const { data, error } = await listWalletAddresses(unref(paramsRef) || {})
      if (error) throw new Error(error.message)
      return data
    },
    ...options,
  })
}

/**
 * Get chain health status
 */
export function useChainHealthQuery(options?: any) {
  return useQuery({
    queryKey: QUERY_KEYS.chainHealth(),
    queryFn: async () => {
      const { data, error } = await getChainHealthStatus()
      if (error) throw new Error(error.message)
      return data
    },
    ...options,
  })
}

/**
 * Get retry queue
 */
export function useRetryQueueQuery(options?: any) {
  return useQuery({
    queryKey: QUERY_KEYS.retryQueue(),
    queryFn: async () => {
      const { data, error } = await getRetryQueue()
      if (error) throw new Error(error.message)
      return data
    },
    ...options,
  })
}

// ============= Mutations =============

/**
 * Sync wallet balance
 */
export function useSyncBalanceMutation(options?: any) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (addressId: string) => {
      const { data, error } = await syncBalance(addressId)
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      // Call user-provided onSuccess if any
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}

/**
 * Retry a failed task
 */
export function useRetryTaskMutation(options?: any) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { data, error } = await retryTask(taskId)
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.retryQueue() })
      // Call user-provided onSuccess if any
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}

/**
 * Cancel a task
 */
export function useCancelTaskMutation(options?: any) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { data, error } = await cancelTask(taskId)
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.retryQueue() })
      // Call user-provided onSuccess if any
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}
