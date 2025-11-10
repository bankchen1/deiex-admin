/**
 * Risk Mock Handlers
 *
 * Mock handlers that align with the contracts defined in src/contracts/risk.ts
 * All responses must pass contract validation
 */

import type {
  RiskRuleListResponse,
  RiskLimitListResponse,
  BlacklistEntryListResponse,
  RiskRuleDetailResponse,
  RiskLimitDetailResponse,
  BlacklistEntryDetailResponse,
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
} from '@/contracts/risk'

// Load mock data
let mockData = {
  riskRules: [] as any[],
  riskLimits: [] as any[],
  blacklistEntries: [] as any[],
}

// Initialize mock data if not done already
if (mockData.riskRules.length === 0) {
  mockData.riskRules = [
    {
      id: 'rule_001',
      name: 'Large Deposit Flag',
      description: 'Flags deposits over 10,000 USD',
      conditions: [
        {
          field: 'amount',
          operator: 'gt',
          value: 10000,
        },
      ],
      actions: [
        {
          type: 'review',
          params: {
            priority: 'high',
          },
        },
      ],
      priority: 10,
      enabled: true,
      status: 'published',
      version: 'v1.2',
      createdAt: '2024-01-15T09:30:00Z',
      updatedAt: '2024-06-20T14:22:45Z',
      createdBy: 'admin_001',
      matchCount: 125,
      lastMatchedAt: '2024-11-05T10:15:30Z',
    },
    {
      id: 'rule_002',
      name: 'New User Withdrawal Limit',
      description: 'Limits withdrawals for accounts less than 7 days old',
      conditions: [
        {
          field: 'accountAge',
          operator: 'lt',
          value: 7,
        },
        {
          field: 'withdrawalAmount',
          operator: 'gt',
          value: 5000,
        },
      ],
      actions: [
        {
          type: 'block',
          params: {},
        },
      ],
      priority: 5,
      enabled: true,
      status: 'published',
      version: 'v1.1',
      createdAt: '2024-02-10T11:45:00Z',
      updatedAt: '2024-02-10T11:45:00Z',
      createdBy: 'admin_002',
      matchCount: 32,
      lastMatchedAt: '2024-11-07T16:45:20Z',
    },
    {
      id: 'rule_003',
      name: 'Geographic Restriction',
      description: 'Restricts access from high-risk countries',
      conditions: [
        {
          field: 'country',
          operator: 'in',
          value: ['RU', 'KP', 'IR', 'SY'],
        },
      ],
      actions: [
        {
          type: 'block',
          params: {},
        },
      ],
      priority: 15,
      enabled: true,
      status: 'published',
      version: 'v1.0',
      createdAt: '2023-11-20T14:30:00Z',
      updatedAt: '2023-11-20T14:30:00Z',
      createdBy: 'admin_003',
      matchCount: 240,
      lastMatchedAt: '2024-11-08T09:15:00Z',
    },
    {
      id: 'rule_004',
      name: 'High Frequency Trading',
      description: 'Flags accounts with excessive trading activity',
      conditions: [
        {
          field: 'tradeCount',
          operator: 'gt',
          value: 100,
        },
      ],
      actions: [
        {
          type: 'alert',
          params: {
            level: 'high',
          },
        },
      ],
      priority: 8,
      enabled: false,
      status: 'draft',
      version: 'v0.5',
      createdAt: '2024-08-15T10:20:00Z',
      updatedAt: '2024-08-15T10:20:00Z',
      createdBy: 'admin_001',
      matchCount: 0,
      lastMatchedAt: null,
    },
  ]

  mockData.riskLimits = [
    {
      id: 'limit_001',
      name: 'Daily Withdrawal Limit',
      description: 'Maximum daily withdrawal amount per user',
      scope: 'user',
      scopeValue: null,
      type: 'withdrawal',
      period: 'daily',
      threshold: '10000',
      currency: 'USD',
      enabled: true,
      effectiveFrom: '2024-01-01T00:00:00Z',
      createdAt: '2023-12-15T08:20:00Z',
      updatedAt: '2024-03-10T09:15:00Z',
      createdBy: 'admin_001',
      currentUsage: '3450',
      usagePercentage: 34.5,
    },
    {
      id: 'limit_002',
      name: 'Country Deposit Limit',
      description: 'Maximum monthly deposit amount for high-risk countries',
      scope: 'country',
      scopeValue: 'RU',
      type: 'deposit',
      period: 'monthly',
      threshold: '5000',
      currency: 'USD',
      enabled: true,
      effectiveFrom: '2024-05-01T00:00:00Z',
      createdAt: '2024-04-20T14:30:00Z',
      updatedAt: '2024-04-20T14:30:00Z',
      createdBy: 'admin_003',
      currentUsage: '2800',
      usagePercentage: 56,
    },
    {
      id: 'limit_003',
      name: 'Position Size Limit',
      description: 'Maximum position size per user',
      scope: 'user',
      scopeValue: null,
      type: 'position',
      period: 'lifetime',
      threshold: '100000',
      currency: 'USD',
      enabled: true,
      effectiveFrom: '2024-06-01T00:00:00Z',
      createdAt: '2024-05-25T11:45:00Z',
      updatedAt: '2024-05-25T11:45:00Z',
      createdBy: 'admin_002',
      currentUsage: '45000',
      usagePercentage: 45,
    },
  ]

  mockData.blacklistEntries = [
    {
      id: 'bl_001',
      type: 'ip',
      value: '198.51.100.25',
      reason: 'Multiple fraud attempts',
      source: 'auto',
      status: 'active',
      addedBy: 'system',
      addedAt: '2024-08-15T12:30:00Z',
      expiresAt: '2025-08-15T12:30:00Z',
      notes: 'IP associated with multiple fraudulent accounts',
      matchCount: 15,
      lastMatchedAt: '2024-11-01T09:20:45Z',
    },
    {
      id: 'bl_002',
      type: 'email',
      value: 'fraud@example.com',
      reason: 'Identity theft',
      source: 'manual',
      status: 'active',
      addedBy: 'admin_001',
      addedAt: '2024-09-20T16:45:00Z',
      notes: 'Used in multiple identity theft cases',
      matchCount: 3,
      lastMatchedAt: '2024-10-15T14:10:20Z',
    },
    {
      id: 'bl_003',
      type: 'device',
      value: 'device_abc123',
      reason: 'Suspicious activity',
      source: 'manual',
      status: 'active',
      addedBy: 'admin_002',
      addedAt: '2024-10-05T08:15:00Z',
      notes: 'Device flagged for review',
      matchCount: 7,
      lastMatchedAt: '2024-10-30T11:30:15Z',
    },
    {
      id: 'bl_004',
      type: 'address',
      value: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      reason: 'Mixing service',
      source: 'auto',
      status: 'active',
      addedBy: 'system',
      addedAt: '2024-07-20T14:20:00Z',
      notes: 'Address associated with coin mixing service',
      matchCount: 5,
      lastMatchedAt: '2024-11-05T16:45:30Z',
    },
  ]
}

/**
 * Handler for listing risk rules with pagination and filtering
 */
export async function handleListRiskRules(
  params: RiskRuleQueryParams
): Promise<RiskRuleListResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

  // Apply filters if provided
  let filteredRules = [...mockData.riskRules]

  if (params.status) {
    filteredRules = filteredRules.filter((rule) => rule.status === params.status)
  }

  if (params.enabled !== undefined) {
    filteredRules = filteredRules.filter((rule) => rule.enabled === params.enabled)
  }

  if (params.search) {
    const searchTerm = params.search.toLowerCase()
    filteredRules = filteredRules.filter(
      (rule) =>
        rule.id.toLowerCase().includes(searchTerm) ||
        (rule.name && rule.name.toLowerCase().includes(searchTerm)) ||
        (rule.description && rule.description.toLowerCase().includes(searchTerm))
    )
  }

  // Apply sorting if provided
  if (params.sortField) {
    filteredRules.sort((a, b) => {
      const valA = a[params.sortField!] || ''
      const valB = b[params.sortField!] || ''

      if (typeof valA === 'string' && typeof valB === 'string') {
        return params.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }

      if (params.sortOrder === 'asc') {
        return valA < valB ? -1 : valA > valB ? 1 : 0
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0
      }
    })
  }

  // Apply pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const paginatedRules = filteredRules.slice(startIndex, startIndex + pageSize)

  return {
    data: paginatedRules,
    total: filteredRules.length,
    page,
    pageSize,
  }
}

/**
 * Handler for listing risk limits with pagination and filtering
 */
export async function handleListRiskLimits(
  params: RiskLimitQueryParams
): Promise<RiskLimitListResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

  // Apply filters if provided
  let filteredLimits = [...mockData.riskLimits]

  if (params.type) {
    filteredLimits = filteredLimits.filter((limit) => limit.type === params.type)
  }

  if (params.scope) {
    filteredLimits = filteredLimits.filter((limit) => limit.scope === params.scope)
  }

  if (params.enabled !== undefined) {
    filteredLimits = filteredLimits.filter((limit) => limit.enabled === params.enabled)
  }

  if (params.search) {
    const searchTerm = params.search.toLowerCase()
    filteredLimits = filteredLimits.filter(
      (limit) =>
        limit.id.toLowerCase().includes(searchTerm) ||
        (limit.name && limit.name.toLowerCase().includes(searchTerm)) ||
        (limit.description && limit.description.toLowerCase().includes(searchTerm))
    )
  }

  // Apply sorting if provided
  if (params.sortField) {
    filteredLimits.sort((a, b) => {
      const valA = a[params.sortField!] || ''
      const valB = b[params.sortField!] || ''

      if (typeof valA === 'string' && typeof valB === 'string') {
        return params.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }

      if (params.sortOrder === 'asc') {
        return valA < valB ? -1 : valA > valB ? 1 : 0
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0
      }
    })
  }

  // Apply pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const paginatedLimits = filteredLimits.slice(startIndex, startIndex + pageSize)

  return {
    data: paginatedLimits,
    total: filteredLimits.length,
    page,
    pageSize,
  }
}

/**
 * Handler for listing blacklist entries with pagination and filtering
 */
export async function handleListBlacklistEntries(
  params: BlacklistEntryQueryParams
): Promise<BlacklistEntryListResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))

  // Apply filters if provided
  let filteredEntries = [...mockData.blacklistEntries]

  if (params.type) {
    filteredEntries = filteredEntries.filter((entry) => entry.type === params.type)
  }

  if (params.status) {
    filteredEntries = filteredEntries.filter((entry) => entry.status === params.status)
  }

  if (params.source) {
    filteredEntries = filteredEntries.filter((entry) => entry.source === params.source)
  }

  if (params.search) {
    const searchTerm = params.search.toLowerCase()
    filteredEntries = filteredEntries.filter(
      (entry) =>
        entry.id.toLowerCase().includes(searchTerm) ||
        (entry.value && entry.value.toLowerCase().includes(searchTerm)) ||
        (entry.reason && entry.reason.toLowerCase().includes(searchTerm))
    )
  }

  // Apply sorting if provided
  if (params.sortField) {
    filteredEntries.sort((a, b) => {
      const valA = a[params.sortField!] || ''
      const valB = b[params.sortField!] || ''

      if (typeof valA === 'string' && typeof valB === 'string') {
        return params.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }

      if (params.sortOrder === 'asc') {
        return valA < valB ? -1 : valA > valB ? 1 : 0
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0
      }
    })
  }

  // Apply pagination
  const page = params.page || 1
  const pageSize = params.pageSize || 20
  const startIndex = (page - 1) * pageSize
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + pageSize)

  return {
    data: paginatedEntries,
    total: filteredEntries.length,
    page,
    pageSize,
  }
}

/**
 * Handler for getting a risk rule by ID
 */
export async function handleGetRiskRuleById(id: string): Promise<RiskRuleDetailResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300))

  const rule = mockData.riskRules.find((r) => r.id === id)
  if (!rule) {
    throw new Error(`Risk Rule with ID ${id} not found`)
  }

  return {
    rule,
    auditTrail: [
      {
        id: 'audit_001',
        action: 'RISK_RULE_CREATED',
        timestamp: rule.createdAt,
        by: rule.createdBy,
        details: 'Risk rule created',
      },
      ...(rule.updatedAt !== rule.createdAt
        ? [
            {
              id: 'audit_002',
              action: 'RISK_RULE_UPDATED',
              timestamp: rule.updatedAt,
              by: rule.createdBy,
              details: 'Risk rule updated',
            },
          ]
        : []),
    ],
  }
}

/**
 * Handler for getting a risk limit by ID
 */
export async function handleGetRiskLimitById(id: string): Promise<RiskLimitDetailResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300))

  const limit = mockData.riskLimits.find((l) => l.id === id)
  if (!limit) {
    throw new Error(`Risk Limit with ID ${id} not found`)
  }

  return {
    limit,
    auditTrail: [
      {
        id: 'audit_001',
        action: 'RISK_LIMIT_CREATED',
        timestamp: limit.createdAt,
        by: limit.createdBy,
        details: 'Risk limit created',
      },
    ],
  }
}

/**
 * Handler for getting a blacklist entry by ID
 */
export async function handleGetBlacklistEntryById(
  id: string
): Promise<BlacklistEntryDetailResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300))

  const entry = mockData.blacklistEntries.find((e) => e.id === id)
  if (!entry) {
    throw new Error(`Blacklist Entry with ID ${id} not found`)
  }

  return {
    entry,
    auditTrail: [
      {
        id: 'audit_001',
        action: 'BLACKLIST_ENTRY_ADDED',
        timestamp: entry.addedAt,
        by: entry.addedBy,
        details: `Blacklist entry added via ${entry.source}`,
      },
      ...(entry.status === 'removed'
        ? [
            {
              id: 'audit_002',
              action: 'BLACKLIST_ENTRY_REMOVED',
              timestamp: entry.removedAt || new Date().toISOString(),
              by: entry.removedBy || 'system',
              details: 'Blacklist entry removed',
            },
          ]
        : []),
    ],
  }
}

/**
 * Handler for creating a risk rule
 */
export async function handleCreateRiskRule(payload: CreateRiskRulePayload): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 500))

  const newRule = {
    id: `rule_${Date.now()}`,
    name: payload.name,
    description: payload.description,
    conditions: payload.conditions || [],
    actions: payload.actions || [],
    priority: payload.priority || 0,
    enabled: payload.enabled !== undefined ? payload.enabled : true,
    status: 'draft',
    version: 'v1.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'admin_current', // This would be determined from context
    matchCount: 0,
    lastMatchedAt: null,
  }

  mockData.riskRules.push(newRule)

  return newRule
}

/**
 * Handler for updating a risk rule
 */
export async function handleUpdateRiskRule(
  id: string,
  payload: UpdateRiskRulePayload
): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))

  const ruleIndex = mockData.riskRules.findIndex((r) => r.id === id)
  if (ruleIndex === -1) {
    throw new Error(`Risk Rule with ID ${id} not found`)
  }

  // Update the rule with provided fields
  mockData.riskRules[ruleIndex] = {
    ...mockData.riskRules[ruleIndex],
    ...payload,
    updatedAt: new Date().toISOString(),
  }

  return mockData.riskRules[ruleIndex]
}

/**
 * Handler for deleting a risk rule
 */
export async function handleDeleteRiskRule(id: string): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300))

  const ruleIndex = mockData.riskRules.findIndex((r) => r.id === id)
  if (ruleIndex === -1) {
    throw new Error(`Risk Rule with ID ${id} not found`)
  }

  const deletedRule = mockData.riskRules.splice(ruleIndex, 1)[0]

  return deletedRule
}

/**
 * Handler for creating a risk limit
 */
export async function handleCreateRiskLimit(payload: CreateRiskLimitPayload): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 500))

  const newLimit = {
    id: `limit_${Date.now()}`,
    name: payload.name,
    description: payload.description,
    scope: payload.scope,
    scopeValue: payload.scopeValue,
    type: payload.type,
    period: payload.period,
    threshold: payload.threshold,
    currency: payload.currency,
    enabled: payload.enabled !== undefined ? payload.enabled : true,
    effectiveFrom: payload.effectiveFrom || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'admin_current', // This would be determined from context
    currentUsage: '0',
    usagePercentage: 0,
  }

  mockData.riskLimits.push(newLimit)

  return newLimit
}

/**
 * Handler for updating a risk limit
 */
export async function handleUpdateRiskLimit(
  id: string,
  payload: UpdateRiskLimitPayload
): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))

  const limitIndex = mockData.riskLimits.findIndex((l) => l.id === id)
  if (limitIndex === -1) {
    throw new Error(`Risk Limit with ID ${id} not found`)
  }

  // Update the limit with provided fields
  mockData.riskLimits[limitIndex] = {
    ...mockData.riskLimits[limitIndex],
    ...payload,
    updatedAt: new Date().toISOString(),
  }

  return mockData.riskLimits[limitIndex]
}

/**
 * Handler for deleting a risk limit
 */
export async function handleDeleteRiskLimit(id: string): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300))

  const limitIndex = mockData.riskLimits.findIndex((l) => l.id === id)
  if (limitIndex === -1) {
    throw new Error(`Risk Limit with ID ${id} not found`)
  }

  const deletedLimit = mockData.riskLimits.splice(limitIndex, 1)[0]

  return deletedLimit
}

/**
 * Handler for creating a blacklist entry
 */
export async function handleCreateBlacklistEntry(
  payload: CreateBlacklistEntryPayload
): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 500))

  const newEntry = {
    id: `bl_${Date.now()}`,
    type: payload.type,
    value: payload.value,
    reason: payload.reason,
    source: payload.source || 'manual',
    status: 'active',
    addedBy: 'admin_current', // This would be determined from context
    addedAt: new Date().toISOString(),
    expiresAt: payload.expiresAt,
    notes: payload.notes,
    matchCount: 0,
    lastMatchedAt: null,
  }

  mockData.blacklistEntries.push(newEntry)

  return newEntry
}

/**
 * Handler for updating a blacklist entry
 */
export async function handleUpdateBlacklistEntry(
  id: string,
  payload: UpdateBlacklistEntryPayload
): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))

  const entryIndex = mockData.blacklistEntries.findIndex((e) => e.id === id)
  if (entryIndex === -1) {
    throw new Error(`Blacklist Entry with ID ${id} not found`)
  }

  // Update the entry with provided fields
  mockData.blacklistEntries[entryIndex] = {
    ...mockData.blacklistEntries[entryIndex],
    ...payload,
    updatedAt: new Date().toISOString(),
  }

  return mockData.blacklistEntries[entryIndex]
}

/**
 * Handler for deleting a blacklist entry
 */
export async function handleDeleteBlacklistEntry(id: string): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300))

  const entryIndex = mockData.blacklistEntries.findIndex((e) => e.id === id)
  if (entryIndex === -1) {
    throw new Error(`Blacklist Entry with ID ${id} not found`)
  }

  const deletedEntry = mockData.blacklistEntries.splice(entryIndex, 1)[0]

  return deletedEntry
}

/**
 * Handler for simulating risk
 */
export async function handleSimulateRisk(payload: RiskSimulationPayload): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500))

  // Mock simulation result based on simple logic
  const matchedRules = []
  let actions = []

  // Simple simulation - in real app this would be more complex
  for (const rule of mockData.riskRules) {
    if (rule.enabled && rule.status === 'published') {
      // Simple check based on conditions - this would be more complex in reality
      if (
        rule.conditions.some(
          (condition) =>
            payload.data[condition.field] !== undefined &&
            payload.data[condition.field] > (condition.value || 0)
        )
      ) {
        matchedRules.push({
          ruleId: rule.id,
          ruleName: rule.name,
          actions: rule.actions,
        })
        actions = [...actions, ...rule.actions]
      }
    }
  }

  return {
    matched: matchedRules.length > 0,
    matchedRules,
    actions,
    timestamp: new Date().toISOString(),
  }
}
