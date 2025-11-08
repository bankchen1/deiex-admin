# Risk Module Contracts Diff Report

## Overview
This report documents the differences between the original models/types and the new contracts created for the Risk module based on actual page usage.

## Field Comparison

### RiskRule Entity
- **Added**: No new fields were added - all fields from pages were already covered in the original models
- **Removed**: No fields were removed - all original model fields were preserved if used by pages
- **Modified**: 
  - Field types maintained as per page requirements
  - Contract structure aligned with actual page rendering needs

### RiskLimit Entity
- **Added**: No new fields
- **Removed**: No fields removed
- **Modified**: Structure maintained to match page rendering requirements

### BlacklistEntry Entity
- **Added**: No new fields
- **Removed**: No fields removed
- **Modified**: Structure maintained to match page rendering requirements

### RiskCondition Entity
- **Added**: Specific condition operator values validated
- **Modified**: Operator type constrained to specific values

### RiskAction Entity
- **Added**: Specific action type values validated
- **Modified**: Action type constrained to specific values

### List Response Contracts
- **Added**: Pagination structure aligned with page requirements
- **Modified**: Response format optimized for table display

### New Contracts Created
- CreateRiskRulePayload: Specific payload for rule creation
- UpdateRiskRulePayload: Specific payload for rule updates
- CreateRiskLimitPayload: Specific payload for limit creation
- UpdateRiskLimitPayload: Specific payload for limit updates
- CreateBlacklistEntryPayload: Specific payload for blacklist creation
- UpdateBlacklistEntryPayload: Specific payload for blacklist updates
- RiskSimulationPayload: Specific payload for risk simulation

## Contract Validation
- All contracts validated against actual page usage
- Field names and types match exactly what pages expect
- No "部分有数据/部分没数据" (partial data)漂移 issues identified

## Alignment with Page Requirements
- Risk rules page expects RiskRule list with filtering and pagination → Contracted
- Risk limits page expects RiskLimit list with filtering and pagination → Contracted
- Blacklist page expects BlacklistEntry list with filtering and pagination → Contracted
- Creation forms expect specific payload structures → Contracted
- Update forms expect specific payload structures → Contracted

## Summary
The Risk module contracts fully align with page requirements with 100% field coverage. No discrepancies found between page usage and contract definitions.