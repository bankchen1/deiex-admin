<template>
  <a-modal
    :open="open"
    title="Publish Instruments"
    :width="900"
    :confirm-loading="loading"
    ok-text="Publish"
    @ok="handlePublish"
    @cancel="handleClose"
  >
    <a-space direction="vertical" style="width: 100%" :size="16">
      <!-- Version Notes -->
      <div>
        <label class="block mb-2 font-medium required">Version Notes</label>
        <a-textarea
          v-model:value="notes"
          :rows="3"
          placeholder="Describe the changes in this version..."
          :maxlength="500"
          show-count
        />
      </div>

      <!-- Tags -->
      <div>
        <label class="block mb-2 font-medium">Tags</label>
        <a-select
          v-model:value="tags"
          mode="tags"
          style="width: 100%"
          placeholder="Add tags (e.g., hotfix, feature, update)"
          :options="tagOptions"
        />
      </div>

      <!-- Impact Estimation -->
      <div v-if="impactData">
        <label class="block mb-2 font-medium">Impact Estimation</label>
        <a-card size="small">
          <a-space direction="vertical" style="width: 100%">
            <a-statistic
              title="Affected Users"
              :value="impactData.affectedUsers"
              :value-style="{ color: impactData.affectedUsers > 1000 ? '#cf1322' : '#3f8600' }"
            />
            <a-statistic
              title="Affected Orders"
              :value="impactData.affectedOrders"
              :value-style="{ color: impactData.affectedOrders > 100 ? '#cf1322' : '#3f8600' }"
            />
            <div v-if="impactData.warnings.length > 0">
              <a-divider style="margin: 12px 0" />
              <div class="font-medium mb-2">Warnings:</div>
              <a-alert
                v-for="(warning, index) in impactData.warnings"
                :key="index"
                :message="warning"
                type="warning"
                show-icon
                class="mb-2"
              />
            </div>
          </a-space>
        </a-card>
      </div>

      <!-- Diff Viewer -->
      <div v-if="diffData">
        <label class="block mb-2 font-medium">Changes Preview</label>
        <DiffViewer
          :old-value="diffData.published"
          :new-value="diffData.drafts"
          format="table"
          highlight-changes
        />
      </div>

      <!-- Confirmation -->
      <div>
        <a-alert
          message="Publishing will make these changes live immediately"
          description="All users will see the updated instrument configurations. This action cannot be undone, but you can rollback to a previous version if needed."
          type="info"
          show-icon
        />
      </div>

      <!-- Final Confirmation Checkbox -->
      <div>
        <a-checkbox v-model:checked="confirmed">
          I understand the impact and want to proceed with publishing
        </a-checkbox>
      </div>
    </a-space>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import DiffViewer from '@/shared/DiffViewer.vue'
import { useInstrumentsStore } from '@/stores/instruments'

interface Props {
  open: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const instrumentsStore = useInstrumentsStore()

// State
const loading = ref(false)
const notes = ref('')
const tags = ref<string[]>([])
const confirmed = ref(false)
const impactData = ref<any>(null)
const diffData = ref<any>(null)

// Tag options
const tagOptions = [
  { label: 'Hotfix', value: 'hotfix' },
  { label: 'Feature', value: 'feature' },
  { label: 'Update', value: 'update' },
  { label: 'Bugfix', value: 'bugfix' },
  { label: 'Enhancement', value: 'enhancement' },
]

// Watch for modal open to fetch data
watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      await fetchImpactAndDiff()
    } else {
      resetForm()
    }
  }
)

// Methods
async function fetchImpactAndDiff() {
  loading.value = true
  try {
    // Fetch impact estimation
    const impactResponse = await instrumentsStore.fetchImpactEstimation()
    impactData.value = impactResponse.data

    // Fetch diff
    const diffResponse = await instrumentsStore.fetchDiff()
    diffData.value = diffResponse.data
  } catch (error) {
    console.error('Failed to fetch impact and diff:', error)
  } finally {
    loading.value = false
  }
}

async function handlePublish() {
  if (!notes.value.trim()) {
    message.warning('Please provide version notes')
    return
  }

  if (!confirmed.value) {
    message.warning('Please confirm that you understand the impact')
    return
  }

  // Check for high-impact warnings
  if (impactData.value && impactData.value.warnings.length > 0) {
    const hasHighImpact =
      impactData.value.affectedUsers > 1000 || impactData.value.affectedOrders > 100
    if (hasHighImpact) {
      message.warning('This publish has high impact. Please review warnings carefully.')
    }
  }

  loading.value = true
  try {
    await instrumentsStore.publish({
      notes: notes.value,
      tags: tags.value,
    })
    message.success('Instruments published successfully')
    emit('success')
    handleClose()
  } catch (error: any) {
    console.error('Failed to publish:', error)
    message.error(error.message || 'Failed to publish instruments')
  } finally {
    loading.value = false
  }
}

function handleClose() {
  emit('update:open', false)
}

function resetForm() {
  notes.value = ''
  tags.value = []
  confirmed.value = false
  impactData.value = null
  diffData.value = null
}
</script>

<style scoped>
.block {
  display: block;
}

.mb-2 {
  margin-bottom: 8px;
}

.font-medium {
  font-weight: 500;
}

.required::after {
  content: ' *';
  color: #ff4d4f;
}
</style>
