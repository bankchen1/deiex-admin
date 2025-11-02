import { ref, shallowRef, type Component } from 'vue'

/**
 * Composable for lazy loading heavy components (modals, drawers, etc.)
 * This improves initial page load by deferring component loading until needed
 */
export function useLazyComponent(loader: () => Promise<any>) {
  const component = shallowRef<Component | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  const loadComponent = async () => {
    if (loaded.value) {
      return component.value
    }

    loading.value = true
    error.value = null

    try {
      const module = await loader()
      component.value = module.default || module
      loaded.value = true
      loading.value = false
      return component.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load component'
      loading.value = false
      console.error('Failed to load component:', e)
      throw e
    }
  }

  return {
    component,
    loading,
    error,
    loaded,
    loadComponent,
  }
}

/**
 * Helper function to create a lazy-loaded modal/drawer wrapper
 */
export function createLazyModal(loader: () => Promise<any>) {
  return {
    setup() {
      const { component, loading, loadComponent } = useLazyComponent(loader)
      const visible = ref(false)

      const show = async () => {
        if (!component.value) {
          await loadComponent()
        }
        visible.value = true
      }

      const hide = () => {
        visible.value = false
      }

      return {
        component,
        loading,
        visible,
        show,
        hide,
      }
    },
  }
}
