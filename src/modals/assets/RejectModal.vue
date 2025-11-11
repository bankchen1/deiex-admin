<template>
  <a-modal
    :visible="visible"
    :title="isBatchMode ? 'Batch Reject Withdrawals' : 'Reject Withdrawal'"
    :confirm-loading="loading"
    :width="720"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div v-if="withdrawal || (withdrawals && withdrawals.length > 0)" class="space-y-4">
      <!-- Batch Mode Alert -->
      <a-alert
        v-if="isBatchMode"
        :message="`Batch Rejection: ${withdrawals?.length || 0} withdrawals selected`"
        description="Please provide a reason for rejecting these withdrawals. All selected withdrawals will be rejected with the same reason."
        type="warning"
        show-icon
        class="mb-4"
      />

      <!-- Single Mode Alert -->
      <a-alert
        v-else
        message="Rejection Confirmation"
        description="Please provide a reason for rejecting this withdrawal."
        type="warning"
        show-icon
        class="mb-4"
      />

      <!-- Withdrawal Details (Single Mode) -->
      <a-descriptions v-if="!isBatchMode && withdrawal" :column="1" bordered size="small">
        <a-descriptions-item label="User">
          {{ withdrawal.userNickname || withdrawal.userId }}
        </a-descriptions-item>
        <a-descriptions-item label="Amount">
          <span class="font-mono font-semibold">
            {{ withdrawal.amount }} {{ withdrawal.currency }}
          </span>
        </a-descriptions-item>
        <a-descriptions-item label="Chain">
          {{ withdrawal.chain }}
        </a-descriptions-item>
        <a-descriptions-item label="Address">
          <span class="font-mono text-xs">{{ withdrawal.address }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="Risk Score">
          <a-tag :color="getRiskScoreColor(withdrawal.riskScore)">
            {{ withdrawal.riskScore }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item v-if="withdrawal.matchedRules?.length" label="Matched Rules">
          <a-space>
            <a-tag v-for="rule in withdrawal.matchedRules" :key="rule" color="orange">
              {{ rule }}
            </a-tag>
          </a-space>
        </a-descriptions-item>
      </a-descriptions>

      <!-- Batch Mode Summary Table -->
      <div v-if="isBatchMode && withdrawals">
        <a-table
          :columns="batchColumns"
          :data-source="withdrawals"
          :pagination="false"
          size="small"
          :scroll="{ y: 300 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'amount'">
              <span class="font-mono">{{ record.amount }} {{ record.currency }}</span>
            </template>
            <template v-else-if="column.key === 'riskScore'">
              <a-tag :color="getRiskScoreColor(record.riskScore)">
                {{ record.riskScore }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Rejection Form -->
      <a-form :model="formState" layout="vertical">
        <a-form-item
          label="Rejection Reason"
          :validate-status="!formState.reason && showError ? 'error' : ''"
          :help="!formState.reason && showError ? 'Please select or enter a reason' : ''"
        >
          <a-select
            v-model:value="formState.reason"
            placeholder="Select a reason"
            @change="handleReasonChange"
          >
            <a-select-option
              v-for="template in reasonTemplates"
              :key="template.value"
              :value="template.value"
            >
              {{ template.label }}
            </a-select-option>
            <a-select-option value="custom">Custom Reason</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          v-if="formState.reason === 'custom'"
          label="Custom Reason"
          :validate-status="
            formState.reason === 'custom' && !formState.customReason && showError ? 'error' : ''
          "
          :help="
            formState.reason === 'custom' && !formState.customReason && showError
              ? 'Please enter a custom reason'
              : ''
          "
        >
          <a-textarea
            v-model:value="formState.customReason"
            :rows="3"
            placeholder="Enter custom reason..."
          />
        </a-form-item>

        <a-form-item label="Additional Notes (Optional)">
          <a-textarea
            v-model:value="formState.notes"
            :rows="3"
            placeholder="Add any additional notes..."
          />
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="formState.confirmed">
            I confirm the rejection of {{ isBatchMode ? 'these withdrawals' : 'this withdrawal' }}
          </a-checkbox>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useWithdrawalsStore } from '@/stores/withdrawals'
import type { Withdrawal } from '@/contracts/assets'
import { message } from 'ant-design-vue'

interface Props {
  visible: boolean
  withdrawal?: Withdrawal | null
  withdrawals?: Withdrawal[] | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const withdrawalsStore = useWithdrawalsStore()
const loading = ref(false)
const showError = ref(false)

const formState = ref({
  reason: '',
  customReason: '',
  notes: '',
  confirmed: false,
})

// Batch mode detection
const isBatchMode = computed(() => {
  return props.withdrawals && props.withdrawals.length > 0
})

const reasonTemplates = [
  { label: 'High Risk Score', value: 'high_risk_score' },
  { label: 'Suspicious Activity', value: 'suspicious_activity' },
  { label: 'Invalid Address', value: 'invalid_address' },
  { label: 'Insufficient Balance', value: 'insufficient_balance' },
  { label: 'Compliance Issue', value: 'compliance_issue' },
  { label: 'User Request', value: 'user_request' },
  { label: 'Technical Issue', value: 'technical_issue' },
  { label: 'Duplicate Request', value: 'duplicate_request' },
  { label: 'Blacklisted Address', value: 'blacklisted_address' },
  { label: 'KYC Not Verified', value: 'kyc_not_verified' },
]

const batchColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: 'User',
    dataIndex: 'userNickname',
    key: 'userNickname',
    width: 120,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    width: 150,
  },
  {
    title: 'Chain',
    dataIndex: 'chain',
    key: 'chain',
    width: 80,
  },
  {
    title: 'Risk Score',
    dataIndex: 'riskScore',
    key: 'riskScore',
    width: 100,
  },
]

watch(
  () => props.visible,
  (newVisible) => {
    if (!newVisible) {
      formState.value = {
        reason: '',
        customReason: '',
        notes: '',
        confirmed: false,
      }
      showError.value = false
    }
  }
)

function handleReasonChange() {
  showError.value = false
}

function getRiskScoreColor(score: number) {
  if (score >= 70) return 'red'
  if (score >= 40) return 'orange'
  return 'green'
}

async function handleOk() {
  const finalReason =
    formState.value.reason === 'custom' ? formState.value.customReason : formState.value.reason

  if (!finalReason) {
    showError.value = true
    message.warning('Please select or enter a rejection reason')
    return
  }

  if (!formState.value.confirmed) {
    message.warning('Please confirm the rejection')
    return
  }

  loading.value = true
  try {
    if (isBatchMode.value && props.withdrawals) {
      // Batch rejection
      await withdrawalsStore.batchReject({
        ids: props.withdrawals.map((w) => w.id),
        reason: finalReason,
      })
    } else if (props.withdrawal) {
      // Single rejection
      await withdrawalsStore.reject(props.withdrawal.id, {
        reason: finalReason,
        notes: formState.value.notes,
      })
    }
    emit('update:visible', false)
    emit('success')
  } catch (error) {
    // Error handled by store
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  emit('update:visible', false)
}
</script>
