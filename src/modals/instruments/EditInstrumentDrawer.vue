<template>
  <a-drawer
    :open="open"
    :title="title"
    :width="720"
    :closable="true"
    :footer-style="{ textAlign: 'right' }"
    @close="handleClose"
  >
    <InstrumentForm
      ref="formRef"
      :initial-data="instrument"
      :mode="mode"
      @submit="handleSubmit"
      @cancel="handleClose"
    />

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
import { ref, computed } from 'vue'
import InstrumentForm from '@/forms/instruments/InstrumentForm.vue'
import { useInstrumentsStore } from '@/stores/instruments'
import type { Instrument } from '@/types/models'
import type { InstrumentCreatePayload, InstrumentUpdatePayload } from '@/types/api'

interface Props {
  open: boolean
  instrument?: Instrument
  mode?: 'create' | 'edit' | 'view'
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
})

const emit = defineEmits<Emits>()

const instrumentsStore = useInstrumentsStore()
const formRef = ref()
const loading = ref(false)

const title = computed(() => {
  switch (props.mode) {
    case 'create':
      return 'Create Instrument'
    case 'edit':
      return 'Edit Instrument'
    case 'view':
      return 'View Instrument'
    default:
      return 'Instrument'
  }
})

function handleClose() {
  emit('update:open', false)
}

async function handleSave() {
  if (formRef.value && formRef.value.handleSubmit) {
    // Trigger form submission
    formRef.value.handleSubmit()
  }
}

async function handleSubmit(data: InstrumentCreatePayload | InstrumentUpdatePayload) {
  loading.value = true
  try {
    if (props.mode === 'create') {
      await instrumentsStore.createDraft(data as InstrumentCreatePayload)
    } else if (props.mode === 'edit' && props.instrument) {
      await instrumentsStore.updateDraft(props.instrument.symbol, data as InstrumentUpdatePayload)
    }
    emit('success')
    handleClose()
  } catch (error) {
    console.error('Failed to save instrument:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.ant-drawer-body) {
  padding: 24px;
}
</style>
