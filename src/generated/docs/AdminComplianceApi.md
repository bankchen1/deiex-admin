# AdminComplianceApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminComplianceAuditGet**](#admincomplianceauditget) | **GET** /admin/compliance/audit | Get audit logs|
|[**adminComplianceAuditIdGet**](#admincomplianceauditidget) | **GET** /admin/compliance/audit/{id} | Get audit log by ID|

# **adminComplianceAuditGet**
> AdminComplianceAuditGet200Response adminComplianceAuditGet()


### Example

```typescript
import {
    AdminComplianceApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminComplianceApi(configuration);

let page: number; //Page number (optional) (default to 1)
let pageSize: number; //Page size (optional) (default to 10)
let category: string; //Category filter (optional) (default to undefined)
let severity: string; //Severity filter (optional) (default to undefined)
let startTime: number; //Start time filter (Unix timestamp) (optional) (default to undefined)
let endTime: number; //End time filter (Unix timestamp) (optional) (default to undefined)

const { status, data } = await apiInstance.adminComplianceAuditGet(
    page,
    pageSize,
    category,
    severity,
    startTime,
    endTime
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number | (optional) defaults to 1|
| **pageSize** | [**number**] | Page size | (optional) defaults to 10|
| **category** | [**string**] | Category filter | (optional) defaults to undefined|
| **severity** | [**string**] | Severity filter | (optional) defaults to undefined|
| **startTime** | [**number**] | Start time filter (Unix timestamp) | (optional) defaults to undefined|
| **endTime** | [**number**] | End time filter (Unix timestamp) | (optional) defaults to undefined|


### Return type

**AdminComplianceAuditGet200Response**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminComplianceAuditIdGet**
> AdminComplianceAuditIdGet200Response adminComplianceAuditIdGet()


### Example

```typescript
import {
    AdminComplianceApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminComplianceApi(configuration);

let id: string; //Audit log ID (default to undefined)

const { status, data } = await apiInstance.adminComplianceAuditIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Audit log ID | defaults to undefined|


### Return type

**AdminComplianceAuditIdGet200Response**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

