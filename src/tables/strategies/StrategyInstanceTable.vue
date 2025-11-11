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
      <template v-if="column.key === 'name'">
        <span>{{ $t('strategies.instances.name') }}</span>
      </template>
      <template v-else-if="column.key === 'templateName'">
        <span>{{ $t('strategies.instances.template') }}</span>
      </template>
      <template v-else-if="column.key === 'symbol'">
        <span>{{ $t('strategies.instances.symbol') }}</span>
      </template>
      <template v-else-if="column.key === 'status'">
        <span>{{ $t('strategies.instances.status') }}</span>
      </template>
      <template v-else-if="column.key === 'riskLevel'">
        <span>{{ $t('strategies.instances.riskLevel') }}</span>
      </template>
      <template v-else-if="column.key === 'allocatedCapital'">
        <span>{{ $t('strategies.instances.allocatedCapital') }}</span>
      </template>
      <template v-else-if="column.key === 'currentPnl'">
        <span>{{ $t('strategies.instances.currentPnl') }}</span>
      </template>
      <template v-else-if="column.key === 'winRate'">
        <span>{{ $t('strategies.instances.winRate') }}</span>
      </template>
      <template v-else-if="column.key === 'sharpeRatio'">
        <span>{{ $t('strategies.instances.sharpeRatio') }}</span>
      </template>
      <template v-else-if="column.key === 'totalTrades'">
        <span>{{ $t('strategies.instances.totalTrades') }}</span>
      </template>
      <template v-else-if="column.key === 'actions'">
        <span>{{ $t('common.actions') }}</span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <span class="instance-name">{{ record.name }}</span>
      </template>
      <template v-else-if="column.key === 'templateName'">
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
      <template v-else-if="column.key === 'riskLevel'">
        <a-tag :color="getRiskLevelColor(record.riskLevel)">
          {{ getRiskLevelText(record.riskLevel) }}
        </a-tag>
      </template>
      <template v-else-if="column.key === 'allocatedCapital'">
        <span class="capital"> {{ record.allocatedCapital }} {{ record.allocatedCurrency }} </span>
      </template>
      <template v-else-if="column.key === 'currentPnl'">
        <span
          :class="
            record.currentPnl && parseFloat(record.currentPnl) >= 0 ? 'pnl-profit' : 'pnl-loss'
          "
        >
          {{ record.currentPnl }} ({{ record.currentPnlPercent }}%)
        </span>
      </template>
      <template v-else-if="column.key === 'winRate'">
        <span class="win-rate">{{ record.winRate }}%</span>
      </template>
      <template v-else-if="column.key === 'sharpeRatio'">
        <span class="sharpe-ratio">{{ record.sharpeRatio }}</span>
      </template>
      <template v-else-if="column.key === 'totalTrades'">
        <span class="total-trades">{{ record.totalTrades }}</span>
      </template>
      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleView(record)">
            {{ $t('common.view') }}
          </a-button>
          <a-button type="link" size="small" @click="handleEdit(record)">
            {{ $t('common.edit') }}
          </a-button>
          <a-dropdown>
            <a-button type="link" size="small">
              {{ $t('common.more') }}
              <DownOutlined />
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item v-if="record.status === 'running'" @click="handleStop(record)">
                  <StopOutlined />
                  <span>{{ $t('strategies.instances.actions.stop') }}</span>
                </a-menu-item>
                <a-menu-item v-else-if="record.status === 'paused'" @click="handleStart(record)">
                  <PlayCircleOutlined />
                  <span>{{ $t('strategies.instances.actions.start') }}</span>
                </a-menu-item>
                <a-menu-item v-else-if="record.status === 'stopped'" @click="handleStart(record)">
                  <PlayCircleOutlined />
                  <span>{{ $t('strategies.instances.actions.start') }}</span>
                </a-menu-item>
                <a-menu-item v-else-if="record.status === 'running'" @click="handlePause(record)">
                  <PauseCircleOutlined />
                  <span>{{ $t('strategies.instances.actions.pause') }}</span>
                </a-menu-item>
                <a-menu-item :disabled="record.status === 'running'" @click="handleDelete(record)">
                  <DeleteOutlined />
                  <span>{{ $t('common.delete') }}</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-space>
      </template>
    </template>

    <template #expandedRowRender="{ record }">
      <a-descriptions :column="2" size="small" bordered>
        <a-descriptions-item :label="$t('strategies.instances.description')">
          {{ record.description }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('strategies.instances.parameters')">
          <pre>{{ JSON.stringify(record.parameters, null, 2) }}</pre>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('strategies.instances.maxDrawdown')">
          {{ record.maxDrawdown }}%
        </a-descriptions-item>
        <a-descriptions-item :label="$t('strategies.instances.createdBy')">
          {{ record.createdBy }}
        </a-descriptions-item>
      </a-descriptions>
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
  DeleteOutlined,
} from '@ant-design/icons-vue'
import type { StrategyInstance } from '@/contracts/strategies'

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
  (e: 'edit', record: StrategyInstance): void
  (e: 'delete', record: StrategyInstance): void
  (e: 'start', record: StrategyInstance): void
  (e: 'stop', record: StrategyInstance): void
  (e: 'pause', record: StrategyInstance): void
}>()

const columns = computed(() => [
  {
    title: t('strategies.instances.name'),
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    width: 150,
  },
  {
    title: t('strategies.instances.template'),
    dataIndex: 'templateName',
    key: 'templateName',
    width: 180,
  },
  {
    title: t('strategies.instances.symbol'),
    dataIndex: 'symbol',
    key: 'symbol',
    width: 120,
  },
  {
    title: t('strategies.instances.status'),
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: t('strategies.instances.riskLevel'),
    dataIndex: 'riskLevel',
    key: 'riskLevel',
    width: 120,
  },
  {
    title: t('strategies.instances.allocatedCapital'),
    dataIndex: 'allocatedCapital',
    key: 'allocatedCapital',
    width: 150,
  },
  {
    title: t('strategies.instances.currentPnl'),
    dataIndex: 'currentPnl',
    key: 'currentPnl',
    width: 150,
  },
  {
    title: t('strategies.instances.winRate'),
    dataIndex: 'winRate',
    key: 'winRate',
    width: 120,
  },
  {
    title: t('strategies.instances.sharpeRatio'),
    dataIndex: 'sharpeRatio',
    key: 'sharpeRatio',
    width: 120,
  },
  {
    title: t('strategies.instances.totalTrades'),
    dataIndex: 'totalTrades',
    key: 'totalTrades',
    width: 100,
  },
  {
    title: t('common.actions'),
    key: 'actions',
    fixed: 'right',
    width: 150,
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
    running: t('strategies.instances.statuses.running'),
    paused: t('strategies.instances.statuses.paused'),
    stopped: t('strategies.instances.statuses.stopped'),
    error: t('strategies.instances.statuses.error'),
  }
  return textMap[status] || status
}

function getRiskLevelColor(riskLevel: string) {
  const colorMap: Record<string, string> = {
    low: 'green',
    medium: 'orange',
    high: 'red',
  }
  return colorMap[riskLevel] || 'default'
}

function getRiskLevelText(riskLevel: string) {
  const textMap: Record<string, string> = {
    low: t('strategies.instances.riskLevels.low'),
    medium: t('strategies.instances.riskLevels.medium'),
    high: t('strategies.instances.riskLevels.high'),
  }
  return textMap[riskLevel] || riskLevel
}

function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', { pagination, filters, sorter })
}

function handleView(record: StrategyInstance) {
  emit('view', record)
}

function handleEdit(record: StrategyInstance) {
  emit('edit', record)
}

function handleDelete(record: StrategyInstance) {
  emit('delete', record)
}

function handleStart(record: StrategyInstance) {
  emit('start', record)
}

function handleStop(record: StrategyInstance) {
  emit('stop', record)
}

function handlePause(record: StrategyInstance) {
  emit('pause', record)
}
</script>

<style scoped>
.instance-name {
  font-weight: 500;
}

.capital {
  font-weight: 500;
  color: #1890ff;
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

.sharpe-ratio {
  color: #52c41a;
}

.total-trades {
  color: #777;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 400px;
}
</style>
