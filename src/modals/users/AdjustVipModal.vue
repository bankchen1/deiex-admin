<template>
  <a-modal
    v-model:open="visible"
    title="Adjust VIP Level"
    :confirm-loading="loading"
    :ok-text="okText"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-alert
      v-if="requiresDualApproval"
      message="Dual Approval Required"
      description="This VIP level change requires approval from another administrator."
      type="warning"
      show-icon
      style="margin-bottom: 16px"
    />

    <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical">
      <a-form-item label="User" name="userId">
        <a-input v-model:value="formData.userId" disabled />
      </a-form-item>

      <a-form-item label="Current VIP Level" name="currentVipLevel">
        <a-tag :color="getVipColor(formData.currentVipLevel)">
          VIP {{ formData.currentVipLevel }}
        </a-tag>
      </a-form-item>

      <a-form-item label="New VIP Level" name="vipLevel">
        <a-select v-model:value="formData.vipLevel" placeholder="Select new VIP level">
          <a-select-option
            v-for="level in vipLevels"
            :key="level"
            :value="level"
            :disabled="level === formData.currentVipLevel"
          >
            VIP {{ level }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Reason" name="reason">
        <a-textarea
          v-model:value="formData.reason"
          placeholder="Enter reason for VIP level adjustment"
          :rows="3"
          :maxlength="500"
          show-count
        />
      </a-form-item>

      <a-form-item label="Notes (Optional)" name="notes">
        <a-textarea
          v-model:value="formData.notes"
          placeholder="Additional notes"
          :rows="2"
          :maxlength="500"
          show-count
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'

interface Props {
  open: boolean
  userId?: string
  currentVipLevel?: number
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', data: FormData): void
}

interface FormData {
  userId: string
  currentVipLevel: number
  vipLevel: number
  reason: string
  notes?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentVipLevel: 0,
})

const emit = defineEmits<Emits>()

const visible = ref(false)
const loading = ref(false)
const formRef = ref<FormInstance>()

const vipLevels = [0, 1, 2, 3, 4, 5]

const formData = ref<FormData>({
  userId: '',
  currentVipLevel: 0,
  vipLevel: 0,
  reason: '',
  notes: '',
})

const rules: Record<string, Rule[]> = {
  vipLevel: [{ required: true, message: 'Please select a VIP level', trigger: 'change' }],
  reason: [
    { required: true, message: 'Please enter a reason', trigger: 'blur' },
    { min: 10, message: 'Reason must be at least 10 characters', trigger: 'blur' },
  ],
}

const requiresDualApproval = computed(() => {
  // Require dual approval for VIP level >= 3
  return formData.value.vipLevel >= 3
})

const okText = computed(() => {
  return requiresDualApproval.value ? 'Submit for Approval' : 'Confirm'
})

// Watch for open prop changes
watch(
  () => props.open,
  (newVal) => {
    visible.value = newVal
    if (newVal) {
      resetForm()
      formData.value.userId = props.userId || ''
      formData.value.currentVipLevel = props.currentVipLevel || 0
      formData.value.vipLevel = props.currentVipLevel || 0
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

    emit('submit', { ...formData.value })

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
    currentVipLevel: 0,
    vipLevel: 0,
    reason: '',
    notes: '',
  }
}

function getVipColor(level: number): string {
  if (level === 0) return 'default'
  if (level <= 2) return 'blue'
  if (level <= 4) return 'purple'
  return 'gold'
}
</script>
