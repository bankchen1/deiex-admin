# TypesCreateOrderRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**clientOrderId** | **string** |  | [optional] [default to undefined]
**price** | **number** |  | [optional] [default to undefined]
**quantity** | **number** |  | [default to undefined]
**reduceOnly** | **boolean** |  | [optional] [default to undefined]
**side** | [**TypesOrderSide**](TypesOrderSide.md) |  | [default to undefined]
**stopPrice** | **number** |  | [optional] [default to undefined]
**symbol** | **string** |  | [default to undefined]
**timeInForce** | [**TypesTimeInForce**](TypesTimeInForce.md) |  | [optional] [default to undefined]
**type** | [**TypesOrderType**](TypesOrderType.md) |  | [default to undefined]

## Example

```typescript
import { TypesCreateOrderRequest } from 'deiex-admin-sdk';

const instance: TypesCreateOrderRequest = {
    clientOrderId,
    price,
    quantity,
    reduceOnly,
    side,
    stopPrice,
    symbol,
    timeInForce,
    type,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
