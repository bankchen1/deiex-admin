<template>
  <a-card :bordered="false" class="todo-list" :loading="loading">
    <template #title>
      <div class="list-header">
        <span>{{ title }}</span>
        <a-badge :count="items.length" :overflow-count="99" />
      </div>
    </template>
    <a-empty v-if="items.length === 0" description="No pending items" />
    <a-list v-else :data-source="items" :pagination="false">
      <template #renderItem="{ item }">
        <a-list-item class="todo-item" @click="handleItemClick(item)">
          <a-list-item-meta>
            <template #avatar>
              <a-badge :status="getBadgeStatus(item.priority)" />
            </template>
            <template #title>
              <div class="item-title">
                <span>{{ item.title }}</span>
                <a-tag v-if="item.type" :color="getTypeColor(item.type)" size="small">
                  {{ item.type }}
                </a-tag>
              </div>
            </template>
            <template #description>
              <div class="item-description">
                <span>{{ item.description }}</span>
                <span class="item-time">{{ formatTime(item.createdAt) }}</span>
              </div>
            </template>
          </a-list-item-meta>
          <template #actions>
            <a-button type="link" size="small">View</a-button>
          </template>
        </a-list-item>
      </template>
    </a-list>
    <div v-if="showViewAll && items.length > 0" class="view-all">
      <a-button type="link" @click="handleViewAll">View All</a-button>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { formatRelativeTime } from '@/utils/date'

export interface TodoItem {
  id: string
  title: string
  description: string
  type: 'kyc' | 'withdrawal' | 'order' | 'alert'
  priority: 'high' | 'medium' | 'low'
  createdAt: string
  metadata?: Record<string, any>
}

interface Props {
  title: string
  items: TodoItem[]
  loading?: boolean
  showViewAll?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
  showViewAll: true,
})

const emit = defineEmits<{
  (e: 'itemClick', item: TodoItem): void
  (e: 'viewAll'): void
}>()

const getBadgeStatus = (priority: string) => {
  const statusMap: Record<string, any> = {
    high: 'error',
    medium: 'warning',
    low: 'default',
  }
  return statusMap[priority] || 'default'
}

const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    kyc: 'blue',
    withdrawal: 'orange',
    order: 'purple',
    alert: 'red',
  }
  return colorMap[type] || 'default'
}

const formatTime = (time: string) => {
  return formatRelativeTime(time)
}

const handleItemClick = (item: TodoItem) => {
  emit('itemClick', item)
}

const handleViewAll = () => {
  emit('viewAll')
}
</script>

<style scoped>
.todo-list {
  height: 100%;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.todo-item:hover {
  background-color: #fafafa;
}

.item-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-description {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.item-time {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  white-space: nowrap;
}

.view-all {
  text-align: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}
</style>
