# UsersApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1UsersPreferencesGet**](#apiv1userspreferencesget) | **GET** /api/v1/users/preferences | Get user preferences|
|[**apiV1UsersPreferencesPut**](#apiv1userspreferencesput) | **PUT** /api/v1/users/preferences | Update user preferences|
|[**apiV1UsersProfileGet**](#apiv1usersprofileget) | **GET** /api/v1/users/profile | Get user profile|
|[**apiV1UsersProfilePut**](#apiv1usersprofileput) | **PUT** /api/v1/users/profile | Update user profile|
|[**apiV1UsersSecurityGet**](#apiv1userssecurityget) | **GET** /api/v1/users/security | Get user security settings|
|[**apiV1UsersSecurityPut**](#apiv1userssecurityput) | **PUT** /api/v1/users/security | Update user security settings|
|[**apiV1UsersStatsGet**](#apiv1usersstatsget) | **GET** /api/v1/users/stats | Get user statistics|

# **apiV1UsersPreferencesGet**
> ApiV1UsersPreferencesGet200Response apiV1UsersPreferencesGet()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.apiV1UsersPreferencesGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiV1UsersPreferencesGet200Response**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1UsersPreferencesPut**
> ApiV1UsersPreferencesGet200Response apiV1UsersPreferencesPut(request)


### Example

```typescript
import {
    UsersApi,
    Configuration,
    TypesUpdatePreferencesRequest
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let request: TypesUpdatePreferencesRequest; //Preferences update data

const { status, data } = await apiInstance.apiV1UsersPreferencesPut(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **TypesUpdatePreferencesRequest**| Preferences update data | |


### Return type

**ApiV1UsersPreferencesGet200Response**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1UsersProfileGet**
> ApiV1UsersProfileGet200Response apiV1UsersProfileGet()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.apiV1UsersProfileGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiV1UsersProfileGet200Response**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1UsersProfilePut**
> ApiV1UsersProfileGet200Response apiV1UsersProfilePut(request)


### Example

```typescript
import {
    UsersApi,
    Configuration,
    TypesUpdateProfileRequest
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let request: TypesUpdateProfileRequest; //Profile update data

const { status, data } = await apiInstance.apiV1UsersProfilePut(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **TypesUpdateProfileRequest**| Profile update data | |


### Return type

**ApiV1UsersProfileGet200Response**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1UsersSecurityGet**
> ApiV1UsersSecurityGet200Response apiV1UsersSecurityGet()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.apiV1UsersSecurityGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiV1UsersSecurityGet200Response**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1UsersSecurityPut**
> ApiV1UsersSecurityGet200Response apiV1UsersSecurityPut(request)


### Example

```typescript
import {
    UsersApi,
    Configuration,
    TypesUpdateSecurityRequest
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let request: TypesUpdateSecurityRequest; //Security update data

const { status, data } = await apiInstance.apiV1UsersSecurityPut(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **TypesUpdateSecurityRequest**| Security update data | |


### Return type

**ApiV1UsersSecurityGet200Response**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1UsersStatsGet**
> ApiV1UsersSecurityGet200Response apiV1UsersStatsGet()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.apiV1UsersStatsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiV1UsersSecurityGet200Response**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

