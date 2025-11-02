<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :row-selection="rowSelection"
    :enable-export="true"
    :enable-column-config="true"
    row-key="id"
    storage-key="kyc_table_columns"
    @change="handleTableChange"
  >
    <template #toolbar>
      <slot name="toolbar" />
    </template>

    <!-- Status column -->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ getStatusText(record.status) }}
        </a-tag>
      </template>

      <!-- Score column -->
      <template v-else-if="column.key === 'score'">
        <a-progress
          :percent="record.score"
          :stroke-color="getScoreColor(record.score)"
          :show-info="true"
          size="small"
        />
      </template>

      <!-- Matched Rules column -->
      <template v-else-if="column.key === 'matchedRules'">
        <a-space v-if="record.matchedRules && record.matchedRules.length > 0" size="small">
          <a-tag
            v-for="(rule, index) in record.matchedRules.slice(0, 2)"
            :key="index"
            color="orange"
          >
            {{ rule }}
          </a-tag>
          <a-tooltip
            v-if="record.matchedRules.length > 2"
            :title="getRemainingRules(record.matchedRules)"
          >
            <a-tag color="default"> +{{ record.matchedRules.length - 2 }} </a-tag>
          </a-tooltip>
        </a-space>
        <span v-else class="text-muted">-</span>
      </template>

      <!-- Actions column -->
      <template v-else-if="column.key === 'actions'">
        <a-space>
          <a-button type="link" size="small" @click="handleView(record)">View</a-button>
          <RBACGuard :permissions="['kyc.review']">
            <a-button
              v-if="record.status === 'pending'"
              type="link"
              size="small"
              @click="handleReview(record)"
            >
              Review
            </a-button>
          </RBACGuard>
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ServerTable from '@/shared/ServerTable.vue'
import RBACGuard from '@/shared/RBACGuard.vue'
import type { KycApplication } from '@/types/models'
import { formatDate } from '@/utils/date'

interface Props {
  dataSource: KycApplication[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
  selectedRowKeys?: string[]
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'view', record: KycApplication): void
  (e: 'review', record: KycApplication): void
  (e: 'update:selectedRowKeys', keys: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selectedRowKeys: () => [],
})

const emit = defineEmits<Emits>()

// Table columns configuration
const columns = computed(() => [
  {
    title: 'User ID',
    dataIndex: 'userId',
    key: 'userId',
    width: 120,
    fixed: 'left',
    sortable: true,
  },
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
    width: 100,
    filterable: true,
    filterType: 'select',
  },
  {
    title: 'Submission Time',
    dataIndex: 'submittedAt',
    key: 'submittedAt',
    width: 180,
    sortable: true,
    customRender: ({ text }: { text: string }) => formatDate(text),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'Pending', value: 'pending' },
      { label: 'Approved', value: 'approved' },
      { label: 'Rejected', value: 'rejected' },
    ],
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    width: 150,
    sortable: true,
  },
  {
    title: 'Matched Rules',
    dataIndex: 'matchedRules',
    key: 'matchedRules',
    width: 200,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    fixed: 'right',
  },
])

// Row selection configuration
const rowSelection = computed(() => ({
  selectedRowKeys: props.selectedRowKeys,
  onChange: (selectedRowKeys: string[]) => {
    emit('update:selectedRowKeys', selectedRowKeys)
  },
  getCheckboxProps: (record: KycApplication) => ({
    disabled: record.status !== 'pending',
  }),
}))

// Helper functions
function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
  }
  return colorMap[status] || 'default'
}

function getStatusText(status: string): string {
  const textMap: Record<string, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  }
  return textMap[status] || status
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#52c41a'
  if (score >= 60) return '#faad14'
  return '#f5222d'
}

function getRemainingRules(rules: string[]): string {
  return rules.slice(2).join(', ')
}

// Event handlers
function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}

function handleView(record: KycApplication) {
  emit('view', record)
}

function handleReview(record: KycApplication) {
  emit('review', record)
}
</script>

<style scoped>
.text-muted {
  color: #999;
}
</style>
