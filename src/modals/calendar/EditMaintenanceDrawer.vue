<template>
  <a-drawer
    :open="open"
    :title="drawerTitle"
    :width="720"
    :closable="true"
    :footer-style="{ textAlign: 'right' }"
    @close="handleClose"
  >
    <MaintenanceForm :maintenance="maintenance" :mode="mode" @submit="handleSubmit" />

    <template #footer>
      <a-space>
        <a-button @click="handleClose">Cancel</a-button>
        <a-button v-if="mode !== 'view'" type="primary" :loading="loading" @click="handleSave">
          {{ mode === 'create' ? 'Create' : 'Update' }}
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MaintenanceForm from '@/forms/calendar/MaintenanceForm.vue'
import type { MaintenanceWindow } from '@/types/models'

interface Props {
  open: boolean
  maintenance?: MaintenanceWindow | null
  mode?: 'create' | 'edit' | 'view'
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', payload: Partial<MaintenanceWindow>): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  maintenance: null,
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formRef = ref()

const drawerTitle = computed(() => {
  if (props.mode === 'create') return 'Schedule Maintenance'
  if (props.mode === 'edit') return 'Edit Maintenance'
  return 'View Maintenance'
})

function handleClose() {
  emit('update:open', false)
  emit('close')
}

function handleSubmit(payload: Partial<MaintenanceWindow>) {
  emit('submit', payload)
}

function handleSave() {
  // Trigger form submission
  if (formRef.value) {
    formRef.value.submit()
  }
}
</script>
