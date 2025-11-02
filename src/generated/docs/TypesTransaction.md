# TypesTransaction


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**address** | **string** |  | [optional] [default to undefined]
**amount** | **number** |  | [optional] [default to undefined]
**asset** | **string** |  | [optional] [default to undefined]
**completedAt** | **string** |  | [optional] [default to undefined]
**confirmations** | **number** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**fee** | **number** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**network** | **string** |  | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]
**status** | [**TypesTransactionStatus**](TypesTransactionStatus.md) |  | [optional] [default to undefined]
**tag** | **string** | Memo/Tag for XRP, XLM, etc. | [optional] [default to undefined]
**txHash** | **string** |  | [optional] [default to undefined]
**type** | [**TypesTransactionType**](TypesTransactionType.md) |  | [optional] [default to undefined]
**userId** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { TypesTransaction } from 'deiex-admin-sdk';

const instance: TypesTransaction = {
    address,
    amount,
    asset,
    completedAt,
    confirmations,
    createdAt,
    fee,
    id,
    network,
    notes,
    status,
    tag,
    txHash,
    type,
    userId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
