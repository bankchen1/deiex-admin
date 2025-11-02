<template>
  <a-drawer
    v-model:open="isVisible"
    title="Log Detail"
    width="720"
    :footer-style="{ textAlign: 'right' }"
  >
    <a-spin :spinning="logsStore.loading">
      <div v-if="logsStore.currentLog" class="log-detail">
        <!-- Basic Info -->
        <a-descriptions title="Basic Information" :column="1" bordered>
          <a-descriptions-item label="Timestamp">
            {{ formatDateTime(logsStore.currentLog.timestamp) }}
          </a-descriptions-item>
          <a-descriptions-item label="Level">
            <a-tag :color="getLevelColor(logsStore.currentLog.level)">
              {{ logsStore.currentLog.level.toUpperCase() }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Source">
            {{ logsStore.currentLog.source }}
          </a-descriptions-item>
          <a-descriptions-item v-if="logsStore.currentLog.requestId" label="Request ID">
            <a-typography-text :copyable="{ text: logsStore.currentLog.requestId }">
              {{ logsStore.currentLog.requestId }}
            </a-typography-text>
          </a-descriptions-item>
          <a-descriptions-item label="Message">
            <div class="message-content">{{ logsStore.currentLog.message }}</div>
          </a-descriptions-item>
        </a-descriptions>

        <!-- Request Info -->
        <a-descriptions
          v-if="logsStore.currentLog.request"
          title="Request"
          :column="1"
          bordered
          class="section"
        >
          <a-descriptions-item label="Method">
            <a-tag>{{ logsStore.currentLog.request.method }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="URL">
            <a-typography-text :copyable="{ text: logsStore.currentLog.request.url }">
              {{ logsStore.currentLog.request.url }}
            </a-typography-text>
          </a-descriptions-item>
          <a-descriptions-item label="Headers">
            <JsonEditor
              v-model:value="logsStore.currentLog.request.headers"
              :read-only="true"
              :height="150"
            />
          </a-descriptions-item>
          <a-descriptions-item v-if="logsStore.currentLog.request.body" label="Body">
            <JsonEditor
              v-model:value="logsStore.currentLog.request.body"
              :read-only="true"
              :height="200"
            />
          </a-descriptions-item>
        </a-descriptions>

        <!-- Response Info -->
        <a-descriptions
          v-if="logsStore.currentLog.response"
          title="Response"
          :column="1"
          bordered
          class="section"
        >
          <a-descriptions-item label="Status Code">
            <a-tag :color="getStatusColor(logsStore.currentLog.response.statusCode)">
              {{ logsStore.currentLog.response.statusCode }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Headers">
            <JsonEditor
              v-model:value="logsStore.currentLog.response.headers"
              :read-only="true"
              :height="150"
            />
          </a-descriptions-item>
          <a-descriptions-item v-if="logsStore.currentLog.response.body" label="Body">
            <JsonEditor
              v-model:value="logsStore.currentLog.response.body"
              :read-only="true"
              :height="200"
            />
          </a-descriptions-item>
        </a-descriptions>

        <!-- Stack Trace -->
        <div v-if="logsStore.currentLog.stack" class="section">
          <h4>Stack Trace</h4>
          <pre class="stack-trace">{{ logsStore.currentLog.stack }}</pre>
        </div>

        <!-- Metadata -->
        <div v-if="logsStore.currentLog.metadata" class="section">
          <h4>Metadata</h4>
          <JsonEditor
            v-model:value="logsStore.currentLog.metadata"
            :read-only="true"
            :height="200"
          />
        </div>
      </div>

      <a-empty v-else description="No log data available" />
    </a-spin>

    <template #footer>
      <a-button @click="handleClose">Close</a-button>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useLogsStore } from '@/stores/logs'
import { formatDateTime } from '@/utils/date'
import JsonEditor from '@/shared/JsonEditor.vue'

interface Props {
  visible: boolean
  logId: string
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const logsStore = useLogsStore()

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

// Watch for logId changes and fetch detail
watch(
  () => props.logId,
  async (newLogId) => {
    if (newLogId && props.visible) {
      try {
        await logsStore.fetchLogDetail(newLogId)
      } catch (error) {
        message.error('Failed to fetch log detail')
      }
    }
  },
  { immediate: true }
)

function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    debug: 'default',
    info: 'blue',
    warn: 'orange',
    error: 'red',
  }
  return colors[level] || 'default'
}

function getStatusColor(statusCode: number): string {
  if (statusCode >= 500) return 'red'
  if (statusCode >= 400) return 'orange'
  if (statusCode >= 300) return 'blue'
  if (statusCode >= 200) return 'green'
  return 'default'
}

function handleClose() {
  isVisible.value = false
}
</script>

<style scoped>
.log-detail {
  padding-bottom: 24px;
}

.section {
  margin-top: 24px;
}

.message-content {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.6;
}

.stack-trace {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

h4 {
  margin-bottom: 12px;
  font-weight: 600;
}
</style>
