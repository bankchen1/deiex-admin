import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  listRiskRules,
  listRiskLimits,
  listBlacklistEntries,
  getRiskRuleById,
  getRiskLimitById,
  getBlacklistEntryById,
  createRiskRule,
  updateRiskRule,
  deleteRiskRule,
  createRiskLimit,
  updateRiskLimit,
  deleteRiskLimit,
  createBlacklistEntry,
  updateBlacklistEntry,
  deleteBlacklistEntry,
  type RiskRuleQueryParams,
  type RiskLimitQueryParams,
  type BlacklistEntryQueryParams,
  type CreateRiskRulePayload,
  type UpdateRiskRulePayload,
  type CreateRiskLimitPayload,
  type UpdateRiskLimitPayload,
  type CreateBlacklistEntryPayload,
  type UpdateBlacklistEntryPayload,
} from '@/services/api/facade'
import type {
  RiskRule,
  RiskLimit,
  BlacklistEntry,
  RiskRuleDetailResponse,
  RiskLimitDetailResponse,
  BlacklistEntryDetailResponse,
} from '@/contracts/risk'

export const useRiskStore = defineStore('risk', () => {
  // State
  const riskRulesLoading = ref(false)
  const riskLimitsLoading = ref(false)
  const blacklistEntriesLoading = ref(false)
  const detailLoading = ref(false)
  const actionLoading = ref(false)

  const error = ref<string | null>(null)

  // Risk Rules state
  const riskRules = ref<RiskRule[]>([])
  const riskRulesTotal = ref(0)
  const riskRulesCurrentPage = ref(1)
  const riskRulesPageSize = ref(20)

  // Risk Limits state
  const riskLimits = ref<RiskLimit[]>([])
  const riskLimitsTotal = ref(0)
  const riskLimitsCurrentPage = ref(1)
  const riskLimitsPageSize = ref(20)

  // Blacklist Entries state
  const blacklistEntries = ref<BlacklistEntry[]>([])
  const blacklistEntriesTotal = ref(0)
  const blacklistEntriesCurrentPage = ref(1)
  const blacklistEntriesPageSize = ref(20)

  // Detail state
  const currentRiskRule = ref<RiskRuleDetailResponse | null>(null)
  const currentRiskLimit = ref<RiskLimitDetailResponse | null>(null)
  const currentBlacklistEntry = ref<BlacklistEntryDetailResponse | null>(null)

  // Getters
  const hasRiskRules = computed(() => riskRules.value.length > 0)
  const hasRiskLimits = computed(() => riskLimits.value.length > 0)
  const hasBlacklistEntries = computed(() => blacklistEntries.value.length > 0)

  // Actions - Risk Rules
  async function fetchRiskRules(params: RiskRuleQueryParams = {}) {
    riskRulesLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await listRiskRules({
        page: riskRulesCurrentPage.value,
        pageSize: riskRulesPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        riskRules.value = []
        riskRulesTotal.value = 0
        return
      }

      riskRules.value = data.data
      riskRulesTotal.value = data.total
      riskRulesCurrentPage.value = data.page
      riskRulesPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch risk rules list'
      throw e
    } finally {
      riskRulesLoading.value = false
    }
  }

  async function fetchRiskRuleById(id: string) {
    detailLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getRiskRuleById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Risk rule not found')
      }

      currentRiskRule.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch risk rule details'
      throw e
    } finally {
      detailLoading.value = false
    }
  }

  async function createRiskRuleAction(payload: CreateRiskRulePayload) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await createRiskRule(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to create risk rule')
      }

      // Add to the list
      riskRules.value.unshift(data)

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create risk rule'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function updateRiskRuleAction(id: string, payload: UpdateRiskRulePayload) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateRiskRule(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update risk rule')
      }

      // Update the rule in the list if it exists
      const index = riskRules.value.findIndex((rule) => rule.id === id)
      if (index !== -1) {
        riskRules.value[index] = { ...riskRules.value[index], ...data }
      }

      // Update current rule if it's the same
      if (currentRiskRule.value?.rule.id === id) {
        currentRiskRule.value.rule = { ...currentRiskRule.value.rule, ...data }
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update risk rule'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function deleteRiskRuleAction(id: string) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await deleteRiskRule(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to delete risk rule')
      }

      // Remove from the list
      const index = riskRules.value.findIndex((rule) => rule.id === id)
      if (index !== -1) {
        riskRules.value.splice(index, 1)
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to delete risk rule'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  // Actions - Risk Limits
  async function fetchRiskLimits(params: RiskLimitQueryParams = {}) {
    riskLimitsLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await listRiskLimits({
        page: riskLimitsCurrentPage.value,
        pageSize: riskLimitsPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        riskLimits.value = []
        riskLimitsTotal.value = 0
        return
      }

      riskLimits.value = data.data
      riskLimitsTotal.value = data.total
      riskLimitsCurrentPage.value = data.page
      riskLimitsPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch risk limits list'
      throw e
    } finally {
      riskLimitsLoading.value = false
    }
  }

  async function fetchRiskLimitById(id: string) {
    detailLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getRiskLimitById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Risk limit not found')
      }

      currentRiskLimit.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch risk limit details'
      throw e
    } finally {
      detailLoading.value = false
    }
  }

  async function createRiskLimitAction(payload: CreateRiskLimitPayload) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await createRiskLimit(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to create risk limit')
      }

      // Add to the list
      riskLimits.value.unshift(data)

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create risk limit'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function updateRiskLimitAction(id: string, payload: UpdateRiskLimitPayload) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateRiskLimit(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update risk limit')
      }

      // Update the limit in the list if it exists
      const index = riskLimits.value.findIndex((limit) => limit.id === id)
      if (index !== -1) {
        riskLimits.value[index] = { ...riskLimits.value[index], ...data }
      }

      // Update current limit if it's the same
      if (currentRiskLimit.value?.limit.id === id) {
        currentRiskLimit.value.limit = { ...currentRiskLimit.value.limit, ...data }
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update risk limit'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function deleteRiskLimitAction(id: string) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await deleteRiskLimit(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to delete risk limit')
      }

      // Remove from the list
      const index = riskLimits.value.findIndex((limit) => limit.id === id)
      if (index !== -1) {
        riskLimits.value.splice(index, 1)
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to delete risk limit'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  // Actions - Blacklist Entries
  async function fetchBlacklistEntries(params: BlacklistEntryQueryParams = {}) {
    blacklistEntriesLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await listBlacklistEntries({
        page: blacklistEntriesCurrentPage.value,
        pageSize: blacklistEntriesPageSize.value,
        ...params,
      })

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        blacklistEntries.value = []
        blacklistEntriesTotal.value = 0
        return
      }

      blacklistEntries.value = data.data
      blacklistEntriesTotal.value = data.total
      blacklistEntriesCurrentPage.value = data.page
      blacklistEntriesPageSize.value = data.pageSize
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch blacklist entries list'
      throw e
    } finally {
      blacklistEntriesLoading.value = false
    }
  }

  async function fetchBlacklistEntryById(id: string) {
    detailLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await getBlacklistEntryById(id)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Blacklist entry not found')
      }

      currentBlacklistEntry.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch blacklist entry details'
      throw e
    } finally {
      detailLoading.value = false
    }
  }

  async function createBlacklistEntryAction(payload: CreateBlacklistEntryPayload) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await createBlacklistEntry(payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to create blacklist entry')
      }

      // Add to the list
      blacklistEntries.value.unshift(data)

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create blacklist entry'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function updateBlacklistEntryAction(id: string, payload: UpdateBlacklistEntryPayload) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await updateBlacklistEntry(id, payload)

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to update blacklist entry')
      }

      // Update the entry in the list if it exists
      const index = blacklistEntries.value.findIndex((entry) => entry.id === id)
      if (index !== -1) {
        blacklistEntries.value[index] = { ...blacklistEntries.value[index], ...data }
      }

      // Update current entry if it's the same
      if (currentBlacklistEntry.value?.entry.id === id) {
        currentBlacklistEntry.value.entry = { ...currentBlacklistEntry.value.entry, ...data }
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update blacklist entry'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  async function deleteBlacklistEntryAction(id: string) {
    actionLoading.value = true
    error.value = null
    try {
      const { data, error: err } = await deleteBlacklistEntry(id, '')

      if (err) {
        error.value = err.message
        throw new Error(err.message)
      }

      if (!data) {
        throw new Error('Failed to delete blacklist entry')
      }

      // Remove from the list
      const index = blacklistEntries.value.findIndex((entry) => entry.id === id)
      if (index !== -1) {
        blacklistEntries.value.splice(index, 1)
      }

      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to delete blacklist entry'
      throw e
    } finally {
      actionLoading.value = false
    }
  }

  // Page setters
  function setRiskRulesPage(page: number) {
    riskRulesCurrentPage.value = page
  }

  function setRiskRulesPageSize(size: number) {
    riskRulesPageSize.value = size
    riskRulesCurrentPage.value = 1 // Reset to first page when changing page size
  }

  function setRiskLimitsPage(page: number) {
    riskLimitsCurrentPage.value = page
  }

  function setRiskLimitsPageSize(size: number) {
    riskLimitsPageSize.value = size
    riskLimitsCurrentPage.value = 1 // Reset to first page when changing page size
  }

  function setBlacklistEntriesPage(page: number) {
    blacklistEntriesCurrentPage.value = page
  }

  function setBlacklistEntriesPageSize(size: number) {
    blacklistEntriesPageSize.value = size
    blacklistEntriesCurrentPage.value = 1 // Reset to first page when changing page size
  }

  function reset() {
    riskRulesLoading.value = false
    riskLimitsLoading.value = false
    blacklistEntriesLoading.value = false
    detailLoading.value = false
    actionLoading.value = false
    error.value = null
    riskRules.value = []
    riskRulesTotal.value = 0
    riskRulesCurrentPage.value = 1
    riskRulesPageSize.value = 20
    riskLimits.value = []
    riskLimitsTotal.value = 0
    riskLimitsCurrentPage.value = 1
    riskLimitsPageSize.value = 20
    blacklistEntries.value = []
    blacklistEntriesTotal.value = 0
    blacklistEntriesCurrentPage.value = 1
    blacklistEntriesPageSize.value = 20
    currentRiskRule.value = null
    currentRiskLimit.value = null
    currentBlacklistEntry.value = null
  }

  return {
    // State
    riskRulesLoading,
    riskLimitsLoading,
    blacklistEntriesLoading,
    detailLoading,
    actionLoading,
    error,
    riskRules,
    riskRulesTotal,
    riskRulesCurrentPage,
    riskRulesPageSize,
    riskLimits,
    riskLimitsTotal,
    riskLimitsCurrentPage,
    riskLimitsPageSize,
    blacklistEntries,
    blacklistEntriesTotal,
    blacklistEntriesCurrentPage,
    blacklistEntriesPageSize,
    currentRiskRule,
    currentRiskLimit,
    currentBlacklistEntry,
    // Getters
    hasRiskRules,
    hasRiskLimits,
    hasBlacklistEntries,
    // Actions - Risk Rules
    fetchRiskRules,
    fetchRiskRuleById,
    createRiskRule: createRiskRuleAction,
    updateRiskRule: updateRiskRuleAction,
    deleteRiskRule: deleteRiskRuleAction,
    // Actions - Risk Limits
    fetchRiskLimits,
    fetchRiskLimitById,
    createRiskLimit: createRiskLimitAction,
    updateRiskLimit: updateRiskLimitAction,
    deleteRiskLimit: deleteRiskLimitAction,
    // Actions - Blacklist Entries
    fetchBlacklistEntries,
    fetchBlacklistEntryById,
    createBlacklistEntry: createBlacklistEntryAction,
    updateBlacklistEntry: updateBlacklistEntryAction,
    deleteBlacklistEntry: deleteBlacklistEntryAction,
    // Page setters
    setRiskRulesPage,
    setRiskRulesPageSize,
    setRiskLimitsPage,
    setRiskLimitsPageSize,
    setBlacklistEntriesPage,
    setBlacklistEntriesPageSize,
    // Reset
    reset,
  }
})
