<template>
  <SchemaForm v-model="formData" :schema="formSchema" :mode="mode" @submit="handleSubmit" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SchemaForm from '@/shared/SchemaForm.vue'
import type { FormSchema } from '@/types/components'
import type { CreateRolePayload, UpdateRolePayload } from '@/services/api/config.security'

interface Props {
  initialData?: Partial<CreateRolePayload>
  mode?: 'create' | 'edit' | 'view'
  availablePermissions?: string[]
}

interface Emits {
  (e: 'submit', data: CreateRolePayload | UpdateRolePayload): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  availablePermissions: () => [],
})

const emit = defineEmits<Emits>()

const formData = ref<Partial<CreateRolePayload>>({
  name: '',
  description: '',
  permissions: [],
})

const formSchema = computed<FormSchema>(() => ({
  fields: [
    {
      name: 'name',
      label: 'Role Name',
      type: 'input',
      rules: [
        { required: true, message: 'Please enter role name' },
        { min: 2, max: 50, message: 'Role name must be 2-50 characters' },
      ],
      props: {
        placeholder: 'e.g., KYC Reviewer, Finance Manager',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      rules: [{ required: true, message: 'Please enter description' }],
      props: {
        placeholder: 'Describe the role and its responsibilities',
        rows: 3,
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
  emit('submit', formData.value as CreateRolePayload)
}
</script>
