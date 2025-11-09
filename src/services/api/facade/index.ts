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

// 导出类型
export type { UserQueryParams, UserStats, UserDetailResponse } from './users'
export type { OrderQueryParams, PositionQueryParams } from './orders'
export type { KycQueryParams, KycStats } from './kyc'
export type { DashboardStats, DashboardCharts, DateRangeParams } from './dashboard'
