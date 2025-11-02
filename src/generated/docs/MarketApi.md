# MarketApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1MarketsCandlesGet**](#apiv1marketscandlesget) | **GET** /api/v1/markets/candles | Get kline/candlestick data|
|[**apiV1MarketsDepthGet**](#apiv1marketsdepthget) | **GET** /api/v1/markets/depth | Get order book depth|
|[**apiV1MarketsPairsGet**](#apiv1marketspairsget) | **GET** /api/v1/markets/pairs | Get all trading pairs|
|[**apiV1MarketsTickersGet**](#apiv1marketstickersget) | **GET** /api/v1/markets/tickers | Get all market tickers|
|[**apiV1MarketsTickersSymbolGet**](#apiv1marketstickerssymbolget) | **GET** /api/v1/markets/tickers/{symbol} | Get ticker by symbol|
|[**apiV1MarketsTradesGet**](#apiv1marketstradesget) | **GET** /api/v1/markets/trades | Get recent trades|

# **apiV1MarketsCandlesGet**
> ApiV1MarketsCandlesGet200Response apiV1MarketsCandlesGet()


### Example

```typescript
import {
    MarketApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new MarketApi(configuration);

let symbol: string; //Trading pair symbol (default to undefined)
let interval: string; //Kline interval (1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w, 1M) (default to undefined)
let limit: number; //Number of klines (default: 100, max: 1000) (optional) (default to undefined)
let startTime: number; //Start time (Unix timestamp in milliseconds) (optional) (default to undefined)
let endTime: number; //End time (Unix timestamp in milliseconds) (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1MarketsCandlesGet(
    symbol,
    interval,
    limit,
    startTime,
    endTime
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] | Trading pair symbol | defaults to undefined|
| **interval** | [**string**] | Kline interval (1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w, 1M) | defaults to undefined|
| **limit** | [**number**] | Number of klines (default: 100, max: 1000) | (optional) defaults to undefined|
| **startTime** | [**number**] | Start time (Unix timestamp in milliseconds) | (optional) defaults to undefined|
| **endTime** | [**number**] | End time (Unix timestamp in milliseconds) | (optional) defaults to undefined|


### Return type

**ApiV1MarketsCandlesGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1MarketsDepthGet**
> ApiV1MarketsDepthGet200Response apiV1MarketsDepthGet()


### Example

```typescript
import {
    MarketApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new MarketApi(configuration);

let symbol: string; //Trading pair symbol (default to undefined)
let limit: number; //Number of levels (default: 20) (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1MarketsDepthGet(
    symbol,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] | Trading pair symbol | defaults to undefined|
| **limit** | [**number**] | Number of levels (default: 20) | (optional) defaults to undefined|


### Return type

**ApiV1MarketsDepthGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1MarketsPairsGet**
> ApiV1MarketsPairsGet200Response apiV1MarketsPairsGet()


### Example

```typescript
import {
    MarketApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new MarketApi(configuration);

const { status, data } = await apiInstance.apiV1MarketsPairsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiV1MarketsPairsGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1MarketsTickersGet**
> ApiV1MarketsTickersGet200Response apiV1MarketsTickersGet()


### Example

```typescript
import {
    MarketApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new MarketApi(configuration);

let quote: string; //Filter by quote currency (e.g. USDT) (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1MarketsTickersGet(
    quote
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quote** | [**string**] | Filter by quote currency (e.g. USDT) | (optional) defaults to undefined|


### Return type

**ApiV1MarketsTickersGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1MarketsTickersSymbolGet**
> ApiV1MarketsTickersSymbolGet200Response apiV1MarketsTickersSymbolGet()


### Example

```typescript
import {
    MarketApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new MarketApi(configuration);

let symbol: string; //Trading pair symbol (e.g. BTCUSDT) (default to undefined)

const { status, data } = await apiInstance.apiV1MarketsTickersSymbolGet(
    symbol
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] | Trading pair symbol (e.g. BTCUSDT) | defaults to undefined|


### Return type

**ApiV1MarketsTickersSymbolGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1MarketsTradesGet**
> ApiV1MarketsTradesGet200Response apiV1MarketsTradesGet()


### Example

```typescript
import {
    MarketApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new MarketApi(configuration);

let symbol: string; //Trading pair symbol (default to undefined)
let limit: number; //Number of trades (default: 50, max: 1000) (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1MarketsTradesGet(
    symbol,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **symbol** | [**string**] | Trading pair symbol | defaults to undefined|
| **limit** | [**number**] | Number of trades (default: 50, max: 1000) | (optional) defaults to undefined|


### Return type

**ApiV1MarketsTradesGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

