<template>
  <SchemaForm v-model="formData" :schema="formSchema" :mode="mode" @submit="handleSubmit" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SchemaForm from '@/shared/SchemaForm.vue'
import type { FormSchema } from '@/types/components'
import type { CreateAdminUserPayload, UpdateAdminUserPayload } from '@/services/api/config.security'

interface Props {
  initialData?: Partial<CreateAdminUserPayload>
  mode?: 'create' | 'edit' | 'view'
  availableRoles?: Array<{ id: string; name: string }>
}

interface Emits {
  (e: 'submit', data: CreateAdminUserPayload | UpdateAdminUserPayload): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  availableRoles: () => [],
})

const emit = defineEmits<Emits>()

const formData = ref<Partial<CreateAdminUserPayload>>({
  username: '',
  email: '',
  password: '',
  roles: [],
})

const formSchema = computed<FormSchema>(() => ({
  fields: [
    {
      name: 'username',
      label: 'Username',
      type: 'input',
      rules: [
        { required: true, message: 'Please enter username' },
        { min: 3, max: 30, message: 'Username must be 3-30 characters' },
        {
          pattern: /^[a-zA-Z0-9_-]+$/,
          message: 'Username can only contain letters, numbers, underscore and hyphen',
        },
      ],
      props: {
        placeholder: 'Enter username',
        disabled: props.mode === 'edit',
      },
    },
    {
      name: 'email',
      label: 'Email',
      type: 'input',
      rules: [
        { required: true, message: 'Please enter email' },
        { type: 'email', message: 'Please enter a valid email' },
      ],
      props: {
        placeholder: 'Enter email address',
      },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'input',
      rules: [
        { required: props.mode === 'create', message: 'Please enter password' },
        { min: 8, message: 'Password must be at least 8 characters' },
      ],
      props: {
        type: 'password',
        placeholder:
          props.mode === 'create' ? 'Enter password' : 'Leave blank to keep current password',
        autocomplete: 'new-password',
      },
      visible: (values) => props.mode === 'create',
    },
    {
      name: 'roles',
      label: 'Roles',
      type: 'select',
      rules: [{ required: true, message: 'Please select at least one role' }],
      props: {
        mode: 'multiple',
        placeholder: 'Select roles',
        options: props.availableRoles.map((r) => ({
          label: r.name,
          value: r.id,
        })),
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      rules: [{ required: true, message: 'Please select status' }],
      props: {
        placeholder: 'Select status',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Disabled', value: 'disabled' },
        ],
      },
      visible: (values) => props.mode === 'edit',
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
  const payload = { ...formData.value }

  // Remove password if empty in edit mode
  if (props.mode === 'edit' && !payload.password) {
    delete payload.password
  }

  emit('submit', payload as CreateAdminUserPayload)
}
</script>
