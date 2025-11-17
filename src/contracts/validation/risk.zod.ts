/**
 * Zod schemas for Risk module validation
 *
 * Runtime validation schemas for risk data entities
 */

import { z } from 'zod'

// Risk condition entity schema
export const RiskConditionSchema = z.object({
  field: z.string(),
  operator: z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'contains']),
  value: z.any(),
})

// Risk action entity schema
export const RiskActionSchema = z.object({
  type: z.enum(['block', 'review', 'alert', 'tag']),
  params: z.record(z.string(), z.any()),
})

// Risk rule entity schema
export const RiskRuleSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  conditions: z.array(RiskConditionSchema),
  actions: z.array(RiskActionSchema),
  priority: z.number(),
  enabled: z.boolean(),
  status: z.enum(['draft', 'published']),
  version: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().optional(),
  matchCount: z.number().optional(),
  lastMatchedAt: z.string().datetime().optional(),
})

// Risk limit entity schema
export const RiskLimitSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  scope: z.enum(['user', 'country', 'device', 'currency']),
  scopeValue: z.string().optional(),
  type: z.enum(['deposit', 'withdrawal', 'trading', 'position']),
  period: z.enum(['daily', 'weekly', 'monthly', 'lifetime']),
  threshold: z.string(),
  currency: z.string().optional(),
  enabled: z.boolean(),
  effectiveFrom: z.string().datetime().optional(),
  effectiveTo: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().optional(),
  currentUsage: z.string().optional(),
  usagePercentage: z.number().optional(),
})

// Blacklist entry entity schema
export const BlacklistEntrySchema = z.object({
  id: z.string(),
  type: z.enum(['address', 'device', 'ip', 'country', 'email', 'phone']),
  value: z.string(),
  reason: z.string().min(1),
  source: z.enum(['manual', 'auto', 'import']),
  status: z.enum(['active', 'expired', 'removed']),
  addedBy: z.string().optional(),
  addedAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  removedAt: z.string().datetime().optional(),
  removedBy: z.string().optional(),
  notes: z.string().optional(),
  matchCount: z.number().optional(),
  lastMatchedAt: z.string().datetime().optional(),
})

// Risk simulation result schema
export const RiskSimulationResultSchema = z.object({
  matched: z.boolean(),
  matchedRules: z.array(
    z.object({
      ruleId: z.string(),
      ruleName: z.string(),
      actions: z.array(RiskActionSchema),
    })
  ),
  actions: z.array(RiskActionSchema),
  timestamp: z.string().datetime(),
})

// Risk rule list response schema
export const RiskRuleListResponseSchema = z.object({
  data: z.array(RiskRuleSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})

// Risk limit list response schema
export const RiskLimitListResponseSchema = z.object({
  data: z.array(RiskLimitSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})

// Blacklist entry list response schema
export const BlacklistEntryListResponseSchema = z.object({
  data: z.array(BlacklistEntrySchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})

// Risk rule detail response schema
export const RiskRuleDetailResponseSchema = z.object({
  rule: RiskRuleSchema,
  auditTrail: z.array(z.any()).optional(),
})

// Risk limit detail response schema
export const RiskLimitDetailResponseSchema = z.object({
  limit: RiskLimitSchema,
  auditTrail: z.array(z.any()).optional(),
})

// Blacklist entry detail response schema
export const BlacklistEntryDetailResponseSchema = z.object({
  entry: BlacklistEntrySchema,
  auditTrail: z.array(z.any()).optional(),
})

// Risk rule query parameters schema
export const RiskRuleQueryParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  sortField: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  status: z.enum(['draft', 'published']).optional(),
  enabled: z.boolean().optional(),
  search: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Risk limit query parameters schema
export const RiskLimitQueryParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  sortField: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  type: z.enum(['deposit', 'withdrawal', 'trading', 'position']).optional(),
  scope: z.enum(['user', 'country', 'device', 'currency']).optional(),
  enabled: z.boolean().optional(),
  search: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Blacklist entry query parameters schema
export const BlacklistEntryQueryParamsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  sortField: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  type: z.enum(['address', 'device', 'ip', 'country', 'email', 'phone']).optional(),
  status: z.enum(['active', 'expired', 'removed']).optional(),
  source: z.enum(['manual', 'auto', 'import']).optional(),
  search: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Create risk rule payload schema
export const CreateRiskRulePayloadSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  conditions: z.array(RiskConditionSchema),
  actions: z.array(RiskActionSchema),
  priority: z.number().optional(),
  enabled: z.boolean().optional(),
})

// Update risk rule payload schema
export const UpdateRiskRulePayloadSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  conditions: z.array(RiskConditionSchema).optional(),
  actions: z.array(RiskActionSchema).optional(),
  priority: z.number().optional(),
  enabled: z.boolean().optional(),
})

// Create risk limit payload schema
export const CreateRiskLimitPayloadSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  scope: z.enum(['user', 'country', 'device', 'currency']),
  scopeValue: z.string().optional(),
  type: z.enum(['deposit', 'withdrawal', 'trading', 'position']),
  period: z.enum(['daily', 'weekly', 'monthly', 'lifetime']),
  threshold: z.string(),
  currency: z.string().optional(),
  enabled: z.boolean().optional(),
  effectiveFrom: z.string().datetime().optional(),
  effectiveTo: z.string().datetime().optional(),
})

// Update risk limit payload schema
export const UpdateRiskLimitPayloadSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  scope: z.enum(['user', 'country', 'device', 'currency']).optional(),
  scopeValue: z.string().optional(),
  type: z.enum(['deposit', 'withdrawal', 'trading', 'position']).optional(),
  period: z.enum(['daily', 'weekly', 'monthly', 'lifetime']).optional(),
  threshold: z.string().optional(),
  currency: z.string().optional(),
  enabled: z.boolean().optional(),
  effectiveFrom: z.string().datetime().optional(),
  effectiveTo: z.string().datetime().optional(),
})

// Create blacklist entry payload schema
export const CreateBlacklistEntryPayloadSchema = z.object({
  type: z.enum(['address', 'device', 'ip', 'country', 'email', 'phone']),
  value: z.string().min(1),
  reason: z.string().min(1),
  source: z.enum(['manual', 'auto', 'import']).optional(),
  expiresAt: z.string().datetime().optional(),
  notes: z.string().optional(),
})

// Update blacklist entry payload schema
export const UpdateBlacklistEntryPayloadSchema = z.object({
  reason: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  notes: z.string().optional(),
})

// Risk simulation payload schema
export const RiskSimulationPayloadSchema = z.object({
  type: z.enum(['user', 'transaction']),
  data: z.record(z.string(), z.any()),
})

// API response wrapper schema
export const RiskApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z
    .object({
      code: z.union([z.number(), z.string()]),
      message: z.string(),
      details: z.any().optional(),
    })
    .optional(),
  meta: z
    .object({
      pagination: z
        .object({
          page: z.number(),
          pageSize: z.number(),
          total: z.number(),
        })
        .optional(),
    })
    .optional(),
})

// Export all schemas
export const RiskValidationSchemas = {
  RiskCondition: RiskConditionSchema,
  RiskAction: RiskActionSchema,
  RiskRule: RiskRuleSchema,
  RiskLimit: RiskLimitSchema,
  BlacklistEntry: BlacklistEntrySchema,
  RiskSimulationResult: RiskSimulationResultSchema,
  RiskRuleListResponse: RiskRuleListResponseSchema,
  RiskLimitListResponse: RiskLimitListResponseSchema,
  BlacklistEntryListResponse: BlacklistEntryListResponseSchema,
  RiskRuleDetailResponse: RiskRuleDetailResponseSchema,
  RiskLimitDetailResponse: RiskLimitDetailResponseSchema,
  BlacklistEntryDetailResponse: BlacklistEntryDetailResponseSchema,
  RiskRuleQueryParams: RiskRuleQueryParamsSchema,
  RiskLimitQueryParams: RiskLimitQueryParamsSchema,
  BlacklistEntryQueryParams: BlacklistEntryQueryParamsSchema,
  CreateRiskRulePayload: CreateRiskRulePayloadSchema,
  UpdateRiskRulePayload: UpdateRiskRulePayloadSchema,
  CreateRiskLimitPayload: CreateRiskLimitPayloadSchema,
  UpdateRiskLimitPayload: UpdateRiskLimitPayloadSchema,
  CreateBlacklistEntryPayload: CreateBlacklistEntryPayloadSchema,
  UpdateBlacklistEntryPayload: UpdateBlacklistEntryPayloadSchema,
  RiskSimulationPayload: RiskSimulationPayloadSchema,
  ApiResponse: RiskApiResponseSchema,
}
