<template>
  <div class="tasks-page">
    <a-card :bordered="false">
      <!-- Header Actions -->
      <div class="header-actions">
        <a-space>
          <RBACGuard permissions="ops.tasks.create">
            <a-button type="primary" @click="handleCreateTask">
              <template #icon><PlusOutlined /></template>
              New Task
            </a-button>
          </RBACGuard>
          <a-button @click="handleRefresh">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
        </a-space>
      </div>

      <!-- Tabs -->
      <a-tabs v-model:active-key="activeTab" @change="handleTabChange">
        <a-tab-pane key="tasks" tab="Scheduled Tasks">
          <TaskTable
            :data-source="tasksStore.tasks"
            :loading="tasksStore.loading"
            :total="tasksStore.tasksTotal"
            :pagination="tasksPagination"
            @change="handleTasksTableChange"
            @run="handleRunTask"
            @enable="handleEnableTask"
            @disable="handleDisableTask"
            @edit="handleEditTask"
            @delete="handleDeleteTask"
          />
        </a-tab-pane>

        <a-tab-pane key="retry-queue" tab="Retry Queue">
          <RetryQueueTable
            :data-source="tasksStore.retryQueue"
            :loading="tasksStore.loading"
            :total="tasksStore.retryQueueTotal"
            :pagination="queuePagination"
            @change="handleQueueTableChange"
            @retry="handleRetryQueueItem"
            @delete="handleDeleteQueueItem"
          />
          <div class="queue-actions">
            <RBACGuard permissions="ops.tasks.manage">
              <a-button
                danger
                :disabled="tasksStore.failedQueueItems.length === 0"
                @click="handleClearFailedQueue"
              >
                Clear Failed Items
              </a-button>
            </RBACGuard>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- Task Schedule Form Modal -->
    <TaskScheduleModal
      v-model:visible="scheduleModalVisible"
      :task="selectedTask"
      @success="handleTaskSaved"
    />

    <!-- Run Now Modal -->
    <RunNowModal
      v-model:visible="runNowModalVisible"
      :task="selectedTask"
      @confirm="handleConfirmRunNow"
    />

    <!-- Disable Task Modal -->
    <DisableTaskModal
      v-model:visible="disableModalVisible"
      :task="selectedTask"
      @confirm="handleConfirmDisable"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { useTasksStore } from '@/stores/tasks'
import type { ScheduledTask, TaskQueryParams } from '@/services/api/facade'
import RBACGuard from '@/shared/RBACGuard.vue'
import TaskTable from '@/tables/ops/TaskTable.vue'
import RetryQueueTable from '@/tables/ops/RetryQueueTable.vue'
import TaskScheduleModal from '@/modals/ops/TaskScheduleModal.vue'
import RunNowModal from '@/modals/ops/RunNowModal.vue'
import DisableTaskModal from '@/modals/ops/DisableTaskModal.vue'

const tasksStore = useTasksStore()

// State
const activeTab = ref<'tasks' | 'retry-queue'>('tasks')
const scheduleModalVisible = ref(false)
const runNowModalVisible = ref(false)
const disableModalVisible = ref(false)
const selectedTask = ref<ScheduledTask | null>(null)

const tasksPagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `Total ${total} items`,
})

const queuePagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `Total ${total} items`,
})

// Methods
async function fetchTasks() {
  const params: TaskQueryParams = {
    page: tasksPagination.current,
    pageSize: tasksPagination.pageSize,
    sortField: 'createdAt',
    sortOrder: 'desc',
  }

  try {
    await tasksStore.fetchTasks(params)
    tasksPagination.total = tasksStore.tasksTotal
  } catch (error) {
    message.error('Failed to fetch tasks')
  }
}

async function fetchRetryQueue() {
  const params: TaskQueryParams = {
    page: queuePagination.current,
    pageSize: queuePagination.pageSize,
    sortField: 'createdAt',
    sortOrder: 'desc',
  }

  try {
    await tasksStore.fetchRetryQueue(params)
    queuePagination.total = tasksStore.retryQueueTotal
  } catch (error) {
    message.error('Failed to fetch retry queue')
  }
}

function handleTabChange() {
  if (activeTab.value === 'tasks') {
    fetchTasks()
  } else {
    fetchRetryQueue()
  }
}

function handleRefresh() {
  if (activeTab.value === 'tasks') {
    fetchTasks()
  } else {
    fetchRetryQueue()
  }
}

function handleTasksTableChange(pag: any, _filters: any, sorter: any) {
  tasksPagination.current = pag.current
  tasksPagination.pageSize = pag.pageSize
  fetchTasks()
}

function handleQueueTableChange(pag: any, _filters: any, sorter: any) {
  queuePagination.current = pag.current
  queuePagination.pageSize = pag.pageSize
  fetchRetryQueue()
}

function handleCreateTask() {
  selectedTask.value = null
  scheduleModalVisible.value = true
}

function handleEditTask(task: ScheduledTask) {
  selectedTask.value = task
  scheduleModalVisible.value = true
}

function handleRunTask(task: ScheduledTask) {
  selectedTask.value = task
  runNowModalVisible.value = true
}

async function handleConfirmRunNow() {
  if (!selectedTask.value) return

  try {
    await tasksStore.runTaskNow(selectedTask.value.id)
    message.success('Task started successfully')
    runNowModalVisible.value = false
    fetchTasks()
  } catch (error) {
    message.error('Failed to run task')
  }
}

async function handleEnableTask(task: ScheduledTask) {
  try {
    await tasksStore.enableTask(task.id)
    message.success('Task enabled successfully')
    fetchTasks()
  } catch (error) {
    message.error('Failed to enable task')
  }
}

function handleDisableTask(task: ScheduledTask) {
  selectedTask.value = task
  disableModalVisible.value = true
}

async function handleConfirmDisable() {
  if (!selectedTask.value) return

  try {
    await tasksStore.disableTask(selectedTask.value.id)
    message.success('Task disabled successfully')
    disableModalVisible.value = false
    fetchTasks()
  } catch (error) {
    message.error('Failed to disable task')
  }
}

function handleDeleteTask(task: ScheduledTask) {
  Modal.confirm({
    title: 'Delete Task',
    content: `Are you sure you want to delete task "${task.name}"? This action cannot be undone.`,
    okText: 'Delete',
    okType: 'danger',
    onOk: async () => {
      try {
        await tasksStore.deleteTask(task.id)
        message.success('Task deleted successfully')
        fetchTasks()
      } catch (error) {
        message.error('Failed to delete task')
      }
    },
  })
}

function handleTaskSaved() {
  scheduleModalVisible.value = false
  fetchTasks()
}

async function handleRetryQueueItem(itemId: string) {
  try {
    await tasksStore.retryQueueItem(itemId)
    message.success('Retry initiated')
    fetchRetryQueue()
  } catch (error) {
    message.error('Failed to retry item')
  }
}

function handleDeleteQueueItem(itemId: string) {
  Modal.confirm({
    title: 'Delete Queue Item',
    content: 'Are you sure you want to delete this queue item?',
    okText: 'Delete',
    okType: 'danger',
    onOk: async () => {
      try {
        await tasksStore.deleteQueueItem(itemId)
        message.success('Queue item deleted')
        fetchRetryQueue()
      } catch (error) {
        message.error('Failed to delete queue item')
      }
    },
  })
}

function handleClearFailedQueue() {
  Modal.confirm({
    title: 'Clear Failed Queue Items',
    content: `Are you sure you want to clear all ${tasksStore.failedQueueItems.length} failed items? This action cannot be undone.`,
    okText: 'Clear',
    okType: 'danger',
    onOk: async () => {
      try {
        await tasksStore.clearFailedQueue()
        message.success('Failed queue items cleared')
        fetchRetryQueue()
      } catch (error) {
        message.error('Failed to clear queue')
      }
    },
  })
}

// Lifecycle
onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
.tasks-page {
  padding: 24px;
}

.header-actions {
  margin-bottom: 24px;
}

.queue-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
