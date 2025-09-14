import { useQuery } from '@tanstack/react-query'
import type { RestaurantDetails } from './google-places'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

async function fetchRestaurantDetails(placeId: string): Promise<RestaurantDetails> {
  const response = await fetch(`${API_BASE_URL}/api/places/details?place_id=${placeId}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch restaurant details')
  }
  
  const data = await response.json()
  
  if (data.status !== 'OK' || !data.result) {
    throw new Error('Restaurant details not found')
  }
  
  return data.result
}

export function useRestaurantDetailsQuery(placeId: string | null) {
  return useQuery({
    queryKey: ['restaurant-details', placeId],
    queryFn: () => fetchRestaurantDetails(placeId!),
    enabled: !!placeId, // Only run query if placeId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })
}
