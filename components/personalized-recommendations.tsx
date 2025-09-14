"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Heart, Star, MapPin, DollarSign, RefreshCw } from "lucide-react"
import { aiService, type PersonalizedRecommendation } from "@/lib/ai-service"

// Mock restaurant data for recommendations
const mockRestaurants = [
  {
    id: 5,
    name: "Mediterranean Delight",
    cuisine: "Mediterranean",
    rating: 4.4,
    priceLevel: 2,
    distance: "0.7 miles",
    image: "/placeholder.svg",
    tags: ["Healthy", "Fresh", "Mediterranean"],
  },
  {
    id: 6,
    name: "Taco Libre",
    cuisine: "Mexican",
    rating: 4.3,
    priceLevel: 1,
    distance: "0.4 miles",
    image: "/placeholder.svg",
    tags: ["Spicy", "Casual", "Authentic"],
  },
  {
    id: 7,
    name: "Le Petit Bistro",
    cuisine: "French",
    rating: 4.6,
    priceLevel: 3,
    distance: "0.8 miles",
    image: "/placeholder.svg",
    tags: ["Romantic", "Upscale", "Wine"],
  },
]

interface PersonalizedRecommendationsProps {
  userPreferences: string[]
  savedRestaurantIds: string[]
  onRestaurantSave: (restaurantId: string) => void
}

export function PersonalizedRecommendations({
  userPreferences,
  savedRestaurantIds,
  onRestaurantSave,
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadRecommendations = async () => {
    setIsLoading(true)

    try {
      const recs = await aiService.generatePersonalizedRecommendations(
        userPreferences,
        savedRestaurantIds,
        mockRestaurants,
      )
      setRecommendations(recs)
    } catch (error) {
      console.error("Error loading recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRecommendations()
  }, [userPreferences, savedRestaurantIds])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
          <Button size="sm" variant="ghost" onClick={loadRecommendations}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No new recommendations available at the moment.</p>
        ) : (
          recommendations.map((rec) => {
            const restaurant = mockRestaurants.find((r) => r.id === rec.restaurantId)
            if (!restaurant) return null

            return (
              <div key={rec.restaurantId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold">{restaurant.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">
                        {restaurant.cuisine}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {restaurant.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {"$".repeat(restaurant.priceLevel)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {restaurant.distance}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {Math.round(rec.score * 100)}% match
                    </Badge>
                    <Button size="sm" onClick={() => onRestaurantSave(restaurant.id)}>
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Matching preferences */}
                {rec.matchingPreferences.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {rec.matchingPreferences.map((pref) => (
                      <Badge key={pref} variant="outline" className="text-xs bg-primary/10 text-primary">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* AI reasons */}
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-muted-foreground">Why we recommend this:</div>
                  <ul className="space-y-1">
                    {rec.reasons.map((reason, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                        <span className="text-primary mt-1">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
