<template>
  <div class="content-page">
    <a-page-header
      title="Content Management"
      sub-title="Manage blog, notifications, and announcements"
    >
      <template #extra>
        <a-button @click="handleRefresh">
          <template #icon>
            <ReloadOutlined />
          </template>
          Refresh
        </a-button>
      </template>
    </a-page-header>

    <a-card style="margin-top: 16px">
      <a-tabs v-model:active-key="activeTab" @change="handleTabChange">
        <a-tab-pane key="blog" tab="Blog">
          <BlogDashboard />
        </a-tab-pane>
        <a-tab-pane key="notifications" tab="Notifications">
          <NotificationDashboard />
        </a-tab-pane>
        <a-tab-pane key="announcements" tab="Announcements">
          <AnnouncementDashboard />
        </a-tab-pane>
        <a-tab-pane key="email-marketing" tab="Email Marketing">
          <EmailMarketingDashboard />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import BlogDashboard from '@/pages/content/blog/Dashboard.vue'
import NotificationDashboard from '@/pages/content/notifications/Dashboard.vue'
import AnnouncementDashboard from '@/pages/content/announcements/Dashboard.vue'
import EmailMarketingDashboard from '@/pages/content/email-marketing/Dashboard.vue'

const activeTab = ref('blog')

function handleTabChange(key: string) {
  activeTab.value = key
}

function handleRefresh() {
  // Refresh current tab content
  console.log('Refreshing content for tab:', activeTab.value)
}
</script>

<style scoped>
.content-page {
  padding: 24px;
}
</style>
