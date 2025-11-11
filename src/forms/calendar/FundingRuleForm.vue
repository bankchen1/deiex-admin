<template>
  <SchemaForm
    v-model="formData"
    :schema="formSchema"
    :mode="mode"
    :enable-draft="mode !== 'view'"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SchemaForm from '@/shared/SchemaForm.vue'
import type { FormSchema } from '@/types/components'
import type { FundingRule } from '@/contracts/calendar'

interface Props {
  funding?: FundingRule | null
  mode?: 'create' | 'edit' | 'view'
}

interface Emits {
  (e: 'submit', payload: Partial<FundingRule>): void
}

const props = withDefaults(defineProps<Props>(), {
  funding: null,
  mode: 'create',
})

const emit = defineEmits<Emits>()

const formData = ref<Partial<FundingRule>>({
  symbol: '',
  period: 8,
  calculationRule: '',
  enabled: true,
  nextFundingTime: '',
})

const formSchema = computed<FormSchema>(() => ({
  fields: [
    {
      name: 'symbol',
      label: 'Symbol',
      type: 'input',
      rules: [{ required: true, message: 'Please enter symbol' }],
      props: {
        placeholder: 'e.g., BTCUSDT',
        disabled: props.mode === 'edit',
      },
    },
    {
      name: 'period',
      label: 'Funding Period (hours)',
      type: 'number',
      rules: [
        { required: true, message: 'Please enter funding period' },
        { type: 'number', min: 1, max: 24, message: 'Period must be between 1 and 24 hours' },
      ],
      props: {
        placeholder: 'e.g., 8',
        min: 1,
        max: 24,
      },
    },
    {
      name: 'nextFundingTime',
      label: 'Next Funding Time',
      type: 'date',
      rules: [{ required: true, message: 'Please select next funding time' }],
      props: {
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      name: 'calculationRule',
      label: 'Calculation Rule',
      type: 'textarea',
      rules: [{ required: true, message: 'Please enter calculation rule' }],
      props: {
        placeholder: 'Enter the formula or rule for calculating funding rate',
        rows: 4,
      },
    },
    {
      name: 'enabled',
      label: 'Enabled',
      type: 'switch',
      props: {
        checkedChildren: 'Enabled',
        unCheckedChildren: 'Disabled',
      },
    },
  ],
  layout: 'vertical',
}))

watch(
  () => props.funding,
  (newFunding) => {
    if (newFunding) {
      formData.value = { ...newFunding }
    } else {
      formData.value = {
        symbol: '',
        period: 8,
        calculationRule: '',
        enabled: true,
        nextFundingTime: '',
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  emit('submit', formData.value)
}
</script>
