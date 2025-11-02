<template>
  <a-drawer
    :open="open"
    :width="720"
    title="Review KYC Application"
    :closable="true"
    @close="handleClose"
  >
    <div v-if="application" class="review-drawer-content">
      <!-- Application Summary -->
      <a-card title="Application Summary" class="section-card">
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item label="User ID">{{ application.userId }}</a-descriptions-item>
          <a-descriptions-item label="Country">{{ application.country }}</a-descriptions-item>
          <a-descriptions-item label="Submitted At">
            {{ formatDate(application.submittedAt) }}
          </a-descriptions-item>
          <a-descriptions-item label="Status">
            <a-tag :color="getStatusColor(application.status)">
              {{ getStatusText(application.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Score">
            <a-progress
              :percent="application.score"
              :stroke-color="getScoreColor(application.score)"
              size="small"
            />
          </a-descriptions-item>
          <a-descriptions-item label="Risk Level">
            <a-tag :color="getRiskLevelColor(application.riskLevel)">
              {{ application.riskLevel?.toUpperCase() || 'N/A' }}
            </a-tag>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- Personal Information -->
      <a-card title="Personal Information" class="section-card">
        <a-descriptions :column="2" bordered size="small">
          <a-descriptions-item label="First Name">
            {{ application.firstName || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="Last Name">
            {{ application.lastName || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="Date of Birth">
            {{ application.dateOfBirth || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="Nationality">
            {{ application.nationality || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="Address" :span="2">
            {{ application.address || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="City">{{ application.city || '-' }}</a-descriptions-item>
          <a-descriptions-item label="Postal Code">
            {{ application.postalCode || '-' }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- Documents -->
      <a-card title="Documents" class="section-card">
        <a-space direction="vertical" style="width: 100%" :size="12">
          <div v-for="doc in application.documents" :key="doc.type" class="document-item">
            <div class="document-header">
              <span class="document-type">{{ formatDocumentType(doc.type) }}</span>
              <a-tag :color="getVerificationColor(doc.verificationStatus)">
                {{ doc.verificationStatus }}
              </a-tag>
            </div>
            <div class="document-preview">
              <a-image :src="doc.url" :alt="doc.type" :width="200" />
            </div>
            <div v-if="doc.ocrData" class="document-ocr">
              <a-collapse>
                <a-collapse-panel key="1" header="OCR Data">
                  <pre>{{ JSON.stringify(doc.ocrData, null, 2) }}</pre>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>
        </a-space>
      </a-card>

      <!-- Matched Rules -->
      <a-card v-if="application.matchedRules?.length" title="Risk Rules" class="section-card">
        <a-space wrap>
          <a-tag v-for="(rule, index) in application.matchedRules" :key="index" color="orange">
            {{ rule }}
          </a-tag>
        </a-space>
      </a-card>

      <!-- Review Form -->
      <a-card v-if="application.status === 'pending'" title="Review Decision" class="section-card">
        <a-form :model="reviewForm" layout="vertical">
          <a-form-item label="Decision" required>
            <a-radio-group v-model:value="reviewForm.action">
              <a-radio value="approve">Approve</a-radio>
              <a-radio value="reject">Reject</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item v-if="reviewForm.action === 'reject'" label="Reason" required>
            <a-space direction="vertical" style="width: 100%">
              <a-input
                v-model:value="reviewForm.reason"
                placeholder="Select or enter rejection reason"
                readonly
                @click="showReasonModal = true"
              >
                <template #suffix>
                  <a-button type="link" size="small" @click="showReasonModal = true">
                    Select Template
                  </a-button>
                </template>
              </a-input>
              <a-typography-text
                v-if="selectedReasonTemplate"
                type="secondary"
                style="font-size: 12px"
              >
                {{ selectedReasonTemplate.description }}
              </a-typography-text>
            </a-space>
          </a-form-item>

          <a-form-item label="Notes">
            <a-textarea
              v-model:value="reviewForm.notes"
              :rows="4"
              placeholder="Add review notes (optional)"
            />
          </a-form-item>

          <a-form-item label="Evidence">
            <ImageUploader
              v-model:value="reviewForm.evidence"
              :max-count="5"
              accept="image/*,.pdf"
              list-type="picture-card"
            />
            <a-typography-text
              type="secondary"
              style="font-size: 12px; display: block; margin-top: 8px"
            >
              Upload supporting documents or screenshots (max 5 files, images or PDF)
            </a-typography-text>
          </a-form-item>
        </a-form>
      </a-card>

      <!-- Review History -->
      <a-card v-if="application.reviewHistory?.length" title="Review History" class="section-card">
        <AuditTrail :records="application.reviewHistory" />
      </a-card>
    </div>

    <!-- Footer Actions -->
    <template #footer>
      <div class="drawer-footer">
        <a-space>
          <a-button @click="handleClose">Cancel</a-button>
          <a-button
            v-if="application?.status === 'pending'"
            type="primary"
            :loading="submitting"
            :disabled="!isFormValid"
            @click="handleSubmit"
          >
            Submit Review
          </a-button>
        </a-space>
      </div>
    </template>
  </a-drawer>

  <!-- Reason Template Modal -->
  <a-modal
    v-model:open="showReasonModal"
    title="Select Rejection Reason"
    :width="600"
    @ok="handleReasonSelect"
    @cancel="showReasonModal = false"
  >
    <a-space direction="vertical" style="width: 100%" :size="12">
      <a-input v-model:value="reasonSearchText" placeholder="Search reasons..." allow-clear>
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>

      <a-list :data-source="filteredReasonTemplates" :loading="false" class="reason-list">
        <template #renderItem="{ item }">
          <a-list-item
            class="reason-item"
            :class="{ 'reason-item-selected': selectedReasonKey === item.key }"
            @click="selectedReasonKey = item.key"
          >
            <a-list-item-meta>
              <template #title>
                <a-space>
                  <a-radio :checked="selectedReasonKey === item.key" />
                  <span>{{ item.label }}</span>
                  <a-tag v-if="item.severity" :color="getSeverityColor(item.severity)">
                    {{ item.severity }}
                  </a-tag>
                </a-space>
              </template>
              <template #description>
                {{ item.description }}
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>

      <a-divider>Or enter custom reason</a-divider>

      <a-textarea
        v-model:value="customReason"
        :rows="3"
        placeholder="Enter custom rejection reason..."
      />
    </a-space>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import ImageUploader from '@/shared/ImageUploader.vue'
import AuditTrail from '@/shared/AuditTrail.vue'
import type { KycApplication } from '@/types/models'
import { formatDate } from '@/utils/date'

interface Props {
  open: boolean
  application: KycApplication | null
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', payload: ReviewFormData): void
}

interface ReviewFormData {
  action: 'approve' | 'reject'
  notes?: string
  evidence?: string[]
  reason?: string
}

interface ReasonTemplate {
  key: string
  label: string
  description: string
  severity?: 'high' | 'medium' | 'low'
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const submitting = ref(false)
const reviewForm = ref<ReviewFormData>({
  action: 'approve',
  notes: '',
  evidence: [],
  reason: undefined,
})

// Reason modal state
const showReasonModal = ref(false)
const selectedReasonKey = ref<string | undefined>(undefined)
const customReason = ref('')
const reasonSearchText = ref('')

// Reason templates
const reasonTemplates: ReasonTemplate[] = [
  {
    key: 'incomplete_documents',
    label: 'Incomplete Documents',
    description:
      'Required documents are missing or incomplete. Please request the user to submit all necessary documents.',
    severity: 'medium',
  },
  {
    key: 'invalid_documents',
    label: 'Invalid Documents',
    description: 'Submitted documents are invalid, expired, or do not meet quality standards.',
    severity: 'high',
  },
  {
    key: 'document_mismatch',
    label: 'Document Information Mismatch',
    description: 'Information on submitted documents does not match or is inconsistent.',
    severity: 'high',
  },
  {
    key: 'poor_quality',
    label: 'Poor Document Quality',
    description: 'Document images are blurry, cropped, or otherwise unreadable.',
    severity: 'medium',
  },
  {
    key: 'suspicious_activity',
    label: 'Suspicious Activity',
    description: 'Account shows signs of suspicious or fraudulent activity.',
    severity: 'high',
  },
  {
    key: 'high_risk_country',
    label: 'High Risk Country',
    description: 'User is from a high-risk jurisdiction or sanctioned country.',
    severity: 'high',
  },
  {
    key: 'failed_verification',
    label: 'Failed Identity Verification',
    description: 'Unable to verify user identity through provided documents and information.',
    severity: 'high',
  },
  {
    key: 'duplicate_account',
    label: 'Duplicate Account',
    description: 'User appears to have multiple accounts, which violates platform policy.',
    severity: 'high',
  },
  {
    key: 'age_restriction',
    label: 'Age Restriction',
    description: 'User does not meet minimum age requirements.',
    severity: 'high',
  },
  {
    key: 'pep_sanction',
    label: 'PEP or Sanctions List Match',
    description: 'User matches Politically Exposed Person (PEP) or sanctions list.',
    severity: 'high',
  },
  {
    key: 'address_verification_failed',
    label: 'Address Verification Failed',
    description: 'Unable to verify proof of address or address document is invalid.',
    severity: 'medium',
  },
  {
    key: 'selfie_verification_failed',
    label: 'Selfie Verification Failed',
    description: 'Selfie does not match ID photo or fails liveness check.',
    severity: 'high',
  },
  {
    key: 'other',
    label: 'Other',
    description: 'Other reason not listed above. Please provide details in the notes field.',
    severity: 'low',
  },
]

// Computed
const isFormValid = computed(() => {
  if (!reviewForm.value.action) return false
  if (reviewForm.value.action === 'reject' && !reviewForm.value.reason) return false
  return true
})

const filteredReasonTemplates = computed(() => {
  if (!reasonSearchText.value) {
    return reasonTemplates
  }
  const searchLower = reasonSearchText.value.toLowerCase()
  return reasonTemplates.filter(
    (template) =>
      template.label.toLowerCase().includes(searchLower) ||
      template.description.toLowerCase().includes(searchLower)
  )
})

const selectedReasonTemplate = computed(() => {
  if (!reviewForm.value.reason) return null
  return reasonTemplates.find((t) => t.label === reviewForm.value.reason)
})

// Watch for application changes to reset form
watch(
  () => props.application,
  (newApp) => {
    if (newApp) {
      reviewForm.value = {
        action: 'approve',
        notes: '',
        evidence: [],
        reason: undefined,
      }
      selectedReasonKey.value = undefined
      customReason.value = ''
    }
  }
)

// Watch for action changes to reset reason
watch(
  () => reviewForm.value.action,
  (newAction) => {
    if (newAction === 'approve') {
      reviewForm.value.reason = undefined
      selectedReasonKey.value = undefined
      customReason.value = ''
    }
  }
)

// Helper functions
function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
  }
  return colorMap[status] || 'default'
}

function getStatusText(status: string): string {
  const textMap: Record<string, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  }
  return textMap[status] || status
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#52c41a'
  if (score >= 60) return '#faad14'
  return '#f5222d'
}

function getRiskLevelColor(level?: string): string {
  const colorMap: Record<string, string> = {
    low: 'green',
    medium: 'orange',
    high: 'red',
  }
  return colorMap[level || ''] || 'default'
}

function getVerificationColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    verified: 'green',
    failed: 'red',
  }
  return colorMap[status] || 'default'
}

function formatDocumentType(type: string): string {
  const typeMap: Record<string, string> = {
    id_front: 'ID Front',
    id_back: 'ID Back',
    selfie: 'Selfie',
    proof_of_address: 'Proof of Address',
  }
  return typeMap[type] || type
}

function getSeverityColor(severity: string): string {
  const colorMap: Record<string, string> = {
    high: 'red',
    medium: 'orange',
    low: 'blue',
  }
  return colorMap[severity] || 'default'
}

// Event handlers
function handleClose() {
  emit('update:open', false)
}

function handleReasonSelect() {
  if (customReason.value.trim()) {
    // Use custom reason
    reviewForm.value.reason = customReason.value.trim()
  } else if (selectedReasonKey.value) {
    // Use template reason
    const template = reasonTemplates.find((t) => t.key === selectedReasonKey.value)
    if (template) {
      reviewForm.value.reason = template.label
    }
  }

  showReasonModal.value = false
  reasonSearchText.value = ''
}

async function handleSubmit() {
  if (!isFormValid.value) {
    message.warning('Please complete all required fields')
    return
  }

  // Validate rejection reason
  if (reviewForm.value.action === 'reject' && !reviewForm.value.reason) {
    message.warning('Please select or enter a rejection reason')
    return
  }

  submitting.value = true
  try {
    emit('submit', { ...reviewForm.value })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.review-drawer-content {
  padding-bottom: 60px;
}

.section-card {
  margin-bottom: 16px;
}

.section-card:last-child {
  margin-bottom: 0;
}

.document-item {
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.document-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.document-type {
  font-weight: 500;
}

.document-preview {
  margin-bottom: 12px;
}

.document-ocr {
  margin-top: 8px;
}

.document-ocr pre {
  margin: 0;
  font-size: 12px;
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
}

.reason-list {
  max-height: 400px;
  overflow-y: auto;
}

.reason-item {
  cursor: pointer;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.reason-item:hover {
  border-color: #1890ff;
  background-color: #f0f7ff;
}

.reason-item-selected {
  border-color: #1890ff;
  background-color: #e6f7ff;
}
</style>
