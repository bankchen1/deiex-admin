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
        <span>{{ $t('strategies.templates.name') }}</span>
      </template>
      <template v-else-if="column.key === 'category'">
        <span>{{ $t('strategies.templates.category') }}</span>
      </template>
      <template v-else-if="column.key === 'riskLevel'">
        <span>{{ $t('strategies.templates.riskLevel') }}</span>
      </template>
      <template v-else-if="column.key === 'expectedReturn'">
        <span>{{ $t('strategies.templates.expectedReturn') }}</span>
      </template>
      <template v-else-if="column.key === 'maxDrawdown'">
        <span>{{ $t('strategies.templates.maxDrawdown') }}</span>
      </template>
      <template v-else-if="column.key === 'status'">
        <span>{{ $t('strategies.templates.status') }}</span>
      </template>
      <template v-else-if="column.key === 'version'">
        <span>{{ $t('strategies.templates.version') }}</span>
      </template>
      <template v-else-if="column.key === 'createdAt'">
        <span>{{ $t('strategies.templates.createdAt') }}</span>
      </template>
      <template v-else-if="column.key === 'actions'">
        <span>{{ $t('common.actions') }}</span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <span class="template-name">{{ record.name }}</span>
      </template>
      <template v-else-if="column.key === 'category'">
        <a-tag :color="getCategoryColor(record.category)">
          {{ getCategoryText(record.category) }}
        </a-tag>
      </template>
      <template v-else-if="column.key === 'riskLevel'">
        <a-tag :color="getRiskLevelColor(record.riskLevel)">
          {{ getRiskLevelText(record.riskLevel) }}
        </a-tag>
      </template>
      <template v-else-if="column.key === 'expectedReturn'">
        <span class="expected-return">{{ record.expectedReturn }}%</span>
      </template>
      <template v-else-if="column.key === 'maxDrawdown'">
        <span class="max-drawdown">{{ record.maxDrawdown }}%</span>
      </template>
      <template v-else-if="column.key === 'status'">
        <a-tag :color="record.status === 'active' ? 'green' : 'red'">
          {{ record.status === 'active' ? $t('common.active') : $t('common.inactive') }}
        </a-tag>
      </template>
      <template v-else-if="column.key === 'version'">
        <span class="version">{{ record.version }}</span>
      </template>
      <template v-else-if="column.key === 'createdAt'">
        <span>{{ formatDate(record.createdAt) }}</span>
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
                <a-menu-item @click="handleClone(record)">
                  <span>{{ $t('strategies.templates.clone') }}</span>
                </a-menu-item>
                <a-menu-item :disabled="record.status === 'active'" @click="handleDelete(record)">
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
        <a-descriptions-item :label="$t('strategies.templates.description')">
          {{ record.description }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('strategies.templates.parameters')">
          <pre>{{ JSON.stringify(record.parameters, null, 2) }}</pre>
        </a-descriptions-item>
      </a-descriptions>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { DownOutlined } from '@ant-design/icons-vue'
import type { StrategyTemplate } from '@/types/models'
import { formatDate } from '@/utils/date'

const { t } = useI18n()

const props = defineProps<{
  dataSource: StrategyTemplate[]
  loading: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
  }
}>()

const emit = defineEmits<{
  (e: 'change', pagination: any): void
  (e: 'view', record: StrategyTemplate): void
  (e: 'edit', record: StrategyTemplate): void
  (e: 'delete', record: StrategyTemplate): void
  (e: 'clone', record: StrategyTemplate): void
}>()

const columns = computed(() => [
  {
    title: t('strategies.templates.name'),
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    width: 200,
  },
  {
    title: t('strategies.templates.category'),
    dataIndex: 'category',
    key: 'category',
    width: 150,
  },
  {
    title: t('strategies.templates.riskLevel'),
    dataIndex: 'riskLevel',
    key: 'riskLevel',
    width: 120,
  },
  {
    title: t('strategies.templates.expectedReturn') + ' (%)',
    dataIndex: 'expectedReturn',
    key: 'expectedReturn',
    width: 120,
  },
  {
    title: t('strategies.templates.maxDrawdown') + ' (%)',
    dataIndex: 'maxDrawdown',
    key: 'maxDrawdown',
    width: 120,
  },
  {
    title: t('strategies.templates.status'),
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: t('strategies.templates.version'),
    dataIndex: 'version',
    key: 'version',
    width: 100,
  },
  {
    title: t('strategies.templates.createdAt'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
  },
  {
    title: t('common.actions'),
    key: 'actions',
    fixed: 'right',
    width: 150,
  },
])

function getCategoryColor(category: string) {
  const colorMap: Record<string, string> = {
    trend: 'blue',
    'mean-reversion': 'green',
    arbitrage: 'purple',
    'market-making': 'orange',
    other: 'gray',
  }
  return colorMap[category] || 'default'
}

function getCategoryText(category: string) {
  const textMap: Record<string, string> = {
    trend: t('strategies.templates.categories.trend'),
    'mean-reversion': t('strategies.templates.categories.meanReversion'),
    arbitrage: t('strategies.templates.categories.arbitrage'),
    'market-making': t('strategies.templates.categories.marketMaking'),
    other: t('strategies.templates.categories.other'),
  }
  return textMap[category] || category
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
    low: t('strategies.templates.riskLevels.low'),
    medium: t('strategies.templates.riskLevels.medium'),
    high: t('strategies.templates.riskLevels.high'),
  }
  return textMap[riskLevel] || riskLevel
}

function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', { pagination, filters, sorter })
}

function handleView(record: StrategyTemplate) {
  emit('view', record)
}

function handleEdit(record: StrategyTemplate) {
  emit('edit', record)
}

function handleDelete(record: StrategyTemplate) {
  emit('delete', record)
}

function handleClone(record: StrategyTemplate) {
  emit('clone', record)
}
</script>

<style scoped>
.template-name {
  font-weight: 500;
}

.expected-return {
  color: #52c41a;
}

.max-drawdown {
  color: #f5222d;
}

.version {
  font-family: monospace;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 400px;
}
</style>
