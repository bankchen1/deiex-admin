/**
 * Base Facade Class
 *
 * Provides standardized patterns for all facade implementations.
 * Handles mock/real mode switching, error handling, and response formatting.
 */

import type { FacadeResponse, PaginationParams, FacadeMeta } from './_types'
import { isMockMode, createSuccessResponse, createErrorResponse } from './_types'

export abstract class BaseFacade {
  protected abstract moduleName: string

  /**
   * Handle a request with automatic mock/real mode switching
   */
  protected async handleRequest<T>(
    requestFn: () => Promise<T>,
    mockFn: () => Promise<T>
  ): Promise<FacadeResponse<T>> {
    try {
      const result = isMockMode() ? await mockFn() : await requestFn()
      return createSuccessResponse(result)
    } catch (error) {
      return createErrorResponse(error)
    }
  }

  /**
   * Handle a paginated request with automatic mock/real mode switching
   */
  protected async handlePaginatedRequest<T>(
    requestFn: () => Promise<{ data: T; total: number; page: number; pageSize: number }>,
    mockFn: () => Promise<{ data: T; total: number; page: number; pageSize: number }>,
    page: number,
    pageSize: number
  ): Promise<FacadeResponse<T>> {
    try {
      const result = isMockMode() ? await mockFn() : await requestFn()
      const meta: FacadeMeta = {
        pagination: {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
          totalPages: Math.ceil(result.total / result.pageSize),
        },
      }
      return createSuccessResponse(result.data, meta)
    } catch (error) {
      return createErrorResponse(error)
    }
  }

  /**
   * Create pagination metadata
   */
  protected createPaginationMeta(page: number, pageSize: number, total: number): FacadeMeta {
    return {
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }

  /**
   * Delay execution for mock mode to simulate network latency
   */
  protected async mockDelay(minMs: number = 200, maxMs: number = 700): Promise<void> {
    if (isMockMode()) {
      const delay = Math.random() * (maxMs - minMs) + minMs
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}
