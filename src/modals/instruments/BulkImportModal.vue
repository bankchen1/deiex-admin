<template>
  <a-modal
    :open="open"
    title="Bulk Import Instruments"
    :width="800"
    :confirm-loading="loading"
    @ok="handleImport"
    @cancel="handleClose"
  >
    <a-space direction="vertical" style="width: 100%" :size="16">
      <!-- Format Selection -->
      <div>
        <label class="block mb-2 font-medium">Import Format</label>
        <a-radio-group v-model:value="format">
          <a-radio value="csv">CSV</a-radio>
          <a-radio value="json">JSON</a-radio>
        </a-radio-group>
      </div>

      <!-- File Upload -->
      <div>
        <label class="block mb-2 font-medium">Upload File</label>
        <a-upload
          :before-upload="handleBeforeUpload"
          :file-list="fileList"
          :max-count="1"
          @remove="handleRemove"
        >
          <a-button>
            <template #icon><UploadOutlined /></template>
            Select File
          </a-button>
        </a-upload>
        <div class="text-gray-500 text-sm mt-2">
          <template v-if="format === 'csv'">
            CSV format:
            symbol,displayName_en,displayName_zh,base,quote,type,pricePrecision,qtyStep,minOrder,visible,rank
          </template>
          <template v-else> JSON format: Array of instrument objects </template>
        </div>
      </div>

      <!-- Field Mapping (for CSV) -->
      <div v-if="format === 'csv' && fileContent">
        <label class="block mb-2 font-medium">Field Mapping</label>
        <a-table
          :columns="mappingColumns"
          :data-source="mappingData"
          :pagination="false"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'targetField'">
              <a-select
                v-model:value="record.targetField"
                style="width: 100%"
                :options="fieldOptions"
              />
            </template>
          </template>
        </a-table>
      </div>

      <!-- Options -->
      <div>
        <a-checkbox v-model:checked="overwrite"> Overwrite existing instruments </a-checkbox>
      </div>

      <!-- Validation Results -->
      <div v-if="validationResult">
        <a-alert
          :type="validationResult.valid ? 'success' : 'error'"
          :message="validationResult.valid ? 'Validation passed' : 'Validation failed'"
          show-icon
        >
          <template #description>
            <div v-if="!validationResult.valid">
              <div v-for="(error, index) in validationResult.errors" :key="index" class="mb-1">
                Row {{ error.row }}: {{ error.message }}
              </div>
            </div>
            <div v-else>{{ validationResult.count }} instruments ready to import</div>
          </template>
        </a-alert>
      </div>

      <!-- Preview -->
      <div v-if="previewData.length > 0">
        <label class="block mb-2 font-medium">Preview (first 5 rows)</label>
        <a-table
          :columns="previewColumns"
          :data-source="previewData"
          :pagination="false"
          :scroll="{ x: 1200 }"
          size="small"
        />
      </div>
    </a-space>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { useInstrumentsStore } from '@/stores/instruments'
import type { UploadProps } from 'ant-design-vue'

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
const format = ref<'csv' | 'json'>('csv')
const fileList = ref<any[]>([])
const fileContent = ref<string>('')
const overwrite = ref(false)
const validationResult = ref<any>(null)
const previewData = ref<any[]>([])
const mappingData = ref<any[]>([])

// Field options for mapping
const fieldOptions = [
  { label: 'Symbol', value: 'symbol' },
  { label: 'Display Name (EN)', value: 'displayName.en' },
  { label: 'Display Name (ZH)', value: 'displayName.zh' },
  { label: 'Base', value: 'base' },
  { label: 'Quote', value: 'quote' },
  { label: 'Type', value: 'type' },
  { label: 'Price Precision', value: 'pricePrecision' },
  { label: 'Qty Step', value: 'qtyStep' },
  { label: 'Min Order', value: 'minOrder' },
  { label: 'Visible', value: 'visible' },
  { label: 'Rank', value: 'rank' },
  { label: 'Region', value: 'region' },
  { label: 'Tags', value: 'tags' },
  { label: '(Ignore)', value: null },
]

// Mapping table columns
const mappingColumns = [
  { title: 'CSV Column', dataIndex: 'csvColumn', key: 'csvColumn' },
  { title: 'Target Field', dataIndex: 'targetField', key: 'targetField' },
]

// Preview table columns
const previewColumns = computed(() => [
  { title: 'Symbol', dataIndex: 'symbol', key: 'symbol', width: 120 },
  { title: 'Display Name', dataIndex: 'displayName', key: 'displayName', width: 150 },
  { title: 'Base', dataIndex: 'base', key: 'base', width: 80 },
  { title: 'Quote', dataIndex: 'quote', key: 'quote', width: 80 },
  { title: 'Type', dataIndex: 'type', key: 'type', width: 80 },
  { title: 'Price Precision', dataIndex: 'pricePrecision', key: 'pricePrecision', width: 120 },
  { title: 'Qty Step', dataIndex: 'qtyStep', key: 'qtyStep', width: 100 },
  { title: 'Min Order', dataIndex: 'minOrder', key: 'minOrder', width: 100 },
])

// Methods
const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    fileContent.value = e.target?.result as string
    parseFile()
  }
  reader.readAsText(file)

  fileList.value = [file]
  return false // Prevent auto upload
}

function handleRemove() {
  fileList.value = []
  fileContent.value = ''
  validationResult.value = null
  previewData.value = []
  mappingData.value = []
}

function parseFile() {
  if (!fileContent.value) return

  try {
    if (format.value === 'csv') {
      parseCSV()
    } else {
      parseJSON()
    }
    validateData()
  } catch (error: any) {
    message.error(`Failed to parse file: ${error.message}`)
  }
}

function parseCSV() {
  const lines = fileContent.value.split('\n').filter((line) => line.trim())
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header row and one data row')
  }

  const headers = lines[0].split(',').map((h) => h.trim())

  // Initialize mapping data
  mappingData.value = headers.map((header) => ({
    csvColumn: header,
    targetField: guessFieldMapping(header),
  }))

  // Parse data rows
  const data = []
  for (let i = 1; i < Math.min(lines.length, 6); i++) {
    const values = lines[i].split(',').map((v) => v.trim())
    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = values[index]
    })

    // Map to preview format
    const mappedRow: any = {}
    mappingData.value.forEach((mapping) => {
      if (mapping.targetField) {
        const value = row[mapping.csvColumn]
        if (mapping.targetField.includes('.')) {
          const [parent, child] = mapping.targetField.split('.')
          if (!mappedRow[parent]) mappedRow[parent] = {}
          mappedRow[parent][child] = value
        } else {
          mappedRow[mapping.targetField] = value
        }
      }
    })

    data.push(mappedRow)
  }

  previewData.value = data
}

function parseJSON() {
  const data = JSON.parse(fileContent.value)
  if (!Array.isArray(data)) {
    throw new Error('JSON must be an array of instruments')
  }
  previewData.value = data.slice(0, 5)
}

function guessFieldMapping(csvColumn: string): string | null {
  const lower = csvColumn.toLowerCase()
  if (lower.includes('symbol')) return 'symbol'
  if (lower.includes('display') && lower.includes('en')) return 'displayName.en'
  if (lower.includes('display') && lower.includes('zh')) return 'displayName.zh'
  if (lower.includes('base')) return 'base'
  if (lower.includes('quote')) return 'quote'
  if (lower.includes('type')) return 'type'
  if (lower.includes('price') && lower.includes('precision')) return 'pricePrecision'
  if (lower.includes('qty') || lower.includes('quantity')) return 'qtyStep'
  if (lower.includes('min')) return 'minOrder'
  if (lower.includes('visible')) return 'visible'
  if (lower.includes('rank')) return 'rank'
  return null
}

async function validateData() {
  if (!fileContent.value) return

  loading.value = true
  try {
    const payload = {
      format: format.value,
      data: format.value === 'csv' ? fileContent.value : JSON.parse(fileContent.value),
      fieldMapping:
        format.value === 'csv'
          ? Object.fromEntries(mappingData.value.map((m) => [m.csvColumn, m.targetField]))
          : undefined,
    }

    const result = await instrumentsStore.validateImport(payload)
    validationResult.value = {
      valid: result.data.valid,
      errors: result.data.errors || [],
      count: previewData.value.length,
    }
  } catch (error: any) {
    message.error(`Validation failed: ${error.message}`)
  } finally {
    loading.value = false
  }
}

async function handleImport() {
  if (!fileContent.value) {
    message.warning('Please select a file to import')
    return
  }

  if (validationResult.value && !validationResult.value.valid) {
    message.error('Please fix validation errors before importing')
    return
  }

  loading.value = true
  try {
    const payload = {
      format: format.value,
      data: format.value === 'csv' ? fileContent.value : JSON.parse(fileContent.value),
      fieldMapping:
        format.value === 'csv'
          ? Object.fromEntries(mappingData.value.map((m) => [m.csvColumn, m.targetField]))
          : undefined,
      overwrite: overwrite.value,
    }

    await instrumentsStore.importData(payload)
    emit('success')
    handleClose()
  } catch (error) {
    console.error('Import failed:', error)
  } finally {
    loading.value = false
  }
}

function handleClose() {
  emit('update:open', false)
  // Reset state
  fileList.value = []
  fileContent.value = ''
  validationResult.value = null
  previewData.value = []
  mappingData.value = []
  overwrite.value = false
}
</script>

<style scoped>
.block {
  display: block;
}

.mb-1 {
  margin-bottom: 4px;
}

.mb-2 {
  margin-bottom: 8px;
}

.mt-2 {
  margin-top: 8px;
}

.font-medium {
  font-weight: 500;
}

.text-gray-500 {
  color: rgba(0, 0, 0, 0.45);
}

.text-sm {
  font-size: 14px;
}
</style>
