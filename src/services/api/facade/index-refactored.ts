/**
 * Facade统一导出 (Refactored Version)
 *
 * This is the UI layer's single entry point for data access.
 * All pages and components should only access data through these functions.
 */

// Export types
export * from '../_types'

// Export facade instances
export { assetsFacade } from './assets-refactored'
// Other facades would be exported similarly

// Convenience exports for commonly used functions
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
} from './assets-refactored'

// Export types
export type {
  DepositQueryParams,
  WithdrawalQueryParams,
  WalletAddressQueryParams,
  CreateWalletAddressPayload,
  UpdateWalletAddressPayload,
} from './assets-refactored'
