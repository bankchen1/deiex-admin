<template>
  <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical">
    <a-form-item label="User ID" name="userId">
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
      <div v-if="requiresDualApproval" class="form-hint warning">
        <ExclamationCircleOutlined />
        <span
          >VIP level {{ formData.vipLevel }} requires dual approval from another
          administrator.</span
        >
      </div>
    </a-form-item>

    <a-form-item label="Reason" name="reason">
      <a-textarea
        v-model:value="formData.reason"
        placeholder="Enter reason for VIP level adjustment"
        :rows="3"
        :maxlength="500"
        show-count
      />
      <div class="form-hint">Provide a clear explanation for this VIP level change.</div>
    </a-form-item>

    <a-form-item label="Notes (Optional)" name="notes">
      <a-textarea
        v-model:value="formData.notes"
        placeholder="Additional notes or context"
        :rows="2"
        :maxlength="500"
        show-count
      />
    </a-form-item>

    <a-alert
      v-if="requiresDualApproval"
      message="Dual Approval Required"
      description="This VIP level change requires approval from another administrator before it takes effect. The request will be submitted for review."
      type="warning"
      show-icon
      style="margin-top: 16px"
    />
  </a-form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

interface Props {
  userId?: string
  currentVipLevel?: number
}

interface Emits {
  (e: 'update:modelValue', value: FormData): void
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

const formRef = ref<FormInstance>()

const formData = ref<FormData>({
  userId: '',
  currentVipLevel: 0,
  vipLevel: 0,
  reason: '',
  notes: '',
})

// VIP levels available in the system
const vipLevels = [0, 1, 2, 3, 4, 5]

const rules: Record<string, Rule[]> = {
  vipLevel: [
    { required: true, message: 'Please select a VIP level', trigger: 'change' },
    {
      validator: (_rule, value) => {
        if (value === formData.value.currentVipLevel) {
          return Promise.reject('New VIP level must be different from current level')
        }
        return Promise.resolve()
      },
      trigger: 'change',
    },
  ],
  reason: [
    { required: true, message: 'Please enter a reason', trigger: 'blur' },
    { min: 10, message: 'Reason must be at least 10 characters', trigger: 'blur' },
    { max: 500, message: 'Reason cannot exceed 500 characters', trigger: 'blur' },
  ],
  notes: [{ max: 500, message: 'Notes cannot exceed 500 characters', trigger: 'blur' }],
}

// Require dual approval for VIP level >= 3
const requiresDualApproval = computed(() => {
  return formData.value.vipLevel >= 3
})

// Watch for prop changes
watch(
  () => [props.userId, props.currentVipLevel],
  () => {
    formData.value.userId = props.userId || ''
    formData.value.currentVipLevel = props.currentVipLevel || 0
    formData.value.vipLevel = props.currentVipLevel || 0
  },
  { immediate: true }
)

// Watch for form data changes
watch(
  formData,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true }
)

function getVipColor(level: number): string {
  if (level === 0) return 'default'
  if (level <= 2) return 'blue'
  if (level <= 4) return 'purple'
  return 'gold'
}

async function validate() {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch (error) {
    return false
  }
}

function resetFields() {
  formRef.value?.resetFields()
  formData.value = {
    userId: props.userId || '',
    currentVipLevel: props.currentVipLevel || 0,
    vipLevel: props.currentVipLevel || 0,
    reason: '',
    notes: '',
  }
}

defineExpose({
  validate,
  resetFields,
  formData,
  requiresDualApproval,
})
</script>

<style scoped>
.form-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.form-hint.warning {
  color: #faad14;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
