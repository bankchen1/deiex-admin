<template>
  <div class="version-bar">
    <div class="version-info">
      <a-space>
        <a-tag color="blue">
          <template #icon><TagOutlined /></template>
          Current: {{ currentVersion }}
        </a-tag>
        <a-tag v-if="draftExists" color="orange">
          <template #icon><EditOutlined /></template>
          Draft Available
        </a-tag>
      </a-space>
    </div>

    <div class="version-actions">
      <a-space>
        <a-button v-if="draftExists" type="primary" :loading="publishing" @click="handlePublish">
          <template #icon><CloudUploadOutlined /></template>
          Publish
        </a-button>

        <a-button v-if="draftExists" @click="handleViewDiff">
          <template #icon><DiffOutlined /></template>
          View Diff
        </a-button>

        <a-dropdown>
          <a-button>
            <template #icon><HistoryOutlined /></template>
            Version History
            <DownOutlined />
          </a-button>
          <template #overlay>
            <a-menu @click="handleVersionAction">
              <a-menu-item v-for="version in versions" :key="version.id">
                <div class="version-item">
                  <div class="version-header">
                    <span class="version-number">{{ version.version }}</span>
                    <a-tag v-if="version.tags && version.tags.length > 0" size="small">
                      {{ version.tags[0] }}
                    </a-tag>
                  </div>
                  <div class="version-meta">
                    <span>{{ version.createdBy }}</span>
                    <span>{{ formatDate(version.createdAt) }}</span>
                  </div>
                  <div v-if="version.notes" class="version-notes">
                    {{ version.notes }}
                  </div>
                  <a-button
                    v-if="version.version !== currentVersion"
                    type="link"
                    size="small"
                    danger
                    @click.stop="handleRollback(version.id)"
                  >
                    Rollback
                  </a-button>
                </div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </div>

    <!-- Publish confirmation modal -->
    <a-modal
      v-model:open="showPublishModal"
      title="Publish Changes"
      :confirm-loading="publishing"
      @ok="handleConfirmPublish"
    >
      <a-form layout="vertical">
        <a-form-item label="Version Notes" required>
          <a-textarea
            v-model:value="publishNotes"
            placeholder="Describe the changes in this version..."
            :rows="4"
          />
        </a-form-item>
        <a-form-item label="Tags (optional)">
          <a-select
            v-model:value="publishTags"
            mode="tags"
            placeholder="Add tags (e.g., feature, bugfix, hotfix)"
          />
        </a-form-item>
        <a-alert
          v-if="impactEstimation"
          type="warning"
          :message="impactEstimation"
          show-icon
          style="margin-top: 16px"
        />
      </a-form>
    </a-modal>

    <!-- Rollback confirmation modal -->
    <a-modal
      v-model:open="showRollbackModal"
      title="Rollback Confirmation"
      :confirm-loading="rollingBack"
      ok-text="Rollback"
      ok-type="danger"
      @ok="handleConfirmRollback"
    >
      <a-alert
        type="error"
        message="Warning"
        description="Rolling back will replace the current published version with the selected version. This action cannot be undone."
        show-icon
        style="margin-bottom: 16px"
      />
      <p>
        Are you sure you want to rollback to version <strong>{{ selectedVersion?.version }}</strong
        >?
      </p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  TagOutlined,
  EditOutlined,
  CloudUploadOutlined,
  DiffOutlined,
  HistoryOutlined,
  DownOutlined,
} from '@ant-design/icons-vue'
import { formatDate as formatDateUtil } from '@/utils/date'

interface Version {
  id: string
  version: string
  createdAt: string
  createdBy: string
  notes: string
  tags: string[]
}

interface Props {
  currentVersion: string
  draftExists: boolean
  versions: Version[]
  impactEstimation?: string
}

interface Emits {
  (e: 'publish', data: { notes: string; tags: string[] }): Promise<void>
  (e: 'rollback', versionId: string): Promise<void>
  (e: 'viewDiff'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const showPublishModal = ref(false)
const showRollbackModal = ref(false)
const publishing = ref(false)
const rollingBack = ref(false)
const publishNotes = ref('')
const publishTags = ref<string[]>([])
const selectedVersion = ref<Version | null>(null)

// Format date
function formatDate(date: string): string {
  return formatDateUtil(date, 'YYYY-MM-DD HH:mm')
}

// Handle publish
function handlePublish(): void {
  publishNotes.value = ''
  publishTags.value = []
  showPublishModal.value = true
}

// Handle confirm publish
async function handleConfirmPublish(): Promise<void> {
  if (!publishNotes.value.trim()) {
    return
  }

  publishing.value = true
  try {
    await emit('publish', {
      notes: publishNotes.value,
      tags: publishTags.value,
    })
    showPublishModal.value = false
  } catch (error) {
    console.error('Publish failed:', error)
  } finally {
    publishing.value = false
  }
}

// Handle view diff
function handleViewDiff(): void {
  emit('viewDiff')
}

// Handle rollback
function handleRollback(versionId: string): void {
  selectedVersion.value = props.versions.find((v) => v.id === versionId) || null
  showRollbackModal.value = true
}

// Handle confirm rollback
async function handleConfirmRollback(): Promise<void> {
  if (!selectedVersion.value) return

  rollingBack.value = true
  try {
    await emit('rollback', selectedVersion.value.id)
    showRollbackModal.value = false
  } catch (error) {
    console.error('Rollback failed:', error)
  } finally {
    rollingBack.value = false
  }
}

// Handle version action
function handleVersionAction({ key }: { key: string }): void {
  // This is handled by individual version items
}
</script>

<style scoped>
.version-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 16px;
}

.version-info {
  flex: 1;
}

.version-actions {
  display: flex;
  gap: 8px;
}

.version-item {
  padding: 8px 0;
  min-width: 300px;
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.version-number {
  font-weight: 600;
  font-size: 14px;
}

.version-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.version-notes {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
