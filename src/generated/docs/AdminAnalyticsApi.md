# AdminAnalyticsApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminAnalyticsUserBehaviorGeoGet**](#adminanalyticsuserbehaviorgeoget) | **GET** /admin/analytics/user-behavior/geo | Get geographic distribution|
|[**adminAnalyticsUserBehaviorRetentionGet**](#adminanalyticsuserbehaviorretentionget) | **GET** /admin/analytics/user-behavior/retention | Get user retention|
|[**adminAnalyticsUserBehaviorSummaryGet**](#adminanalyticsuserbehaviorsummaryget) | **GET** /admin/analytics/user-behavior/summary | Get user behavior summary|
|[**adminAnalyticsUserBehaviorTopGet**](#adminanalyticsuserbehaviortopget) | **GET** /admin/analytics/user-behavior/top | Get top activities|

# **adminAnalyticsUserBehaviorGeoGet**
> AdminAnalyticsUserBehaviorGeoGet200Response adminAnalyticsUserBehaviorGeoGet()


### Example

```typescript
import {
    AdminAnalyticsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAnalyticsApi(configuration);

const { status, data } = await apiInstance.adminAnalyticsUserBehaviorGeoGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AdminAnalyticsUserBehaviorGeoGet200Response**

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

# **adminAnalyticsUserBehaviorRetentionGet**
> AdminAnalyticsUserBehaviorRetentionGet200Response adminAnalyticsUserBehaviorRetentionGet()


### Example

```typescript
import {
    AdminAnalyticsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAnalyticsApi(configuration);

const { status, data } = await apiInstance.adminAnalyticsUserBehaviorRetentionGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AdminAnalyticsUserBehaviorRetentionGet200Response**

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

# **adminAnalyticsUserBehaviorSummaryGet**
> AdminAnalyticsUserBehaviorSummaryGet200Response adminAnalyticsUserBehaviorSummaryGet()


### Example

```typescript
import {
    AdminAnalyticsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAnalyticsApi(configuration);

const { status, data } = await apiInstance.adminAnalyticsUserBehaviorSummaryGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AdminAnalyticsUserBehaviorSummaryGet200Response**

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

# **adminAnalyticsUserBehaviorTopGet**
> AdminAnalyticsUserBehaviorTopGet200Response adminAnalyticsUserBehaviorTopGet()


### Example

```typescript
import {
    AdminAnalyticsApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new AdminAnalyticsApi(configuration);

const { status, data } = await apiInstance.adminAnalyticsUserBehaviorTopGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AdminAnalyticsUserBehaviorTopGet200Response**

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

