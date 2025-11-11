<template>
  <a-drawer :title="drawerTitle" :open="open" :width="720" @close="handleClose">
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('strategies.instances.name')" name="name">
            <a-input
              v-model:value="formState.name"
              :placeholder="$t('strategies.instances.namePlaceholder')"
              :disabled="mode === 'view'"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('strategies.instances.template')" name="templateId">
            <a-select
              v-model:value="formState.templateId"
              :placeholder="$t('strategies.instances.templatePlaceholder')"
              :disabled="mode === 'view'"
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
      </a-row>

      <a-form-item :label="$t('strategies.instances.description')" name="description">
        <a-textarea
          v-model:value="formState.description"
          :placeholder="$t('strategies.instances.descriptionPlaceholder')"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          :disabled="mode === 'view'"
        />
      </a-form-item>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('strategies.instances.symbol')" name="symbol">
            <a-select
              v-model:value="formState.symbol"
              :placeholder="$t('strategies.instances.symbolPlaceholder')"
              :disabled="mode === 'view'"
            >
              <a-select-option value="BTCUSDT">BTC/USDT</a-select-option>
              <a-select-option value="ETHUSDT">ETH/USDT</a-select-option>
              <a-select-option value="BNBUSDT">BNB/USDT</a-select-option>
              <a-select-option value="SOLUSDT">SOL/USDT</a-select-option>
              <a-select-option value="XRPUSDT">XRP/USDT</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('strategies.instances.riskLevel')" name="riskLevel">
            <a-select
              v-model:value="formState.riskLevel"
              :placeholder="$t('strategies.instances.riskLevelPlaceholder')"
              :disabled="mode === 'view' || selectedTemplate"
            >
              <a-select-option value="low">
                {{ $t('strategies.instances.riskLevels.low') }}
              </a-select-option>
              <a-select-option value="medium">
                {{ $t('strategies.instances.riskLevels.medium') }}
              </a-select-option>
              <a-select-option value="high">
                {{ $t('strategies.instances.riskLevels.high') }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('strategies.instances.allocatedCapital')" name="allocatedCapital">
            <a-input-group compact>
              <a-input-number
                v-model:value="formState.allocatedCapital"
                :min="0"
                :step="100"
                :precision="2"
                :disabled="mode === 'view'"
                style="width: calc(100% - 80px)"
              />
              <a-select
                v-model:value="formState.allocatedCurrency"
                :disabled="mode === 'view'"
                style="width: 80px"
              >
                <a-select-option value="USDT">USDT</a-select-option>
                <a-select-option value="BTC">BTC</a-select-option>
                <a-select-option value="ETH">ETH</a-select-option>
              </a-select>
            </a-input-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            v-if="mode !== 'create'"
            :label="$t('strategies.instances.status')"
            name="status"
          >
            <a-select v-model:value="formState.status" :disabled="mode === 'view'">
              <a-select-option value="running">
                {{ $t('strategies.instances.statuses.running') }}
              </a-select-option>
              <a-select-option value="paused">
                {{ $t('strategies.instances.statuses.paused') }}
              </a-select-option>
              <a-select-option value="stopped">
                {{ $t('strategies.instances.statuses.stopped') }}
              </a-select-option>
              <a-select-option value="error">
                {{ $t('strategies.instances.statuses.error') }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-card :title="$t('strategies.instances.parameters')" size="small" class="parameters-card">
        <a-alert
          v-if="selectedTemplate"
          :message="$t('strategies.instances.templateParametersHint')"
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
              <a-input
                v-model:value="formState.parameters[key]"
                :placeholder="param.toString()"
                :disabled="mode === 'view'"
              />
            </a-col>
          </a-row>
        </div>
        <div v-if="Object.keys(templateParameters).length === 0" class="no-parameters">
          {{ $t('strategies.instances.noParameters') }}
        </div>
      </a-card>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="handleClose">
          {{ $t('common.cancel') }}
        </a-button>
        <a-button
          v-if="mode !== 'view'"
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          {{ $t('common.save') }}
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance } from 'ant-design-vue'
import type { StrategyInstance, StrategyTemplate } from '@/contracts/strategies'

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
  instance: StrategyInstance | null
  mode: 'create' | 'edit' | 'view'
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
  name: '',
  description: '',
  templateId: undefined as string | undefined,
  symbol: undefined as string | undefined,
  riskLevel: undefined as string | undefined,
  allocatedCapital: undefined as number | undefined,
  allocatedCurrency: 'USDT',
  status: 'running' as 'running' | 'paused' | 'stopped' | 'error',
  parameters: {} as Record<string, any>,
})

const rules = {
  name: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.instances.name') }),
    },
    {
      min: 2,
      message: t('validation.minLength', { field: t('strategies.instances.name'), min: 2 }),
    },
  ],
  templateId: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.instances.template') }),
    },
  ],
  symbol: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.instances.symbol') }),
    },
  ],
  riskLevel: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.instances.riskLevel') }),
    },
  ],
  allocatedCapital: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.instances.allocatedCapital') }),
    },
  ],
}

const drawerTitle = computed(() => {
  switch (props.mode) {
    case 'create':
      return t('strategies.instances.createInstance')
    case 'edit':
      return t('strategies.instances.editInstance')
    case 'view':
      return t('strategies.instances.viewInstance')
    default:
      return t('strategies.instances.instance')
  }
})

const templateParameters = computed(() => {
  if (selectedTemplate.value) {
    return selectedTemplate.value.parameters
  }
  return {}
})

// Watch for instance changes to populate form
watch(
  () => props.instance,
  (newInstance) => {
    if (newInstance) {
      formState.value = {
        name: newInstance.name,
        description: newInstance.description,
        templateId: newInstance.templateId,
        symbol: newInstance.symbol,
        riskLevel: newInstance.riskLevel,
        allocatedCapital: parseFloat(newInstance.allocatedCapital),
        allocatedCurrency: newInstance.allocatedCurrency,
        status: newInstance.status,
        parameters: { ...newInstance.parameters },
      }

      // Set selected template
      const template = strategyTemplates.value.find((t) => t.id === newInstance.templateId)
      if (template) {
        selectedTemplate.value = template
      }
    } else {
      // Reset form for create mode
      formState.value = {
        name: '',
        description: '',
        templateId: undefined,
        symbol: undefined,
        riskLevel: undefined,
        allocatedCapital: undefined,
        allocatedCurrency: 'USDT',
        status: 'running',
        parameters: {},
      }
      selectedTemplate.value = null
    }
  },
  { immediate: true }
)

function handleTemplateChange(templateId: string) {
  const template = strategyTemplates.value.find((t) => t.id === templateId)
  if (template) {
    selectedTemplate.value = template
    formState.value.riskLevel = template.riskLevel
    formState.value.parameters = { ...template.parameters }
  } else {
    selectedTemplate.value = null
    formState.value.riskLevel = undefined
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

    const payload = {
      name: formState.value.name,
      description: formState.value.description,
      templateId: formState.value.templateId,
      templateName: selectedTemplate.value?.name || '',
      symbol: formState.value.symbol,
      riskLevel: formState.value.riskLevel,
      allocatedCapital: formState.value.allocatedCapital?.toString() || '0',
      allocatedCurrency: formState.value.allocatedCurrency,
      status: formState.value.status,
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
