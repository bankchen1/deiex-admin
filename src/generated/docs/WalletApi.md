# WalletApi

All URIs are relative to *http://localhost:8080/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1WalletBalancesGet**](#apiv1walletbalancesget) | **GET** /api/v1/wallet/balances | Get user balances|
|[**apiV1WalletDepositAddressAssetGet**](#apiv1walletdepositaddressassetget) | **GET** /api/v1/wallet/deposit-address/{asset} | Get deposit address|
|[**apiV1WalletSummaryGet**](#apiv1walletsummaryget) | **GET** /api/v1/wallet/summary | Get wallet summary|
|[**apiV1WalletTransactionsGet**](#apiv1wallettransactionsget) | **GET** /api/v1/wallet/transactions | Get transaction history|
|[**apiV1WalletTransferPost**](#apiv1wallettransferpost) | **POST** /api/v1/wallet/transfer | Internal account transfer|
|[**apiV1WalletWithdrawPost**](#apiv1walletwithdrawpost) | **POST** /api/v1/wallet/withdraw | Withdraw funds|

# **apiV1WalletBalancesGet**
> ApiV1WalletBalancesGet200Response apiV1WalletBalancesGet()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

let hideZero: boolean; //Hide zero balances (default: true) (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1WalletBalancesGet(
    hideZero
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **hideZero** | [**boolean**] | Hide zero balances (default: true) | (optional) defaults to undefined|


### Return type

**ApiV1WalletBalancesGet200Response**

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

# **apiV1WalletDepositAddressAssetGet**
> ApiV1WalletDepositAddressAssetGet200Response apiV1WalletDepositAddressAssetGet()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

let asset: string; //Asset symbol (e.g. BTC, ETH, USDT) (default to undefined)
let network: string; //Network (default: main network for asset) (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1WalletDepositAddressAssetGet(
    asset,
    network
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **asset** | [**string**] | Asset symbol (e.g. BTC, ETH, USDT) | defaults to undefined|
| **network** | [**string**] | Network (default: main network for asset) | (optional) defaults to undefined|


### Return type

**ApiV1WalletDepositAddressAssetGet200Response**

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

# **apiV1WalletSummaryGet**
> ApiV1WalletSummaryGet200Response apiV1WalletSummaryGet()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

const { status, data } = await apiInstance.apiV1WalletSummaryGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiV1WalletSummaryGet200Response**

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

# **apiV1WalletTransactionsGet**
> ApiV1TradingHistoryGet200Response apiV1WalletTransactionsGet()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

let type: string; //Transaction type (DEPOSIT, WITHDRAW, TRADE, etc.) (optional) (default to undefined)
let asset: string; //Filter by asset (optional) (default to undefined)
let status: string; //Filter by status (optional) (default to undefined)
let startTime: number; //Start time (Unix timestamp) (optional) (default to undefined)
let endTime: number; //End time (Unix timestamp) (optional) (default to undefined)
let limit: number; //Limit (default: 50) (optional) (default to undefined)
let offset: number; //Offset (default: 0) (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1WalletTransactionsGet(
    type,
    asset,
    status,
    startTime,
    endTime,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **type** | [**string**] | Transaction type (DEPOSIT, WITHDRAW, TRADE, etc.) | (optional) defaults to undefined|
| **asset** | [**string**] | Filter by asset | (optional) defaults to undefined|
| **status** | [**string**] | Filter by status | (optional) defaults to undefined|
| **startTime** | [**number**] | Start time (Unix timestamp) | (optional) defaults to undefined|
| **endTime** | [**number**] | End time (Unix timestamp) | (optional) defaults to undefined|
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

# **apiV1WalletTransferPost**
> ApiV1WalletTransferPost200Response apiV1WalletTransferPost(request)


### Example

```typescript
import {
    WalletApi,
    Configuration,
    TypesTransferRequest
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

let request: TypesTransferRequest; //Transfer data

const { status, data } = await apiInstance.apiV1WalletTransferPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **TypesTransferRequest**| Transfer data | |


### Return type

**ApiV1WalletTransferPost200Response**

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

# **apiV1WalletWithdrawPost**
> ApiV1WalletTransferPost200Response apiV1WalletWithdrawPost(request)


### Example

```typescript
import {
    WalletApi,
    Configuration,
    TypesWithdrawRequest
} from 'deiex-admin-sdk';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

let request: TypesWithdrawRequest; //Withdrawal data

const { status, data } = await apiInstance.apiV1WalletWithdrawPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **TypesWithdrawRequest**| Withdrawal data | |


### Return type

**ApiV1WalletTransferPost200Response**

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

