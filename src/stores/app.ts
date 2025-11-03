// App Store
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { PageTab } from '@/types'

const MAX_TABS = 8

export const useAppStore = defineStore('app', () => {
  // Load initial state from localStorage
  const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  }

  // State
  const collapsed = ref(loadFromStorage('sidebar_collapsed', false))
  const theme = ref<'light' | 'dark'>(loadFromStorage('theme', 'light'))
  const locale = ref(loadFromStorage('locale', 'en'))
  const environment = ref<'production' | 'staging' | 'development'>(
    (import.meta.env.VITE_ENV as any) || 'development'
  )
  const cachedViews = ref<string[]>([])
  const visitedViews = ref<PageTab[]>(loadFromStorage('visited_views', []))

  // Watch and persist state changes
  watch(collapsed, (value) => {
    localStorage.setItem('sidebar_collapsed', JSON.stringify(value))
  })

  watch(theme, (value) => {
    localStorage.setItem('theme', JSON.stringify(value))
    // Apply theme class to document
    document.documentElement.setAttribute('data-theme', value)
  })

  watch(locale, (value) => {
    localStorage.setItem('locale', JSON.stringify(value))
  })

  watch(
    visitedViews,
    (value) => {
      localStorage.setItem('visited_views', JSON.stringify(value))
    },
    { deep: true }
  )

  // Actions
  function toggleSidebar() {
    collapsed.value = !collapsed.value
  }

  function setSidebarCollapsed(value: boolean) {
    collapsed.value = value
  }

  function setTheme(newTheme: 'light' | 'dark') {
    theme.value = newTheme
  }

  function setLocale(newLocale: string) {
    locale.value = newLocale
  }

  function addCachedView(viewName: string) {
    if (!cachedViews.value.includes(viewName)) {
      cachedViews.value.push(viewName)
    }
  }

  function removeCachedView(viewName: string) {
    const index = cachedViews.value.indexOf(viewName)
    if (index > -1) {
      cachedViews.value.splice(index, 1)
    }
  }

  function clearCachedViews() {
    cachedViews.value = []
  }

  function addVisitedView(view: PageTab) {
    // Check if view already exists
    if (visitedViews.value.some((v) => v.path === view.path)) return

    // Enforce max tabs limit
    if (visitedViews.value.length >= MAX_TABS) {
      // Remove the oldest closable tab
      const closableIndex = visitedViews.value.findIndex((v) => v.closable !== false)
      if (closableIndex !== -1) {
        visitedViews.value.splice(closableIndex, 1)
      }
    }

    visitedViews.value.push(view)
  }

  function removeVisitedView(path: string) {
    const index = visitedViews.value.findIndex((v) => v.path === path)
    if (index > -1) {
      const view = visitedViews.value[index]
      // Only remove if closable
      if (view && view.closable !== false) {
        visitedViews.value.splice(index, 1)
        // Also remove from cached views
        if (view.name) {
          removeCachedView(view.name)
        }
      }
    }
  }

  function removeOtherVisitedViews(path: string) {
    visitedViews.value = visitedViews.value.filter((v) => v.path === path || v.closable === false)
  }

  function removeAllVisitedViews() {
    visitedViews.value = visitedViews.value.filter((v) => v.closable === false)
    clearCachedViews()
  }

  function closeOtherViews(path: string) {
    visitedViews.value = visitedViews.value.filter((v) => v.path === path || v.closable === false)
  }

  function closeLeftViews(index: number) {
    visitedViews.value = visitedViews.value.filter((v, i) => i >= index || v.closable === false)
  }

  function closeRightViews(index: number) {
    visitedViews.value = visitedViews.value.filter((v, i) => i <= index || v.closable === false)
  }

  function closeAllViews() {
    visitedViews.value = visitedViews.value.filter((v) => v.closable === false)
    clearCachedViews()
  }

  function clearVisitedViews() {
    visitedViews.value = []
    clearCachedViews()
  }

  function updateVisitedView(path: string, updates: Partial<PageTab>) {
    const index = visitedViews.value.findIndex((v) => v.path === path)
    if (index > -1) {
      const currentView = visitedViews.value[index]
      if (currentView) {
        visitedViews.value[index] = { ...currentView, ...updates }
      }
    }
  }

  // Initialize theme on load
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  return {
    // State
    collapsed,
    theme,
    locale,
    environment,
    cachedViews,
    visitedViews,
    // Actions
    toggleSidebar,
    setSidebarCollapsed,
    setTheme,
    setLocale,
    addCachedView,
    removeCachedView,
    clearCachedViews,
    addVisitedView,
    removeVisitedView,
    removeOtherVisitedViews,
    removeAllVisitedViews,
    clearVisitedViews,
    updateVisitedView,
    closeOtherViews,
    closeLeftViews,
    closeRightViews,
    closeAllViews,
  }
})
