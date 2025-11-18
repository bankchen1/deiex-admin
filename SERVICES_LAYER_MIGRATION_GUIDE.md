# Services Layer Migration Guide

This document provides guidance on migrating from the current services implementation to the new refactored version.

## 1. Overview of Changes

### 1.1 New Unified API Client
- Replaced `AdminApiClient` with `UnifiedApiClient`
- Added centralized configuration management
- Enhanced mock mode handling

### 1.2 Refactored Facade Pattern
- Introduced `BaseFacade` abstract class for consistent implementation
- Standardized mock/real mode switching
- Improved pagination handling
- Better error handling and response formatting

### 1.3 Enhanced Mock System
- Created `MockDataStore` for centralized mock data management
- Implemented `MockRouter` for better route handling
- Added mock data generators for consistent test data

## 2. Migration Steps

### 2.1 Update API Client Usage

**Old implementation:**
```typescript
import { apiClient } from '@/services/api/AdminApiClient'
```

**New implementation:**
```typescript
import { unifiedApiClient } from '@/services/api/UnifiedApiClient'
```

### 2.2 Update Facade Usage

**Old implementation:**
```typescript
import { listDeposits } from '@/services/api/facade/assets'
```

**New implementation:**
```typescript
import { assetsFacade } from '@/services/api/facade'
// Or use convenience exports:
import { listDeposits } from '@/services/api/facade'
```

### 2.3 Update Mock Service Usage

**Old implementation:**
```typescript
import { mockService } from '@/services/mock'
```

**New implementation:**
```typescript
import { mockService } from '@/services/mock'
// The service now uses the enhanced router and data store
```

## 3. Backward Compatibility

The new implementation maintains backward compatibility with the existing facade function signatures. You can gradually migrate modules without breaking existing functionality.

## 4. Testing During Migration

1. Enable mock mode to test without backend dependencies
2. Verify that existing UI components work with new facades
3. Test pagination, filtering, and sorting functionality
4. Validate error handling and user feedback

## 5. Rollout Strategy

### Phase 1: Core Infrastructure
- Deploy new `UnifiedApiClient`
- Update configuration management
- Test mock mode functionality

### Phase 2: Facade Migration
- Migrate one module at a time (e.g., start with assets)
- Update UI components to use new facade exports
- Validate functionality and performance

### Phase 3: Mock System Enhancement
- Replace existing mock modules with new router-based handlers
- Migrate mock data to centralized store
- Update mock data generators

### Phase 4: Cleanup
- Remove deprecated files and code
- Update documentation
- Perform final testing and validation

## 6. Common Migration Issues

### 6.1 Type Incompatibilities
Ensure that response types match between old and new implementations.

### 6.2 Mock Data Consistency
When migrating mock modules, ensure data consistency across related entities.

### 6.3 Error Handling
Verify that error messages and handling are consistent with user expectations.

## 7. Validation Checklist

- [ ] All existing functionality works with new implementation
- [ ] Mock mode provides consistent test data
- [ ] Error handling is properly implemented
- [ ] Performance is acceptable
- [ ] Documentation is updated
- [ ] Tests pass successfully