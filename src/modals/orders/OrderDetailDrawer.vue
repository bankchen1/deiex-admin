<template>
  <a-drawer
    :open="open"
    :title="`Order Details - ${order?.id || ''}`"
    width="720"
    @close="handleClose"
  >
    <a-spin :spinning="loading">
      <div v-if="order" class="order-detail">
        <!-- Basic Information -->
        <a-card title="Basic Information" :bordered="false" class="detail-card">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="Order ID">
              {{ order.id }}
            </a-descriptions-item>
            <a-descriptions-item label="User ID">
              <a @click="handleViewUser(order.userId)">{{ order.userId }}</a>
            </a-descriptions-item>
            <a-descriptions-item label="Nickname">
              {{ order.userNickname || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="Type">
              <a-tag>{{ order.type.toUpperCase() }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Symbol">
              <strong>{{ order.symbol }}</strong>
            </a-descriptions-item>
            <a-descriptions-item label="Direction">
              <a-tag :color="order.side === 'buy' ? 'green' : 'red'">
                {{ order.side === 'buy' ? 'Buy' : 'Sell' }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Order Type">
              {{ formatOrderType(order.orderType) }}
            </a-descriptions-item>
            <a-descriptions-item label="Status">
              <a-tag :color="getStatusColor(order.status)">
                {{ formatStatus(order.status) }}
              </a-tag>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- Order Details -->
        <a-card title="Order Details" :bordered="false" class="detail-card">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="Price">
              {{ order.price ? formatNumber(order.price, 8) : 'Market' }}
            </a-descriptions-item>
            <a-descriptions-item label="Quantity">
              {{ formatNumber(order.quantity, 8) }}
            </a-descriptions-item>
            <a-descriptions-item label="Filled">
              {{ formatNumber(order.filled, 8) }}
            </a-descriptions-item>
            <a-descriptions-item label="Fill Percentage">
              {{ getFilledPercent(order) }}%
            </a-descriptions-item>
            <a-descriptions-item label="Total Value" :span="2">
              {{
                order.price
                  ? formatNumber(
                      (parseFloat(order.price) * parseFloat(order.quantity)).toString(),
                      8
                    )
                  : '-'
              }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- Futures Specific (if applicable) -->
        <a-card
          v-if="isFuturesOrder(order)"
          title="Futures Details"
          :bordered="false"
          class="detail-card"
        >
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="Leverage"> {{ order.leverage }}x </a-descriptions-item>
            <a-descriptions-item label="Margin Mode">
              <a-tag>{{ order.marginMode === 'isolated' ? 'Isolated' : 'Cross' }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Position Side">
              <a-tag :color="order.positionSide === 'long' ? 'green' : 'red'">
                {{ order.positionSide === 'long' ? 'Long' : 'Short' }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Reduce Only">
              {{ order.reduceOnly ? 'Yes' : 'No' }}
            </a-descriptions-item>
            <a-descriptions-item label="Liquidation Price">
              {{ order.liquidationPrice ? formatNumber(order.liquidationPrice, 8) : '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="Funding Impact">
              {{ order.fundingImpact ? formatNumber(order.fundingImpact, 8) : '-' }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- Performance & Error -->
        <a-card title="Performance & Error" :bordered="false" class="detail-card">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="Matching Latency">
              {{ order.matchingLatency ? `${order.matchingLatency.toFixed(2)} ms` : '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="Error Code">
              <a-tag v-if="order.errorCode" color="red">{{ order.errorCode }}</a-tag>
              <span v-else>-</span>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <!-- Timestamps -->
        <a-card title="Timestamps" :bordered="false" class="detail-card">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="Created At">
              {{ formatDate(order.createdAt) }}
            </a-descriptions-item>
            <a-descriptions-item label="Updated At">
              {{ formatDate(order.updatedAt) }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </div>
    </a-spin>
  </a-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Order, FuturesOrder } from '@/services/api/facade'
import { formatDate } from '@/utils/date'
import { formatNumber } from '@/utils/format'

interface Props {
  open: boolean
  order: Order | FuturesOrder | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'view-user', userId: string): void
}>()

function handleClose() {
  emit('close')
}

function handleViewUser(userId: string) {
  emit('view-user', userId)
}

function isFuturesOrder(order: Order | FuturesOrder): order is FuturesOrder {
  return order.type === 'futures' && 'leverage' in order
}

function formatOrderType(type: string): string {
  const typeMap: Record<string, string> = {
    limit: 'Limit',
    market: 'Market',
    'stop-limit': 'Stop Limit',
    'stop-market': 'Stop Market',
  }
  return typeMap[type] || type
}

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    partial: 'Partial',
    filled: 'Filled',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
  }
  return statusMap[status] || status
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'blue',
    partial: 'orange',
    filled: 'green',
    cancelled: 'default',
    rejected: 'red',
  }
  return colorMap[status] || 'default'
}

function getFilledPercent(order: Order | FuturesOrder): string {
  const percent = (parseFloat(order.filled) / parseFloat(order.quantity)) * 100
  return percent.toFixed(2)
}
</script>

<style scoped>
.order-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-card {
  margin-bottom: 0;
}

.detail-card :deep(.ant-card-head) {
  min-height: 40px;
  padding: 0 16px;
}

.detail-card :deep(.ant-card-body) {
  padding: 16px;
}
</style>
