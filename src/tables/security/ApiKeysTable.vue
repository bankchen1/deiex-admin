<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a @click="handleView(record)">{{ record.name }}</a>
      </template>

      <template v-else-if="column.key === 'key'">
        <a-typography-text copyable :ellipsis="true" style="max-width: 200px">
          {{ record.key }}
        </a-typography-text>
      </template>

      <template v-else-if="column.key === 'permissions'">
        <a-tooltip>
          <template #title>
            <div v-for="perm in record.permissions" :key="perm">{{ perm }}</div>
          </template>
          <a-tag color="blue">{{ record.permissions.length }} permissions</a-tag>
        </a-tooltip>
      </template>

      <template v-else-if="column.key === 'status'">
        <a-badge
          :status="record.status === 'active' ? 'success' : 'default'"
          :text="record.status === 'active' ? 'Active' : 'Disabled'"
        />
      </template>

      <template v-else-if="column.key === 'lastUsedAt'">
        <span v-if="record.lastUsedAt">{{ formatDate(record.lastUsedAt) }}</span>
        <span v-else style="color: #999">Never</span>
      </template>

      <template v-else-if="column.key === 'expiresAt'">
        <span v-if="record.expiresAt">
          {{ formatDate(record.expiresAt) }}
          <a-tag v-if="isExpired(record.expiresAt)" color="red">Expired</a-tag>
        </span>
        <span v-else>Never</span>
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <RBACGuard permissions="security.api-keys.regenerate">
            <ConfirmButton
              type="link"
              size="small"
              title="Regenerate API Key"
              description="This will generate a new key and invalidate the old one. Are you sure?"
              @confirm="handleRegenerate(record)"
            >
              Regenerate
            </ConfirmButton>
          </RBACGuard>
          <RBACGuard permissions="security.api-keys.revoke">
            <ConfirmButton
              type="link"
              size="small"
              danger
              title="Revoke API Key"
              :description="`Are you sure you want to revoke API key '${record.name}'?`"
              @confirm="handleRevoke(record)"
            >
              Revoke
            </ConfirmButton>
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
import ConfirmButton from '@/shared/ConfirmButton.vue'
import { formatDate } from '@/utils/date'
import type { ApiKey } from '@/services/api/config.security'
import type { TableColumn } from '@/types/components'

interface Props {
  dataSource: ApiKey[]
  loading?: boolean
  pagination?: any
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'view', record: ApiKey): void
  (e: 'regenerate', record: ApiKey): void
  (e: 'revoke', record: ApiKey): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const columns = computed<TableColumn[]>(() => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: 'API Key',
    dataIndex: 'key',
    key: 'key',
    width: 250,
  },
  {
    title: 'Permissions',
    dataIndex: 'permissions',
    key: 'permissions',
    width: 150,
    align: 'center',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    align: 'center',
  },
  {
    title: 'Last Used',
    dataIndex: 'lastUsedAt',
    key: 'lastUsedAt',
    width: 180,
  },
  {
    title: 'Expires At',
    dataIndex: 'expiresAt',
    key: 'expiresAt',
    width: 180,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    fixed: 'right',
  },
])

function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}

function handleView(record: ApiKey) {
  emit('view', record)
}

function handleRegenerate(record: ApiKey) {
  emit('regenerate', record)
}

function handleRevoke(record: ApiKey) {
  emit('revoke', record)
}

function isExpired(expiresAt: string) {
  return new Date(expiresAt) < new Date()
}
</script>
