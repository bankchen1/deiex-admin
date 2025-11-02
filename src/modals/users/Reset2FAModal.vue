<template>
  <a-modal
    v-model:open="visible"
    title="Reset 2FA"
    :confirm-loading="loading"
    ok-text="Confirm Reset"
    ok-type="danger"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-alert
      message="Warning"
      description="Resetting 2FA will disable two-factor authentication for this user. They will need to set it up again."
      type="warning"
      show-icon
      style="margin-bottom: 16px"
    />

    <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical">
      <a-form-item label="User ID" name="userId">
        <a-input v-model:value="formData.userId" disabled />
      </a-form-item>

      <a-form-item label="Reason" name="reason">
        <a-select v-model:value="formData.reason" placeholder="Select reason for 2FA reset">
          <a-select-option value="lost_device">Lost Device</a-select-option>
          <a-select-option value="device_stolen">Device Stolen</a-select-option>
          <a-select-option value="app_malfunction">App Malfunction</a-select-option>
          <a-select-option value="user_request">User Request</a-select-option>
          <a-select-option value="security_concern">Security Concern</a-select-option>
          <a-select-option value="other">Other</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item v-if="formData.reason === 'other'" label="Custom Reason" name="customReason">
        <a-textarea
          v-model:value="formData.customReason"
          placeholder="Enter custom reason"
          :rows="2"
          :maxlength="200"
          show-count
        />
      </a-form-item>

      <a-form-item label="Additional Notes (Optional)" name="notes">
        <a-textarea
          v-model:value="formData.notes"
          placeholder="Additional notes or context"
          :rows="3"
          :maxlength="500"
          show-count
        />
      </a-form-item>

      <a-form-item name="confirm">
        <a-checkbox v-model:checked="formData.confirm">
          I confirm that I want to reset 2FA for this user
        </a-checkbox>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'

interface Props {
  open: boolean
  userId?: string
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', data: SubmitData): void
}

interface FormData {
  userId: string
  reason: string
  customReason?: string
  notes?: string
  confirm: boolean
}

interface SubmitData {
  reason: string
  notes?: string
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = ref(false)
const loading = ref(false)
const formRef = ref<FormInstance>()

const formData = ref<FormData>({
  userId: '',
  reason: '',
  customReason: '',
  notes: '',
  confirm: false,
})

const rules: Record<string, Rule[]> = {
  reason: [{ required: true, message: 'Please select a reason', trigger: 'change' }],
  customReason: [
    {
      required: true,
      message: 'Please enter a custom reason',
      trigger: 'blur',
      validator: (_rule, value) => {
        if (formData.value.reason === 'other' && !value) {
          return Promise.reject('Please enter a custom reason')
        }
        return Promise.resolve()
      },
    },
  ],
  confirm: [
    {
      required: true,
      message: 'Please confirm the action',
      trigger: 'change',
      validator: (_rule, value) => {
        if (!value) {
          return Promise.reject('Please confirm the action')
        }
        return Promise.resolve()
      },
    },
  ],
}

// Watch for open prop changes
watch(
  () => props.open,
  (newVal) => {
    visible.value = newVal
    if (newVal) {
      resetForm()
      formData.value.userId = props.userId || ''
    }
  },
  { immediate: true }
)

// Watch for visible changes
watch(visible, (newVal) => {
  emit('update:open', newVal)
})

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const submitData: SubmitData = {
      reason:
        formData.value.reason === 'other'
          ? formData.value.customReason || formData.value.reason
          : formData.value.reason,
      notes: formData.value.notes,
    }

    emit('submit', submitData)

    // Close modal after successful submission
    setTimeout(() => {
      loading.value = false
      visible.value = false
    }, 500)
  } catch (error) {
    console.error('Validation failed:', error)
    loading.value = false
  }
}

function handleCancel() {
  visible.value = false
}

function resetForm() {
  formRef.value?.resetFields()
  formData.value = {
    userId: '',
    reason: '',
    customReason: '',
    notes: '',
    confirm: false,
  }
}
</script>
