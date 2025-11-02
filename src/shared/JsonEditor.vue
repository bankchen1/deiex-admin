<template>
  <div class="json-editor">
    <div class="editor-toolbar">
      <a-space>
        <a-button size="small" @click="handleFormat">
          <template #icon><FormatPainterOutlined /></template>
          Format
        </a-button>
        <a-button size="small" @click="handleMinify">
          <template #icon><CompressOutlined /></template>
          Minify
        </a-button>
        <a-button size="small" @click="handleCopy">
          <template #icon><CopyOutlined /></template>
          Copy
        </a-button>
        <a-button size="small" @click="handleValidate">
          <template #icon><CheckCircleOutlined /></template>
          Validate
        </a-button>
      </a-space>
      <div v-if="error" class="editor-error">
        <a-tag color="error">{{ error }}</a-tag>
      </div>
      <div v-else-if="valid" class="editor-success">
        <a-tag color="success">Valid JSON</a-tag>
      </div>
    </div>

    <a-textarea
      v-model:value="internalValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :auto-size="autoSize"
      class="json-textarea"
      :class="{ error: !!error, valid: valid && !error }"
      @change="handleChange"
      @blur="handleBlur"
    />

    <div v-if="showLineNumbers" class="line-numbers">
      <div v-for="n in lineCount" :key="n" class="line-number">
        {{ n }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  FormatPainterOutlined,
  CompressOutlined,
  CopyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { validateJSON } from '@/utils/validation'

interface Props {
  modelValue?: string | object
  placeholder?: string
  disabled?: boolean
  rows?: number
  autoSize?: boolean | { minRows?: number; maxRows?: number }
  showLineNumbers?: boolean
  autoFormat?: boolean
  autoValidate?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Enter JSON...',
  disabled: false,
  rows: 10,
  autoSize: false,
  showLineNumbers: false,
  autoFormat: false,
  autoValidate: true,
})

const emit = defineEmits<Emits>()

// State
const internalValue = ref('')
const error = ref('')
const valid = ref(false)

// Line count for line numbers
const lineCount = computed(() => {
  return internalValue.value.split('\n').length
})

// Initialize internal value
watch(
  () => props.modelValue,
  (value) => {
    if (typeof value === 'object') {
      internalValue.value = JSON.stringify(value, null, 2)
    } else {
      internalValue.value = value || ''
    }

    if (props.autoValidate) {
      validateJson()
    }
  },
  { immediate: true }
)

// Validate JSON
function validateJson(): boolean {
  if (!internalValue.value.trim()) {
    error.value = ''
    valid.value = false
    return false
  }

  try {
    JSON.parse(internalValue.value)
    error.value = ''
    valid.value = true
    return true
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Invalid JSON'
    valid.value = false
    return false
  }
}

// Handle format
function handleFormat(): void {
  try {
    const parsed = JSON.parse(internalValue.value)
    internalValue.value = JSON.stringify(parsed, null, 2)
    error.value = ''
    valid.value = true
    handleChange()
    message.success('JSON formatted')
  } catch (e) {
    message.error('Cannot format invalid JSON')
  }
}

// Handle minify
function handleMinify(): void {
  try {
    const parsed = JSON.parse(internalValue.value)
    internalValue.value = JSON.stringify(parsed)
    error.value = ''
    valid.value = true
    handleChange()
    message.success('JSON minified')
  } catch (e) {
    message.error('Cannot minify invalid JSON')
  }
}

// Handle copy
async function handleCopy(): Promise<void> {
  try {
    await navigator.clipboard.writeText(internalValue.value)
    message.success('Copied to clipboard')
  } catch (e) {
    message.error('Failed to copy')
  }
}

// Handle validate
function handleValidate(): void {
  const isValid = validateJson()
  if (isValid) {
    message.success('JSON is valid')
  } else {
    message.error(error.value || 'JSON is invalid')
  }
}

// Handle change
function handleChange(): void {
  if (props.autoValidate) {
    validateJson()
  }

  emit('update:modelValue', internalValue.value)
  emit('change', internalValue.value)
}

// Handle blur
function handleBlur(): void {
  if (props.autoFormat && validateJson()) {
    handleFormat()
  }
}
</script>

<style scoped>
.json-editor {
  position: relative;
  width: 100%;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px 12px;
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 4px 4px 0 0;
}

.editor-error {
  flex: 1;
  text-align: right;
}

.editor-success {
  flex: 1;
  text-align: right;
}

.json-textarea {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  border-radius: 0 0 4px 4px;
}

.json-textarea.error {
  border-color: #ff4d4f;
}

.json-textarea.valid {
  border-color: #52c41a;
}

.line-numbers {
  position: absolute;
  left: 0;
  top: 40px;
  width: 40px;
  padding: 4px 8px;
  background: #fafafa;
  border-right: 1px solid #d9d9d9;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #999;
  user-select: none;
  pointer-events: none;
}

.line-number {
  text-align: right;
}

:deep(.ant-input) {
  padding-left: 48px;
}
</style>
