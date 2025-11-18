/**
 * Mock Data Store
 *
 * Centralized storage and management for mock data across all modules.
 */

export class MockDataStore {
  private data: Map<string, any[]> = new Map()

  /**
   * Set a collection of items
   */
  setCollection<T>(key: string, items: T[]): void {
    this.data.set(key, items as any[])
  }

  /**
   * Get a collection of items
   */
  getCollection<T>(key: string): T[] {
    return (this.data.get(key) || []) as T[]
  }

  /**
   * Get a single item by ID
   */
  getItem<T>(key: string, id: string): T | undefined {
    const collection = this.data.get(key) || []
    return collection.find((item: any) => item.id === id)
  }

  /**
   * Add an item to a collection
   */
  addItem<T>(key: string, item: T): void {
    const collection = this.data.get(key) || []
    collection.push(item)
    this.data.set(key, collection)
  }

  /**
   * Update an item in a collection
   */
  updateItem<T>(key: string, id: string, updates: Partial<T>): T | undefined {
    const collection = this.data.get(key) || []
    const index = collection.findIndex((item: any) => item.id === id)
    if (index !== -1) {
      collection[index] = { ...collection[index], ...updates }
      this.data.set(key, collection)
      return collection[index]
    }
    return undefined
  }

  /**
   * Delete an item from a collection
   */
  deleteItem<T>(key: string, id: string): boolean {
    const collection = this.data.get(key) || []
    const index = collection.findIndex((item: any) => item.id === id)
    if (index !== -1) {
      collection.splice(index, 1)
      this.data.set(key, collection)
      return true
    }
    return false
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.data.clear()
  }

  /**
   * Get the size of a collection
   */
  getSize(key: string): number {
    return (this.data.get(key) || []).length
  }

  /**
   * Check if a collection exists
   */
  hasCollection(key: string): boolean {
    return this.data.has(key)
  }
}

export const mockDataStore = new MockDataStore()
