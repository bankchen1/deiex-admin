# AdminConfigInstrumentsApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminConfigInstrumentsBatchHidePost**](#adminconfiginstrumentsbatchhidepost) | **POST** /admin/config/instruments/batch-hide | Hide instruments|
|[**adminConfigInstrumentsBatchShowPost**](#adminconfiginstrumentsbatchshowpost) | **POST** /admin/config/instruments/batch-show | Show instruments|
|[**adminConfigInstrumentsDiffGet**](#adminconfiginstrumentsdiffget) | **GET** /admin/config/instruments/diff | Get diff between draft and published|
|[**adminConfigInstrumentsDraftsBatchUpdatePost**](#adminconfiginstrumentsdraftsbatchupdatepost) | **POST** /admin/config/instruments/drafts/batch-update | Batch update instruments|
|[**adminConfigInstrumentsDraftsGet**](#adminconfiginstrumentsdraftsget) | **GET** /admin/config/instruments/drafts | Get draft instruments|
|[**adminConfigInstrumentsDraftsPost**](#adminconfiginstrumentsdraftspost) | **POST** /admin/config/instruments/drafts | Create a new instrument draft|
|[**adminConfigInstrumentsDraftsSymbolDelete**](#adminconfiginstrumentsdraftssymboldelete) | **DELETE** /admin/config/instruments/drafts/{symbol} | Delete an instrument draft|
|[**adminConfigInstrumentsDraftsSymbolPut**](#adminconfiginstrumentsdraftssymbolput) | **PUT** /admin/config/instruments/drafts/{symbol} | Update an existing instrument draft|
|[**adminConfigInstrumentsExportGet**](#adminconfiginstrumentsexportget) | **GET** /admin/config/instruments/export | Export instruments|
|[**adminConfigInstrumentsImpactEstimationGet**](#adminconfiginstrumentsimpactestimationget) | **GET** /admin/config/instruments/impact-estimation | Get impact estimation|
|[**adminConfigInstrumentsImportPost**](#adminconfiginstrumentsimportpost) | **POST** /admin/config/instruments/import | Import instruments|
|[**adminConfigInstrumentsPublishSymbolPost**](#adminconfiginstrumentspublishsymbolpost) | **POST** /admin/config/instruments/publish/{symbol} | Publish an instrument|
|[**adminConfigInstrumentsPublishedGet**](#adminconfiginstrumentspublishedget) | **GET** /admin/config/instruments/published | Get published instruments|
|[**adminConfigInstrumentsRollbackVersionIdPost**](#adminconfiginstrumentsrollbackversionidpost) | **POST** /admin/config/instruments/rollback/{versionId} | Rollback to specific version|
|[**adminConfigInstrumentsSymbolGet**](#adminconfiginstrumentssymbolget) | **GET** /admin/config/instruments/{symbol} | Get instrument by symbol|
|[**adminConfigInstrumentsValidateImportPost**](#adminconfiginstrumentsvalidateimportpost) | **POST** /admin/config/instruments/validate-import | Validate import data|
|[**adminConfigInstrumentsVersionsGet**](#adminconfiginstrumentsversionsget) | **GET** /admin/config/instruments/versions | Get version history|
|[**adminConfigInstrumentsVersionsSymbolGet**](#adminconfiginstrumentsversionssymbolget) | **GET** /admin/config/instruments/versions/{symbol} | Get all versions of an instrument|

# **adminConfigInstrumentsBatchHidePost**
> TypesAPIResponse adminConfigInstrumentsBatchHidePost(request)


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

let request: object; //Symbols to hide

const { status, data } = await apiInstance.adminConfigInstrumentsBatchHidePost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **object**| Symbols to hide | |


### Return type

**TypesAPIResponse**

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

# **adminConfigInstrumentsBatchShowPost**
> TypesAPIResponse adminConfigInstrumentsBatchShowPost(request)


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

let request: object; //Symbols to show

const { status, data } = await apiInstance.adminConfigInstrumentsBatchShowPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **object**| Symbols to show | |


### Return type

**TypesAPIResponse**

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

# **adminConfigInstrumentsDiffGet**
> TypesAPIResponse adminConfigInstrumentsDiffGet()


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

const { status, data } = await apiInstance.adminConfigInstrumentsDiffGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**TypesAPIResponse**

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

# **adminConfigInstrumentsDraftsBatchUpdatePost**
> TypesAPIResponse adminConfigInstrumentsDraftsBatchUpdatePost(request)


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

let request: object; //Batch updates

const { status, data } = await apiInstance.adminConfigInstrumentsDraftsBatchUpdatePost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **object**| Batch updates | |


### Return type

**TypesAPIResponse**

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

# **adminConfigInstrumentsDraftsGet**
> TypesAPIResponse adminConfigInstrumentsDraftsGet()


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

const { status, data } = await apiInstance.adminConfigInstrumentsDraftsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**TypesAPIResponse**

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

# **adminConfigInstrumentsDraftsPost**
> TypesAPIResponse adminConfigInstrumentsDraftsPost(request)


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration,
    InstrumentsInstrument
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

let request: InstrumentsInstrument; //Instrument data

const { status, data } = await apiInstance.adminConfigInstrumentsDraftsPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **InstrumentsInstrument**| Instrument data | |


### Return type

**TypesAPIResponse**

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

# **adminConfigInstrumentsDraftsSymbolDelete**
> TypesAPIResponse adminConfigInstrumentsDraftsSymbolDelete()


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

let symbol: string; //Instrument symbol (default to undefined)

const { status, data } = await apiInstance.adminConfigInstrumentsDraftsSymbolDelete(
    symbol
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] | Instrument symbol | defaults to undefined|


### Return type

**TypesAPIResponse**

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
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminConfigInstrumentsDraftsSymbolPut**
> TypesAPIResponse adminConfigInstrumentsDraftsSymbolPut(request)


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration,
    InstrumentsInstrument
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

let symbol: string; //Instrument symbol (default to undefined)
let request: InstrumentsInstrument; //Instrument data

const { status, data } = await apiInstance.adminConfigInstrumentsDraftsSymbolPut(
    symbol,
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **InstrumentsInstrument**| Instrument data | |
| **symbol** | [**string**] | Instrument symbol | defaults to undefined|


### Return type

**TypesAPIResponse**

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
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminConfigInstrumentsExportGet**
> TypesAPIResponse adminConfigInstrumentsExportGet()


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

let format: string; //Export format (csv/json) (optional) (default to undefined)

const { status, data } = await apiInstance.adminConfigInstrumentsExportGet(
    format
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **format** | [**string**] | Export format (csv/json) | (optional) defaults to undefined|


### Return type

**TypesAPIResponse**

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

# **adminConfigInstrumentsImpactEstimationGet**
> TypesAPIResponse adminConfigInstrumentsImpactEstimationGet()


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

const { status, data } = await apiInstance.adminConfigInstrumentsImpactEstimationGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**TypesAPIResponse**

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

# **adminConfigInstrumentsImportPost**
> TypesAPIResponse adminConfigInstrumentsImportPost(request)


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

let request: object; //Import data

const { status, data } = await apiInstance.adminConfigInstrumentsImportPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **object**| Import data | |


### Return type

**TypesAPIResponse**

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

# **adminConfigInstrumentsPublishSymbolPost**
> TypesAPIResponse adminConfigInstrumentsPublishSymbolPost()


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

let symbol: string; //Instrument symbol (default to undefined)

const { status, data } = await apiInstance.adminConfigInstrumentsPublishSymbolPost(
    symbol
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] | Instrument symbol | defaults to undefined|


### Return type

**TypesAPIResponse**

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
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminConfigInstrumentsPublishedGet**
> TypesAPIResponse adminConfigInstrumentsPublishedGet()


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

const { status, data } = await apiInstance.adminConfigInstrumentsPublishedGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**TypesAPIResponse**

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

# **adminConfigInstrumentsRollbackVersionIdPost**
> TypesAPIResponse adminConfigInstrumentsRollbackVersionIdPost(request)


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

let versionId: string; //Version ID (default to undefined)
let request: object; //Rollback notes

const { status, data } = await apiInstance.adminConfigInstrumentsRollbackVersionIdPost(
    versionId,
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **object**| Rollback notes | |
| **versionId** | [**string**] | Version ID | defaults to undefined|


### Return type

**TypesAPIResponse**

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
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminConfigInstrumentsSymbolGet**
> TypesAPIResponse adminConfigInstrumentsSymbolGet()


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

let symbol: string; //Instrument symbol (default to undefined)
let draft: boolean; //Get draft version (optional) (default to undefined)

const { status, data } = await apiInstance.adminConfigInstrumentsSymbolGet(
    symbol,
    draft
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] | Instrument symbol | defaults to undefined|
| **draft** | [**boolean**] | Get draft version | (optional) defaults to undefined|


### Return type

**TypesAPIResponse**

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
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminConfigInstrumentsValidateImportPost**
> TypesAPIResponse adminConfigInstrumentsValidateImportPost(request)


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

let request: object; //Import data

const { status, data } = await apiInstance.adminConfigInstrumentsValidateImportPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **object**| Import data | |


### Return type

**TypesAPIResponse**

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

# **adminConfigInstrumentsVersionsGet**
> TypesAPIResponse adminConfigInstrumentsVersionsGet()


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

const { status, data } = await apiInstance.adminConfigInstrumentsVersionsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**TypesAPIResponse**

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

# **adminConfigInstrumentsVersionsSymbolGet**
> TypesAPIResponse adminConfigInstrumentsVersionsSymbolGet()


### Example

```typescript
import {
    AdminConfigInstrumentsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminConfigInstrumentsApi(configuration);

let symbol: string; //Instrument symbol (default to undefined)

const { status, data } = await apiInstance.adminConfigInstrumentsVersionsSymbolGet(
    symbol
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] | Instrument symbol | defaults to undefined|


### Return type

**TypesAPIResponse**

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
|**404** | Not Found |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

