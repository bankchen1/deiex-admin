import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/vue-query'
import { ref, unref } from 'vue'
import type { Ref } from 'vue'

// Import the service functions
// import {
//   fetchData,
//   createData,
//   updateData,
//   deleteData
// } from '@/services/api/your-module'

// Import the contract types
// import type {
//   YourDataType,
//   CreateYourDataPayload,
//   UpdateYourDataPayload
// } from '@/contracts/your-contract'

/**
 * Composable template for a data entity
 *
 * This template shows how to create a composable that follows the pattern:
 * - Uses Vue Query for server state management
 * - Separates queries and mutations
 * - Provides proper typing
 * - Handles loading and error states
 *
 * To use this template:
 * 1. Replace 'YourEntity' with your entity name
 * 2. Replace service function imports with actual functions
 * 3. Replace contract type imports with actual types
 * 4. Customize query keys as needed
 * 5. Add or remove queries/mutations as needed
 */

// Query keys for caching
const QUERY_KEYS = {
  all: ['yourEntity'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (params: any) => [...QUERY_KEYS.lists(), params] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
}

// ============= Queries =============

/**
 * Get a list of your entities
 */
export function useYourEntityListQuery(
  params?: Ref<any> | any,
  options?: UseQueryOptions<any, any, any, ReturnType<typeof QUERY_KEYS.list>>
) {
  const paramsRef = ref(params)

  return useQuery({
    queryKey: QUERY_KEYS.list(unref(paramsRef)),
    queryFn: async () => {
      // Replace with actual service call
      // const { data, error } = await fetchData(unref(paramsRef))
      // if (error) throw new Error(error.message)
      // return data
      return []
    },
    ...options,
  })
}

/**
 * Get a single entity by ID
 */
export function useYourEntityDetailQuery(
  id: Ref<string> | string,
  options?: UseQueryOptions<any, any, any, ReturnType<typeof QUERY_KEYS.detail>>
) {
  const idRef = ref(id)

  return useQuery({
    queryKey: QUERY_KEYS.detail(unref(idRef)),
    queryFn: async () => {
      // Replace with actual service call
      // const { data, error } = await fetchDataById(unref(idRef))
      // if (error) throw new Error(error.message)
      // return data
      return null
    },
    enabled: !!unref(idRef),
    ...options,
  })
}

// ============= Mutations =============

/**
 * Create a new entity
 */
export function useCreateYourEntityMutation(options?: UseMutationOptions<any, any, any>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: any) => {
      // Replace with actual service call
      // const { data, error } = await createData(payload)
      // if (error) throw new Error(error.message)
      // return data
      return {}
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
 * Update an existing entity
 */
export function useUpdateYourEntityMutation(
  options?: UseMutationOptions<any, any, { id: string; payload: any }>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      // Replace with actual service call
      // const { data, error } = await updateData(id, payload)
      // if (error) throw new Error(error.message)
      // return data
      return {}
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
 * Delete an entity
 */
export function useDeleteYourEntityMutation(options?: UseMutationOptions<any, any, string>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // Replace with actual service call
      // const { data, error } = await deleteData(id)
      // if (error) throw new Error(error.message)
      // return data
      return {}
    },
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.details() })
      // Call user-provided onSuccess if any
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    ...options,
  })
}
