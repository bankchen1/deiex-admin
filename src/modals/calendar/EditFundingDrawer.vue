<template>
  <a-drawer
    :open="open"
    :title="drawerTitle"
    :width="720"
    :closable="true"
    :footer-style="{ textAlign: 'right' }"
    @close="handleClose"
  >
    <FundingRuleForm :funding="funding" :mode="mode" @submit="handleSubmit" />

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
import FundingRuleForm from '@/forms/calendar/FundingRuleForm.vue'
import type { FundingRule } from '@/types/models'

interface Props {
  open: boolean
  funding?: FundingRule | null
  mode?: 'create' | 'edit' | 'view'
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', payload: Partial<FundingRule>): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  funding: null,
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formRef = ref()

const drawerTitle = computed(() => {
  if (props.mode === 'create') return 'Create Funding Rule'
  if (props.mode === 'edit') return 'Edit Funding Rule'
  return 'View Funding Rule'
})

function handleClose() {
  emit('update:open', false)
  emit('close')
}

function handleSubmit(payload: Partial<FundingRule>) {
  emit('submit', payload)
}

function handleSave() {
  // Trigger form submission
  if (formRef.value) {
    formRef.value.submit()
  }
}
</script>
