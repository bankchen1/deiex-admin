<template>
  <a-form
    :model="formState"
    :rules="rules"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    @finish="handleSubmit"
  >
    <a-form-item label="Icon Name" name="name" required>
      <a-input
        v-model:value="formState.name"
        placeholder="e.g., btc, eth, usdt"
        :disabled="loading"
      />
      <template #extra> Use lowercase, alphanumeric characters and hyphens only </template>
    </a-form-item>

    <a-form-item label="Type" name="type" required>
      <a-radio-group v-model:value="formState.type" :disabled="loading">
        <a-radio value="svg">SVG</a-radio>
        <a-radio value="png">PNG</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item label="Light Version" name="lightFile" required>
      <ImageUploader
        v-model:file="formState.lightFile"
        :accept="acceptedFormats"
        :max-size="maxFileSize"
        :disabled="loading"
        @validate="handleLightValidation"
      >
        <template #tip>
          <div class="upload-tip">
            <div>{{ formState.type === 'svg' ? 'SVG' : 'PNG' }} format</div>
            <div>Max size: {{ maxFileSize / 1024 / 1024 }}MB</div>
            <div v-if="lightValidation">
              Dimensions: {{ lightValidation.dimensions?.width }}x{{
                lightValidation.dimensions?.height
              }}px
            </div>
          </div>
        </template>
      </ImageUploader>
    </a-form-item>

    <a-form-item label="Dark Version" name="darkFile">
      <ImageUploader
        v-model:file="formState.darkFile"
        :accept="acceptedFormats"
        :max-size="maxFileSize"
        :disabled="loading"
        @validate="handleDarkValidation"
      >
        <template #tip>
          <div class="upload-tip">
            <div>Optional dark theme version</div>
            <div v-if="darkValidation">
              Dimensions: {{ darkValidation.dimensions?.width }}x{{
                darkValidation.dimensions?.height
              }}px
            </div>
          </div>
        </template>
      </ImageUploader>
    </a-form-item>

    <a-form-item label="Tags" name="tags">
      <TagPicker
        v-model:value="formState.tags"
        placeholder="Add tags (e.g., crypto, currency, token)"
        :disabled="loading"
      />
    </a-form-item>

    <a-form-item v-if="lightValidation || darkValidation" label="Validation">
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

    <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
      <a-space>
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ mode === 'create' ? 'Create Icon' : 'Update Icon' }}
        </a-button>
        <a-button @click="handleCancel">Cancel</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import ImageUploader from '@/shared/ImageUploader.vue'
import TagPicker from '@/shared/TagPicker.vue'
import { useIconsStore } from '@/stores/icons'
import type { IconAsset, ValidationResult } from '@/services/api/facade'

interface Props {
  mode?: 'create' | 'edit'
  initialData?: IconAsset
}

interface Emits {
  (e: 'success', data: IconAsset): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
})

const emit = defineEmits<Emits>()

const iconsStore = useIconsStore()
const loading = ref(false)

// Form state
const formState = reactive({
  name: '',
  type: 'svg' as 'svg' | 'png',
  lightFile: null as File | null,
  darkFile: null as File | null,
  tags: [] as string[],
})

// Validation results
const lightValidation = ref<ValidationResult | null>(null)
const darkValidation = ref<ValidationResult | null>(null)

// Computed
const acceptedFormats = computed(() => {
  return formState.type === 'svg' ? '.svg' : '.png'
})

const maxFileSize = computed(() => {
  return formState.type === 'svg' ? 1024 * 1024 : 5 * 1024 * 1024 // 1MB for SVG, 5MB for PNG
})

// Form rules
const rules = {
  name: [
    { required: true, message: 'Please enter icon name' },
    { pattern: /^[a-z0-9-]+$/, message: 'Only lowercase letters, numbers, and hyphens allowed' },
    { min: 2, max: 50, message: 'Name must be between 2 and 50 characters' },
  ],
  type: [{ required: true, message: 'Please select icon type' }],
  lightFile: [{ required: true, message: 'Please upload light version' }],
}

// Watch for type changes to clear files
watch(
  () => formState.type,
  () => {
    formState.lightFile = null
    formState.darkFile = null
    lightValidation.value = null
    darkValidation.value = null
  }
)

// Initialize form with data
if (props.initialData && props.mode === 'edit') {
  formState.name = props.initialData.name
  formState.type = props.initialData.type
  formState.tags = [...props.initialData.tags]
}

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
    if (props.mode === 'create') {
      if (!formState.lightFile) {
        message.error('Please upload light version')
        return
      }

      const response = await iconsStore.createAsset({
        name: formState.name,
        type: formState.type,
        lightFile: formState.lightFile,
        darkFile: formState.darkFile || undefined,
        tags: formState.tags,
      })

      message.success('Icon created successfully')
      emit('success', response.data)
    } else {
      // Edit mode - only update metadata
      if (!props.initialData) return

      const response = await iconsStore.updateAsset(props.initialData.id, {
        name: formState.name,
        tags: formState.tags,
      })

      message.success('Icon updated successfully')
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
.upload-tip {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 1.5;
}
</style>
