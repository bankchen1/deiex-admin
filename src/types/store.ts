// Store State Types

export interface AuthState {
  token: string | null
  refreshToken: string | null
  user: import('./models').AdminUser | null
  permissions: Set<string>
  isAuthenticated: boolean
}

export interface AppState {
  collapsed: boolean
  theme: 'light' | 'dark'
  locale: string
  environment: 'production' | 'staging' | 'development'
  cachedViews: string[]
  visitedViews: PageTab[]
}

export interface PageTab {
  name: string
  path: string
  title: string
  closable: boolean
}
