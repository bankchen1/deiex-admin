# Version Control Components

This document describes the VersionBar and DiffViewer components used for configuration management with draft/publish/rollback workflows.

## Overview

The version control components provide a complete solution for managing configuration changes with:
- Draft/publish workflow
- Version history tracking
- Rollback capabilities
- Side-by-side diff comparison
- Multiple diff formats (JSON, text, table)

## Components

### VersionBar

A component that displays version information and provides actions for publishing drafts, viewing diffs, and rolling back to previous versions.

#### Props

```typescript
interface VersionBarProps {
  currentVersion: string        // Current published version (e.g., "v1.2.3")
  draftExists: boolean          // Whether unpublished draft changes exist
  versions: Version[]           // Array of version history
  impactEstimation?: string     // Optional impact message for publishing
}

interface Version {
  id: string                    // Unique version identifier
  version: string               // Version number (e.g., "v1.2.3")
  createdAt: string            // ISO timestamp
  createdBy: string            // Admin user who created this version
  notes: string                // Version notes/changelog
  tags: string[]               // Tags (e.g., ["feature", "bugfix"])
}
```

#### Events

```typescript
interface Emits {
  // Emitted when user confirms publish with notes and tags
  (e: 'publish', data: { notes: string; tags: string[] }): Promise<void>
  
  // Emitted when user confirms rollback to a specific version
  (e: 'rollback', versionId: string): Promise<void>
  
  // Emitted when user clicks "View Diff" button
  (e: 'viewDiff'): void
}
```

#### Usage Example

```vue
<template>
  <VersionBar
    :current-version="currentVersion"
    :draft-exists="draftExists"
    :versions="versions"
    impact-estimation="This change will affect 42 instruments and 1,234 users."
    @publish="handlePublish"
    @rollback="handleRollback"
    @view-diff="handleViewDiff"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VersionBar } from '@/shared'
import type { Version } from '@/types/components'

const currentVersion = ref('v1.2.3')
const draftExists = ref(true)
const versions = ref<Version[]>([
  {
    id: '1',
    version: 'v1.2.3',
    createdAt: '2024-01-15T10:30:00Z',
    createdBy: 'admin@deiex.com',
    notes: 'Updated trading fees',
    tags: ['feature', 'fees'],
  },
  // ... more versions
])

async function handlePublish(data: { notes: string; tags: string[] }): Promise<void> {
  // Call API to publish draft
  await api.publishConfig(data)
  draftExists.value = false
}

async function handleRollback(versionId: string): Promise<void> {
  // Call API to rollback to version
  await api.rollbackConfig(versionId)
}

function handleViewDiff(): void {
  // Show diff modal
  showDiffModal.value = true
}
</script>
```

#### Features

1. **Current Version Display**: Shows the currently published version with a blue tag
2. **Draft Indicator**: Shows an orange "Draft Available" tag when unpublished changes exist
3. **Publish Button**: Opens a modal to add version notes and tags before publishing
4. **View Diff Button**: Triggers the diff viewer to show changes
5. **Version History Dropdown**: Lists all previous versions with:
   - Version number
   - Creator and timestamp
   - Version notes
   - Tags
   - Rollback button (for non-current versions)
6. **Impact Estimation**: Optional warning message shown in publish modal
7. **Confirmation Modals**: Separate modals for publish and rollback actions

---

### DiffViewer

A component that displays side-by-side comparison of two values in multiple formats.

#### Props

```typescript
interface DiffViewerProps {
  oldValue: any                 // Original value (can be object, string, etc.)
  newValue: any                 // New value to compare against
  format?: 'json' | 'text' | 'table'  // Display format (default: 'json')
  highlightChanges?: boolean    // Whether to highlight differences (default: true)
}
```

#### Usage Example

```vue
<template>
  <DiffViewer
    :old-value="publishedConfig"
    :new-value="draftConfig"
    format="table"
    :highlight-changes="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DiffViewer } from '@/shared'

const publishedConfig = ref({
  makerFee: 0.001,
  takerFee: 0.002,
  maxLeverage: 100,
})

const draftConfig = ref({
  makerFee: 0.0008,
  takerFee: 0.0015,
  maxLeverage: 125,
})
</script>
```

#### Display Formats

##### 1. JSON Format

Displays both values as formatted JSON side-by-side.

**Best for:**
- Complex nested objects
- Configuration files
- API responses

**Features:**
- Syntax highlighting
- Proper indentation
- Scrollable for large objects

##### 2. Text Format

Displays values as text with line-by-line comparison.

**Best for:**
- Plain text content
- Multi-line strings
- Documentation

**Features:**
- Line numbers
- Removed lines highlighted in red
- Added lines highlighted in green
- Line-by-line comparison

##### 3. Table Format

Displays differences in a table with field-by-field comparison.

**Best for:**
- Flat objects
- Configuration settings
- Form data

**Features:**
- Field name column
- Old value column
- New value column
- Status column (Changed/Unchanged)
- Changed values highlighted
- Sortable columns

#### Features

1. **Format Selector**: Radio buttons to switch between JSON, text, and table views
2. **Highlight Toggle**: Switch to enable/disable change highlighting
3. **Copy Button**: Copies the diff content to clipboard
4. **Side-by-Side Layout**: Two-column layout for easy comparison
5. **Column Headers**: Clear labels for "Old Version" and "New Version"
6. **Responsive**: Adapts to container width
7. **Scrollable**: Handles large content with scrolling

---

## Complete Workflow Example

Here's a complete example showing how to use both components together:

```vue
<template>
  <div class="config-management">
    <!-- Version Bar -->
    <VersionBar
      :current-version="currentVersion"
      :draft-exists="draftExists"
      :versions="versions"
      impact-estimation="This change will affect 15 instruments and 230 users."
      @publish="handlePublish"
      @rollback="handleRollback"
      @view-diff="showDiff = true"
    />

    <!-- Configuration Form -->
    <a-form layout="vertical">
      <a-form-item label="Maker Fee">
        <a-input-number
          v-model:value="draft.makerFee"
          @change="handleChange"
        />
      </a-form-item>
      <a-form-item label="Taker Fee">
        <a-input-number
          v-model:value="draft.takerFee"
          @change="handleChange"
        />
      </a-form-item>
    </a-form>

    <!-- Diff Modal -->
    <a-modal
      v-model:open="showDiff"
      title="Configuration Changes"
      width="80%"
      :footer="null"
    >
      <DiffViewer
        :old-value="published"
        :new-value="draft"
        format="table"
        :highlight-changes="true"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { VersionBar, DiffViewer } from '@/shared'
import type { Version } from '@/types/components'
import { configApi } from '@/services/api/config'

// State
const currentVersion = ref('v1.0.0')
const draftExists = ref(false)
const showDiff = ref(false)

const published = reactive({
  makerFee: 0.001,
  takerFee: 0.002,
})

const draft = reactive({
  makerFee: 0.001,
  takerFee: 0.002,
})

const versions = ref<Version[]>([])

// Load initial data
async function loadConfig() {
  const response = await configApi.getConfig()
  Object.assign(published, response.published)
  Object.assign(draft, response.draft || response.published)
  currentVersion.value = response.version
  draftExists.value = !!response.draft
  versions.value = response.versions
}

// Handle form changes
function handleChange() {
  draftExists.value = JSON.stringify(published) !== JSON.stringify(draft)
}

// Handle publish
async function handlePublish(data: { notes: string; tags: string[] }) {
  try {
    const response = await configApi.publish({
      config: draft,
      notes: data.notes,
      tags: data.tags,
    })
    
    Object.assign(published, draft)
    currentVersion.value = response.version
    draftExists.value = false
    versions.value.unshift(response.version)
    
    message.success('Configuration published successfully')
  } catch (error) {
    message.error('Failed to publish configuration')
  }
}

// Handle rollback
async function handleRollback(versionId: string) {
  try {
    const response = await configApi.rollback(versionId)
    
    Object.assign(published, response.config)
    Object.assign(draft, response.config)
    currentVersion.value = response.version
    draftExists.value = false
    
    message.success('Configuration rolled back successfully')
  } catch (error) {
    message.error('Failed to rollback configuration')
  }
}

// Initialize
loadConfig()
</script>
```

## Best Practices

### 1. Version Numbering

Use semantic versioning (MAJOR.MINOR.PATCH):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

### 2. Version Notes

Always provide clear, descriptive notes:
- What changed
- Why it changed
- Impact on users/system

### 3. Tags

Use consistent tags:
- `feature`: New functionality
- `bugfix`: Bug fixes
- `hotfix`: Urgent fixes
- `breaking`: Breaking changes
- `security`: Security updates

### 4. Impact Estimation

Provide impact information when available:
- Number of affected users
- Number of affected instruments
- Expected downtime
- Required actions

### 5. Diff Format Selection

Choose the appropriate format:
- **JSON**: For complex nested structures
- **Text**: For documentation or multi-line content
- **Table**: For flat configuration objects

### 6. Error Handling

Always handle errors gracefully:
```typescript
async function handlePublish(data) {
  try {
    await api.publish(data)
    message.success('Published successfully')
  } catch (error) {
    console.error('Publish failed:', error)
    message.error('Failed to publish changes')
  }
}
```

### 7. Confirmation

Always require confirmation for destructive actions:
- Publishing changes
- Rolling back versions
- Deleting drafts

## Styling

Both components use scoped styles and follow the Ant Design Vue design system. They are fully responsive and adapt to their container width.

### Customization

You can customize the appearance using CSS variables or by overriding the scoped styles:

```vue
<style>
.version-bar {
  --version-bar-bg: #f5f5f5;
  --version-bar-padding: 12px 16px;
}

.diff-viewer {
  --diff-removed-bg: #ffebee;
  --diff-added-bg: #e8f5e9;
}
</style>
```

## Demo

See the complete demo at `/admin/examples/version-control` which includes:
- Interactive VersionBar with draft creation
- All three DiffViewer formats
- Complete configuration management workflow
- Real-time diff updates

## Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 19.3**: Version control with draft/publish/rollback workflows
- **Requirement 19.4**: Diff viewer for comparing versions
- **Requirement 23.6**: Diff comparison before submitting forms

## Related Components

- **SchemaForm**: For editing configuration values
- **ConfirmButton**: For dangerous operations
- **AuditTrail**: For viewing version history details
