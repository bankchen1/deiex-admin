import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { riskRulesApi, riskLimitsApi, blacklistApi } from '@/services/api/risk'
import type { RiskRule, RiskLimit, BlacklistEntry, Version, PaginationParams } from '@/types/api'
import { message } from 'ant-design-vue'

export const useRiskStore = defineStore('risk', () => {
  // ============ Risk Rules State ============
  const rulesLoading = ref(false)
  const rulesError = ref<string | null>(null)
  const publishedRules = ref<RiskRule[]>([])
  const draftRules = ref<RiskRule[]>([])
  const currentRule = ref<RiskRule | null>(null)
  const ruleVersions = ref<Version[]>([])
  const currentVersion = ref<string>('')
  const ruleDiff = ref<{ added: RiskRule[]; modified: RiskRule[]; deleted: RiskRule[] } | null>(
    null
  )

  // ============ Risk Limits State ============
  const limitsLoading = ref(false)
  const limitsError = ref<string | null>(null)
  const limits = ref<RiskLimit[]>([])
  const currentLimit = ref<RiskLimit | null>(null)
  const limitsTotal = ref(0)

  // ============ Blacklist State ============
  const blacklistLoading = ref(false)
  const blacklistError = ref<string | null>(null)
  const blacklistEntries = ref<BlacklistEntry[]>([])
  const currentBlacklistEntry = ref<BlacklistEntry | null>(null)
  const blacklistTotal = ref(0)

  // ============ Computed ============
  const hasDraftRules = computed(() => draftRules.value.length > 0)
  const hasPublishedRules = computed(() => publishedRules.value.length > 0)
  const enabledRulesCount = computed(() => publishedRules.value.filter((r) => r.enabled).length)
  const activeBlacklistCount = computed(
    () => blacklistEntries.value.filter((e) => e.status === 'active').length
  )

  // ============ Risk Rules Actions ============
  async function fetchPublishedRules(params?: PaginationParams) {
    rulesLoading.value = true
    rulesError.value = null
    try {
      const response = await riskRulesApi.getPublished(params)
      publishedRules.value = response.data.items
      if (response.data.version) {
        currentVersion.value = response.data.version
      }
      return response
    } catch (error: any) {
      rulesError.value = error.message || 'Failed to fetch published rules'
      message.error(rulesError.value)
      throw error
    } finally {
      rulesLoading.value = false
    }
  }

  async function fetchDraftRules(params?: PaginationParams) {
    rulesLoading.value = true
    rulesError.value = null
    try {
      const response = await riskRulesApi.getDrafts(params)
      draftRules.value = response.data.items
      return response
    } catch (error: any) {
      rulesError.value = error.message || 'Failed to fetch draft rules'
      message.error(rulesError.value)
      throw error
    } finally {
      rulesLoading.value = false
    }
  }

  async function fetchRuleById(id: string) {
    rulesLoading.value = true
    rulesError.value = null
    try {
      const response = await riskRulesApi.getById(id)
      currentRule.value = response.data
      return response
    } catch (error: any) {
      rulesError.value = error.message || 'Failed to fetch rule'
      message.error(rulesError.value)
      throw error
    } finally {
      rulesLoading.value = false
    }
  }

  async function createDraftRule(payload: Partial<RiskRule>) {
    rulesLoading.value = true
    rulesError.value = null
    try {
      const response = await riskRulesApi.createDraft(payload)
      draftRules.value.unshift(response.data)
      message.success('Draft rule created successfully')
      return response
    } catch (error: any) {
      rulesError.value = error.message || 'Failed to create draft rule'
      message.error(rulesError.value)
      throw error
    } finally {
      rulesLoading.value = false
    }
  }

  async function updateDraftRule(id: string, payload: Partial<RiskRule>) {
    rulesLoading.value = true
    rulesError.value = null
    try {
      const response = await riskRulesApi.updateDraft(id, payload)
      const index = draftRules.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        draftRules.value[index] = response.data
      }
      if (currentRule.value?.id === id) {
        currentRule.value = response.data
      }
      message.success('Draft rule updated successfully')
      return response
    } catch (error: any) {
      rulesError.value = error.message || 'Failed to update draft rule'
      message.error(rulesError.value)
      throw error
    } finally {
      rulesLoading.value = false
    }
  }

  async function deleteDraftRule(id: string) {
    rulesLoading.value = true
    rulesError.value = null
    try {
      await riskRulesApi.deleteDraft(id)
      draftRules.value = draftRules.value.filter((r) => r.id !== id)
      if (currentRule.value?.id === id) {
        currentRule.value = null
      }
      message.success('Draft rule deleted successfully')
    } catch (error: any) {
      rulesError.value = error.message || 'Failed to delete draft rule'
      message.error(rulesError.value)
      throw error
    } finally {
      rulesLoading.value = false
    }
  }

  async function publishRules(payload: { notes: string; tags?: string[] }) {
    rulesLoading.value = true
    rulesError.value = null
    try {
      const response = await riskRulesApi.publish(payload)
      currentVersion.value = response.data.version
      // Refresh published and drafts
      await Promise.all([fetchPublishedRules(), fetchDraftRules()])
      message.success('Rules published successfully')
      return response
    } catch (error: any) {
      rulesError.value = error.message || 'Failed to publish rules'
      message.error(rulesError.value)
      throw error
    } finally {
      rulesLoading.value = false
    }
  }

  async function fetchRuleVersions() {
    rulesLoading.value = true
    rulesError.value = null
    try {
      const response = await riskRulesApi.getVersions()
      ruleVersions.value = response.data
      return response
    } catch (error: any) {
      rulesError.value = error.message || 'Failed to fetch versions'
      message.error(rulesError.value)
      throw error
    } finally {
      rulesLoading.value = false
    }
  }

  async function rollbackRules(versionId: string) {
    rulesLoading.value = true
    rulesError.value = null
    try {
      await riskRulesApi.rollback(versionId)
      // Refresh published rules
      await fetchPublishedRules()
      message.success('Rules rolled back successfully')
    } catch (error: any) {
      rulesError.value = error.message || 'Failed to rollback rules'
      message.error(rulesError.value)
      throw error
    } finally {
      rulesLoading.value = false
    }
  }

  async function fetchRuleDiff() {
    rulesLoading.value = true
    rulesError.value = null
    try {
      const response = await riskRulesApi.getDiff()
      ruleDiff.value = response.data
      return response
    } catch (error: any) {
      rulesError.value = error.message || 'Failed to fetch diff'
      message.error(rulesError.value)
      throw error
    } finally {
      rulesLoading.value = false
    }
  }

  async function simulateRule(ruleId: string, testData: any) {
    rulesLoading.value = true
    rulesError.value = null
    try {
      const response = await riskRulesApi.simulate(ruleId, testData)
      return response
    } catch (error: any) {
      rulesError.value = error.message || 'Failed to simulate rule'
      message.error(rulesError.value)
      throw error
    } finally {
      rulesLoading.value = false
    }
  }

  async function exportRules(format: 'json' | 'csv') {
    rulesLoading.value = true
    rulesError.value = null
    try {
      const blob = await riskRulesApi.export(format)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `risk-rules-${Date.now()}.${format}`
      link.click()
      window.URL.revokeObjectURL(url)
      message.success('Rules exported successfully')
    } catch (error: any) {
      rulesError.value = error.message || 'Failed to export rules'
      message.error(rulesError.value)
      throw error
    } finally {
      rulesLoading.value = false
    }
  }

  async function importRules(file: File) {
    rulesLoading.value = true
    rulesError.value = null
    try {
      const response = await riskRulesApi.import(file)
      message.success(`Imported ${response.data.imported} rules`)
      if (response.data.errors.length > 0) {
        message.warning(`${response.data.errors.length} errors occurred during import`)
      }
      // Refresh drafts
      await fetchDraftRules()
      return response
    } catch (error: any) {
      rulesError.value = error.message || 'Failed to import rules'
      message.error(rulesError.value)
      throw error
    } finally {
      rulesLoading.value = false
    }
  }

  // ============ Risk Limits Actions ============
  async function fetchLimits(params?: { scope?: string; type?: string } & PaginationParams) {
    limitsLoading.value = true
    limitsError.value = null
    try {
      const response = await riskLimitsApi.getList(params)
      limits.value = response.data.items
      limitsTotal.value = response.data.total
      return response
    } catch (error: any) {
      limitsError.value = error.message || 'Failed to fetch limits'
      message.error(limitsError.value)
      throw error
    } finally {
      limitsLoading.value = false
    }
  }

  async function fetchLimitById(id: string) {
    limitsLoading.value = true
    limitsError.value = null
    try {
      const response = await riskLimitsApi.getById(id)
      currentLimit.value = response.data
      return response
    } catch (error: any) {
      limitsError.value = error.message || 'Failed to fetch limit'
      message.error(limitsError.value)
      throw error
    } finally {
      limitsLoading.value = false
    }
  }

  async function createLimit(payload: Partial<RiskLimit>) {
    limitsLoading.value = true
    limitsError.value = null
    try {
      const response = await riskLimitsApi.create(payload)
      limits.value.unshift(response.data)
      limitsTotal.value += 1
      message.success('Limit created successfully')
      return response
    } catch (error: any) {
      limitsError.value = error.message || 'Failed to create limit'
      message.error(limitsError.value)
      throw error
    } finally {
      limitsLoading.value = false
    }
  }

  async function updateLimit(id: string, payload: Partial<RiskLimit>) {
    limitsLoading.value = true
    limitsError.value = null
    try {
      const response = await riskLimitsApi.update(id, payload)
      const index = limits.value.findIndex((l) => l.id === id)
      if (index !== -1) {
        limits.value[index] = response.data
      }
      if (currentLimit.value?.id === id) {
        currentLimit.value = response.data
      }
      message.success('Limit updated successfully')
      return response
    } catch (error: any) {
      limitsError.value = error.message || 'Failed to update limit'
      message.error(limitsError.value)
      throw error
    } finally {
      limitsLoading.value = false
    }
  }

  async function deleteLimit(id: string) {
    limitsLoading.value = true
    limitsError.value = null
    try {
      await riskLimitsApi.delete(id)
      limits.value = limits.value.filter((l) => l.id !== id)
      limitsTotal.value -= 1
      if (currentLimit.value?.id === id) {
        currentLimit.value = null
      }
      message.success('Limit deleted successfully')
    } catch (error: any) {
      limitsError.value = error.message || 'Failed to delete limit'
      message.error(limitsError.value)
      throw error
    } finally {
      limitsLoading.value = false
    }
  }

  async function batchUpdateLimits(payload: { limits: Array<{ id: string; enabled: boolean }> }) {
    limitsLoading.value = true
    limitsError.value = null
    try {
      await riskLimitsApi.batchUpdate(payload)
      // Update local state
      payload.limits.forEach(({ id, enabled }) => {
        const limit = limits.value.find((l) => l.id === id)
        if (limit) {
          limit.enabled = enabled
        }
      })
      message.success('Limits updated successfully')
    } catch (error: any) {
      limitsError.value = error.message || 'Failed to batch update limits'
      message.error(limitsError.value)
      throw error
    } finally {
      limitsLoading.value = false
    }
  }

  async function exportLimits(format: 'json' | 'csv') {
    limitsLoading.value = true
    limitsError.value = null
    try {
      const blob = await riskLimitsApi.export(format)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `risk-limits-${Date.now()}.${format}`
      link.click()
      window.URL.revokeObjectURL(url)
      message.success('Limits exported successfully')
    } catch (error: any) {
      limitsError.value = error.message || 'Failed to export limits'
      message.error(limitsError.value)
      throw error
    } finally {
      limitsLoading.value = false
    }
  }

  // ============ Blacklist Actions ============
  async function fetchBlacklist(params?: { type?: string; status?: string } & PaginationParams) {
    blacklistLoading.value = true
    blacklistError.value = null
    try {
      const response = await blacklistApi.getList(params)
      blacklistEntries.value = response.data.items
      blacklistTotal.value = response.data.total
      return response
    } catch (error: any) {
      blacklistError.value = error.message || 'Failed to fetch blacklist'
      message.error(blacklistError.value)
      throw error
    } finally {
      blacklistLoading.value = false
    }
  }

  async function fetchBlacklistEntryById(id: string) {
    blacklistLoading.value = true
    blacklistError.value = null
    try {
      const response = await blacklistApi.getById(id)
      currentBlacklistEntry.value = response.data
      return response
    } catch (error: any) {
      blacklistError.value = error.message || 'Failed to fetch blacklist entry'
      message.error(blacklistError.value)
      throw error
    } finally {
      blacklistLoading.value = false
    }
  }

  async function addToBlacklist(payload: Partial<BlacklistEntry>) {
    blacklistLoading.value = true
    blacklistError.value = null
    try {
      const response = await blacklistApi.add(payload)
      blacklistEntries.value.unshift(response.data)
      blacklistTotal.value += 1
      message.success('Added to blacklist successfully')
      return response
    } catch (error: any) {
      blacklistError.value = error.message || 'Failed to add to blacklist'
      message.error(blacklistError.value)
      throw error
    } finally {
      blacklistLoading.value = false
    }
  }

  async function updateBlacklistEntry(id: string, payload: Partial<BlacklistEntry>) {
    blacklistLoading.value = true
    blacklistError.value = null
    try {
      const response = await blacklistApi.update(id, payload)
      const index = blacklistEntries.value.findIndex((e) => e.id === id)
      if (index !== -1) {
        blacklistEntries.value[index] = response.data
      }
      if (currentBlacklistEntry.value?.id === id) {
        currentBlacklistEntry.value = response.data
      }
      message.success('Blacklist entry updated successfully')
      return response
    } catch (error: any) {
      blacklistError.value = error.message || 'Failed to update blacklist entry'
      message.error(blacklistError.value)
      throw error
    } finally {
      blacklistLoading.value = false
    }
  }

  async function removeFromBlacklist(id: string) {
    blacklistLoading.value = true
    blacklistError.value = null
    try {
      await blacklistApi.remove(id)
      blacklistEntries.value = blacklistEntries.value.filter((e) => e.id !== id)
      blacklistTotal.value -= 1
      if (currentBlacklistEntry.value?.id === id) {
        currentBlacklistEntry.value = null
      }
      message.success('Removed from blacklist successfully')
    } catch (error: any) {
      blacklistError.value = error.message || 'Failed to remove from blacklist'
      message.error(blacklistError.value)
      throw error
    } finally {
      blacklistLoading.value = false
    }
  }

  async function bulkImportBlacklist(file: File) {
    blacklistLoading.value = true
    blacklistError.value = null
    try {
      const response = await blacklistApi.bulkImport(file)
      message.success(`Imported ${response.data.imported} entries`)
      if (response.data.errors.length > 0) {
        message.warning(`${response.data.errors.length} errors occurred during import`)
      }
      // Refresh blacklist
      await fetchBlacklist()
      return response
    } catch (error: any) {
      blacklistError.value = error.message || 'Failed to import blacklist'
      message.error(blacklistError.value)
      throw error
    } finally {
      blacklistLoading.value = false
    }
  }

  async function exportBlacklist(format: 'json' | 'csv', type?: string) {
    blacklistLoading.value = true
    blacklistError.value = null
    try {
      const blob = await blacklistApi.export(format, type)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `blacklist-${type || 'all'}-${Date.now()}.${format}`
      link.click()
      window.URL.revokeObjectURL(url)
      message.success('Blacklist exported successfully')
    } catch (error: any) {
      blacklistError.value = error.message || 'Failed to export blacklist'
      message.error(blacklistError.value)
      throw error
    } finally {
      blacklistLoading.value = false
    }
  }

  async function checkBlacklist(type: string, value: string) {
    blacklistLoading.value = true
    blacklistError.value = null
    try {
      const response = await blacklistApi.check(type, value)
      return response
    } catch (error: any) {
      blacklistError.value = error.message || 'Failed to check blacklist'
      message.error(blacklistError.value)
      throw error
    } finally {
      blacklistLoading.value = false
    }
  }

  // ============ Reset Functions ============
  function resetRules() {
    rulesLoading.value = false
    rulesError.value = null
    publishedRules.value = []
    draftRules.value = []
    currentRule.value = null
    ruleVersions.value = []
    currentVersion.value = ''
    ruleDiff.value = null
  }

  function resetLimits() {
    limitsLoading.value = false
    limitsError.value = null
    limits.value = []
    currentLimit.value = null
    limitsTotal.value = 0
  }

  function resetBlacklist() {
    blacklistLoading.value = false
    blacklistError.value = null
    blacklistEntries.value = []
    currentBlacklistEntry.value = null
    blacklistTotal.value = 0
  }

  function resetAll() {
    resetRules()
    resetLimits()
    resetBlacklist()
  }

  return {
    // Risk Rules State
    rulesLoading,
    rulesError,
    publishedRules,
    draftRules,
    currentRule,
    ruleVersions,
    currentVersion,
    ruleDiff,
    hasDraftRules,
    hasPublishedRules,
    enabledRulesCount,

    // Risk Rules Actions
    fetchPublishedRules,
    fetchDraftRules,
    fetchRuleById,
    createDraftRule,
    updateDraftRule,
    deleteDraftRule,
    publishRules,
    fetchRuleVersions,
    rollbackRules,
    fetchRuleDiff,
    simulateRule,
    exportRules,
    importRules,

    // Risk Limits State
    limitsLoading,
    limitsError,
    limits,
    currentLimit,
    limitsTotal,

    // Risk Limits Actions
    fetchLimits,
    fetchLimitById,
    createLimit,
    updateLimit,
    deleteLimit,
    batchUpdateLimits,
    exportLimits,

    // Blacklist State
    blacklistLoading,
    blacklistError,
    blacklistEntries,
    currentBlacklistEntry,
    blacklistTotal,
    activeBlacklistCount,

    // Blacklist Actions
    fetchBlacklist,
    fetchBlacklistEntryById,
    addToBlacklist,
    updateBlacklistEntry,
    removeFromBlacklist,
    bulkImportBlacklist,
    exportBlacklist,
    checkBlacklist,

    // Reset
    resetRules,
    resetLimits,
    resetBlacklist,
    resetAll,
  }
})
