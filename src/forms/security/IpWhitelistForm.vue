<template>
  <SchemaForm v-model="formData" :schema="formSchema" :mode="mode" @submit="handleSubmit" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SchemaForm from '@/shared/SchemaForm.vue'
import type { FormSchema } from '@/types/components'
import type { CreateIpWhitelistPayload } from '@/services/api/config.security'

interface Props {
  initialData?: Partial<CreateIpWhitelistPayload>
  mode?: 'create' | 'edit' | 'view'
}

interface Emits {
  (e: 'submit', data: CreateIpWhitelistPayload): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
})

const emit = defineEmits<Emits>()

const formData = ref<Partial<CreateIpWhitelistPayload>>({
  ip: '',
  description: '',
  expiresAt: undefined,
})

const formSchema = computed<FormSchema>(() => ({
  fields: [
    {
      name: 'ip',
      label: 'IP Address',
      type: 'input',
      rules: [
        { required: true, message: 'Please enter IP address' },
        {
          pattern: /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/,
          message: 'Please enter a valid IP address or CIDR notation',
        },
      ],
      props: {
        placeholder: 'e.g., 192.168.1.1 or 192.168.1.0/24',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      rules: [{ required: true, message: 'Please enter description' }],
      props: {
        placeholder: 'Describe the purpose of this IP whitelist entry',
        rows: 3,
      },
    },
    {
      name: 'expiresAt',
      label: 'Expiration Date',
      type: 'date',
      props: {
        placeholder: 'Select expiration date (optional)',
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ],
  layout: 'vertical',
}))

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = { ...newData }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  emit('submit', formData.value as CreateIpWhitelistPayload)
}
</script>
