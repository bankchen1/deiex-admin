<template>
  <a-drawer
    v-model:open="visible"
    :title="drawerTitle"
    width="720"
    :body-style="{ paddingBottom: '80px' }"
    @close="handleClose"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      layout="vertical"
      @finish="handleSubmit"
    >
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Name" name="name">
            <a-input v-model:value="formData.name" placeholder="Enter template name" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Subject" name="subject">
            <MultiLanguageInput
              v-model:value="formData.subject"
              placeholder="Enter email subject"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Preview Text" name="previewText">
            <MultiLanguageInput
              v-model:value="formData.previewText"
              placeholder="Enter preview text"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Content" name="content">
            <MultiLanguageInput
              v-model:value="formData.content"
              placeholder="Enter email content"
              :rows="10"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Status" name="status">
            <a-select
              v-model:value="formData.status"
              placeholder="Select status"
              :options="statusOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Variables" name="variables">
            <a-select
              v-model:value="formData.variables"
              mode="tags"
              placeholder="Add template variables (e.g., {{username}}, {{amount}})"
              style="width: 100%"
            >
              <a-select-option value="{{username}}">{{ username }}</a-select-option>
              <a-select-option value="{{amount}}">{{ amount }}</a-select-option>
              <a-select-option value="{{date}}">{{ date }}</a-select-option>
              <a-select-option value="{{time}}">{{ time }}</a-select-option>
            </a-select>
            <div class="variables-hint">
              Add variables that can be replaced with actual values when sending emails.
            </div>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="handleClose">Cancel</a-button>
        <a-button v-if="mode !== 'view'" type="primary" @click="handleSubmitForm">
          {{ mode === 'create' ? 'Create' : 'Update' }}
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import MultiLanguageInput from '@/shared/MultiLanguageInput.vue'
import type { EmailTemplate } from '@/types/models'

interface Props {
  open?: boolean
  template?: EmailTemplate | null
  mode?: 'create' | 'edit' | 'view'
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', payload: Partial<EmailTemplate>): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  template: null,
  mode: 'create',
})

const emit = defineEmits<Emits>()

// Form data
const formData = ref({
  name: '',
  subject: {} as Record<string, string>,
  previewText: {} as Record<string, string>,
  content: {} as Record<string, string>,
  status: 'draft' as 'draft' | 'active' | 'inactive',
  variables: [] as string[],
})

const formRef = ref()
const visible = ref(false)

// Options
const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

// Form rules
const formRules = {
  name: [{ required: true, message: 'Please enter template name' }],
  subject: [{ required: true, message: 'Please enter email subject' }],
  content: [{ required: true, message: 'Please enter email content' }],
  status: [{ required: true, message: 'Please select status' }],
}

// Computed
const drawerTitle = computed(() => {
  if (props.mode === 'create') return 'Create Email Template'
  if (props.mode === 'edit') return 'Edit Email Template'
  return 'View Email Template'
})

// Watchers
watch(
  () => props.open,
  (newVal) => {
    visible.value = newVal
    if (newVal && props.template) {
      // Populate form with template data
      formData.value = {
        name: props.template.name,
        subject: props.template.subject || {},
        previewText: props.template.previewText || {},
        content: props.template.content || {},
        status: props.template.status,
        variables: [...(props.template.variables || [])],
      }
    } else if (newVal && props.mode === 'create') {
      // Reset form for create mode
      formData.value = {
        name: '',
        subject: {},
        previewText: {},
        content: {},
        status: 'draft',
        variables: [],
      }
    }
  }
)

// Methods
function handleClose() {
  visible.value = false
  emit('update:open', false)
  emit('close')
}

async function handleSubmitForm() {
  try {
    await formRef.value?.validate()
    const payload: Partial<EmailTemplate> = {
      name: formData.value.name,
      subject: formData.value.subject,
      previewText: formData.value.previewText,
      content: formData.value.content,
      status: formData.value.status,
      variables: formData.value.variables,
    }
    emit('submit', payload)
  } catch (error) {
    message.error('Please check the form for errors')
  }
}

function handleSubmit() {
  handleSubmitForm()
}
</script>

<style scoped>
.variables-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}
</style>
