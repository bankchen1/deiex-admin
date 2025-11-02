<template>
  <div class="instrument-form">
    <SchemaForm
      ref="schemaFormRef"
      v-model="formData"
      :schema="formSchema"
      :mode="mode"
      enable-draft
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SchemaForm from '@/shared/SchemaForm.vue'
import type { FormSchema } from '@/types/components'
import type { Instrument } from '@/types/models'
import type { InstrumentCreatePayload, InstrumentUpdatePayload } from '@/types/api'

interface Props {
  initialData?: Instrument
  mode?: 'create' | 'edit' | 'view'
}

interface Emits {
  (e: 'submit', data: InstrumentCreatePayload | InstrumentUpdatePayload): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
})

const emit = defineEmits<Emits>()

// Refs
const schemaFormRef = ref()

// Form data
const formData = ref<Partial<Instrument>>({
  symbol: '',
  displayName: { en: '', zh: '' },
  base: '',
  quote: '',
  type: 'spot',
  pricePrecision: 2,
  qtyStep: '0.01',
  minOrder: '10',
  visible: true,
  rank: 0,
  region: [],
  tags: [],
  maxOrder: '',
  maxPosition: '',
  priceTickSize: '',
  feeTemplateId: undefined,
  marginTemplateId: undefined,
  iconId: undefined,
  oracleSource: '',
  indexSymbol: '',
  maxLeverage: undefined,
  maintenanceMarginRate: undefined,
})

// Watch for initial data changes
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = { ...newData }
    }
  },
  { immediate: true }
)

// Form schema
const formSchema = computed<FormSchema>(() => ({
  layout: 'vertical',
  labelWidth: 120,
  fields: [
    // Basic Info Section
    {
      type: 'divider',
      label: 'Basic Information',
      name: 'basic_divider',
    },
    {
      name: 'symbol',
      label: 'Symbol',
      type: 'input',
      rules: [
        { required: true, message: 'Symbol is required' },
        { pattern: /^[A-Z0-9]+$/, message: 'Symbol must be uppercase alphanumeric' },
      ],
      props: {
        placeholder: 'e.g., BTCUSDT',
        disabled: props.mode === 'edit',
      },
    },
    {
      name: 'displayName.en',
      label: 'Display Name (EN)',
      type: 'input',
      rules: [{ required: true, message: 'English display name is required' }],
      props: {
        placeholder: 'e.g., Bitcoin/USDT',
      },
    },
    {
      name: 'displayName.zh',
      label: 'Display Name (ZH)',
      type: 'input',
      props: {
        placeholder: 'e.g., 比特币/USDT',
      },
    },
    {
      name: 'base',
      label: 'Base Currency',
      type: 'input',
      rules: [
        { required: true, message: 'Base currency is required' },
        { pattern: /^[A-Z0-9]+$/, message: 'Must be uppercase alphanumeric' },
      ],
      props: {
        placeholder: 'e.g., BTC',
      },
    },
    {
      name: 'quote',
      label: 'Quote Currency',
      type: 'input',
      rules: [
        { required: true, message: 'Quote currency is required' },
        { pattern: /^[A-Z0-9]+$/, message: 'Must be uppercase alphanumeric' },
      ],
      props: {
        placeholder: 'e.g., USDT',
      },
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      rules: [{ required: true, message: 'Type is required' }],
      options: [
        { label: 'Spot', value: 'spot' },
        { label: 'Futures', value: 'futures' },
      ],
    },
    {
      name: 'iconId',
      label: 'Icon',
      type: 'icon-picker',
      props: {
        placeholder: 'Select an icon',
      },
    },

    // Trading Parameters Section
    {
      type: 'divider',
      label: 'Trading Parameters',
      name: 'trading_divider',
    },
    {
      name: 'pricePrecision',
      label: 'Price Precision',
      type: 'number',
      rules: [
        { required: true, message: 'Price precision is required' },
        { type: 'number', min: 0, max: 8, message: 'Must be between 0 and 8' },
      ],
      props: {
        min: 0,
        max: 8,
        placeholder: 'e.g., 2',
      },
    },
    {
      name: 'qtyStep',
      label: 'Quantity Step',
      type: 'input',
      rules: [
        { required: true, message: 'Quantity step is required' },
        { pattern: /^\d+(\.\d+)?$/, message: 'Must be a valid number' },
      ],
      props: {
        placeholder: 'e.g., 0.01',
      },
    },
    {
      name: 'minOrder',
      label: 'Minimum Order',
      type: 'input',
      rules: [
        { required: true, message: 'Minimum order is required' },
        { pattern: /^\d+(\.\d+)?$/, message: 'Must be a valid number' },
      ],
      props: {
        placeholder: 'e.g., 10',
      },
    },
    {
      name: 'maxOrder',
      label: 'Maximum Order',
      type: 'input',
      rules: [{ pattern: /^\d+(\.\d+)?$/, message: 'Must be a valid number' }],
      props: {
        placeholder: 'e.g., 1000000',
      },
    },
    {
      name: 'maxPosition',
      label: 'Maximum Position',
      type: 'input',
      rules: [{ pattern: /^\d+(\.\d+)?$/, message: 'Must be a valid number' }],
      props: {
        placeholder: 'e.g., 10000000',
      },
      visible: (values) => values.type === 'futures',
    },
    {
      name: 'priceTickSize',
      label: 'Price Tick Size',
      type: 'input',
      rules: [{ pattern: /^\d+(\.\d+)?$/, message: 'Must be a valid number' }],
      props: {
        placeholder: 'e.g., 0.01',
      },
    },

    // Bindings Section
    {
      type: 'divider',
      label: 'Bindings',
      name: 'bindings_divider',
    },
    {
      name: 'feeTemplateId',
      label: 'Fee Template',
      type: 'select',
      options: async () => {
        // TODO: Fetch fee templates from API
        return [
          { label: 'Default Fee Template', value: 'default' },
          { label: 'VIP Fee Template', value: 'vip' },
        ]
      },
      props: {
        placeholder: 'Select fee template',
        allowClear: true,
      },
    },
    {
      name: 'marginTemplateId',
      label: 'Margin Template',
      type: 'select',
      options: async () => {
        // TODO: Fetch margin templates from API
        return [
          { label: 'Default Margin Template', value: 'default' },
          { label: 'High Leverage Template', value: 'high_leverage' },
        ]
      },
      props: {
        placeholder: 'Select margin template',
        allowClear: true,
      },
      visible: (values) => values.type === 'futures',
    },
    {
      name: 'oracleSource',
      label: 'Oracle Source',
      type: 'input',
      props: {
        placeholder: 'e.g., binance',
      },
      visible: (values) => values.type === 'futures',
    },
    {
      name: 'indexSymbol',
      label: 'Index Symbol',
      type: 'input',
      props: {
        placeholder: 'e.g., .BTCUSDT',
      },
      visible: (values) => values.type === 'futures',
    },

    // Risk Settings Section
    {
      type: 'divider',
      label: 'Risk Settings',
      name: 'risk_divider',
    },
    {
      name: 'maxLeverage',
      label: 'Maximum Leverage',
      type: 'number',
      rules: [{ type: 'number', min: 1, max: 125, message: 'Must be between 1 and 125' }],
      props: {
        min: 1,
        max: 125,
        placeholder: 'e.g., 100',
      },
      visible: (values) => values.type === 'futures',
    },
    {
      name: 'maintenanceMarginRate',
      label: 'Maintenance Margin Rate (%)',
      type: 'number',
      rules: [{ type: 'number', min: 0, max: 100, message: 'Must be between 0 and 100' }],
      props: {
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'e.g., 0.5',
      },
      visible: (values) => values.type === 'futures',
    },

    // Display Settings Section
    {
      type: 'divider',
      label: 'Display Settings',
      name: 'display_divider',
    },
    {
      name: 'visible',
      label: 'Visible',
      type: 'switch',
      props: {
        checkedChildren: 'Yes',
        unCheckedChildren: 'No',
      },
    },
    {
      name: 'rank',
      label: 'Rank',
      type: 'number',
      rules: [
        { required: true, message: 'Rank is required' },
        { type: 'number', min: 0, message: 'Must be non-negative' },
      ],
      props: {
        min: 0,
        placeholder: 'e.g., 100',
      },
    },
    {
      name: 'region',
      label: 'Region',
      type: 'select',
      options: [
        { label: 'Global', value: 'global' },
        { label: 'US', value: 'us' },
        { label: 'EU', value: 'eu' },
        { label: 'Asia', value: 'asia' },
      ],
      props: {
        mode: 'multiple',
        placeholder: 'Select regions',
      },
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'select',
      options: [
        { label: 'Hot', value: 'hot' },
        { label: 'New', value: 'new' },
        { label: 'DeFi', value: 'defi' },
        { label: 'Meme', value: 'meme' },
        { label: 'Layer1', value: 'layer1' },
        { label: 'Layer2', value: 'layer2' },
      ],
      props: {
        mode: 'tags',
        placeholder: 'Add tags',
      },
    },
  ],
}))

// Methods
function handleSubmit() {
  emit('submit', formData.value as InstrumentCreatePayload | InstrumentUpdatePayload)
}

// Expose methods for parent component
defineExpose({
  handleSubmit,
  formData,
})
</script>

<style scoped>
.instrument-form {
  padding: 16px 0;
}
</style>
