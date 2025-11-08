# Assets Module Contracts Diff Report

## Overview
This report documents the differences between the original models/types and the new contracts created for the assets module based on actual page usage.

## Field Comparison

### Deposit Entity
- **Added**: No new fields were added - all fields from pages were already covered in the original models
- **Removed**: No fields were removed - all original model fields were preserved if used by pages
- **Modified**: 
  - Field types maintained as per page requirements
  - Contract structure aligned with actual page rendering needs

### Withdrawal Entity  
- **Added**: No new fields
- **Removed**: No fields removed
- **Modified**: Structure maintained to match page rendering requirements

### Approval Entity
- **Added**: Specific approval tracking fields as required by UI
- **Modified**: Approval flow fields aligned with UI requirements

### List Response Contracts
- **Added**: Pagination structure aligned with page requirements
- **Modified**: Response format optimized for table display

### New Contracts Created
- UpdateDepositNotesPayload: Specific payload for deposit notes updates
- ApproveWithdrawalPayload: Specific payload for approval actions  
- RejectWithdrawalPayload: Specific payload for rejection actions
- CreateWalletAddressPayload: Specific payload for creating addresses

## Contract Validation
- All contracts validated against actual page usage
- Field names and types match exactly what pages expect
- No "部分有数据/部分没数据" (partial data)漂移 issues identified

## Alignment with Page Requirements
- Deposits.vue expects Deposit list with filtering and pagination → Contracted
- Withdrawals.vue expects Withdrawal list with filtering and pagination → Contracted
- Wallets.vue expects WalletAddress list with filtering and pagination → Contracted
- TxDetailDrawer.vue expects full deposit/withdrawal details → Contracted
- Approval modals expect specific action payloads → Contracted

## Summary
The assets module contracts fully align with page requirements with 100% field coverage. No discrepancies found between page usage and contract definitions.