<template>
  <a-form
    ref="formRef"
    :model="formData"
    :layout="schema.layout || 'horizontal'"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    @finish="handleSubmit"
  >
    <template v-for="field in visibleFields" :key="field.name">
      <a-form-item
        :label="field.label"
        :name="field.name"
        :rules="getFieldRules(field)"
        :help="field.help"
      >
        <!-- Input -->
        <a-input
          v-if="field.type === 'input'"
          v-model:value="formData[field.name]"
          :placeholder="field.placeholder"
          :disabled="isFieldDisabled(field)"
          v-bind="field.props"
          @change="handleFieldChange(field.name)"
        />

        <!-- Textarea -->
        <a-textarea
          v-else-if="field.type === 'textarea'"
          v-model:value="formData[field.name]"
          :placeholder="field.placeholder"
          :disabled="isFieldDisabled(field)"
          :rows="field.props?.rows || 4"
          v-bind="field.props"
          @change="handleFieldChange(field.name)"
        />

        <!-- Number -->
        <a-input-number
          v-else-if="field.type === 'number'"
          v-model:value="formData[field.name]"
          :placeholder="field.placeholder"
          :disabled="isFieldDisabled(field)"
          :min="field.props?.min"
          :max="field.props?.max"
          :step="field.props?.step"
          :precision="field.props?.precision"
          style="width: 100%"
          v-bind="field.props"
          @change="handleFieldChange(field.name)"
        />

        <!-- Select -->
        <a-select
          v-else-if="field.type === 'select'"
          v-model:value="formData[field.name]"
          :placeholder="field.placeholder"
          :disabled="isFieldDisabled(field)"
          :loading="fieldLoading[field.name]"
          :options="fieldOptions[field.name] || []"
          :mode="field.props?.mode"
          :allow-clear="field.props?.allowClear !== false"
          v-bind="field.props"
          @change="handleFieldChange(field.name)"
        />

        <!-- Date -->
        <a-date-picker
          v-else-if="field.type === 'date'"
          v-model:value="formData[field.name]"
          :placeholder="field.placeholder"
          :disabled="isFieldDisabled(field)"
          :show-time="field.props?.showTime"
          :format="field.props?.format"
          style="width: 100%"
          v-bind="field.props"
          @change="handleFieldChange(field.name)"
        />

        <!-- Switch -->
        <a-switch
          v-else-if="field.type === 'switch'"
          v-model:checked="formData[field.name]"
          :disabled="isFieldDisabled(field)"
          v-bind="field.props"
          @change="handleFieldChange(field.name)"
        />

        <!-- JSON Editor -->
        <JsonEditor
          v-else-if="field.type === 'json'"
          v-model:value="formData[field.name]"
          :disabled="isFieldDisabled(field)"
          v-bind="field.props"
          @change="handleFieldChange(field.name)"
        />

        <!-- Icon Picker -->
        <IconPicker
          v-else-if="field.type === 'icon-picker'"
          v-model:value="formData[field.name]"
          :disabled="isFieldDisabled(field)"
          v-bind="field.props"
          @change="handleFieldChange(field.name)"
        />
      </a-form-item>
    </template>

    <a-form-item v-if="!hideActions" :wrapper-col="actionWrapperCol">
      <a-space>
        <a-button type="primary" html-type="submit" :loading="submitting">
          {{ submitText }}
        </a-button>
        <a-button @click="handleCancel">
          {{ cancelText }}
        </a-button>
        <a-button v-if="enableDiff && mode === 'edit'" @click="handleViewDiff">
          View Changes
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { FormSchema, FormField, SelectOption } from '@/types/components'
import JsonEditor from './JsonEditor.vue'
import IconPicker from './IconPicker.vue'

interface Props {
  schema: FormSchema
  modelValue: Record<string, any>
  mode?: 'create' | 'edit' | 'view'
  enableDraft?: boolean
  enableDiff?: boolean
  hideActions?: boolean
  submitText?: string
  cancelText?: string
}

interface Emits {
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'submit', value: Record<string, any>): void
  (e: 'cancel'): void
  (e: 'viewDiff'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  enableDraft: false,
  enableDiff: false,
  hideActions: false,
  submitText: 'Submit',
  cancelText: 'Cancel',
})

const emit = defineEmits<Emits>()

// Form data
const formData = ref<Record<string, any>>({ ...props.modelValue })
const formRef = ref()
const submitting = ref(false)
const fieldLoading = ref<Record<string, boolean>>({})
const fieldOptions = ref<Record<string, SelectOption[]>>({})

// Draft auto-save
let draftTimer: NodeJS.Timeout | null = null
const DRAFT_KEY_PREFIX = 'form_draft_'

// Layout configuration
const labelCol = computed(() => {
  if (props.schema.layout === 'vertical') return undefined
  return {
    span: props.schema.labelWidth ? undefined : 6,
    style: props.schema.labelWidth ? { width: `${props.schema.labelWidth}px` } : undefined,
  }
})

const wrapperCol = computed(() => {
  if (props.schema.layout === 'vertical') return undefined
  return { span: props.schema.labelWidth ? undefined : 18 }
})

const actionWrapperCol = computed(() => {
  if (props.schema.layout === 'vertical') return undefined
  return {
    offset: props.schema.labelWidth ? undefined : 6,
    span: props.schema.labelWidth ? undefined : 18,
  }
})

// Visible fields based on visibility conditions
const visibleFields = computed(() => {
  return props.schema.fields.filter((field) => {
    if (!field.visible) return true
    return field.visible(formData.value)
  })
})

// Check if field is disabled
function isFieldDisabled(field: FormField): boolean {
  if (props.mode === 'view') return true
  if (!field.disabled) return false
  return field.disabled(formData.value)
}

// Get field validation rules
function getFieldRules(field: FormField): Rule[] {
  const rules: Rule[] = field.rules ? [...field.rules] : []

  // Add async validator if provided
  if (field.asyncValidator) {
    rules.push({
      validator: async (_rule: any, value: any) => {
        try {
          await field.asyncValidator!(value, formData.value)
        } catch (error) {
          return Promise.reject(error)
        }
      },
    })
  }

  return rules
}

// Handle field change
function handleFieldChange(fieldName: string): void {
  emit('update:modelValue', { ...formData.value })

  // Auto-save draft if enabled
  if (props.enableDraft) {
    saveDraftDebounced()
  }

  // Reload dependent field options
  const dependentFields = props.schema.fields.filter((field) =>
    field.dependsOn?.includes(fieldName)
  )
  dependentFields.forEach((field) => {
    loadFieldOptions(field)
  })
}

// Handle form submit
function handleSubmit(): void {
  submitting.value = true
  emit('submit', { ...formData.value })

  // Clear draft on successful submit
  if (props.enableDraft) {
    clearDraft()
  }

  // Note: Parent component should set submitting to false
  setTimeout(() => {
    submitting.value = false
  }, 1000)
}

// Handle cancel
function handleCancel(): void {
  emit('cancel')
}

// Handle view diff
function handleViewDiff(): void {
  emit('viewDiff')
}

// Load async options for select fields
async function loadFieldOptions(field: FormField): Promise<void> {
  if (field.type !== 'select' || !field.options) return

  if (typeof field.options === 'function') {
    fieldLoading.value[field.name] = true
    try {
      const options = await field.options()
      fieldOptions.value[field.name] = options
    } catch (error) {
      console.error(`Failed to load options for field ${field.name}:`, error)
      message.error(`Failed to load options for ${field.label}`)
      fieldOptions.value[field.name] = []
    } finally {
      fieldLoading.value[field.name] = false
    }
  } else {
    fieldOptions.value[field.name] = field.options
  }
}

// Draft management
function getDraftKey(): string {
  // Use a unique key based on form schema or route
  return `${DRAFT_KEY_PREFIX}${JSON.stringify(props.schema.fields.map((f) => f.name))}`
}

function saveDraft(): void {
  if (!props.enableDraft) return
  const draftKey = getDraftKey()
  localStorage.setItem(draftKey, JSON.stringify(formData.value))
}

function saveDraftDebounced(): void {
  if (draftTimer) {
    clearTimeout(draftTimer)
  }
  draftTimer = setTimeout(() => {
    saveDraft()
  }, 1000)
}

function loadDraft(): boolean {
  if (!props.enableDraft) return false
  const draftKey = getDraftKey()
  const draft = localStorage.getItem(draftKey)
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      formData.value = { ...formData.value, ...draftData }
      return true
    } catch (error) {
      console.error('Failed to load draft:', error)
      return false
    }
  }
  return false
}

function clearDraft(): void {
  if (!props.enableDraft) return
  const draftKey = getDraftKey()
  localStorage.removeItem(draftKey)
}

// Watch for external model value changes
watch(
  () => props.modelValue,
  (newValue) => {
    formData.value = { ...newValue }
  },
  { deep: true }
)

// Initialize
onMounted(async () => {
  // Load draft if enabled
  if (props.enableDraft && props.mode === 'create') {
    const draftLoaded = loadDraft()
    if (draftLoaded) {
      message.info('Draft loaded from previous session')
    }
  }

  // Load async options for all select fields
  const selectFields = props.schema.fields.filter((f) => f.type === 'select')
  await Promise.all(selectFields.map((field) => loadFieldOptions(field)))
})

// Expose methods to parent component
async function validate(): Promise<boolean> {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch (error) {
    return false
  }
}

function resetFields(): void {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

function clearValidate(): void {
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// Expose methods for parent components
defineExpose({
  validate,
  resetFields,
  clearValidate,
  formData,
})

// Cleanup
onUnmounted(() => {
  if (draftTimer) {
    clearTimeout(draftTimer)
  }
})
</script>

<style scoped>
.ant-form {
  max-width: 100%;
}
</style>
