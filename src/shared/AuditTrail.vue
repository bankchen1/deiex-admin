<template>
  <div class="audit-trail">
    <a-timeline :mode="mode">
      <a-timeline-item
        v-for="record in records"
        :key="record.id"
        :color="getTimelineColor(record.action)"
      >
        <template #dot>
          <component :is="getActionIcon(record.action)" />
        </template>

        <div class="audit-record">
          <div class="audit-header">
            <span class="audit-action">{{ formatAction(record.action) }}</span>
            <span class="audit-time">{{ formatDate(record.timestamp) }}</span>
          </div>

          <div class="audit-meta">
            <a-space size="small">
              <a-tag size="small">
                <template #icon><UserOutlined /></template>
                {{ record.adminName }}
              </a-tag>
              <a-tag v-if="record.ip" size="small">
                <template #icon><EnvironmentOutlined /></template>
                {{ record.ip }}
              </a-tag>
            </a-space>
          </div>

          <div v-if="showDetails && (record.before || record.after)" class="audit-details">
            <a-collapse ghost>
              <a-collapse-panel key="changes" header="View Changes">
                <div class="audit-changes">
                  <div v-if="record.before" class="change-section">
                    <div class="change-label">Before:</div>
                    <pre class="change-content">{{ formatValue(record.before) }}</pre>
                  </div>
                  <div v-if="record.after" class="change-section">
                    <div class="change-label">After:</div>
                    <pre class="change-content">{{ formatValue(record.after) }}</pre>
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>
      </a-timeline-item>
    </a-timeline>

    <div v-if="records.length === 0" class="audit-empty">
      <EmptyState
        title="No Audit Records"
        description="No audit trail available for this item"
        icon="folder"
        size="small"
      />
    </div>

    <div v-if="hasMore" class="audit-load-more">
      <a-button type="link" :loading="loading" @click="handleLoadMore"> Load More </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  UserOutlined,
  EnvironmentOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue'
import { formatDate as formatDateUtil } from '@/utils/date'
import EmptyState from './EmptyState.vue'

interface AuditRecord {
  id: string
  adminId: string
  adminName: string
  action: string
  objectType: string
  objectId: string
  before?: any
  after?: any
  ip: string
  userAgent: string
  timestamp: string
}

interface Props {
  records: AuditRecord[]
  mode?: 'left' | 'alternate' | 'right'
  showDetails?: boolean
  loading?: boolean
  hasMore?: boolean
}

interface Emits {
  (e: 'loadMore'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'left',
  showDetails: true,
  loading: false,
  hasMore: false,
})

const emit = defineEmits<Emits>()

// Action icon mapping
const actionIconMap: Record<string, any> = {
  create: PlusCircleOutlined,
  update: EditOutlined,
  delete: DeleteOutlined,
  approve: CheckCircleOutlined,
  reject: CloseCircleOutlined,
  publish: SyncOutlined,
  rollback: SyncOutlined,
}

// Timeline color mapping
const colorMap: Record<string, string> = {
  create: 'green',
  update: 'blue',
  delete: 'red',
  approve: 'green',
  reject: 'red',
  publish: 'purple',
  rollback: 'orange',
}

// Get action icon
function getActionIcon(action: string): any {
  const actionType = action.toLowerCase()
  return actionIconMap[actionType] || EditOutlined
}

// Get timeline color
function getTimelineColor(action: string): string {
  const actionType = action.toLowerCase()
  return colorMap[actionType] || 'blue'
}

// Format action text
function formatAction(action: string): string {
  return action
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Format date
function formatDate(date: string): string {
  return formatDateUtil(date, 'YYYY-MM-DD HH:mm:ss')
}

// Format value for display
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return 'N/A'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}

// Handle load more
function handleLoadMore(): void {
  emit('loadMore')
}
</script>

<style scoped>
.audit-trail {
  padding: 16px 0;
}

.audit-record {
  padding-bottom: 16px;
}

.audit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.audit-action {
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}

.audit-time {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.audit-meta {
  margin-bottom: 8px;
}

.audit-details {
  margin-top: 12px;
}

.audit-changes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.change-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.change-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
}

.change-content {
  margin: 0;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.audit-empty {
  padding: 24px 0;
}

.audit-load-more {
  text-align: center;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
}

:deep(.ant-timeline-item-content) {
  margin-left: 24px;
}
</style>
