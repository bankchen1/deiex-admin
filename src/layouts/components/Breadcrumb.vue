<template>
  <a-breadcrumb class="breadcrumb">
    <a-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
      <router-link v-if="item.path && index < breadcrumbItems.length - 1" :to="item.path">
        {{ item.title }}
      </router-link>
      <span v-else>{{ item.title }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { BreadcrumbItem } from '../types'

const route = useRoute()

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = []
  const matched = route.matched.filter((r) => r.meta && r.meta.title)

  // Add home
  items.push({
    title: 'Home',
    path: '/admin/dashboard',
  })

  // Add matched routes
  matched.forEach((r) => {
    if (r.meta.title) {
      items.push({
        title: r.meta.title as string,
        path: r.path,
      })
    }
  })

  return items
})
</script>

<style scoped>
.breadcrumb {
  font-size: 14px;
}

.breadcrumb :deep(.ant-breadcrumb-link) {
  color: rgba(0, 0, 0, 0.65);
}

.breadcrumb :deep(.ant-breadcrumb-link:hover) {
  color: #1890ff;
}

.breadcrumb :deep(.ant-breadcrumb-separator) {
  color: rgba(0, 0, 0, 0.45);
}
</style>
