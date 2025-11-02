# SchemaForm Component

A powerful, dynamic form component that generates forms from JSON schema with support for validation, conditional fields, async operations, and draft auto-save.

## Features

- ✅ Dynamic form generation from JSON schema
- ✅ Multiple field types: input, select, number, date, switch, textarea, json, icon-picker
- ✅ Conditional field visibility and disabled state
- ✅ Synchronous and asynchronous validation
- ✅ Draft auto-save functionality
- ✅ Dependent field options loading
- ✅ Flexible layouts (horizontal, vertical, inline)
- ✅ TypeScript support with full type safety

## Basic Usage

```vue
<template>
  <SchemaForm
    :schema="formSchema"
    v-model="formData"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SchemaForm from '@/shared/SchemaForm.vue'
import type { FormSchema } from '@/types/components'

const formData = ref({
  username: '',
  email: '',
  age: undefined,
})

const formSchema: FormSchema = {
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
    },
  ],
  layout: 'horizontal',
}

function handleSubmit(values: Record<string, any>) {
  console.log('Form submitted:', values)
}

function handleCancel() {
  console.log('Form cancelled')
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `schema` | `FormSchema` | required | Form schema definition |
| `modelValue` | `Record<string, any>` | required | Form data (v-model) |
| `mode` | `'create' \| 'edit' \| 'view'` | `'create'` | Form mode |
| `enableDraft` | `boolean` | `false` | Enable draft auto-save |
| `enableDiff` | `boolean` | `false` | Enable diff viewer button |
| `hideActions` | `boolean` | `false` | Hide submit/cancel buttons |
| `submitText` | `string` | `'Submit'` | Submit button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `Record<string, any>` | Emitted when form data changes |
| `submit` | `Record<string, any>` | Emitted when form is submitted |
| `cancel` | - | Emitted when cancel button is clicked |
| `viewDiff` | - | Emitted when view diff button is clicked |

## Exposed Methods

```typescript
// Validate the form
const isValid = await formRef.value.validate()

// Reset all fields
formRef.value.resetFields()

// Clear validation errors
formRef.value.clearValidate()

// Access form data
const data = formRef.value.formData
```

## Field Types

### Input
```typescript
{
  name: 'username',
  label: 'Username',
  type: 'input',
  placeholder: 'Enter username',
  rules: [{ required: true, message: 'Required' }],
}
```

### Textarea
```typescript
{
  name: 'bio',
  label: 'Bio',
  type: 'textarea',
  placeholder: 'Tell us about yourself',
  props: { rows: 4 },
}
```

### Number
```typescript
{
  name: 'age',
  label: 'Age',
  type: 'number',
  props: { min: 1, max: 120, step: 1, precision: 0 },
}
```

### Select
```typescript
{
  name: 'country',
  label: 'Country',
  type: 'select',
  placeholder: 'Select country',
  options: [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
  ],
  // Or async options
  options: async () => {
    const response = await api.getCountries()
    return response.data
  },
}
```

### Date
```typescript
{
  name: 'birthdate',
  label: 'Birth Date',
  type: 'date',
  props: { 
    format: 'YYYY-MM-DD',
    showTime: false,
  },
}
```

### Switch
```typescript
{
  name: 'newsletter',
  label: 'Subscribe to Newsletter',
  type: 'switch',
}
```

### JSON Editor
```typescript
{
  name: 'config',
  label: 'Configuration',
  type: 'json',
  help: 'Enter valid JSON',
}
```

### Icon Picker
```typescript
{
  name: 'icon',
  label: 'Icon',
  type: 'icon-picker',
  placeholder: 'Select an icon',
}
```

## Advanced Features

### Conditional Visibility

Fields can be shown/hidden based on other field values:

```typescript
{
  name: 'advancedOption',
  label: 'Advanced Option',
  type: 'input',
  visible: (values) => values.enableAdvanced === true,
}
```

### Conditional Disabled State

Fields can be enabled/disabled based on other field values:

```typescript
{
  name: 'city',
  label: 'City',
  type: 'select',
  disabled: (values) => !values.country,
}
```

### Async Validation

Add custom async validation to fields:

```typescript
{
  name: 'username',
  label: 'Username',
  type: 'input',
  asyncValidator: async (value, values) => {
    const isAvailable = await checkUsernameAvailable(value)
    if (!isAvailable) {
      throw new Error('Username is already taken')
    }
  },
}
```

### Dependent Fields

Fields can reload their options when other fields change:

```typescript
const formSchema: FormSchema = {
  fields: [
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      options: [
        { label: 'United States', value: 'us' },
        { label: 'Canada', value: 'ca' },
      ],
    },
    {
      name: 'city',
      label: 'City',
      type: 'select',
      options: async () => {
        if (!formData.value.country) return []
        return await loadCities(formData.value.country)
      },
      dependsOn: ['country'], // Reload when country changes
    },
  ],
}
```

### Draft Auto-save

Enable draft auto-save to prevent data loss:

```vue
<SchemaForm
  :schema="formSchema"
  v-model="formData"
  enable-draft
  @submit="handleSubmit"
/>
```

Drafts are automatically saved to localStorage after 1 second of inactivity and restored when the form is mounted.

### Validation Rules

Supports all Ant Design Vue validation rules:

```typescript
rules: [
  { required: true, message: 'This field is required' },
  { min: 3, max: 20, message: 'Must be 3-20 characters' },
  { type: 'email', message: 'Invalid email format' },
  { pattern: /^[a-zA-Z0-9]+$/, message: 'Only alphanumeric characters' },
  { 
    validator: async (rule, value) => {
      if (value && value.length < 3) {
        throw new Error('Too short')
      }
    }
  },
]
```

### Layout Options

Three layout modes are supported:

```typescript
// Horizontal (default)
const schema: FormSchema = {
  fields: [...],
  layout: 'horizontal',
  labelWidth: 120, // Optional custom label width
}

// Vertical
const schema: FormSchema = {
  fields: [...],
  layout: 'vertical',
}

// Inline
const schema: FormSchema = {
  fields: [...],
  layout: 'inline',
}
```

## Complete Example

See `src/pages/examples/SchemaFormDemo.vue` for a comprehensive demo showcasing all features.

## TypeScript Types

```typescript
interface FormSchema {
  fields: FormField[]
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelWidth?: number
}

interface FormField {
  name: string
  label: string
  type: 'input' | 'select' | 'number' | 'date' | 'switch' | 'textarea' | 'json' | 'icon-picker'
  placeholder?: string
  help?: string
  rules?: ValidationRule[]
  visible?: (values: Record<string, any>) => boolean
  disabled?: (values: Record<string, any>) => boolean
  options?: SelectOption[] | (() => Promise<SelectOption[]>)
  props?: Record<string, any>
  asyncValidator?: (value: any, values: Record<string, any>) => Promise<void>
  dependsOn?: string[]
}

interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface ValidationRule {
  required?: boolean
  message?: string
  pattern?: RegExp
  min?: number
  max?: number
  len?: number
  type?: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'date' | ...
  validator?: (rule: any, value: any) => Promise<void>
  trigger?: 'change' | 'blur' | ['change', 'blur']
}
```

## Best Practices

1. **Use TypeScript**: Define your form schema with proper types for better IDE support
2. **Validation**: Combine synchronous rules with async validators for comprehensive validation
3. **Performance**: Use `dependsOn` to reload options only when necessary
4. **User Experience**: Provide clear placeholder text and help messages
5. **Draft Saving**: Enable draft auto-save for long forms to prevent data loss
6. **Conditional Logic**: Use `visible` and `disabled` functions to create dynamic forms
7. **Error Handling**: Always handle errors in async validators and option loaders

## Notes

- Draft data is stored in localStorage with a key based on the form schema
- Async validation runs after synchronous validation passes
- Dependent field options are reloaded automatically when dependency values change
- Form data is automatically synced with v-model
- All field types support the `props` property for passing additional props to the underlying component
