import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  ordersApi,
  type Order,
  type FuturesOrder,
  type Position,
  type Liquidation,
  type CopyTradingRelation,
  type OrderQueryParams,
  type PositionQueryParams,
  type LiquidationQueryParams,
  type CopyTradingQueryParams,
} from '@/services/api/orders'
import type { PaginatedResponse } from '@/types/api'

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
    try {
      const response: PaginatedResponse<Order> = await ordersApi.getSpotOrders(params)
      spotOrders.value = response.data
      spotOrdersTotal.value = response.total
      return response
    } finally {
      spotOrdersLoading.value = false
    }
  }

  async function fetchSpotOrderById(id: string) {
    spotOrdersLoading.value = true
    try {
      const response = await ordersApi.getSpotOrderById(id)
      currentSpotOrder.value = response.data
      return response
    } finally {
      spotOrdersLoading.value = false
    }
  }

  async function exportSpotOrders(params: OrderQueryParams) {
    const blob = await ordersApi.exportSpotOrders(params)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `spot-orders-${Date.now()}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  // Actions - Futures Orders
  async function fetchFuturesOrders(params: OrderQueryParams) {
    futuresOrdersLoading.value = true
    try {
      const response: PaginatedResponse<FuturesOrder> = await ordersApi.getFuturesOrders(params)
      futuresOrders.value = response.data
      futuresOrdersTotal.value = response.total
      return response
    } finally {
      futuresOrdersLoading.value = false
    }
  }

  async function fetchFuturesOrderById(id: string) {
    futuresOrdersLoading.value = true
    try {
      const response = await ordersApi.getFuturesOrderById(id)
      currentFuturesOrder.value = response.data
      return response
    } finally {
      futuresOrdersLoading.value = false
    }
  }

  async function exportFuturesOrders(params: OrderQueryParams) {
    const blob = await ordersApi.exportFuturesOrders(params)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `futures-orders-${Date.now()}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  // Actions - Positions
  async function fetchPositions(params: PositionQueryParams) {
    positionsLoading.value = true
    try {
      const response: PaginatedResponse<Position> = await ordersApi.getPositions(params)
      positions.value = response.data
      positionsTotal.value = response.total
      return response
    } finally {
      positionsLoading.value = false
    }
  }

  async function fetchPositionById(id: string) {
    positionsLoading.value = true
    try {
      const response = await ordersApi.getPositionById(id)
      currentPosition.value = response.data
      return response
    } finally {
      positionsLoading.value = false
    }
  }

  async function exportPositions(params: PositionQueryParams) {
    const blob = await ordersApi.exportPositions(params)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `positions-${Date.now()}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  // Actions - Liquidations
  async function fetchLiquidations(params: LiquidationQueryParams) {
    liquidationsLoading.value = true
    try {
      const response: PaginatedResponse<Liquidation> = await ordersApi.getLiquidations(params)
      liquidations.value = response.data
      liquidationsTotal.value = response.total
      return response
    } finally {
      liquidationsLoading.value = false
    }
  }

  async function fetchLiquidationById(id: string) {
    liquidationsLoading.value = true
    try {
      const response = await ordersApi.getLiquidationById(id)
      currentLiquidation.value = response.data
      return response
    } finally {
      liquidationsLoading.value = false
    }
  }

  async function exportLiquidations(params: LiquidationQueryParams) {
    const blob = await ordersApi.exportLiquidations(params)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `liquidations-${Date.now()}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  // Actions - Copy Trading
  async function fetchCopyTradingRelations(params: CopyTradingQueryParams) {
    copyTradingLoading.value = true
    try {
      const response: PaginatedResponse<CopyTradingRelation> =
        await ordersApi.getCopyTradingRelations(params)
      copyTradingRelations.value = response.data
      copyTradingTotal.value = response.total
      return response
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
    try {
      const response = await ordersApi.updateCopyTrading(id, payload)
      const index = copyTradingRelations.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        copyTradingRelations.value[index] = response.data
      }
      if (currentCopyTrading.value?.id === id) {
        currentCopyTrading.value = response.data
      }
      return response
    } finally {
      copyTradingLoading.value = false
    }
  }

  async function pauseCopyTrading(id: string) {
    copyTradingLoading.value = true
    try {
      const response = await ordersApi.pauseCopyTrading(id)
      const index = copyTradingRelations.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        copyTradingRelations.value[index] = response.data
      }
      return response
    } finally {
      copyTradingLoading.value = false
    }
  }

  async function resumeCopyTrading(id: string) {
    copyTradingLoading.value = true
    try {
      const response = await ordersApi.resumeCopyTrading(id)
      const index = copyTradingRelations.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        copyTradingRelations.value[index] = response.data
      }
      return response
    } finally {
      copyTradingLoading.value = false
    }
  }

  async function stopCopyTrading(id: string) {
    copyTradingLoading.value = true
    try {
      const response = await ordersApi.stopCopyTrading(id)
      const index = copyTradingRelations.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        copyTradingRelations.value[index] = response.data
      }
      return response
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
