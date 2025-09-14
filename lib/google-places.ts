// Google Places API utilities

export interface Restaurant {
  place_id: string
  name: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  vicinity: string
  photo_reference?: string
  rating?: number
  price_level?: number
  types?: string[]
}

export interface RestaurantDetails {
  place_id: string
  name: string
  formatted_address?: string
  formatted_phone_number?: string
  website?: string
  rating?: number
  price_level?: number
  vicinity: string
  business_status?: string
  types?: string[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  opening_hours?: {
    open_now?: boolean
    periods?: Array<{
      close?: { day: number; time: string }
      open?: { day: number; time: string }
    }>
    weekday_text?: string[]
  }
  reviews?: Array<{
    author_name: string
    author_url?: string
    language?: string
    profile_photo_url?: string
    rating: number
    relative_time_description: string
    text: string
    time: number
  }>
  photos?: Array<{
    height: number
    width: number
    photo_reference: string
  }>
}

export interface PlacesSearchRequest {
  location: { lat: number; lng: number }
  radius: number
  type: string
}

export class GooglePlacesService {
  private apiKey: string
  private static cache = new Map<string, { data: Restaurant[], timestamp: number }>()
  private static CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private getCacheKey(request: PlacesSearchRequest): string {
    return `${request.location.lat.toFixed(4)},${request.location.lng.toFixed(4)},${request.radius}`
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < GooglePlacesService.CACHE_DURATION
  }

  async searchNearbyRestaurants(request: PlacesSearchRequest): Promise<Restaurant[]> {
    try {
      if (!request.location || typeof request.location.lat !== "number" || typeof request.location.lng !== "number") {
        console.warn("searchNearbyRestaurants called without valid location", request.location)
        return []
      }

      // Check cache first
      const cacheKey = this.getCacheKey(request)
      const cachedEntry = GooglePlacesService.cache.get(cacheKey)
      
      if (cachedEntry && this.isValidCache(cachedEntry.timestamp)) {
        console.log('🎯 Service cache hit! Returning cached restaurants')
        return cachedEntry.data
      }

      console.log('🌐 Service cache miss. Fetching from backend...')
      
      // In a real implementation, this would call Google Places API
      const response = await fetch(
        `http://localhost:8000/api/places/nearby?lat=${request.location.lat}&lng=${request.location.lng}&radius=${request.radius}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch restaurants")
      }

      const data = await response.json()
      
      // Cache the result
      GooglePlacesService.cache.set(cacheKey, {
        data: data.restaurants,
        timestamp: Date.now()
      })
      
      console.log('💾 Cached restaurants for key:', cacheKey)
      
      return data.restaurants
    } catch (error) {
      console.error("Error fetching restaurants:", error)
      return []
    }
  }

  async getPlaceDetails(placeId: string): Promise<Restaurant | null> {
    try {
      // In a real implementation, this would call Google Places API Place Details
  const response = await fetch(`http://localhost:8000/api/places/details?place_id=${placeId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch place details")
      }

      const data = await response.json()
      return data.restaurant
    } catch (error) {
      console.error("Error fetching place details:", error)
      return null
    }
  }
}

// Utility function to calculate distance between two points
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const R = 3959 // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance < 1 ? `${(distance * 5280).toFixed(0)} ft` : `${distance.toFixed(1)} mi`
}
