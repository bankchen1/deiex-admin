# AuthApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1AuthChangePasswordPost**](#apiv1authchangepasswordpost) | **POST** /api/v1/auth/change-password | Change password|
|[**apiV1AuthForgotPasswordPost**](#apiv1authforgotpasswordpost) | **POST** /api/v1/auth/forgot-password | Request password reset|
|[**apiV1AuthLoginPost**](#apiv1authloginpost) | **POST** /api/v1/auth/login | Login|
|[**apiV1AuthLogoutPost**](#apiv1authlogoutpost) | **POST** /api/v1/auth/logout | Logout|
|[**apiV1AuthRefreshPost**](#apiv1authrefreshpost) | **POST** /api/v1/auth/refresh | Refresh access token|
|[**apiV1AuthRegisterPost**](#apiv1authregisterpost) | **POST** /api/v1/auth/register | Register a new user|
|[**apiV1AuthResetPasswordPost**](#apiv1authresetpasswordpost) | **POST** /api/v1/auth/reset-password | Reset password with token|

# **apiV1AuthChangePasswordPost**
> AdminDepositsIdNotesPatch200Response apiV1AuthChangePasswordPost(request)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    TypesChangePasswordRequest
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let request: TypesChangePasswordRequest; //Password change data

const { status, data } = await apiInstance.apiV1AuthChangePasswordPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **TypesChangePasswordRequest**| Password change data | |


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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1AuthForgotPasswordPost**
> ApiV1AuthForgotPasswordPost200Response apiV1AuthForgotPasswordPost(request)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    TypesForgotPasswordRequest
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let request: TypesForgotPasswordRequest; //Email address

const { status, data } = await apiInstance.apiV1AuthForgotPasswordPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **TypesForgotPasswordRequest**| Email address | |


### Return type

**ApiV1AuthForgotPasswordPost200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1AuthLoginPost**
> ApiV1AuthLoginPost200Response apiV1AuthLoginPost(request)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    TypesLoginRequest
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let request: TypesLoginRequest; //Login credentials

const { status, data } = await apiInstance.apiV1AuthLoginPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **TypesLoginRequest**| Login credentials | |


### Return type

**ApiV1AuthLoginPost200Response**

### Authorization

No authorization required

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

# **apiV1AuthLogoutPost**
> AdminDepositsIdNotesPatch200Response apiV1AuthLogoutPost()


### Example

```typescript
import {
    AuthApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.apiV1AuthLogoutPost();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AdminDepositsIdNotesPatch200Response**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1AuthRefreshPost**
> ApiV1AuthLoginPost200Response apiV1AuthRefreshPost()


### Example

```typescript
import {
    AuthApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let authorization: string; //Refresh token (default to 'Bearer <refresh_token>')

const { status, data } = await apiInstance.apiV1AuthRefreshPost(
    authorization
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authorization** | [**string**] | Refresh token | defaults to 'Bearer <refresh_token>'|


### Return type

**ApiV1AuthLoginPost200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1AuthRegisterPost**
> ApiV1AuthLoginPost200Response apiV1AuthRegisterPost(request)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    TypesRegisterRequest
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let request: TypesRegisterRequest; //Registration data

const { status, data } = await apiInstance.apiV1AuthRegisterPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **TypesRegisterRequest**| Registration data | |


### Return type

**ApiV1AuthLoginPost200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |
|**400** | Bad Request |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1AuthResetPasswordPost**
> AdminDepositsIdNotesPatch200Response apiV1AuthResetPasswordPost(request)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    TypesResetPasswordRequest
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let request: TypesResetPasswordRequest; //Reset password data

const { status, data } = await apiInstance.apiV1AuthResetPasswordPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **TypesResetPasswordRequest**| Reset password data | |


### Return type

**AdminDepositsIdNotesPatch200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

