"use client"

import { useState } from "react"
import { useRestaurantsQuery } from "@/lib/useRestaurantsQuery"
import { useRestaurantDetailsQuery } from "@/lib/useRestaurantDetailsQuery"
import type { Restaurant } from "@/lib/google-places"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import GoogleMapComponent from "@/components/google-map"
import { AIReviewSummary } from "@/components/ai-review-summary"
import { Star, DollarSign, MapPin, Heart, Phone, Globe, Clock } from "lucide-react"

type MapViewProps = {
  center: { lat: number; lng: number };
};

export function MapView({ center }: MapViewProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null)
  const { data, isLoading, isError } = useRestaurantsQuery(center)
  const restaurants = Array.isArray(data) ? (data as Restaurant[]) : [];
  const selectedRestaurantData = selectedRestaurant
    ? restaurants.find((r) => r.place_id === selectedRestaurant)
    : null;
  
  // Fetch detailed data for selected restaurant
  const { data: restaurantDetails, isLoading: detailsLoading } = useRestaurantDetailsQuery(selectedRestaurant)
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  if (isLoading) {
    return <div className="flex items-center justify-center h-[600px]">Loading restaurants...</div>;
  }
  if (isError) {
    return <div className="flex items-center justify-center h-[600px]">Error loading restaurants.</div>;
  }

  // Helper function to format price level
  const formatPriceLevel = (priceLevel?: number) => {
    if (!priceLevel) return "Price not available";
    return "$".repeat(priceLevel);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-[600px]">Loading restaurants...</div>;
  }
  if (isError) {
    return <div className="flex items-center justify-center h-[600px]">Error loading restaurants.</div>;
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
      {/* Map Container */}
      <div className="lg:col-span-2">
        <GoogleMapComponent />
      </div>

      {/* Restaurant Details/List */}
      <div className="space-y-4 overflow-y-auto">
        {selectedRestaurantData ? (
          <div className="relative bg-background border rounded-xl shadow-lg p-6 pt-14">
            {/* Back Arrow Button at top of parent box */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 left-3 z-10 rounded-full border bg-white/80 shadow"
              onClick={() => setSelectedRestaurant(null)}
              aria-label="Back to list"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </Button>
            {detailsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">Loading restaurant details...</div>
              </div>
            ) : (
              <div>
                {/* Restaurant Image */}
                <img
                  src={restaurantDetails?.photos?.[0]?.photo_reference
                    ? `${API_BASE_URL}/api/places/photo?photo_reference=${restaurantDetails.photos[0].photo_reference}&maxwidth=600`
                    : selectedRestaurantData.photo_reference
                    ? `${API_BASE_URL}/api/places/photo?photo_reference=${selectedRestaurantData.photo_reference}&maxwidth=600`
                    : "/placeholder.svg"}
                  alt={selectedRestaurantData.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                
                <div className="py-4 space-y-4">
                  {/* Restaurant Name and Rating */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{selectedRestaurantData.name}</h3>
                      {restaurantDetails?.types?.[0] && (
                        <p className="text-sm text-muted-foreground capitalize">
                          {restaurantDetails.types[0].replace(/_/g, ' ')}
                        </p>
                      )}
                    </div>
                    {restaurantDetails?.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{restaurantDetails.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Price Level */}
                  {restaurantDetails?.price_level && (
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatPriceLevel(restaurantDetails.price_level)}</span>
                    </div>
                  )}

                  {/* Address */}
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">Address:</span>
                      <p className="text-muted-foreground">
                        {restaurantDetails?.formatted_address || selectedRestaurantData.vicinity}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  {restaurantDetails?.formatted_phone_number && (
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Phone:</span>
                        <p className="text-muted-foreground">{restaurantDetails.formatted_phone_number}</p>
                      </div>
                    </div>
                  )}

                  {/* Hours */}
                  {restaurantDetails?.opening_hours && (
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Hours:</span>
                        <div className="text-muted-foreground">
                          {restaurantDetails.opening_hours.open_now !== undefined && (
                            <p className={`font-medium ${restaurantDetails.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}`}>
                              {restaurantDetails.opening_hours.open_now ? 'Open Now' : 'Closed'}
                            </p>
                          )}
                          {restaurantDetails.opening_hours.weekday_text && (
                            <div className="mt-1 space-y-1">
                              {restaurantDetails.opening_hours.weekday_text.slice(0, 2).map((day, index) => (
                                <p key={index} className="text-xs">{day}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button className="flex-1">Get Directions</Button>
                    {restaurantDetails?.formatted_phone_number ? (
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1 bg-transparent" disabled>
                        Call Now
                      </Button>
                    )}
                  </div>

                  {/* Website */}
                  {restaurantDetails?.website && (
                    <div className="pt-2">
                      <Button variant="link" className="p-0 h-auto" asChild>
                        <a href={restaurantDetails.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Visit Website
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* AI Review Summary Section */}
            <div className="pt-2">
              <AIReviewSummary 
                restaurantName={selectedRestaurantData.name} 
                restaurantId={selectedRestaurantData.place_id}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Nearby Restaurants</h3>
              <Badge variant="outline">{restaurants.length} found</Badge>
            </div>
            <div className="space-y-2">
              {restaurants.map((restaurant) => (
                <Card
                  key={restaurant.place_id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => setSelectedRestaurant(restaurant.place_id)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={restaurant.photo_reference
                          ? `${API_BASE_URL}/api/places/photo?photo_reference=${restaurant.photo_reference}&maxwidth=200`
                          : "/placeholder.svg"}
                        alt={restaurant.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{restaurant.name}</h4>
                            {restaurant.rating && (
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{restaurant.rating}</span>
                                {restaurant.price_level && (
                                  <>
                                    <span className="mx-1">•</span>
                                    <span>{formatPriceLevel(restaurant.price_level)}</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{restaurant.vicinity}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
