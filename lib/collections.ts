// Collection management utilities

export interface Collection {
  id: number
  name: string
  description: string
  restaurantCount: number
  isPrivate: boolean
  createdAt: string
  coverImage: string
  tags: string[]
  restaurantIds: number[]
}

export interface SavedRestaurant {
  id: number
  name: string
  cuisine: string
  rating: number
  priceLevel: number
  distance: string
  image: string
  summary: string
  savedAt: string
  tags: string[]
  collections: string[]
}

export class CollectionManager {
  private collections: Collection[] = []
  private savedRestaurants: SavedRestaurant[] = []

  constructor() {
    // Load from localStorage in a real app
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const collections = localStorage.getItem("tastetrail-collections")
      const restaurants = localStorage.getItem("tastetrail-saved-restaurants")

      if (collections) {
        this.collections = JSON.parse(collections)
      }

      if (restaurants) {
        this.savedRestaurants = JSON.parse(restaurants)
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("tastetrail-collections", JSON.stringify(this.collections))
      localStorage.setItem("tastetrail-saved-restaurants", JSON.stringify(this.savedRestaurants))
    }
  }

  createCollection(collection: Omit<Collection, "id" | "createdAt" | "restaurantCount" | "restaurantIds">): Collection {
    const newCollection: Collection = {
      ...collection,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      restaurantCount: 0,
      restaurantIds: [],
    }

    this.collections.push(newCollection)
    this.saveToStorage()
    return newCollection
  }

  addRestaurantToCollection(restaurantId: number, collectionId: number): boolean {
    const collection = this.collections.find((c) => c.id === collectionId)
    if (!collection || collection.restaurantIds.includes(restaurantId)) {
      return false
    }

    collection.restaurantIds.push(restaurantId)
    collection.restaurantCount = collection.restaurantIds.length
    this.saveToStorage()
    return true
  }

  removeRestaurantFromCollection(restaurantId: number, collectionId: number): boolean {
    const collection = this.collections.find((c) => c.id === collectionId)
    if (!collection) return false

    collection.restaurantIds = collection.restaurantIds.filter((id) => id !== restaurantId)
    collection.restaurantCount = collection.restaurantIds.length
    this.saveToStorage()
    return true
  }

  saveRestaurant(restaurant: Omit<SavedRestaurant, "savedAt">): SavedRestaurant {
    const savedRestaurant: SavedRestaurant = {
      ...restaurant,
      savedAt: new Date().toISOString(),
    }

    // Remove if already exists, then add
    this.savedRestaurants = this.savedRestaurants.filter((r) => r.id !== restaurant.id)
    this.savedRestaurants.unshift(savedRestaurant)
    this.saveToStorage()
    return savedRestaurant
  }

  unsaveRestaurant(restaurantId: number): boolean {
    const initialLength = this.savedRestaurants.length
    this.savedRestaurants = this.savedRestaurants.filter((r) => r.id !== restaurantId)

    // Remove from all collections
    this.collections.forEach((collection) => {
      collection.restaurantIds = collection.restaurantIds.filter((id) => id !== restaurantId)
      collection.restaurantCount = collection.restaurantIds.length
    })

    this.saveToStorage()
    return this.savedRestaurants.length < initialLength
  }

  getCollections(): Collection[] {
    return this.collections
  }

  getSavedRestaurants(): SavedRestaurant[] {
    return this.savedRestaurants
  }

  getCollection(collectionId: number): Collection | null {
    return this.collections.find((c) => c.id === collectionId) || null
  }

  getRestaurantsInCollection(collectionId: number): SavedRestaurant[] {
    const collection = this.getCollection(collectionId)
    if (!collection) return []

    return this.savedRestaurants.filter((r) => collection.restaurantIds.includes(r.id))
  }
}

// Singleton instance
export const collectionManager = new CollectionManager()
