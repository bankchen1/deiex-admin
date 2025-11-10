<template>
  <a-form
    :model="formState"
    :rules="rules"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    @finish="handleSubmit"
  >
    <a-form-item label="Symbol" name="symbol" required>
      <a-input
        v-model:value="formState.symbol"
        placeholder="e.g., BTC/USDT, ETH/USDT"
        :disabled="loading || mode === 'edit'"
      />
      <template #extra> Trading pair symbol to map to an icon </template>
    </a-form-item>

    <a-form-item label="Icon" name="iconId" required>
      <IconPicker v-model:value="formState.iconId" :disabled="loading" @change="handleIconChange" />
      <template #extra> Select an icon from the asset library </template>
    </a-form-item>

    <a-form-item v-if="selectedIcon" label="Preview">
      <a-space direction="vertical" style="width: 100%">
        <div class="icon-preview">
          <div class="preview-item">
            <div class="preview-label">Light:</div>
            <img :src="selectedIcon.lightUrl" :alt="selectedIcon.name" class="preview-image" />
          </div>
          <div v-if="selectedIcon.darkUrl" class="preview-item">
            <div class="preview-label">Dark:</div>
            <img :src="selectedIcon.darkUrl" :alt="selectedIcon.name" class="preview-image" />
          </div>
        </div>
        <a-descriptions size="small" :column="2" bordered>
          <a-descriptions-item label="Name">{{ selectedIcon.name }}</a-descriptions-item>
          <a-descriptions-item label="Type">{{
            selectedIcon.type.toUpperCase()
          }}</a-descriptions-item>
          <a-descriptions-item label="Dimensions">
            {{ selectedIcon.width }}x{{ selectedIcon.height }}px
          </a-descriptions-item>
          <a-descriptions-item label="Size">
            {{ formatFileSize(selectedIcon.fileSize) }}
          </a-descriptions-item>
        </a-descriptions>
      </a-space>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
      <a-space>
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ mode === 'create' ? 'Create Mapping' : 'Update Mapping' }}
        </a-button>
        <a-button @click="handleCancel">Cancel</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import IconPicker from '@/shared/IconPicker.vue'
import { useIconsStore } from '@/stores/icons'
import type { IconMapping, IconAsset } from '@/services/api/facade'

interface Props {
  mode?: 'create' | 'edit'
  initialData?: IconMapping
}

interface Emits {
  (e: 'success', data: IconMapping): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
})

const emit = defineEmits<Emits>()

const iconsStore = useIconsStore()
const loading = ref(false)
const selectedIcon = ref<IconAsset | null>(null)

// Form state
const formState = reactive({
  symbol: '',
  iconId: '',
})

// Form rules
const rules = {
  symbol: [
    { required: true, message: 'Please enter symbol' },
    {
      pattern: /^[A-Z0-9]+\/[A-Z0-9]+$/,
      message: 'Symbol must be in format BASE/QUOTE (e.g., BTC/USDT)',
    },
  ],
  iconId: [{ required: true, message: 'Please select an icon' }],
}

// Initialize form with data
if (props.initialData && props.mode === 'edit') {
  formState.symbol = props.initialData.symbol
  formState.iconId = props.initialData.iconId

  // Load icon details
  loadIconDetails(props.initialData.iconId)
}

// Handlers
async function handleIconChange(iconId: string) {
  if (iconId) {
    await loadIconDetails(iconId)
  } else {
    selectedIcon.value = null
  }
}

async function loadIconDetails(iconId: string) {
  try {
    const response = await iconsStore.fetchAssetById(iconId)
    selectedIcon.value = response.data
  } catch (error: any) {
    message.error('Failed to load icon details')
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

async function handleSubmit() {
  loading.value = true

  try {
    if (props.mode === 'create') {
      const response = await iconsStore.createMapping({
        symbol: formState.symbol,
        iconId: formState.iconId,
      })

      message.success('Mapping created successfully')
      emit('success', response.data)
    } else {
      if (!props.initialData) return

      const response = await iconsStore.updateMapping(props.initialData.id, {
        iconId: formState.iconId,
      })

      message.success('Mapping updated successfully')
      emit('success', response.data)
    }
  } catch (error: any) {
    message.error(error.message || 'Operation failed')
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped>
.icon-preview {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
}

.preview-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 4px;
  background: white;
}
</style>
