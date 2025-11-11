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
export * as authFacade from './auth'
export * as dashboardFacade from './dashboard'
export * as opsFacade from './ops'
export * as securityFacade from './security'
export * as settingsFacade from './settings'
export * as contentFacade from './content'
export * as analyticsFacade from './analytics'
export * as marketFacade from './market'

// 便捷导出（可选）
export {
  getKlineData,
  getMarketTrades,
  getMarketDepth,
  getMarketSummary,
  getMarketSummaries,
} from './market'
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
  exportLiquidations,
  listCopyTradingRelations,
  getCopyTradingRelationById,
  updateCopyTradingRelation,
  pauseCopyTradingRelation,
  resumeCopyTradingRelation,
  stopCopyTradingRelation,
  exportCopyTradingRelations,
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
  exportDeposits,
  exportWithdrawals,
  getChainHealthStatus,
  getRetryQueue,
  retryTask,
  cancelTask,
  syncBalance,
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
  calculateImpact,
  listMarginBindings,
  getMarginBindingById,
  createMarginBinding,
  updateMarginBinding,
  deleteMarginBinding,
  publishMarginTemplate,
  importMarginData,
  exportMarginData,
  getMarginVersions,
  getMarginVersion,
  rollbackMarginVersion,
  getMarginTemplateDiff,
  getMarginBindingDiff,
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
  getPublishedAnnouncementById,
  getAnnouncementByIdWithDraftOption,
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
  deleteRiskRule,
  listRiskLimits,
  getRiskLimitById,
  createRiskLimit,
  updateRiskLimit,
  deleteRiskLimit,
  listBlacklistEntries,
  getBlacklistEntryById,
  createBlacklistEntry,
  updateBlacklistEntry,
  deleteBlacklistEntry,
  fetchPublishedRules,
  fetchDraftRules,
  fetchRuleVersions,
  deleteDraftRule,
  updateDraftRule,
  createDraftRule,
  fetchRuleDiff,
  publishRules,
  rollbackRules,
  exportRules,
  importRules,
  simulateRule,
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

export {
  getDashboardStats,
  getDashboardCharts,
  getDashboardAlerts,
  getDashboardAlertById,
  updateAlertStatus,
} from './dashboard'

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
export type {
  DashboardStats,
  DashboardCharts,
  DateRangeParams,
  Alert,
  AlertDetail,
} from './dashboard'
export type {
  DepositQueryParams,
  WithdrawalQueryParams,
  WalletAddressQueryParams,
  UpdateDepositNotesPayload,
  ApproveWithdrawalPayload,
  RejectWithdrawalPayload,
  CreateWalletAddressPayload,
  Deposit,
  Withdrawal,
  WalletAddress,
  DepositDetailResponse,
  WithdrawalDetailResponse,
} from './assets'
export type {
  TradeReportQueryParams,
  FinanceReportQueryParams,
  RetentionReportQueryParams,
  GenerateReportPayload,
  ExportReportParams,
} from './reports'
export type {
  InstrumentQueryParams,
  MarginTemplateQueryParams,
  TradingFeeQueryParams,
} from './config'
export type { OrderQueryParams, PositionQueryParams, CopyTradingQueryParams } from './orders'
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
  ExportParams,
} from './calendar'
export type {
  RiskRuleQueryParams,
  RiskLimitQueryParams,
  BlacklistEntryQueryParams,
  CreateRiskRulePayload,
  UpdateRiskRulePayload,
  CreateRiskLimitPayload,
  UpdateRiskLimitPayload,
  CreateBlacklistEntryPayload,
  UpdateBlacklistEntryPayload,
  RiskSimulationPayload,
  RiskSimulationResult,
} from './risk'
export type {
  MarginBindingQueryParams,
  CreateMarginBindingPayload,
  UpdateMarginBindingPayload,
} from './config'

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
  login,
  logout,
  refreshToken,
  getCurrentUser,
  updateUserPermissions,
  resetUserPassword,
} from './auth'

export {
  listRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getPermissionTree,
  getAllPermissions,
  listAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  disableAdminUser,
  enableAdminUser,
  resetAdminPassword,
  listIpWhitelist,
  addIpWhitelistEntry,
  removeIpWhitelistEntry,
  getApiKeys,
  createApiKey,
  revokeApiKey,
  regenerateApiKey,
  getAuditLogs,
  getAuditLogById,
  exportAuditLogs,
} from './security'

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

export {
  // Blog Article Functions
  listBlogArticles,
  getBlogArticleById,
  createBlogArticle,
  updateBlogArticle,
  deleteBlogArticle,
  publishBlogArticle,
  archiveBlogArticle,
  // Blog Category Functions
  listBlogCategories,
  getBlogCategoryById,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  // Comment Functions
  listComments,
  getCommentById,
  updateCommentStatus,
  deleteComment,
  // Notification Functions
  listNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  publishNotification,
  // Email Campaign Functions
  listEmailCampaigns,
  getEmailCampaignById,
  createEmailCampaign,
  updateEmailCampaign,
  deleteEmailCampaign,
  sendEmailCampaign,
  // Email Template Functions
  listEmailTemplates,
  getEmailTemplateById,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  // Email Segment Functions
  listEmailSegments,
  getEmailSegmentById,
  createEmailSegment,
  updateEmailSegment,
  deleteEmailSegment,
} from './content'

export {
  // Trading Analytics Functions
  getTradingAnalyticsSummary,
  getVolumeByInstrument,
  getTradingPairPerformance,
  getUserTradingActivities,
  getTradingVolumeData,
  // User Analytics Functions
  getUserAnalyticsSummary,
  getRegistrationTrends,
  getRetentionMetrics,
  getKycCompletionRates,
  getVipDistribution,
  // Revenue Analytics Functions
  getRevenueAnalyticsSummary,
  getFeeRevenueByType,
  getRevenueByInstrument,
  getRevenueTrend,
  // Export Functions
  exportTradingAnalytics,
  exportUserAnalytics,
  exportRevenueAnalytics,
} from './analytics'

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
  BulkSyncPayload,
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
  ValidateConsistencyResult,
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
  IconMapping,
} from './icons'

export type {
  ArticleQueryParams,
  CategoryQueryParams,
  CommentQueryParams,
  NotificationQueryParams,
  EmailCampaignQueryParams,
  EmailTemplateQueryParams,
  EmailSegmentQueryParams,
  UpdateDepositNotesPayload,
  ApproveWithdrawalPayload,
  RejectWithdrawalPayload,
  CreateWalletAddressPayload,
} from './assets'

export type {
  Article,
  Category,
  Comment,
  Notification,
  EmailCampaign,
  EmailTemplate,
  EmailSegment,
} from './content'

export type {
  AnalyticsQueryParams,
  TradingVolumeSummary,
  VolumeByInstrument,
  TradingPairPerformance,
  UserTradingActivity,
  TradingVolumeData,
  UserAnalyticsSummary,
  RegistrationTrend,
  RetentionMetric,
  KycCompletionRate,
  VipDistribution,
  RevenueSummary,
  FeeRevenueByType,
  RevenueByInstrument,
  RevenueTrend,
  AnalyticsExportPayload,
  AnalyticsListResponse,
  AnalyticsDetailResponse,
  TimeSeriesData,
  DistributionData,
  ComparisonData,
} from './analytics'

export type { ChainHealth, RetryTask } from './assets'

export type {
  KlineData,
  MarketTrade,
  MarketDepth,
  MarketSummary,
  KlineQueryParams,
  MarketTradeQueryParams,
  MarketDepthQueryParams,
} from './market'

export * from './ops'
export * from './settings'
