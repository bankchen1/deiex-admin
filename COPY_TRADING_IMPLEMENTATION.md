# Copy Trading Implementation

## Overview

The copy-trading feature allows administrators to monitor and manage copy-trading relationships between leader traders and followers. This implementation provides comprehensive tools for viewing relationships, configuring risk parameters, and managing profit-sharing settings.

## Components

### 1. CopyTrading Page (`src/pages/orders/CopyTrading.vue`)

Main page component that orchestrates the copy-trading functionality.

**Features:**
- Filter section for searching by leader ID, follower ID, and status
- Statistics cards showing:
  - Total Relations
  - Active Relations
  - Total Profit
  - Average Profit Share
- Table displaying all copy-trading relationships
- Detail drawer for viewing and editing configurations
- Batch export functionality

**Actions:**
- View detailed relationship information
- Pause active relationships
- Resume paused relationships
- Stop relationships permanently
- Update configuration settings
- Export selected relationships

### 2. CopyTradingTable Component (`src/tables/orders/CopyTradingTable.vue`)

Reusable table component built on ServerTable for displaying copy-trading relationships.

**Columns:**
- Relation ID
- Leader ID & Name
- Follower ID & Name
- Status (Active/Paused/Stopped)
- Copy Ratio (%)
- Max Position Size
- Stop Loss (%)
- Take Profit (%)
- Profit Share (%)
- Total Profit
- Total Loss
- Created At
- Actions

**Features:**
- Server-side pagination and sorting
- Status filtering
- Row selection for batch operations
- Export functionality
- Inline actions (View, Pause, Resume, Stop)

### 3. CopyTradingConfigForm Component (`src/forms/copy-trading/CopyTradingConfigForm.vue`)

Form component for configuring copy-trading risk thresholds and profit sharing.

**Configuration Fields:**

1. **Copy Ratio** (0-100%)
   - Slider and input number control
   - Determines what percentage of leader's position size to copy

2. **Max Position Size** (USDT)
   - Maximum position size for copied trades
   - Prevents over-exposure

3. **Stop Loss** (%) - Optional
   - Automatically close position when loss reaches threshold
   - Risk management feature

4. **Take Profit** (%) - Optional
   - Automatically close position when profit reaches threshold
   - Profit protection feature

5. **Profit Share** (0-50%)
   - Percentage of profit shared with the leader trader
   - Incentive mechanism for leaders

**Validation:**
- Copy ratio must be between 0-100%
- Max position size must be positive
- Profit share must be between 0-50%
- Stop loss and take profit are optional

## Data Flow

### State Management (`src/stores/orders.ts`)

The orders store manages copy-trading state:

```typescript
// State
- copyTradingRelations: CopyTradingRelation[]
- copyTradingTotal: number
- copyTradingLoading: boolean
- currentCopyTrading: CopyTradingRelation | null

// Actions
- fetchCopyTradingRelations(params)
- fetchCopyTradingById(id)
- updateCopyTrading(id, payload)
- pauseCopyTrading(id)
- resumeCopyTrading(id)
- stopCopyTrading(id)
- exportCopyTrading(params)
```

### API Service (`src/services/api/orders.ts`)

API endpoints for copy-trading operations:

```typescript
GET    /admin/copy-trading              // List relationships
GET    /admin/copy-trading/:id          // Get by ID
PUT    /admin/copy-trading/:id          // Update configuration
POST   /admin/copy-trading/:id/pause    // Pause relationship
POST   /admin/copy-trading/:id/resume   // Resume relationship
POST   /admin/copy-trading/:id/stop     // Stop relationship
GET    /admin/copy-trading/export       // Export to CSV
```

## Data Model

```typescript
interface CopyTradingRelation {
  id: string
  leaderId: string
  leaderNickname: string
  followerId: string
  followerNickname: string
  status: 'active' | 'paused' | 'stopped'
  copyRatio: number                    // 0-1 decimal
  maxPositionSize: string              // USDT amount
  stopLossPercent?: number             // Optional
  takeProfitPercent?: number           // Optional
  profitSharePercent: number           // 0-50
  totalProfit: string                  // Cumulative profit
  totalLoss: string                    // Cumulative loss
  createdAt: string
  updatedAt: string
}
```

## Routing

Route configuration in `src/router/modules/orders.ts`:

```typescript
{
  path: 'copy-trading',
  name: 'CopyTrading',
  component: () => import('@/pages/orders/CopyTrading.vue'),
  meta: {
    title: 'Copy Trading',
    permissions: ['orders.copy-trading.view'],
    keepAlive: true,
  },
}
```

## Permissions

Required permissions:
- `orders.copy-trading.view` - View copy-trading page
- `orders.copy-trading.update` - Update configurations
- `orders.copy-trading.manage` - Pause/resume/stop relationships

## User Workflows

### 1. View Copy-Trading Relationships

1. Navigate to Orders > Copy Trading
2. View statistics and list of relationships
3. Use filters to search by leader, follower, or status
4. Click on a relationship to view details

### 2. Update Configuration

1. Click "View" on a relationship
2. Detail drawer opens showing relationship info
3. Modify configuration values in the form
4. Click "Update Configuration"
5. Changes are saved and drawer closes

### 3. Manage Relationship Status

**Pause:**
1. Click "Pause" on an active relationship
2. Confirm action in modal
3. Relationship status changes to "paused"
4. No new trades will be copied

**Resume:**
1. Click "Resume" on a paused relationship
2. Confirm action in modal
3. Relationship status changes to "active"
4. Trade copying resumes

**Stop:**
1. Click "Stop" on any relationship
2. Confirm permanent action in modal
3. Relationship status changes to "stopped"
4. Cannot be resumed (permanent)

### 4. Export Data

1. Select relationships using checkboxes
2. Click "Export Selected" button
3. CSV file downloads with relationship data

## Requirements Coverage

This implementation satisfies **Requirement 7.7**:

> "WHERE copy-trading is supported, THE Admin_System SHALL display follow relationships, risk thresholds, and profit sharing"

**Implemented Features:**
✅ Display follow relationships (leader-follower pairs)
✅ Display risk thresholds (stop loss, take profit, max position)
✅ Display profit sharing configuration
✅ Allow configuration updates
✅ Support relationship management (pause/resume/stop)
✅ Provide filtering and search
✅ Show performance metrics (total profit/loss)
✅ Export functionality

## Technical Notes

- Uses composition API with `<script setup>` syntax
- Fully typed with TypeScript
- Follows existing patterns from other order pages
- Integrates with ServerTable for consistent UX
- Uses Ant Design Vue components
- Implements proper error handling and loading states
- Supports responsive design
- Includes proper permission checks (via route meta)

## Future Enhancements

Potential improvements for future iterations:

1. Real-time updates via WebSocket
2. Performance charts for relationships
3. Bulk configuration updates
4. Relationship recommendations
5. Risk alerts and notifications
6. Historical performance analysis
7. Leader trader rankings
8. Follower portfolio diversification metrics
