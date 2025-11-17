/**
 * OpenAPI 3.0 specification for Assets module
 *
 * API documentation and specification for asset management endpoints
 */

import { OpenAPIV3 } from 'openapi3-ts'
import { z } from 'zod'
import { extendZodWithOpenApi } from 'zod-openapi'
import { AssetsValidationSchemas } from '../validation/assets.zod'

// Extend Zod with OpenAPI support
extendZodWithOpenApi(z)

// Define OpenAPI specification for Assets module
export const AssetsOpenAPISpec: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'Assets Management API',
    description: 'API for managing deposits, withdrawals, and wallet addresses',
    version: '1.0.0',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API Server',
    },
  ],
  paths: {
    '/admin/assets/deposits': {
      get: {
        summary: 'List deposits',
        description: 'Retrieve a list of deposits with optional filtering and pagination',
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
            description: 'Deposit status filter',
            required: false,
            schema: { type: 'string', enum: ['pending', 'confirming', 'completed', 'failed'] },
          },
          {
            name: 'currency',
            in: 'query',
            description: 'Currency filter',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'chain',
            in: 'query',
            description: 'Chain filter',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'userId',
            in: 'query',
            description: 'User ID filter',
            required: false,
            schema: { type: 'string' },
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
                schema: AssetsValidationSchemas.DepositListResponse.openapi({
                  example: {
                    data: [
                      {
                        id: 'deposit-1',
                        userId: 'user-1',
                        userNickname: 'John Doe',
                        currency: 'BTC',
                        chain: 'Bitcoin',
                        txHash: 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890',
                        amount: '0.5',
                        status: 'completed',
                        confirmations: 6,
                        requiredConfirmations: 6,
                        riskFlags: [],
                        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                        createdAt: '2023-01-01T10:00:00Z',
                        completedAt: '2023-01-01T10:05:00Z',
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
    },
    '/admin/assets/withdrawals': {
      get: {
        summary: 'List withdrawals',
        description: 'Retrieve a list of withdrawals with optional filtering and pagination',
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
            description: 'Withdrawal status filter',
            required: false,
            schema: {
              type: 'string',
              enum: ['pending', 'reviewing', 'approved', 'processing', 'completed', 'rejected'],
            },
          },
          {
            name: 'currency',
            in: 'query',
            description: 'Currency filter',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'chain',
            in: 'query',
            description: 'Chain filter',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'userId',
            in: 'query',
            description: 'User ID filter',
            required: false,
            schema: { type: 'string' },
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
                schema: AssetsValidationSchemas.WithdrawalListResponse.openapi({
                  example: {
                    data: [
                      {
                        id: 'withdrawal-1',
                        userId: 'user-1',
                        userNickname: 'John Doe',
                        currency: 'BTC',
                        chain: 'Bitcoin',
                        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                        amount: '0.1',
                        fee: '0.001',
                        status: 'completed',
                        riskScore: 0,
                        matchedRules: [],
                        approvals: [],
                        txHash: 'f0e9d8c7b6a59483726150394857615039485761503948576150394857615039',
                        createdAt: '2023-01-02T14:30:00Z',
                        completedAt: '2023-01-02T14:35:00Z',
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
    },
    '/admin/assets/wallets': {
      get: {
        summary: 'List wallet addresses',
        description: 'Retrieve a list of wallet addresses with optional filtering and pagination',
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
            description: 'Wallet type filter',
            required: false,
            schema: { type: 'string', enum: ['hot', 'cold'] },
          },
          {
            name: 'chain',
            in: 'query',
            description: 'Chain filter',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'status',
            in: 'query',
            description: 'Wallet status filter',
            required: false,
            schema: { type: 'string', enum: ['active', 'inactive', 'maintenance'] },
          },
          {
            name: 'search',
            in: 'query',
            description: 'Search term',
            required: false,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: AssetsValidationSchemas.WalletAddressListResponse.openapi({
                  example: {
                    data: [
                      {
                        id: 'wallet-1',
                        chain: 'Bitcoin',
                        type: 'hot',
                        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                        label: 'Main BTC Hot Wallet',
                        balance: '10.5',
                        balanceUsd: 525000,
                        status: 'active',
                        createdAt: '2023-01-01T00:00:00Z',
                        lastSyncAt: '2023-01-15T12:00:00Z',
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
        summary: 'Create wallet address',
        description: 'Create a new wallet address',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: AssetsValidationSchemas.CreateWalletAddressPayload.openapi({
                example: {
                  chain: 'Bitcoin',
                  address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                  label: 'New BTC Wallet',
                  type: 'hot',
                },
              }),
            },
          },
        },
        responses: {
          '200': {
            description: 'Wallet address created successfully',
            content: {
              'application/json': {
                schema: AssetsValidationSchemas.WalletAddress.openapi({
                  example: {
                    id: 'wallet-2',
                    chain: 'Bitcoin',
                    type: 'hot',
                    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                    label: 'New BTC Wallet',
                    balance: '0',
                    balanceUsd: 0,
                    status: 'active',
                    createdAt: '2023-01-15T15:00:00Z',
                    lastSyncAt: '2023-01-15T15:00:00Z',
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
      Deposit: AssetsValidationSchemas.Deposit.openapi({
        example: {
          id: 'deposit-1',
          userId: 'user-1',
          userNickname: 'John Doe',
          currency: 'BTC',
          chain: 'Bitcoin',
          txHash: 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890',
          amount: '0.5',
          status: 'completed',
          confirmations: 6,
          requiredConfirmations: 6,
          riskFlags: [],
          address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          createdAt: '2023-01-01T10:00:00Z',
          completedAt: '2023-01-01T10:05:00Z',
        },
      }),
      Withdrawal: AssetsValidationSchemas.Withdrawal.openapi({
        example: {
          id: 'withdrawal-1',
          userId: 'user-1',
          userNickname: 'John Doe',
          currency: 'BTC',
          chain: 'Bitcoin',
          address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          amount: '0.1',
          fee: '0.001',
          status: 'completed',
          riskScore: 0,
          matchedRules: [],
          approvals: [],
          txHash: 'f0e9d8c7b6a59483726150394857615039485761503948576150394857615039',
          createdAt: '2023-01-02T14:30:00Z',
          completedAt: '2023-01-02T14:35:00Z',
        },
      }),
      WalletAddress: AssetsValidationSchemas.WalletAddress.openapi({
        example: {
          id: 'wallet-1',
          chain: 'Bitcoin',
          type: 'hot',
          address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          label: 'Main BTC Hot Wallet',
          balance: '10.5',
          balanceUsd: 525000,
          status: 'active',
          createdAt: '2023-01-01T00:00:00Z',
          lastSyncAt: '2023-01-15T12:00:00Z',
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
