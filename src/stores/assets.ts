import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  listDeposits,
  listWithdrawals,
  listWalletAddresses,
  getDepositById,
  getWithdrawalById,
  updateDepositNotes,
  approveWithdrawal,
  rejectWithdrawal,
  createWalletAddress,
  type DepositQueryParams,
  type WithdrawalQueryParams,
  type WalletAddressQueryParams,
  type UpdateDepositNotesPayload,
  type ApproveWithdrawalPayload,
  type RejectWithdrawalPayload,
  type CreateWalletAddressPayload,
} from '@/services/api/facade'
import type {
  Deposit,
  Withdrawal,
  WalletAddress,
  DepositDetailResponse,
  WithdrawalDetailResponse,
} from '@/contracts/assets'

export const useAssetsStore = defineStore('assets', () => {
  // State
  const depositsLoading = ref(false)
  const withdrawalsLoading = ref(false)
  const walletAddressesLoading = ref(false)
  const detailLoading = ref(false)
  const actionLoading = ref(false)

  const error = ref<string | null>(null)

  const deposits = ref<Deposit[]>([])
  const depositsTotal = ref(0)
  const depositsCurrentPage = ref(1)
  const depositsPageSize = ref(20)

  const withdrawals = ref<Withdrawal[]>([])
  const withdrawalsTotal = ref(0)
  const withdrawalsCurrentPage = ref(1)
  const withdrawalsPageSize = ref(20)

  const walletAddresses = ref<WalletAddress[]>([])
  const walletAddressesTotal = ref(0)
  const walletAddressesCurrentPage = ref(1)
  const walletAddressesPageSize = ref(20)

  const currentDeposit = ref<DepositDetailResponse | null>(null)
  const currentWithdrawal = ref<WithdrawalDetailResponse | null>(null)

  // Getters
  const hasDeposits = computed(() => deposits.value.length > 0)
  const hasWithdrawals = computed(() => withdrawals.value.length > 0)
  const hasWalletAddresses = computed(() => walletAddresses.value.length > 0)

  // Actions - Deposits
  async function fetchDeposits(params: DepositQueryParams = {}) {
    depositsLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await listDeposits({
        page: depositsCurrentPage.value,
        pageSize: depositsPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        deposits.value = []
        depositsTotal.value = 0
        return
      }

      deposits.value = data.data
      depositsTotal.value = data.total
      depositsCurrentPage.value = data.page
      depositsPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch deposits list'
      throw e
    } finally {
      depositsLoading.value = false
    }
  }

  async function fetchDepositById(id: string) {
    detailLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getDepositById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Deposit not found')
      }

      currentDeposit.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch deposit details'
      throw e
    } finally {
      detailLoading.value = false
    }
  }

  async function updateDepositNotesAction(id: string, payload: UpdateDepositNotesPayload) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateDepositNotes(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update deposit notes')
      }

      // Update the deposit in the list if it exists
      const index = deposits.value.findIndex((deposit) => deposit.id === id)
      if (index !== -1) {
        deposits.value[index] = { ...deposits.value[index], ...data }
      }

      // Update current deposit if it's the same
      if (currentDeposit.value?.deposit.id === id) {
        currentDeposit.value.deposit = { ...currentDeposit.value.deposit, ...data }
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update deposit notes'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  // Actions - Withdrawals
  async function fetchWithdrawals(params: WithdrawalQueryParams = {}) {
    withdrawalsLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await listWithdrawals({
        page: withdrawalsCurrentPage.value,
        pageSize: withdrawalsPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        withdrawals.value = []
        withdrawalsTotal.value = 0
        return
      }

      withdrawals.value = data.data
      withdrawalsTotal.value = data.total
      withdrawalsCurrentPage.value = data.page
      withdrawalsPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch withdrawals list'
      throw e
    } finally {
      withdrawalsLoading.value = false
    }
  }

  async function fetchWithdrawalById(id: string) {
    detailLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getWithdrawalById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Withdrawal not found')
      }

      currentWithdrawal.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch withdrawal details'
      throw e
    } finally {
      detailLoading.value = false
    }
  }

  async function approveWithdrawalAction(id: string, payload: ApproveWithdrawalPayload = {}) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await approveWithdrawal(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to approve withdrawal')
      }

      // Update the withdrawal in the list if it exists
      const index = withdrawals.value.findIndex((withdrawal) => withdrawal.id === id)
      if (index !== -1) {
        withdrawals.value[index] = { ...withdrawals.value[index], ...data }
      }

      // Update current withdrawal if it's the same
      if (currentWithdrawal.value?.withdrawal.id === id) {
        currentWithdrawal.value.withdrawal = { ...currentWithdrawal.value.withdrawal, ...data }
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to approve withdrawal'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function rejectWithdrawalAction(id: string, payload: RejectWithdrawalPayload) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await rejectWithdrawal(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to reject withdrawal')
      }

      // Update the withdrawal in the list if it exists
      const index = withdrawals.value.findIndex((withdrawal) => withdrawal.id === id)
      if (index !== -1) {
        withdrawals.value[index] = { ...withdrawals.value[index], ...data }
      }

      // Update current withdrawal if it's the same
      if (currentWithdrawal.value?.withdrawal.id === id) {
        currentWithdrawal.value.withdrawal = { ...currentWithdrawal.value.withdrawal, ...data }
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to reject withdrawal'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  // Actions - Wallet Addresses
  async function fetchWalletAddresses(params: WalletAddressQueryParams = {}) {
    walletAddressesLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await listWalletAddresses({
        page: walletAddressesCurrentPage.value,
        pageSize: walletAddressesPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        walletAddresses.value = []
        walletAddressesTotal.value = 0
        return
      }

      walletAddresses.value = data.data
      walletAddressesTotal.value = data.total
      walletAddressesCurrentPage.value = data.page
      walletAddressesPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch wallet addresses list'
      throw e
    } finally {
      walletAddressesLoading.value = false
    }
  }

  async function createWalletAddressAction(payload: CreateWalletAddressPayload) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await createWalletAddress(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to create wallet address')
      }

      // Add to the list
      walletAddresses.value.unshift(data)

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create wallet address'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  function setDepositsPage(page: number) {
    depositsCurrentPage.value = page
  }

  function setDepositsPageSize(size: number) {
    depositsPageSize.value = size
    depositsCurrentPage.value = 1 // Reset to first page when changing page size
  }

  function setWithdrawalsPage(page: number) {
    withdrawalsCurrentPage.value = page
  }

  function setWithdrawalsPageSize(size: number) {
    withdrawalsPageSize.value = size
    withdrawalsCurrentPage.value = 1 // Reset to first page when changing page size
  }

  function setWalletAddressesPage(page: number) {
    walletAddressesCurrentPage.value = page
  }

  function setWalletAddressesPageSize(size: number) {
    walletAddressesPageSize.value = size
    walletAddressesCurrentPage.value = 1 // Reset to first page when changing page size
  }

  function reset() {
    depositsLoading.value = false
    withdrawalsLoading.value = false
    walletAddressesLoading.value = false
    detailLoading.value = false
    actionLoading.value = false
    error.value = null
    deposits.value = []
    depositsTotal.value = 0
    depositsCurrentPage.value = 1
    depositsPageSize.value = 20
    withdrawals.value = []
    withdrawalsTotal.value = 0
    withdrawalsCurrentPage.value = 1
    withdrawalsPageSize.value = 20
    walletAddresses.value = []
    walletAddressesTotal.value = 0
    walletAddressesCurrentPage.value = 1
    walletAddressesPageSize.value = 20
    currentDeposit.value = null
    currentWithdrawal.value = null
  }

  return {
    // State
    depositsLoading,
    withdrawalsLoading,
    walletAddressesLoading,
    detailLoading,
    actionLoading,
    error,
    deposits,
    depositsTotal,
    depositsCurrentPage,
    depositsPageSize,
    withdrawals,
    withdrawalsTotal,
    withdrawalsCurrentPage,
    withdrawalsPageSize,
    walletAddresses,
    walletAddressesTotal,
    walletAddressesCurrentPage,
    walletAddressesPageSize,
    currentDeposit,
    currentWithdrawal,
    // Getters
    hasDeposits,
    hasWithdrawals,
    hasWalletAddresses,
    // Actions - Deposits
    fetchDeposits,
    fetchDepositById,
    updateDepositNotes: updateDepositNotesAction,
    // Actions - Withdrawals
    fetchWithdrawals,
    fetchWithdrawalById,
    approveWithdrawal: approveWithdrawalAction,
    rejectWithdrawal: rejectWithdrawalAction,
    // Actions - Wallet Addresses
    fetchWalletAddresses,
    createWalletAddress: createWalletAddressAction,
    // Page setters
    setDepositsPage,
    setDepositsPageSize,
    setWithdrawalsPage,
    setWithdrawalsPageSize,
    setWalletAddressesPage,
    setWalletAddressesPageSize,
    // Reset
    reset,
  }
})
