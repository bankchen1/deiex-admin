<template>
  <a-card :title="title" :bordered="bordered">
    <a-calendar
      v-model:value="selectedDate"
      :fullscreen="fullscreen"
      @select="handleSelect"
      @panel-change="handlePanelChange"
    >
      <template #dateCellRender="{ current }">
        <div class="calendar-cell">
          <div v-if="getEventsForDate(current).length > 0" class="event-indicators">
            <a-badge
              v-for="event in getEventsForDate(current).slice(0, 3)"
              :key="event.id"
              :color="getEventColor(event.type)"
              :text="event.title"
              class="event-badge"
            />
            <a-typography-text
              v-if="getEventsForDate(current).length > 3"
              type="secondary"
              style="font-size: 12px"
            >
              +{{ getEventsForDate(current).length - 3 }} more
            </a-typography-text>
          </div>
        </div>
      </template>

      <template #monthCellRender="{ current }">
        <div class="month-cell">
          <div v-if="getEventsForMonth(current).length > 0" class="month-events">
            <a-tag :color="getMonthEventColor(current)">
              {{ getEventsForMonth(current).length }} events
            </a-tag>
          </div>
        </div>
      </template>
    </a-calendar>

    <!-- Event Details Modal -->
    <a-modal
      v-model:open="detailsModalVisible"
      :title="`Events on ${formatDate(selectedDate)}`"
      :footer="null"
      width="600px"
    >
      <a-list
        :data-source="getEventsForDate(selectedDate)"
        :loading="loading"
        item-layout="horizontal"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <a-space>
                  <a-tag :color="getEventColor(item.type)">{{ item.type }}</a-tag>
                  <span>{{ item.title }}</span>
                </a-space>
              </template>
              <template #description>
                <a-space direction="vertical" :size="4">
                  <span v-if="item.startTime">
                    <ClockCircleOutlined />
                    {{ formatDateTime(item.startTime) }}
                    <span v-if="item.endTime"> - {{ formatDateTime(item.endTime) }}</span>
                  </span>
                  <span v-if="item.description">{{ item.description }}</span>
                </a-space>
              </template>
            </a-list-item-meta>
            <template #actions>
              <a-button type="link" size="small" @click="handleViewEvent(item)">View</a-button>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </a-modal>
  </a-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ClockCircleOutlined } from '@ant-design/icons-vue'
import { formatDate, formatDateTime } from '@/utils/date'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

interface CalendarEvent {
  id: string
  title: string
  description?: string
  type: 'funding' | 'maintenance' | 'announcement' | 'event'
  startTime: string
  endTime?: string
}

interface Props {
  title?: string
  events: CalendarEvent[]
  loading?: boolean
  bordered?: boolean
  fullscreen?: boolean
}

interface Emits {
  (e: 'select', date: Dayjs): void
  (e: 'panel-change', date: Dayjs, mode: string): void
  (e: 'view-event', event: CalendarEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Calendar',
  events: () => [],
  loading: false,
  bordered: true,
  fullscreen: true,
})

const emit = defineEmits<Emits>()

const selectedDate = ref<Dayjs>(dayjs())
const detailsModalVisible = ref(false)

function getEventsForDate(date: Dayjs): CalendarEvent[] {
  return props.events.filter((event) => {
    const eventDate = dayjs(event.startTime)
    return eventDate.isSame(date, 'day')
  })
}

function getEventsForMonth(date: Dayjs): CalendarEvent[] {
  return props.events.filter((event) => {
    const eventDate = dayjs(event.startTime)
    return eventDate.isSame(date, 'month')
  })
}

function getEventColor(type: string): string {
  const colorMap: Record<string, string> = {
    funding: 'blue',
    maintenance: 'orange',
    announcement: 'green',
    event: 'purple',
  }
  return colorMap[type] || 'default'
}

function getMonthEventColor(date: Dayjs): string {
  const events = getEventsForMonth(date)
  if (events.some((e) => e.type === 'maintenance')) return 'orange'
  if (events.some((e) => e.type === 'funding')) return 'blue'
  return 'green'
}

function handleSelect(date: Dayjs) {
  selectedDate.value = date
  emit('select', date)

  if (getEventsForDate(date).length > 0) {
    detailsModalVisible.value = true
  }
}

function handlePanelChange(date: Dayjs, mode: string) {
  emit('panel-change', date, mode)
}

function handleViewEvent(event: CalendarEvent) {
  emit('view-event', event)
  detailsModalVisible.value = false
}
</script>

<style scoped>
.calendar-cell {
  min-height: 60px;
  padding: 4px;
}

.event-indicators {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-badge {
  font-size: 11px;
  padding: 0 4px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.month-cell {
  text-align: center;
  padding: 8px;
}

.month-events {
  margin-top: 4px;
}

:deep(.ant-picker-calendar-date-content) {
  height: auto !important;
  min-height: 60px;
}
</style>
