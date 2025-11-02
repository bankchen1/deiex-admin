# Specialized Input Components

This document provides comprehensive documentation for the specialized input components in the DEIEX Admin system.

## Overview

The specialized input components provide advanced input functionality with validation, search, preview, and other features. These components are designed to be reusable across the application and follow consistent design patterns.

## Components

### 1. IconPicker

A component for selecting icons from Ant Design Icons or custom uploaded icons with search and preview functionality.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Selected icon name or ID |
| `placeholder` | `string` | `'Select an icon'` | Input placeholder text |
| `disabled` | `boolean` | `false` | Whether the picker is disabled |
| `customIcons` | `CustomIcon[]` | `[]` | Array of custom icon objects |

#### CustomIcon Interface

```typescript
interface CustomIcon {
  id: string        // Unique identifier
  name: string      // Display name
  url: string       // Icon image URL
}
```

#### Events

- `update:modelValue` - Emitted when icon selection changes
- `change` - Emitted when icon selection changes (with icon name/ID)

#### Usage Example

```vue
<template>
  <IconPicker
    v-model="selectedIcon"
    placeholder="Choose an icon"
    :custom-icons="customIcons"
    @change="handleIconChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconPicker from '@/shared/IconPicker.vue'

const selectedIcon = ref('HomeOutlined')
const customIcons = ref([
  { id: 'btc', name: 'Bitcoin', url: 'https://example.com/btc.svg' },
  { id: 'eth', name: 'Ethereum', url: 'https://example.com/eth.svg' },
])

function handleIconChange(icon: string) {
  console.log('Selected icon:', icon)
}
</script>
```

#### Features

- Search functionality for filtering icons
- Tabbed interface for Ant Design Icons and Custom Icons
- Preview of selected icon
- Grid layout for easy browsing
- Support for both component-based and image-based icons

---

### 2. ImageUploader

A component for uploading images with validation for size, dimensions, and format.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| string[]` | `''` | Uploaded image URL(s) |
| `listType` | `'text' \| 'picture' \| 'picture-card'` | `'picture-card'` | Upload list display type |
| `accept` | `string` | `'image/*'` | Accepted file types |
| `maxCount` | `number` | `1` | Maximum number of files |
| `maxSize` | `number` | `5242880` | Maximum file size in bytes (default 5MB) |
| `maxWidth` | `number` | `2048` | Maximum image width in pixels |
| `maxHeight` | `number` | `2048` | Maximum image height in pixels |
| `disabled` | `boolean` | `false` | Whether the uploader is disabled |
| `uploadText` | `string` | `'Upload'` | Upload button text |
| `showValidation` | `boolean` | `true` | Show validation rules below uploader |
| `uploadFn` | `(file: File) => Promise<string>` | `undefined` | Custom upload function |

#### Events

- `update:modelValue` - Emitted when upload completes
- `change` - Emitted when upload completes (with image URL)

#### Usage Example

```vue
<template>
  <ImageUploader
    v-model="imageUrl"
    :max-size="2 * 1024 * 1024"
    :max-width="1920"
    :max-height="1080"
    accept="image/png,image/jpeg"
    upload-text="Upload Logo"
    :upload-fn="uploadToServer"
    @change="handleImageChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ImageUploader from '@/shared/ImageUploader.vue'

const imageUrl = ref('')

async function uploadToServer(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
  
  const data = await response.json()
  return data.url
}

function handleImageChange(url: string) {
  console.log('Image uploaded:', url)
}
</script>
```

#### Features

- File size validation
- Image dimension validation
- File type validation
- Preview modal for uploaded images
- Support for single or multiple uploads
- Custom upload function support
- Default base64 conversion if no upload function provided
- Visual validation rules display

---

### 3. JsonEditor

A component for editing JSON with syntax highlighting, formatting, validation, and copy functionality.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| object` | `''` | JSON content (string or object) |
| `placeholder` | `string` | `'Enter JSON...'` | Placeholder text |
| `disabled` | `boolean` | `false` | Whether the editor is disabled |
| `rows` | `number` | `10` | Number of textarea rows |
| `autoSize` | `boolean \| { minRows?: number; maxRows?: number }` | `false` | Auto-size configuration |
| `showLineNumbers` | `boolean` | `false` | Show line numbers |
| `autoFormat` | `boolean` | `false` | Auto-format on blur |
| `autoValidate` | `boolean` | `true` | Auto-validate on change |

#### Events

- `update:modelValue` - Emitted when content changes
- `change` - Emitted when content changes

#### Usage Example

```vue
<template>
  <JsonEditor
    v-model="jsonData"
    :rows="12"
    auto-format
    auto-validate
    show-line-numbers
    @change="handleJsonChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JsonEditor from '@/shared/JsonEditor.vue'

const jsonData = ref({
  name: 'DEIEX',
  version: '1.0.0',
  features: ['trading', 'kyc', 'assets']
})

function handleJsonChange(value: string) {
  console.log('JSON changed:', value)
}
</script>
```

#### Features

- Format button for pretty-printing JSON
- Minify button for compacting JSON
- Copy to clipboard functionality
- Validate button for manual validation
- Real-time validation with error messages
- Visual indicators for valid/invalid JSON
- Monospace font for better readability
- Optional line numbers
- Auto-format on blur option

---

### 4. TagPicker

A component for multi-select tags with suggestions, presets, and custom color mapping.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string[]` | `[]` | Selected tag values |
| `placeholder` | `string` | `'Select or create tags'` | Placeholder text |
| `disabled` | `boolean` | `false` | Whether the picker is disabled |
| `maxTagCount` | `number \| 'responsive'` | `'responsive'` | Maximum visible tags |
| `allowClear` | `boolean` | `true` | Show clear button |
| `options` | `TagOption[]` | `[]` | Predefined tag options |
| `suggestions` | `string[]` | `[]` | Suggested tags |
| `presets` | `TagPreset[]` | `[]` | Tag presets |
| `showSuggestions` | `boolean` | `true` | Show suggestions section |
| `showPresets` | `boolean` | `false` | Show presets section |
| `colorMap` | `Record<string, string>` | `{}` | Custom color mapping |

#### Interfaces

```typescript
interface TagOption {
  label: string
  value: string
  color?: string
}

interface TagPreset {
  name: string
  tags: string[]
}
```

#### Events

- `update:modelValue` - Emitted when tags change
- `change` - Emitted when tags change

#### Usage Example

```vue
<template>
  <TagPicker
    v-model="selectedTags"
    placeholder="Select risk tags"
    :options="tagOptions"
    :suggestions="suggestions"
    :presets="presets"
    :color-map="colorMap"
    show-suggestions
    show-presets
    @change="handleTagChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TagPicker from '@/shared/TagPicker.vue'

const selectedTags = ref(['high-risk', 'vip'])

const tagOptions = [
  { label: 'High Risk', value: 'high-risk', color: 'red' },
  { label: 'VIP', value: 'vip', color: 'gold' },
  { label: 'Verified', value: 'verified', color: 'green' },
]

const suggestions = ['whale', 'active-trader', 'institutional']

const presets = [
  { name: 'Risk Tags', tags: ['high-risk', 'suspicious'] },
  { name: 'VIP Tags', tags: ['vip', 'whale'] },
]

const colorMap = {
  whale: 'purple',
  'active-trader': 'cyan',
}

function handleTagChange(tags: string[]) {
  console.log('Tags changed:', tags)
}
</script>
```

#### Features

- Multi-select with tags mode
- Create custom tags on the fly
- Predefined tag options with colors
- Suggestions section for quick adding
- Presets for common tag combinations
- Custom color mapping
- Responsive tag display
- Search/filter functionality

---

### 5. SearchBar

A unified search and filtering component with multiple filter types and advanced options.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `'Search...'` | Search input placeholder |
| `searchWidth` | `string` | `'300px'` | Search input width |
| `filters` | `Filter[]` | `[]` | Primary filter fields |
| `advancedFilters` | `Filter[]` | `[]` | Advanced filter fields |
| `showAdvanced` | `boolean` | `false` | Show advanced filters toggle |
| `autoSearch` | `boolean` | `false` | Auto-search on filter change |
| `debounceTime` | `number` | `500` | Debounce time for auto-search (ms) |

#### Filter Interface

```typescript
interface Filter {
  key: string
  type: 'select' | 'date-range' | 'number-range' | 'input'
  placeholder?: string | string[]
  width?: string
  options?: FilterOption[]
  mode?: 'multiple' | 'tags'
  allowClear?: boolean
  showTime?: boolean
  format?: string
  min?: number
  max?: number
}

interface FilterOption {
  label: string
  value: string | number
}
```

#### Events

- `search` - Emitted when search is triggered (query: string, filters: Record<string, any>)
- `reset` - Emitted when reset is clicked

#### Usage Example

```vue
<template>
  <SearchBar
    placeholder="Search users..."
    search-width="400px"
    :filters="filters"
    :advanced-filters="advancedFilters"
    show-advanced
    auto-search
    @search="handleSearch"
    @reset="handleReset"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from '@/shared/SearchBar.vue'

const filters = [
  {
    key: 'status',
    type: 'select',
    placeholder: 'Status',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  {
    key: 'dateRange',
    type: 'date-range',
    placeholder: ['Start Date', 'End Date'],
    width: '300px',
  },
]

const advancedFilters = [
  {
    key: 'country',
    type: 'input',
    placeholder: 'Country',
  },
  {
    key: 'balanceRange',
    type: 'number-range',
    placeholder: ['Min', 'Max'],
    min: 0,
  },
]

function handleSearch(query: string, filters: Record<string, any>) {
  console.log('Search:', query, filters)
  // Fetch data with search parameters
}

function handleReset() {
  console.log('Reset search')
  // Clear search results
}
</script>
```

#### Features

- Text search input with icon
- Multiple filter types:
  - Select (single/multiple)
  - Date range picker
  - Number range (min/max)
  - Text input
- Advanced filters toggle
- Auto-search with debounce
- Reset functionality
- Responsive layout with wrapping
- Filter state management

---

## Common Patterns

### Form Integration

All specialized input components can be easily integrated with SchemaForm:

```vue
<SchemaForm
  v-model="formData"
  :schema="{
    fields: [
      {
        name: 'icon',
        label: 'Icon',
        type: 'icon-picker',
        rules: [{ required: true, message: 'Please select an icon' }],
      },
      {
        name: 'logo',
        label: 'Logo',
        type: 'image-uploader',
        props: {
          maxSize: 1024 * 1024,
          accept: 'image/png',
        },
      },
      {
        name: 'config',
        label: 'Configuration',
        type: 'json-editor',
        props: {
          rows: 8,
          autoFormat: true,
        },
      },
      {
        name: 'tags',
        label: 'Tags',
        type: 'tag-picker',
        props: {
          options: tagOptions,
        },
      },
    ],
  }"
/>
```

### Validation

All components support validation through form validation rules:

```typescript
const rules = {
  icon: [
    { required: true, message: 'Please select an icon' },
  ],
  image: [
    { required: true, message: 'Please upload an image' },
  ],
  json: [
    { required: true, message: 'Please enter JSON data' },
    { validator: validateJSON, message: 'Invalid JSON format' },
  ],
  tags: [
    { type: 'array', min: 1, message: 'Please select at least one tag' },
  ],
}
```

### Accessibility

All components follow accessibility best practices:

- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader friendly
- High contrast support

## Demo

A comprehensive demo showcasing all specialized input components is available at:

```
/admin/examples/specialized-inputs
```

## Requirements Mapping

These components fulfill the following requirements:

- **Requirement 1.5**: Shared components including IconPicker
- **Requirement 12.5**: Icon picker component for selecting icons

## Related Components

- [SchemaForm](./SchemaForm.README.md) - Dynamic form generation
- [ServerTable](./ServerTable.README.md) - Server-side data table
- [VersionControl](./VersionControl.README.md) - Version control components

## Best Practices

1. **Always validate user input** - Use the built-in validation features
2. **Provide clear feedback** - Use the change events to show success/error messages
3. **Use appropriate defaults** - Set sensible default values for props
4. **Handle errors gracefully** - Implement proper error handling in custom upload functions
5. **Test with real data** - Test components with realistic data scenarios
6. **Consider performance** - Use debouncing for auto-search and large datasets
7. **Maintain consistency** - Use consistent styling and behavior across the application

## Troubleshooting

### IconPicker not showing custom icons

Ensure custom icons array has the correct structure with `id`, `name`, and `url` properties.

### ImageUploader validation failing

Check that `maxSize`, `maxWidth`, and `maxHeight` props are set correctly and match your requirements.

### JsonEditor showing errors for valid JSON

Ensure the JSON string is properly formatted. Use the Format button to auto-format.

### TagPicker colors not applying

Check that color values are valid Ant Design color names or hex codes in the `colorMap` prop.

### SearchBar not triggering search

Ensure `autoSearch` is set to `true` or manually click the Search button. Check that event handlers are properly bound.

## Support

For issues or questions about these components, please refer to:

- Component source code in `src/shared/`
- Demo implementations in `src/pages/examples/`
- Design document at `.kiro/specs/deiex-admin-vue/design.md`
