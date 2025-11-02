<template>
  <div v-if="error" class="error-boundary">
    <a-result :status="status" :title="title" :sub-title="subTitle">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleReset">
            {{ resetText }}
          </a-button>
          <a-button v-if="showReport" @click="handleReport"> Report Issue </a-button>
          <a-button v-if="showDetails" type="link" @click="showErrorDetails = !showErrorDetails">
            {{ showErrorDetails ? 'Hide' : 'Show' }} Details
          </a-button>
        </a-space>
      </template>
    </a-result>

    <div v-if="showErrorDetails && error" class="error-details">
      <a-card title="Error Details" size="small">
        <div class="error-info">
          <div class="error-row">
            <strong>Message:</strong>
            <span>{{ error.message }}</span>
          </div>
          <div v-if="error.stack" class="error-row">
            <strong>Stack Trace:</strong>
            <pre class="error-stack">{{ error.stack }}</pre>
          </div>
          <div class="error-row">
            <strong>Timestamp:</strong>
            <span>{{ errorTimestamp }}</span>
          </div>
          <div v-if="componentName" class="error-row">
            <strong>Component:</strong>
            <span>{{ componentName }}</span>
          </div>
        </div>
      </a-card>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, computed } from 'vue'
import { formatDate } from '@/utils/date'

interface Props {
  status?: '403' | '404' | '500' | 'error' | 'warning'
  title?: string
  subTitle?: string
  resetText?: string
  showReport?: boolean
  showDetails?: boolean
  onError?: (error: Error, componentName: string) => void
  onReset?: () => void
}

interface Emits {
  (e: 'error', error: Error, componentName: string): void
  (e: 'reset'): void
  (e: 'report', error: Error): void
}

const props = withDefaults(defineProps<Props>(), {
  status: 'error',
  title: 'Something went wrong',
  subTitle: 'An error occurred while rendering this component',
  resetText: 'Reload',
  showReport: true,
  showDetails: true,
})

const emit = defineEmits<Emits>()

// State
const error = ref<Error | null>(null)
const componentName = ref<string>('')
const errorTimestamp = ref<string>('')
const showErrorDetails = ref(false)

// Capture errors
onErrorCaptured((err, instance, info) => {
  error.value = err
  componentName.value = instance?.$options.name || instance?.$options.__name || 'Unknown'
  errorTimestamp.value = formatDate(new Date().toISOString(), 'YYYY-MM-DD HH:mm:ss')

  console.error('ErrorBoundary caught:', {
    error: err,
    component: componentName.value,
    info,
    timestamp: errorTimestamp.value,
  })

  // Call onError callback if provided
  if (props.onError) {
    props.onError(err, componentName.value)
  }

  // Emit error event
  emit('error', err, componentName.value)

  // Report to error tracking service in production
  if (import.meta.env.PROD) {
    // Example: Sentry.captureException(err)
  }

  // Prevent error from propagating
  return false
})

// Handle reset
function handleReset(): void {
  error.value = null
  componentName.value = ''
  errorTimestamp.value = ''
  showErrorDetails.value = false

  // Call onReset callback if provided
  if (props.onReset) {
    props.onReset()
  }

  // Emit reset event
  emit('reset')

  // Reload the page as fallback
  setTimeout(() => {
    if (error.value) {
      window.location.reload()
    }
  }, 100)
}

// Handle report
function handleReport(): void {
  if (!error.value) return

  emit('report', error.value)

  // Open issue reporting modal or redirect to support
  // This can be customized based on your error reporting system
  console.log('Report error:', {
    error: error.value,
    component: componentName.value,
    timestamp: errorTimestamp.value,
  })
}
</script>

<style scoped>
.error-boundary {
  padding: 48px 24px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.error-details {
  width: 100%;
  max-width: 800px;
  margin-top: 24px;
}

.error-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.error-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error-row strong {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
}

.error-row span {
  color: rgba(0, 0, 0, 0.65);
  font-size: 13px;
}

.error-stack {
  margin: 0;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  color: #d32f2f;
}
</style>
