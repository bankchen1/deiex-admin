<template>
  <SchemaForm v-model="formData" :schema="formSchema" :mode="mode" @submit="handleSubmit" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SchemaForm from '@/shared/SchemaForm.vue'
import type { FormSchema } from '@/types/components'
import type { CreateApiKeyPayload } from '@/services/api/config.security'

interface Props {
  initialData?: Partial<CreateApiKeyPayload>
  mode?: 'create' | 'edit' | 'view'
  availablePermissions?: string[]
}

interface Emits {
  (e: 'submit', data: CreateApiKeyPayload): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  availablePermissions: () => [],
})

const emit = defineEmits<Emits>()

const formData = ref<Partial<CreateApiKeyPayload>>({
  name: '',
  permissions: [],
  expiresAt: undefined,
})

const formSchema = computed<FormSchema>(() => ({
  fields: [
    {
      name: 'name',
      label: 'API Key Name',
      type: 'input',
      rules: [
        { required: true, message: 'Please enter API key name' },
        { min: 3, max: 50, message: 'Name must be 3-50 characters' },
      ],
      props: {
        placeholder: 'e.g., Production API Key, Integration Service',
      },
    },
    {
      name: 'permissions',
      label: 'Permissions',
      type: 'select',
      rules: [{ required: true, message: 'Please select at least one permission' }],
      props: {
        mode: 'multiple',
        placeholder: 'Select permissions',
        options: props.availablePermissions.map((p) => ({
          label: p,
          value: p,
        })),
        showSearch: true,
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().includes(input.toLowerCase())
        },
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
  emit('submit', formData.value as CreateApiKeyPayload)
}
</script>
