<template>
  <a-form :model="formData" :rules="rules" layout="vertical" @finish="handleSubmit">
    <a-form-item label="Copy Ratio" name="copyRatio">
      <a-slider
        v-model:value="formData.copyRatio"
        :min="0"
        :max="100"
        :marks="{ 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }"
      />
      <a-input-number
        v-model:value="formData.copyRatio"
        :min="0"
        :max="100"
        :precision="1"
        style="width: 100%; margin-top: 8px"
        addon-after="%"
      />
    </a-form-item>

    <a-form-item label="Max Position Size (USDT)" name="maxPositionSize">
      <a-input-number
        v-model:value="formData.maxPositionSize"
        :min="0"
        :precision="2"
        style="width: 100%"
        placeholder="Enter maximum position size"
      />
    </a-form-item>

    <a-form-item label="Stop Loss (%)" name="stopLossPercent">
      <a-input-number
        v-model:value="formData.stopLossPercent"
        :min="0"
        :max="100"
        :precision="1"
        style="width: 100%"
        placeholder="Optional stop loss percentage"
      />
      <div class="form-hint">Automatically close position when loss reaches this percentage</div>
    </a-form-item>

    <a-form-item label="Take Profit (%)" name="takeProfitPercent">
      <a-input-number
        v-model:value="formData.takeProfitPercent"
        :min="0"
        :max="1000"
        :precision="1"
        style="width: 100%"
        placeholder="Optional take profit percentage"
      />
      <div class="form-hint">Automatically close position when profit reaches this percentage</div>
    </a-form-item>

    <a-form-item label="Profit Share (%)" name="profitSharePercent">
      <a-slider
        v-model:value="formData.profitSharePercent"
        :min="0"
        :max="50"
        :marks="{ 0: '0%', 10: '10%', 20: '20%', 30: '30%', 50: '50%' }"
      />
      <a-input-number
        v-model:value="formData.profitSharePercent"
        :min="0"
        :max="50"
        :precision="1"
        style="width: 100%; margin-top: 8px"
        addon-after="%"
      />
      <div class="form-hint">Percentage of profit shared with the leader trader</div>
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ submitText }}
        </a-button>
        <a-button @click="handleCancel">Cancel</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { CopyTradingRelation } from '@/services/api/facade'

interface Props {
  initialData?: Partial<CopyTradingRelation>
  loading?: boolean
  submitText?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  submitText: 'Save',
})

const emit = defineEmits<{
  (e: 'submit', data: FormData): void
  (e: 'cancel'): void
}>()

interface FormData {
  copyRatio: number
  maxPositionSize: number
  stopLossPercent?: number
  takeProfitPercent?: number
  profitSharePercent: number
}

const formData = reactive<FormData>({
  copyRatio: 100,
  maxPositionSize: 1000,
  stopLossPercent: undefined,
  takeProfitPercent: undefined,
  profitSharePercent: 10,
})

const rules = {
  copyRatio: [
    { required: true, message: 'Please enter copy ratio' },
    { type: 'number', min: 0, max: 100, message: 'Copy ratio must be between 0 and 100' },
  ],
  maxPositionSize: [
    { required: true, message: 'Please enter max position size' },
    { type: 'number', min: 0, message: 'Max position size must be positive' },
  ],
  profitSharePercent: [
    { required: true, message: 'Please enter profit share percentage' },
    { type: 'number', min: 0, max: 50, message: 'Profit share must be between 0 and 50' },
  ],
}

// Initialize form with initial data
watch(
  () => props.initialData,
  (data) => {
    if (data) {
      formData.copyRatio = data.copyRatio ? data.copyRatio * 100 : 100
      formData.maxPositionSize = data.maxPositionSize ? parseFloat(data.maxPositionSize) : 1000
      formData.stopLossPercent = data.stopLossPercent
      formData.takeProfitPercent = data.takeProfitPercent
      formData.profitSharePercent = data.profitSharePercent || 10
    }
  },
  { immediate: true }
)

function handleSubmit() {
  emit('submit', {
    ...formData,
    copyRatio: formData.copyRatio / 100, // Convert back to decimal
  })
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped>
.form-hint {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}
</style>
