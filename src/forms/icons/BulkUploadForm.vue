<template>
  <div class="bulk-upload-form">
    <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="Upload Files" required>
        <a-upload-dragger
          v-model:file-list="fileList"
          :multiple="true"
          :accept="acceptedFormats"
          :before-upload="beforeUpload"
          :disabled="loading"
          @remove="handleRemove"
        >
          <p class="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="ant-upload-text">Click or drag files to this area to upload</p>
          <p class="ant-upload-hint">
            Support for SVG and PNG files. Maximum {{ maxFiles }} files at once.
            <br />
            SVG: max 1MB, PNG: max 5MB per file
          </p>
        </a-upload-dragger>
      </a-form-item>

      <a-form-item label="Auto Naming">
        <a-switch v-model:checked="formState.autoNaming" :disabled="loading" />
        <template #extra> Automatically generate icon names from filenames </template>
      </a-form-item>

      <a-form-item v-if="!formState.autoNaming" label="Name Prefix">
        <a-input
          v-model:value="formState.prefix"
          placeholder="e.g., token-, coin-"
          :disabled="loading"
        />
        <template #extra> Optional prefix for all uploaded icons </template>
      </a-form-item>

      <a-form-item label="File Validation">
        <a-space direction="vertical" style="width: 100%">
          <a-alert
            v-if="validationSummary.total > 0"
            :type="validationSummary.errors > 0 ? 'error' : 'success'"
            show-icon
          >
            <template #message>
              <div>Total files: {{ validationSummary.total }}</div>
              <div v-if="validationSummary.valid > 0" style="color: #52c41a">
                Valid: {{ validationSummary.valid }}
              </div>
              <div v-if="validationSummary.errors > 0" style="color: #ff4d4f">
                Errors: {{ validationSummary.errors }}
              </div>
              <div v-if="validationSummary.warnings > 0" style="color: #faad14">
                Warnings: {{ validationSummary.warnings }}
              </div>
            </template>
          </a-alert>

          <a-table
            v-if="fileValidations.length > 0"
            :columns="validationColumns"
            :data-source="fileValidations"
            :pagination="false"
            size="small"
            :scroll="{ y: 300 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-tag v-if="record.valid" color="success">Valid</a-tag>
                <a-tag v-else color="error">Invalid</a-tag>
              </template>
              <template v-else-if="column.key === 'issues'">
                <div v-if="record.errors.length > 0" class="validation-issues">
                  <div
                    v-for="(error, idx) in record.errors"
                    :key="`error-${idx}`"
                    class="error-text"
                  >
                    {{ error }}
                  </div>
                </div>
                <div v-if="record.warnings.length > 0" class="validation-issues">
                  <div
                    v-for="(warning, idx) in record.warnings"
                    :key="`warning-${idx}`"
                    class="warning-text"
                  >
                    {{ warning }}
                  </div>
                </div>
              </template>
              <template v-else-if="column.key === 'dimensions'">
                <span v-if="record.dimensions">
                  {{ record.dimensions.width }}x{{ record.dimensions.height }}px
                </span>
              </template>
              <template v-else-if="column.key === 'size'">
                {{ formatFileSize(record.fileSize) }}
              </template>
            </template>
          </a-table>
        </a-space>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
        <a-space>
          <a-button type="primary" :loading="loading" :disabled="!canUpload" @click="handleUpload">
            Upload {{ fileList.length }} File{{ fileList.length !== 1 ? 's' : '' }}
          </a-button>
          <a-button @click="handleCancel">Cancel</a-button>
          <a-button v-if="fileList.length > 0" danger @click="handleClearAll"> Clear All </a-button>
        </a-space>
      </a-form-item>
    </a-form>

    <a-modal v-model:open="resultModalVisible" title="Upload Results" :footer="null" width="600px">
      <a-result
        :status="uploadResult.failed === 0 ? 'success' : 'warning'"
        :title="`Uploaded ${uploadResult.success} of ${uploadResult.success + uploadResult.failed} files`"
      >
        <template #subTitle>
          <div v-if="uploadResult.failed > 0">
            {{ uploadResult.failed }} file(s) failed to upload
          </div>
        </template>
        <template #extra>
          <a-space direction="vertical" style="width: 100%">
            <div v-if="uploadResult.errors.length > 0">
              <a-divider>Failed Files</a-divider>
              <a-list size="small" :data-source="uploadResult.errors">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>{{ item.filename }}</template>
                      <template #description>
                        <span style="color: #ff4d4f">{{ item.error }}</span>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>
            </div>
            <a-button type="primary" @click="handleCloseResult">Close</a-button>
          </a-space>
        </template>
      </a-result>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import { useIconsStore } from '@/stores/icons'
import type { UploadProps } from 'ant-design-vue'
import type { ValidationResult, BulkUploadResult } from '@/services/api/config.icons'

interface Emits {
  (e: 'success', result: BulkUploadResult): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const iconsStore = useIconsStore()
const loading = ref(false)
const fileList = ref<any[]>([])
const fileValidations = ref<Array<ValidationResult & { filename: string; fileSize: number }>>([])
const resultModalVisible = ref(false)
const uploadResult = ref<BulkUploadResult>({
  success: 0,
  failed: 0,
  errors: [],
  assets: [],
})

const maxFiles = 50
const acceptedFormats = '.svg,.png'

// Form state
const formState = reactive({
  autoNaming: true,
  prefix: '',
})

// Validation columns
const validationColumns = [
  { title: 'Filename', dataIndex: 'filename', key: 'filename', width: 150 },
  { title: 'Status', key: 'status', width: 80 },
  { title: 'Dimensions', key: 'dimensions', width: 100 },
  { title: 'Size', key: 'size', width: 80 },
  { title: 'Issues', key: 'issues' },
]

// Computed
const validationSummary = computed(() => {
  const total = fileValidations.value.length
  const valid = fileValidations.value.filter((v) => v.valid).length
  const errors = fileValidations.value.filter((v) => v.errors.length > 0).length
  const warnings = fileValidations.value.filter((v) => v.warnings.length > 0).length

  return { total, valid, errors, warnings }
})

const canUpload = computed(() => {
  return fileList.value.length > 0 && validationSummary.value.errors === 0 && !loading.value
})

// Handlers
const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
  // Check file count
  if (fileList.value.length >= maxFiles) {
    message.error(`Maximum ${maxFiles} files allowed`)
    return false
  }

  // Check file type
  const isValidType = file.type === 'image/svg+xml' || file.type === 'image/png'
  if (!isValidType) {
    message.error('Only SVG and PNG files are allowed')
    return false
  }

  // Check file size
  const maxSize = file.type === 'image/svg+xml' ? 1024 * 1024 : 5 * 1024 * 1024
  if (file.size > maxSize) {
    message.error(`File size must be less than ${maxSize / 1024 / 1024}MB`)
    return false
  }

  // Validate file
  await validateFile(file)

  return false // Prevent auto upload
}

async function validateFile(file: File) {
  try {
    const result = await iconsStore.validateAsset(file)
    fileValidations.value.push({
      ...result,
      filename: file.name,
      fileSize: file.size,
    })
  } catch (error: any) {
    fileValidations.value.push({
      valid: false,
      errors: [error.message || 'Validation failed'],
      warnings: [],
      filename: file.name,
      fileSize: file.size,
    })
  }
}

function handleRemove(file: any) {
  const index = fileList.value.indexOf(file)
  if (index > -1) {
    fileList.value.splice(index, 1)
    fileValidations.value.splice(index, 1)
  }
}

function handleClearAll() {
  fileList.value = []
  fileValidations.value = []
}

async function handleUpload() {
  if (!canUpload.value) return

  loading.value = true

  try {
    const files = fileList.value.map((item) => item.originFileObj)
    const result = await iconsStore.bulkUpload(
      files,
      formState.autoNaming,
      formState.prefix || undefined
    )

    uploadResult.value = result
    resultModalVisible.value = true

    if (result.failed === 0) {
      message.success(`Successfully uploaded ${result.success} file(s)`)
    } else {
      message.warning(`Uploaded ${result.success} file(s), ${result.failed} failed`)
    }
  } catch (error: any) {
    message.error(error.message || 'Upload failed')
  } finally {
    loading.value = false
  }
}

function handleCloseResult() {
  resultModalVisible.value = false

  if (uploadResult.value.success > 0) {
    emit('success', uploadResult.value)

    // Clear form
    fileList.value = []
    fileValidations.value = []
    formState.autoNaming = true
    formState.prefix = ''
  }
}

function handleCancel() {
  emit('cancel')
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}
</script>

<style scoped>
.bulk-upload-form {
  padding: 16px 0;
}

.validation-issues {
  font-size: 12px;
  line-height: 1.5;
}

.error-text {
  color: #ff4d4f;
}

.warning-text {
  color: #faad14;
}
</style>
