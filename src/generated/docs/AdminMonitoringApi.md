# AdminMonitoringApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminMonitoringTransactionsGet**](#adminmonitoringtransactionsget) | **GET** /admin/monitoring/transactions | Get transactions|
|[**adminMonitoringTransactionsIdApprovePost**](#adminmonitoringtransactionsidapprovepost) | **POST** /admin/monitoring/transactions/{id}/approve | Approve transaction|
|[**adminMonitoringTransactionsIdGet**](#adminmonitoringtransactionsidget) | **GET** /admin/monitoring/transactions/{id} | Get transaction by ID|
|[**adminMonitoringTransactionsIdRejectPost**](#adminmonitoringtransactionsidrejectpost) | **POST** /admin/monitoring/transactions/{id}/reject | Reject transaction|

# **adminMonitoringTransactionsGet**
> AdminMonitoringTransactionsGet200Response adminMonitoringTransactionsGet()


### Example

```typescript
import {
    AdminMonitoringApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminMonitoringApi(configuration);

let page: number; //Page number (optional) (default to 1)
let pageSize: number; //Page size (optional) (default to 10)

const { status, data } = await apiInstance.adminMonitoringTransactionsGet(
    page,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number | (optional) defaults to 1|
| **pageSize** | [**number**] | Page size | (optional) defaults to 10|


### Return type

**AdminMonitoringTransactionsGet200Response**

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

# **adminMonitoringTransactionsIdApprovePost**
> AdminDepositsIdNotesPatch200Response adminMonitoringTransactionsIdApprovePost()


### Example

```typescript
import {
    AdminMonitoringApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminMonitoringApi(configuration);

let id: string; //Transaction ID (default to undefined)

const { status, data } = await apiInstance.adminMonitoringTransactionsIdApprovePost(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Transaction ID | defaults to undefined|


### Return type

**AdminDepositsIdNotesPatch200Response**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminMonitoringTransactionsIdGet**
> AdminMonitoringTransactionsIdGet200Response adminMonitoringTransactionsIdGet()


### Example

```typescript
import {
    AdminMonitoringApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminMonitoringApi(configuration);

let id: string; //Transaction ID (default to undefined)

const { status, data } = await apiInstance.adminMonitoringTransactionsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Transaction ID | defaults to undefined|


### Return type

**AdminMonitoringTransactionsIdGet200Response**

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

# **adminMonitoringTransactionsIdRejectPost**
> AdminDepositsIdNotesPatch200Response adminMonitoringTransactionsIdRejectPost(request)


### Example

```typescript
import {
    AdminMonitoringApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminMonitoringApi(configuration);

let id: string; //Transaction ID (default to undefined)
let request: { [key: string]: string; }; //Rejection reason

const { status, data } = await apiInstance.adminMonitoringTransactionsIdRejectPost(
    id,
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **{ [key: string]: string; }**| Rejection reason | |
| **id** | [**string**] | Transaction ID | defaults to undefined|


### Return type

**AdminDepositsIdNotesPatch200Response**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

