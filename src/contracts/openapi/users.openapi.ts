/**
 * OpenAPI 3.0 specification for Users module
 *
 * API documentation and specification for user management endpoints
 */

import { OpenAPIV3 } from 'openapi3-ts'
import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'
import { UsersValidationSchemas } from './users.zod'

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z)

// Define OpenAPI specification for Users module
export const UsersOpenAPISpec: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'Users Management API',
    description: 'API for managing user accounts, authentication, and user-related data',
    version: '1.0.0',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API Server',
    },
  ],
  paths: {
    '/admin/users': {
      get: {
        summary: 'List users',
        description: 'Retrieve a list of users with optional filtering and pagination',
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
            description: 'User status filter',
            required: false,
            schema: { type: 'string', enum: ['active', 'disabled', 'suspended', 'all'] },
          },
          {
            name: 'vipLevel',
            in: 'query',
            description: 'VIP level filter',
            required: false,
            schema: { type: 'integer', minimum: 0, maximum: 5 },
          },
          {
            name: 'kycStatus',
            in: 'query',
            description: 'KYC status filter',
            required: false,
            schema: { type: 'string', enum: ['none', 'pending', 'approved', 'rejected'] },
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
                schema: UsersValidationSchemas.UserListResponse.openapi({
                  example: {
                    data: [
                      {
                        id: 'user-1',
                        nickname: 'John Doe',
                        email: 'john@example.com',
                        phone: '+1234567890',
                        kycStatus: 'approved',
                        vipLevel: 2,
                        riskTags: ['high-value'],
                        assetSnapshot: {
                          totalUsd: 10000,
                          availableUsd: 8000,
                          frozenUsd: 2000,
                          currencies: {
                            BTC: {
                              currency: 'BTC',
                              available: '0.5',
                              frozen: '0.1',
                              usdValue: 5000,
                            },
                          },
                        },
                        createdAt: '2023-01-01T00:00:00Z',
                        lastLoginAt: '2023-01-15T10:30:00Z',
                        status: 'active',
                        country: 'US',
                        twoFactorEnabled: true,
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
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Invalid query parameters',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Authentication required',
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'Internal server error',
                    },
                  },
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/admin/users/{id}': {
      get: {
        summary: 'Get user by ID',
        description: 'Retrieve detailed information about a specific user',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'User ID',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: UsersValidationSchemas.UserDetailResponse.openapi({
                  example: {
                    user: {
                      id: 'user-1',
                      nickname: 'John Doe',
                      email: 'john@example.com',
                      phone: '+1234567890',
                      kycStatus: 'approved',
                      vipLevel: 2,
                      riskTags: ['high-value'],
                      assetSnapshot: {
                        totalUsd: 10000,
                        availableUsd: 8000,
                        frozenUsd: 2000,
                        currencies: {
                          BTC: {
                            currency: 'BTC',
                            available: '0.5',
                            frozen: '0.1',
                            usdValue: 5000,
                          },
                        },
                      },
                      createdAt: '2023-01-01T00:00:00Z',
                      lastLoginAt: '2023-01-15T10:30:00Z',
                      status: 'active',
                      country: 'US',
                      twoFactorEnabled: true,
                    },
                    loginRecords: [
                      {
                        id: 'login-1',
                        userId: 'user-1',
                        ip: '192.168.1.1',
                        location: 'New York, US',
                        device: 'Chrome on Windows',
                        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        timestamp: '2023-01-15T10:30:00Z',
                        success: true,
                      },
                    ],
                  },
                }),
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'User not found',
                    },
                  },
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/admin/users/stats': {
      get: {
        summary: 'Get user statistics',
        description: 'Retrieve statistics about users',
        parameters: [
          {
            name: 'startDate',
            in: 'query',
            description: 'Start date for statistics',
            required: false,
            schema: { type: 'string', format: 'date-time' },
          },
          {
            name: 'endDate',
            in: 'query',
            description: 'End date for statistics',
            required: false,
            schema: { type: 'string', format: 'date-time' },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: UsersValidationSchemas.UserStats.openapi({
                  example: {
                    total: 1000,
                    active: 850,
                    disabled: 50,
                    suspended: 100,
                    todayRegistrations: 25,
                    kycPending: 75,
                    kycApproved: 600,
                  },
                }),
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/admin/users/{id}/vip': {
      post: {
        summary: 'Update user VIP level',
        description: 'Update the VIP level of a user',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'User ID',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: UsersValidationSchemas.UserVipUpdatePayload.openapi({
                example: {
                  vipLevel: 3,
                  reason: 'High trading volume',
                  notes: 'User has consistently high trading activity',
                },
              }),
            },
          },
        },
        responses: {
          '200': {
            description: 'VIP level updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'VIP level updated successfully' },
                  },
                },
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
      User: UsersValidationSchemas.User.openapi({
        example: {
          id: 'user-1',
          nickname: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          kycStatus: 'approved',
          vipLevel: 2,
          riskTags: ['high-value'],
          assetSnapshot: {
            totalUsd: 10000,
            availableUsd: 8000,
            frozenUsd: 2000,
            currencies: {
              BTC: {
                currency: 'BTC',
                available: '0.5',
                frozen: '0.1',
                usdValue: 5000,
              },
            },
          },
          createdAt: '2023-01-01T00:00:00Z',
          lastLoginAt: '2023-01-15T10:30:00Z',
          status: 'active',
          country: 'US',
          twoFactorEnabled: true,
        },
      }),
      UserListResponse: UsersValidationSchemas.UserListResponse.openapi({
        example: {
          data: [
            {
              id: 'user-1',
              nickname: 'John Doe',
              email: 'john@example.com',
              phone: '+1234567890',
              kycStatus: 'approved',
              vipLevel: 2,
              riskTags: ['high-value'],
              assetSnapshot: {
                totalUsd: 10000,
                availableUsd: 8000,
                frozenUsd: 2000,
                currencies: {
                  BTC: {
                    currency: 'BTC',
                    available: '0.5',
                    frozen: '0.1',
                    usdValue: 5000,
                  },
                },
              },
              createdAt: '2023-01-01T00:00:00Z',
              lastLoginAt: '2023-01-15T10:30:00Z',
              status: 'active',
              country: 'US',
              twoFactorEnabled: true,
            },
          ],
          total: 1,
          page: 1,
          pageSize: 10,
        },
      }),
      UserDetailResponse: UsersValidationSchemas.UserDetailResponse.openapi({
        example: {
          user: {
            id: 'user-1',
            nickname: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            kycStatus: 'approved',
            vipLevel: 2,
            riskTags: ['high-value'],
            assetSnapshot: {
              totalUsd: 10000,
              availableUsd: 8000,
              frozenUsd: 2000,
              currencies: {
                BTC: {
                  currency: 'BTC',
                  available: '0.5',
                  frozen: '0.1',
                  usdValue: 5000,
                },
              },
            },
            createdAt: '2023-01-01T00:00:00Z',
            lastLoginAt: '2023-01-15T10:30:00Z',
            status: 'active',
            country: 'US',
            twoFactorEnabled: true,
          },
          loginRecords: [
            {
              id: 'login-1',
              userId: 'user-1',
              ip: '192.168.1.1',
              location: 'New York, US',
              device: 'Chrome on Windows',
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              timestamp: '2023-01-15T10:30:00Z',
              success: true,
            },
          ],
        },
      }),
      UserStats: UsersValidationSchemas.UserStats.openapi({
        example: {
          total: 1000,
          active: 850,
          disabled: 50,
          suspended: 100,
          todayRegistrations: 25,
          kycPending: 75,
          kycApproved: 600,
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
