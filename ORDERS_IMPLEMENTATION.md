# Orders Module Implementation

This document provides an overview of the Orders module implementation for the DEIEX Admin system.

## Overview

The Orders module provides comprehensive management of spot orders, futures orders, positions, liquidations, and copy-trading relationships. It includes filtering, sorting, exporting, and detailed views for all order-related data.

## Components Implemented

### 1. API Service (`src/services/api/orders.ts`)

Provides API endpoints for:
- Spot orders (list, detail, export)
- Futures orders (list, detail, export)
- Positions (list, detail, export)
- Liquidations (list, detail, export)
- Copy trading relations (list, detail, update, pause, resume, stop, export)

**Key Types:**
- `Order` - Base order interface
- `FuturesOrder` - Extends Order with futures-specific fields
- `Position` - Active position data
- `Liquidation` - Liquidation event with timeline
- `CopyTradingRelation` - Copy trading relationship configuration

### 2. Store (`src/stores/orders.ts`)

Pinia store managing state for all order-related data:
- Separate state for spot orders, futures orders, positions, liquidations, and copy trading
- Loading states and totals for pagination
- Actions for fetching, exporting, and managing data
- Copy trading management (pause, resume, stop, update)

### 3. Tables

#### SpotOrderTable (`src/tables/orders/SpotOrderTable.vue`)
- Displays spot orders with columns: ID, user, symbol, side, type, price, quantity, filled, status, error code, latency
- Supports filtering by symbol, side, status
- Sortable by latency and created date
- Export functionality

#### FuturesOrderTable (`src/tables/orders/FuturesOrderTable.vue`)
- Extends spot order table with futures-specific columns
- Additional columns: position side, leverage, margin mode, liquidation price, funding impact
- Visual warnings for positions close to liquidation
- Color-coded funding impact (positive/negative)

#### PositionTable (`src/tables/orders/PositionTable.vue`)
- Displays active positions with risk indicators
- Columns: ID, user, symbol, side, leverage, margin mode, prices, quantity, margin, unrealized PnL, risk ratio
- Progress bars for risk ratio visualization
- Visual warnings for high-risk positions (≥60%)
- Sortable by unrealized PnL and risk ratio

#### LiquidationTable (`src/tables/orders/LiquidationTable.vue`)
- Shows liquidation records with loss information
- Columns: ID, user, symbol, side, leverage, prices, quantity, loss, reason, timestamp
- Color-coded loss display
- Link to view liquidation timeline

#### CopyTradingTable (`src/tables/orders/CopyTradingTable.vue`)
- Manages copy trading relationships
- Columns: relation ID, leader/follower info, status, copy ratio, position limits, profit/loss sharing
- Actions: view, pause, resume, stop
- Status-based action availability

### 4. Pages

#### SpotOrders (`src/pages/orders/SpotOrders.vue`)
- Filter section: trading pair, direction, status, user ID, time range
- Integrated SpotOrderTable
- Batch export functionality
- Order detail drawer integration

#### FuturesOrders (`src/pages/orders/FuturesOrders.vue`)
- Similar to SpotOrders with futures-specific features
- Filter section with same options
- Integrated FuturesOrderTable
- Order detail drawer integration

#### Positions (`src/pages/orders/Positions.vue`)
- LiquidationRadar widget showing risk distribution
- Statistics: total positions, high-risk count, total unrealized PnL, average risk ratio
- Filter section: trading pair, side, user ID, risk ratio range
- Integrated PositionTable
- Position detail drawer with full information

#### Liquidations (`src/pages/orders/Liquidations.vue`)
- Statistics: total liquidations, total loss, average loss %, average leverage
- Filter section: trading pair, user ID, time range
- Integrated LiquidationTable
- Liquidation detail drawer with timeline visualization

#### CopyTrading (`src/pages/orders/CopyTrading.vue`)
- Statistics: total relations, active relations, total profit, average profit share
- Filter section: leader ID, follower ID, status
- Integrated CopyTradingTable
- Configuration drawer with editable settings
- Pause/resume/stop actions with confirmations

### 5. Modals & Drawers

#### OrderDetailDrawer (`src/modals/orders/OrderDetailDrawer.vue`)
- Displays comprehensive order information
- Sections: basic info, order details, futures details (if applicable), performance & error, timestamps
- Supports both spot and futures orders
- Link to view user details

### 6. Widgets

#### LiquidationRadar (`src/widgets/risk/LiquidationRadar.vue`)
- ECharts-based radar chart
- Visualizes position distribution by risk level
- Categories: critical (≥80%), high (60-80%), medium (40-60%), low (<40%)
- Color-coded risk zones

#### LiqTimeline (`src/widgets/timeline/LiqTimeline.vue`)
- Timeline visualization of liquidation path
- Shows events leading to liquidation
- Each event displays: timestamp, mark price, risk ratio, description
- Color-coded by risk level
- Icons indicating event severity

### 7. Forms

#### CopyTradingConfigForm (`src/forms/copy-trading/CopyTradingConfigForm.vue`)
- Configuration form for copy trading settings
- Fields:
  - Copy ratio (0-100%) with slider
  - Max position size (USDT)
  - Stop loss percentage (optional)
  - Take profit percentage (optional)
  - Profit share percentage (0-50%) with slider
- Validation rules for all fields
- Helpful hints for each setting

## Features

### Filtering & Search
- All pages include comprehensive filter sections
- Time range selection with date-time picker
- Symbol, user ID, status, and side filters
- Risk ratio range filtering for positions

### Data Visualization
- Risk radar chart for position risk distribution
- Progress bars for risk ratios
- Color-coded PnL displays (green for profit, red for loss)
- Timeline visualization for liquidation events

### Export Functionality
- CSV export for all data types
- Batch export for selected rows
- Export with applied filters

### Risk Management
- Visual warnings for high-risk positions
- Liquidation price proximity alerts
- Risk ratio progress indicators
- Comprehensive liquidation timeline reconstruction

### Copy Trading Management
- View and edit copy trading configurations
- Pause/resume/stop actions
- Profit and loss tracking
- Configurable risk thresholds and profit sharing

## Data Flow

1. **User Action** → Filter/Search/Select
2. **Page Component** → Calls store action
3. **Store** → Calls API service
4. **API Service** → Makes HTTP request
5. **Response** → Updates store state
6. **Store State** → Updates table component
7. **Table Component** → Renders data

## Integration Points

### Router Integration
Pages should be registered in the router configuration:
```typescript
// router/modules/orders.ts
{
  path: 'orders',
  children: [
    { path: 'spot', component: () => import('@/pages/orders/SpotOrders.vue') },
    { path: 'futures', component: () => import('@/pages/orders/FuturesOrders.vue') },
    { path: 'positions', component: () => import('@/pages/orders/Positions.vue') },
    { path: 'liquidations', component: () => import('@/pages/orders/Liquidations.vue') },
    { path: 'copy-trading', component: () => import('@/pages/orders/CopyTrading.vue') }
  ]
}
```

### Navigation Menu
Add to sidebar navigation:
```typescript
{
  key: 'orders',
  label: 'Orders',
  icon: 'ShoppingOutlined',
  children: [
    { key: 'orders-spot', label: 'Spot Orders', path: '/admin/orders/spot' },
    { key: 'orders-futures', label: 'Futures Orders', path: '/admin/orders/futures' },
    { key: 'orders-positions', label: 'Positions', path: '/admin/orders/positions' },
    { key: 'orders-liquidations', label: 'Liquidations', path: '/admin/orders/liquidations' },
    { key: 'orders-copy-trading', label: 'Copy Trading', path: '/admin/orders/copy-trading' }
  ]
}
```

## API Endpoints Expected

The implementation expects the following API endpoints:

### Spot Orders
- `GET /admin/orders/spot` - List spot orders
- `GET /admin/orders/spot/:id` - Get spot order details
- `GET /admin/orders/spot/export` - Export spot orders

### Futures Orders
- `GET /admin/orders/futures` - List futures orders
- `GET /admin/orders/futures/:id` - Get futures order details
- `GET /admin/orders/futures/export` - Export futures orders

### Positions
- `GET /admin/positions` - List positions
- `GET /admin/positions/:id` - Get position details
- `GET /admin/positions/export` - Export positions

### Liquidations
- `GET /admin/liquidations` - List liquidations
- `GET /admin/liquidations/:id` - Get liquidation details
- `GET /admin/liquidations/export` - Export liquidations

### Copy Trading
- `GET /admin/copy-trading` - List copy trading relations
- `GET /admin/copy-trading/:id` - Get relation details
- `PUT /admin/copy-trading/:id` - Update relation configuration
- `POST /admin/copy-trading/:id/pause` - Pause relation
- `POST /admin/copy-trading/:id/resume` - Resume relation
- `POST /admin/copy-trading/:id/stop` - Stop relation
- `GET /admin/copy-trading/export` - Export relations

## Testing Recommendations

1. **Unit Tests**
   - Store actions and state management
   - API service functions
   - Form validation logic

2. **Component Tests**
   - Table rendering with mock data
   - Filter functionality
   - Export functionality
   - Modal/drawer interactions

3. **Integration Tests**
   - Complete user flows (search → view → export)
   - Copy trading management flow
   - Risk visualization accuracy

4. **E2E Tests**
   - Order search and filtering
   - Position risk monitoring
   - Liquidation timeline viewing
   - Copy trading configuration updates

## Performance Considerations

1. **Pagination**: All tables use server-side pagination to handle large datasets
2. **Lazy Loading**: Charts and heavy components are loaded on demand
3. **Debouncing**: Search inputs should be debounced to reduce API calls
4. **Caching**: Consider caching frequently accessed data in the store
5. **Virtual Scrolling**: For very large tables (>1000 rows), consider implementing virtual scrolling

## Security Considerations

1. **RBAC**: All pages should be protected with appropriate permissions
2. **Action Confirmation**: Destructive actions (stop copy trading) require confirmation
3. **Audit Logging**: All management actions should be logged
4. **Data Masking**: Sensitive user information should be masked appropriately

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live order updates
2. **Advanced Analytics**: More detailed charts and statistics
3. **Bulk Operations**: Batch actions for multiple orders/positions
4. **Custom Alerts**: Configurable alerts for high-risk positions
5. **Export Formats**: Support for additional export formats (Excel, PDF)
6. **Order Replay**: Ability to replay order execution for analysis

## Dependencies

- Vue 3 with Composition API
- Ant Design Vue 4.x
- Pinia for state management
- ECharts for data visualization
- Day.js for date handling
- Axios for HTTP requests

## Conclusion

The Orders module provides a comprehensive solution for managing all order-related operations in the DEIEX Admin system. It includes robust filtering, visualization, and management capabilities for spot orders, futures orders, positions, liquidations, and copy trading relationships.
