# AdminAssetsApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminDepositsGet**](#admindepositsget) | **GET** /admin/deposits | Get deposits|
|[**adminDepositsIdGet**](#admindepositsidget) | **GET** /admin/deposits/{id} | Get deposit by ID|
|[**adminDepositsIdNotesPatch**](#admindepositsidnotespatch) | **PATCH** /admin/deposits/{id}/notes | Update deposit notes|
|[**adminWalletsAddressesGet**](#adminwalletsaddressesget) | **GET** /admin/wallets/addresses | Get wallet addresses|
|[**adminWalletsChainHealthGet**](#adminwalletschainhealthget) | **GET** /admin/wallets/chain-health | Get chain health|
|[**adminWalletsRetryQueueGet**](#adminwalletsretryqueueget) | **GET** /admin/wallets/retry-queue | Get retry tasks|
|[**adminWalletsRetryQueueIdCancelPost**](#adminwalletsretryqueueidcancelpost) | **POST** /admin/wallets/retry-queue/{id}/cancel | Cancel retry task|
|[**adminWalletsRetryQueueIdRetryPost**](#adminwalletsretryqueueidretrypost) | **POST** /admin/wallets/retry-queue/{id}/retry | Retry task|
|[**adminWithdrawalsGet**](#adminwithdrawalsget) | **GET** /admin/withdrawals | Get withdrawals|
|[**adminWithdrawalsIdApprovePost**](#adminwithdrawalsidapprovepost) | **POST** /admin/withdrawals/{id}/approve | Approve withdrawal|
|[**adminWithdrawalsIdGet**](#adminwithdrawalsidget) | **GET** /admin/withdrawals/{id} | Get withdrawal by ID|
|[**adminWithdrawalsIdNotesPatch**](#adminwithdrawalsidnotespatch) | **PATCH** /admin/withdrawals/{id}/notes | Update withdrawal notes|
|[**adminWithdrawalsIdRejectPost**](#adminwithdrawalsidrejectpost) | **POST** /admin/withdrawals/{id}/reject | Reject withdrawal|

# **adminDepositsGet**
> AdminDepositsGet200Response adminDepositsGet()


### Example

```typescript
import {
    AdminAssetsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAssetsApi(configuration);

let page: number; //Page number (optional) (default to 1)
let pageSize: number; //Page size (optional) (default to 10)

const { status, data } = await apiInstance.adminDepositsGet(
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

**AdminDepositsGet200Response**

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

# **adminDepositsIdGet**
> AdminDepositsIdGet200Response adminDepositsIdGet()


### Example

```typescript
import {
    AdminAssetsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAssetsApi(configuration);

let id: string; //Deposit ID (default to undefined)

const { status, data } = await apiInstance.adminDepositsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Deposit ID | defaults to undefined|


### Return type

**AdminDepositsIdGet200Response**

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

# **adminDepositsIdNotesPatch**
> AdminDepositsIdNotesPatch200Response adminDepositsIdNotesPatch(request)


### Example

```typescript
import {
    AdminAssetsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAssetsApi(configuration);

let id: string; //Deposit ID (default to undefined)
let request: { [key: string]: string; }; //Notes update data

const { status, data } = await apiInstance.adminDepositsIdNotesPatch(
    id,
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **{ [key: string]: string; }**| Notes update data | |
| **id** | [**string**] | Deposit ID | defaults to undefined|


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

# **adminWalletsAddressesGet**
> AdminWalletsAddressesGet200Response adminWalletsAddressesGet()


### Example

```typescript
import {
    AdminAssetsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAssetsApi(configuration);

const { status, data } = await apiInstance.adminWalletsAddressesGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AdminWalletsAddressesGet200Response**

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

# **adminWalletsChainHealthGet**
> AdminWalletsChainHealthGet200Response adminWalletsChainHealthGet()


### Example

```typescript
import {
    AdminAssetsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAssetsApi(configuration);

const { status, data } = await apiInstance.adminWalletsChainHealthGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AdminWalletsChainHealthGet200Response**

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

# **adminWalletsRetryQueueGet**
> AdminWalletsRetryQueueGet200Response adminWalletsRetryQueueGet()


### Example

```typescript
import {
    AdminAssetsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAssetsApi(configuration);

const { status, data } = await apiInstance.adminWalletsRetryQueueGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AdminWalletsRetryQueueGet200Response**

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

# **adminWalletsRetryQueueIdCancelPost**
> AdminDepositsIdNotesPatch200Response adminWalletsRetryQueueIdCancelPost()


### Example

```typescript
import {
    AdminAssetsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAssetsApi(configuration);

let id: string; //Task ID (default to undefined)

const { status, data } = await apiInstance.adminWalletsRetryQueueIdCancelPost(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Task ID | defaults to undefined|


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

# **adminWalletsRetryQueueIdRetryPost**
> AdminDepositsIdNotesPatch200Response adminWalletsRetryQueueIdRetryPost()


### Example

```typescript
import {
    AdminAssetsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAssetsApi(configuration);

let id: string; //Task ID (default to undefined)

const { status, data } = await apiInstance.adminWalletsRetryQueueIdRetryPost(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Task ID | defaults to undefined|


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

# **adminWithdrawalsGet**
> AdminWithdrawalsGet200Response adminWithdrawalsGet()


### Example

```typescript
import {
    AdminAssetsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAssetsApi(configuration);

let page: number; //Page number (optional) (default to 1)
let pageSize: number; //Page size (optional) (default to 10)

const { status, data } = await apiInstance.adminWithdrawalsGet(
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

**AdminWithdrawalsGet200Response**

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

# **adminWithdrawalsIdApprovePost**
> AdminDepositsIdNotesPatch200Response adminWithdrawalsIdApprovePost(request)


### Example

```typescript
import {
    AdminAssetsApi,
    Configuration,
    AssetsApproval
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAssetsApi(configuration);

let id: string; //Withdrawal ID (default to undefined)
let request: AssetsApproval; //Approval data

const { status, data } = await apiInstance.adminWithdrawalsIdApprovePost(
    id,
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **AssetsApproval**| Approval data | |
| **id** | [**string**] | Withdrawal ID | defaults to undefined|


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

# **adminWithdrawalsIdGet**
> AdminWithdrawalsIdGet200Response adminWithdrawalsIdGet()


### Example

```typescript
import {
    AdminAssetsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAssetsApi(configuration);

let id: string; //Withdrawal ID (default to undefined)

const { status, data } = await apiInstance.adminWithdrawalsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Withdrawal ID | defaults to undefined|


### Return type

**AdminWithdrawalsIdGet200Response**

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

# **adminWithdrawalsIdNotesPatch**
> AdminDepositsIdNotesPatch200Response adminWithdrawalsIdNotesPatch(request)


### Example

```typescript
import {
    AdminAssetsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAssetsApi(configuration);

let id: string; //Withdrawal ID (default to undefined)
let request: { [key: string]: string; }; //Notes update data

const { status, data } = await apiInstance.adminWithdrawalsIdNotesPatch(
    id,
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **{ [key: string]: string; }**| Notes update data | |
| **id** | [**string**] | Withdrawal ID | defaults to undefined|


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

# **adminWithdrawalsIdRejectPost**
> AdminDepositsIdNotesPatch200Response adminWithdrawalsIdRejectPost(request)


### Example

```typescript
import {
    AdminAssetsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAssetsApi(configuration);

let id: string; //Withdrawal ID (default to undefined)
let request: { [key: string]: string; }; //Rejection reason

const { status, data } = await apiInstance.adminWithdrawalsIdRejectPost(
    id,
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **{ [key: string]: string; }**| Rejection reason | |
| **id** | [**string**] | Withdrawal ID | defaults to undefined|


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

