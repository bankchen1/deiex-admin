/**
 * OpenAPI 3.0 specification for Risk module
 *
 * API documentation and specification for risk management endpoints
 */

import { OpenAPIV3 } from 'openapi3-ts'
import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'
import { RiskValidationSchemas } from '../validation/risk.zod'

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z)

// Define OpenAPI specification for Risk module
export const RiskOpenAPISpec: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'Risk Management API',
    description: 'API for managing risk rules, limits, and blacklist entries',
    version: '1.0.0',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API Server',
    },
  ],
  paths: {
    '/admin/risk/rules': {
      get: {
        summary: 'List risk rules',
        description: 'Retrieve a list of risk rules with optional filtering and pagination',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number',
            required: false,
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'Number of items per page',
            required: false,
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          },
          {
            name: 'sortField',
            in: 'query',
            description: 'Field to sort by',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'sortOrder',
            in: 'query',
            description: 'Sort order',
            required: false,
            schema: { type: 'string', enum: ['asc', 'desc'] },
          },
          {
            name: 'status',
            in: 'query',
            description: 'Rule status filter',
            required: false,
            schema: { type: 'string', enum: ['draft', 'published'] },
          },
          {
            name: 'enabled',
            in: 'query',
            description: 'Rule enabled filter',
            required: false,
            schema: { type: 'boolean' },
          },
          {
            name: 'search',
            in: 'query',
            description: 'Search term',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'startDate',
            in: 'query',
            description: 'Start date filter',
            required: false,
            schema: { type: 'string', format: 'date-time' },
          },
          {
            name: 'endDate',
            in: 'query',
            description: 'End date filter',
            required: false,
            schema: { type: 'string', format: 'date-time' },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: RiskValidationSchemas.RiskRuleListResponse.openapi({
                  example: {
                    data: [
                      {
                        id: 'rule-1',
                        name: 'High Value Transaction',
                        description: 'Flag transactions over $10,000',
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
                            params: {},
                          },
                        ],
                        priority: 1,
                        enabled: true,
                        status: 'published',
                        version: '1.0',
                        createdAt: '2023-01-01T00:00:00Z',
                        updatedAt: '2023-01-01T00:00:00Z',
                        matchCount: 42,
                        lastMatchedAt: '2023-01-15T10:30:00Z',
                      },
                    ],
                    total: 1,
                    page: 1,
                    pageSize: 10,
                  },
                }),
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      post: {
        summary: 'Create risk rule',
        description: 'Create a new risk rule',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: RiskValidationSchemas.CreateRiskRulePayload.openapi({
                example: {
                  name: 'New Risk Rule',
                  description: 'Description of the new rule',
                  conditions: [
                    {
                      field: 'amount',
                      operator: 'gt',
                      value: 5000,
                    },
                  ],
                  actions: [
                    {
                      type: 'alert',
                      params: {
                        recipient: 'risk-team@example.com',
                      },
                    },
                  ],
                  priority: 2,
                  enabled: true,
                },
              }),
            },
          },
        },
        responses: {
          '200': {
            description: 'Risk rule created successfully',
            content: {
              'application/json': {
                schema: RiskValidationSchemas.RiskRule.openapi({
                  example: {
                    id: 'rule-2',
                    name: 'New Risk Rule',
                    description: 'Description of the new rule',
                    conditions: [
                      {
                        field: 'amount',
                        operator: 'gt',
                        value: 5000,
                      },
                    ],
                    actions: [
                      {
                        type: 'alert',
                        params: {
                          recipient: 'risk-team@example.com',
                        },
                      },
                    ],
                    priority: 2,
                    enabled: true,
                    status: 'draft',
                    version: '1.0',
                    createdAt: '2023-01-15T15:00:00Z',
                    updatedAt: '2023-01-15T15:00:00Z',
                  },
                }),
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/admin/risk/rules/{id}': {
      get: {
        summary: 'Get risk rule by ID',
        description: 'Retrieve detailed information about a specific risk rule',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Rule ID',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: RiskValidationSchemas.RiskRuleDetailResponse.openapi({
                  example: {
                    rule: {
                      id: 'rule-1',
                      name: 'High Value Transaction',
                      description: 'Flag transactions over $10,000',
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
                          params: {},
                        },
                      ],
                      priority: 1,
                      enabled: true,
                      status: 'published',
                      version: '1.0',
                      createdAt: '2023-01-01T00:00:00Z',
                      updatedAt: '2023-01-01T00:00:00Z',
                      matchCount: 42,
                      lastMatchedAt: '2023-01-15T10:30:00Z',
                    },
                  },
                }),
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      put: {
        summary: 'Update risk rule',
        description: 'Update an existing risk rule',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Rule ID',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: RiskValidationSchemas.UpdateRiskRulePayload.openapi({
                example: {
                  name: 'Updated Risk Rule',
                  description: 'Updated description',
                  enabled: false,
                },
              }),
            },
          },
        },
        responses: {
          '200': {
            description: 'Risk rule updated successfully',
            content: {
              'application/json': {
                schema: RiskValidationSchemas.RiskRule.openapi({
                  example: {
                    id: 'rule-1',
                    name: 'Updated Risk Rule',
                    description: 'Updated description',
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
                        params: {},
                      },
                    ],
                    priority: 1,
                    enabled: false,
                    status: 'draft',
                    version: '1.1',
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-15T16:00:00Z',
                  },
                }),
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/admin/risk/limits': {
      get: {
        summary: 'List risk limits',
        description: 'Retrieve a list of risk limits with optional filtering and pagination',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number',
            required: false,
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'Number of items per page',
            required: false,
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          },
          {
            name: 'sortField',
            in: 'query',
            description: 'Field to sort by',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'sortOrder',
            in: 'query',
            description: 'Sort order',
            required: false,
            schema: { type: 'string', enum: ['asc', 'desc'] },
          },
          {
            name: 'type',
            in: 'query',
            description: 'Limit type filter',
            required: false,
            schema: { type: 'string', enum: ['deposit', 'withdrawal', 'trading', 'position'] },
          },
          {
            name: 'scope',
            in: 'query',
            description: 'Limit scope filter',
            required: false,
            schema: { type: 'string', enum: ['user', 'country', 'device', 'currency'] },
          },
          {
            name: 'enabled',
            in: 'query',
            description: 'Limit enabled filter',
            required: false,
            schema: { type: 'boolean' },
          },
          {
            name: 'search',
            in: 'query',
            description: 'Search term',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'startDate',
            in: 'query',
            description: 'Start date filter',
            required: false,
            schema: { type: 'string', format: 'date-time' },
          },
          {
            name: 'endDate',
            in: 'query',
            description: 'End date filter',
            required: false,
            schema: { type: 'string', format: 'date-time' },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: RiskValidationSchemas.RiskLimitListResponse.openapi({
                  example: {
                    data: [
                      {
                        id: 'limit-1',
                        name: 'Daily Withdrawal Limit',
                        description: 'Maximum daily withdrawal amount per user',
                        scope: 'user',
                        type: 'withdrawal',
                        period: 'daily',
                        threshold: '10000',
                        currency: 'USD',
                        enabled: true,
                        createdAt: '2023-01-01T00:00:00Z',
                        updatedAt: '2023-01-01T00:00:00Z',
                        currentUsage: '7500',
                        usagePercentage: 75,
                      },
                    ],
                    total: 1,
                    page: 1,
                    pageSize: 10,
                  },
                }),
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      post: {
        summary: 'Create risk limit',
        description: 'Create a new risk limit',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: RiskValidationSchemas.CreateRiskLimitPayload.openapi({
                example: {
                  name: 'New Risk Limit',
                  description: 'Description of the new limit',
                  scope: 'user',
                  type: 'trading',
                  period: 'daily',
                  threshold: '50000',
                  currency: 'USD',
                  enabled: true,
                },
              }),
            },
          },
        },
        responses: {
          '200': {
            description: 'Risk limit created successfully',
            content: {
              'application/json': {
                schema: RiskValidationSchemas.RiskLimit.openapi({
                  example: {
                    id: 'limit-2',
                    name: 'New Risk Limit',
                    description: 'Description of the new limit',
                    scope: 'user',
                    type: 'trading',
                    period: 'daily',
                    threshold: '50000',
                    currency: 'USD',
                    enabled: true,
                    createdAt: '2023-01-15T15:30:00Z',
                    updatedAt: '2023-01-15T15:30:00Z',
                  },
                }),
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/admin/risk/blacklist': {
      get: {
        summary: 'List blacklist entries',
        description: 'Retrieve a list of blacklist entries with optional filtering and pagination',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number',
            required: false,
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'pageSize',
            in: 'query',
            description: 'Number of items per page',
            required: false,
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          },
          {
            name: 'sortField',
            in: 'query',
            description: 'Field to sort by',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'sortOrder',
            in: 'query',
            description: 'Sort order',
            required: false,
            schema: { type: 'string', enum: ['asc', 'desc'] },
          },
          {
            name: 'type',
            in: 'query',
            description: 'Entry type filter',
            required: false,
            schema: {
              type: 'string',
              enum: ['address', 'device', 'ip', 'country', 'email', 'phone'],
            },
          },
          {
            name: 'status',
            in: 'query',
            description: 'Entry status filter',
            required: false,
            schema: { type: 'string', enum: ['active', 'expired', 'removed'] },
          },
          {
            name: 'source',
            in: 'query',
            description: 'Entry source filter',
            required: false,
            schema: { type: 'string', enum: ['manual', 'auto', 'import'] },
          },
          {
            name: 'search',
            in: 'query',
            description: 'Search term',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'startDate',
            in: 'query',
            description: 'Start date filter',
            required: false,
            schema: { type: 'string', format: 'date-time' },
          },
          {
            name: 'endDate',
            in: 'query',
            description: 'End date filter',
            required: false,
            schema: { type: 'string', format: 'date-time' },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: RiskValidationSchemas.BlacklistEntryListResponse.openapi({
                  example: {
                    data: [
                      {
                        id: 'blacklist-1',
                        type: 'ip',
                        value: '192.168.1.100',
                        reason: 'Suspicious activity',
                        source: 'manual',
                        status: 'active',
                        addedBy: 'admin@example.com',
                        addedAt: '2023-01-01T00:00:00Z',
                        matchCount: 5,
                        lastMatchedAt: '2023-01-15T10:00:00Z',
                      },
                    ],
                    total: 1,
                    page: 1,
                    pageSize: 10,
                  },
                }),
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      post: {
        summary: 'Create blacklist entry',
        description: 'Add a new entry to the blacklist',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: RiskValidationSchemas.CreateBlacklistEntryPayload.openapi({
                example: {
                  type: 'address',
                  value: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                  reason: 'Known fraudulent address',
                  source: 'manual',
                },
              }),
            },
          },
        },
        responses: {
          '200': {
            description: 'Blacklist entry created successfully',
            content: {
              'application/json': {
                schema: RiskValidationSchemas.BlacklistEntry.openapi({
                  example: {
                    id: 'blacklist-2',
                    type: 'address',
                    value: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                    reason: 'Known fraudulent address',
                    source: 'manual',
                    status: 'active',
                    addedBy: 'admin@example.com',
                    addedAt: '2023-01-15T15:45:00Z',
                  },
                }),
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
  },
  components: {
    schemas: {
      RiskRule: RiskValidationSchemas.RiskRule.openapi({
        example: {
          id: 'rule-1',
          name: 'High Value Transaction',
          description: 'Flag transactions over $10,000',
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
              params: {},
            },
          ],
          priority: 1,
          enabled: true,
          status: 'published',
          version: '1.0',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          matchCount: 42,
          lastMatchedAt: '2023-01-15T10:30:00Z',
        },
      }),
      RiskLimit: RiskValidationSchemas.RiskLimit.openapi({
        example: {
          id: 'limit-1',
          name: 'Daily Withdrawal Limit',
          description: 'Maximum daily withdrawal amount per user',
          scope: 'user',
          type: 'withdrawal',
          period: 'daily',
          threshold: '10000',
          currency: 'USD',
          enabled: true,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          currentUsage: '7500',
          usagePercentage: 75,
        },
      }),
      BlacklistEntry: RiskValidationSchemas.BlacklistEntry.openapi({
        example: {
          id: 'blacklist-1',
          type: 'ip',
          value: '192.168.1.100',
          reason: 'Suspicious activity',
          source: 'manual',
          status: 'active',
          addedBy: 'admin@example.com',
          addedAt: '2023-01-01T00:00:00Z',
          matchCount: 5,
          lastMatchedAt: '2023-01-15T10:00:00Z',
        },
      }),
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
}
