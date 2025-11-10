<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'ip'">
        <a-typography-text copyable>{{ record.ip }}</a-typography-text>
      </template>

      <template v-else-if="column.key === 'adminName'">
        {{ record.adminName }}
      </template>

      <template v-else-if="column.key === 'createdAt'">
        {{ formatDate(record.createdAt) }}
      </template>

      <template v-else-if="column.key === 'expiresAt'">
        <span v-if="record.expiresAt">
          {{ formatDate(record.expiresAt) }}
          <a-tag v-if="isExpired(record.expiresAt)" color="red">Expired</a-tag>
        </span>
        <span v-else>Never</span>
      </template>

      <template v-else-if="column.key === 'actions'">
        <RBACGuard permissions="security.ip-whitelist.delete">
          <ConfirmButton
            type="link"
            size="small"
            danger
            title="Remove IP"
            :description="`Are you sure you want to remove IP '${record.ip}' from whitelist?`"
            @confirm="handleRemove(record)"
          >
            Remove
          </ConfirmButton>
        </RBACGuard>
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
import type { IpWhitelistEntry } from '@/services/api/facade'
import type { TableColumn } from '@/types/components'

interface Props {
  dataSource: IpWhitelistEntry[]
  loading?: boolean
  pagination?: any
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'remove', record: IpWhitelistEntry): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const columns = computed<TableColumn[]>(() => [
  {
    title: 'IP Address',
    dataIndex: 'ip',
    key: 'ip',
    width: 200,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: 'Added By',
    dataIndex: 'adminName',
    key: 'adminName',
    width: 150,
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
    sortable: true,
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
    width: 120,
    fixed: 'right',
  },
])

function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}

function handleRemove(record: IpWhitelistEntry) {
  emit('remove', record)
}

function isExpired(expiresAt: string) {
  return new Date(expiresAt) < new Date()
}
</script>
