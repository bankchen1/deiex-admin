<template>
  <div class="risk-page">
    <a-page-header title="Risk Management" :ghost="false" />

    <a-card :bordered="false" style="margin-top: 16px">
      <a-tabs v-model:active-key="activeTab">
        <a-tab-pane key="rules" tab="Risk Rules">
          <Rules />
        </a-tab-pane>
        <a-tab-pane key="limits" tab="Risk Limits">
          <Limits />
        </a-tab-pane>
        <a-tab-pane key="blacklist" tab="Blacklist">
          <Blacklist />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Rules from './Rules.vue'
import Limits from './Limits.vue'
import Blacklist from './Blacklist.vue'

const activeTab = ref('rules')
</script>

<style scoped>
.risk-page {
  padding: 24px;
}
</style>
