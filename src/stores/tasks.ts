import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  opsApi,
  type ScheduledTask,
  type RetryQueueItem,
  type TaskQueryParams,
  type TaskSchedulePayload,
} from '@/services/api/ops'

export const useTasksStore = defineStore('tasks', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Tasks
  const tasks = ref<ScheduledTask[]>([])
  const tasksTotal = ref(0)
  const currentTask = ref<ScheduledTask | null>(null)

  // Retry Queue
  const retryQueue = ref<RetryQueueItem[]>([])
  const retryQueueTotal = ref(0)

  // Getters
  const enabledTasks = computed(() => tasks.value.filter((t) => t.status === 'enabled'))
  const disabledTasks = computed(() => tasks.value.filter((t) => t.status === 'disabled'))
  const failedQueueItems = computed(() => retryQueue.value.filter((q) => q.status === 'failed'))

  // Actions
  async function fetchTasks(params: TaskQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await opsApi.getTasks(params)
      tasks.value = response.data.items
      tasksTotal.value = response.data.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch tasks'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchTaskById(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await opsApi.getTaskById(id)
      currentTask.value = response.data
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch task'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createTask(payload: TaskSchedulePayload) {
    loading.value = true
    error.value = null
    try {
      const response = await opsApi.createTask(payload)
      tasks.value.unshift(response.data)
      tasksTotal.value += 1
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to create task'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id: string, payload: Partial<TaskSchedulePayload>) {
    loading.value = true
    error.value = null
    try {
      const response = await opsApi.updateTask(id, payload)
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      if (currentTask.value?.id === id) {
        currentTask.value = response.data
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to update task'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id: string) {
    loading.value = true
    error.value = null
    try {
      await opsApi.deleteTask(id)
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        tasks.value.splice(index, 1)
        tasksTotal.value -= 1
      }
      if (currentTask.value?.id === id) {
        currentTask.value = null
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to delete task'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function runTaskNow(id: string) {
    loading.value = true
    error.value = null
    try {
      await opsApi.runTaskNow(id)
      // Refresh task to get updated status
      await fetchTaskById(id)
    } catch (e: any) {
      error.value = e.message || 'Failed to run task'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function enableTask(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await opsApi.enableTask(id)
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      if (currentTask.value?.id === id) {
        currentTask.value = response.data
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to enable task'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function disableTask(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await opsApi.disableTask(id)
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      if (currentTask.value?.id === id) {
        currentTask.value = response.data
      }
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to disable task'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchRetryQueue(params: TaskQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await opsApi.getRetryQueue(params)
      retryQueue.value = response.data.items
      retryQueueTotal.value = response.data.total
      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch retry queue'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function retryQueueItem(id: string) {
    loading.value = true
    error.value = null
    try {
      await opsApi.retryQueueItem(id)
      // Refresh queue
      const index = retryQueue.value.findIndex((q) => q.id === id)
      if (index !== -1) {
        retryQueue.value[index].status = 'processing'
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to retry queue item'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteQueueItem(id: string) {
    loading.value = true
    error.value = null
    try {
      await opsApi.deleteQueueItem(id)
      const index = retryQueue.value.findIndex((q) => q.id === id)
      if (index !== -1) {
        retryQueue.value.splice(index, 1)
        retryQueueTotal.value -= 1
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to delete queue item'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function clearFailedQueue() {
    loading.value = true
    error.value = null
    try {
      await opsApi.clearFailedQueue()
      // Remove all failed items from local state
      retryQueue.value = retryQueue.value.filter((q) => q.status !== 'failed')
      retryQueueTotal.value = retryQueue.value.length
    } catch (e: any) {
      error.value = e.message || 'Failed to clear failed queue'
      throw e
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    error.value = null
    tasks.value = []
    tasksTotal.value = 0
    currentTask.value = null
    retryQueue.value = []
    retryQueueTotal.value = 0
  }

  return {
    // State
    loading,
    error,
    tasks,
    tasksTotal,
    currentTask,
    retryQueue,
    retryQueueTotal,
    // Getters
    enabledTasks,
    disabledTasks,
    failedQueueItems,
    // Actions
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    runTaskNow,
    enableTask,
    disableTask,
    fetchRetryQueue,
    retryQueueItem,
    deleteQueueItem,
    clearFailedQueue,
    reset,
  }
})
