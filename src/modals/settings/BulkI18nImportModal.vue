<template>
  <a-modal
    v-model:open="visible"
    title="Bulk Import I18n Entries"
    width="800px"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-space direction="vertical" style="width: 100%" :size="16">
      <a-alert
        message="Import Format"
        description="Upload a JSON file with an array of entries. Each entry should have: key, module, en, zh"
        type="info"
        show-icon
      />

      <a-upload-dragger
        v-model:file-list="fileList"
        :before-upload="beforeUpload"
        :max-count="1"
        accept=".json"
        @remove="handleRemove"
      >
        <p class="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p class="ant-upload-text">Click or drag JSON file to this area to upload</p>
        <p class="ant-upload-hint">
          Support for a single JSON file upload. The file should contain an array of i18n entries.
        </p>
      </a-upload-dragger>

      <a-form layout="vertical">
        <a-form-item label="Import Options">
          <a-checkbox v-model:checked="overwrite"> Overwrite existing entries </a-checkbox>
        </a-form-item>
      </a-form>

      <div v-if="parsedData.length > 0">
        <a-divider>Preview ({{ parsedData.length }} entries)</a-divider>
        <a-table
          :columns="previewColumns"
          :data-source="parsedData.slice(0, 10)"
          :pagination="false"
          size="small"
          :scroll="{ y: 300 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'key'">
              <a-typography-text code>{{ record.key }}</a-typography-text>
            </template>
            <template v-else-if="column.key === 'module'">
              <a-tag color="blue">{{ record.module }}</a-tag>
            </template>
          </template>
        </a-table>
        <a-typography-text v-if="parsedData.length > 10" type="secondary">
          Showing first 10 of {{ parsedData.length }} entries
        </a-typography-text>
      </div>

      <a-collapse v-if="parsedData.length === 0">
        <a-collapse-panel key="1" header="Example JSON Format">
          <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto">{{
            exampleJson
          }}</pre>
        </a-collapse-panel>
      </a-collapse>
    </a-space>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'

interface I18nImportEntry {
  key: string
  module: string
  en: string
  zh: string
}

interface Props {
  open: boolean
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', data: { entries: I18nImportEntry[]; overwrite: boolean }): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const fileList = ref<any[]>([])
const parsedData = ref<I18nImportEntry[]>([])
const overwrite = ref(false)

const previewColumns = [
  { title: 'Key', dataIndex: 'key', key: 'key', width: 200 },
  { title: 'Module', dataIndex: 'module', key: 'module', width: 100 },
  { title: 'English', dataIndex: 'en', key: 'en', ellipsis: true },
  { title: 'Chinese', dataIndex: 'zh', key: 'zh', ellipsis: true },
]

const exampleJson = `[
  {
    "key": "common.save",
    "module": "common",
    "en": "Save",
    "zh": "保存"
  },
  {
    "key": "common.cancel",
    "module": "common",
    "en": "Cancel",
    "zh": "取消"
  }
]`

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isJSON = file.type === 'application/json' || file.name.endsWith('.json')
  if (!isJSON) {
    message.error('You can only upload JSON files!')
    return false
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const data = JSON.parse(content)

      if (!Array.isArray(data)) {
        message.error('JSON file must contain an array of entries')
        return
      }

      // Validate entries
      const validEntries = data.filter((entry: any) => {
        return entry.key && entry.module && entry.en && entry.zh
      })

      if (validEntries.length === 0) {
        message.error('No valid entries found in the file')
        return
      }

      if (validEntries.length < data.length) {
        message.warning(`${data.length - validEntries.length} invalid entries were skipped`)
      }

      parsedData.value = validEntries
      message.success(`Loaded ${validEntries.length} entries`)
    } catch (error) {
      message.error('Failed to parse JSON file')
      console.error(error)
    }
  }
  reader.readAsText(file)

  return false // Prevent auto upload
}

function handleRemove() {
  parsedData.value = []
}

function handleSubmit() {
  if (parsedData.value.length === 0) {
    message.error('Please upload a file first')
    return
  }

  emit('submit', {
    entries: parsedData.value,
    overwrite: overwrite.value,
  })
}

function handleCancel() {
  fileList.value = []
  parsedData.value = []
  overwrite.value = false
  visible.value = false
}
</script>
