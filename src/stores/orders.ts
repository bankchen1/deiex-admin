import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
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
  exportLiquidations as exportLiquidationsFromApi,
  type OrderQueryParams,
  type PositionQueryParams,
  type LiquidationQueryParams,
} from '@/services/api/facade'
import type {
  Order,
  FuturesOrder,
  Position,
  Liquidation,
  CopyTradingRelation,
} from '@/contracts/orders'

// 临时类型定义（等待Facade支持）
type LiquidationQueryParams = {
  page?: number
  pageSize?: number
  symbol?: string
  userId?: string
  startDate?: string
  endDate?: string
}

type CopyTradingQueryParams = {
  page?: number
  pageSize?: number
  masterId?: string
  followerId?: string
  status?: string
}

export const useOrdersStore = defineStore('orders', () => {
  // State - Spot Orders
  const spotOrders = ref<Order[]>([])
  const spotOrdersTotal = ref(0)
  const spotOrdersLoading = ref(false)
  const currentSpotOrder = ref<Order | null>(null)

  // State - Futures Orders
  const futuresOrders = ref<FuturesOrder[]>([])
  const futuresOrdersTotal = ref(0)
  const futuresOrdersLoading = ref(false)
  const currentFuturesOrder = ref<FuturesOrder | null>(null)

  // State - Positions
  const positions = ref<Position[]>([])
  const positionsTotal = ref(0)
  const positionsLoading = ref(false)
  const currentPosition = ref<Position | null>(null)

  // State - Liquidations
  const liquidations = ref<Liquidation[]>([])
  const liquidationsTotal = ref(0)
  const liquidationsLoading = ref(false)
  const currentLiquidation = ref<Liquidation | null>(null)

  // State - Copy Trading
  const copyTradingRelations = ref<CopyTradingRelation[]>([])
  const copyTradingTotal = ref(0)
  const copyTradingLoading = ref(false)
  const currentCopyTrading = ref<CopyTradingRelation | null>(null)

  // Actions - Spot Orders
  async function fetchSpotOrders(params: OrderQueryParams) {
    spotOrdersLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await listSpotOrders(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        spotOrders.value = []
        spotOrdersTotal.value = 0
        return
      }

      spotOrders.value = data.data
      spotOrdersTotal.value = data.total
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch spot orders'
      throw e
    } finally {
      spotOrdersLoading.value = false
    }
  }

  async function fetchSpotOrderById(id: string) {
    spotOrdersLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getSpotOrderById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Spot order not found')
      }

      currentSpotOrder.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch spot order details'
      throw e
    } finally {
      spotOrdersLoading.value = false
    }
  }

  async function exportSpotOrdersAction(params: OrderQueryParams) {
    error.value = null
    try {
      const { data: blob, error: err } = await exportSpotOrders(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!blob) {
        throw new Error('Failed to export')
      }

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `spot-orders-${Date.now()}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (e: any) {
      error.value = e.message || 'Failed to export spot orders'
      throw e
    }
  }

  // Actions - Futures Orders
  async function fetchFuturesOrders(params: OrderQueryParams) {
    futuresOrdersLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await listFuturesOrders(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        futuresOrders.value = []
        futuresOrdersTotal.value = 0
        return
      }

      futuresOrders.value = data.data
      futuresOrdersTotal.value = data.total
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch futures orders'
      throw e
    } finally {
      futuresOrdersLoading.value = false
    }
  }

  async function fetchFuturesOrderById(id: string) {
    futuresOrdersLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getFuturesOrderById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Futures order not found')
      }

      currentFuturesOrder.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch futures order details'
      throw e
    } finally {
      futuresOrdersLoading.value = false
    }
  }

  async function exportFuturesOrdersAction(params: OrderQueryParams) {
    error.value = null
    try {
      const { data: blob, error: err } = await exportFuturesOrders(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!blob) {
        throw new Error('Failed to export')
      }

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `futures-orders-${Date.now()}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (e: any) {
      error.value = e.message || 'Failed to export futures orders'
      throw e
    }
  }

  // Actions - Positions
  async function fetchPositions(params: PositionQueryParams) {
    positionsLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await listPositions(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        positions.value = []
        positionsTotal.value = 0
        return
      }

      positions.value = data.data
      positionsTotal.value = data.total
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch positions'
      throw e
    } finally {
      positionsLoading.value = false
    }
  }

  async function fetchPositionById(id: string) {
    positionsLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getPositionById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Position not found')
      }

      currentPosition.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch position details'
      throw e
    } finally {
      positionsLoading.value = false
    }
  }

  async function exportPositionsAction(params: PositionQueryParams) {
    // TODO: 等待Facade支持positions导出
    throw new Error('Export positions not implemented yet')
  }

  // Actions - Liquidations
  async function fetchLiquidations(params: LiquidationQueryParams) {
    liquidationsLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await listLiquidations(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        liquidations.value = []
        liquidationsTotal.value = 0
        return
      }

      liquidations.value = data.data
      liquidationsTotal.value = data.total
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch liquidations'
      throw e
    } finally {
      liquidationsLoading.value = false
    }
  }

  async function fetchLiquidationById(id: string) {
    liquidationsLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getLiquidationById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Liquidation not found')
      }

      currentLiquidation.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch liquidation details'
      throw e
    } finally {
      liquidationsLoading.value = false
    }
  }

  async function exportLiquidations(params: LiquidationQueryParams) {
    const { data: blob, error: err } = await exportLiquidationsFromApi(params)

    if (err) {
      error.value = err.message
      throw new Error(err.message)
    }

    if (!blob) {
      throw new Error('Failed to export liquidations')
    }

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `liquidations-${Date.now()}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  // Actions - Copy Trading
  async function fetchCopyTradingRelations(params: CopyTradingQueryParams = {}) {
    copyTradingLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await listCopyTradingRelations(params)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        copyTradingRelations.value = []
        copyTradingTotal.value = 0
        return
      }

      copyTradingRelations.value = data.data
      copyTradingTotal.value = data.total
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch copy trading relations'
      throw e
    } finally {
      copyTradingLoading.value = false
    }
  }

  async function fetchCopyTradingById(id: string) {
    copyTradingLoading.value = true
    try {
      const response = await ordersApi.getCopyTradingById(id)
      currentCopyTrading.value = response.data
      return response
    } finally {
      copyTradingLoading.value = false
    }
  }

  async function updateCopyTrading(id: string, payload: Partial<CopyTradingRelation>) {
    copyTradingLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateCopyTradingRelation(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update copy trading relation')
      }

      const index = copyTradingRelations.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        copyTradingRelations.value[index] = data
      }
      if (currentCopyTrading.value?.id === id) {
        currentCopyTrading.value = data
      }
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update copy trading relation'
      throw e
    } finally {
      copyTradingLoading.value = false
    }
  }

  async function pauseCopyTrading(id: string) {
    copyTradingLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await pauseCopyTradingRelation(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to pause copy trading relation')
      }

      const index = copyTradingRelations.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        copyTradingRelations.value[index] = data
      }
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to pause copy trading relation'
      throw e
    } finally {
      copyTradingLoading.value = false
    }
  }

  async function resumeCopyTrading(id: string) {
    copyTradingLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await resumeCopyTradingRelation(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to resume copy trading relation')
      }

      const index = copyTradingRelations.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        copyTradingRelations.value[index] = data
      }
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to resume copy trading relation'
      throw e
    } finally {
      copyTradingLoading.value = false
    }
  }

  async function stopCopyTrading(id: string) {
    copyTradingLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await stopCopyTradingRelation(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to stop copy trading relation')
      }

      const index = copyTradingRelations.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        copyTradingRelations.value[index] = data
      }
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to stop copy trading relation'
      throw e
    } finally {
      copyTradingLoading.value = false
    }
  }

  async function exportCopyTrading(params: CopyTradingQueryParams) {
    const blob = await ordersApi.exportCopyTrading(params)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `copy-trading-${Date.now()}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  function reset() {
    spotOrders.value = []
    spotOrdersTotal.value = 0
    currentSpotOrder.value = null
    futuresOrders.value = []
    futuresOrdersTotal.value = 0
    currentFuturesOrder.value = null
    positions.value = []
    positionsTotal.value = 0
    currentPosition.value = null
    liquidations.value = []
    liquidationsTotal.value = 0
    currentLiquidation.value = null
    copyTradingRelations.value = []
    copyTradingTotal.value = 0
    currentCopyTrading.value = null
  }

  return {
    // State - Spot Orders
    spotOrders,
    spotOrdersTotal,
    spotOrdersLoading,
    currentSpotOrder,
    // State - Futures Orders
    futuresOrders,
    futuresOrdersTotal,
    futuresOrdersLoading,
    currentFuturesOrder,
    // State - Positions
    positions,
    positionsTotal,
    positionsLoading,
    currentPosition,
    // State - Liquidations
    liquidations,
    liquidationsTotal,
    liquidationsLoading,
    currentLiquidation,
    // State - Copy Trading
    copyTradingRelations,
    copyTradingTotal,
    copyTradingLoading,
    currentCopyTrading,
    // Actions - Spot Orders
    fetchSpotOrders,
    fetchSpotOrderById,
    exportSpotOrders,
    // Actions - Futures Orders
    fetchFuturesOrders,
    fetchFuturesOrderById,
    exportFuturesOrders,
    // Actions - Positions
    fetchPositions,
    fetchPositionById,
    exportPositions,
    // Actions - Liquidations
    fetchLiquidations,
    fetchLiquidationById,
    exportLiquidations,
    // Actions - Copy Trading
    fetchCopyTradingRelations,
    fetchCopyTradingById,
    updateCopyTrading,
    pauseCopyTrading,
    resumeCopyTrading,
    stopCopyTrading,
    exportCopyTrading,
    // Reset
    reset,
  }
})
