<template>
  <a-modal
    :open="open"
    title="Publish Margin Configuration"
    :width="800"
    :confirm-loading="loading"
    ok-text="Publish"
    @ok="handlePublish"
    @cancel="handleCancel"
  >
    <a-alert
      type="warning"
      message="Publishing will apply changes to production"
      description="Please review the changes carefully before publishing. This action will affect all users with open positions."
      show-icon
      style="margin-bottom: 16px"
    />

    <a-tabs v-model:active-key="activeTab">
      <a-tab-pane key="diff" tab="Changes">
        <a-spin :spinning="loadingDiff">
          <div v-if="diffData">
            <a-card
              v-if="diffData.templates"
              title="Template Changes"
              size="small"
              style="margin-bottom: 16px"
            >
              <a-descriptions :column="1" size="small" bordered>
                <a-descriptions-item label="Added">
                  <a-tag color="green">{{ diffData.templates.added?.length || 0 }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="Modified">
                  <a-tag color="blue">{{ diffData.templates.modified?.length || 0 }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="Deleted">
                  <a-tag color="red">{{ diffData.templates.deleted?.length || 0 }}</a-tag>
                </a-descriptions-item>
              </a-descriptions>
            </a-card>

            <a-card v-if="diffData.bindings" title="Binding Changes" size="small">
              <a-descriptions :column="1" size="small" bordered>
                <a-descriptions-item label="Added">
                  <a-tag color="green">{{ diffData.bindings.added?.length || 0 }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="Modified">
                  <a-tag color="blue">{{ diffData.bindings.modified?.length || 0 }}</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="Deleted">
                  <a-tag color="red">{{ diffData.bindings.deleted?.length || 0 }}</a-tag>
                </a-descriptions-item>
              </a-descriptions>
            </a-card>
          </div>
          <a-empty v-else description="No changes to publish" />
        </a-spin>
      </a-tab-pane>

      <a-tab-pane key="impact" tab="Impact Estimation">
        <a-spin :spinning="loadingImpact">
          <div v-if="impactData">
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="Affected Symbols">
                <a-tag color="blue">{{ impactData.affectedSymbols?.length || 0 }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Affected Positions">
                <a-tag color="orange">{{ impactData.affectedPositions || 0 }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Affected Users">
                <a-tag color="purple">{{ impactData.affectedUsers || 0 }}</a-tag>
              </a-descriptions-item>
            </a-descriptions>

            <a-alert
              v-if="impactData.warnings && impactData.warnings.length > 0"
              type="warning"
              message="Warnings"
              style="margin-top: 16px"
            >
              <template #description>
                <ul style="margin: 0; padding-left: 20px">
                  <li v-for="(warning, index) in impactData.warnings" :key="index">
                    {{ warning }}
                  </li>
                </ul>
              </template>
            </a-alert>

            <a-card
              v-if="impactData.affectedSymbols && impactData.affectedSymbols.length > 0"
              title="Affected Symbols"
              size="small"
              style="margin-top: 16px"
            >
              <a-space wrap>
                <a-tag v-for="symbol in impactData.affectedSymbols" :key="symbol" color="blue">
                  {{ symbol }}
                </a-tag>
              </a-space>
            </a-card>
          </div>
          <a-empty v-else description="No impact data available" />
        </a-spin>
      </a-tab-pane>
    </a-tabs>

    <a-divider />

    <a-form layout="vertical">
      <a-form-item
        label="Version Notes"
        name="notes"
        :rules="[{ required: true, message: 'Please enter version notes' }]"
      >
        <a-textarea
          v-model:value="notes"
          :rows="3"
          placeholder="Describe the changes in this version..."
          :disabled="loading"
        />
      </a-form-item>

      <a-form-item label="Tags (Optional)" name="tags">
        <a-select
          v-model:value="tags"
          mode="tags"
          placeholder="Add tags (e.g., hotfix, feature, optimization)"
          :disabled="loading"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  open: boolean
  diffData?: any
  impactData?: any
  loading?: boolean
  loadingDiff?: boolean
  loadingImpact?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'publish', value: { notes: string; tags?: string[] }): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  diffData: null,
  impactData: null,
  loading: false,
  loadingDiff: false,
  loadingImpact: false,
})

const emit = defineEmits<Emits>()

const activeTab = ref('diff')
const notes = ref('')
const tags = ref<string[]>([])

watch(
  () => props.open,
  (newValue) => {
    if (!newValue) {
      // Reset form when modal closes
      notes.value = ''
      tags.value = []
      activeTab.value = 'diff'
    }
  }
)

function handlePublish() {
  if (!notes.value.trim()) {
    return
  }
  emit('publish', {
    notes: notes.value,
    tags: tags.value.length > 0 ? tags.value : undefined,
  })
}

function handleCancel() {
  emit('update:open', false)
  emit('close')
}
</script>
