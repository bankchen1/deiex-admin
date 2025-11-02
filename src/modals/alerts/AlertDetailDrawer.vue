<template>
  <a-drawer
    v-model:open="visible"
    title="Alert Details"
    width="720"
    :closable="true"
    @close="handleClose"
  >
    <a-spin :spinning="loading">
      <div v-if="alert" class="alert-detail">
        <!-- Header -->
        <div class="alert-header">
          <a-tag :color="getTypeColor(alert.type)">{{ alert.type.toUpperCase() }}</a-tag>
          <a-badge :status="getPriorityStatus(alert.priority)" :text="alert.priority" />
          <a-tag :color="getStatusColor(alert.status)">{{ alert.status }}</a-tag>
        </div>

        <!-- Title and Description -->
        <div class="alert-content">
          <h3>{{ alert.title }}</h3>
          <p class="description">{{ alert.description }}</p>
        </div>

        <!-- Metadata -->
        <a-descriptions :column="2" bordered size="small" class="alert-metadata">
          <a-descriptions-item label="Created At">
            {{ formatDateTime(alert.createdAt) }}
          </a-descriptions-item>
          <a-descriptions-item label="Assigned To">
            {{ alert.assignedTo || 'Unassigned' }}
          </a-descriptions-item>
          <a-descriptions-item v-if="alert.resolvedAt" label="Resolved At">
            {{ formatDateTime(alert.resolvedAt) }}
          </a-descriptions-item>
          <a-descriptions-item v-if="alert.resolvedBy" label="Resolved By">
            {{ alert.resolvedBy }}
          </a-descriptions-item>
        </a-descriptions>

        <!-- Related Objects -->
        <div v-if="alert.relatedObjects && alert.relatedObjects.length > 0" class="related-objects">
          <h4>Related Objects</h4>
          <a-list :data-source="alert.relatedObjects" size="small" bordered>
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <a-button type="link" size="small" @click="handleNavigate(item)">
                      {{ item.label }}
                    </a-button>
                  </template>
                  <template #description>{{ item.type }}</template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </div>

        <!-- Notes -->
        <div v-if="alert.notes" class="alert-notes">
          <h4>Notes</h4>
          <a-textarea v-model:value="alert.notes" :rows="4" disabled />
        </div>

        <!-- Additional Metadata -->
        <div v-if="alert.metadata" class="alert-extra-metadata">
          <h4>Additional Information</h4>
          <a-descriptions :column="1" bordered size="small">
            <a-descriptions-item
              v-for="(value, key) in alert.metadata"
              :key="key"
              :label="formatLabel(key)"
            >
              {{ formatValue(value) }}
            </a-descriptions-item>
          </a-descriptions>
        </div>

        <!-- Actions -->
        <div v-if="alert.status === 'pending'" class="alert-actions">
          <a-space>
            <a-button type="primary" @click="handleResolve">Mark as Resolved</a-button>
            <a-button @click="handleInProgress">Mark as In Progress</a-button>
          </a-space>
        </div>
      </div>
    </a-spin>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useDashboardStore } from '@/stores/dashboard'
import { formatDateTime } from '@/utils/date'
import type { AlertDetail } from '@/services/api/dashboard'

interface Props {
  alertId?: string
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'resolved', alertId: string): void
  (e: 'navigate', item: any): void
}>()

const dashboardStore = useDashboardStore()

const visible = ref(props.open)
const loading = ref(false)
const alert = ref<AlertDetail | null>(null)

watch(
  () => props.open,
  (newVal) => {
    visible.value = newVal
    if (newVal && props.alertId) {
      loadAlertDetail()
    }
  }
)

watch(visible, (newVal) => {
  emit('update:open', newVal)
})

const loadAlertDetail = async () => {
  if (!props.alertId) return

  loading.value = true
  try {
    await dashboardStore.fetchAlertById(props.alertId)
    alert.value = dashboardStore.currentAlert
  } catch (error) {
    message.error('Failed to load alert details')
  } finally {
    loading.value = false
  }
}

const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    kyc: 'blue',
    withdrawal: 'orange',
    order: 'purple',
    alert: 'red',
  }
  return colorMap[type] || 'default'
}

const getPriorityStatus = (priority: string) => {
  const statusMap: Record<string, any> = {
    high: 'error',
    medium: 'warning',
    low: 'default',
  }
  return statusMap[priority] || 'default'
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    in_progress: 'blue',
    resolved: 'green',
  }
  return colorMap[status] || 'default'
}

const formatLabel = (key: string) => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatValue = (value: any) => {
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}

const handleResolve = async () => {
  if (!props.alertId) return

  try {
    await dashboardStore.updateAlertStatus(props.alertId, 'resolved')
    message.success('Alert marked as resolved')
    emit('resolved', props.alertId)
    handleClose()
  } catch (error) {
    message.error('Failed to update alert status')
  }
}

const handleInProgress = async () => {
  if (!props.alertId) return

  try {
    await dashboardStore.updateAlertStatus(props.alertId, 'in_progress')
    message.success('Alert marked as in progress')
    if (alert.value) {
      alert.value.status = 'in_progress'
    }
  } catch (error) {
    message.error('Failed to update alert status')
  }
}

const handleNavigate = (item: any) => {
  emit('navigate', item)
}

const handleClose = () => {
  visible.value = false
  alert.value = null
}
</script>

<style scoped>
.alert-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.alert-header {
  display: flex;
  gap: 8px;
  align-items: center;
}

.alert-content h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
}

.alert-content .description {
  color: rgba(0, 0, 0, 0.65);
  margin: 0;
}

.alert-metadata,
.related-objects,
.alert-notes,
.alert-extra-metadata {
  margin-top: 16px;
}

.related-objects h4,
.alert-notes h4,
.alert-extra-metadata h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
}

.alert-actions {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}
</style>
