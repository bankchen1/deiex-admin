/**
 * Facade统一导出
 *
 * 这是UI层访问数据的唯一入口
 * 所有页面和组件只能通过这里的函数获取数据
 */

// 导出类型
export * from '../_types'

// 导出各模块Facade
export * as usersFacade from './users'
export * as ordersFacade from './orders'
export * as assetsFacade from './assets'
export * as kycFacade from './kyc'
export * as configFacade from './config'
export * as riskFacade from './risk'
export * as strategiesFacade from './strategies'
export * as mappingsFacade from './mappings'
export * as reportsFacade from './reports'
export * as calendarFacade from './calendar'
export * as feesFacade from './fees'
export * as iconsFacade from './icons'
export * as dashboardFacade from './dashboard'

// 便捷导出（可选）
export {
  listUsers,
  getUserById,
  getUserStats,
  updateUserVip,
  updateUserTags,
  resetUser2FA,
  disableUser,
  enableUser,
  exportUsers,
} from './users'

export {
  listSpotOrders,
  listFuturesOrders,
  listPositions,
  listLiquidations,
  getSpotOrderById,
  getFuturesOrderById,
  getPositionById,
  getLiquidationById,
  exportSpotOrders,
  exportFuturesOrders,
} from './orders'

export {
  listDeposits,
  listWithdrawals,
  getDepositById,
  getWithdrawalById,
  updateDepositNotes,
  approveWithdrawal,
  rejectWithdrawal,
  listWalletAddresses,
  getWalletAddressById,
  createWalletAddress,
  updateWalletAddress,
  deleteWalletAddress,
} from './assets'

export {
  listKycApplications,
  getKycApplicationById,
  getKycStats,
  approveKycApplication,
  rejectKycApplication,
} from './kyc'

export {
  listInstruments,
  getInstrumentBySymbol,
  createInstrument,
  updateInstrument,
  publishInstrument,
  listMarginTemplates,
  listTradingFeeTemplates,
} from './config'

export {
  listFundingRules,
  getFundingRuleById,
  createFundingRule,
  updateFundingRule,
  deleteFundingRule,
  listMaintenanceWindows,
  getMaintenanceWindowById,
  createMaintenanceWindow,
  updateMaintenanceWindow,
  deleteMaintenanceWindow,
  listAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  publishAnnouncement,
  deleteAnnouncement,
  // Calendar specific functions
  getPublishedFunding,
  getDraftFunding,
  getFundingById,
  createDraftFunding,
  updateDraftFunding,
  deleteDraftFunding,
  getPublishedMaintenance,
  getDraftMaintenance,
  getMaintenanceById,
  createDraftMaintenance,
  updateDraftMaintenance,
  deleteDraftMaintenance,
  getPublishedAnnouncements,
  getDraftAnnouncements,
  createDraftAnnouncement,
  updateDraftAnnouncement,
  deleteDraftAnnouncement,
  getVersions,
  getDiff,
  publish,
  rollback,
  validateTimeConflicts,
  exportData,
  importData,
  getVersionHistory,
  exportCalendarConfig,
  importCalendarConfig,
} from './calendar'

export {
  listRiskRules,
  getRiskRuleById,
  createRiskRule,
  updateRiskRule,
  listRiskLimits,
  listBlacklist,
  addBlacklistEntry,
  removeBlacklistEntry,
} from './risk'

export {
  listStrategyTemplates,
  getStrategyTemplateById,
  createStrategyTemplate,
  updateStrategyTemplate,
  deleteStrategyTemplate,
  listStrategyInstances,
  getStrategyInstanceById,
  createStrategyInstance,
  updateStrategyInstance,
  deleteStrategyInstance,
  startStrategyInstance,
  stopStrategyInstance,
  listBacktestResults,
  getBacktestResultById,
  runBacktest,
  deleteBacktestResult,
  listStrategyPerformance,
  getStrategyPerformanceById,
  listStrategyMonitoring,
  getStrategyMonitoringById,
  updateStrategyMonitoring,
} from './strategies'

export { getDashboardStats, getDashboardCharts } from './dashboard'

export {
  listTradeReports,
  listFinanceReports,
  listRetentionReports,
  getTradeDailyData,
  getSymbolVolumeData,
  getFinanceDailyData,
  getFeeIncomeData,
  getRetentionData,
  getFunnelData,
  exportTradeReport,
  exportFinanceReport,
  exportRetentionReport,
} from './reports'



// 导出类型
export type { UserQueryParams, UserStats, UserDetailResponse } from './users'
export type { OrderQueryParams, PositionQueryParams } from './orders'
export type { KycQueryParams, KycStats } from './kyc'
export type { DashboardStats, DashboardCharts, DateRangeParams } from './dashboard'
export type {
  TradeReportQueryParams,
  FinanceReportQueryParams,
  RetentionReportQueryParams,
  GenerateReportPayload,
  ExportReportParams
} from './reports'
export type { 
  InstrumentQueryParams, 
  MarginTemplateQueryParams, 
  TradingFeeQueryParams 
} from './config'
export type {
  FundingRuleQueryParams,
  MaintenanceWindowQueryParams,
  AnnouncementQueryParams,
  VersionQueryParams,
  CreateFundingRulePayload,
  UpdateFundingRulePayload,
  CreateMaintenanceWindowPayload,
  UpdateMaintenanceWindowPayload,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
  PublishPayload,
  ImportPayload,
  ExportParams
} from './calendar'

export {
  listNavMappings,
  getNavMappingById,
  createNavMapping,
  updateNavMapping,
  deleteNavMapping,
  validateNavMappings,
  bulkSyncNavMappings,
  listRouteRedirects,
  getRedirectById,
  createRedirect,
  updateRedirect,
  deleteRedirect,
  getRedirectGraph,
  validateRedirects,
  getPageApiRelations,
  getPageApiRelation,
  updatePageApiRelation,
  scanPageApiRelations,
  validatePageApiRelations,
  exportMappings,
  importMappings,
} from './mappings'

export {
  listTradingFeeTemplates,
  getTradingFeeTemplateById,
  createTradingFeeTemplateDraft,
  updateTradingFeeTemplateDraft,
  deleteTradingFeeTemplateDraft,
  listWithdrawalFeeTemplates,
  getWithdrawalFeeTemplateById,
  createWithdrawalFeeTemplateDraft,
  updateWithdrawalFeeTemplateDraft,
  deleteWithdrawalFeeTemplateDraft,
  publishFees,
  getFeeVersions,
  getFeeVersionById,
  rollbackFeeVersion,
  getFeeVersionDiff,
  exportFees,
  importFees,
  validateFeeImport,
  calculateFee,
  validateFeeConsistency,
} from './fees'

export {
  listIconAssets,
  getIconAssetById,
  createIconAsset,
  updateIconAsset,
  deleteIconAsset,
  listIconMappings,
  getIconMappingById,
  createIconMapping,
  updateIconMapping,
  deleteIconMapping,
  bulkUploadIcons,
  validateIcon,
  publishIconAsset,
  exportIcons,
  replaceIconAsset,
} from './icons'

// 导出类型
export type { UserQueryParams, UserStats, UserDetailResponse } from './users'
export type { OrderQueryParams, PositionQueryParams } from './orders'
export type { KycQueryParams, KycStats } from './kyc'
export type { DashboardStats, DashboardCharts, DateRangeParams } from './dashboard'
export type { 
  NavMappingQueryParams, 
  RedirectQueryParams, 
  PageApiRelationQueryParams,
  NavToApiMapping,
  RouteRedirect,
  PageApiRelation,
  MappingValidationResult,
  BulkSyncPayload
} from './mappings'

export type {
  TradingFeeQueryParams,
  WithdrawalFeeQueryParams,
  VersionQueryParams,
  CreateTradingFeeTemplatePayload,
  UpdateTradingFeeTemplatePayload,
  CreateWithdrawalFeeTemplatePayload,
  UpdateWithdrawalFeeTemplatePayload,
  PublishPayload,
  ImportPayload,
  ExportParams,
  ValidateImportPayload,
  CalculateFeeParams,
  FeeCalculationResult,
  ValidateConsistencyResult
} from './fees'

export type {
  IconAssetQueryParams,
  IconMappingQueryParams,
  CreateIconAssetPayload,
  UpdateIconAssetPayload,
  CreateIconMappingPayload,
  UpdateIconMappingPayload,
  BulkUploadPayload,
  ValidateIconPayload,
  PublishIconPayload,
  ValidationResult,
  BulkUploadResult,
  IconAsset,
  IconMapping
} from './icons'
