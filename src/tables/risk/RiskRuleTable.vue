<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :row-selection="rowSelection"
    @change="handleTableChange"
  >
    <template #toolbar>
      <a-space>
        <a-button type="primary" @click="handleCreate">
          <template #icon><PlusOutlined /></template>
          New Rule
        </a-button>
        <a-button @click="handleExport">
          <template #icon><ExportOutlined /></template>
          Export
        </a-button>
        <a-button @click="handleImport">
          <template #icon><ImportOutlined /></template>
          Import
        </a-button>
      </a-space>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a @click="handleView(record)">{{ record.name }}</a>
      </template>

      <template v-else-if="column.key === 'conditions'">
        <a-tag
          v-for="(condition, index) in record.conditions.slice(0, 2)"
          :key="index"
          color="blue"
        >
          {{ condition.field }} {{ condition.operator }} {{ formatValue(condition.value) }}
        </a-tag>
        <a-tag v-if="record.conditions.length > 2" color="default">
          +{{ record.conditions.length - 2 }} more
        </a-tag>
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-tag
          v-for="(action, index) in record.actions.slice(0, 2)"
          :key="index"
          :color="getActionColor(action.type)"
        >
          {{ action.type }}
        </a-tag>
        <a-tag v-if="record.actions.length > 2" color="default">
          +{{ record.actions.length - 2 }} more
        </a-tag>
      </template>

      <template v-else-if="column.key === 'priority'">
        <a-tag :color="getPriorityColor(record.priority)">
          {{ record.priority }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'enabled'">
        <a-switch
          :checked="record.enabled"
          :loading="switchLoading[record.id]"
          @change="(checked) => handleToggleEnabled(record, checked)"
        />
      </template>

      <template v-else-if="column.key === 'status'">
        <a-badge
          :status="record.status === 'published' ? 'success' : 'processing'"
          :text="record.status"
        />
      </template>

      <template v-else-if="column.key === 'operation'">
        <a-space>
          <a @click="handleEdit(record)">Edit</a>
          <a @click="handleSimulate(record)">Simulate</a>
          <a-popconfirm
            title="Are you sure you want to delete this rule?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="handleDelete(record)"
          >
            <a style="color: #ff4d4f">Delete</a>
          </a-popconfirm>
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons-vue'
import ServerTable from '@/shared/ServerTable.vue'
import type { RiskRule } from '@/types/models'
import type { TableColumn } from '@/types/components'

interface Props {
  dataSource: RiskRule[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
  }
}

interface Emits {
  (e: 'change', params: any): void
  (e: 'create'): void
  (e: 'edit', record: RiskRule): void
  (e: 'view', record: RiskRule): void
  (e: 'delete', record: RiskRule): void
  (e: 'simulate', record: RiskRule): void
  (e: 'toggleEnabled', record: RiskRule, enabled: boolean): void
  (e: 'export'): void
  (e: 'import'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  pagination: () => ({
    current: 1,
    pageSize: 20,
    total: 0,
  }),
})

const emit = defineEmits<Emits>()

const switchLoading = ref<Record<string, boolean>>({})

const columns: TableColumn[] = [
  {
    title: 'Rule Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    fixed: 'left',
  },
  {
    title: 'Trigger Conditions',
    dataIndex: 'conditions',
    key: 'conditions',
    width: 300,
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    width: 200,
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    width: 100,
    sorter: true,
  },
  {
    title: 'Enabled',
    dataIndex: 'enabled',
    key: 'enabled',
    width: 100,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
  {
    title: 'Match Count',
    dataIndex: 'matchCount',
    key: 'matchCount',
    width: 120,
    sorter: true,
  },
  {
    title: 'Last Matched',
    dataIndex: 'lastMatchedAt',
    key: 'lastMatchedAt',
    width: 180,
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 180,
    sorter: true,
  },
  {
    title: 'Operation',
    key: 'operation',
    width: 200,
    fixed: 'right',
  },
]

const rowSelection = computed(() => ({
  type: 'checkbox' as const,
  onChange: (selectedRowKeys: string[], selectedRows: RiskRule[]) => {
    console.log('Selected:', selectedRowKeys, selectedRows)
  },
}))

function handleTableChange(params: any) {
  emit('change', params)
}

function handleCreate() {
  emit('create')
}

function handleEdit(record: RiskRule) {
  emit('edit', record)
}

function handleView(record: RiskRule) {
  emit('view', record)
}

function handleDelete(record: RiskRule) {
  emit('delete', record)
}

function handleSimulate(record: RiskRule) {
  emit('simulate', record)
}

async function handleToggleEnabled(record: RiskRule, enabled: boolean) {
  switchLoading.value[record.id] = true
  try {
    emit('toggleEnabled', record, enabled)
  } finally {
    setTimeout(() => {
      switchLoading.value[record.id] = false
    }, 500)
  }
}

function handleExport() {
  emit('export')
}

function handleImport() {
  emit('import')
}

function formatValue(value: any): string {
  if (Array.isArray(value)) {
    return value.length > 2 ? `[${value.slice(0, 2).join(', ')}...]` : `[${value.join(', ')}]`
  }
  if (typeof value === 'object') {
    return JSON.stringify(value).substring(0, 20) + '...'
  }
  return String(value).substring(0, 20)
}

function getActionColor(type: string): string {
  const colors: Record<string, string> = {
    block: 'red',
    review: 'orange',
    alert: 'yellow',
    tag: 'blue',
  }
  return colors[type] || 'default'
}

function getPriorityColor(priority: number): string {
  if (priority >= 90) return 'red'
  if (priority >= 70) return 'orange'
  if (priority >= 50) return 'blue'
  return 'default'
}
</script>
