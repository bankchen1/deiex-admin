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
      <template v-if="column.key === 'username'">
        <a @click="handleView(record)">{{ record.username }}</a>
      </template>

      <template v-else-if="column.key === 'roles'">
        <a-space wrap>
          <a-tag v-for="role in record.roles" :key="role" color="blue">
            {{ role }}
          </a-tag>
        </a-space>
      </template>

      <template v-else-if="column.key === 'status'">
        <a-badge
          :status="record.status === 'active' ? 'success' : 'default'"
          :text="record.status === 'active' ? 'Active' : 'Disabled'"
        />
      </template>

      <template v-else-if="column.key === 'lastLoginAt'">
        {{ formatDate(record.lastLoginAt) }}
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <RBACGuard permissions="security.admin-users.edit">
            <a-button type="link" size="small" @click="handleEdit(record)"> Edit </a-button>
          </RBACGuard>
          <RBACGuard permissions="security.admin-users.reset-password">
            <a-button type="link" size="small" @click="handleResetPassword(record)">
              Reset Password
            </a-button>
          </RBACGuard>
          <RBACGuard permissions="security.admin-users.disable">
            <a-button
              v-if="record.status === 'active'"
              type="link"
              size="small"
              danger
              @click="handleDisable(record)"
            >
              Disable
            </a-button>
            <a-button v-else type="link" size="small" @click="handleEnable(record)">
              Enable
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
import { formatDate } from '@/utils/date'
import type { AdminUser } from '@/services/api/config.security'
import type { TableColumn } from '@/types/components'

interface Props {
  dataSource: AdminUser[]
  loading?: boolean
  pagination?: any
  rowSelection?: any
}

interface Emits {
  (e: 'change', pagination: any, filters: any, sorter: any): void
  (e: 'view', record: AdminUser): void
  (e: 'edit', record: AdminUser): void
  (e: 'disable', record: AdminUser): void
  (e: 'enable', record: AdminUser): void
  (e: 'resetPassword', record: AdminUser): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const columns = computed<TableColumn[]>(() => [
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
    width: 150,
    sortable: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 200,
  },
  {
    title: 'Roles',
    dataIndex: 'roles',
    key: 'roles',
    width: 200,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    align: 'center',
  },
  {
    title: 'Last Login',
    dataIndex: 'lastLoginAt',
    key: 'lastLoginAt',
    width: 180,
    sortable: true,
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
    width: 280,
    fixed: 'right',
  },
])

function handleTableChange(pagination: any, filters: any, sorter: any) {
  emit('change', pagination, filters, sorter)
}

function handleView(record: AdminUser) {
  emit('view', record)
}

function handleEdit(record: AdminUser) {
  emit('edit', record)
}

function handleDisable(record: AdminUser) {
  emit('disable', record)
}

function handleEnable(record: AdminUser) {
  emit('enable', record)
}

function handleResetPassword(record: AdminUser) {
  emit('resetPassword', record)
}
</script>
