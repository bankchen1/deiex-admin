<template>
  <a-drawer :open="open" :title="title" :width="720" placement="right" @close="handleClose">
    <WithdrawFeeForm
      ref="formRef"
      :withdrawal-fee="withdrawalFee"
      :mode="mode"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleClose"
    />
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WithdrawFeeForm from '@/forms/fees/WithdrawFeeForm.vue'
import type { WithdrawalFeeTemplate } from '@/types/models'

interface Props {
  open: boolean
  withdrawalFee?: WithdrawalFeeTemplate | null
  mode?: 'create' | 'edit' | 'view'
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', payload: any): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  withdrawalFee: null,
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formRef = ref<InstanceType<typeof WithdrawFeeForm>>()

const title = computed(() => {
  if (props.mode === 'view') return 'View Withdrawal Fee'
  return props.mode === 'create' ? 'Create Withdrawal Fee' : 'Edit Withdrawal Fee'
})

function handleSubmit(payload: any) {
  emit('submit', payload)
}

function handleClose() {
  emit('update:open', false)
  emit('close')
}
</script>
