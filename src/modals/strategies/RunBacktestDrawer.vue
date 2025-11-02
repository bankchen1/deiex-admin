<template>
  <a-drawer
    :title="$t('strategies.backtest.runBacktest')"
    :open="open"
    :width="720"
    @close="handleClose"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('strategies.backtest.strategyTemplate')" name="templateId">
            <a-select
              v-model:value="formState.templateId"
              :placeholder="$t('strategies.backtest.templatePlaceholder')"
              @change="handleTemplateChange"
            >
              <a-select-option
                v-for="template in strategyTemplates"
                :key="template.id"
                :value="template.id"
              >
                {{ template.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('strategies.backtest.symbol')" name="symbol">
            <a-select
              v-model:value="formState.symbol"
              :placeholder="$t('strategies.backtest.symbolPlaceholder')"
            >
              <a-select-option value="BTCUSDT">BTC/USDT</a-select-option>
              <a-select-option value="ETHUSDT">ETH/USDT</a-select-option>
              <a-select-option value="BNBUSDT">BNB/USDT</a-select-option>
              <a-select-option value="SOLUSDT">SOL/USDT</a-select-option>
              <a-select-option value="XRPUSDT">XRP/USDT</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('strategies.backtest.initialCapital')" name="initialCapital">
            <a-input-group compact>
              <a-input-number
                v-model:value="formState.initialCapital"
                :min="0"
                :step="100"
                :precision="2"
                style="width: calc(100% - 80px)"
              />
              <a-select v-model:value="formState.currency" style="width: 80px">
                <a-select-option value="USDT">USDT</a-select-option>
                <a-select-option value="BTC">BTC</a-select-option>
                <a-select-option value="ETH">ETH</a-select-option>
              </a-select>
            </a-input-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('strategies.backtest.dateRange')" name="dateRange">
            <a-range-picker
              v-model:value="formState.dateRange"
              :placeholder="[
                $t('strategies.backtest.startDate'),
                $t('strategies.backtest.endDate'),
              ]"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-card :title="$t('strategies.backtest.parameters')" size="small" class="parameters-card">
        <a-alert
          v-if="selectedTemplate"
          :message="$t('strategies.backtest.templateParametersHint')"
          type="info"
          show-icon
          style="margin-bottom: 16px"
        />
        <div v-for="(param, key) in templateParameters" :key="key" class="parameter-item">
          <a-row :gutter="16">
            <a-col :span="8">
              <span class="parameter-key">{{ key }}</span>
            </a-col>
            <a-col :span="16">
              <a-input v-model:value="formState.parameters[key]" :placeholder="param.toString()" />
            </a-col>
          </a-row>
        </div>
        <div v-if="Object.keys(templateParameters).length === 0" class="no-parameters">
          {{ $t('strategies.backtest.noParameters') }}
        </div>
      </a-card>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="handleClose">
          {{ $t('common.cancel') }}
        </a-button>
        <a-button type="primary" :loading="submitLoading" @click="handleSubmit">
          {{ $t('strategies.backtest.run') }}
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance } from 'ant-design-vue'
import type { StrategyTemplate } from '@/types/models'
import dayjs from 'dayjs'

const { t } = useI18n()

// Mock data for demonstration
const mockTemplates: StrategyTemplate[] = [
  {
    id: '1',
    name: 'Moving Average Crossover',
    description: 'A classic trend-following strategy based on moving average crossovers',
    category: 'trend',
    parameters: {
      fastPeriod: 10,
      slowPeriod: 30,
      takeProfit: 2.0,
      stopLoss: 1.0,
    },
    code: '// Strategy code here...',
    riskLevel: 'medium',
    maxDrawdown: '15.5',
    expectedReturn: '25.0',
    status: 'active',
    version: '1.0',
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'RSI Mean Reversion',
    description: 'A mean-reversion strategy based on RSI indicator',
    category: 'mean-reversion',
    parameters: {
      rsiPeriod: 14,
      overbought: 70,
      oversold: 30,
      takeProfit: 1.5,
      stopLoss: 0.8,
    },
    code: '// Strategy code here...',
    riskLevel: 'low',
    maxDrawdown: '8.2',
    expectedReturn: '18.5',
    status: 'active',
    version: '1.2',
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2023-02-20T14:30:00Z',
    updatedAt: '2023-02-20T14:30:00Z',
  },
]

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', open: boolean): void
  (e: 'submit', payload: any): void
  (e: 'close'): void
}>()

const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const strategyTemplates = ref<StrategyTemplate[]>(mockTemplates)
const selectedTemplate = ref<StrategyTemplate | null>(null)

const formState = ref({
  templateId: undefined as string | undefined,
  symbol: undefined as string | undefined,
  initialCapital: undefined as number | undefined,
  currency: 'USDT',
  dateRange: undefined as [dayjs.Dayjs, dayjs.Dayjs] | undefined,
  parameters: {} as Record<string, any>,
})

const rules = {
  templateId: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.backtest.strategyTemplate') }),
    },
  ],
  symbol: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.backtest.symbol') }),
    },
  ],
  initialCapital: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.backtest.initialCapital') }),
    },
  ],
  dateRange: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.backtest.dateRange') }),
    },
  ],
}

const templateParameters = computed(() => {
  if (selectedTemplate.value) {
    return selectedTemplate.value.parameters
  }
  return {}
})

function handleTemplateChange(templateId: string) {
  const template = strategyTemplates.value.find((t) => t.id === templateId)
  if (template) {
    selectedTemplate.value = template
    formState.value.parameters = { ...template.parameters }
  } else {
    selectedTemplate.value = null
    formState.value.parameters = {}
  }
}

function handleClose() {
  emit('update:open', false)
  emit('close')
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()

    // Check if date range is valid
    if (!formState.value.dateRange || formState.value.dateRange.length !== 2) {
      throw new Error(t('validation.required', { field: t('strategies.backtest.dateRange') }))
    }

    const payload = {
      templateId: formState.value.templateId,
      symbol: formState.value.symbol,
      initialCapital: formState.value.initialCapital?.toString() || '0',
      currency: formState.value.currency,
      startTime: formState.value.dateRange[0].toISOString(),
      endTime: formState.value.dateRange[1].toISOString(),
      parameters: formState.value.parameters,
    }

    emit('submit', payload)
  } catch (error) {
    console.error('Validation failed:', error)
  }
}
</script>

<style scoped>
.parameters-card {
  margin-top: 16px;
}

.parameter-item {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.parameter-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.parameter-key {
  font-weight: 500;
  color: #555;
}

.no-parameters {
  text-align: center;
  color: #999;
  padding: 24px 0;
}
</style>
