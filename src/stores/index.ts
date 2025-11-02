// Pinia Store Setup
import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// Export stores
export { useAuthStore } from './auth'
export { useAppStore } from './app'
export { useDashboardStore } from './dashboard'
export { useKycStore } from './kyc'
export { useUsersStore } from './users'
export { useDepositsStore } from './deposits'
export { useWithdrawalsStore } from './withdrawals'
export { useWalletsStore } from './wallets'
export { useOrdersStore } from './orders'
export { useLogsStore } from './logs'
export { useTasksStore } from './tasks'
export { useReportsStore } from './reports'
