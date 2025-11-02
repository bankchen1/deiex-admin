# Instruments Forms and Modals Implementation

This document describes the implementation of instrument forms and modals for the DEIEX Admin system.

## Overview

The instruments module provides comprehensive configuration management for trading instruments (spot and futures) with support for:
- Creating and editing instruments with detailed parameters
- Bulk import from CSV/JSON files with field mapping
- Publishing changes with version control and impact estimation
- Draft/publish/rollback workflow

## Components

### 1. InstrumentForm.vue

**Location**: `src/forms/instruments/InstrumentForm.vue`

**Purpose**: Dynamic form for creating and editing instrument configurations.

**Features**:
- **Basic Information Section**:
  - Symbol (uppercase alphanumeric, immutable after creation)
  - Display names (English and Chinese for i18n)
  - Base and quote currencies
  - Instrument type (spot/futures)
  - Icon picker integration

- **Trading Parameters Section**:
  - Price precision (0-8 decimal places)
  - Quantity step size
  - Minimum and maximum order sizes
  - Maximum position size (futures only)
  - Price tick size

- **Bindings Section**:
  - Fee template selection
  - Margin template selection (futures only)
  - Oracle source configuration (futures only)
  - Index symbol mapping (futures only)

- **Risk Settings Section**:
  - Maximum leverage (futures only, 1-125x)
  - Maintenance margin rate (futures only)

- **Display Settings Section**:
  - Visibility toggle
  - Ranking for display order
  - Regional availability (multi-select)
  - Tags for categorization

**Props**:
```typescript
interface Props {
  initialData?: Instrument
  mode?: 'create' | 'edit' | 'view'
}
```

**Events**:
```typescript
interface Emits {
  (e: 'submit', data: InstrumentCreatePayload | InstrumentUpdatePayload): void
  (e: 'cancel'): void
}
```

**Usage**:
```vue
<InstrumentForm
  :initial-data="instrument"
  :mode="'edit'"
  @submit="handleSubmit"
  @cancel="handleCancel"
/>
```

**Validation Rules**:
- Symbol: Required, uppercase alphanumeric only
- Display names: English required, Chinese optional
- Base/Quote: Required, uppercase alphanumeric
- Price precision: 0-8 range
- Numeric fields: Valid number format with pattern validation
- Conditional fields: Futures-specific fields only visible when type is 'futures'

### 2. EditInstrumentDrawer.vue

**Location**: `src/modals/instruments/EditInstrumentDrawer.vue`

**Purpose**: Right-side drawer (720px width) for creating, editing, or viewing instruments.

**Features**:
- Right-side slide-in drawer with 720px width
- Integrates InstrumentForm component
- Mode-aware title and actions
- Loading state during save operations
- Success/error handling with notifications

**Props**:
```typescript
interface Props {
  open: boolean
  instrument?: Instrument
  mode?: 'create' | 'edit' | 'view'
}
```

**Events**:
```typescript
interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}
```

**Usage**:
```vue
<EditInstrumentDrawer
  v-model:open="drawerOpen"
  :instrument="selectedInstrument"
  :mode="'edit'"
  @success="handleSuccess"
/>
```

**Behavior**:
- **Create Mode**: Shows "Create Instrument" title, saves as draft
- **Edit Mode**: Shows "Edit Instrument" title, updates existing draft
- **View Mode**: Shows "View Instrument" title, read-only form, no save button

### 3. BulkImportModal.vue

**Location**: `src/modals/instruments/BulkImportModal.vue`

**Purpose**: Modal for bulk importing instruments from CSV or JSON files.

**Features**:

#### Format Selection
- CSV format support with automatic field mapping
- JSON format support for structured data
- Format-specific help text and examples

#### File Upload
- Single file upload with drag-and-drop support
- File type validation
- File size limits
- Preview of uploaded content

#### Field Mapping (CSV only)
- Automatic field mapping based on column names
- Manual mapping adjustment via dropdown selectors
- Smart field name guessing:
  - "symbol" → symbol
  - "display_en" → displayName.en
  - "display_zh" → displayName.zh
  - "base" → base
  - "quote" → quote
  - etc.

#### Validation
- Pre-import validation with detailed error reporting
- Row-by-row error messages
- Validation summary (success/failure counts)
- Prevents import if validation fails

#### Preview
- Shows first 5 rows of parsed data
- Displays mapped fields in table format
- Scrollable preview for wide data

#### Options
- Overwrite existing instruments checkbox
- Conflict resolution strategy

**Props**:
```typescript
interface Props {
  open: boolean
}
```

**Events**:
```typescript
interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}
```

**Usage**:
```vue
<BulkImportModal
  v-model:open="importModalOpen"
  @success="handleImportSuccess"
/>
```

**CSV Format Example**:
```csv
symbol,displayName_en,displayName_zh,base,quote,type,pricePrecision,qtyStep,minOrder,visible,rank
BTCUSDT,Bitcoin/USDT,比特币/USDT,BTC,USDT,spot,2,0.001,10,true,100
ETHUSDT,Ethereum/USDT,以太坊/USDT,ETH,USDT,spot,2,0.01,10,true,90
```

**JSON Format Example**:
```json
[
  {
    "symbol": "BTCUSDT",
    "displayName": {
      "en": "Bitcoin/USDT",
      "zh": "比特币/USDT"
    },
    "base": "BTC",
    "quote": "USDT",
    "type": "spot",
    "pricePrecision": 2,
    "qtyStep": "0.001",
    "minOrder": "10",
    "visible": true,
    "rank": 100
  }
]
```

### 4. PublishModal.vue

**Location**: `src/modals/instruments/PublishModal.vue`

**Purpose**: Modal for publishing draft instruments with version control and impact analysis.

**Features**:

#### Version Notes
- Required text area for describing changes
- 500 character limit with counter
- Markdown support for formatting

#### Tags
- Optional version tags (hotfix, feature, update, bugfix, enhancement)
- Custom tag support
- Multiple tags allowed

#### Impact Estimation
- **Affected Users**: Count of users with active positions/orders
- **Affected Orders**: Count of open orders that will be impacted
- **Warnings**: List of potential issues:
  - High user impact (>1000 users)
  - High order impact (>100 orders)
  - Breaking changes
  - Price precision changes
  - Visibility changes

#### Changes Preview
- Side-by-side diff viewer
- Shows differences between published and draft versions
- Table format for easy comparison
- Highlights added, removed, and modified fields

#### Confirmation
- Information alert about immediate impact
- Checkbox confirmation required
- Prevents accidental publishes

**Props**:
```typescript
interface Props {
  open: boolean
}
```

**Events**:
```typescript
interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}
```

**Usage**:
```vue
<PublishModal
  v-model:open="publishModalOpen"
  @success="handlePublishSuccess"
/>
```

**Workflow**:
1. Modal opens and fetches impact estimation and diff data
2. User reviews impact metrics and warnings
3. User reviews changes in diff viewer
4. User enters version notes (required)
5. User optionally adds tags
6. User confirms understanding of impact
7. User clicks "Publish" button
8. System publishes changes and creates new version
9. Success notification and modal closes

## Integration with Store

All components integrate with the `useInstrumentsStore` Pinia store:

```typescript
import { useInstrumentsStore } from '@/stores/instruments'

const instrumentsStore = useInstrumentsStore()

// Create draft
await instrumentsStore.createDraft(payload)

// Update draft
await instrumentsStore.updateDraft(symbol, payload)

// Import data
await instrumentsStore.importData(payload)

// Validate import
await instrumentsStore.validateImport(payload)

// Publish
await instrumentsStore.publish({ notes, tags })

// Fetch impact estimation
await instrumentsStore.fetchImpactEstimation()

// Fetch diff
await instrumentsStore.fetchDiff()
```

## API Endpoints

The components use the following API endpoints:

- `POST /admin/config/instruments/drafts` - Create draft
- `PUT /admin/config/instruments/drafts/:symbol` - Update draft
- `POST /admin/config/instruments/import` - Import instruments
- `POST /admin/config/instruments/validate-import` - Validate import
- `POST /admin/config/instruments/publish` - Publish drafts
- `GET /admin/config/instruments/impact-estimation` - Get impact estimation
- `GET /admin/config/instruments/diff` - Get diff between draft and published

## Error Handling

All components implement comprehensive error handling:

1. **Form Validation**: Client-side validation with immediate feedback
2. **API Errors**: Caught and displayed with user-friendly messages
3. **Network Errors**: Handled with retry suggestions
4. **Loading States**: Visual feedback during async operations
5. **Success Notifications**: Confirmation messages for successful operations

## Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Focus management in modals
- Clear error messages
- Loading indicators

## Testing

### Unit Tests
- Form validation logic
- Field mapping algorithms
- Data parsing functions
- Error handling

### Component Tests
- Form submission
- Modal open/close
- File upload
- Validation display

### Integration Tests
- End-to-end create/edit workflow
- Bulk import workflow
- Publish workflow with impact review

## Best Practices

1. **Always validate before submit**: Use client-side validation to catch errors early
2. **Provide clear feedback**: Show loading states and success/error messages
3. **Preserve user data**: Auto-save drafts to prevent data loss
4. **Review before publish**: Always check impact estimation and diff before publishing
5. **Use version notes**: Provide clear, descriptive version notes for audit trail
6. **Test imports**: Validate import data before committing changes
7. **Handle errors gracefully**: Display user-friendly error messages with actionable guidance

## Future Enhancements

- [ ] Template support for common instrument configurations
- [ ] Batch editing of multiple instruments
- [ ] Advanced validation rules (cross-field validation)
- [ ] Import history and rollback
- [ ] Export templates for easier bulk imports
- [ ] Real-time collaboration (multiple admins editing)
- [ ] Scheduled publishes
- [ ] A/B testing support for instrument configurations
