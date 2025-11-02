<template>
  <div class="kyc-risk-section">
    <a-row :gutter="[16, 16]">
      <!-- Risk Summary -->
      <a-col :span="24">
        <a-card title="Risk Summary">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-statistic
                title="Risk Level"
                :value="application.riskLevel?.toUpperCase() || 'N/A'"
                :value-style="{ color: getRiskLevelColor(application.riskLevel) }"
              />
            </a-col>
            <a-col :span="8">
              <a-statistic title="KYC Score" :value="application.score" suffix="/ 100" />
            </a-col>
            <a-col :span="8">
              <a-statistic
                title="Matched Rules"
                :value="application.matchedRules?.length || 0"
                :value-style="{
                  color: application.matchedRules?.length ? '#faad14' : '#52c41a',
                }"
              />
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <!-- Matched Risk Rules -->
      <a-col :span="24">
        <a-card title="Matched Risk Rules">
          <a-empty
            v-if="!application.matchedRules || application.matchedRules.length === 0"
            description="No risk rules matched"
          />
          <a-list v-else :data-source="application.matchedRules" bordered>
            <template #renderItem="{ item, index }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <a-space>
                      <a-tag color="orange">Rule {{ index + 1 }}</a-tag>
                      <span>{{ item }}</span>
                    </a-space>
                  </template>
                  <template #description>
                    Risk rule triggered during KYC verification process
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <!-- Risk Indicators -->
      <a-col :span="24">
        <a-card title="Risk Indicators">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="Country Risk">
              <a-tag :color="getCountryRiskColor(application.country)">
                {{ getCountryRiskLevel(application.country) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Document Verification">
              <a-tag :color="getDocumentVerificationColor(application.documents)">
                {{ getDocumentVerificationStatus(application.documents) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Overall Score">
              <a-progress
                :percent="application.score"
                :stroke-color="getScoreColor(application.score)"
                size="small"
              />
            </a-descriptions-item>
            <a-descriptions-item label="Risk Assessment">
              <a-tag :color="getRiskLevelColor(application.riskLevel)">
                {{ application.riskLevel?.toUpperCase() || 'PENDING' }}
              </a-tag>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import type { KycApplication, KycDocument } from '@/types/models'

interface Props {
  application: KycApplication
}

defineProps<Props>()

function getRiskLevelColor(level?: string): string {
  const colorMap: Record<string, string> = {
    low: '#52c41a',
    medium: '#faad14',
    high: '#f5222d',
  }
  return colorMap[level || ''] || '#999'
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#52c41a'
  if (score >= 60) return '#faad14'
  return '#f5222d'
}

function getCountryRiskColor(country: string): string {
  // Simplified country risk assessment
  const highRiskCountries = ['XX', 'YY'] // Placeholder
  return highRiskCountries.includes(country) ? 'red' : 'green'
}

function getCountryRiskLevel(country: string): string {
  const highRiskCountries = ['XX', 'YY'] // Placeholder
  return highRiskCountries.includes(country) ? 'HIGH' : 'LOW'
}

function getDocumentVerificationColor(documents: KycDocument[]): string {
  if (!documents || documents.length === 0) return 'default'
  const allVerified = documents.every((doc) => doc.verificationStatus === 'verified')
  const anyFailed = documents.some((doc) => doc.verificationStatus === 'failed')

  if (allVerified) return 'green'
  if (anyFailed) return 'red'
  return 'orange'
}

function getDocumentVerificationStatus(documents: KycDocument[]): string {
  if (!documents || documents.length === 0) return 'No Documents'
  const allVerified = documents.every((doc) => doc.verificationStatus === 'verified')
  const anyFailed = documents.some((doc) => doc.verificationStatus === 'failed')

  if (allVerified) return 'All Verified'
  if (anyFailed) return 'Verification Failed'
  return 'Pending Verification'
}
</script>

<style scoped>
.kyc-risk-section {
  width: 100%;
}
</style>
