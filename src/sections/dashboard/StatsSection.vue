<template>
  <div class="stats-section">
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :lg="8">
        <StatCard
          title="New Registrations"
          :value="stats?.registrations.total || 0"
          :change="stats?.registrations.change"
          :icon="UserAddOutlined"
          icon-color="#1890ff"
          icon-bg="#e6f7ff"
          :loading="loading"
        />
      </a-col>
      <a-col :xs="24" :sm="12" :lg="8">
        <StatCard
          title="Active Users"
          :value="stats?.activeUsers.total || 0"
          :change="stats?.activeUsers.change"
          :icon="TeamOutlined"
          icon-color="#52c41a"
          icon-bg="#f6ffed"
          :loading="loading"
        />
      </a-col>
      <a-col :xs="24" :sm="12" :lg="8">
        <StatCard
          title="Pending KYC"
          :value="stats?.pendingKyc.total || 0"
          :change="stats?.pendingKyc.change"
          :icon="SafetyCertificateOutlined"
          icon-color="#faad14"
          icon-bg="#fffbe6"
          :loading="loading"
        />
      </a-col>
      <a-col :xs="24" :sm="12" :lg="8">
        <StatCard
          title="Deposits"
          :value="stats?.deposits.totalUsd || 0"
          :change="stats?.deposits.change"
          :icon="ArrowDownOutlined"
          icon-color="#13c2c2"
          icon-bg="#e6fffb"
          :loading="loading"
          :formatter="formatCurrency"
        />
      </a-col>
      <a-col :xs="24" :sm="12" :lg="8">
        <StatCard
          title="Withdrawals"
          :value="stats?.withdrawals.totalUsd || 0"
          :change="stats?.withdrawals.change"
          :icon="ArrowUpOutlined"
          icon-color="#eb2f96"
          icon-bg="#fff0f6"
          :loading="loading"
          :formatter="formatCurrency"
        />
      </a-col>
      <a-col :xs="24" :sm="12" :lg="8">
        <StatCard
          title="Trading Volume"
          :value="stats?.tradingVolume.totalUsd || 0"
          :change="stats?.tradingVolume.change"
          :icon="LineChartOutlined"
          icon-color="#722ed1"
          icon-bg="#f9f0ff"
          :loading="loading"
          :formatter="formatCurrency"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import {
  UserAddOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  LineChartOutlined,
} from '@ant-design/icons-vue'
import StatCard from '@/widgets/cards/StatCard.vue'
import { formatCurrency } from '@/utils/format'
import type { DashboardStats } from '@/services/api/dashboard'

interface Props {
  stats: DashboardStats | null
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})
</script>

<style scoped>
.stats-section {
  margin-bottom: 24px;
}
</style>
