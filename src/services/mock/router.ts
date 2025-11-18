/**
 * Mock Router
 *
 * Sophisticated routing mechanism for mock service handlers.
 */

import type { AxiosRequestConfig } from 'axios'
import type { MockResponse } from './index'

export interface MockRouteHandler {
  pattern: RegExp
  method: string
  handler: (
    url: string,
    method: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => MockResponse | null
}

export class MockRouter {
  private routes: MockRouteHandler[] = []

  /**
   * Add a route handler
   */
  addRoute(pattern: RegExp, method: string, handler: MockRouteHandler['handler']) {
    this.routes.push({ pattern, method, handler })
  }

  /**
   * Handle a request by matching against registered routes
   */
  handle(
    url: string,
    method: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): MockResponse | null {
    // Sort routes by specificity (more specific patterns first)
    const sortedRoutes = [...this.routes].sort((a, b) => {
      // More specific patterns (longer strings) should match first
      return b.pattern.toString().length - a.pattern.toString().length
    })

    for (const route of sortedRoutes) {
      if (route.method.toLowerCase() === method.toLowerCase() && route.pattern.test(url)) {
        return route.handler(url, method, data, config)
      }
    }
    return null
  }

  /**
   * Remove all routes
   */
  clearRoutes() {
    this.routes = []
  }

  /**
   * Get the number of registered routes
   */
  getRouteCount(): number {
    return this.routes.length
  }
}
