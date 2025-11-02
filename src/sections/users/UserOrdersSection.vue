<template>
  <div class="user-orders-section">
    <!-- Recent Orders -->
    <a-card title="Recent Orders">
      <a-table
        :columns="orderColumns"
        :data-source="recentOrders"
        :pagination="false"
        :scroll="{ y: 400 }"
        size="small"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'symbol'">
            <span class="symbol">{{ record.symbol }}</span>
          </template>
          <template v-else-if="column.key === 'type'">
            <a-tag :color="record.type === 'spot' ? 'blue' : 'purple'">
              {{ record.type.toUpperCase() }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'side'">
            <a-tag :color="record.side === 'buy' ? 'green' : 'red'">
              {{ record.side.toUpperCase() }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getOrderStatusColor(record.status)">
              {{ getOrderStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'price'">
            {{ record.price || '-' }}
          </template>
          <template v-else-if="column.key === 'quantity'">
            {{ record.quantity }}
          </template>
          <template v-else-if="column.key === 'filled'">
            <a-progress
              :percent="calculateFillPercent(record.filled, record.quantity)"
              :show-info="false"
              size="small"
            />
            <span style="margin-left: 8px">{{ record.filled }}</span>
          </template>
          <template v-else-if="column.key === 'createdAt'">
            {{ formatDate(record.createdAt) }}
          </template>
        </template>
      </a-table>

      <a-empty
        v-if="!recentOrders || recentOrders.length === 0"
        description="No recent orders"
        :image="Empty.PRESENTED_IMAGE_SIMPLE"
      />
    </a-card>

    <!-- Recent Positions (for futures) -->
    <a-card title="Recent Positions" style="margin-top: 16px">
      <a-table
        :columns="positionColumns"
        :data-source="recentPositions"
        :pagination="false"
        size="small"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'symbol'">
            <span class="symbol">{{ record.symbol }}</span>
          </template>
          <template v-else-if="column.key === 'side'">
            <a-tag :color="record.side === 'long' ? 'green' : 'red'">
              {{ record.side.toUpperCase() }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'leverage'">
            <a-tag color="orange">{{ record.leverage }}x</a-tag>
          </template>
          <template v-else-if="column.key === 'unrealizedPnl'">
            <span :class="getPnlClass(record.unrealizedPnl)">
              {{ record.unrealizedPnl }}
            </span>
          </template>
          <template v-else-if="column.key === 'riskRatio'">
            <a-progress
              :percent="record.riskRatio"
              :stroke-color="getRiskColor(record.riskRatio)"
              size="small"
            />
          </template>
        </template>
      </a-table>

      <a-empty
        v-if="!recentPositions || recentPositions.length === 0"
        description="No open positions"
        :image="Empty.PRESENTED_IMAGE_SIMPLE"
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { Empty } from 'ant-design-vue'
import type { UserOrder, UserPosition } from '@/types/models'
import { formatDate } from '@/utils/date'

interface Props {
  recentOrders?: UserOrder[]
  recentPositions?: UserPosition[]
}

withDefaults(defineProps<Props>(), {
  recentOrders: () => [],
  recentPositions: () => [],
})

// Order table columns
const orderColumns = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    width: 120,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 80,
  },
  {
    title: 'Side',
    dataIndex: 'side',
    key: 'side',
    width: 80,
  },
  {
    title: 'Order Type',
    dataIndex: 'orderType',
    key: 'orderType',
    width: 100,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    width: 120,
    align: 'right' as const,
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 120,
    align: 'right' as const,
  },
  {
    title: 'Filled',
    dataIndex: 'filled',
    key: 'filled',
    width: 150,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
  },
]

// Position table columns
const positionColumns = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    width: 120,
  },
  {
    title: 'Side',
    dataIndex: 'side',
    key: 'side',
    width: 80,
  },
  {
    title: 'Leverage',
    dataIndex: 'leverage',
    key: 'leverage',
    width: 80,
  },
  {
    title: 'Entry Price',
    dataIndex: 'entryPrice',
    key: 'entryPrice',
    width: 120,
    align: 'right' as const,
  },
  {
    title: 'Mark Price',
    dataIndex: 'markPrice',
    key: 'markPrice',
    width: 120,
    align: 'right' as const,
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 120,
    align: 'right' as const,
  },
  {
    title: 'Unrealized PnL',
    dataIndex: 'unrealizedPnl',
    key: 'unrealizedPnl',
    width: 150,
    align: 'right' as const,
  },
  {
    title: 'Risk Ratio',
    dataIndex: 'riskRatio',
    key: 'riskRatio',
    width: 150,
  },
  {
    title: 'Liquidation Price',
    dataIndex: 'liquidationPrice',
    key: 'liquidationPrice',
    width: 150,
    align: 'right' as const,
  },
]

// Helper functions
function getOrderStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    partial: 'blue',
    filled: 'green',
    cancelled: 'default',
    rejected: 'red',
  }
  return colorMap[status] || 'default'
}

function getOrderStatusText(status: string): string {
  const textMap: Record<string, string> = {
    pending: 'Pending',
    partial: 'Partial',
    filled: 'Filled',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
  }
  return textMap[status] || status
}

function calculateFillPercent(filled: string, quantity: string): number {
  const filledNum = parseFloat(filled)
  const quantityNum = parseFloat(quantity)
  if (quantityNum === 0) return 0
  return Math.round((filledNum / quantityNum) * 100)
}

function getPnlClass(pnl: string): string {
  const pnlNum = parseFloat(pnl)
  if (pnlNum > 0) return 'pnl-positive'
  if (pnlNum < 0) return 'pnl-negative'
  return 'pnl-neutral'
}

function getRiskColor(ratio: number): string {
  if (ratio >= 80) return '#f5222d'
  if (ratio >= 60) return '#faad14'
  return '#52c41a'
}
</script>

<style scoped>
.user-orders-section {
  /* Styles */
}

.symbol {
  font-weight: 600;
  font-size: 14px;
}

.pnl-positive {
  color: #52c41a;
  font-weight: 600;
}

.pnl-negative {
  color: #f5222d;
  font-weight: 600;
}

.pnl-neutral {
  color: #666;
}
</style>
