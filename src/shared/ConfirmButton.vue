<template>
  <a-popconfirm
    :title="confirmTitle"
    :description="confirmDescription"
    :ok-text="okText"
    :cancel-text="cancelText"
    :ok-type="okType"
    @confirm="handleConfirm"
  >
    <a-button :type="type" :danger="danger" :loading="loading" :disabled="disabled" v-bind="$attrs">
      <template v-if="$slots.icon" #icon>
        <slot name="icon" />
      </template>
      <slot />
    </a-button>
  </a-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  confirmTitle?: string
  confirmDescription?: string
  okText?: string
  cancelText?: string
  okType?: 'primary' | 'danger' | 'default'
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  danger?: boolean
  disabled?: boolean
  requireSecondaryConfirm?: boolean
  secondaryConfirmText?: string
}

interface Emits {
  (e: 'confirm'): void | Promise<void>
}

const { t } = useI18n()

const props = withDefaults(defineProps<Props>(), {
  confirmTitle: () => t('messages.confirmAction'),
  confirmDescription: '',
  okText: () => t('common.confirm'),
  cancelText: () => t('common.cancel'),
  okType: 'primary',
  type: 'default',
  danger: false,
  disabled: false,
  requireSecondaryConfirm: false,
  secondaryConfirmText: 'Please type CONFIRM to proceed',
})

const emit = defineEmits<Emits>()

const loading = ref(false)

async function handleConfirm(): Promise<void> {
  // If secondary confirmation is required for dangerous operations
  if (props.requireSecondaryConfirm) {
    const { Modal } = await import('ant-design-vue')

    return new Promise((resolve, reject) => {
      let inputValue = ''

      Modal.confirm({
        title: 'Secondary Confirmation Required',
        content: () => {
          const { createVNode, h } = require('vue')
          const { Input } = require('ant-design-vue')

          return h('div', [
            h('p', { style: { marginBottom: '12px' } }, props.secondaryConfirmText),
            h(Input, {
              placeholder: 'Type CONFIRM',
              onInput: (e: Event) => {
                inputValue = (e.target as HTMLInputElement).value
              },
            }),
          ])
        },
        okText: 'Proceed',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          if (inputValue.toUpperCase() === 'CONFIRM') {
            loading.value = true
            try {
              await emit('confirm')
              resolve()
            } catch (error) {
              reject(error)
            } finally {
              loading.value = false
            }
          } else {
            const { message } = await import('ant-design-vue')
            message.error('Confirmation text does not match')
            reject(new Error('Confirmation failed'))
          }
        },
        onCancel: () => {
          reject(new Error('Cancelled'))
        },
      })
    })
  } else {
    // Simple confirmation
    loading.value = true
    try {
      await emit('confirm')
    } finally {
      loading.value = false
    }
  }
}
</script>
