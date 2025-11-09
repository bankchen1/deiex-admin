<template>
  <div v-if="visible" class="debug-panel">
    <div class="debug-header">
      <h3>🐛 Debug Panel</h3>
      <button @click="visible = false">✕</button>
    </div>
    <div class="debug-content">
      <div class="debug-section">
        <h4>Environment</h4>
        <pre>{{ envInfo }}</pre>
      </div>
      <div class="debug-section">
        <h4>Mock Service Status</h4>
        <pre>{{ mockStatus }}</pre>
      </div>
      <div class="debug-section">
        <h4>Actions</h4>
        <button @click="testDashboardApi">Test Dashboard API</button>
        <button @click="testUsersApi">Test Users API</button>
        <button @click="testStore">Test Store</button>
      </div>
      <div v-if="testResult" class="debug-section">
        <h4>Test Result</h4>
        <pre>{{ testResult }}</pre>
      </div>
    </div>
  </div>
  <button v-else class="debug-toggle" @click="visible = true">🐛 Debug</button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getDashboardStats, listUsers } from '@/services/api/facade'
import { mockService } from '@/services/mock'
import { useDashboardStore } from '@/stores/dashboard'

const visible = ref(false)
const testResult = ref('')

const envInfo = computed(() => ({
  VITE_USE_MOCK: import.meta.env.VITE_USE_MOCK,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
}))

const mockStatus = computed(() => ({
  enabled: mockService.isEnabled(),
  message: mockService.isEnabled() ? 'Mock service is active' : 'Mock service is disabled',
}))

async function testDashboardApi() {
  testResult.value = 'Testing...'
  try {
    const response = await getDashboardStats()
    testResult.value = JSON.stringify(
      {
        success: '✅ API call successful',
        response: response,
      },
      null,
      2
    )
  } catch (error: any) {
    testResult.value = JSON.stringify(
      {
        error: '❌ API call failed',
        message: error.message,
        details: error,
      },
      null,
      2
    )
  }
}

async function testUsersApi() {
  testResult.value = 'Testing...'
  try {
    const response = await listUsers({ page: 1, pageSize: 10 })
    testResult.value = JSON.stringify(
      {
        success: '✅ Users API successful',
        total: response.data?.total,
        itemsCount: response.data?.data?.length,
        response: response,
      },
      null,
      2
    )
  } catch (error: any) {
    testResult.value = JSON.stringify(
      {
        error: '❌ Users API failed',
        message: error.message,
      },
      null,
      2
    )
  }
}

async function testStore() {
  testResult.value = 'Testing...'
  try {
    const store = useDashboardStore()
    const before = {
      stats: store.stats,
      loading: store.statsLoading,
      error: store.error,
    }

    await store.fetchStats()

    const after = {
      stats: store.stats,
      loading: store.statsLoading,
      error: store.error,
    }

    testResult.value = JSON.stringify(
      {
        success: store.stats ? '✅ Store test successful' : '❌ Store has no data',
        before,
        after,
      },
      null,
      2
    )
  } catch (error: any) {
    testResult.value = JSON.stringify(
      {
        error: '❌ Store test failed',
        message: error.message,
      },
      null,
      2
    )
  }
}

onMounted(() => {
  console.log('[Debug Panel] Mounted')
  console.log('[Debug Panel] Mock mode:', import.meta.env.VITE_USE_MOCK)
  console.log('[Debug Panel] Mock service enabled:', mockService.isEnabled())
})
</script>

<style scoped>
.debug-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  padding: 10px 15px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.debug-toggle:hover {
  background: #40a9ff;
}

.debug-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 600px;
  max-height: 80vh;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.debug-header h3 {
  margin: 0;
  font-size: 16px;
}

.debug-header button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.debug-content {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.debug-section {
  margin-bottom: 16px;
}

.debug-section h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
}

.debug-section pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  margin: 0;
}

.debug-section button {
  margin-right: 8px;
  margin-bottom: 8px;
  padding: 6px 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.debug-section button:hover {
  background: #40a9ff;
}
</style>
