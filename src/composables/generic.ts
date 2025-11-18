import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/vue-query'
import { ref, unref } from 'vue'
import type { Ref } from 'vue'
import type { PaginationParams } from '@/services/api/_types'

/**
 * Generic composable template for list data with pagination
 *
 * This template shows how to create a composable for paginated list data
 */

// Query keys for caching
const QUERY_KEYS = {
  all: ['listData'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (params: any) => [...QUERY_KEYS.lists(), params] as const,
}

// ============= Queries =============

/**
 * Get a paginated list of entities
 */
export function useListQuery<T>(
  queryKey: string,
  fetchFunction: (
    params: any
  ) => Promise<{ data: T[]; total: number; page: number; pageSize: number }>,
  params?: Ref<any> | any,
  options?: UseQueryOptions<any, any, any, ReturnType<typeof QUERY_KEYS.list>>
) {
  const paramsRef = ref(params)

  return useQuery({
    queryKey: [queryKey, unref(paramsRef)],
    queryFn: async () => {
      const response = await fetchFunction(unref(paramsRef) || {})
      return response
    },
    ...options,
  })
}

// ============= Mutations =============

/**
 * Create a new entity
 */
export function useCreateMutation<T>(
  mutationKey: string,
  createFunction: (payload: any) => Promise<T>,
  options?: UseMutationOptions<T, any, any>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFunction,
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: [mutationKey] })
      // Call user-provided onSuccess if any
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}

/**
 * Update an existing entity
 */
export function useUpdateMutation<T>(
  mutationKey: string,
  updateFunction: (id: string, payload: any) => Promise<T>,
  options?: UseMutationOptions<T, any, { id: string; payload: any }>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      return await updateFunction(id, payload)
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: [mutationKey] })
      // Call user-provided onSuccess if any
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}

/**
 * Delete an entity
 */
export function useDeleteMutation<T>(
  mutationKey: string,
  deleteFunction: (id: string) => Promise<T>,
  options?: UseMutationOptions<T, any, string>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFunction,
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: [mutationKey] })
      // Call user-provided onSuccess if any
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}
