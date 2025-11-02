# TradingApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1OrdersOrderIdDelete**](#apiv1ordersorderiddelete) | **DELETE** /api/v1/orders/{orderId} | Cancel an order|
|[**apiV1OrdersOrderIdGet**](#apiv1ordersorderidget) | **GET** /api/v1/orders/{orderId} | Get order by ID|
|[**apiV1TradingHistoryGet**](#apiv1tradinghistoryget) | **GET** /api/v1/trading/history | Get trade history|
|[**apiV1TradingOrdersGet**](#apiv1tradingordersget) | **GET** /api/v1/trading/orders | Get orders list|
|[**apiV1TradingOrdersPost**](#apiv1tradingorderspost) | **POST** /api/v1/trading/orders | Create a new order|
|[**apiV1TradingPortfolioGet**](#apiv1tradingportfolioget) | **GET** /api/v1/trading/portfolio | Get portfolio|
|[**apiV1TradingPositionsGet**](#apiv1tradingpositionsget) | **GET** /api/v1/trading/positions | Get positions|

# **apiV1OrdersOrderIdDelete**
> ApiV1OrdersOrderIdGet200Response apiV1OrdersOrderIdDelete()


### Example

```typescript
import {
    TradingApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new TradingApi(configuration);

let orderId: string; //Order ID (UUID) (default to undefined)

const { status, data } = await apiInstance.apiV1OrdersOrderIdDelete(
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**string**] | Order ID (UUID) | defaults to undefined|


### Return type

**ApiV1OrdersOrderIdGet200Response**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1OrdersOrderIdGet**
> ApiV1OrdersOrderIdGet200Response apiV1OrdersOrderIdGet()


### Example

```typescript
import {
    TradingApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new TradingApi(configuration);

let orderId: string; //Order ID (UUID) (default to undefined)

const { status, data } = await apiInstance.apiV1OrdersOrderIdGet(
    orderId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderId** | [**string**] | Order ID (UUID) | defaults to undefined|


### Return type

**ApiV1OrdersOrderIdGet200Response**

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

# **apiV1TradingHistoryGet**
> ApiV1TradingHistoryGet200Response apiV1TradingHistoryGet()


### Example

```typescript
import {
    TradingApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new TradingApi(configuration);

let symbol: string; //Filter by symbol (optional) (default to undefined)
let limit: number; //Limit (default: 50) (optional) (default to undefined)
let offset: number; //Offset (default: 0) (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1TradingHistoryGet(
    symbol,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] | Filter by symbol | (optional) defaults to undefined|
| **limit** | [**number**] | Limit (default: 50) | (optional) defaults to undefined|
| **offset** | [**number**] | Offset (default: 0) | (optional) defaults to undefined|


### Return type

**ApiV1TradingHistoryGet200Response**

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

# **apiV1TradingOrdersGet**
> ApiV1TradingHistoryGet200Response apiV1TradingOrdersGet()


### Example

```typescript
import {
    TradingApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new TradingApi(configuration);

let symbol: string; //Filter by symbol (optional) (default to undefined)
let status: string; //Filter by status (OPEN, FILLED, CANCELLED) (optional) (default to undefined)
let side: string; //Filter by side (BUY, SELL) (optional) (default to undefined)
let limit: number; //Limit (default: 50) (optional) (default to undefined)
let offset: number; //Offset (default: 0) (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1TradingOrdersGet(
    symbol,
    status,
    side,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] | Filter by symbol | (optional) defaults to undefined|
| **status** | [**string**] | Filter by status (OPEN, FILLED, CANCELLED) | (optional) defaults to undefined|
| **side** | [**string**] | Filter by side (BUY, SELL) | (optional) defaults to undefined|
| **limit** | [**number**] | Limit (default: 50) | (optional) defaults to undefined|
| **offset** | [**number**] | Offset (default: 0) | (optional) defaults to undefined|


### Return type

**ApiV1TradingHistoryGet200Response**

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

# **apiV1TradingOrdersPost**
> ApiV1OrdersOrderIdGet200Response apiV1TradingOrdersPost(request)


### Example

```typescript
import {
    TradingApi,
    Configuration,
    TypesCreateOrderRequest
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new TradingApi(configuration);

let request: TypesCreateOrderRequest; //Order data

const { status, data } = await apiInstance.apiV1TradingOrdersPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **TypesCreateOrderRequest**| Order data | |


### Return type

**ApiV1OrdersOrderIdGet200Response**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1TradingPortfolioGet**
> ApiV1TradingPortfolioGet200Response apiV1TradingPortfolioGet()


### Example

```typescript
import {
    TradingApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new TradingApi(configuration);

const { status, data } = await apiInstance.apiV1TradingPortfolioGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiV1TradingPortfolioGet200Response**

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

# **apiV1TradingPositionsGet**
> ApiV1TradingPositionsGet200Response apiV1TradingPositionsGet()


### Example

```typescript
import {
    TradingApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new TradingApi(configuration);

let symbol: string; //Filter by symbol (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1TradingPositionsGet(
    symbol
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] | Filter by symbol | (optional) defaults to undefined|


### Return type

**ApiV1TradingPositionsGet200Response**

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

