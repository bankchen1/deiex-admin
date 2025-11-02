<template>
  <a-card :bordered="false" class="stat-card" :loading="loading">
    <div class="stat-card-content">
      <div class="stat-info">
        <div class="stat-title">{{ title }}</div>
        <div class="stat-value">{{ formattedValue }}</div>
        <div v-if="change !== undefined" class="stat-change" :class="changeClass">
          <component :is="changeIcon" class="change-icon" />
          <span>{{ changeText }}</span>
        </div>
      </div>
      <div v-if="icon" class="stat-icon" :style="{ backgroundColor: iconBg }">
        <component :is="icon" :style="{ color: iconColor }" />
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue'
import { formatNumber } from '@/utils/format'

interface Props {
  title: string
  value: number | string
  change?: number
  icon?: any
  iconColor?: string
  iconBg?: string
  loading?: boolean
  formatter?: (value: number | string) => string
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: '#1890ff',
  iconBg: '#e6f7ff',
  loading: false,
})

const formattedValue = computed(() => {
  if (props.formatter) {
    return props.formatter(props.value)
  }
  if (typeof props.value === 'number') {
    return formatNumber(props.value)
  }
  return props.value
})

const changeClass = computed(() => {
  if (props.change === undefined) return ''
  return props.change >= 0 ? 'positive' : 'negative'
})

const changeIcon = computed(() => {
  if (props.change === undefined) return null
  return props.change >= 0 ? ArrowUpOutlined : ArrowDownOutlined
})

const changeText = computed(() => {
  if (props.change === undefined) return ''
  const absChange = Math.abs(props.change)
  return `${absChange.toFixed(2)}% vs last period`
})
</script>

<style scoped>
.stat-card {
  height: 100%;
}

.stat-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 30px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
  line-height: 1.2;
}

.stat-change {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.positive {
  color: #52c41a;
}

.stat-change.negative {
  color: #ff4d4f;
}

.change-icon {
  font-size: 12px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
</style>
