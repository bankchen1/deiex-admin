<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="{
      current: pagination.page,
      pageSize: pagination.pageSize,
      total: total,
    }"
    :row-selection="{
      selectedRowKeys: selectedKeys,
      onChange: handleSelectionChange,
    }"
    :enable-export="true"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'title'">
        <a-space direction="vertical" :size="0">
          <a-typography-text strong>{{ record.title.en }}</a-typography-text>
          <a-typography-text type="secondary" style="font-size: 12px">
            {{ record.title.zh || 'No Chinese translation' }}
          </a-typography-text>
        </a-space>
      </template>

      <template v-else-if="column.key === 'type'">
        <a-tag :color="getTypeColor(record.type)">
          {{ record.type }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'pinned'">
        <a-tag :color="record.pinned ? 'gold' : 'default'">
          <PushpinOutlined v-if="record.pinned" />
          {{ record.pinned ? 'Pinned' : 'Normal' }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'pushChannels'">
        <a-space>
          <a-tag v-for="channel in record.pushChannels" :key="channel" size="small">
            {{ channel }}
          </a-tag>
        </a-space>
      </template>

      <template v-else-if="column.key === 'publishTime'">
        <a-space direction="vertical" :size="0">
          <span>{{ formatDateTime(record.publishTime) }}</span>
          <a-tag v-if="isScheduled(record.publishTime)" color="orange" size="small">
            <ClockCircleOutlined />
            Scheduled
          </a-tag>
          <a-tag v-else color="success" size="small">
            <CheckCircleOutlined />
            Published
          </a-tag>
        </a-space>
      </template>

      <template v-else-if="column.key === 'languages'">
        <a-space>
          <a-tag v-if="record.title.en" size="small">EN</a-tag>
          <a-tag v-if="record.title.zh" size="small">ZH</a-tag>
          <a-tag v-if="record.title.ja" size="small">JA</a-tag>
          <a-tag v-if="record.title.ko" size="small">KO</a-tag>
        </a-space>
      </template>

      <template v-else-if="column.key === 'actions'">
        <a-space>
          <RBACGuard :permissions="['config.calendar.view']">
            <a-button type="link" size="small" @click="emit('view', record)">View</a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.calendar.edit']">
            <a-button type="link" size="small" @click="emit('edit', record)">Edit</a-button>
          </RBACGuard>
          <RBACGuard :permissions="['config.calendar.delete']">
            <a-popconfirm
              title="Are you sure you want to delete this announcement?"
              ok-text="Delete"
              cancel-text="Cancel"
              @confirm="emit('delete', record)"
            >
              <a-button type="link" size="small" danger>Delete</a-button>
            </a-popconfirm>
          </RBACGuard>
        </a-space>
      </template>
    </template>
  </ServerTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ClockCircleOutlined, CheckCircleOutlined, PushpinOutlined } from '@ant-design/icons-vue'
import ServerTable from '@/shared/ServerTable.vue'
import RBACGuard from '@/shared/RBACGuard.vue'
import { formatDateTime } from '@/utils/date'
import type { Announcement } from '@/contracts/calendar'
import type { TableParams } from '@/types/components'

interface Props {
  dataSource: Announcement[]
  loading?: boolean
  total?: number
}

interface Emits {
  (e: 'edit', record: Announcement): void
  (e: 'delete', record: Announcement): void
  (e: 'view', record: Announcement): void
  (e: 'fetch', params: TableParams): void
  (e: 'selection-change', keys: string[], rows: Announcement[]): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  total: 0,
})

const emit = defineEmits<Emits>()

const pagination = ref({
  page: 1,
  pageSize: 20,
})

const selectedKeys = ref<string[]>([])

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: 250,
    sortable: true,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 120,
  },
  {
    title: 'Pin Status',
    dataIndex: 'pinned',
    key: 'pinned',
    width: 120,
  },
  {
    title: 'Push Channels',
    dataIndex: 'pushChannels',
    key: 'pushChannels',
    width: 200,
  },
  {
    title: 'Publish Time',
    dataIndex: 'publishTime',
    key: 'publishTime',
    width: 180,
    sortable: true,
  },
  {
    title: 'Languages',
    dataIndex: 'languages',
    key: 'languages',
    width: 150,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    fixed: 'right',
  },
]

function handleTableChange(pag: any, filters: any, sorter: any) {
  pagination.value = {
    page: pag.current,
    pageSize: pag.pageSize,
  }

  emit('fetch', {
    page: pag.current,
    pageSize: pag.pageSize,
    sortField: sorter.field,
    sortOrder: sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : undefined,
    filters,
  })
}

function handleSelectionChange(keys: string[], rows: Announcement[]) {
  selectedKeys.value = keys
  emit('selection-change', keys, rows)
}

function isScheduled(publishTime: string): boolean {
  return new Date(publishTime).getTime() > Date.now()
}

function getTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    event: 'blue',
    maintenance: 'orange',
    update: 'green',
    promotion: 'purple',
    alert: 'red',
  }
  return colorMap[type] || 'default'
}
</script>
