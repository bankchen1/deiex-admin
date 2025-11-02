<template>
  <a-card title="Margin Calculator" :bordered="false">
    <a-form :model="form" layout="vertical" @finish="handleCalculate">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item
            label="Margin Template"
            name="templateId"
            :rules="[{ required: true, message: 'Please select a template' }]"
          >
            <a-select
              v-model:value="form.templateId"
              placeholder="Select margin template"
              :loading="marginStore.loading"
              show-search
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="template in marginStore.publishedTemplates"
                :key="template.id"
                :value="template.id"
              >
                {{ template.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item
            label="Notional Value (USD)"
            name="notionalValue"
            :rules="[{ required: true, message: 'Please enter notional value' }]"
          >
            <a-input-number
              v-model:value="form.notionalValue"
              :min="0"
              :precision="2"
              :step="1000"
              style="width: 100%"
              placeholder="Enter notional value"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item
            label="Leverage"
            name="leverage"
            :rules="[{ required: true, message: 'Please enter leverage' }]"
          >
            <a-input-number
              v-model:value="form.leverage"
              :min="1"
              :max="maxLeverage"
              :precision="0"
              style="width: 100%"
              placeholder="Enter leverage"
            />
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="calculating" block>
              Calculate
            </a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <a-divider />

    <div v-if="result" class="result-section">
      <a-descriptions title="Calculation Results" :column="1" bordered>
        <a-descriptions-item label="Initial Margin">
          <span class="result-value">{{ formatCurrency(result.initialMargin) }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="Maintenance Margin">
          <span class="result-value">{{ formatCurrency(result.maintenanceMargin) }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="Liquidation Price">
          <span class="result-value warning">{{ formatCurrency(result.liquidationPrice) }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="Max Leverage">
          <a-tag color="blue">{{ result.maxLeverage }}x</a-tag>
        </a-descriptions-item>
      </a-descriptions>

      <a-alert
        v-if="result.tier"
        type="info"
        :message="`Applied Tier: ${formatCurrency(result.tier.notionalFrom)} - ${formatCurrency(result.tier.notionalTo)}`"
        style="margin-top: 16px"
      >
        <template #description>
          <div>Initial Margin Rate: {{ (result.tier.initialMarginRate * 100).toFixed(2) }}%</div>
          <div>
            Maintenance Margin Rate: {{ (result.tier.maintenanceMarginRate * 100).toFixed(2) }}%
          </div>
        </template>
      </a-alert>
    </div>

    <a-empty v-else description="Enter values and click Calculate to see results" />
  </a-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMarginStore } from '@/stores/margin'
import { formatCurrency } from '@/utils/format'

interface CalculatorForm {
  templateId: string
  notionalValue: number
  leverage: number
}

interface CalculationResult {
  initialMargin: string
  maintenanceMargin: string
  liquidationPrice: string
  maxLeverage: number
  tier: {
    notionalFrom: string
    notionalTo: string
    initialMarginRate: number
    maintenanceMarginRate: number
  }
}

const marginStore = useMarginStore()

const form = ref<CalculatorForm>({
  templateId: '',
  notionalValue: 10000,
  leverage: 10,
})

const calculating = ref(false)
const result = ref<CalculationResult | null>(null)

const maxLeverage = computed(() => {
  if (!result.value) return 125
  return result.value.maxLeverage
})

onMounted(async () => {
  if (marginStore.publishedTemplates.length === 0) {
    await marginStore.fetchPublishedTemplates()
  }
})

function filterOption(input: string, option: { children: Array<{ children: string }> }) {
  return option.children[0].children.toLowerCase().includes(input.toLowerCase())
}

async function handleCalculate() {
  if (!form.value.templateId || !form.value.notionalValue || !form.value.leverage) {
    return
  }

  calculating.value = true
  try {
    const response = await marginStore.calculateMargin({
      templateId: form.value.templateId,
      notionalValue: form.value.notionalValue.toString(),
      leverage: form.value.leverage,
    })
    result.value = response.data
  } catch {
    // Error already handled by store
  } finally {
    calculating.value = false
  }
}
</script>

<style scoped>
.result-section {
  margin-top: 16px;
}

.result-value {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
}

.result-value.warning {
  color: #ff4d4f;
}
</style>
