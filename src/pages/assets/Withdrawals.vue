<template>
  <div class="withdrawals-page">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-semibold">Withdrawals</h1>
      <p class="text-gray-500 mt-1">Review and manage user withdrawal requests</p>
    </div>

    <!-- Stats Cards -->
    <a-row :gutter="16" class="mb-6">
      <a-col :span="6">
        <a-card size="small">
          <a-statistic
            title="Total Withdrawals (24h)"
            :value="stats.total24h"
            :precision="2"
            suffix="USD"
            :value-style="{ color: '#cf1322' }"
          >
            <template #prefix>
              <DollarOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small">
          <a-statistic
            title="Pending Review"
            :value="stats.pendingReview"
            :value-style="{ color: '#faad14' }"
          >
            <template #prefix>
              <ClockCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small">
          <a-statistic
            title="High Risk"
            :value="stats.highRisk"
            :value-style="{ color: '#ff4d4f' }"
          >
            <template #prefix>
              <WarningOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small">
          <a-statistic
            title="Completed (24h)"
            :value="stats.completed24h"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix>
              <CheckCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- Withdrawals Table -->
    <a-card :bordered="false">
      <WithdrawalTable />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  DollarOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons-vue'
import WithdrawalTable from '@/tables/assets/WithdrawalTable.vue'

// Mock stats - in real implementation, fetch from API
const stats = ref({
  total24h: 850000,
  pendingReview: 18,
  highRisk: 5,
  completed24h: 124,
})

onMounted(() => {
  // Fetch stats from API
})
</script>

<style scoped>
.withdrawals-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}
</style>
