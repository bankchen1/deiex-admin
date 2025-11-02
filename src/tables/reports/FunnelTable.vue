<template>
  <ServerTable
    :columns="columns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="false"
    :enable-export="true"
    @export="handleExport"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ServerTable from '@/shared/ServerTable.vue'
import type { TableColumn } from '@/types/components'
import type { FunnelData } from '@/types/api'
import { formatNumber, formatPercent } from '@/utils/format'

interface Props {
  dataSource: FunnelData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'export'): void
}>()

const columns = computed<TableColumn[]>(() => [
  {
    key: 'stage',
    title: 'Stage',
    dataIndex: 'stage',
    width: 200,
    fixed: 'left',
  },
  {
    key: 'users',
    title: 'Users',
    dataIndex: 'users',
    width: 150,
    render: (value: number) => formatNumber(value),
  },
  {
    key: 'percentage',
    title: 'Conversion Rate',
    dataIndex: 'percentage',
    width: 150,
    render: (value: number) => formatPercent(value),
  },
  {
    key: 'dropoffRate',
    title: 'Drop-off Rate',
    dataIndex: 'dropoffRate',
    width: 150,
    render: (value: number) => formatPercent(value),
  },
  {
    key: 'avgTimeToNext',
    title: 'Avg Time to Next (hours)',
    dataIndex: 'avgTimeToNext',
    width: 180,
    render: (value?: number) => (value ? formatNumber(value) : '-'),
  },
])

function handleExport() {
  emit('export')
}
</script>
