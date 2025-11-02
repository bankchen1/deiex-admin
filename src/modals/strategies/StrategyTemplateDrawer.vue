<template>
  <a-drawer :title="drawerTitle" :open="open" :width="720" @close="handleClose">
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('strategies.templates.name')" name="name">
            <a-input
              v-model:value="formState.name"
              :placeholder="$t('strategies.templates.namePlaceholder')"
              :disabled="mode === 'view'"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('strategies.templates.category')" name="category">
            <a-select
              v-model:value="formState.category"
              :placeholder="$t('strategies.templates.categoryPlaceholder')"
              :disabled="mode === 'view'"
            >
              <a-select-option value="trend">
                {{ $t('strategies.templates.categories.trend') }}
              </a-select-option>
              <a-select-option value="mean-reversion">
                {{ $t('strategies.templates.categories.meanReversion') }}
              </a-select-option>
              <a-select-option value="arbitrage">
                {{ $t('strategies.templates.categories.arbitrage') }}
              </a-select-option>
              <a-select-option value="market-making">
                {{ $t('strategies.templates.categories.marketMaking') }}
              </a-select-option>
              <a-select-option value="other">
                {{ $t('strategies.templates.categories.other') }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item :label="$t('strategies.templates.description')" name="description">
        <a-textarea
          v-model:value="formState.description"
          :placeholder="$t('strategies.templates.descriptionPlaceholder')"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          :disabled="mode === 'view'"
        />
      </a-form-item>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="$t('strategies.templates.riskLevel')" name="riskLevel">
            <a-select
              v-model:value="formState.riskLevel"
              :placeholder="$t('strategies.templates.riskLevelPlaceholder')"
              :disabled="mode === 'view'"
            >
              <a-select-option value="low">
                {{ $t('strategies.templates.riskLevels.low') }}
              </a-select-option>
              <a-select-option value="medium">
                {{ $t('strategies.templates.riskLevels.medium') }}
              </a-select-option>
              <a-select-option value="high">
                {{ $t('strategies.templates.riskLevels.high') }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('strategies.templates.status')" name="status">
            <a-select v-model:value="formState.status" :disabled="mode === 'view'">
              <a-select-option value="active">
                {{ $t('common.active') }}
              </a-select-option>
              <a-select-option value="inactive">
                {{ $t('common.inactive') }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            :label="$t('strategies.templates.expectedReturn') + ' (%)'"
            name="expectedReturn"
          >
            <a-input-number
              v-model:value="formState.expectedReturn"
              :min="0"
              :step="0.1"
              :precision="2"
              :disabled="mode === 'view'"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="$t('strategies.templates.maxDrawdown') + ' (%)'" name="maxDrawdown">
            <a-input-number
              v-model:value="formState.maxDrawdown"
              :min="0"
              :step="0.1"
              :precision="2"
              :disabled="mode === 'view'"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item :label="$t('strategies.templates.code')" name="code">
        <a-textarea
          v-model:value="formState.code"
          :placeholder="$t('strategies.templates.codePlaceholder')"
          :auto-size="{ minRows: 6, maxRows: 12 }"
          :disabled="mode === 'view'"
        />
      </a-form-item>

      <a-form-item :label="$t('strategies.templates.parameters')" name="parameters">
        <a-textarea
          v-model:value="formState.parameters"
          :placeholder="$t('strategies.templates.parametersPlaceholder')"
          :auto-size="{ minRows: 4, maxRows: 8 }"
          :disabled="mode === 'view'"
        />
        <div class="parameter-hint">
          {{ $t('strategies.templates.parametersHint') }}
        </div>
      </a-form-item>
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
import type { StrategyTemplate } from '@/types/models'

const { t } = useI18n()

const props = defineProps<{
  open: boolean
  template: StrategyTemplate | null
  mode: 'create' | 'edit' | 'view'
}>()

const emit = defineEmits<{
  (e: 'update:open', open: boolean): void
  (e: 'submit', payload: any): void
  (e: 'close'): void
}>()

const formRef = ref<FormInstance>()
const submitLoading = ref(false)

const formState = ref({
  name: '',
  description: '',
  category: undefined as string | undefined,
  riskLevel: undefined as string | undefined,
  expectedReturn: undefined as number | undefined,
  maxDrawdown: undefined as number | undefined,
  status: 'active',
  code: '',
  parameters: '',
})

const rules = {
  name: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.templates.name') }),
    },
    {
      min: 2,
      message: t('validation.minLength', { field: t('strategies.templates.name'), min: 2 }),
    },
  ],
  category: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.templates.category') }),
    },
  ],
  riskLevel: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.templates.riskLevel') }),
    },
  ],
  status: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.templates.status') }),
    },
  ],
  expectedReturn: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.templates.expectedReturn') }),
    },
  ],
  maxDrawdown: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.templates.maxDrawdown') }),
    },
  ],
  code: [
    {
      required: true,
      message: t('validation.required', { field: t('strategies.templates.code') }),
    },
  ],
}

const drawerTitle = computed(() => {
  switch (props.mode) {
    case 'create':
      return t('strategies.templates.createTemplate')
    case 'edit':
      return t('strategies.templates.editTemplate')
    case 'view':
      return t('strategies.templates.viewTemplate')
    default:
      return t('strategies.templates.template')
  }
})

// Watch for template changes to populate form
watch(
  () => props.template,
  (newTemplate) => {
    if (newTemplate) {
      formState.value = {
        name: newTemplate.name,
        description: newTemplate.description,
        category: newTemplate.category,
        riskLevel: newTemplate.riskLevel,
        expectedReturn: parseFloat(newTemplate.expectedReturn),
        maxDrawdown: parseFloat(newTemplate.maxDrawdown),
        status: newTemplate.status,
        code: newTemplate.code,
        parameters: JSON.stringify(newTemplate.parameters, null, 2),
      }
    } else {
      // Reset form for create mode
      formState.value = {
        name: '',
        description: '',
        category: undefined,
        riskLevel: undefined,
        expectedReturn: undefined,
        maxDrawdown: undefined,
        status: 'active',
        code: '',
        parameters: '',
      }
    }
  },
  { immediate: true }
)

function handleClose() {
  emit('update:open', false)
  emit('close')
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()

    // Parse parameters
    let parsedParameters = {}
    try {
      parsedParameters = JSON.parse(formState.value.parameters)
    } catch (e) {
      throw new Error(t('strategies.templates.parametersInvalid'))
    }

    const payload = {
      name: formState.value.name,
      description: formState.value.description,
      category: formState.value.category,
      riskLevel: formState.value.riskLevel,
      expectedReturn: formState.value.expectedReturn?.toString() || '0',
      maxDrawdown: formState.value.maxDrawdown?.toString() || '0',
      status: formState.value.status,
      code: formState.value.code,
      parameters: parsedParameters,
    }

    emit('submit', payload)
  } catch (error) {
    console.error('Validation failed:', error)
  }
}
</script>

<style scoped>
.parameter-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}
</style>
