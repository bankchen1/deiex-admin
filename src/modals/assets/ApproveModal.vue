<template>
  <a-modal
    :visible="visible"
    :title="isBatchMode ? 'Batch Approve Withdrawals' : 'Approve Withdrawal'"
    :confirm-loading="loading"
    :width="720"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div v-if="withdrawal || (withdrawals && withdrawals.length > 0)" class="space-y-4">
      <!-- Batch Mode Summary -->
      <a-alert
        v-if="isBatchMode"
        :message="`Batch Approval: ${withdrawals?.length || 0} withdrawals selected`"
        description="Please review the batch approval details carefully. All selected withdrawals will be approved with the same reason."
        type="info"
        show-icon
        class="mb-4"
      />

      <!-- Single Mode Alert -->
      <a-alert
        v-else
        message="Approval Confirmation"
        description="Please review the withdrawal details carefully before approving."
        type="info"
        show-icon
        class="mb-4"
      />

      <!-- Multi-Role Approval Status -->
      <a-card
        v-if="!isBatchMode && withdrawal && requiresMultiRoleApproval"
        size="small"
        title="Multi-Role Approval Status"
        class="mb-4"
      >
        <div class="space-y-2">
          <div v-for="role in requiredRoles" :key="role" class="flex items-center justify-between">
            <span class="font-medium">{{ role }}</span>
            <a-tag v-if="hasRoleApproval(role)" color="success">
              <template #icon>
                <CheckCircleOutlined />
              </template>
              Approved
            </a-tag>
            <a-tag v-else color="default">Pending</a-tag>
          </div>
        </div>
        <a-divider class="my-3" />
        <div class="text-sm text-gray-600">
          <InfoCircleOutlined class="mr-1" />
          {{ approvalMessage }}
        </div>
      </a-card>

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
        <a-descriptions-item label="Fee">
          {{ withdrawal.fee }} {{ withdrawal.currency }}
        </a-descriptions-item>
        <a-descriptions-item label="Chain">
          {{ withdrawal.chain }}
        </a-descriptions-item>
        <a-descriptions-item label="Address">
          <span class="font-mono text-xs">{{ withdrawal.address }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="Risk Score">
          <a-progress
            :percent="withdrawal.riskScore"
            :status="getRiskStatus(withdrawal.riskScore)"
            size="small"
          />
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

      <!-- Approval Form -->
      <a-form :model="formState" layout="vertical">
        <a-form-item v-if="!isBatchMode && requiresMultiRoleApproval" label="Role">
          <a-select
            v-model:value="formState.role"
            placeholder="Select your role for this approval"
            :disabled="availableRoles.length === 1"
          >
            <a-select-option v-for="role in availableRoles" :key="role" :value="role">
              {{ role }}
            </a-select-option>
          </a-select>
          <div class="text-xs text-gray-500 mt-1">
            Select the role under which you are approving this withdrawal
          </div>
        </a-form-item>

        <a-form-item label="Approval Reason (Optional)">
          <a-textarea
            v-model:value="formState.reason"
            :rows="3"
            placeholder="Enter reason for approval..."
          />
        </a-form-item>

        <a-form-item label="Notes (Optional)">
          <a-textarea
            v-model:value="formState.notes"
            :rows="3"
            placeholder="Add any additional notes..."
          />
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="formState.confirmed">
            I have reviewed the {{ isBatchMode ? 'withdrawals' : 'withdrawal details' }} and confirm
            the approval
          </a-checkbox>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
import { useWithdrawalsStore } from '@/stores/withdrawals'
import { useAuthStore } from '@/stores/auth'
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
const authStore = useAuthStore()
const loading = ref(false)

const formState = ref({
  role: '',
  reason: '',
  notes: '',
  confirmed: false,
})

// Batch mode detection
const isBatchMode = computed(() => {
  return props.withdrawals && props.withdrawals.length > 0
})

// Multi-role approval configuration
// In a real implementation, this would come from backend configuration
const requiredRoles = ['Finance Manager', 'Risk Manager']
const riskThreshold = 70 // Withdrawals with risk score >= 70 require multi-role approval

const requiresMultiRoleApproval = computed(() => {
  if (!props.withdrawal) return false
  return props.withdrawal.riskScore >= riskThreshold
})

const hasRoleApproval = (role: string) => {
  if (!props.withdrawal?.approvals) return false
  return props.withdrawal.approvals.some(
    (approval) => approval.role === role && approval.action === 'approve'
  )
}

const availableRoles = computed(() => {
  // Get user's roles from auth store
  const userRoles = authStore.user?.roles || []
  // Filter to only required roles that haven't been approved yet
  return requiredRoles.filter((role) => {
    return userRoles.includes(role) && !hasRoleApproval(role)
  })
})

const approvalMessage = computed(() => {
  if (!props.withdrawal) return ''
  const approvedCount = requiredRoles.filter((role) => hasRoleApproval(role)).length
  const totalRequired = requiredRoles.length

  if (approvedCount === 0) {
    return `This high-risk withdrawal requires approval from ${totalRequired} roles: ${requiredRoles.join(', ')}`
  } else if (approvedCount < totalRequired) {
    return `${approvedCount} of ${totalRequired} required approvals received. Pending: ${requiredRoles.filter((r) => !hasRoleApproval(r)).join(', ')}`
  } else {
    return `All required approvals received. Withdrawal will be processed.`
  }
})

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
    if (newVisible) {
      // Auto-select role if user only has one available role
      if (availableRoles.value.length === 1) {
        formState.value.role = availableRoles.value[0]
      }
    } else {
      formState.value = {
        role: '',
        reason: '',
        notes: '',
        confirmed: false,
      }
    }
  }
)

function getRiskStatus(score: number) {
  if (score >= 70) return 'exception'
  if (score >= 40) return 'normal'
  return 'success'
}

function getRiskScoreColor(score: number) {
  if (score >= 70) return 'red'
  if (score >= 40) return 'orange'
  return 'green'
}

async function handleOk() {
  if (!formState.value.confirmed) {
    message.warning('Please confirm that you have reviewed the details')
    return
  }

  // Validate role selection for multi-role approval
  if (
    !isBatchMode.value &&
    requiresMultiRoleApproval.value &&
    availableRoles.value.length > 0 &&
    !formState.value.role
  ) {
    message.warning('Please select your role for this approval')
    return
  }

  loading.value = true
  try {
    if (isBatchMode.value && props.withdrawals) {
      // Batch approval
      await withdrawalsStore.batchApprove({
        ids: props.withdrawals.map((w) => w.id),
        reason: formState.value.reason,
      })
    } else if (props.withdrawal) {
      // Single approval
      await withdrawalsStore.approve(props.withdrawal.id, {
        role: formState.value.role || undefined,
        reason: formState.value.reason,
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
