<template>
  <a-modal
    :open="open"
    title="Replace Icon Files"
    width="600px"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <div class="replace-modal">
      <a-alert
        type="info"
        message="Replace icon files while keeping the same name and metadata"
        show-icon
        style="margin-bottom: 16px"
      />

      <a-descriptions v-if="icon" :column="1" bordered size="small" style="margin-bottom: 24px">
        <a-descriptions-item label="Icon Name">{{ icon.name }}</a-descriptions-item>
        <a-descriptions-item label="Type">
          <a-tag :color="icon.type === 'svg' ? 'blue' : 'green'">
            {{ icon.type.toUpperCase() }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Current Dimensions">
          {{ icon.width }}x{{ icon.height }}px
        </a-descriptions-item>
      </a-descriptions>

      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="New Light Version" required>
          <ImageUploader
            v-model:file="lightFile"
            :accept="acceptedFormats"
            :max-size="maxFileSize"
            :disabled="loading"
            @validate="handleLightValidation"
          >
            <template #tip>
              <div class="upload-tip">
                <div>{{ icon?.type === 'svg' ? 'SVG' : 'PNG' }} format</div>
                <div>Max size: {{ maxFileSize / 1024 / 1024 }}MB</div>
                <div v-if="lightValidation">
                  New dimensions: {{ lightValidation.dimensions?.width }}x{{
                    lightValidation.dimensions?.height
                  }}px
                </div>
              </div>
            </template>
          </ImageUploader>
        </a-form-item>

        <a-form-item label="New Dark Version">
          <ImageUploader
            v-model:file="darkFile"
            :accept="acceptedFormats"
            :max-size="maxFileSize"
            :disabled="loading"
            @validate="handleDarkValidation"
          >
            <template #tip>
              <div class="upload-tip">
                <div>Optional dark theme version</div>
                <div v-if="darkValidation">
                  New dimensions: {{ darkValidation.dimensions?.width }}x{{
                    darkValidation.dimensions?.height
                  }}px
                </div>
              </div>
            </template>
          </ImageUploader>
        </a-form-item>

        <a-form-item
          v-if="lightValidation || darkValidation"
          label="Validation"
          :wrapper-col="{ span: 24 }"
        >
          <a-space direction="vertical" style="width: 100%">
            <a-alert
              v-if="lightValidation && !lightValidation.valid"
              type="error"
              :message="`Light version: ${lightValidation.errors.join(', ')}`"
              show-icon
            />
            <a-alert
              v-if="lightValidation && lightValidation.warnings.length > 0"
              type="warning"
              :message="`Light version: ${lightValidation.warnings.join(', ')}`"
              show-icon
            />
            <a-alert
              v-if="darkValidation && !darkValidation.valid"
              type="error"
              :message="`Dark version: ${darkValidation.errors.join(', ')}`"
              show-icon
            />
            <a-alert
              v-if="darkValidation && darkValidation.warnings.length > 0"
              type="warning"
              :message="`Dark version: ${darkValidation.warnings.join(', ')}`"
              show-icon
            />
          </a-space>
        </a-form-item>
      </a-form>

      <a-alert
        v-if="dimensionMismatch"
        type="warning"
        message="Dimension Mismatch"
        description="The new file dimensions differ from the current icon. This may affect existing usages."
        show-icon
        style="margin-top: 16px"
      />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import ImageUploader from '@/shared/ImageUploader.vue'
import { useIconsStore } from '@/stores/icons'
import type { IconAsset, ValidationResult } from '@/services/api/facade'

interface Props {
  open: boolean
  icon?: IconAsset
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'success', icon: IconAsset): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const iconsStore = useIconsStore()
const loading = ref(false)
const lightFile = ref<File | null>(null)
const darkFile = ref<File | null>(null)
const lightValidation = ref<ValidationResult | null>(null)
const darkValidation = ref<ValidationResult | null>(null)

// Computed
const acceptedFormats = computed(() => {
  return props.icon?.type === 'svg' ? '.svg' : '.png'
})

const maxFileSize = computed(() => {
  return props.icon?.type === 'svg' ? 1024 * 1024 : 5 * 1024 * 1024
})

const dimensionMismatch = computed(() => {
  if (!props.icon || !lightValidation.value?.dimensions) return false

  return (
    lightValidation.value.dimensions.width !== props.icon.width ||
    lightValidation.value.dimensions.height !== props.icon.height
  )
})

// Watch for modal open/close
watch(
  () => props.open,
  (newVal) => {
    if (!newVal) {
      resetForm()
    }
  }
)

// Handlers
async function handleLightValidation(file: File) {
  if (!file) {
    lightValidation.value = null
    return
  }

  try {
    const result = await iconsStore.validateAsset(file)
    lightValidation.value = result
  } catch (error: any) {
    message.error('Failed to validate file')
    lightValidation.value = {
      valid: false,
      errors: [error.message || 'Validation failed'],
      warnings: [],
    }
  }
}

async function handleDarkValidation(file: File) {
  if (!file) {
    darkValidation.value = null
    return
  }

  try {
    const result = await iconsStore.validateAsset(file)
    darkValidation.value = result
  } catch (error: any) {
    message.error('Failed to validate file')
    darkValidation.value = {
      valid: false,
      errors: [error.message || 'Validation failed'],
      warnings: [],
    }
  }
}

async function handleSubmit() {
  if (!props.icon) return

  if (!lightFile.value) {
    message.error('Please upload a new light version')
    return
  }

  // Check validation results
  if (lightValidation.value && !lightValidation.value.valid) {
    message.error('Please fix validation errors for light version')
    return
  }

  if (darkValidation.value && !darkValidation.value.valid) {
    message.error('Please fix validation errors for dark version')
    return
  }

  loading.value = true

  try {
    const response = await iconsStore.replaceAsset(
      props.icon.id,
      lightFile.value,
      darkFile.value || undefined
    )

    message.success('Icon files replaced successfully')
    emit('success', response.data)
    handleClose()
  } catch (error: any) {
    message.error(error.message || 'Failed to replace icon files')
  } finally {
    loading.value = false
  }
}

function resetForm() {
  lightFile.value = null
  darkFile.value = null
  lightValidation.value = null
  darkValidation.value = null
}

function handleClose() {
  emit('update:open', false)
}
</script>

<style scoped>
.replace-modal {
  padding: 8px 0;
}

.upload-tip {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 1.5;
}
</style>
