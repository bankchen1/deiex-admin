<template>
  <a-modal
    :open="open"
    title="Publish Calendar Changes"
    :confirm-loading="loading"
    :width="800"
    ok-text="Publish"
    cancel-text="Cancel"
    @ok="handlePublish"
    @cancel="handleClose"
  >
    <a-spin :spinning="loadingDiff">
      <a-space direction="vertical" style="width: 100%" :size="16">
        <a-alert
          type="warning"
          message="Review Changes Before Publishing"
          description="Please review all changes carefully. Once published, these changes will be applied to production immediately."
          show-icon
        />

        <!-- Version Notes -->
        <a-form layout="vertical">
          <a-form-item label="Version Notes" required>
            <a-textarea
              v-model:value="versionNotes"
              placeholder="Describe the changes in this version"
              :rows="3"
              :max-length="500"
              show-count
            />
          </a-form-item>

          <a-form-item label="Tags (Optional)">
            <a-select
              v-model:value="versionTags"
              mode="tags"
              placeholder="Add tags for this version"
              style="width: 100%"
            >
              <a-select-option value="funding">Funding</a-select-option>
              <a-select-option value="maintenance">Maintenance</a-select-option>
              <a-select-option value="announcement">Announcement</a-select-option>
              <a-select-option value="urgent">Urgent</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>

        <!-- Diff Summary -->
        <a-card title="Changes Summary" size="small">
          <a-descriptions :column="2" size="small" bordered>
            <a-descriptions-item label="Funding Rules">
              <a-tag color="green">+{{ diffData?.funding?.added || 0 }}</a-tag>
              <a-tag color="orange">~{{ diffData?.funding?.modified || 0 }}</a-tag>
              <a-tag color="red">-{{ diffData?.funding?.deleted || 0 }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Maintenance">
              <a-tag color="green">+{{ diffData?.maintenance?.added || 0 }}</a-tag>
              <a-tag color="orange">~{{ diffData?.maintenance?.modified || 0 }}</a-tag>
              <a-tag color="red">-{{ diffData?.maintenance?.deleted || 0 }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Announcements">
              <a-tag color="green">+{{ diffData?.announcements?.added || 0 }}</a-tag>
              <a-tag color="orange">~{{ diffData?.announcements?.modified || 0 }}</a-tag>
              <a-tag color="red">-{{ diffData?.announcements?.deleted || 0 }}</a-tag>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- Detailed Changes -->
        <a-tabs v-if="diffData" default-active-key="funding">
          <a-tab-pane key="funding" tab="Funding Rules">
            <DiffViewer
              v-if="diffData.funding"
              :old-value="diffData.funding.old"
              :new-value="diffData.funding.new"
              format="json"
            />
            <a-empty v-else description="No changes" />
          </a-tab-pane>

          <a-tab-pane key="maintenance" tab="Maintenance">
            <DiffViewer
              v-if="diffData.maintenance"
              :old-value="diffData.maintenance.old"
              :new-value="diffData.maintenance.new"
              format="json"
            />
            <a-empty v-else description="No changes" />
          </a-tab-pane>

          <a-tab-pane key="announcements" tab="Announcements">
            <DiffViewer
              v-if="diffData.announcements"
              :old-value="diffData.announcements.old"
              :new-value="diffData.announcements.new"
              format="json"
            />
            <a-empty v-else description="No changes" />
          </a-tab-pane>
        </a-tabs>
      </a-space>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import DiffViewer from '@/shared/DiffViewer.vue'

interface Props {
  open: boolean
  diffData?: any
  loading?: boolean
  loadingDiff?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'publish', payload: { notes: string; tags?: string[] }): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  diffData: null,
  loading: false,
  loadingDiff: false,
})

const emit = defineEmits<Emits>()

const versionNotes = ref('')
const versionTags = ref<string[]>([])

watch(
  () => props.open,
  (newOpen) => {
    if (!newOpen) {
      versionNotes.value = ''
      versionTags.value = []
    }
  }
)

function handlePublish() {
  if (!versionNotes.value.trim()) {
    return
  }

  emit('publish', {
    notes: versionNotes.value,
    tags: versionTags.value.length > 0 ? versionTags.value : undefined,
  })
}

function handleClose() {
  emit('update:open', false)
  emit('close')
}
</script>
