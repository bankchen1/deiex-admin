<template>
  <div class="image-uploader">
    <a-upload
      v-model:file-list="fileList"
      :list-type="listType"
      :accept="accept"
      :max-count="maxCount"
      :before-upload="handleBeforeUpload"
      :custom-request="handleUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :disabled="disabled"
    >
      <div v-if="fileList.length < maxCount" class="upload-button">
        <LoadingOutlined v-if="uploading" />
        <PlusOutlined v-else />
        <div class="upload-text">{{ uploadText }}</div>
      </div>
    </a-upload>

    <div v-if="showValidation" class="upload-validation">
      <a-space direction="vertical" size="small">
        <span v-if="maxSize" class="validation-text">
          Max size: {{ formatFileSize(maxSize) }}
        </span>
        <span v-if="maxWidth || maxHeight" class="validation-text">
          Max dimensions: {{ maxWidth }}x{{ maxHeight }}px
        </span>
        <span v-if="accept" class="validation-text"> Accepted formats: {{ accept }} </span>
      </a-space>
    </div>

    <!-- Image preview modal -->
    <a-modal v-model:open="previewVisible" :title="previewTitle" :footer="null">
      <img :src="previewImage" alt="preview" style="width: 100%" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'

interface Props {
  modelValue?: string | string[]
  listType?: 'text' | 'picture' | 'picture-card'
  accept?: string
  maxCount?: number
  maxSize?: number // in bytes
  maxWidth?: number
  maxHeight?: number
  disabled?: boolean
  uploadText?: string
  showValidation?: boolean
  uploadFn?: (file: File) => Promise<string>
}

interface Emits {
  (e: 'update:modelValue', value: string | string[]): void
  (e: 'change', value: string | string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  listType: 'picture-card',
  accept: 'image/*',
  maxCount: 1,
  maxSize: 5 * 1024 * 1024, // 5MB
  maxWidth: 2048,
  maxHeight: 2048,
  disabled: false,
  uploadText: 'Upload',
  showValidation: true,
})

const emit = defineEmits<Emits>()

// State
const fileList = ref<any[]>([])
const uploading = ref(false)
const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')

// Initialize file list from modelValue
watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      fileList.value = []
      return
    }

    const urls = Array.isArray(value) ? value : [value]
    fileList.value = urls.map((url, index) => ({
      uid: `${index}`,
      name: `image-${index}`,
      status: 'done',
      url,
    }))
  },
  { immediate: true }
)

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// Validate image dimensions
function validateImageDimensions(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    if (!props.maxWidth && !props.maxHeight) {
      resolve(true)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const valid =
          (!props.maxWidth || img.width <= props.maxWidth) &&
          (!props.maxHeight || img.height <= props.maxHeight)

        if (!valid) {
          message.error(`Image dimensions must not exceed ${props.maxWidth}x${props.maxHeight}px`)
        }

        resolve(valid)
      }
      img.onerror = () => {
        message.error('Failed to load image')
        resolve(false)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

// Before upload validation
async function handleBeforeUpload(file: File): Promise<boolean> {
  // Validate file size
  if (props.maxSize && file.size > props.maxSize) {
    message.error(`File size must not exceed ${formatFileSize(props.maxSize)}`)
    return false
  }

  // Validate file type
  if (props.accept && !file.type.match(props.accept.replace('*', '.*'))) {
    message.error(`File type must be ${props.accept}`)
    return false
  }

  // Validate image dimensions
  const dimensionsValid = await validateImageDimensions(file)
  if (!dimensionsValid) {
    return false
  }

  return true
}

// Handle upload
async function handleUpload(options: any): Promise<void> {
  const { file, onSuccess, onError } = options

  uploading.value = true

  try {
    let url: string

    if (props.uploadFn) {
      // Use custom upload function
      url = await props.uploadFn(file)
    } else {
      // Default: convert to base64 data URL
      url = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    }

    onSuccess({ url }, file)

    // Update model value
    const currentUrls = fileList.value
      .filter((f) => f.status === 'done')
      .map((f) => f.url || f.response?.url)
      .filter(Boolean)

    const newValue = props.maxCount === 1 ? url : [...currentUrls, url]
    emit('update:modelValue', newValue)
    emit('change', newValue)

    message.success('Upload successful')
  } catch (error) {
    console.error('Upload failed:', error)
    onError(error)
    message.error('Upload failed')
  } finally {
    uploading.value = false
  }
}

// Handle preview
function handlePreview(file: any): void {
  previewImage.value = file.url || file.preview
  previewVisible.value = true
  previewTitle.value = file.name || 'Image Preview'
}

// Handle remove
function handleRemove(file: any): void {
  const remainingUrls = fileList.value
    .filter((f) => f.uid !== file.uid && f.status === 'done')
    .map((f) => f.url || f.response?.url)
    .filter(Boolean)

  const newValue = props.maxCount === 1 ? '' : remainingUrls
  emit('update:modelValue', newValue)
  emit('change', newValue)
}
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.upload-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: rgba(0, 0, 0, 0.45);
}

.upload-text {
  margin-top: 8px;
  font-size: 12px;
}

.upload-validation {
  margin-top: 8px;
}

.validation-text {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

:deep(.ant-upload-select) {
  width: 100%;
  height: 100%;
}
</style>
