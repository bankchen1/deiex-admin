<template>
  <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical" @finish="handleSubmit">
    <a-form-item label="VIP Level" name="vipLevel">
      <a-input-number
        v-model:value="formState.vipLevel"
        :min="0"
        :max="9"
        :disabled="mode === 'edit'"
        style="width: 100%"
        placeholder="Enter VIP level (0-9)"
      />
    </a-form-item>

    <a-form-item label="Maker Rate (%)" name="makerRate">
      <a-input-number
        v-model:value="formState.makerRate"
        :min="0"
        :max="100"
        :step="0.0001"
        :precision="4"
        style="width: 100%"
        placeholder="Enter maker rate"
      >
        <template #addonAfter>%</template>
      </a-input-number>
    </a-form-item>

    <a-form-item label="Taker Rate (%)" name="takerRate">
      <a-input-number
        v-model:value="formState.takerRate"
        :min="0"
        :max="100"
        :step="0.0001"
        :precision="4"
        style="width: 100%"
        placeholder="Enter taker rate"
      >
        <template #addonAfter>%</template>
      </a-input-number>
    </a-form-item>

    <a-form-item name="inheritFromPrevious">
      <a-checkbox v-model:checked="formState.inheritFromPrevious">
        Inherit from previous VIP level
      </a-checkbox>
      <a-typography-text type="secondary" style="display: block; margin-top: 4px">
        If enabled, this tier will use the same rates as the previous VIP level
      </a-typography-text>
    </a-form-item>

    <a-form-item label="Description" name="description">
      <a-textarea
        v-model:value="formState.description"
        :rows="3"
        placeholder="Optional description for this fee tier"
      />
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ mode === 'create' ? 'Create' : 'Update' }}
        </a-button>
        <a-button @click="handleCancel">Cancel</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import type { TradingFeeTemplate } from '@/types/models'

interface Props {
  tradingFee?: TradingFeeTemplate | null
  mode?: 'create' | 'edit'
  loading?: boolean
}

interface Emits {
  (e: 'submit', payload: any): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  tradingFee: null,
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()

const formState = reactive({
  vipLevel: 0,
  makerRate: 0,
  takerRate: 0,
  inheritFromPrevious: false,
  description: '',
})

const rules: Record<string, Rule[]> = {
  vipLevel: [
    { required: true, message: 'Please enter VIP level', type: 'number' },
    { type: 'number', min: 0, max: 9, message: 'VIP level must be between 0 and 9' },
  ],
  makerRate: [
    { required: true, message: 'Please enter maker rate', type: 'number' },
    { type: 'number', min: 0, max: 100, message: 'Maker rate must be between 0 and 100' },
  ],
  takerRate: [
    { required: true, message: 'Please enter taker rate', type: 'number' },
    { type: 'number', min: 0, max: 100, message: 'Taker rate must be between 0 and 100' },
  ],
}

watch(
  () => props.tradingFee,
  (newValue) => {
    if (newValue) {
      formState.vipLevel = newValue.vipLevel
      formState.makerRate = newValue.makerRate * 100 // Convert to percentage
      formState.takerRate = newValue.takerRate * 100 // Convert to percentage
      formState.inheritFromPrevious = newValue.inheritFromPrevious
      formState.description = newValue.description || ''
    }
  },
  { immediate: true }
)

function handleSubmit() {
  const payload = {
    vipLevel: formState.vipLevel,
    makerRate: formState.makerRate / 100, // Convert back to decimal
    takerRate: formState.takerRate / 100, // Convert back to decimal
    inheritFromPrevious: formState.inheritFromPrevious,
    description: formState.description || undefined,
  }
  emit('submit', payload)
}

function handleCancel() {
  emit('cancel')
}

defineExpose({
  resetFields: () => formRef.value?.resetFields(),
})
</script>
