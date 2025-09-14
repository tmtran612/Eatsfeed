"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, ThumbsUp, ThumbsDown, Star, DollarSign, RefreshCw } from "lucide-react"
import { aiService, type ReviewSummary } from "@/lib/ai-service"
import { useRestaurantDetailsQuery } from "@/lib/useRestaurantDetailsQuery"

interface AIReviewSummaryProps {
  restaurantName: string
  restaurantId: string
  className?: string
}

export function AIReviewSummary({ restaurantName, restaurantId, className }: AIReviewSummaryProps) {
  const [summary, setSummary] = useState<ReviewSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch restaurant details to get real reviews
  const { data: restaurantDetails } = useRestaurantDetailsQuery(restaurantId)

  const loadSummary = async () => {
    setIsLoading(true)
    setError(null)

    try {
      let reviews: string[] = []
      
      // Use real reviews if available, otherwise fall back to mock data
      if (restaurantDetails?.reviews && restaurantDetails.reviews.length > 0) {
        reviews = restaurantDetails.reviews.map(review => review.text)
      } else {
        // Mock reviews as fallback - in a real app, these would come from Google Places API
        reviews = [
          "Great food and atmosphere, highly recommend!",
          "Service was excellent, will definitely come back.",
          "Amazing flavors and presentation, worth the price.",
        ]
      }

      const reviewSummary = await aiService.generateReviewSummary(restaurantName, reviews)
      setSummary(reviewSummary)
    } catch (err) {
      setError("Failed to load AI summary")
      console.error("Error loading AI summary:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Only load summary when we have restaurant details or after a short delay
    const timer = setTimeout(() => {
      loadSummary()
    }, 500)
    
    return () => clearTimeout(timer)
  }, [restaurantName, restaurantId, restaurantDetails])

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold">AI Summary</span>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !summary) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground">AI Summary</span>
            </div>
            <Button size="sm" variant="ghost" onClick={loadSummary}>
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{error || "Summary unavailable"}</p>
        </CardContent>
      </Card>
    )
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-yellow-600"
    }
  }

  const getValueColor = (value: string) => {
    switch (value) {
      case "excellent":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "fair":
        return "text-yellow-600"
      default:
        return "text-red-600"
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Review Summary
          <Badge variant="outline" className={`text-xs ${getSentimentColor(summary.sentiment)}`}>
            {summary.sentiment}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{summary.summary}</p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>Value: </span>
            <span className={`font-semibold ${getValueColor(summary.priceValue)}`}>
              {summary.priceValue.charAt(0).toUpperCase() + summary.priceValue.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            <span>Service: </span>
            <span className={`font-semibold ${getValueColor(summary.serviceQuality)}`}>
              {summary.serviceQuality.charAt(0).toUpperCase() + summary.serviceQuality.slice(1)}
            </span>
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
              <ThumbsUp className="h-4 w-4" />
              Highlights
            </div>
            <ul className="space-y-1">
              {summary.pros.slice(0, 3).map((pro, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                  <span className="text-green-500 mt-1">•</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-600">
              <ThumbsDown className="h-4 w-4" />
              Consider
            </div>
            <ul className="space-y-1">
              {summary.cons.slice(0, 3).map((con, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                  <span className="text-orange-500 mt-1">•</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top Dishes */}
        {summary.topDishes.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold">Must-Try Dishes</div>
            <div className="flex flex-wrap gap-1">
              {summary.topDishes.slice(0, 4).map((dish) => (
                <Badge key={dish} variant="secondary" className="text-xs">
                  {dish}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Atmosphere */}
        <div className="space-y-1">
          <div className="text-sm font-semibold">Atmosphere</div>
          <p className="text-xs text-muted-foreground">{summary.atmosphere}</p>
        </div>
      </CardContent>
    </Card>
  )
}
