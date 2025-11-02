<template>
  <div class="deposits-page">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-semibold">Deposits</h1>
      <p class="text-gray-500 mt-1">Monitor and manage user deposit transactions</p>
    </div>

    <!-- Stats Cards -->
    <a-row :gutter="16" class="mb-6">
      <a-col :span="6">
        <a-card size="small">
          <a-statistic
            title="Total Deposits (24h)"
            :value="stats.total24h"
            :precision="2"
            suffix="USD"
            :value-style="{ color: '#3f8600' }"
          >
            <template #prefix>
              <DollarOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small">
          <a-statistic title="Pending" :value="stats.pending" :value-style="{ color: '#faad14' }">
            <template #prefix>
              <ClockCircleOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small">
          <a-statistic
            title="Confirming"
            :value="stats.confirming"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix>
              <SyncOutlined />
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

    <!-- Deposits Table -->
    <a-card :bordered="false">
      <DepositTable />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  DollarOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons-vue'
import DepositTable from '@/tables/assets/DepositTable.vue'

// Mock stats - in real implementation, fetch from API
const stats = ref({
  total24h: 1250000,
  pending: 23,
  confirming: 45,
  completed24h: 156,
})

onMounted(() => {
  // Fetch stats from API
})
</script>

<style scoped>
.deposits-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}
</style>
