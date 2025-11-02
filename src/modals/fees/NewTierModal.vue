<template>
  <a-modal
    :open="open"
    :title="title"
    :width="600"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <TradingTierForm
      ref="formRef"
      :trading-fee="tradingFee"
      :mode="mode"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <template #footer>
      <a-button @click="handleCancel">Cancel</a-button>
      <a-button type="primary" :loading="loading" @click="handleOk">
        {{ mode === 'create' ? 'Create' : 'Update' }}
      </a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TradingTierForm from '@/forms/fees/TradingTierForm.vue'
import type { TradingFeeTemplate } from '@/types/models'

interface Props {
  open: boolean
  tradingFee?: TradingFeeTemplate | null
  mode?: 'create' | 'edit'
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', payload: any): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  tradingFee: null,
  mode: 'create',
  loading: false,
})

const emit = defineEmits<Emits>()

const formRef = ref<InstanceType<typeof TradingTierForm>>()

const title = computed(() => {
  return props.mode === 'create' ? 'Create Trading Fee Tier' : 'Edit Trading Fee Tier'
})

function handleOk() {
  formRef.value?.resetFields()
}

function handleSubmit(payload: any) {
  emit('submit', payload)
}

function handleCancel() {
  emit('update:open', false)
  emit('close')
}
</script>
