<template>
  <a-table
    :data-source="dataSource"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
    :scroll="{ x: 1200 }"
    @change="handleTableChange"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>{{ $t('strategies.monitoring.name') }}</span>
      </template>
      <template v-else-if="column.key === 'strategy'">
        <span>{{ $t('strategies.monitoring.strategy') }}</span>
      </template>
      <template v-else-if="column.key === 'symbol'">
        <span>{{ $t('strategies.monitoring.symbol') }}</span>
      </template>
      <template v-else-if="column.key === 'status'">
        <span>{{ $t('strategies.monitoring.status') }}</span>
      </template>
      <template v-else-if="column.key === 'pnl'">
        <span>{{ $t('strategies.monitoring.pnl') }}</span>
      </template>
      <template v-else-if="column.key === 'winRate'">
        <span>{{ $t('strategies.monitoring.winRate') }}</span>
      </template>
      <template v-else-if="column.key === 'totalTrades'">
        <span>{{ $t('strategies.monitoring.totalTrades') }}</span>
      </template>
      <template v-else-if="column.key === 'lastUpdate'">
        <span>{{ $t('strategies.monitoring.lastUpdate') }}</span>
      </template>
      <template v-else-if="column.key === 'actions'">
        <span>{{ $t('common.actions') }}</span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <span class="instance-name">{{ record.name }}</span>
      </template>
      <template v-else-if="column.key === 'strategy'">
        <a-tag color="blue">{{ record.templateName }}</a-tag>
      </template>
      <template v-else-if="column.key === 'symbol'">
        <a-tag color="green">{{ record.symbol }}</a-tag>
      </template>
      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ getStatusText(record.status) }}
        </a-tag>
      </template>
      <template v-else-if="column.key === 'pnl'">
        <span :class="parseFloat(record.currentPnl) >= 0 ? 'pnl-profit' : 'pnl-loss'">
          {{ record.currentPnl }} ({{ record.currentPnlPercent }}%)
        </span>
      </template>
      <template v-else-if="column.key === 'winRate'">
        <span class="win-rate">{{ record.winRate }}%</span>
      </template>
      <template v-else-if="column.key === 'totalTrades'">
        <span class="total-trades">{{ record.totalTrades }}</span>
      </template>
      <template v-else-if="column.key === 'lastUpdate'">
        <span>{{ formatDate(record.updatedAt) }}</span>
      </template>
      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleView(record)">
            {{ $t('common.view') }}
          </a-button>
          <a-dropdown>
            <a-button type="link" size="small">
              {{ $t('common.more') }}
              <DownOutlined />
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item v-if="record.status === 'running'" @click="handlePause(record)">
                  <PauseCircleOutlined />
                  <span>{{ $t('strategies.monitoring.actions.pause') }}</span>
                </a-menu-item>
                <a-menu-item
                  v-if="record.status === 'running' || record.status === 'paused'"
                  @click="handleStop(record)"
                >
                  <StopOutlined />
                  <span>{{ $t('strategies.monitoring.actions.stop') }}</span>
                </a-menu-item>
                <a-menu-item
                  v-if="
                    record.status === 'paused' ||
                    record.status === 'stopped' ||
                    record.status === 'error'
                  "
                  @click="handleRestart(record)"
                >
                  <PlayCircleOutlined />
                  <span>{{ $t('strategies.monitoring.actions.restart') }}</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-space>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  DownOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
} from '@ant-design/icons-vue'
import type { StrategyInstance } from '@/types/models'
import { formatDate } from '@/utils/date'

const { t } = useI18n()

const props = defineProps<{
  dataSource: StrategyInstance[]
  loading: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
  }
}>()

const emit = defineEmits<{
  (e: 'change', pagination: any): void
  (e: 'view', record: StrategyInstance): void
  (e: 'pause', record: StrategyInstance): void
  (e: 'stop', record: StrategyInstance): void
  (e: 'restart', record: StrategyInstance): void
}>()

const columns = computed(() => [
  {
    title: t('strategies.monitoring.name'),
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    width: 150,
  },
  {
    title: t('strategies.monitoring.strategy'),
    dataIndex: 'templateName',
    key: 'strategy',
    width: 180,
  },
  {
    title: t('strategies.monitoring.symbol'),
    dataIndex: 'symbol',
    key: 'symbol',
    width: 120,
  },
  {
    title: t('strategies.monitoring.status'),
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: t('strategies.monitoring.pnl'),
    dataIndex: 'currentPnl',
    key: 'pnl',
    width: 150,
  },
  {
    title: t('strategies.monitoring.winRate'),
    dataIndex: 'winRate',
    key: 'winRate',
    width: 120,
  },
  {
    title: t('strategies.monitoring.totalTrades'),
    dataIndex: 'totalTrades',
    key: 'totalTrades',
    width: 100,
  },
  {
    title: t('strategies.monitoring.lastUpdate'),
    dataIndex: 'updatedAt',
    key: 'lastUpdate',
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
    running: 'green',
    paused: 'orange',
    stopped: 'red',
    error: 'red',
  }
  return colorMap[status] || 'default'
}

function getStatusText(status: string) {
  const textMap: Record<string, string> = {
    running: t('strategies.monitoring.statuses.running'),
    paused: t('strategies.monitoring.statuses.paused'),
    stopped: t('strategies.monitoring.statuses.stopped'),
    error: t('strategies.monitoring.statuses.error'),
  }
  return textMap[status] || status
}

function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', { pagination, filters, sorter })
}

function handleView(record: StrategyInstance) {
  emit('view', record)
}

function handlePause(record: StrategyInstance) {
  emit('pause', record)
}

function handleStop(record: StrategyInstance) {
  emit('stop', record)
}

function handleRestart(record: StrategyInstance) {
  emit('restart', record)
}
</script>

<style scoped>
.instance-name {
  font-weight: 500;
}

.pnl-profit {
  color: #52c41a;
  font-weight: 500;
}

.pnl-loss {
  color: #f5222d;
  font-weight: 500;
}

.win-rate {
  color: #1890ff;
}

.total-trades {
  color: #777;
}
</style>
