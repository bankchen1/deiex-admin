<template>
  <a-card title="Rule Simulator" :bordered="false">
    <a-form layout="vertical">
      <a-form-item label="Test Data (JSON)">
        <JsonEditor
          v-model:value="testData"
          placeholder="Enter test data to simulate rule matching"
          :height="200"
        />
      </a-form-item>

      <a-form-item>
        <a-space>
          <a-button type="primary" :loading="loading" @click="handleSimulate">
            <template #icon><PlayCircleOutlined /></template>
            Run Simulation
          </a-button>
          <a-button @click="handleReset">
            <template #icon><ReloadOutlined /></template>
            Reset
          </a-button>
          <a-button @click="loadSampleData">
            <template #icon><FileTextOutlined /></template>
            Load Sample
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>

    <a-divider v-if="result">Simulation Result</a-divider>

    <div v-if="result" class="result-container">
      <a-alert
        :type="result.matched ? 'warning' : 'success'"
        :message="result.matched ? 'Rule Matched' : 'Rule Not Matched'"
        show-icon
        style="margin-bottom: 16px"
      >
        <template #description>
          <div v-if="result.matched">
            <p>This rule would be triggered by the test data.</p>
            <p v-if="result.matchedRules && result.matchedRules.length > 0">
              <strong>Matched Rules:</strong>
            </p>
            <ul v-if="result.matchedRules">
              <li v-for="rule in result.matchedRules" :key="rule.ruleId">
                {{ rule.ruleName }}
              </li>
            </ul>
          </div>
          <div v-else>
            <p>This rule would not be triggered by the test data.</p>
          </div>
        </template>
      </a-alert>

      <a-card
        v-if="result.actions && result.actions.length > 0"
        title="Actions to Execute"
        size="small"
      >
        <a-list :data-source="result.actions" size="small">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #title>
                  <a-tag :color="getActionColor(item.type)">{{ item.type }}</a-tag>
                </template>
                <template #description>
                  <pre style="margin: 0">{{ JSON.stringify(item.params, null, 2) }}</pre>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-card>

      <a-card title="Simulation Details" size="small" style="margin-top: 16px">
        <a-descriptions :column="1" size="small">
          <a-descriptions-item label="Timestamp">
            {{ result.timestamp }}
          </a-descriptions-item>
          <a-descriptions-item label="Matched">
            <a-tag :color="result.matched ? 'orange' : 'green'">
              {{ result.matched ? 'Yes' : 'No' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Actions Count">
            {{ result.actions?.length || 0 }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlayCircleOutlined, ReloadOutlined, FileTextOutlined } from '@ant-design/icons-vue'
import JsonEditor from '@/shared/JsonEditor.vue'
import type { RiskSimulationResult } from '@/contracts/risk'

interface Props {
  ruleId?: string
  loading?: boolean
}

interface Emits {
  (e: 'simulate', data: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const testData = ref<any>({})
const result = ref<RiskSimulationResult | null>(null)

const sampleData = {
  userId: 'user_12345',
  country: 'US',
  ip: '192.168.1.1',
  deviceId: 'device_abc123',
  amount: '10000',
  currency: 'USDT',
  chain: 'ETH',
  txCount: 5,
  riskScore: 75,
  vipLevel: 2,
  accountAge: 30,
  kycStatus: 'approved',
}

function handleSimulate() {
  emit('simulate', testData.value)
}

function handleReset() {
  testData.value = {}
  result.value = null
}

function loadSampleData() {
  testData.value = { ...sampleData }
}

function setResult(simulationResult: RiskSimulationResult) {
  result.value = simulationResult
}

function getActionColor(type: string): string {
  const colors: Record<string, string> = {
    block: 'red',
    review: 'orange',
    alert: 'yellow',
    tag: 'blue',
  }
  return colors[type] || 'default'
}

defineExpose({
  setResult,
})
</script>

<style scoped>
.result-container {
  margin-top: 16px;
}

pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
