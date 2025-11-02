<template>
  <a-form
    :model="formState"
    :rules="rules"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    @finish="handleSubmit"
  >
    <a-form-item label="Page Key" name="pageKey">
      <a-input
        v-model:value="formState.pageKey"
        placeholder="e.g., dashboard.overview"
        :disabled="true"
      />
    </a-form-item>

    <a-form-item label="Page Name" name="pageName">
      <a-input v-model:value="formState.pageName" placeholder="e.g., Dashboard Overview" />
    </a-form-item>

    <a-form-item label="API Endpoints" name="apiEndpoints">
      <a-select
        v-model:value="formState.apiEndpoints"
        mode="tags"
        placeholder="Add API endpoints"
        style="width: 100%"
      >
        <a-select-option v-for="endpoint in commonEndpoints" :key="endpoint" :value="endpoint">
          {{ endpoint }}
        </a-select-option>
      </a-select>
      <div style="margin-top: 8px; color: #999; font-size: 12px">
        Press Enter to add custom endpoints
      </div>
    </a-form-item>

    <a-form-item label="Dependencies" name="dependencies">
      <a-select
        v-model:value="formState.dependencies"
        mode="tags"
        placeholder="Add page dependencies"
        style="width: 100%"
      >
        <a-select-option v-for="dep in commonDeps" :key="dep" :value="dep">
          {{ dep }}
        </a-select-option>
      </a-select>
      <div style="margin-top: 8px; color: #999; font-size: 12px">
        Press Enter to add custom dependencies
      </div>
    </a-form-item>

    <a-form-item label="Status" name="status">
      <a-radio-group v-model:value="formState.status">
        <a-radio value="active">Active</a-radio>
        <a-radio value="broken">Broken</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
      <a-space>
        <a-button type="primary" html-type="submit" :loading="loading"> Update </a-button>
        <a-button @click="handleCancel">Cancel</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { PageApiRelation } from '@/services/api/config.mappings'

interface Props {
  initialData?: Partial<PageApiRelation>
  mode?: 'create' | 'edit'
  loading?: boolean
}

interface Emits {
  (e: 'submit', data: Partial<PageApiRelation>): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'edit',
  loading: false,
})

const emit = defineEmits<Emits>()

const formState = ref<Partial<PageApiRelation>>({
  pageKey: '',
  pageName: '',
  apiEndpoints: [],
  dependencies: [],
  status: 'active',
})

const commonEndpoints = [
  '/admin/dashboard/stats',
  '/admin/kyc/list',
  '/admin/users/list',
  '/admin/assets/deposits',
  '/admin/assets/withdrawals',
  '/admin/orders/spot',
  '/admin/orders/futures',
  '/admin/config/instruments',
  '/admin/config/margin',
  '/admin/config/fees',
]

const commonDeps = [
  'auth.store',
  'app.store',
  'dashboard.store',
  'kyc.store',
  'users.store',
  'assets.store',
  'orders.store',
  'config.store',
]

const rules: Record<string, Rule[]> = {
  pageKey: [{ required: true, message: 'Page key is required' }],
  pageName: [{ required: true, message: 'Please enter page name' }],
  apiEndpoints: [{ required: true, message: 'Please add at least one API endpoint' }],
  status: [{ required: true, message: 'Please select status' }],
}

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formState.value = { ...newData }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  emit('submit', formState.value)
}

function handleCancel() {
  emit('cancel')
}
</script>
