<template>
  <a-modal
    :open="open"
    title="Bulk Bind Symbols"
    :width="600"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <BindingForm
      ref="formRef"
      :templates="templates"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BindingForm from '@/forms/margin/BindingForm.vue'
import type { MarginTemplate } from '@/types/models'

interface Props {
  open: boolean
  templates: MarginTemplate[]
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', value: { templateId: string; symbols: string[] }): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const formRef = ref()

function handleOk() {
  // Trigger form submission
  formRef.value?.handleSubmit()
}

function handleSubmit(value: { templateId: string; symbols: string[] }) {
  emit('submit', value)
}

function handleCancel() {
  emit('update:open', false)
  emit('close')
}
</script>
