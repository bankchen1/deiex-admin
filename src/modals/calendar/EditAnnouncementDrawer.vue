<template>
  <a-drawer
    :open="open"
    :title="drawerTitle"
    :width="720"
    :closable="true"
    :footer-style="{ textAlign: 'right' }"
    @close="handleClose"
  >
    <AnnouncementForm :announcement="announcement" :mode="mode" @submit="handleSubmit" />

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
import AnnouncementForm from '@/forms/calendar/AnnouncementForm.vue'
import type { Announcement } from '@/contracts/calendar'

interface Props {
  open: boolean
  announcement?: Announcement | null
  mode?: 'create' | 'edit' | 'view'
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', payload: Partial<Announcement>): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  announcement: null,
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formRef = ref()

const drawerTitle = computed(() => {
  if (props.mode === 'create') return 'Create Announcement'
  if (props.mode === 'edit') return 'Edit Announcement'
  return 'View Announcement'
})

function handleClose() {
  emit('update:open', false)
  emit('close')
}

function handleSubmit(payload: Partial<Announcement>) {
  emit('submit', payload)
}

function handleSave() {
  // Trigger form submission
  if (formRef.value) {
    formRef.value.submit()
  }
}
</script>
