import { useQuery } from '@tanstack/react-query';
import type { Restaurant } from './google-places';

export function useRestaurantsQuery(center: { lat: number; lng: number }) {
  return useQuery<Restaurant[]>({
    queryKey: ['restaurants', center.lat, center.lng],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/places/nearby?lat=${center.lat}&lng=${center.lng}&radius=1000`);
      const data = await res.json();
      return data.restaurants;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (was cacheTime)
  });
}
