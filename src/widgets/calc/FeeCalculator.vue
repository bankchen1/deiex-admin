<template>
  <a-card title="Fee Calculator" :bordered="false">
    <a-form layout="vertical">
      <a-form-item label="Fee Type">
        <a-radio-group v-model:value="feeType" button-style="solid">
          <a-radio-button value="trading">Trading Fee</a-radio-button>
          <a-radio-button value="withdrawal">Withdrawal Fee</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <!-- Trading Fee Inputs -->
      <template v-if="feeType === 'trading'">
        <a-form-item label="VIP Level">
          <a-select v-model:value="vipLevel" placeholder="Select VIP level">
            <a-select-option v-for="level in vipLevels" :key="level" :value="level">
              VIP {{ level }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Trading Volume (USD)">
          <a-input-number
            v-model:value="tradingVolume"
            :min="0"
            :step="1000"
            :precision="2"
            style="width: 100%"
            placeholder="Enter trading volume"
          />
        </a-form-item>

        <a-form-item label="Symbol (Optional)">
          <a-input v-model:value="symbol" placeholder="e.g., BTC/USDT" allow-clear />
        </a-form-item>
      </template>

      <!-- Withdrawal Fee Inputs -->
      <template v-else>
        <a-form-item label="Currency">
          <a-select
            v-model:value="currency"
            placeholder="Select currency"
            show-search
            :filter-option="filterOption"
          >
            <a-select-option v-for="curr in currencies" :key="curr" :value="curr">
              {{ curr }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Chain">
          <a-select v-model:value="chain" placeholder="Select chain">
            <a-select-option v-for="ch in chains" :key="ch" :value="ch">
              {{ ch }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Withdrawal Amount">
          <a-input-number
            v-model:value="withdrawalAmount"
            :min="0"
            :step="0.01"
            :precision="8"
            style="width: 100%"
            placeholder="Enter withdrawal amount"
          />
        </a-form-item>
      </template>

      <a-form-item>
        <a-button
          type="primary"
          block
          :loading="loading"
          :disabled="!canCalculate"
          @click="handleCalculate"
        >
          Calculate Fee
        </a-button>
      </a-form-item>
    </a-form>

    <!-- Results -->
    <a-divider v-if="result" />

    <div v-if="result" class="result-section">
      <a-alert
        type="info"
        message="Calculation Result"
        :description="resultDescription"
        show-icon
        style="margin-bottom: 16px"
      />

      <!-- Trading Fee Results -->
      <template v-if="result.type === 'trading'">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="VIP Level"> VIP {{ result.vipLevel }} </a-descriptions-item>
          <a-descriptions-item label="Maker Fee Rate">
            {{ formatPercentage(result.effectiveRate || 0) }}
          </a-descriptions-item>
          <a-descriptions-item label="Maker Fee"> {{ result.makerFee }} USD </a-descriptions-item>
          <a-descriptions-item label="Taker Fee"> {{ result.takerFee }} USD </a-descriptions-item>
        </a-descriptions>
      </template>

      <!-- Withdrawal Fee Results -->
      <template v-else>
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="Currency">
            {{ currency }}
          </a-descriptions-item>
          <a-descriptions-item label="Chain">
            {{ chain }}
          </a-descriptions-item>
          <a-descriptions-item v-if="result.breakdown?.fixedFee" label="Fixed Fee">
            {{ result.breakdown.fixedFee }} {{ currency }}
          </a-descriptions-item>
          <a-descriptions-item v-if="result.breakdown?.percentageFee" label="Percentage Fee">
            {{ result.breakdown.percentageFee }} {{ currency }}
          </a-descriptions-item>
          <a-descriptions-item label="Total Fee">
            <a-typography-text strong>
              {{ result.withdrawalFee }} {{ currency }}
            </a-typography-text>
          </a-descriptions-item>
          <a-descriptions-item label="Effective Rate">
            {{ formatPercentage(result.effectiveRate || 0) }}
          </a-descriptions-item>
        </a-descriptions>
      </template>

      <a-alert
        v-if="feeType === 'trading'"
        type="warning"
        message="Note"
        description="Actual fees may vary based on market conditions and order type (maker/taker)."
        show-icon
        style="margin-top: 16px"
      />
    </div>

    <a-empty v-else-if="!loading" description="Enter parameters and click Calculate" />
  </a-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFeesStore } from '@/stores/fees'
import type { FeeCalculationResult } from '@/contracts/fees'

const feesStore = useFeesStore()

const feeType = ref<'trading' | 'withdrawal'>('trading')
const loading = ref(false)
const result = ref<FeeCalculationResult | null>(null)

// Trading fee inputs
const vipLevel = ref<number>(0)
const tradingVolume = ref<number | null>(null)
const symbol = ref<string>('')

// Withdrawal fee inputs
const currency = ref<string>('')
const chain = ref<string>('')
const withdrawalAmount = ref<number | null>(null)

// Options
const vipLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const currencies = ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'SOL', 'ADA', 'DOT', 'MATIC', 'AVAX']
const chains = ['ERC20', 'TRC20', 'BEP20', 'Polygon', 'Avalanche', 'Solana', 'Bitcoin', 'Ethereum']

const canCalculate = computed(() => {
  if (feeType.value === 'trading') {
    return vipLevel.value !== null && tradingVolume.value !== null && tradingVolume.value > 0
  } else {
    return (
      currency.value && chain.value && withdrawalAmount.value !== null && withdrawalAmount.value > 0
    )
  }
})

const resultDescription = computed(() => {
  if (!result.value) return ''

  if (result.value.type === 'trading') {
    return `Estimated fees for VIP ${result.value.vipLevel} with trading volume of ${formatNumber(tradingVolume.value || 0)} USD`
  } else {
    return `Estimated fee for withdrawing ${withdrawalAmount.value} ${currency.value} on ${chain.value}`
  }
})

async function handleCalculate() {
  loading.value = true
  result.value = null

  try {
    const params =
      feeType.value === 'trading'
        ? {
            type: 'trading' as const,
            vipLevel: vipLevel.value,
            tradingVolume: tradingVolume.value?.toString() || '0',
            symbol: symbol.value || undefined,
          }
        : {
            type: 'withdrawal' as const,
            currency: currency.value,
            chain: chain.value,
            amount: withdrawalAmount.value?.toString() || '0',
          }

    const response = await feesStore.calculateFee(params)
    result.value = response.data
  } catch (error) {
    console.error('Failed to calculate fee:', error)
  } finally {
    loading.value = false
  }
}

function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(4)}%`
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function filterOption(input: string, option: any) {
  return option.value.toLowerCase().includes(input.toLowerCase())
}
</script>

<style scoped>
.result-section {
  margin-top: 16px;
}
</style>
