<template>
  <a-modal
    :visible="visible"
    :title="modalTitle"
    :width="720"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <NavApiForm
      v-if="type === 'nav-to-api'"
      ref="formRef"
      :initial-data="initialData"
      :mode="mode"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <RedirectForm
      v-else-if="type === 'redirect'"
      ref="formRef"
      :initial-data="initialData"
      :mode="mode"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <PageApiForm
      v-else-if="type === 'page-to-api'"
      ref="formRef"
      :initial-data="initialData"
      :mode="mode"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import NavApiForm from '@/forms/mappings/NavApiForm.vue'
import RedirectForm from '@/forms/mappings/RedirectForm.vue'
import PageApiForm from '@/forms/mappings/PageApiForm.vue'

interface Props {
  visible: boolean
  type: 'nav-to-api' | 'redirect' | 'page-to-api'
  initialData?: any
  mode?: 'create' | 'edit'
  loading?: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'submit', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formRef = ref()

const modalTitle = computed(() => {
  const action = props.mode === 'create' ? 'Create' : 'Edit'
  const typeLabel = {
    'nav-to-api': 'Nav to API Mapping',
    redirect: 'Route Redirect',
    'page-to-api': 'Page to API Relation',
  }[props.type]
  return `${action} ${typeLabel}`
})

function handleOk() {
  // Trigger form submission
  if (formRef.value) {
    formRef.value.$el.querySelector('form')?.requestSubmit()
  }
}

function handleSubmit(data: any) {
  emit('submit', data)
}

function handleCancel() {
  emit('update:visible', false)
}
</script>
