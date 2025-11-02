## deiex-admin-sdk@1.0.1

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install deiex-admin-sdk@1.0.1 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://localhost:8080/api/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*AdminAnalyticsApi* | [**adminAnalyticsUserBehaviorGeoGet**](docs/AdminAnalyticsApi.md#adminanalyticsuserbehaviorgeoget) | **GET** /admin/analytics/user-behavior/geo | Get geographic distribution
*AdminAnalyticsApi* | [**adminAnalyticsUserBehaviorRetentionGet**](docs/AdminAnalyticsApi.md#adminanalyticsuserbehaviorretentionget) | **GET** /admin/analytics/user-behavior/retention | Get user retention
*AdminAnalyticsApi* | [**adminAnalyticsUserBehaviorSummaryGet**](docs/AdminAnalyticsApi.md#adminanalyticsuserbehaviorsummaryget) | **GET** /admin/analytics/user-behavior/summary | Get user behavior summary
*AdminAnalyticsApi* | [**adminAnalyticsUserBehaviorTopGet**](docs/AdminAnalyticsApi.md#adminanalyticsuserbehaviortopget) | **GET** /admin/analytics/user-behavior/top | Get top activities
*AdminAssetsApi* | [**adminDepositsGet**](docs/AdminAssetsApi.md#admindepositsget) | **GET** /admin/deposits | Get deposits
*AdminAssetsApi* | [**adminDepositsIdGet**](docs/AdminAssetsApi.md#admindepositsidget) | **GET** /admin/deposits/{id} | Get deposit by ID
*AdminAssetsApi* | [**adminDepositsIdNotesPatch**](docs/AdminAssetsApi.md#admindepositsidnotespatch) | **PATCH** /admin/deposits/{id}/notes | Update deposit notes
*AdminAssetsApi* | [**adminWalletsAddressesGet**](docs/AdminAssetsApi.md#adminwalletsaddressesget) | **GET** /admin/wallets/addresses | Get wallet addresses
*AdminAssetsApi* | [**adminWalletsChainHealthGet**](docs/AdminAssetsApi.md#adminwalletschainhealthget) | **GET** /admin/wallets/chain-health | Get chain health
*AdminAssetsApi* | [**adminWalletsRetryQueueGet**](docs/AdminAssetsApi.md#adminwalletsretryqueueget) | **GET** /admin/wallets/retry-queue | Get retry tasks
*AdminAssetsApi* | [**adminWalletsRetryQueueIdCancelPost**](docs/AdminAssetsApi.md#adminwalletsretryqueueidcancelpost) | **POST** /admin/wallets/retry-queue/{id}/cancel | Cancel retry task
*AdminAssetsApi* | [**adminWalletsRetryQueueIdRetryPost**](docs/AdminAssetsApi.md#adminwalletsretryqueueidretrypost) | **POST** /admin/wallets/retry-queue/{id}/retry | Retry task
*AdminAssetsApi* | [**adminWithdrawalsGet**](docs/AdminAssetsApi.md#adminwithdrawalsget) | **GET** /admin/withdrawals | Get withdrawals
*AdminAssetsApi* | [**adminWithdrawalsIdApprovePost**](docs/AdminAssetsApi.md#adminwithdrawalsidapprovepost) | **POST** /admin/withdrawals/{id}/approve | Approve withdrawal
*AdminAssetsApi* | [**adminWithdrawalsIdGet**](docs/AdminAssetsApi.md#adminwithdrawalsidget) | **GET** /admin/withdrawals/{id} | Get withdrawal by ID
*AdminAssetsApi* | [**adminWithdrawalsIdNotesPatch**](docs/AdminAssetsApi.md#adminwithdrawalsidnotespatch) | **PATCH** /admin/withdrawals/{id}/notes | Update withdrawal notes
*AdminAssetsApi* | [**adminWithdrawalsIdRejectPost**](docs/AdminAssetsApi.md#adminwithdrawalsidrejectpost) | **POST** /admin/withdrawals/{id}/reject | Reject withdrawal
*AdminComplianceApi* | [**adminComplianceAuditGet**](docs/AdminComplianceApi.md#admincomplianceauditget) | **GET** /admin/compliance/audit | Get audit logs
*AdminComplianceApi* | [**adminComplianceAuditIdGet**](docs/AdminComplianceApi.md#admincomplianceauditidget) | **GET** /admin/compliance/audit/{id} | Get audit log by ID
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsBatchHidePost**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentsbatchhidepost) | **POST** /admin/config/instruments/batch-hide | Hide instruments
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsBatchShowPost**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentsbatchshowpost) | **POST** /admin/config/instruments/batch-show | Show instruments
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsDiffGet**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentsdiffget) | **GET** /admin/config/instruments/diff | Get diff between draft and published
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsDraftsBatchUpdatePost**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentsdraftsbatchupdatepost) | **POST** /admin/config/instruments/drafts/batch-update | Batch update instruments
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsDraftsGet**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentsdraftsget) | **GET** /admin/config/instruments/drafts | Get draft instruments
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsDraftsPost**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentsdraftspost) | **POST** /admin/config/instruments/drafts | Create a new instrument draft
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsDraftsSymbolDelete**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentsdraftssymboldelete) | **DELETE** /admin/config/instruments/drafts/{symbol} | Delete an instrument draft
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsDraftsSymbolPut**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentsdraftssymbolput) | **PUT** /admin/config/instruments/drafts/{symbol} | Update an existing instrument draft
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsExportGet**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentsexportget) | **GET** /admin/config/instruments/export | Export instruments
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsImpactEstimationGet**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentsimpactestimationget) | **GET** /admin/config/instruments/impact-estimation | Get impact estimation
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsImportPost**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentsimportpost) | **POST** /admin/config/instruments/import | Import instruments
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsPublishSymbolPost**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentspublishsymbolpost) | **POST** /admin/config/instruments/publish/{symbol} | Publish an instrument
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsPublishedGet**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentspublishedget) | **GET** /admin/config/instruments/published | Get published instruments
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsRollbackVersionIdPost**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentsrollbackversionidpost) | **POST** /admin/config/instruments/rollback/{versionId} | Rollback to specific version
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsSymbolGet**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentssymbolget) | **GET** /admin/config/instruments/{symbol} | Get instrument by symbol
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsValidateImportPost**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentsvalidateimportpost) | **POST** /admin/config/instruments/validate-import | Validate import data
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsVersionsGet**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentsversionsget) | **GET** /admin/config/instruments/versions | Get version history
*AdminConfigInstrumentsApi* | [**adminConfigInstrumentsVersionsSymbolGet**](docs/AdminConfigInstrumentsApi.md#adminconfiginstrumentsversionssymbolget) | **GET** /admin/config/instruments/versions/{symbol} | Get all versions of an instrument
*AdminMonitoringApi* | [**adminMonitoringTransactionsGet**](docs/AdminMonitoringApi.md#adminmonitoringtransactionsget) | **GET** /admin/monitoring/transactions | Get transactions
*AdminMonitoringApi* | [**adminMonitoringTransactionsIdApprovePost**](docs/AdminMonitoringApi.md#adminmonitoringtransactionsidapprovepost) | **POST** /admin/monitoring/transactions/{id}/approve | Approve transaction
*AdminMonitoringApi* | [**adminMonitoringTransactionsIdGet**](docs/AdminMonitoringApi.md#adminmonitoringtransactionsidget) | **GET** /admin/monitoring/transactions/{id} | Get transaction by ID
*AdminMonitoringApi* | [**adminMonitoringTransactionsIdRejectPost**](docs/AdminMonitoringApi.md#adminmonitoringtransactionsidrejectpost) | **POST** /admin/monitoring/transactions/{id}/reject | Reject transaction
*AuthApi* | [**apiV1AuthChangePasswordPost**](docs/AuthApi.md#apiv1authchangepasswordpost) | **POST** /api/v1/auth/change-password | Change password
*AuthApi* | [**apiV1AuthForgotPasswordPost**](docs/AuthApi.md#apiv1authforgotpasswordpost) | **POST** /api/v1/auth/forgot-password | Request password reset
*AuthApi* | [**apiV1AuthLoginPost**](docs/AuthApi.md#apiv1authloginpost) | **POST** /api/v1/auth/login | Login
*AuthApi* | [**apiV1AuthLogoutPost**](docs/AuthApi.md#apiv1authlogoutpost) | **POST** /api/v1/auth/logout | Logout
*AuthApi* | [**apiV1AuthRefreshPost**](docs/AuthApi.md#apiv1authrefreshpost) | **POST** /api/v1/auth/refresh | Refresh access token
*AuthApi* | [**apiV1AuthRegisterPost**](docs/AuthApi.md#apiv1authregisterpost) | **POST** /api/v1/auth/register | Register a new user
*AuthApi* | [**apiV1AuthResetPasswordPost**](docs/AuthApi.md#apiv1authresetpasswordpost) | **POST** /api/v1/auth/reset-password | Reset password with token
*MarketApi* | [**apiV1MarketsCandlesGet**](docs/MarketApi.md#apiv1marketscandlesget) | **GET** /api/v1/markets/candles | Get kline/candlestick data
*MarketApi* | [**apiV1MarketsDepthGet**](docs/MarketApi.md#apiv1marketsdepthget) | **GET** /api/v1/markets/depth | Get order book depth
*MarketApi* | [**apiV1MarketsPairsGet**](docs/MarketApi.md#apiv1marketspairsget) | **GET** /api/v1/markets/pairs | Get all trading pairs
*MarketApi* | [**apiV1MarketsTickersGet**](docs/MarketApi.md#apiv1marketstickersget) | **GET** /api/v1/markets/tickers | Get all market tickers
*MarketApi* | [**apiV1MarketsTickersSymbolGet**](docs/MarketApi.md#apiv1marketstickerssymbolget) | **GET** /api/v1/markets/tickers/{symbol} | Get ticker by symbol
*MarketApi* | [**apiV1MarketsTradesGet**](docs/MarketApi.md#apiv1marketstradesget) | **GET** /api/v1/markets/trades | Get recent trades
*MeApi* | [**apiV1MeGet**](docs/MeApi.md#apiv1meget) | **GET** /api/v1/me | Get current user profile
*TradingApi* | [**apiV1OrdersOrderIdDelete**](docs/TradingApi.md#apiv1ordersorderiddelete) | **DELETE** /api/v1/orders/{orderId} | Cancel an order
*TradingApi* | [**apiV1OrdersOrderIdGet**](docs/TradingApi.md#apiv1ordersorderidget) | **GET** /api/v1/orders/{orderId} | Get order by ID
*TradingApi* | [**apiV1TradingHistoryGet**](docs/TradingApi.md#apiv1tradinghistoryget) | **GET** /api/v1/trading/history | Get trade history
*TradingApi* | [**apiV1TradingOrdersGet**](docs/TradingApi.md#apiv1tradingordersget) | **GET** /api/v1/trading/orders | Get orders list
*TradingApi* | [**apiV1TradingOrdersPost**](docs/TradingApi.md#apiv1tradingorderspost) | **POST** /api/v1/trading/orders | Create a new order
*TradingApi* | [**apiV1TradingPortfolioGet**](docs/TradingApi.md#apiv1tradingportfolioget) | **GET** /api/v1/trading/portfolio | Get portfolio
*TradingApi* | [**apiV1TradingPositionsGet**](docs/TradingApi.md#apiv1tradingpositionsget) | **GET** /api/v1/trading/positions | Get positions
*UsersApi* | [**apiV1UsersPreferencesGet**](docs/UsersApi.md#apiv1userspreferencesget) | **GET** /api/v1/users/preferences | Get user preferences
*UsersApi* | [**apiV1UsersPreferencesPut**](docs/UsersApi.md#apiv1userspreferencesput) | **PUT** /api/v1/users/preferences | Update user preferences
*UsersApi* | [**apiV1UsersProfileGet**](docs/UsersApi.md#apiv1usersprofileget) | **GET** /api/v1/users/profile | Get user profile
*UsersApi* | [**apiV1UsersProfilePut**](docs/UsersApi.md#apiv1usersprofileput) | **PUT** /api/v1/users/profile | Update user profile
*UsersApi* | [**apiV1UsersSecurityGet**](docs/UsersApi.md#apiv1userssecurityget) | **GET** /api/v1/users/security | Get user security settings
*UsersApi* | [**apiV1UsersSecurityPut**](docs/UsersApi.md#apiv1userssecurityput) | **PUT** /api/v1/users/security | Update user security settings
*UsersApi* | [**apiV1UsersStatsGet**](docs/UsersApi.md#apiv1usersstatsget) | **GET** /api/v1/users/stats | Get user statistics
*WalletApi* | [**apiV1WalletBalancesGet**](docs/WalletApi.md#apiv1walletbalancesget) | **GET** /api/v1/wallet/balances | Get user balances
*WalletApi* | [**apiV1WalletDepositAddressAssetGet**](docs/WalletApi.md#apiv1walletdepositaddressassetget) | **GET** /api/v1/wallet/deposit-address/{asset} | Get deposit address
*WalletApi* | [**apiV1WalletSummaryGet**](docs/WalletApi.md#apiv1walletsummaryget) | **GET** /api/v1/wallet/summary | Get wallet summary
*WalletApi* | [**apiV1WalletTransactionsGet**](docs/WalletApi.md#apiv1wallettransactionsget) | **GET** /api/v1/wallet/transactions | Get transaction history
*WalletApi* | [**apiV1WalletTransferPost**](docs/WalletApi.md#apiv1wallettransferpost) | **POST** /api/v1/wallet/transfer | Internal account transfer
*WalletApi* | [**apiV1WalletWithdrawPost**](docs/WalletApi.md#apiv1walletwithdrawpost) | **POST** /api/v1/wallet/withdraw | Withdraw funds


### Documentation For Models

 - [AdminAnalyticsUserBehaviorGeoGet200Response](docs/AdminAnalyticsUserBehaviorGeoGet200Response.md)
 - [AdminAnalyticsUserBehaviorRetentionGet200Response](docs/AdminAnalyticsUserBehaviorRetentionGet200Response.md)
 - [AdminAnalyticsUserBehaviorSummaryGet200Response](docs/AdminAnalyticsUserBehaviorSummaryGet200Response.md)
 - [AdminAnalyticsUserBehaviorTopGet200Response](docs/AdminAnalyticsUserBehaviorTopGet200Response.md)
 - [AdminComplianceAuditGet200Response](docs/AdminComplianceAuditGet200Response.md)
 - [AdminComplianceAuditIdGet200Response](docs/AdminComplianceAuditIdGet200Response.md)
 - [AdminDepositsGet200Response](docs/AdminDepositsGet200Response.md)
 - [AdminDepositsIdGet200Response](docs/AdminDepositsIdGet200Response.md)
 - [AdminDepositsIdNotesPatch200Response](docs/AdminDepositsIdNotesPatch200Response.md)
 - [AdminMonitoringTransactionsGet200Response](docs/AdminMonitoringTransactionsGet200Response.md)
 - [AdminMonitoringTransactionsIdGet200Response](docs/AdminMonitoringTransactionsIdGet200Response.md)
 - [AdminWalletsAddressesGet200Response](docs/AdminWalletsAddressesGet200Response.md)
 - [AdminWalletsChainHealthGet200Response](docs/AdminWalletsChainHealthGet200Response.md)
 - [AdminWalletsRetryQueueGet200Response](docs/AdminWalletsRetryQueueGet200Response.md)
 - [AdminWithdrawalsGet200Response](docs/AdminWithdrawalsGet200Response.md)
 - [AdminWithdrawalsIdGet200Response](docs/AdminWithdrawalsIdGet200Response.md)
 - [AnalyticsGeographicDistribution](docs/AnalyticsGeographicDistribution.md)
 - [AnalyticsTopActivity](docs/AnalyticsTopActivity.md)
 - [AnalyticsUserBehaviorSummary](docs/AnalyticsUserBehaviorSummary.md)
 - [AnalyticsUserRetention](docs/AnalyticsUserRetention.md)
 - [ApiV1AuthForgotPasswordPost200Response](docs/ApiV1AuthForgotPasswordPost200Response.md)
 - [ApiV1AuthLoginPost200Response](docs/ApiV1AuthLoginPost200Response.md)
 - [ApiV1MarketsCandlesGet200Response](docs/ApiV1MarketsCandlesGet200Response.md)
 - [ApiV1MarketsDepthGet200Response](docs/ApiV1MarketsDepthGet200Response.md)
 - [ApiV1MarketsPairsGet200Response](docs/ApiV1MarketsPairsGet200Response.md)
 - [ApiV1MarketsTickersGet200Response](docs/ApiV1MarketsTickersGet200Response.md)
 - [ApiV1MarketsTickersSymbolGet200Response](docs/ApiV1MarketsTickersSymbolGet200Response.md)
 - [ApiV1MarketsTradesGet200Response](docs/ApiV1MarketsTradesGet200Response.md)
 - [ApiV1OrdersOrderIdGet200Response](docs/ApiV1OrdersOrderIdGet200Response.md)
 - [ApiV1TradingHistoryGet200Response](docs/ApiV1TradingHistoryGet200Response.md)
 - [ApiV1TradingPortfolioGet200Response](docs/ApiV1TradingPortfolioGet200Response.md)
 - [ApiV1TradingPositionsGet200Response](docs/ApiV1TradingPositionsGet200Response.md)
 - [ApiV1UsersPreferencesGet200Response](docs/ApiV1UsersPreferencesGet200Response.md)
 - [ApiV1UsersProfileGet200Response](docs/ApiV1UsersProfileGet200Response.md)
 - [ApiV1UsersSecurityGet200Response](docs/ApiV1UsersSecurityGet200Response.md)
 - [ApiV1WalletBalancesGet200Response](docs/ApiV1WalletBalancesGet200Response.md)
 - [ApiV1WalletDepositAddressAssetGet200Response](docs/ApiV1WalletDepositAddressAssetGet200Response.md)
 - [ApiV1WalletSummaryGet200Response](docs/ApiV1WalletSummaryGet200Response.md)
 - [ApiV1WalletTransferPost200Response](docs/ApiV1WalletTransferPost200Response.md)
 - [AssetsApproval](docs/AssetsApproval.md)
 - [AssetsChainHealth](docs/AssetsChainHealth.md)
 - [AssetsDeposit](docs/AssetsDeposit.md)
 - [AssetsDepositStatus](docs/AssetsDepositStatus.md)
 - [AssetsRetryTask](docs/AssetsRetryTask.md)
 - [AssetsRetryTaskStatus](docs/AssetsRetryTaskStatus.md)
 - [AssetsWalletAddress](docs/AssetsWalletAddress.md)
 - [AssetsWithdrawal](docs/AssetsWithdrawal.md)
 - [AssetsWithdrawalStatus](docs/AssetsWithdrawalStatus.md)
 - [ComplianceAuditLog](docs/ComplianceAuditLog.md)
 - [ComplianceAuditLogCategory](docs/ComplianceAuditLogCategory.md)
 - [ComplianceAuditLogLevel](docs/ComplianceAuditLogLevel.md)
 - [InstrumentsInstrument](docs/InstrumentsInstrument.md)
 - [InstrumentsInstrumentStatus](docs/InstrumentsInstrumentStatus.md)
 - [InstrumentsInstrumentType](docs/InstrumentsInstrumentType.md)
 - [MonitoringTransaction](docs/MonitoringTransaction.md)
 - [TypesAPIResponse](docs/TypesAPIResponse.md)
 - [TypesAuthResponse](docs/TypesAuthResponse.md)
 - [TypesBalance](docs/TypesBalance.md)
 - [TypesBalanceInfo](docs/TypesBalanceInfo.md)
 - [TypesChangePasswordRequest](docs/TypesChangePasswordRequest.md)
 - [TypesCreateOrderRequest](docs/TypesCreateOrderRequest.md)
 - [TypesDepositAddress](docs/TypesDepositAddress.md)
 - [TypesErrorInfo](docs/TypesErrorInfo.md)
 - [TypesForgotPasswordRequest](docs/TypesForgotPasswordRequest.md)
 - [TypesHoldingInfo](docs/TypesHoldingInfo.md)
 - [TypesKlineData](docs/TypesKlineData.md)
 - [TypesLoginRequest](docs/TypesLoginRequest.md)
 - [TypesMarketTicker](docs/TypesMarketTicker.md)
 - [TypesMessageResponse](docs/TypesMessageResponse.md)
 - [TypesMeta](docs/TypesMeta.md)
 - [TypesOrder](docs/TypesOrder.md)
 - [TypesOrderBook](docs/TypesOrderBook.md)
 - [TypesOrderBookLevel](docs/TypesOrderBookLevel.md)
 - [TypesOrderSide](docs/TypesOrderSide.md)
 - [TypesOrderStatus](docs/TypesOrderStatus.md)
 - [TypesOrderType](docs/TypesOrderType.md)
 - [TypesPaginatedResponse](docs/TypesPaginatedResponse.md)
 - [TypesPagination](docs/TypesPagination.md)
 - [TypesPortfolio](docs/TypesPortfolio.md)
 - [TypesPosition](docs/TypesPosition.md)
 - [TypesRecentTrade](docs/TypesRecentTrade.md)
 - [TypesRegisterRequest](docs/TypesRegisterRequest.md)
 - [TypesResetPasswordRequest](docs/TypesResetPasswordRequest.md)
 - [TypesTimeInForce](docs/TypesTimeInForce.md)
 - [TypesTradingPair](docs/TypesTradingPair.md)
 - [TypesTradingPairStatus](docs/TypesTradingPairStatus.md)
 - [TypesTransaction](docs/TypesTransaction.md)
 - [TypesTransactionStatus](docs/TypesTransactionStatus.md)
 - [TypesTransactionType](docs/TypesTransactionType.md)
 - [TypesTransferRequest](docs/TypesTransferRequest.md)
 - [TypesUpdatePreferencesRequest](docs/TypesUpdatePreferencesRequest.md)
 - [TypesUpdateProfileRequest](docs/TypesUpdateProfileRequest.md)
 - [TypesUpdateSecurityRequest](docs/TypesUpdateSecurityRequest.md)
 - [TypesUser](docs/TypesUser.md)
 - [TypesUserPreferences](docs/TypesUserPreferences.md)
 - [TypesUserStatus](docs/TypesUserStatus.md)
 - [TypesWalletSummary](docs/TypesWalletSummary.md)
 - [TypesWithdrawRequest](docs/TypesWithdrawRequest.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization


Authentication schemes defined for the API:
<a id="BearerAuth"></a>
### BearerAuth

- **Type**: API key
- **API key parameter name**: Authorization
- **Location**: HTTP header

