# Instruments Module Implementation

## Overview
The Instruments module provides comprehensive management of trading instruments (spot and futures) with version control, draft/publish/rollback workflows, and bulk operations.

## Implemented Components

### 1. API Service (`src/services/api/config.instruments.ts`)
- Complete REST API client for instruments management
- Endpoints for published/draft instruments CRUD operations
- Version control operations (publish, rollback, diff)
- Import/export functionality
- Batch operations (show/hide)
- Impact estimation for publishing

### 2. Pinia Store (`src/stores/instruments.ts`)
- State management for published and draft instruments
- Version history tracking
- Loading and error states
- Actions for all CRUD operations
- Draft/publish/rollback workflow
- Import/export with validation
- Batch operations support

### 3. InstrumentTable Component (`src/tables/instruments/InstrumentTable.vue`)
- Server-side table with pagination, sorting, filtering
- Inline editing for rank and visibility
- Batch selection and operations (show/hide)
- Export functionality
- RBAC-protected actions
- Support for both published and draft views

### 4. InstrumentForm Component (`src/forms/instruments/InstrumentForm.vue`)
- Dynamic form using SchemaForm
- Sections: Basic Info, Trading Parameters, Bindings, Risk Settings, Display Settings
- Conditional fields based on instrument type (spot/futures)
- i18n support for display names
- Comprehensive validation rules
- Draft auto-save support

### 5. EditInstrumentDrawer Modal (`src/modals/instruments/EditInstrumentDrawer.vue`)
- Right-side drawer (720px width)
- Supports create/edit/view modes
- Integrates InstrumentForm
- Loading states and error handling

### 6. BulkImportModal (`src/modals/instruments/BulkImportModal.vue`)
- CSV and JSON import support
- Field mapping for CSV files
- Pre-validation before import
- Preview of first 5 rows
- Overwrite option
- Error reporting

### 7. PublishModal (`src/modals/instruments/PublishModal.vue`)
- Version notes and tags
- Impact estimation display
- Diff viewer for changes preview
- Confirmation checkbox
- Warnings for high-impact changes

### 8. Instruments Page (`src/pages/config/instruments/index.vue`)
- Tabs: All, Spot, Futures, Hidden, Drafts
- Stats cards showing totals
- Filter section (search, type, visible, region)
- VersionBar integration
- RBAC-protected actions
- Orchestrates all components

## Features

### Version Control
- Draft/publish/rollback workflow
- Version history with notes and tags
- Diff viewer for comparing versions
- Impact estimation before publishing

### Inline Editing
- Quick edit for rank (number input)
- Quick toggle for visibility (switch)
- Changes saved to drafts immediately

### Batch Operations
- Batch show/hide instruments
- Batch selection with checkboxes
- Export selected or all instruments

### Import/Export
- CSV and JSON formats
- Field mapping for CSV
- Pre-validation before import
- Download with format selection

### RBAC Integration
- Permission checks at all levels
- View/edit/delete/create/import permissions
- Graceful degradation for unauthorized users

## Data Models

### Instrument Type
```typescript
interface Instrument {
  symbol: string
  displayName: Record<string, string> // i18n
  base: string
  quote: string
  type: 'spot' | 'futures'
  pricePrecision: number
  qtyStep: string
  minOrder: string
  visible: boolean
  rank: number
  region: string[]
  tags: string[]
  feeTemplateId?: string
  marginTemplateId?: string
  iconId?: string
  status: 'draft' | 'published'
  version: string
  // Additional fields...
}
```

## API Endpoints

- `GET /admin/config/instruments/published` - Fetch published instruments
- `GET /admin/config/instruments/drafts` - Fetch draft instruments
- `POST /admin/config/instruments/drafts` - Create draft
- `PUT /admin/config/instruments/drafts/:symbol` - Update draft
- `DELETE /admin/config/instruments/drafts/:symbol` - Delete draft
- `POST /admin/config/instruments/publish` - Publish drafts
- `POST /admin/config/instruments/rollback/:versionId` - Rollback to version
- `GET /admin/config/instruments/diff` - Get diff between draft and published
- `GET /admin/config/instruments/export` - Export instruments
- `POST /admin/config/instruments/import` - Import instruments
- `POST /admin/config/instruments/validate-import` - Validate import data
- `GET /admin/config/instruments/impact-estimation` - Get impact estimation
- `POST /admin/config/instruments/batch-show` - Batch show instruments
- `POST /admin/config/instruments/batch-hide` - Batch hide instruments

## Usage Example

```vue
<template>
  <InstrumentTable
    :data-source="instruments"
    :loading="loading"
    :is-draft="false"
    @view="handleView"
    @edit="handleEdit"
    @delete="handleDelete"
    @refresh="fetchData"
  />
</template>

<script setup>
import { useInstrumentsStore } from '@/stores/instruments'

const instrumentsStore = useInstrumentsStore()

async function fetchData() {
  await instrumentsStore.fetchPublished()
}
</script>
```

## Router Configuration

The instruments page is accessible at `/admin/config/instruments` with the following route configuration:

```typescript
{
  path: 'instruments',
  name: 'ConfigInstruments',
  component: () => import('@/pages/config/instruments/index.vue'),
  meta: {
    title: 'Instruments',
    permissions: ['config.instruments.view'],
    keepAlive: true,
  },
}
```

## Required Permissions

- `config.view` - View config section
- `config.instruments.view` - View instruments page
- `config.instruments.create` - Create new instruments
- `config.instruments.edit` - Edit instruments
- `config.instruments.delete` - Delete draft instruments
- `config.instruments.import` - Import instruments
- `config.instruments.publish` - Publish drafts
- `config.instruments.rollback` - Rollback to previous versions

## Next Steps

To complete the Config module, implement the remaining submodules:
- Margin configuration (Task 11)
- Fees configuration (Task 12)
- Calendar configuration (Task 13)
- Icons management (Task 14)
- Mappings configuration (Task 15)
- Security configuration (Task 16)

All these modules will follow the same pattern established in the Instruments module with draft/publish/rollback workflows.
