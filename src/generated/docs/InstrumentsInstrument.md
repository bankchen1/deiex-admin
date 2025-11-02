# InstrumentsInstrument


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**base** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**displayName** | **{ [key: string]: string; }** | i18n display names | [optional] [default to undefined]
**feeTemplateId** | **string** |  | [optional] [default to undefined]
**iconId** | **string** |  | [optional] [default to undefined]
**indexSymbol** | **string** | futures only | [optional] [default to undefined]
**maintenanceMarginRate** | **number** | futures only | [optional] [default to undefined]
**marginTemplateId** | **string** |  | [optional] [default to undefined]
**maxLeverage** | **number** | Risk settings | [optional] [default to undefined]
**maxOrder** | **string** | Additional trading parameters | [optional] [default to undefined]
**maxPosition** | **string** | futures only | [optional] [default to undefined]
**minOrder** | **string** |  | [optional] [default to undefined]
**oracleSource** | **string** | Bindings | [optional] [default to undefined]
**pricePrecision** | **number** |  | [optional] [default to undefined]
**priceTickSize** | **string** |  | [optional] [default to undefined]
**qtyStep** | **string** |  | [optional] [default to undefined]
**quote** | **string** |  | [optional] [default to undefined]
**rank** | **number** |  | [optional] [default to undefined]
**region** | **Array&lt;string&gt;** | List of regions where instrument is available | [optional] [default to undefined]
**status** | [**InstrumentsInstrumentStatus**](InstrumentsInstrumentStatus.md) |  | [optional] [default to undefined]
**symbol** | **string** |  | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**type** | [**InstrumentsInstrumentType**](InstrumentsInstrumentType.md) |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**version** | **number** |  | [optional] [default to undefined]
**visible** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { InstrumentsInstrument } from 'deiex-admin-sdk';

const instance: InstrumentsInstrument = {
    base,
    createdAt,
    displayName,
    feeTemplateId,
    iconId,
    indexSymbol,
    maintenanceMarginRate,
    marginTemplateId,
    maxLeverage,
    maxOrder,
    maxPosition,
    minOrder,
    oracleSource,
    pricePrecision,
    priceTickSize,
    qtyStep,
    quote,
    rank,
    region,
    status,
    symbol,
    tags,
    type,
    updatedAt,
    version,
    visible,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
