<template>
  <a-table
    :data-source="dataSource"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
    :scroll="{ x: 1400 }"
    @change="handleTableChange"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'strategyName'">
        <span>{{ $t('strategies.backtest.strategyName') }}</span>
      </template>
      <template v-else-if="column.key === 'symbol'">
        <span>{{ $t('strategies.backtest.symbol') }}</span>
      </template>
      <template v-else-if="column.key === 'timeRange'">
        <span>{{ $t('strategies.backtest.timeRange') }}</span>
      </template>
      <template v-else-if="column.key === 'initialCapital'">
        <span>{{ $t('strategies.backtest.initialCapital') }}</span>
      </template>
      <template v-else-if="column.key === 'finalCapital'">
        <span>{{ $t('strategies.backtest.finalCapital') }}</span>
      </template>
      <template v-else-if="column.key === 'totalReturn'">
        <span>{{ $t('strategies.backtest.totalReturn') }}</span>
      </template>
      <template v-else-if="column.key === 'maxDrawdown'">
        <span>{{ $t('strategies.backtest.maxDrawdown') }}</span>
      </template>
      <template v-else-if="column.key === 'sharpeRatio'">
        <span>{{ $t('strategies.backtest.sharpeRatio') }}</span>
      </template>
      <template v-else-if="column.key === 'winRate'">
        <span>{{ $t('strategies.backtest.winRate') }}</span>
      </template>
      <template v-else-if="column.key === 'totalTrades'">
        <span>{{ $t('strategies.backtest.totalTrades') }}</span>
      </template>
      <template v-else-if="column.key === 'status'">
        <span>{{ $t('strategies.backtest.status') }}</span>
      </template>
      <template v-else-if="column.key === 'createdAt'">
        <span>{{ $t('strategies.backtest.createdAt') }}</span>
      </template>
      <template v-else-if="column.key === 'actions'">
        <span>{{ $t('common.actions') }}</span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'strategyName'">
        <span class="strategy-name">{{ record.strategyName }}</span>
      </template>
      <template v-else-if="column.key === 'symbol'">
        <a-tag color="green">{{ record.symbol }}</a-tag>
      </template>
      <template v-else-if="column.key === 'timeRange'">
        <div class="time-range">
          <div>{{ formatDate(record.startTime) }}</div>
          <div>{{ formatDate(record.endTime) }}</div>
        </div>
      </template>
      <template v-else-if="column.key === 'initialCapital'">
        <span class="capital">{{ record.initialCapital }}</span>
      </template>
      <template v-else-if="column.key === 'finalCapital'">
        <span
          :class="
            parseFloat(record.finalCapital) >= parseFloat(record.initialCapital)
              ? 'capital-profit'
              : 'capital-loss'
          "
        >
          {{ record.finalCapital }}
        </span>
      </template>
      <template v-else-if="column.key === 'totalReturn'">
        <span :class="parseFloat(record.totalReturn) >= 0 ? 'return-profit' : 'return-loss'">
          {{ record.totalReturn }} ({{ record.totalReturnPercent }}%)
        </span>
      </template>
      <template v-else-if="column.key === 'maxDrawdown'">
        <span class="drawdown">{{ record.maxDrawdown }}%</span>
      </template>
      <template v-else-if="column.key === 'sharpeRatio'">
        <span class="sharpe-ratio">{{ record.sharpeRatio }}</span>
      </template>
      <template v-else-if="column.key === 'winRate'">
        <span class="win-rate">{{ record.winRate }}%</span>
      </template>
      <template v-else-if="column.key === 'totalTrades'">
        <span class="total-trades">{{ record.totalTrades }}</span>
      </template>
      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ getStatusText(record.status) }}
        </a-tag>
      </template>
      <template v-else-if="column.key === 'createdAt'">
        <span>{{ formatDate(record.createdAt) }}</span>
      </template>
      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleView(record)">
            {{ $t('common.view') }}
          </a-button>
          <a-button type="link" size="small" @click="handleDelete(record)">
            {{ $t('common.delete') }}
          </a-button>
        </a-space>
      </template>
    </template>

    <template #expandedRowRender="{ record }">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" :tab="$t('strategies.backtest.details')">
          <a-descriptions :column="2" size="small" bordered>
            <a-descriptions-item :label="$t('strategies.backtest.profitableTrades')">
              {{ record.profitableTrades }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('strategies.backtest.avgTradeReturn')">
              {{ record.avgTradeReturn }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('strategies.backtest.maxConsecutiveWins')">
              {{ record.maxConsecutiveWins }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('strategies.backtest.maxConsecutiveLosses')">
              {{ record.maxConsecutiveLosses }}
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('strategies.backtest.parameters')">
          <pre>{{ JSON.stringify(record.parameters, null, 2) }}</pre>
        </a-tab-pane>
      </a-tabs>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BacktestResult } from '@/types/models'
import { formatDate } from '@/utils/date'

const { t } = useI18n()

const props = defineProps<{
  dataSource: BacktestResult[]
  loading: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
  }
}>()

const emit = defineEmits<{
  (e: 'change', pagination: any): void
  (e: 'view', record: BacktestResult): void
  (e: 'delete', record: BacktestResult): void
}>()

const columns = computed(() => [
  {
    title: t('strategies.backtest.strategyName'),
    dataIndex: 'strategyName',
    key: 'strategyName',
    fixed: 'left',
    width: 180,
  },
  {
    title: t('strategies.backtest.symbol'),
    dataIndex: 'symbol',
    key: 'symbol',
    width: 120,
  },
  {
    title: t('strategies.backtest.timeRange'),
    key: 'timeRange',
    width: 200,
  },
  {
    title: t('strategies.backtest.initialCapital'),
    dataIndex: 'initialCapital',
    key: 'initialCapital',
    width: 120,
  },
  {
    title: t('strategies.backtest.finalCapital'),
    dataIndex: 'finalCapital',
    key: 'finalCapital',
    width: 120,
  },
  {
    title: t('strategies.backtest.totalReturn'),
    dataIndex: 'totalReturn',
    key: 'totalReturn',
    width: 150,
  },
  {
    title: t('strategies.backtest.maxDrawdown'),
    dataIndex: 'maxDrawdown',
    key: 'maxDrawdown',
    width: 120,
  },
  {
    title: t('strategies.backtest.sharpeRatio'),
    dataIndex: 'sharpeRatio',
    key: 'sharpeRatio',
    width: 120,
  },
  {
    title: t('strategies.backtest.winRate'),
    dataIndex: 'winRate',
    key: 'winRate',
    width: 120,
  },
  {
    title: t('strategies.backtest.totalTrades'),
    dataIndex: 'totalTrades',
    key: 'totalTrades',
    width: 100,
  },
  {
    title: t('strategies.backtest.status'),
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: t('strategies.backtest.createdAt'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
  },
  {
    title: t('common.actions'),
    key: 'actions',
    fixed: 'right',
    width: 120,
  },
])

function getStatusColor(status: string) {
  const colorMap: Record<string, string> = {
    completed: 'green',
    running: 'orange',
    failed: 'red',
  }
  return colorMap[status] || 'default'
}

function getStatusText(status: string) {
  const textMap: Record<string, string> = {
    completed: t('strategies.backtest.statuses.completed'),
    running: t('strategies.backtest.statuses.running'),
    failed: t('strategies.backtest.statuses.failed'),
  }
  return textMap[status] || status
}

function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', { pagination, filters, sorter })
}

function handleView(record: BacktestResult) {
  emit('view', record)
}

function handleDelete(record: BacktestResult) {
  emit('delete', record)
}
</script>

<style scoped>
.strategy-name {
  font-weight: 500;
}

.time-range div:first-child {
  color: #999;
  font-size: 12px;
}

.time-range div:last-child {
  color: #999;
  font-size: 12px;
}

.capital {
  font-weight: 500;
  color: #1890ff;
}

.capital-profit {
  font-weight: 500;
  color: #52c41a;
}

.capital-loss {
  font-weight: 500;
  color: #f5222d;
}

.return-profit {
  color: #52c41a;
  font-weight: 500;
}

.return-loss {
  color: #f5222d;
  font-weight: 500;
}

.drawdown {
  color: #f5222d;
}

.sharpe-ratio {
  color: #1890ff;
}

.win-rate {
  color: #52c41a;
}

.total-trades {
  color: #777;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 600px;
}
</style>
