/**
 * Assets Facade - 资产管理统一出入口
 */

import type { FacadeResponse, PaginationParams } from '../_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from '../_types'
import { mockService } from '@/services/mock'
import { safeGet, safePost, safePatch } from '../_client'
import type { Deposit, Withdrawal } from '@/contracts/assets'

/**
 * 存款查询参数
 */
export interface DepositQueryParams extends PaginationParams {
  currency?: string
  chain?: string
  status?: 'pending' | 'confirming' | 'completed' | 'failed'
  userId?: string
  startDate?: string
  endDate?: string
}

/**
 * 提款查询参数
 */
export interface WithdrawalQueryParams extends PaginationParams {
  currency?: string
  chain?: string
  status?: 'pending' | 'reviewing' | 'approved' | 'processing' | 'completed' | 'rejected'
  userId?: string
  startDate?: string
  endDate?: string
}

/**
 * 获取存款列表
 */
export const listDeposits = async (
  params: DepositQueryParams = {}
): Promise<FacadeResponse<{ data: Deposit[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: Deposit[]
        total: number
        page: number
        pageSize: number
      }>('/admin/assets/deposits', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式：使用SDK
      const response = await sdk.assets.adminDepositsGet(
        params.page,
        params.pageSize,
        params.currency,
        params.chain,
        params.status,
        params.userId
      )
      return createSuccessResponse(
        response.data.data || { data: [], total: 0, page: 1, pageSize: 10 }
      )
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取提款列表
 */
export const listWithdrawals = async (
  params: WithdrawalQueryParams = {}
): Promise<
  FacadeResponse<{ data: Withdrawal[]; total: number; page: number; pageSize: number }>
> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: Withdrawal[]
        total: number
        page: number
        pageSize: number
      }>('/admin/assets/withdrawals', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式：使用SDK
      const response = await sdk.assets.adminWithdrawalsGet(
        params.page,
        params.pageSize,
        params.currency,
        params.chain,
        params.status,
        params.userId
      )
      return createSuccessResponse(
        response.data.data || { data: [], total: 0, page: 1, pageSize: 10 }
      )
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取存款详情
 */
export const getDepositById = async (id: string): Promise<FacadeResponse<Deposit>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Deposit>(`/admin/assets/deposits/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      const response = await sdk.assets.adminDepositsIdGet(id)
      return createSuccessResponse(response.data.data || null)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 获取提款详情
 */
export const getWithdrawalById = async (id: string): Promise<FacadeResponse<Withdrawal>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<Withdrawal>(`/admin/assets/withdrawals/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      const response = await sdk.assets.adminWithdrawalsIdGet(id)
      return createSuccessResponse(response.data.data || null)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 更新存款备注
 */
export const updateDepositNotes = async (
  id: string,
  notes: string
): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safePatch<boolean>(`/admin/assets/deposits/${id}/notes`, { notes })
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      const response = await sdk.assets.adminDepositsIdNotesPatch(id, { notes })
      return createSuccessResponse(response.data.data || false)
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 审批提款
 */
export const approveWithdrawal = async (
  id: string,
  payload: { reason?: string; notes?: string }
): Promise<FacadeResponse<Withdrawal>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Withdrawal>(
        `/admin/assets/withdrawals/${id}/approve`,
        payload
      )
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 拒绝提款
 */
export const rejectWithdrawal = async (
  id: string,
  payload: { reason: string; notes?: string }
): Promise<FacadeResponse<Withdrawal>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<Withdrawal>(`/admin/assets/withdrawals/${id}/reject`, payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 钱包地址查询参数
 */
export interface WalletAddressQueryParams extends PaginationParams {
  type?: 'hot' | 'cold'
  chain?: string
  status?: 'active' | 'inactive' | 'maintenance'
  search?: string
}

/**
 * 钱包地址创建载荷
 */
export interface CreateWalletAddressPayload {
  chain: string
  address: string
  label: string
  type: 'hot' | 'cold'
}

/**
 * 钱包地址更新载荷
 */
export interface UpdateWalletAddressPayload {
  label?: string
  status?: 'active' | 'inactive' | 'maintenance'
}

/**
 * 获取钱包地址列表
 */
export const listWalletAddresses = async (
  params: WalletAddressQueryParams = {}
): Promise<FacadeResponse<{ data: WalletAddress[]; total: number; page: number; pageSize: number }>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<{
        data: WalletAddress[]
        total: number
        page: number
        pageSize: number
      }>('/admin/assets/wallet-addresses', { params })
      return createSuccessResponse(response.data, {
        pagination: {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      })
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 根据ID获取钱包地址
 */
export const getWalletAddressById = async (id: string): Promise<FacadeResponse<WalletAddress>> => {
  try {
    if (isMockMode()) {
      const response = await safeGet<WalletAddress>(`/admin/assets/wallet-addresses/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 创建钱包地址
 */
export const createWalletAddress = async (
  payload: CreateWalletAddressPayload
): Promise<FacadeResponse<WalletAddress>> => {
  try {
    if (isMockMode()) {
      const response = await safePost<WalletAddress>('/admin/assets/wallet-addresses', payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 更新钱包地址
 */
export const updateWalletAddress = async (
  id: string,
  payload: UpdateWalletAddressPayload
): Promise<FacadeResponse<WalletAddress>> => {
  try {
    if (isMockMode()) {
      const response = await safePut<WalletAddress>(`/admin/assets/wallet-addresses/${id}`, payload)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}

/**
 * 删除钱包地址
 */
export const deleteWalletAddress = async (id: string): Promise<FacadeResponse<boolean>> => {
  try {
    if (isMockMode()) {
      const response = await safeDelete<boolean>(`/admin/assets/wallet-addresses/${id}`)
      return createSuccessResponse(response.data)
    } else {
      // Real模式
      throw new Error('Real mode not implemented yet')
    }
  } catch (error) {
    return createErrorResponse(error)
  }
}
