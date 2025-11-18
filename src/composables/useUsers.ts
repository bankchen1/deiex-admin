import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref, unref } from 'vue'
import type { Ref } from 'vue'
import {
  listUsers,
  getUserById,
  getUserStats,
  updateUserVip,
  updateUserTags,
  resetUser2FA,
  disableUser,
  enableUser,
  exportUsers,
  type UserQueryParams,
  type UserStats,
  type UserDetailResponse,
} from '@/services/api/facade'
import type { User } from '@/contracts/users'

// Query keys for caching
const QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (params: any) => [...QUERY_KEYS.lists(), params] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
  stats: () => [...QUERY_KEYS.all, 'stats'] as const,
}

// ============= Queries =============

/**
 * Get users list with pagination
 */
export function useUsersQuery(params?: Ref<UserQueryParams> | UserQueryParams, options?: any) {
  const paramsRef = ref(params)

  return useQuery({
    queryKey: QUERY_KEYS.list(unref(paramsRef)),
    queryFn: async () => {
      const { data, error } = await listUsers(unref(paramsRef) || {})
      if (error) throw new Error(error.message)
      return data
    },
    ...options,
  })
}

/**
 * Get a single user by ID
 */
export function useUserDetailQuery(id: Ref<string> | string, options?: any) {
  const idRef = ref(id)

  return useQuery({
    queryKey: QUERY_KEYS.detail(unref(idRef)),
    queryFn: async () => {
      const { data, error } = await getUserById(unref(idRef))
      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!unref(idRef),
    ...options,
  })
}

/**
 * Get user statistics
 */
export function useUserStatsQuery(params?: Ref<any> | any, options?: any) {
  const paramsRef = ref(params)

  return useQuery({
    queryKey: QUERY_KEYS.stats(),
    queryFn: async () => {
      const { data, error } = await getUserStats(unref(paramsRef))
      if (error) throw new Error(error.message)
      return data
    },
    ...options,
  })
}

// ============= Mutations =============

/**
 * Update user VIP level
 */
export function useUpdateUserVipMutation(options?: any) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const { data, error } = await updateUserVip(id, payload)
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) })
      // Call user-provided onSuccess if any
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}

/**
 * Update user risk tags
 */
export function useUpdateUserTagsMutation(options?: any) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const { data, error } = await updateUserTags(id, payload)
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.id) })
      // Call user-provided onSuccess if any
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}

/**
 * Reset user 2FA
 */
export function useResetUser2FAMutation(options?: any) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await resetUser2FA(id)
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables) })
      // Call user-provided onSuccess if any
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}

/**
 * Disable user
 */
export function useDisableUserMutation(options?: any) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await disableUser(id)
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables) })
      // Call user-provided onSuccess if any
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}

/**
 * Enable user
 */
export function useEnableUserMutation(options?: any) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await enableUser(id)
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables) })
      // Call user-provided onSuccess if any
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}

/**
 * Export users data
 */
export function useExportUsersMutation(options?: any) {
  return useMutation({
    mutationFn: async (params?: UserQueryParams) => {
      const { data: blob, error } = await exportUsers(params)
      if (error) throw new Error(error.message)
      return blob
    },
    ...options,
  })
}
