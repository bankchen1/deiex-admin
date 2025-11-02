<template>
  <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical" @finish="handleSubmit">
    <a-form-item label="Currency" name="currency">
      <a-select
        v-model:value="formState.currency"
        :disabled="mode === 'edit'"
        placeholder="Select currency"
        show-search
        :filter-option="filterOption"
      >
        <a-select-option v-for="curr in currencies" :key="curr" :value="curr">
          {{ curr }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Chain" name="chain">
      <a-select
        v-model:value="formState.chain"
        :disabled="mode === 'edit'"
        placeholder="Select chain"
      >
        <a-select-option v-for="ch in chains" :key="ch" :value="ch">
          {{ ch }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Fixed Fee" name="fixedFee">
      <a-input v-model:value="formState.fixedFee" placeholder="Enter fixed fee amount">
        <template #addonAfter>{{ formState.currency || 'Currency' }}</template>
      </a-input>
    </a-form-item>

    <a-form-item label="Percentage Fee (%)" name="percentageFee">
      <a-input-number
        v-model:value="formState.percentageFee"
        :min="0"
        :max="100"
        :step="0.01"
        :precision="4"
        style="width: 100%"
        placeholder="Enter percentage fee"
      >
        <template #addonAfter>%</template>
      </a-input-number>
    </a-form-item>

    <a-form-item label="Minimum Fee" name="minFee">
      <a-input v-model:value="formState.minFee" placeholder="Enter minimum fee">
        <template #addonAfter>{{ formState.currency || 'Currency' }}</template>
      </a-input>
    </a-form-item>

    <a-form-item label="Daily Limit" name="dailyLimit">
      <a-input v-model:value="formState.dailyLimit" placeholder="Enter daily withdrawal limit">
        <template #addonAfter>{{ formState.currency || 'Currency' }}</template>
      </a-input>
    </a-form-item>

    <a-form-item label="Description" name="description">
      <a-textarea
        v-model:value="formState.description"
        :rows="3"
        placeholder="Optional description for this withdrawal fee"
      />
    </a-form-item>

    <a-alert
      type="info"
      message="Fee Calculation"
      description="Total fee = max(Fixed Fee + (Amount × Percentage Fee), Minimum Fee)"
      show-icon
      style="margin-bottom: 16px"
    />

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
import type { WithdrawalFeeTemplate } from '@/types/models'

interface Props {
  withdrawalFee?: WithdrawalFeeTemplate | null
  mode?: 'create' | 'edit'
  loading?: boolean
}

interface Emits {
  (e: 'submit', payload: any): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  withdrawalFee: null,
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()

const formState = reactive({
  currency: '',
  chain: '',
  fixedFee: '',
  percentageFee: 0,
  minFee: '',
  dailyLimit: '',
  description: '',
})

const currencies = ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'SOL', 'ADA', 'DOT', 'MATIC', 'AVAX']
const chains = ['ERC20', 'TRC20', 'BEP20', 'Polygon', 'Avalanche', 'Solana', 'Bitcoin', 'Ethereum']

const rules: Record<string, Rule[]> = {
  currency: [{ required: true, message: 'Please select currency' }],
  chain: [{ required: true, message: 'Please select chain' }],
  fixedFee: [
    { required: true, message: 'Please enter fixed fee' },
    {
      pattern: /^\d+(\.\d+)?$/,
      message: 'Please enter a valid number',
    },
  ],
  percentageFee: [
    { required: true, message: 'Please enter percentage fee', type: 'number' },
    { type: 'number', min: 0, max: 100, message: 'Percentage fee must be between 0 and 100' },
  ],
  minFee: [
    { required: true, message: 'Please enter minimum fee' },
    {
      pattern: /^\d+(\.\d+)?$/,
      message: 'Please enter a valid number',
    },
  ],
  dailyLimit: [
    { required: true, message: 'Please enter daily limit' },
    {
      pattern: /^\d+(\.\d+)?$/,
      message: 'Please enter a valid number',
    },
  ],
}

watch(
  () => props.withdrawalFee,
  (newValue) => {
    if (newValue) {
      formState.currency = newValue.currency
      formState.chain = newValue.chain
      formState.fixedFee = newValue.fixedFee
      formState.percentageFee = newValue.percentageFee * 100 // Convert to percentage
      formState.minFee = newValue.minFee
      formState.dailyLimit = newValue.dailyLimit
      formState.description = newValue.description || ''
    }
  },
  { immediate: true }
)

function handleSubmit() {
  const payload = {
    currency: formState.currency,
    chain: formState.chain,
    fixedFee: formState.fixedFee,
    percentageFee: formState.percentageFee / 100, // Convert back to decimal
    minFee: formState.minFee,
    dailyLimit: formState.dailyLimit,
    description: formState.description || undefined,
  }
  emit('submit', payload)
}

function handleCancel() {
  emit('cancel')
}

function filterOption(input: string, option: any) {
  return option.value.toLowerCase().includes(input.toLowerCase())
}

defineExpose({
  resetFields: () => formRef.value?.resetFields(),
})
</script>
