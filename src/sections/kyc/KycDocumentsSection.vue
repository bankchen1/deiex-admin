<template>
  <div class="kyc-documents-section">
    <a-row :gutter="[16, 16]">
      <a-col v-for="doc in documents" :key="doc.type" :span="12">
        <a-card :title="formatDocumentType(doc.type)">
          <template #extra>
            <a-tag :color="getVerificationColor(doc.verificationStatus)">
              {{ doc.verificationStatus }}
            </a-tag>
          </template>

          <!-- Document Image -->
          <div class="document-preview">
            <a-image :src="doc.url" :alt="doc.type" style="width: 100%" />
          </div>

          <!-- OCR Data -->
          <div v-if="doc.ocrData" class="document-ocr">
            <a-divider>OCR Extracted Data</a-divider>
            <a-descriptions :column="1" size="small" bordered>
              <a-descriptions-item
                v-for="(value, key) in doc.ocrData"
                :key="key"
                :label="formatOcrKey(key)"
              >
                {{ value }}
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </a-card>
      </a-col>

      <!-- Empty State -->
      <a-col v-if="documents.length === 0" :span="24">
        <a-empty description="No documents uploaded" />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import type { KycDocument } from '@/contracts/kyc'

interface Props {
  documents: KycDocument[]
}

defineProps<Props>()

function formatDocumentType(type: string): string {
  const typeMap: Record<string, string> = {
    id_front: 'ID Front',
    id_back: 'ID Back',
    selfie: 'Selfie',
    proof_of_address: 'Proof of Address',
  }
  return typeMap[type] || type
}

function getVerificationColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    verified: 'green',
    failed: 'red',
  }
  return colorMap[status] || 'default'
}

function formatOcrKey(key: string): string {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>

<style scoped>
.kyc-documents-section {
  width: 100%;
}

.document-preview {
  margin-bottom: 16px;
}

.document-ocr {
  margin-top: 16px;
}
</style>
