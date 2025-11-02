# Assets Module Implementation

This document describes the implementation of the Assets module for the DEIEX Admin system.

## Overview

The Assets module provides comprehensive management of deposits, withdrawals, and wallet operations. It includes risk assessment, multi-role approval workflows, and real-time monitoring capabilities.

## Components Implemented

### 1. API Services (`src/services/api/assets.ts`)

- **Deposits API**: List, detail, export, and notes management
- **Withdrawals API**: List, detail, approve, reject, batch operations, export, and notes management
- **Wallets API**: Address management, chain health monitoring, retry queue management

### 2. Pinia Stores

#### Deposits Store (`src/stores/deposits.ts`)
- State management for deposits list and details
- Pagination support
- Export functionality
- Notes management

#### Withdrawals Store (`src/stores/withdrawals.ts`)
- State management for withdrawals list and details
- Approval and rejection workflows
- Batch operations support
- Multi-role signature support
- Export functionality
- Notes management

#### Wallets Store (`src/stores/wallets.ts`)
- Wallet address management
- Chain health monitoring
- Retry queue management
- Balance synchronization

### 3. Pages

#### Deposits Page (`src/pages/assets/Deposits.vue`)
- Overview statistics (24h totals, pending, confirming, completed)
- Integrated DepositTable component
- Real-time status monitoring

#### Withdrawals Page (`src/pages/assets/Withdrawals.vue`)
- Overview statistics (24h totals, pending review, high risk, completed)
- Integrated WithdrawalTable component
- Risk assessment display
- Approval workflow integration

#### Wallets Page (`src/pages/assets/Wallets.vue`)
- **Balance Summary Cards**
  - Total balance across all chains
  - Hot wallet balance total
  - Cold wallet balance total
  - Active chains count
- **Chain Health Status**
  - Real-time blockchain health monitoring
  - Block height and sync status
  - Node count and issues display
- **Balance Monitoring**
  - Chain-by-chain balance breakdown
  - Hot/cold wallet ratio visualization
  - Balance totals with USD values
  - Last sync timestamps
- **Wallet Address Management**
  - Hot and cold wallet addresses
  - Filter by chain and wallet type
  - Balance synchronization
  - Address copy functionality
- **Failed Transaction Retry Queue**
  - Failed deposit/withdrawal monitoring
  - Retry and cancel operations
  - Progress tracking
  - Error details display

### 4. Tables

#### DepositTable (`src/tables/assets/DepositTable.vue`)
- Server-side pagination and filtering
- Columns: ID, User, Currency, Chain, Amount, Status, Confirmations, Risk Flags, Tx Hash, Created At
- Filter by: User ID, Currency, Chain, Status, Date Range
- Export functionality
- Transaction detail view

#### WithdrawalTable (`src/tables/assets/WithdrawalTable.vue`)
- Server-side pagination and filtering
- Columns: ID, User, Currency, Chain, Amount, Status, Risk Score, Matched Rules, Approvals, Address, Created At
- Filter by: User ID, Currency, Chain, Status, Date Range
- Batch approve/reject operations
- RBAC-protected actions
- Risk score visualization
- Export functionality

#### AddressTable (`src/tables/assets/AddressTable.vue`)
- Wallet address listing
- Columns: Chain, Type, Label, Address, Balance, Status, Last Sync
- Balance synchronization
- Address copy functionality

#### RetryQueueTable (`src/tables/assets/RetryQueueTable.vue`)
- Failed transaction monitoring
- Columns: Type, Transaction ID, Chain, Attempts, Last Error, Next Retry, Created At
- Retry and cancel operations
- Progress visualization

#### BalanceTable (`src/tables/assets/BalanceTable.vue`)
- Chain-by-chain balance monitoring
- Columns: Chain, Hot Wallet Balance, Cold Wallet Balance, Total Balance, Hot/Cold Ratio, Last Sync
- Hot/cold wallet ratio visualization with color coding
  - Green (10-30%): Ideal ratio
  - Orange (<10%): Too low hot wallet balance
  - Blue (30-50%): Acceptable ratio
  - Red (>50%): Too high hot wallet balance
- Summary row with total balances across all chains
- Real-time balance updates
- Last sync timestamps with relative time

### 5. Modals

#### TxDetailDrawer (`src/modals/assets/TxDetailDrawer.vue`)
- Unified drawer for both deposits and withdrawals
- Basic information display
- Transaction details with copy functionality
- Risk assessment section
- Approval history (for withdrawals)
- Timeline visualization
- Notes management

#### ApproveModal (`src/modals/assets/ApproveModal.vue`)
- **Single and Batch Approval Support**
  - Single withdrawal approval with detailed review
  - Batch approval for multiple withdrawals
- **Multi-Role Approval Workflow**
  - Displays approval status for each required role
  - Role selection for administrators with multiple roles
  - Tracks approval progress (e.g., "2 of 3 approvals received")
  - Configurable risk threshold (default: risk score >= 70 requires multi-role approval)
  - Required roles: Finance Manager, Risk Manager (configurable)
- **Risk Assessment Display**
  - Risk score visualization with color coding
  - Matched risk rules display
- **Approval Form**
  - Role selection (for multi-role approvals)
  - Optional approval reason
  - Additional notes field
  - Confirmation checkbox
- **Transaction Detail Summary**
  - User information
  - Amount and fee details
  - Chain and address information

#### RejectModal (`src/modals/assets/RejectModal.vue`)
- **Single and Batch Rejection Support**
  - Single withdrawal rejection with detailed review
  - Batch rejection for multiple withdrawals
- **Predefined Reason Templates**
  - High Risk Score
  - Suspicious Activity
  - Invalid Address
  - Insufficient Balance
  - Compliance Issue
  - User Request
  - Technical Issue
  - Duplicate Request
  - Blacklisted Address
  - KYC Not Verified
  - Custom Reason (with text input)
- **Rejection Form**
  - Required reason selection
  - Custom reason text area (when "Custom Reason" selected)
  - Additional notes field (optional)
  - Confirmation checkbox
- **Risk Information Display**
  - Risk score with color coding
  - Matched risk rules

### 6. Widgets

#### ChainHealth (`src/widgets/status/ChainHealth.vue`)
- Real-time chain status monitoring
- Status indicators: Healthy, Degraded, Down
- Metrics: Block Height, Last Block Time, Sync Status, Node Count
- Issue alerts

### 7. Data Models

Added to `src/types/models.ts`:
- `Deposit`: Deposit transaction model
- `Withdrawal`: Withdrawal transaction model with approval workflow
- `Approval`: Multi-role approval record
- `WalletAddress`: Wallet address model
- `ChainHealth`: Blockchain health status
- `RetryTask`: Failed transaction retry queue item

## Features

### Deposits Management
- Real-time deposit monitoring
- Confirmation tracking with progress bars
- Risk flag detection and display
- Transaction detail viewing
- Export to CSV
- Notes management

### Withdrawals Management
- **Multi-Role Approval Workflow**
  - Configurable approval requirements based on risk score
  - High-risk withdrawals (score >= 70) require multiple role approvals
  - Role-based approval tracking (Finance Manager, Risk Manager)
  - Visual approval status indicators
  - Prevents duplicate approvals from same role
  - Automatic role detection from user permissions
- **Risk Assessment**
  - Risk score calculation and display
  - Risk rule matching and visualization
  - Color-coded risk indicators (green < 40, orange 40-69, red >= 70)
- **Batch Operations**
  - Batch approve multiple withdrawals
  - Batch reject multiple withdrawals
  - Batch summary table with key information
  - Unified reason for batch operations
- **Approval/Rejection Features**
  - Predefined reason templates for consistency
  - Custom reason support
  - Optional notes for additional context
  - Confirmation requirements for all actions
- **Approval History**
  - Complete approval timeline
  - Role-based approval tracking
  - Admin user identification
  - Timestamp for each approval action
- **Data Management**
  - Export to CSV
  - Notes management
  - Transaction detail viewing

### Wallet Management
- Hot and cold wallet monitoring
- Chain health status
- Balance tracking and synchronization
- Failed transaction retry queue
- Balance summary by wallet type

### Security Features
- **RBAC Integration**
  - Permission-based UI element visibility
  - Route-level access control
  - Action-level permission checks
- **Multi-Role Approval Workflow**
  - Configurable approval requirements
  - Risk-based approval thresholds
  - Role-specific approval tracking
  - Prevents single-user approval for high-risk transactions
  - Automatic role validation from user permissions
- **Risk Assessment**
  - Real-time risk scoring
  - Rule-based risk detection
  - Visual risk indicators
  - Risk-based workflow routing
- **Audit Trail**
  - Complete approval history
  - Notes management for context
  - Admin user tracking
  - Timestamp recording
- **Confirmation Requirements**
  - Mandatory confirmation for all critical actions
  - Reason requirements for rejections
  - Visual confirmation checkboxes

### User Experience
- Responsive design
- Real-time status updates
- Progress indicators
- Copy-to-clipboard functionality
- Comprehensive filtering options
- Export capabilities
- Empty states and loading skeletons

## Routes

All routes are configured in `src/router/modules/assets.ts`:
- `/admin/assets/deposits` - Deposits page
- `/admin/assets/withdrawals` - Withdrawals page
- `/admin/assets/wallets` - Wallets page

## Permissions

The following permissions are used:
- `assets.view` - View assets module
- `assets.deposits.view` - View deposits
- `assets.withdrawals.view` - View withdrawals
- `assets.wallets.view` - View wallets
- `withdrawals.approve` - Approve withdrawals
- `withdrawals.reject` - Reject withdrawals

## API Endpoints

### Deposits
- `GET /admin/deposits` - List deposits
- `GET /admin/deposits/:id` - Get deposit details
- `GET /admin/deposits/export` - Export deposits
- `PATCH /admin/deposits/:id/notes` - Update notes

### Withdrawals
- `GET /admin/withdrawals` - List withdrawals
  - Query params: page, pageSize, userId, currency, chain, status, startTime, endTime, minRiskScore, maxRiskScore, sortField, sortOrder
- `GET /admin/withdrawals/:id` - Get withdrawal details
- `POST /admin/withdrawals/:id/approve` - Approve withdrawal
  - Body: `{ role?: string, reason?: string, notes?: string }`
  - Multi-role support: role parameter identifies which role is approving
- `POST /admin/withdrawals/:id/reject` - Reject withdrawal
  - Body: `{ reason: string, notes?: string }`
- `POST /admin/withdrawals/batch-approve` - Batch approve withdrawals
  - Body: `{ ids: string[], role?: string, reason?: string }`
- `POST /admin/withdrawals/batch-reject` - Batch reject withdrawals
  - Body: `{ ids: string[], reason: string }`
- `GET /admin/withdrawals/export` - Export withdrawals to CSV
- `PATCH /admin/withdrawals/:id/notes` - Update withdrawal notes

### Wallets
- `GET /admin/wallets/addresses` - List wallet addresses
- `GET /admin/wallets/chain-health` - Get chain health status
- `GET /admin/wallets/retry-queue` - Get retry queue
- `POST /admin/wallets/retry-queue/:id/retry` - Retry task
- `POST /admin/wallets/retry-queue/:id/cancel` - Cancel task
- `POST /admin/wallets/addresses/:id/sync` - Sync balance

## Multi-Role Approval Configuration

The multi-role approval workflow is designed to provide enhanced security for high-risk withdrawal transactions.

### Configuration

The approval workflow is configured in `ApproveModal.vue`:

```typescript
// Multi-role approval configuration
const requiredRoles = ['Finance Manager', 'Risk Manager']
const riskThreshold = 70 // Withdrawals with risk score >= 70 require multi-role approval
```

### Workflow Logic

1. **Risk Assessment**: When a withdrawal is created, the system calculates a risk score (0-100)
2. **Threshold Check**: If risk score >= 70, multi-role approval is required
3. **Role Requirements**: High-risk withdrawals require approval from:
   - Finance Manager
   - Risk Manager
4. **Approval Process**:
   - Each role can approve independently
   - System tracks which roles have approved
   - Prevents duplicate approvals from the same role
   - Withdrawal is processed only after all required roles approve
5. **User Role Detection**: System automatically detects user's roles from auth store
6. **Role Selection**: If user has multiple required roles, they select which role they're approving under

### Visual Indicators

- **Approval Status Card**: Shows status for each required role
  - Green checkmark: Role has approved
  - Gray tag: Role approval pending
- **Progress Message**: Displays approval progress (e.g., "2 of 3 approvals received")
- **Role Selection**: Dropdown for users with multiple roles

### Backend Integration

The approval API includes the `role` parameter:

```typescript
POST /admin/withdrawals/:id/approve
Body: {
  role: "Finance Manager",  // Which role is approving
  reason: "Verified transaction details",
  notes: "Additional context"
}
```

The backend should:
1. Validate the user has the specified role
2. Check if the role has already approved
3. Record the approval with role, admin user, and timestamp
4. Check if all required roles have approved
5. Process withdrawal if all approvals received

## Testing

All components have been validated with TypeScript diagnostics and are error-free.

### Manual Testing Checklist

- [ ] Single withdrawal approval
- [ ] Single withdrawal rejection
- [ ] Batch withdrawal approval
- [ ] Batch withdrawal rejection
- [ ] Multi-role approval workflow (high-risk withdrawals)
- [ ] Role selection for users with multiple roles
- [ ] Approval status tracking
- [ ] Risk score visualization
- [ ] Matched rules display
- [ ] Filter functionality
- [ ] Export functionality
- [ ] Transaction detail drawer
- [ ] RBAC permission checks

## Next Steps

To complete the Assets module integration:
1. Connect to actual backend APIs
2. Implement WebSocket for real-time updates
3. Add comprehensive error handling
4. Implement unit and integration tests
5. Add i18n translations
6. Configure proper RBAC permissions in the backend
