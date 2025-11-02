# TypesOrderBook


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**asks** | [**Array&lt;TypesOrderBookLevel&gt;**](TypesOrderBookLevel.md) | Sell orders (ascending by price) | [optional] [default to undefined]
**bids** | [**Array&lt;TypesOrderBookLevel&gt;**](TypesOrderBookLevel.md) | Buy orders (descending by price) | [optional] [default to undefined]
**lastUpdateId** | **number** |  | [optional] [default to undefined]
**symbol** | **string** |  | [optional] [default to undefined]
**timestamp** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { TypesOrderBook } from 'deiex-admin-sdk';

const instance: TypesOrderBook = {
    asks,
    bids,
    lastUpdateId,
    symbol,
    timestamp,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
