# Architecture Compliance Report

## Overview
This report documents the architecture violations identified in the project where components are not following the proper Contract+Service+Mock architecture pattern.

## Stores Not Using Facade Pattern

### 1. Mappings Store (`src/stores/mappings.ts`)
- **Current**: Using direct `mappingsApi` from `/services/api/config.mappings`
- **Required**: Should use functions from `/services/api/facade` 
- **Affected Functions**: 
  - `getNavMappings`
  - `getNavMappingById`
  - `createNavMapping`
  - `updateNavMapping`
  - `deleteNavMapping`
  - `validateNavMappings`
  - `bulkSyncNavMappings`
  - `getRouteRedirects`
  - `getRedirectById`
  - `createRedirect`
  - `updateRedirect`
  - `deleteRedirect`
  - `getRedirectGraph`
  - `validateRedirects`
  - `getPageApiRelations`
  - `getPageApiRelation`
  - `updatePageApiRelation`
  - `scanPageApiRelations`
  - `validatePageApiRelations`
  - `exportMappings`
  - `importMappings`

### 2. Reports Store (`src/stores/reports.ts`)
- **Current**: Using direct `reportsApi` from `/services/api/reports`
- **Required**: Should use functions from `/services/api/facade`
- **Affected Functions**:
  - `getTradeReports`
  - `getTradeDailyData`
  - `getSymbolVolumeData`
  - `exportTradeReport`
  - `getFinanceReports`
  - `getFinanceDailyData`
  - `getFeeIncomeData`
  - `exportFinanceReport`
  - `getRetentionReports`
  - `getRetentionData`
  - `getFunnelData`
  - `exportRetentionReport`

### 3. Settings Store (`src/stores/settings.ts`)
- **Current**: Using direct `settingsApi` from `/services/api/settings`
- **Required**: Should use functions from `/services/api/facade`
- **Affected Functions**:
  - `getGeneralSettings`
  - `updateGeneralSettings`
  - `getThemeSettings`
  - `updateThemeSettings`
  - `getI18nEntries`
  - `getI18nEntry`
  - `updateI18nEntry`
  - `createI18nEntry`
  - `deleteI18nEntry`
  - `bulkImportI18n`
  - `exportI18n`
  - `scanMissingKeys`
  - `getFeatureFlags`
  - `updateFeatureFlag`
  - `getCacheStatus`
  - `refreshCache`
  - `clearCache`

### 4. Instruments Store (`src/stores/instruments.ts`)
- **Current**: Using direct `instrumentsApi` from `/services/api/config.instruments`
- **Required**: Should use functions from `/services/api/facade`
- **Affected Functions**:
  - `getPublished`
  - `getDrafts`
  - `getById`
  - `createDraft`
  - `updateDraft`
  - `deleteDraft`
  - `batchUpdate`
  - `publish`
  - `getVersions`
  - `getVersion`
  - `rollback`
  - `getDiff`
  - `export`
  - `import`
  - `validateImport`
  - `getImpactEstimation`
  - `batchShow`
  - `batchHide`

### 5. Calendar Store (`src/stores/calendar.ts`)
- **Current**: Using direct `calendarApi` from `/services/api/config.calendar`
- **Required**: Should use functions from `/services/api/facade`
- **Affected Functions**:
  - `getPublishedFunding`
  - `getDraftFunding`
  - `getFundingById`
  - `createDraftFunding`
  - `updateDraftFunding`
  - `deleteDraftFunding`
  - `getPublishedMaintenance`
  - `getDraftMaintenance`
  - `getMaintenanceById`
  - `createDraftMaintenance`
  - `updateDraftMaintenance`
  - `deleteDraftMaintenance`
  - `getPublishedAnnouncements`
  - `getDraftAnnouncements`
  - `getAnnouncementById`
  - `createDraftAnnouncement`
  - `updateDraftAnnouncement`
  - `deleteDraftAnnouncement`
  - `getVersions`
  - `getDiff`
  - `publish`
  - `rollback`
  - `validateTimeConflicts`
  - `exportData`
  - `importData`

### 6. Margin Store (`src/stores/margin.ts`)
- **Current**: Using direct `marginApi` from `/services/api/config.margin`
- **Required**: Should use functions from `/services/api/facade`
- **Affected Functions**:
  - `getPublishedTemplates`
  - `getDraftTemplates`
  - `getTemplateById`
  - `createDraftTemplate`
  - `updateDraftTemplate`
  - `deleteDraftTemplate`
  - `getPublishedBindings`
  - `getDraftBindings`
  - `updateDraftBinding`
  - `batchBind`
  - `batchUnbind`
  - `publish`
  - `getVersions`
  - `getVersion`
  - `rollback`
  - `getDiff`
  - `getImpactEstimation`
  - `export`
  - `import`
  - `validateImport`
  - `calculateMargin`

### 7. Security Store (`src/stores/security.ts`)
- **Current**: Using direct `securityApi` from `/services/api/config.security`
- **Required**: Should use functions from `/services/api/facade`
- **Affected Functions**:
  - `getRoles`
  - `getRoleById`
  - `createRole`
  - `updateRole`
  - `deleteRole`
  - `getPermissionTree`
  - `getAllPermissions`
  - `getAdminUsers`
  - `getAdminUserById`
  - `createAdminUser`
  - `updateAdminUser`
  - `disableAdminUser`
  - `enableAdminUser`
  - `resetAdminPassword`
  - `getIpWhitelist`
  - `addIpWhitelist`
  - `removeIpWhitelist`
  - `getApiKeys`
  - `createApiKey`
  - `revokeApiKey`
  - `regenerateApiKey`
  - `getAuditLogs`
  - `getAuditLogById`
  - `exportAuditLogs`

## Missing Facade Implementations

The following modules need facade implementations:
1. mappings/redirects module
2. reports module
3. settings module
4. instruments module
5. calendar module
6. margin module
7. security module

## Recommended Action Plan

1. Create missing facade functions for each module
2. Update all stores to use facade pattern
3. Ensure proper contract definitions for each module
4. Update mock data and handlers to align with contracts
5. Verify all pages are using stores instead of direct API calls

## Status
Critical - These violations prevent the architecture from being fully compliant with the Contract+Service+Mock pattern.