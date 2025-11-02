<template>
  <a-drawer
    :open="open"
    :title="mode === 'create' ? 'Create Role' : 'Edit Role'"
    :width="720"
    @close="handleClose"
  >
    <RoleForm
      :initial-data="roleData"
      :mode="mode"
      :available-permissions="availablePermissions"
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
import { ref, watch } from 'vue'
import RoleForm from '@/forms/security/RoleForm.vue'
import type { Role, CreateRolePayload, UpdateRolePayload } from '@/services/api/config.security'

interface Props {
  open: boolean
  roleData?: Role | null
  mode?: 'create' | 'edit'
  availablePermissions?: string[]
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', data: CreateRolePayload | UpdateRolePayload): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  loading: false,
  availablePermissions: () => [],
})

const emit = defineEmits<Emits>()

const formRef = ref()

function handleFormSubmit() {
  // Trigger form submission
  if (formRef.value) {
    formRef.value.submit()
  }
}

function handleSubmit(data: CreateRolePayload | UpdateRolePayload) {
  emit('submit', data)
}

function handleClose() {
  emit('update:open', false)
  emit('cancel')
}
</script>
