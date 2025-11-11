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
import type { Announcement } from '@/contracts/calendar'

interface Props {
  announcement?: Announcement | null
  mode?: 'create' | 'edit' | 'view'
}

interface Emits {
  (e: 'submit', payload: Partial<Announcement>): void
}

const props = withDefaults(defineProps<Props>(), {
  announcement: null,
  mode: 'create',
})

const emit = defineEmits<Emits>()

const formData = ref<Partial<Announcement>>({
  title: {
    en: '',
    zh: '',
  },
  content: {
    en: '',
    zh: '',
  },
  type: 'event',
  pinned: false,
  pushChannels: [],
  publishTime: '',
})

const typeOptions = [
  { label: 'Event', value: 'event' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Update', value: 'update' },
  { label: 'Promotion', value: 'promotion' },
  { label: 'Alert', value: 'alert' },
]

const channelOptions = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Push Notification', value: 'push' },
  { label: 'In-App', value: 'in-app' },
  { label: 'Website Banner', value: 'banner' },
]

const formSchema = computed<FormSchema>(() => ({
  fields: [
    {
      name: 'title.en',
      label: 'Title (English)',
      type: 'input',
      rules: [{ required: true, message: 'Please enter English title' }],
      props: {
        placeholder: 'Enter title in English',
      },
    },
    {
      name: 'title.zh',
      label: 'Title (Chinese)',
      type: 'input',
      props: {
        placeholder: 'Enter title in Chinese (optional)',
      },
    },
    {
      name: 'content.en',
      label: 'Content (English)',
      type: 'textarea',
      rules: [{ required: true, message: 'Please enter English content' }],
      props: {
        placeholder: 'Enter content in English',
        rows: 4,
      },
    },
    {
      name: 'content.zh',
      label: 'Content (Chinese)',
      type: 'textarea',
      props: {
        placeholder: 'Enter content in Chinese (optional)',
        rows: 4,
      },
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      rules: [{ required: true, message: 'Please select type' }],
      options: typeOptions,
      props: {
        placeholder: 'Select announcement type',
      },
    },
    {
      name: 'publishTime',
      label: 'Publish Time',
      type: 'date',
      rules: [{ required: true, message: 'Please select publish time' }],
      props: {
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      name: 'pushChannels',
      label: 'Push Channels',
      type: 'select',
      rules: [{ required: true, message: 'Please select at least one channel' }],
      options: channelOptions,
      props: {
        mode: 'multiple',
        placeholder: 'Select push channels',
      },
    },
    {
      name: 'pinned',
      label: 'Pin Announcement',
      type: 'switch',
      props: {
        checkedChildren: 'Pinned',
        unCheckedChildren: 'Normal',
      },
    },
  ],
  layout: 'vertical',
}))

watch(
  () => props.announcement,
  (newAnnouncement) => {
    if (newAnnouncement) {
      formData.value = { ...newAnnouncement }
    } else {
      formData.value = {
        title: {
          en: '',
          zh: '',
        },
        content: {
          en: '',
          zh: '',
        },
        type: 'event',
        pinned: false,
        pushChannels: [],
        publishTime: '',
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  emit('submit', formData.value)
}
</script>
