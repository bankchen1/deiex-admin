<template>
  <div class="user-assets-section">
    <!-- Asset Summary -->
    <a-card title="Asset Summary" style="margin-bottom: 16px">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-statistic
            title="Total Assets (USD)"
            :value="assetSnapshot.totalUsd"
            :precision="2"
            prefix="$"
          />
        </a-col>
        <a-col :span="8">
          <a-statistic
            title="Available (USD)"
            :value="assetSnapshot.availableUsd"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#52c41a' }"
          />
        </a-col>
        <a-col :span="8">
          <a-statistic
            title="Frozen (USD)"
            :value="assetSnapshot.frozenUsd"
            :precision="2"
            prefix="$"
            :value-style="{ color: '#faad14' }"
          />
        </a-col>
      </a-row>
    </a-card>

    <!-- Currency Balances -->
    <a-card title="Currency Balances">
      <a-table
        :columns="balanceColumns"
        :data-source="balanceData"
        :pagination="false"
        :scroll="{ y: 400 }"
        size="small"
        row-key="currency"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'currency'">
            <span class="currency-name">{{ record.currency }}</span>
          </template>
          <template v-else-if="column.key === 'available'">
            <span class="balance-value">{{ record.available }}</span>
          </template>
          <template v-else-if="column.key === 'frozen'">
            <span class="balance-value frozen">{{ record.frozen }}</span>
          </template>
          <template v-else-if="column.key === 'usdValue'">
            <span class="usd-value">{{ formatCurrency(record.usdValue) }}</span>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Chain Addresses -->
    <a-card title="Chain Addresses" style="margin-top: 16px">
      <a-table
        :columns="addressColumns"
        :data-source="chainAddresses"
        :pagination="false"
        size="small"
        row-key="address"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'address'">
            <a-typography-text copyable>
              {{ record.address }}
            </a-typography-text>
          </template>
          <template v-else-if="column.key === 'createdAt'">
            {{ formatDate(record.createdAt) }}
          </template>
        </template>
      </a-table>

      <a-empty
        v-if="!chainAddresses || chainAddresses.length === 0"
        description="No chain addresses"
        :image="Empty.PRESENTED_IMAGE_SIMPLE"
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Empty } from 'ant-design-vue'
import type { AssetSnapshot, ChainAddress } from '@/types/models'
import { formatCurrency } from '@/utils/format'
import { formatDate } from '@/utils/date'

interface Props {
  assetSnapshot: AssetSnapshot
  chainAddresses?: ChainAddress[]
}

const props = withDefaults(defineProps<Props>(), {
  chainAddresses: () => [],
})

// Balance table columns
const balanceColumns = [
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
    width: 120,
  },
  {
    title: 'Available',
    dataIndex: 'available',
    key: 'available',
    width: 200,
    align: 'right' as const,
  },
  {
    title: 'Frozen',
    dataIndex: 'frozen',
    key: 'frozen',
    width: 200,
    align: 'right' as const,
  },
  {
    title: 'USD Value',
    dataIndex: 'usdValue',
    key: 'usdValue',
    width: 150,
    align: 'right' as const,
  },
]

// Address table columns
const addressColumns = [
  {
    title: 'Chain',
    dataIndex: 'chain',
    key: 'chain',
    width: 120,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
  },
]

// Convert currencies object to array for table
const balanceData = computed(() => {
  if (!props.assetSnapshot.currencies) return []

  return Object.entries(props.assetSnapshot.currencies).map(([currency, balance]) => ({
    currency,
    available: balance.available,
    frozen: balance.frozen,
    usdValue: balance.usdValue,
  }))
})
</script>

<style scoped>
.user-assets-section {
  /* Styles */
}

.currency-name {
  font-weight: 600;
  font-size: 14px;
}

.balance-value {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
}

.balance-value.frozen {
  color: #faad14;
}

.usd-value {
  color: #1890ff;
  font-weight: 500;
}
</style>
