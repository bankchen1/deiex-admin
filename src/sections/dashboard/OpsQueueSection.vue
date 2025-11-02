<template>
  <div class="ops-queue-section">
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="12">
        <TodoList
          title="Pending KYC Reviews"
          :items="kycItems"
          :loading="loading"
          @item-click="handleItemClick"
          @view-all="handleViewAllKyc"
        />
      </a-col>
      <a-col :xs="24" :lg="12">
        <TodoList
          title="Pending Withdrawals"
          :items="withdrawalItems"
          :loading="loading"
          @item-click="handleItemClick"
          @view-all="handleViewAllWithdrawals"
        />
      </a-col>
      <a-col :xs="24" :lg="12">
        <TodoList
          title="Abnormal Orders"
          :items="orderItems"
          :loading="loading"
          @item-click="handleItemClick"
          @view-all="handleViewAllOrders"
        />
      </a-col>
      <a-col :xs="24" :lg="12">
        <TodoList
          title="Risk Alerts"
          :items="alertItems"
          :loading="loading"
          @item-click="handleItemClick"
          @view-all="handleViewAllAlerts"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TodoList from '@/widgets/list/TodoList.vue'
import type { TodoItem } from '@/widgets/list/TodoList.vue'
import type { Alert } from '@/services/api/dashboard'

interface Props {
  alerts: Alert[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'itemClick', item: TodoItem): void
  (e: 'viewAll', type: string): void
}>()

const kycItems = computed(() => {
  return props.alerts
    .filter((alert) => alert.type === 'kyc')
    .map((alert) => ({
      id: alert.id,
      title: alert.title,
      description: alert.description,
      type: alert.type,
      priority: alert.priority,
      createdAt: alert.createdAt,
      metadata: alert.metadata,
    }))
})

const withdrawalItems = computed(() => {
  return props.alerts
    .filter((alert) => alert.type === 'withdrawal')
    .map((alert) => ({
      id: alert.id,
      title: alert.title,
      description: alert.description,
      type: alert.type,
      priority: alert.priority,
      createdAt: alert.createdAt,
      metadata: alert.metadata,
    }))
})

const orderItems = computed(() => {
  return props.alerts
    .filter((alert) => alert.type === 'order')
    .map((alert) => ({
      id: alert.id,
      title: alert.title,
      description: alert.description,
      type: alert.type,
      priority: alert.priority,
      createdAt: alert.createdAt,
      metadata: alert.metadata,
    }))
})

const alertItems = computed(() => {
  return props.alerts
    .filter((alert) => alert.type === 'alert')
    .map((alert) => ({
      id: alert.id,
      title: alert.title,
      description: alert.description,
      type: alert.type,
      priority: alert.priority,
      createdAt: alert.createdAt,
      metadata: alert.metadata,
    }))
})

const handleItemClick = (item: TodoItem) => {
  emit('itemClick', item)
}

const handleViewAllKyc = () => {
  emit('viewAll', 'kyc')
}

const handleViewAllWithdrawals = () => {
  emit('viewAll', 'withdrawals')
}

const handleViewAllOrders = () => {
  emit('viewAll', 'orders')
}

const handleViewAllAlerts = () => {
  emit('viewAll', 'alerts')
}
</script>

<style scoped>
.ops-queue-section {
  margin-bottom: 24px;
}
</style>
