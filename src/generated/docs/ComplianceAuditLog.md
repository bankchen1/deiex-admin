# ComplianceAuditLog


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**action** | **string** |  | [optional] [default to undefined]
**category** | [**ComplianceAuditLogCategory**](ComplianceAuditLogCategory.md) |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**ip** | **string** |  | [optional] [default to undefined]
**level** | [**ComplianceAuditLogLevel**](ComplianceAuditLogLevel.md) |  | [optional] [default to undefined]
**message** | **string** |  | [optional] [default to undefined]
**metadata** | **{ [key: string]: any; }** |  | [optional] [default to undefined]
**userId** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ComplianceAuditLog } from 'deiex-admin-sdk';

const instance: ComplianceAuditLog = {
    action,
    category,
    createdAt,
    id,
    ip,
    level,
    message,
    metadata,
    userId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
