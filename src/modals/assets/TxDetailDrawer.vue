<template>
  <a-drawer
    :visible="visible"
    :title="
      transaction ? (isDeposit ? 'Deposit Details' : 'Withdrawal Details') : 'Transaction Details'
    "
    width="720"
    @close="handleClose"
  >
    <div v-if="transaction" class="space-y-6">
      <!-- Basic Information -->
      <a-card title="Basic Information" size="small">
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item label="Transaction ID">
            {{ transaction.id }}
          </a-descriptions-item>
          <a-descriptions-item label="Status">
            <a-tag :color="getStatusColor(transaction.status)">
              {{ transaction.status.toUpperCase() }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="User ID">
            <router-link :to="`/admin/users/${transaction.userId}`">
              {{ transaction.userNickname || transaction.userId }}
            </router-link>
          </a-descriptions-item>
          <a-descriptions-item label="Currency">
            {{ transaction.currency }}
          </a-descriptions-item>
          <a-descriptions-item label="Chain">
            {{ transaction.chain }}
          </a-descriptions-item>
          <a-descriptions-item label="Amount">
            <span class="font-mono font-semibold"
              >{{ transaction.amount }} {{ transaction.currency }}</span
            >
          </a-descriptions-item>
          <a-descriptions-item v-if="!isDeposit" label="Fee">
            <span class="font-mono"
              >{{ (transaction as Withdrawal).fee }} {{ transaction.currency }}</span
            >
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- Transaction Details -->
      <a-card title="Transaction Details" size="small">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item v-if="transaction.txHash" label="Tx Hash">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs">{{ transaction.txHash }}</span>
              <a-button type="link" size="small" @click="copyToClipboard(transaction.txHash)">
                Copy
              </a-button>
            </div>
          </a-descriptions-item>
          <a-descriptions-item :label="isDeposit ? 'Deposit Address' : 'Withdrawal Address'">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs">{{ transaction.address }}</span>
              <a-button type="link" size="small" @click="copyToClipboard(transaction.address)">
                Copy
              </a-button>
            </div>
          </a-descriptions-item>
          <a-descriptions-item v-if="isDeposit" label="Confirmations">
            <a-progress
              :percent="
                Math.min(
                  ((transaction as Deposit).confirmations /
                    (transaction as Deposit).requiredConfirmations) *
                    100,
                  100
                )
              "
              :status="
                (transaction as Deposit).confirmations >=
                (transaction as Deposit).requiredConfirmations
                  ? 'success'
                  : 'active'
              "
            />
            <span class="text-sm text-gray-600 mt-2 block">
              {{ (transaction as Deposit).confirmations }} /
              {{ (transaction as Deposit).requiredConfirmations }} confirmations
            </span>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- Risk Assessment -->
      <a-card
        v-if="(transaction.riskFlags && transaction.riskFlags.length > 0) || transaction.riskScore"
        title="Risk Assessment"
        size="small"
      >
        <a-alert
          v-if="transaction.riskFlags && transaction.riskFlags.length > 0"
          message="Risk Flags Detected"
          :description="`This transaction has ${transaction.riskFlags.length} risk flag(s)`"
          type="warning"
          show-icon
          class="mb-4"
        />
        <div v-if="transaction.riskFlags && transaction.riskFlags.length > 0" class="space-y-2">
          <a-tag v-for="flag in transaction.riskFlags" :key="flag" color="red" class="mb-2">
            {{ flag }}
          </a-tag>
        </div>
        <a-descriptions v-if="transaction.riskScore" :column="1" bordered size="small" class="mt-4">
          <a-descriptions-item label="Risk Score">
            <a-progress
              :percent="transaction.riskScore"
              :status="
                transaction.riskScore > 70
                  ? 'exception'
                  : transaction.riskScore > 40
                    ? 'normal'
                    : 'success'
              "
            />
          </a-descriptions-item>
        </a-descriptions>
        <div
          v-if="
            !isDeposit &&
            (transaction as Withdrawal).matchedRules &&
            (transaction as Withdrawal).matchedRules.length > 0
          "
          class="mt-4"
        >
          <h4 class="text-sm font-medium mb-2">Matched Rules:</h4>
          <a-space>
            <a-tag
              v-for="rule in (transaction as Withdrawal).matchedRules"
              :key="rule"
              color="orange"
            >
              {{ rule }}
            </a-tag>
          </a-space>
        </div>
      </a-card>

      <!-- Approvals (for withdrawals) -->
      <a-card
        v-if="
          !isDeposit &&
          (transaction as Withdrawal).approvals &&
          (transaction as Withdrawal).approvals.length > 0
        "
        title="Approvals"
        size="small"
      >
        <a-timeline>
          <a-timeline-item
            v-for="approval in (transaction as Withdrawal).approvals"
            :key="approval.adminId"
            :color="approval.action === 'approve' ? 'green' : 'red'"
          >
            <p class="text-sm font-medium">
              {{ approval.role }}: {{ approval.action.toUpperCase() }}
            </p>
            <p class="text-xs text-gray-500">
              By {{ approval.adminName }} at {{ formatDateTime(approval.timestamp) }}
            </p>
            <p v-if="approval.reason" class="text-xs text-gray-600 mt-1">
              Reason: {{ approval.reason }}
            </p>
          </a-timeline-item>
        </a-timeline>
      </a-card>

      <!-- Timeline -->
      <a-card title="Timeline" size="small">
        <a-timeline>
          <a-timeline-item color="green">
            <p class="text-sm font-medium">Transaction Created</p>
            <p class="text-xs text-gray-500">{{ formatDateTime(transaction.createdAt) }}</p>
          </a-timeline-item>
          <a-timeline-item
            v-if="
              isDeposit &&
              ((transaction as Deposit).status === 'confirming' ||
                (transaction as Deposit).status === 'completed')
            "
            color="blue"
          >
            <p class="text-sm font-medium">Confirmations In Progress</p>
            <p class="text-xs text-gray-500">
              {{ (transaction as Deposit).confirmations }} /
              {{ (transaction as Deposit).requiredConfirmations }} confirmations
            </p>
          </a-timeline-item>
          <a-timeline-item
            v-if="
              !isDeposit &&
              ((transaction as Withdrawal).status === 'reviewing' ||
                (transaction as Withdrawal).status === 'approved')
            "
            color="blue"
          >
            <p class="text-sm font-medium">Under Review</p>
            <p class="text-xs text-gray-500">Awaiting approval</p>
          </a-timeline-item>
          <a-timeline-item v-if="transaction.status === 'completed'" color="green">
            <p class="text-sm font-medium">Transaction Completed</p>
            <p class="text-xs text-gray-500">{{ formatDateTime(transaction.completedAt!) }}</p>
          </a-timeline-item>
          <a-timeline-item
            v-if="transaction.status === 'failed' || transaction.status === 'rejected'"
            color="red"
          >
            <p class="text-sm font-medium">
              Transaction {{ transaction.status === 'rejected' ? 'Rejected' : 'Failed' }}
            </p>
            <p class="text-xs text-gray-500">{{ formatDateTime(transaction.completedAt!) }}</p>
            <p
              v-if="!isDeposit && (transaction as Withdrawal).rejectedReason"
              class="text-xs text-gray-600 mt-1"
            >
              Reason: {{ (transaction as Withdrawal).rejectedReason }}
            </p>
          </a-timeline-item>
        </a-timeline>
      </a-card>

      <!-- Notes -->
      <a-card title="Notes" size="small">
        <a-textarea
          v-model:value="notes"
          :rows="4"
          placeholder="Add notes about this transaction..."
          :disabled="savingNotes"
        />
        <div class="mt-4 flex justify-end">
          <a-button type="primary" :loading="savingNotes" @click="handleSaveNotes">
            Save Notes
          </a-button>
        </div>
      </a-card>
    </div>

    <template #footer>
      <a-space>
        <a-button @click="handleClose">Close</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import { useDepositsStore } from '@/stores/deposits'
import { useWithdrawalsStore } from '@/stores/withdrawals'
import type { Deposit, Withdrawal } from '@/contracts/assets'
import { formatDateTime } from '@/utils/date'

interface Props {
  visible: boolean
  deposit?: Deposit | null
  withdrawal?: Withdrawal | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const depositsStore = useDepositsStore()
const withdrawalsStore = useWithdrawalsStore()
const notes = ref('')
const savingNotes = ref(false)

const transaction = computed(() => props.deposit || props.withdrawal)
const isDeposit = computed(() => !!props.deposit)

watch(
  () => transaction.value,
  (newTransaction) => {
    if (newTransaction) {
      notes.value = newTransaction.notes || ''
    }
  },
  { immediate: true }
)

function getStatusColor(status: string) {
  const colorMap: Record<string, string> = {
    pending: 'default',
    confirming: 'processing',
    completed: 'success',
    failed: 'error',
  }
  return colorMap[status] || 'default'
}

function handleClose() {
  emit('update:visible', false)
  emit('close')
}

async function handleSaveNotes() {
  if (!transaction.value) return

  savingNotes.value = true
  try {
    if (isDeposit.value) {
      await depositsStore.updateNotes(transaction.value.id, notes.value)
    } else {
      await withdrawalsStore.updateNotes(transaction.value.id, notes.value)
    }
  } catch (error) {
    // Error handled by store
  } finally {
    savingNotes.value = false
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    message.success('Copied to clipboard')
  })
}
</script>
