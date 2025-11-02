<template>
  <a-modal
    v-model:open="visible"
    title="Bulk Import Blacklist"
    width="600"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-alert
      message="Import Instructions"
      description="Upload a CSV or JSON file with blacklist entries. The file should contain columns: type, value, reason, source (optional), notes (optional)."
      type="info"
      show-icon
      style="margin-bottom: 16px"
    />

    <a-upload
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      accept=".csv,.json"
      @remove="handleRemove"
    >
      <a-button>
        <template #icon><UploadOutlined /></template>
        Select File
      </a-button>
    </a-upload>

    <a-divider />

    <a-collapse v-if="previewData.length > 0" style="margin-top: 16px">
      <a-collapse-panel key="1" header="Preview Data">
        <a-table
          :columns="previewColumns"
          :data-source="previewData"
          :pagination="{ pageSize: 5 }"
          size="small"
        />
      </a-collapse-panel>
    </a-collapse>

    <a-alert
      v-if="importResult"
      :type="importResult.errors.length > 0 ? 'warning' : 'success'"
      :message="`Imported ${importResult.imported} entries`"
      :description="
        importResult.errors.length > 0 ? `${importResult.errors.length} errors occurred` : undefined
      "
      show-icon
      style="margin-top: 16px"
    />

    <a-collapse v-if="importResult && importResult.errors.length > 0" style="margin-top: 16px">
      <a-collapse-panel key="1" header="Import Errors">
        <a-list :data-source="importResult.errors" size="small">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-typography-text type="danger">{{ item }}</a-typography-text>
            </a-list-item>
          </template>
        </a-list>
      </a-collapse-panel>
    </a-collapse>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'

interface Props {
  open: boolean
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'import', file: File): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const visible = ref(props.open)
const fileList = ref<UploadProps['fileList']>([])
const previewData = ref<any[]>([])
const importResult = ref<{ imported: number; errors: string[] } | null>(null)

const previewColumns = [
  { title: 'Type', dataIndex: 'type', key: 'type' },
  { title: 'Value', dataIndex: 'value', key: 'value' },
  { title: 'Reason', dataIndex: 'reason', key: 'reason' },
]

watch(
  () => props.open,
  (newVal) => {
    visible.value = newVal
    if (!newVal) {
      // Reset when modal closes
      fileList.value = []
      previewData.value = []
      importResult.value = null
    }
  }
)

watch(visible, (newVal) => {
  emit('update:open', newVal)
})

function handleBeforeUpload(file: File) {
  const isValidType =
    file.type === 'text/csv' ||
    file.type === 'application/json' ||
    file.name.endsWith('.csv') ||
    file.name.endsWith('.json')

  if (!isValidType) {
    message.error('You can only upload CSV or JSON files!')
    return false
  }

  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('File must be smaller than 10MB!')
    return false
  }

  fileList.value = [file]

  // Preview file content
  parseFilePreview(file)

  return false
}

function handleRemove() {
  fileList.value = []
  previewData.value = []
}

async function parseFilePreview(file: File) {
  try {
    const text = await file.text()

    if (file.name.endsWith('.json')) {
      const data = JSON.parse(text)
      previewData.value = Array.isArray(data) ? data.slice(0, 10) : [data]
    } else if (file.name.endsWith('.csv')) {
      const lines = text.split('\n').filter((line) => line.trim())
      const headers = lines[0].split(',').map((h) => h.trim())

      previewData.value = lines.slice(1, 11).map((line) => {
        const values = line.split(',').map((v) => v.trim())
        const obj: any = {}
        headers.forEach((header, index) => {
          obj[header] = values[index]
        })
        return obj
      })
    }
  } catch (error) {
    console.error('Failed to parse file:', error)
    message.error('Failed to parse file')
  }
}

function handleOk() {
  if (!fileList.value || fileList.value.length === 0) {
    message.error('Please select a file to import')
    return
  }

  const file = fileList.value[0] as any
  emit('import', file)
}

function handleCancel() {
  visible.value = false
}

function setImportResult(result: { imported: number; errors: string[] }) {
  importResult.value = result
}

defineExpose({
  setImportResult,
})
</script>
