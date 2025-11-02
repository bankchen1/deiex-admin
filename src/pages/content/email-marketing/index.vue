<template>
  <div class="email-marketing-page">
    <a-page-header title="Email Marketing" sub-title="Manage email campaigns and templates">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleCreateCampaign">
            <template #icon><PlusOutlined /></template>
            Create Campaign
          </a-button>
          <a-button @click="handleRefresh">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-tabs v-model:active-key="activeTab" @change="handleTabChange">
      <a-tab-pane key="dashboard" tab="Dashboard">
        <EmailDashboard />
      </a-tab-pane>
      <a-tab-pane key="campaigns" tab="Campaigns">
        <CampaignList />
      </a-tab-pane>
      <a-tab-pane key="templates" tab="Templates">
        <TemplateList />
      </a-tab-pane>
      <a-tab-pane key="segments" tab="Segments">
        <SegmentList />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import EmailDashboard from './Dashboard.vue'
import CampaignList from './campaigns.vue'
import TemplateList from './templates.vue'
import SegmentList from './segments.vue'

const activeTab = ref('dashboard')

function handleCreateCampaign() {
  console.log('Create campaign')
}

function handleRefresh() {
  console.log('Refresh')
}

function handleTabChange(key: string) {
  console.log('Tab changed to:', key)
}
</script>

<style scoped>
.email-marketing-page {
  padding: 24px;
}
</style>
