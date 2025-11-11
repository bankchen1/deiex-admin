<template>
  <div class="kyc-overview-section">
    <a-row :gutter="[16, 16]">
      <!-- Basic Information -->
      <a-col :span="24">
        <a-card title="Basic Information">
          <a-descriptions :column="3" bordered>
            <a-descriptions-item label="User ID">{{ application.userId }}</a-descriptions-item>
            <a-descriptions-item label="Status">
              <a-tag :color="getStatusColor(application.status)">
                {{ getStatusText(application.status) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Risk Level">
              <a-tag :color="getRiskLevelColor(application.riskLevel)">
                {{ application.riskLevel?.toUpperCase() || 'N/A' }}
              </a-tag>
            </a-descriptions-item>

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
            <a-descriptions-item label="Country">{{ application.country }}</a-descriptions-item>
            <a-descriptions-item label="Submitted At">
              {{ formatDate(application.submittedAt) }}
            </a-descriptions-item>

            <a-descriptions-item label="Address" :span="3">
              {{ application.address || '-' }}
            </a-descriptions-item>

            <a-descriptions-item label="City">{{ application.city || '-' }}</a-descriptions-item>
            <a-descriptions-item label="Postal Code">
              {{ application.postalCode || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="Score">
              <a-progress
                :percent="application.score"
                :stroke-color="getScoreColor(application.score)"
                size="small"
              />
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>

      <!-- Score Gauge -->
      <a-col :span="12">
        <a-card title="KYC Score">
          <ScoreGauge :score="application.score" title="Overall Score" />
        </a-card>
      </a-col>

      <!-- Matched Rules -->
      <a-col :span="12">
        <a-card title="Risk Rules">
          <a-empty
            v-if="!application.matchedRules || application.matchedRules.length === 0"
            description="No risk rules matched"
          />
          <a-space v-else direction="vertical" style="width: 100%">
            <a-alert
              message="Risk Rules Matched"
              :description="`${application.matchedRules.length} rule(s) matched for this application`"
              type="warning"
              show-icon
            />
            <a-space wrap>
              <a-tag v-for="(rule, index) in application.matchedRules" :key="index" color="orange">
                {{ rule }}
              </a-tag>
            </a-space>
          </a-space>
        </a-card>
      </a-col>

      <!-- Review Information -->
      <a-col v-if="application.reviewedAt" :span="24">
        <a-card title="Review Information">
          <a-descriptions :column="3" bordered>
            <a-descriptions-item label="Reviewed At">
              {{ formatDate(application.reviewedAt) }}
            </a-descriptions-item>
            <a-descriptions-item label="Reviewed By">
              {{ application.reviewedBy || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="Decision">
              <a-tag :color="getStatusColor(application.status)">
                {{ getStatusText(application.status) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Notes" :span="3">
              {{ application.reviewNotes || '-' }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import ScoreGauge from '@/widgets/risk/ScoreGauge.vue'
import type { KycApplication } from '@/contracts/kyc'
import { formatDate } from '@/utils/date'

interface Props {
  application: KycApplication
}

defineProps<Props>()

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

function getRiskLevelColor(level?: string): string {
  const colorMap: Record<string, string> = {
    low: 'green',
    medium: 'orange',
    high: 'red',
  }
  return colorMap[level || ''] || 'default'
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#52c41a'
  if (score >= 60) return '#faad14'
  return '#f5222d'
}
</script>

<style scoped>
.kyc-overview-section {
  width: 100%;
}
</style>
