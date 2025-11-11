<template>
  <SchemaForm
    v-model="formData"
    :schema="formSchema"
    :mode="mode"
    :enable-draft="mode !== 'view'"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SchemaForm from '@/shared/SchemaForm.vue'
import type { FormSchema } from '@/types/components'
import type { MaintenanceWindow } from '@/contracts/calendar'

interface Props {
  maintenance?: MaintenanceWindow | null
  mode?: 'create' | 'edit' | 'view'
}

interface Emits {
  (e: 'submit', payload: Partial<MaintenanceWindow>): void
}

const props = withDefaults(defineProps<Props>(), {
  maintenance: null,
  mode: 'create',
})

const emit = defineEmits<Emits>()

const formData = ref<Partial<MaintenanceWindow>>({
  title: '',
  description: '',
  startTime: '',
  endTime: '',
  affectedScope: [],
  announcementPush: true,
})

const scopeOptions = [
  { label: 'Trading', value: 'trading' },
  { label: 'Deposits', value: 'deposits' },
  { label: 'Withdrawals', value: 'withdrawals' },
  { label: 'API', value: 'api' },
  { label: 'Website', value: 'website' },
  { label: 'Mobile App', value: 'mobile' },
]

const formSchema = computed<FormSchema>(() => ({
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'input',
      rules: [{ required: true, message: 'Please enter title' }],
      props: {
        placeholder: 'e.g., System Maintenance',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      rules: [{ required: true, message: 'Please enter description' }],
      props: {
        placeholder: 'Describe the maintenance activity',
        rows: 3,
      },
    },
    {
      name: 'startTime',
      label: 'Start Time',
      type: 'date',
      rules: [{ required: true, message: 'Please select start time' }],
      props: {
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      name: 'endTime',
      label: 'End Time',
      type: 'date',
      rules: [
        { required: true, message: 'Please select end time' },
        {
          validator: (_rule: any, value: string) => {
            if (value && formData.value.startTime) {
              const start = new Date(formData.value.startTime).getTime()
              const end = new Date(value).getTime()
              if (end <= start) {
                return Promise.reject('End time must be after start time')
              }
            }
            return Promise.resolve()
          },
        },
      ],
      props: {
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      name: 'affectedScope',
      label: 'Affected Scope',
      type: 'select',
      rules: [{ required: true, message: 'Please select affected scope' }],
      options: scopeOptions,
      props: {
        mode: 'multiple',
        placeholder: 'Select affected services',
      },
    },
    {
      name: 'announcementPush',
      label: 'Push Announcement',
      type: 'switch',
      props: {
        checkedChildren: 'Yes',
        unCheckedChildren: 'No',
      },
    },
  ],
  layout: 'vertical',
}))

watch(
  () => props.maintenance,
  (newMaintenance) => {
    if (newMaintenance) {
      formData.value = { ...newMaintenance }
    } else {
      formData.value = {
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        affectedScope: [],
        announcementPush: true,
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  emit('submit', formData.value)
}
</script>
