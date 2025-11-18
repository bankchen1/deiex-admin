<template>
  <a-row :gutter="16" class="mb-6">
    <a-col :span="6">
      <a-card size="small">
        <a-statistic
          title="Total Balance"
          :value="summary.total"
          :precision="2"
          prefix="$"
          :value-style="{ color: '#1890ff' }"
        >
          <template #prefix>
            <WalletOutlined />
          </template>
        </a-statistic>
      </a-card>
    </a-col>
    <a-col :span="6">
      <a-card size="small">
        <a-statistic
          title="Hot Wallets"
          :value="summary.hot"
          :precision="2"
          prefix="$"
          :value-style="{ color: '#faad14' }"
        >
          <template #prefix>
            <FireOutlined />
          </template>
        </a-statistic>
      </a-card>
    </a-col>
    <a-col :span="6">
      <a-card size="small">
        <a-statistic
          title="Cold Wallets"
          :value="summary.cold"
          :precision="2"
          prefix="$"
          :value-style="{ color: '#52c41a' }"
        >
          <template #prefix>
            <SafetyOutlined />
          </template>
        </a-statistic>
      </a-card>
    </a-col>
    <a-col :span="6">
      <a-card size="small">
        <a-statistic
          title="Active Chains"
          :value="summary.activeChains"
          :value-style="{ color: '#13c2c2' }"
        >
          <template #prefix>
            <LinkOutlined />
          </template>
        </a-statistic>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { WalletOutlined, FireOutlined, SafetyOutlined, LinkOutlined } from '@ant-design/icons-vue'
import type { PropType } from 'vue'

interface BalanceSummary {
  total: number
  hot: number
  cold: number
  activeChains: number
}

defineProps({
  summary: {
    type: Object as PropType<BalanceSummary>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>
