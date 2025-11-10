<template>
  <a-drawer
    :open="open"
    :title="mode === 'create' ? 'Create Admin User' : 'Edit Admin User'"
    :width="720"
    @close="handleClose"
  >
    <AdminUserForm
      ref="formRef"
      :initial-data="userData"
      :mode="mode"
      :available-roles="availableRoles"
      @submit="handleSubmit"
      @cancel="handleClose"
    />

    <template #footer>
      <div style="display: flex; justify-content: flex-end; gap: 8px">
        <a-button @click="handleClose">Cancel</a-button>
        <a-button type="primary" :loading="loading" @click="handleFormSubmit">
          {{ mode === 'create' ? 'Create' : 'Update' }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminUserForm from '@/forms/security/AdminUserForm.vue'
import type {
  AdminUser,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
} from '@/services/api/facade'

interface Props {
  open: boolean
  userData?: AdminUser | null
  mode?: 'create' | 'edit'
  availableRoles?: Array<{ id: string; name: string }>
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', data: CreateAdminUserPayload | UpdateAdminUserPayload): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  loading: false,
  availableRoles: () => [],
})

const emit = defineEmits<Emits>()

const formRef = ref()

function handleFormSubmit() {
  // Trigger form submission
  if (formRef.value) {
    formRef.value.submit()
  }
}

function handleSubmit(data: CreateAdminUserPayload | UpdateAdminUserPayload) {
  emit('submit', data)
}

function handleClose() {
  emit('update:open', false)
  emit('cancel')
}
</script>
