<template>
  <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical">
    <a-form-item label="User ID" name="userId">
      <a-input v-model:value="formData.userId" disabled />
    </a-form-item>

    <a-form-item label="Current Tags" name="currentTags">
      <a-space v-if="formData.currentTags && formData.currentTags.length > 0" wrap>
        <a-tag v-for="tag in formData.currentTags" :key="tag" color="red">
          {{ tag }}
        </a-tag>
      </a-space>
      <span v-else class="text-muted">No tags</span>
    </a-form-item>

    <a-form-item label="Risk Tags" name="tags">
      <TagPicker
        v-model:value="formData.tags"
        :options="tagOptions"
        placeholder="Select or add risk tags"
        :max-tags="10"
      />
      <div class="form-hint">Select existing tags or type to create new ones. Maximum 10 tags.</div>
    </a-form-item>

    <a-form-item label="Reason" name="reason">
      <a-textarea
        v-model:value="formData.reason"
        placeholder="Enter reason for tag changes"
        :rows="3"
        :maxlength="500"
        show-count
      />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import TagPicker from '@/shared/TagPicker.vue'

interface Props {
  userId?: string
  currentTags?: string[]
}

interface Emits {
  (e: 'update:modelValue', value: FormData): void
}

interface FormData {
  userId: string
  currentTags: string[]
  tags: string[]
  reason: string
}

const props = withDefaults(defineProps<Props>(), {
  currentTags: () => [],
})

const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()

const formData = ref<FormData>({
  userId: '',
  currentTags: [],
  tags: [],
  reason: '',
})

// Common risk tags
const tagOptions = [
  'high_risk',
  'suspicious_activity',
  'multiple_accounts',
  'chargeback',
  'fraud_attempt',
  'money_laundering',
  'sanctioned',
  'pep',
  'adverse_media',
  'unusual_pattern',
  'large_transactions',
  'rapid_trading',
  'wash_trading',
  'market_manipulation',
]

const rules: Record<string, Rule[]> = {
  tags: [
    {
      type: 'array',
      max: 10,
      message: 'Maximum 10 tags allowed',
      trigger: 'change',
    },
  ],
  reason: [
    { required: true, message: 'Please enter a reason', trigger: 'blur' },
    { min: 10, message: 'Reason must be at least 10 characters', trigger: 'blur' },
  ],
}

// Watch for prop changes
watch(
  () => [props.userId, props.currentTags],
  () => {
    formData.value.userId = props.userId || ''
    formData.value.currentTags = props.currentTags || []
    formData.value.tags = [...(props.currentTags || [])]
  },
  { immediate: true, deep: true }
)

// Watch for form data changes
watch(
  formData,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true }
)

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
}

defineExpose({
  validate,
  resetFields,
  formData,
})
</script>

<style scoped>
.text-muted {
  color: #999;
}

.form-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>
