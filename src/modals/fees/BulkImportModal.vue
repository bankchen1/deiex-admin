<template>
  <a-modal
    :open="open"
    title="Bulk Import Fees"
    :width="800"
    :confirm-loading="loading"
    @ok="handleImport"
    @cancel="handleCancel"
  >
    <a-space direction="vertical" style="width: 100%" :size="16">
      <a-alert
        type="info"
        message="Import Instructions"
        description="Upload a CSV or JSON file containing fee configurations. The file will be validated before import."
        show-icon
      />

      <a-form layout="vertical">
        <a-form-item label="Fee Type">
          <a-radio-group v-model:value="feeType" button-style="solid">
            <a-radio-button value="trading">Trading Fees</a-radio-button>
            <a-radio-button value="withdrawal">Withdrawal Fees</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="File Format">
          <a-radio-group v-model:value="fileFormat" button-style="solid">
            <a-radio-button value="csv">CSV</a-radio-button>
            <a-radio-button value="json">JSON</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="Upload File">
          <a-upload
            v-model:file-list="fileList"
            :before-upload="beforeUpload"
            :max-count="1"
            accept=".csv,.json"
          >
            <a-button>
              <template #icon><UploadOutlined /></template>
              Select File
            </a-button>
          </a-upload>
        </a-form-item>

        <a-form-item v-if="fileList.length > 0">
          <a-button type="link" :loading="validating" @click="handleValidate">
            <template #icon><CheckCircleOutlined /></template>
            Validate File
          </a-button>
        </a-form-item>
      </a-form>

      <!-- Validation Results -->
      <a-card v-if="validationResult" title="Validation Results" size="small">
        <a-result
          v-if="validationResult.valid"
          status="success"
          title="Validation Passed"
          sub-title="The file is valid and ready to import"
        />
        <a-result
          v-else
          status="error"
          title="Validation Failed"
          :sub-title="`Found ${validationResult.errors.length} error(s)`"
        >
          <template #extra>
            <a-list
              size="small"
              :data-source="validationResult.errors"
              :pagination="{ pageSize: 5 }"
            >
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-typography-text type="danger">
                    {{ item.message || item }}
                  </a-typography-text>
                </a-list-item>
              </template>
            </a-list>
          </template>
        </a-result>
      </a-card>

      <!-- Template Download -->
      <a-card title="Download Template" size="small">
        <a-space>
          <a-button size="small" @click="downloadTemplate('csv')">
            <template #icon><DownloadOutlined /></template>
            CSV Template
          </a-button>
          <a-button size="small" @click="downloadTemplate('json')">
            <template #icon><DownloadOutlined /></template>
            JSON Template
          </a-button>
        </a-space>
      </a-card>
    </a-space>

    <template #footer>
      <a-button @click="handleCancel">Cancel</a-button>
      <a-button
        type="primary"
        :loading="loading"
        :disabled="!validationResult?.valid"
        @click="handleImport"
      >
        Import
      </a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadOutlined, CheckCircleOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UploadFile } from 'ant-design-vue'
import { useFeesStore } from '@/stores/fees'

interface Props {
  open: boolean
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', payload: any): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const feesStore = useFeesStore()

const feeType = ref<'trading' | 'withdrawal'>('trading')
const fileFormat = ref<'csv' | 'json'>('csv')
const fileList = ref<UploadFile[]>([])
const validating = ref(false)
const validationResult = ref<{ valid: boolean; errors: any[] } | null>(null)
const fileContent = ref<string>('')

function beforeUpload(file: UploadFile) {
  const reader = new FileReader()
  reader.onload = (e) => {
    fileContent.value = e.target?.result as string
  }
  reader.readAsText(file as any)
  return false // Prevent auto upload
}

async function handleValidate() {
  if (!fileContent.value) {
    message.error('Please select a file first')
    return
  }

  validating.value = true
  validationResult.value = null

  try {
    const response = await feesStore.validateImport({
      data: fileContent.value,
      format: fileFormat.value,
      type: feeType.value,
    })
    validationResult.value = response.data
    if (response.data.valid) {
      message.success('Validation passed')
    } else {
      message.error('Validation failed')
    }
  } catch (error) {
    console.error('Validation error:', error)
  } finally {
    validating.value = false
  }
}

async function handleImport() {
  if (!validationResult.value?.valid) {
    message.error('Please validate the file first')
    return
  }

  emit('submit', {
    data: fileContent.value,
    format: fileFormat.value,
    type: feeType.value,
  })
}

function handleCancel() {
  fileList.value = []
  fileContent.value = ''
  validationResult.value = null
  emit('update:open', false)
  emit('close')
}

function downloadTemplate(format: 'csv' | 'json') {
  let content = ''
  let filename = ''

  if (feeType.value === 'trading') {
    if (format === 'csv') {
      content =
        'vipLevel,makerRate,takerRate,inheritFromPrevious,description\n0,0.001,0.002,false,VIP 0 tier'
      filename = 'trading_fees_template.csv'
    } else {
      content = JSON.stringify(
        [
          {
            vipLevel: 0,
            makerRate: 0.001,
            takerRate: 0.002,
            inheritFromPrevious: false,
            description: 'VIP 0 tier',
          },
        ],
        null,
        2
      )
      filename = 'trading_fees_template.json'
    }
  } else {
    if (format === 'csv') {
      content =
        'currency,chain,fixedFee,percentageFee,minFee,dailyLimit,description\nBTC,Bitcoin,0.0005,0.001,0.0001,10,Bitcoin withdrawal fee'
      filename = 'withdrawal_fees_template.csv'
    } else {
      content = JSON.stringify(
        [
          {
            currency: 'BTC',
            chain: 'Bitcoin',
            fixedFee: '0.0005',
            percentageFee: 0.001,
            minFee: '0.0001',
            dailyLimit: '10',
            description: 'Bitcoin withdrawal fee',
          },
        ],
        null,
        2
      )
      filename = 'withdrawal_fees_template.json'
    }
  }

  const blob = new Blob([content], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
</script>
