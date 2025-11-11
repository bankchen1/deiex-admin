<template>
  <a-drawer
    :open="open"
    :title="title"
    :width="720"
    :closable="true"
    :mask-closable="false"
    @close="handleClose"
  >
    <TemplateForm
      v-model="formData"
      :mode="mode"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleClose"
    />
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import TemplateForm from '@/forms/margin/TemplateForm.vue'
import type { MarginTemplate } from '@/contracts/config'

interface Props {
  open: boolean
  template?: MarginTemplate | null
  mode?: 'create' | 'edit' | 'view'
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', value: any): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  template: null,
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formData = ref<MarginTemplate | null>(null)

const title = computed(() => {
  switch (props.mode) {
    case 'create':
      return 'Create Margin Template'
    case 'edit':
      return 'Edit Margin Template'
    case 'view':
      return 'View Margin Template'
    default:
      return 'Margin Template'
  }
})

watch(
  () => props.template,
  (newValue) => {
    formData.value = newValue ? JSON.parse(JSON.stringify(newValue)) : null
  },
  { immediate: true }
)

function handleSubmit(value: any) {
  emit('submit', value)
}

function handleClose() {
  emit('update:open', false)
  emit('close')
}
</script>
