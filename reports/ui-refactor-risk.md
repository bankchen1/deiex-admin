# Risk Module UI Refactoring Report

## Overview
This report documents the refactoring of Risk module pages to use the new three-piece set (contracts, services, mock).

## Pages Refactored

### src/pages/risk/Rules.vue
- **Status**: Requires Attention
- **Current State**: Not using store yet, needs to be updated to use useRiskStore()
- **Expected Changes**:
  - Import and use `useRiskStore()` 
  - Replace any direct API calls with store methods
  - Use store for pagination and filtering

### src/pages/risk/Limits.vue
- **Status**: Requires Attention
- **Expected Changes**:
  - Import and use `useRiskStore()`
  - Use store methods for fetching and managing limits

### src/pages/risk/Blacklist.vue
- **Status**: Requires Attention
- **Expected Changes**:
  - Import and use `useRiskStore()`
  - Use store methods for fetching and managing blacklist entries

## Issues Identified

1. **Pages Not Using Stores**: 
   - Risk pages currently don't use Pinia stores
   - Need to implement store usage following the pattern established in users module

2. **Type Imports**:
   - Need to ensure all pages use contracts instead of models for type definitions

## Compliance Status
- ✅ Contracts: All contracts properly defined and aligned
- ✅ Services: Facade properly implemented with mock/real switching
- ❌ UI: Not yet compliant, pages need to be updated to use stores

## Next Steps
1. Update all Risk pages to use the new Risk store
2. Update all Risk modals/drawers to use store methods
3. Test mock ↔ real switching functionality
4. Verify no hardcoded data exists in UI components