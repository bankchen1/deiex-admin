<template>
  <div class="schema-form-demo">
    <a-card title="SchemaForm Component Demo" style="margin-bottom: 24px">
      <a-space direction="vertical" style="width: 100%" :size="24">
        <!-- Basic Form -->
        <a-card type="inner" title="1. Basic Form with All Field Types">
          <SchemaForm
            ref="basicFormRef"
            v-model="basicFormData"
            :schema="basicSchema"
            @submit="handleBasicSubmit"
            @cancel="handleCancel"
          />
        </a-card>

        <!-- Form with Visibility and Disabled Logic -->
        <a-card type="inner" title="2. Dynamic Visibility and Disabled Logic">
          <a-alert
            message="Toggle the 'Enable Advanced Options' switch to show/hide fields"
            type="info"
            show-icon
            style="margin-bottom: 16px"
          />
          <SchemaForm
            v-model="dynamicFormData"
            :schema="dynamicSchema"
            @submit="handleDynamicSubmit"
            @cancel="handleCancel"
          />
        </a-card>

        <!-- Form with Async Validation -->
        <a-card type="inner" title="3. Async Validation">
          <a-alert
            message="Try entering 'admin' as username - it will be rejected by async validation"
            type="info"
            show-icon
            style="margin-bottom: 16px"
          />
          <SchemaForm
            v-model="asyncFormData"
            :schema="asyncValidationSchema"
            @submit="handleAsyncSubmit"
            @cancel="handleCancel"
          />
        </a-card>

        <!-- Form with Draft Auto-save -->
        <a-card type="inner" title="4. Draft Auto-save">
          <a-alert
            message="Start filling the form, then refresh the page - your data will be restored"
            type="info"
            show-icon
            style="margin-bottom: 16px"
          />
          <SchemaForm
            v-model="draftFormData"
            :schema="draftSchema"
            enable-draft
            @submit="handleDraftSubmit"
            @cancel="handleCancel"
          />
        </a-card>

        <!-- Form with Dependent Fields -->
        <a-card type="inner" title="5. Dependent Fields">
          <a-alert
            message="Select a country to load its cities dynamically"
            type="info"
            show-icon
            style="margin-bottom: 16px"
          />
          <SchemaForm
            v-model="dependentFormData"
            :schema="dependentSchema"
            @submit="handleDependentSubmit"
            @cancel="handleCancel"
          />
        </a-card>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import SchemaForm from '@/shared/SchemaForm.vue'
import type { FormSchema } from '@/types/components'

// Basic form
const basicFormRef = ref()
const basicFormData = ref({
  username: '',
  email: '',
  age: undefined,
  bio: '',
  country: undefined,
  birthdate: undefined,
  newsletter: false,
  config: '{}',
  icon: '',
})

const basicSchema: FormSchema = {
  fields: [
    {
      name: 'username',
      label: 'Username',
      type: 'input',
      placeholder: 'Enter username',
      rules: [
        { required: true, message: 'Username is required' },
        { min: 3, max: 20, message: 'Username must be 3-20 characters' },
      ],
    },
    {
      name: 'email',
      label: 'Email',
      type: 'input',
      placeholder: 'Enter email',
      rules: [
        { required: true, message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' },
      ],
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      placeholder: 'Enter age',
      props: { min: 1, max: 120 },
      rules: [{ required: true, message: 'Age is required' }],
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      placeholder: 'Tell us about yourself',
      props: { rows: 4 },
    },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      placeholder: 'Select country',
      options: [
        { label: 'United States', value: 'us' },
        { label: 'United Kingdom', value: 'uk' },
        { label: 'Canada', value: 'ca' },
        { label: 'Australia', value: 'au' },
      ],
      rules: [{ required: true, message: 'Country is required' }],
    },
    {
      name: 'birthdate',
      label: 'Birth Date',
      type: 'date',
      placeholder: 'Select date',
      props: { format: 'YYYY-MM-DD' },
    },
    {
      name: 'newsletter',
      label: 'Subscribe to Newsletter',
      type: 'switch',
    },
    {
      name: 'config',
      label: 'JSON Config',
      type: 'json',
      help: 'Enter valid JSON configuration',
    },
    {
      name: 'icon',
      label: 'Icon',
      type: 'icon-picker',
      placeholder: 'Select an icon',
    },
  ],
  layout: 'horizontal',
}

// Dynamic form
const dynamicFormData = ref({
  enableAdvanced: false,
  basicOption: '',
  advancedOption1: '',
  advancedOption2: '',
})

const dynamicSchema: FormSchema = {
  fields: [
    {
      name: 'enableAdvanced',
      label: 'Enable Advanced Options',
      type: 'switch',
    },
    {
      name: 'basicOption',
      label: 'Basic Option',
      type: 'input',
      placeholder: 'Always visible',
    },
    {
      name: 'advancedOption1',
      label: 'Advanced Option 1',
      type: 'input',
      placeholder: 'Only visible when advanced is enabled',
      visible: (values) => values.enableAdvanced === true,
      rules: [{ required: true, message: 'This field is required when advanced is enabled' }],
    },
    {
      name: 'advancedOption2',
      label: 'Advanced Option 2',
      type: 'select',
      placeholder: 'Disabled when advanced is off',
      options: [
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' },
        { label: 'Option C', value: 'c' },
      ],
      disabled: (values) => !values.enableAdvanced,
    },
  ],
  layout: 'horizontal',
}

// Async validation form
const asyncFormData = ref({
  username: '',
  email: '',
})

// Simulate async username check
const checkUsernameAvailable = async (username: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const takenUsernames = ['admin', 'root', 'test']
  return !takenUsernames.includes(username.toLowerCase())
}

const asyncValidationSchema: FormSchema = {
  fields: [
    {
      name: 'username',
      label: 'Username',
      type: 'input',
      placeholder: 'Enter username',
      rules: [
        { required: true, message: 'Username is required' },
        { min: 3, message: 'Username must be at least 3 characters' },
      ],
      asyncValidator: async (value: string) => {
        if (!value) return
        const isAvailable = await checkUsernameAvailable(value)
        if (!isAvailable) {
          throw new Error('Username is already taken')
        }
      },
    },
    {
      name: 'email',
      label: 'Email',
      type: 'input',
      placeholder: 'Enter email',
      rules: [
        { required: true, message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' },
      ],
    },
  ],
  layout: 'horizontal',
}

// Draft form
const draftFormData = ref({
  title: '',
  content: '',
  category: undefined,
})

const draftSchema: FormSchema = {
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'input',
      placeholder: 'Enter title',
      rules: [{ required: true, message: 'Title is required' }],
    },
    {
      name: 'content',
      label: 'Content',
      type: 'textarea',
      placeholder: 'Enter content',
      props: { rows: 6 },
      rules: [{ required: true, message: 'Content is required' }],
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      placeholder: 'Select category',
      options: [
        { label: 'Technology', value: 'tech' },
        { label: 'Business', value: 'business' },
        { label: 'Lifestyle', value: 'lifestyle' },
      ],
    },
  ],
  layout: 'horizontal',
}

// Dependent fields form
const dependentFormData = ref({
  country: undefined,
  city: undefined,
})

// Simulate async city loading based on country
const loadCities = async (country: string): Promise<{ label: string; value: string }[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const citiesByCountry: Record<string, { label: string; value: string }[]> = {
    us: [
      { label: 'New York', value: 'ny' },
      { label: 'Los Angeles', value: 'la' },
      { label: 'Chicago', value: 'chi' },
    ],
    uk: [
      { label: 'London', value: 'lon' },
      { label: 'Manchester', value: 'man' },
      { label: 'Birmingham', value: 'bir' },
    ],
    ca: [
      { label: 'Toronto', value: 'tor' },
      { label: 'Vancouver', value: 'van' },
      { label: 'Montreal', value: 'mon' },
    ],
  }
  return citiesByCountry[country] || []
}

const dependentSchema: FormSchema = {
  fields: [
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      placeholder: 'Select country',
      options: [
        { label: 'United States', value: 'us' },
        { label: 'United Kingdom', value: 'uk' },
        { label: 'Canada', value: 'ca' },
      ],
      rules: [{ required: true, message: 'Country is required' }],
    },
    {
      name: 'city',
      label: 'City',
      type: 'select',
      placeholder: 'Select city',
      options: async () => {
        if (!dependentFormData.value.country) return []
        return await loadCities(dependentFormData.value.country)
      },
      dependsOn: ['country'],
      rules: [{ required: true, message: 'City is required' }],
      disabled: (values) => !values.country,
    },
  ],
  layout: 'horizontal',
}

// Event handlers
function handleBasicSubmit(values: Record<string, any>) {
  console.log('Basic form submitted:', values)
  message.success('Basic form submitted successfully!')
}

function handleDynamicSubmit(values: Record<string, any>) {
  console.log('Dynamic form submitted:', values)
  message.success('Dynamic form submitted successfully!')
}

function handleAsyncSubmit(values: Record<string, any>) {
  console.log('Async validation form submitted:', values)
  message.success('Async validation form submitted successfully!')
}

function handleDraftSubmit(values: Record<string, any>) {
  console.log('Draft form submitted:', values)
  message.success('Draft form submitted successfully!')
}

function handleDependentSubmit(values: Record<string, any>) {
  console.log('Dependent form submitted:', values)
  message.success('Dependent form submitted successfully!')
}

function handleCancel() {
  message.info('Form cancelled')
}
</script>

<style scoped>
.schema-form-demo {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
}
</style>
