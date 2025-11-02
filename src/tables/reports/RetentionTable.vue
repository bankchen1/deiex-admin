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
import { computed, h } from 'vue'
import ServerTable from '@/shared/ServerTable.vue'
import type { TableColumn } from '@/types/components'
import type { RetentionData } from '@/types/api'
import { formatNumber, formatPercent } from '@/utils/format'

interface Props {
  dataSource: RetentionData[]
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
    key: 'cohortDate',
    title: 'Cohort Date',
    dataIndex: 'cohortDate',
    width: 120,
    fixed: 'left',
  },
  {
    key: 'cohortSize',
    title: 'Cohort Size',
    dataIndex: 'cohortSize',
    width: 120,
    render: (value: number) => formatNumber(value),
  },
  {
    key: 'day0',
    title: 'Day 0',
    dataIndex: 'day0',
    width: 100,
    render: (value: number, record: RetentionData) => {
      const percentage = (value / record.cohortSize) * 100
      return h('div', [
        h('div', formatNumber(value)),
        h(
          'div',
          { style: 'font-size: 12px; color: rgba(0,0,0,0.45);' },
          formatPercent(percentage / 100)
        ),
      ])
    },
  },
  {
    key: 'day1',
    title: 'Day 1',
    dataIndex: 'day1',
    width: 100,
    render: (value: number, record: RetentionData) => {
      const percentage = (value / record.cohortSize) * 100
      return h('div', [
        h('div', formatNumber(value)),
        h(
          'div',
          { style: 'font-size: 12px; color: rgba(0,0,0,0.45);' },
          formatPercent(percentage / 100)
        ),
      ])
    },
  },
  {
    key: 'day3',
    title: 'Day 3',
    dataIndex: 'day3',
    width: 100,
    render: (value: number, record: RetentionData) => {
      const percentage = (value / record.cohortSize) * 100
      return h('div', [
        h('div', formatNumber(value)),
        h(
          'div',
          { style: 'font-size: 12px; color: rgba(0,0,0,0.45);' },
          formatPercent(percentage / 100)
        ),
      ])
    },
  },
  {
    key: 'day7',
    title: 'Day 7',
    dataIndex: 'day7',
    width: 100,
    render: (value: number, record: RetentionData) => {
      const percentage = (value / record.cohortSize) * 100
      return h('div', [
        h('div', formatNumber(value)),
        h(
          'div',
          { style: 'font-size: 12px; color: rgba(0,0,0,0.45);' },
          formatPercent(percentage / 100)
        ),
      ])
    },
  },
  {
    key: 'day14',
    title: 'Day 14',
    dataIndex: 'day14',
    width: 100,
    render: (value: number, record: RetentionData) => {
      const percentage = (value / record.cohortSize) * 100
      return h('div', [
        h('div', formatNumber(value)),
        h(
          'div',
          { style: 'font-size: 12px; color: rgba(0,0,0,0.45);' },
          formatPercent(percentage / 100)
        ),
      ])
    },
  },
  {
    key: 'day30',
    title: 'Day 30',
    dataIndex: 'day30',
    width: 100,
    render: (value: number, record: RetentionData) => {
      const percentage = (value / record.cohortSize) * 100
      return h('div', [
        h('div', formatNumber(value)),
        h(
          'div',
          { style: 'font-size: 12px; color: rgba(0,0,0,0.45);' },
          formatPercent(percentage / 100)
        ),
      ])
    },
  },
  {
    key: 'day60',
    title: 'Day 60',
    dataIndex: 'day60',
    width: 100,
    render: (value: number, record: RetentionData) => {
      const percentage = (value / record.cohortSize) * 100
      return h('div', [
        h('div', formatNumber(value)),
        h(
          'div',
          { style: 'font-size: 12px; color: rgba(0,0,0,0.45);' },
          formatPercent(percentage / 100)
        ),
      ])
    },
  },
  {
    key: 'day90',
    title: 'Day 90',
    dataIndex: 'day90',
    width: 100,
    render: (value: number, record: RetentionData) => {
      const percentage = (value / record.cohortSize) * 100
      return h('div', [
        h('div', formatNumber(value)),
        h(
          'div',
          { style: 'font-size: 12px; color: rgba(0,0,0,0.45);' },
          formatPercent(percentage / 100)
        ),
      ])
    },
  },
])

function handleExport() {
  emit('export')
}
</script>
