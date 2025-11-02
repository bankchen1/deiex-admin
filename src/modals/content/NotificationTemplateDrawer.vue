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
        <a-col :span="12">
          <a-form-item label="Type" name="type">
            <a-select
              v-model:value="formData.type"
              placeholder="Select template type"
              :options="typeOptions"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Status" name="status">
            <a-select
              v-model:value="formData.status"
              placeholder="Select status"
              :options="statusOptions"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Description" name="description">
            <a-textarea
              v-model:value="formData.description"
              placeholder="Enter template description"
              :rows="3"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Title" name="title">
            <MultiLanguageInput
              v-model:value="formData.title"
              placeholder="Enter notification title"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Content" name="content">
            <MultiLanguageInput
              v-model:value="formData.content"
              placeholder="Enter notification content"
              :rows="6"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Channels" name="channels">
            <a-checkbox-group v-model:value="formData.channels">
              <a-checkbox value="email">Email</a-checkbox>
              <a-checkbox value="sms">SMS</a-checkbox>
              <a-checkbox value="push">Push Notification</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
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
              Add variables that can be replaced with actual values when sending notifications.
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
import type { NotificationTemplate } from '@/types/models'

interface Props {
  open?: boolean
  template?: NotificationTemplate | null
  mode?: 'create' | 'edit' | 'view'
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', payload: Partial<NotificationTemplate>): void
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
  description: '',
  type: 'system' as 'system' | 'marketing' | 'alert',
  title: {} as Record<string, string>,
  content: {} as Record<string, string>,
  channels: [] as ('email' | 'sms' | 'push')[],
  status: 'active' as 'active' | 'inactive',
  variables: [] as string[],
})

const formRef = ref()
const visible = ref(false)

// Options
const typeOptions = [
  { label: 'System', value: 'system' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Alert', value: 'alert' },
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

// Form rules
const formRules = {
  name: [{ required: true, message: 'Please enter template name' }],
  type: [{ required: true, message: 'Please select template type' }],
  title: [{ required: true, message: 'Please enter notification title' }],
  content: [{ required: true, message: 'Please enter notification content' }],
  channels: [{ required: true, message: 'Please select at least one channel' }],
}

// Computed
const drawerTitle = computed(() => {
  if (props.mode === 'create') return 'Create Notification Template'
  if (props.mode === 'edit') return 'Edit Notification Template'
  return 'View Notification Template'
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
        description: props.template.description || '',
        type: props.template.type,
        title: props.template.title || {},
        content: props.template.content || {},
        channels: [...props.template.channels],
        status: props.template.status,
        variables: [...(props.template.variables || [])],
      }
    } else if (newVal && props.mode === 'create') {
      // Reset form for create mode
      formData.value = {
        name: '',
        description: '',
        type: 'system',
        title: {},
        content: {},
        channels: [],
        status: 'active',
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
    const payload: Partial<NotificationTemplate> = {
      name: formData.value.name,
      description: formData.value.description,
      type: formData.value.type,
      title: formData.value.title,
      content: formData.value.content,
      channels: formData.value.channels,
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
