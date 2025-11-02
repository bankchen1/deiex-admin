<template>
  <a-modal
    :open="open"
    title="Publish Fee Configuration"
    :width="900"
    :confirm-loading="loading"
    @ok="handlePublish"
    @cancel="handleCancel"
  >
    <a-space direction="vertical" style="width: 100%" :size="16">
      <a-alert
        type="warning"
        message="Publishing Changes"
        description="Publishing will apply all draft changes to production. Please review the changes carefully before proceeding."
        show-icon
      />

      <a-tabs v-model:active-key="activeTab">
        <!-- Diff Tab -->
        <a-tab-pane key="diff" tab="Changes">
          <a-spin :spinning="loadingDiff">
            <DiffViewer v-if="diffData" :diff-data="diffData" format="table" />
            <a-empty v-else description="No changes to display" />
          </a-spin>
        </a-tab-pane>

        <!-- Summary Tab -->
        <a-tab-pane key="summary" tab="Summary">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="Trading Fees Added">
              {{ diffData?.tradingFees?.added?.length || 0 }}
            </a-descriptions-item>
            <a-descriptions-item label="Trading Fees Modified">
              {{ diffData?.tradingFees?.modified?.length || 0 }}
            </a-descriptions-item>
            <a-descriptions-item label="Trading Fees Deleted">
              {{ diffData?.tradingFees?.deleted?.length || 0 }}
            </a-descriptions-item>
            <a-descriptions-item label="Withdrawal Fees Added">
              {{ diffData?.withdrawalFees?.added?.length || 0 }}
            </a-descriptions-item>
            <a-descriptions-item label="Withdrawal Fees Modified">
              {{ diffData?.withdrawalFees?.modified?.length || 0 }}
            </a-descriptions-item>
            <a-descriptions-item label="Withdrawal Fees Deleted">
              {{ diffData?.withdrawalFees?.deleted?.length || 0 }}
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
      </a-tabs>

      <a-form layout="vertical">
        <a-form-item label="Version Notes" required>
          <a-textarea
            v-model:value="notes"
            :rows="4"
            placeholder="Describe the changes in this version..."
          />
        </a-form-item>

        <a-form-item label="Tags (Optional)">
          <a-select
            v-model:value="tags"
            mode="tags"
            placeholder="Add tags (e.g., hotfix, feature, optimization)"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-space>

    <template #footer>
      <a-button @click="handleCancel">Cancel</a-button>
      <a-button type="primary" :loading="loading" :disabled="!notes" @click="handlePublish">
        Publish
      </a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

const activeTab = ref('diff')
const notes = ref('')
const tags = ref<string[]>([])

function handlePublish() {
  if (!notes.value) {
    return
  }

  emit('publish', {
    notes: notes.value,
    tags: tags.value.length > 0 ? tags.value : undefined,
  })
}

function handleCancel() {
  notes.value = ''
  tags.value = []
  emit('update:open', false)
  emit('close')
}
</script>
