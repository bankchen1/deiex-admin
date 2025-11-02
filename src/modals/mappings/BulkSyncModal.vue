<template>
  <a-modal
    :visible="visible"
    title="Bulk Sync Mappings"
    :width="800"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-space direction="vertical" size="large" style="width: 100%">
      <a-alert
        message="Bulk Sync Information"
        description="Upload a JSON file containing mappings to sync. You can choose to merge with existing mappings or replace them entirely."
        type="info"
        show-icon
      />

      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="Sync Mode">
          <a-radio-group v-model:value="syncMode">
            <a-radio value="merge">
              <span>Merge</span>
              <div style="font-size: 12px; color: #999">
                Add new mappings and update existing ones
              </div>
            </a-radio>
            <a-radio value="replace">
              <span>Replace</span>
              <div style="font-size: 12px; color: #999">
                Remove all existing mappings and replace with uploaded data
              </div>
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="Upload File">
          <a-upload
            :file-list="fileList"
            :before-upload="handleBeforeUpload"
            :remove="handleRemove"
            accept=".json"
          >
            <a-button>
              <template #icon><UploadOutlined /></template>
              Select JSON File
            </a-button>
          </a-upload>
          <div style="margin-top: 8px; color: #999; font-size: 12px">
            Upload a JSON file containing an array of mapping objects
          </div>
        </a-form-item>

        <a-form-item v-if="parsedData" label="Preview">
          <a-card size="small">
            <a-statistic
              title="Mappings to Sync"
              :value="parsedData.length"
              style="margin-bottom: 16px"
            />
            <div style="max-height: 300px; overflow-y: auto">
              <pre style="font-size: 12px">{{
                JSON.stringify(parsedData.slice(0, 5), null, 2)
              }}</pre>
              <div v-if="parsedData.length > 5" style="text-align: center; color: #999">
                ... and {{ parsedData.length - 5 }} more
              </div>
            </div>
          </a-card>
        </a-form-item>

        <a-form-item label="Validation">
          <a-space direction="vertical" style="width: 100%">
            <a-checkbox v-model:checked="validateBeforeSync">
              Validate mappings before syncing
            </a-checkbox>
            <a-checkbox v-model:checked="dryRun">
              Dry run (preview changes without applying)
            </a-checkbox>
          </a-space>
        </a-form-item>
      </a-form>

      <a-alert
        v-if="syncMode === 'replace'"
        message="Warning"
        description="Replace mode will delete all existing mappings. This action cannot be undone."
        type="warning"
        show-icon
      />
    </a-space>

    <template #footer>
      <a-space>
        <a-button @click="handleCancel">Cancel</a-button>
        <a-button @click="handleDownloadTemplate">
          <template #icon><DownloadOutlined /></template>
          Download Template
        </a-button>
        <a-button
          type="primary"
          :disabled="!parsedData || parsedData.length === 0"
          :loading="loading"
          @click="handleOk"
        >
          {{ dryRun ? 'Preview' : 'Sync' }}
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'

interface Props {
  visible: boolean
  loading?: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'submit', payload: { mappings: any[]; mode: 'merge' | 'replace' }): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const syncMode = ref<'merge' | 'replace'>('merge')
const fileList = ref<any[]>([])
const parsedData = ref<any[] | null>(null)
const validateBeforeSync = ref(true)
const dryRun = ref(false)

const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
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
        message.error('JSON file must contain an array of mappings')
        return
      }
      parsedData.value = data
      fileList.value = [file]
      message.success('File parsed successfully')
    } catch (error) {
      message.error('Failed to parse JSON file')
      console.error(error)
    }
  }
  reader.readAsText(file)

  return false // Prevent auto upload
}

function handleRemove() {
  fileList.value = []
  parsedData.value = null
}

function handleOk() {
  if (!parsedData.value || parsedData.value.length === 0) {
    message.warning('Please upload a file first')
    return
  }

  emit('submit', {
    mappings: parsedData.value,
    mode: syncMode.value,
  })
}

function handleCancel() {
  emit('update:visible', false)
  // Reset state
  syncMode.value = 'merge'
  fileList.value = []
  parsedData.value = null
  validateBeforeSync.value = true
  dryRun.value = false
}

function handleDownloadTemplate() {
  const template = [
    {
      navKey: 'example.page',
      navLabel: 'Example Page',
      apiEndpoint: '/admin/example',
      method: 'GET',
      description: 'Example mapping',
      status: 'active',
    },
  ]

  const blob = new Blob([JSON.stringify(template, null, 2)], {
    type: 'application/json',
  })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'mapping-template.json'
  link.click()
  window.URL.revokeObjectURL(url)
  message.success('Template downloaded')
}
</script>
