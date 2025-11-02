<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :row-selection="rowSelection"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a @click="handleView(record)">{{ record.name }}</a>
      </template>

      <template v-else-if="column.key === 'permissions'">
        <a-tooltip>
          <template #title>
            <div v-for="perm in record.permissions" :key="perm">{{ perm }}</div>
          </template>
          <a-tag color="blue">{{ record.permissions.length }} permissions</a-tag>
        </a-tooltip>
      </template>

      <template v-else-if="column.key === 'createdAt'">
        {{ formatDate(record.createdAt) }}
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <RBACGuard permissions="security.roles.edit">
            <a-button type="link" size="small" @click="handleEdit(record)"> Edit </a-button>
          </RBACGuard>
          <RBACGuard permissions="security.roles.assign">
            <a-button type="link" size="small" @click="handleAssignPermissions(record)">
              Permissions
            </a-button>
          </RBACGuard>
          <RBACGuard permissions="security.roles.delete">
            <ConfirmButton
              type="link"
              size="small"
              danger
              title="Delete Role"
              :description="`Are you sure you want to delete role '${record.name}'?`"
              @confirm="handleDelete(record)"
            >
              Delete
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
import type { Role } from '@/services/api/config.security'
import type { TableColumn } from '@/types/components'

interface Props {
  dataSource: Role[]
  loading?: boolean
  pagination?: any
  rowSelection?: any
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'view', record: Role): void
  (e: 'edit', record: Role): void
  (e: 'delete', record: Role): void
  (e: 'assignPermissions', record: Role): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const columns = computed<TableColumn[]>(() => [
  {
    title: 'Role Name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    sortable: true,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: 'Permissions',
    dataIndex: 'permissions',
    key: 'permissions',
    width: 150,
    align: 'center',
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180,
    sortable: true,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 250,
    fixed: 'right',
  },
])

function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}

function handleView(record: Role) {
  emit('view', record)
}

function handleEdit(record: Role) {
  emit('edit', record)
}

function handleDelete(record: Role) {
  emit('delete', record)
}

function handleAssignPermissions(record: Role) {
  emit('assignPermissions', record)
}
</script>
