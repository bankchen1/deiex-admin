<template>
  <div class="skeleton-wrapper">
    <a-skeleton
      v-if="type === 'default'"
      :loading="loading"
      :active="active"
      :avatar="avatar"
      :paragraph="paragraph"
      :title="title"
    >
      <slot />
    </a-skeleton>

    <div v-else-if="type === 'card' && loading" class="skeleton-card">
      <a-skeleton :active="active" :paragraph="{ rows: 4 }" />
    </div>
    <slot v-else-if="type === 'card'" />

    <div v-else-if="type === 'list' && loading" class="skeleton-list">
      <div v-for="i in rows" :key="i" class="skeleton-list-item">
        <a-skeleton :active="active" :avatar="avatar" :paragraph="{ rows: 1 }" />
      </div>
    </div>
    <slot v-else-if="type === 'list'" />

    <div v-else-if="type === 'table' && loading" class="skeleton-table">
      <div class="skeleton-table-header">
        <div v-for="i in columns" :key="i" class="skeleton-table-cell">
          <div class="skeleton-line" />
        </div>
      </div>
      <div v-for="i in rows" :key="i" class="skeleton-table-row">
        <div v-for="j in columns" :key="j" class="skeleton-table-cell">
          <div class="skeleton-line" />
        </div>
      </div>
    </div>
    <slot v-else-if="type === 'table'" />

    <div v-else-if="type === 'form' && loading" class="skeleton-form">
      <div v-for="i in rows" :key="i" class="skeleton-form-item">
        <div class="skeleton-form-label">
          <div class="skeleton-line" style="width: 80px" />
        </div>
        <div class="skeleton-form-control">
          <div class="skeleton-line" />
        </div>
      </div>
    </div>
    <slot v-else-if="type === 'form'" />

    <div v-else-if="type === 'chart' && loading" class="skeleton-chart">
      <div class="skeleton-chart-content">
        <div class="skeleton-chart-bars">
          <div
            v-for="i in 8"
            :key="i"
            class="skeleton-chart-bar"
            :style="{ height: `${Math.random() * 60 + 20}%` }"
          />
        </div>
      </div>
    </div>
    <slot v-else-if="type === 'chart'" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading?: boolean
  type?: 'default' | 'card' | 'list' | 'table' | 'form' | 'chart'
  active?: boolean
  avatar?: boolean
  title?: boolean
  paragraph?: { rows?: number; width?: number | string | (number | string)[] }
  rows?: number
  columns?: number
}

withDefaults(defineProps<Props>(), {
  loading: true,
  type: 'default',
  active: true,
  avatar: false,
  title: true,
  paragraph: () => ({ rows: 3 }),
  rows: 3,
  columns: 4,
})
</script>

<style scoped>
.skeleton-wrapper {
  width: 100%;
}

.skeleton-card {
  padding: 24px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}

.skeleton-list {
  background: #fff;
}

.skeleton-list-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.skeleton-list-item:last-child {
  border-bottom: none;
}

.skeleton-table {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.skeleton-table-header {
  display: flex;
  padding: 16px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.skeleton-table-row {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.skeleton-table-row:last-child {
  border-bottom: none;
}

.skeleton-table-cell {
  flex: 1;
  padding: 0 8px;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-form {
  background: #fff;
  padding: 24px;
}

.skeleton-form-item {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.skeleton-form-item:last-child {
  margin-bottom: 0;
}

.skeleton-form-label {
  width: 120px;
  margin-right: 16px;
}

.skeleton-form-control {
  flex: 1;
}

.skeleton-chart {
  background: #fff;
  padding: 24px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.skeleton-chart-content {
  height: 300px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
}

.skeleton-chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  gap: 8px;
}

.skeleton-chart-bar {
  flex: 1;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px 4px 0 0;
  min-height: 20%;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
