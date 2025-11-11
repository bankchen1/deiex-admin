<template>
  <a-form
    :model="formState"
    :rules="rules"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    @finish="handleSubmit"
  >
    <a-form-item label="Limit Name" name="name">
      <a-input v-model:value="formState.name" placeholder="Enter limit name" />
    </a-form-item>

    <a-form-item label="Description" name="description">
      <a-textarea
        v-model:value="formState.description"
        placeholder="Enter limit description"
        :rows="3"
      />
    </a-form-item>

    <a-divider>Scope Configuration</a-divider>

    <a-form-item label="Scope" name="scope">
      <a-select
        v-model:value="formState.scope"
        placeholder="Select scope"
        @change="handleScopeChange"
      >
        <a-select-option value="user">User</a-select-option>
        <a-select-option value="country">Country</a-select-option>
        <a-select-option value="device">Device</a-select-option>
        <a-select-option value="currency">Currency</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      v-if="formState.scope && formState.scope !== 'currency'"
      label="Scope Value"
      name="scopeValue"
    >
      <a-input v-model:value="formState.scopeValue" :placeholder="getScopeValuePlaceholder()" />
    </a-form-item>

    <a-form-item label="Limit Type" name="type">
      <a-select v-model:value="formState.type" placeholder="Select limit type">
        <a-select-option value="deposit">Deposit</a-select-option>
        <a-select-option value="withdrawal">Withdrawal</a-select-option>
        <a-select-option value="trading">Trading</a-select-option>
        <a-select-option value="position">Position</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      v-if="['deposit', 'withdrawal'].includes(formState.type || '')"
      label="Currency"
      name="currency"
    >
      <a-input v-model:value="formState.currency" placeholder="e.g., USDT, BTC" />
    </a-form-item>

    <a-divider>Threshold Configuration</a-divider>

    <a-form-item label="Period" name="period">
      <a-select v-model:value="formState.period" placeholder="Select period">
        <a-select-option value="daily">Daily</a-select-option>
        <a-select-option value="weekly">Weekly</a-select-option>
        <a-select-option value="monthly">Monthly</a-select-option>
        <a-select-option value="lifetime">Lifetime</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Threshold" name="threshold">
      <a-input
        v-model:value="formState.threshold"
        placeholder="Enter threshold amount"
        addon-after="USD"
      />
    </a-form-item>

    <a-divider>Effective Period</a-divider>

    <a-form-item label="Effective From" name="effectiveFrom">
      <a-date-picker
        v-model:value="formState.effectiveFrom"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
        style="width: 100%"
      />
    </a-form-item>

    <a-form-item label="Effective To" name="effectiveTo">
      <a-date-picker
        v-model:value="formState.effectiveTo"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
        style="width: 100%"
      />
    </a-form-item>

    <a-form-item label="Enabled" name="enabled">
      <a-switch v-model:checked="formState.enabled" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
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
import { reactive, watch } from 'vue'
import type { RiskLimit } from '@/contracts/risk'
import dayjs, { Dayjs } from 'dayjs'

interface Props {
  initialData?: RiskLimit
  mode?: 'create' | 'edit'
  loading?: boolean
}

interface Emits {
  (e: 'submit', data: Partial<RiskLimit>): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formState = reactive<Partial<RiskLimit> & { effectiveFrom?: Dayjs; effectiveTo?: Dayjs }>({
  name: '',
  description: '',
  scope: 'user',
  scopeValue: '',
  type: 'deposit',
  period: 'daily',
  threshold: '',
  currency: '',
  enabled: true,
  effectiveFrom: undefined,
  effectiveTo: undefined,
})

const rules = {
  name: [{ required: true, message: 'Please enter limit name' }],
  scope: [{ required: true, message: 'Please select scope' }],
  type: [{ required: true, message: 'Please select limit type' }],
  period: [{ required: true, message: 'Please select period' }],
  threshold: [{ required: true, message: 'Please enter threshold' }],
}

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      Object.assign(formState, {
        name: newData.name,
        description: newData.description,
        scope: newData.scope,
        scopeValue: newData.scopeValue,
        type: newData.type,
        period: newData.period,
        threshold: newData.threshold,
        currency: newData.currency,
        enabled: newData.enabled,
        effectiveFrom: newData.effectiveFrom ? dayjs(newData.effectiveFrom) : undefined,
        effectiveTo: newData.effectiveTo ? dayjs(newData.effectiveTo) : undefined,
      })
    }
  },
  { immediate: true }
)

function handleScopeChange() {
  formState.scopeValue = ''
}

function getScopeValuePlaceholder(): string {
  switch (formState.scope) {
    case 'user':
      return 'Enter user ID or leave empty for all users'
    case 'country':
      return 'Enter country code (e.g., US, CN)'
    case 'device':
      return 'Enter device ID or leave empty for all devices'
    default:
      return 'Enter scope value'
  }
}

function handleSubmit() {
  const submitData: Partial<RiskLimit> = {
    ...formState,
    effectiveFrom: formState.effectiveFrom?.toISOString(),
    effectiveTo: formState.effectiveTo?.toISOString(),
  }
  emit('submit', submitData)
}

function handleCancel() {
  emit('cancel')
}
</script>
