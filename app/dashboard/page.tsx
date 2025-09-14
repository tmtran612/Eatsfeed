"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { MapView } from "@/components/map-view"
import { SwipeCards } from "@/components/swipe-cards"
import { SwipeTutorial } from "@/components/swipe-tutorial"
import { LocationPermission } from "@/components/location-permission"
import { PersonalizedRecommendations } from "@/components/personalized-recommendations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [savedRestaurantIds, setSavedRestaurantIds] = useState<number[]>([])
  const [userPreferences] = useState(["romantic", "casual", "spicy"]) // Mock preferences

  useEffect(() => {
    // Check if user has seen tutorial before
    const hasSeenTutorial = localStorage.getItem("tastetrail-tutorial-seen")
    if (!hasSeenTutorial) {
      setShowTutorial(true)
    }
  }, [])

  const handleTutorialComplete = () => {
    setShowTutorial(false)
    localStorage.setItem("tastetrail-tutorial-seen", "true")
  }

  const handleLocationGranted = (location: { lat: number; lng: number }) => {
    setUserLocation(location)
  }

  const handleRestaurantSave = (restaurantId: number) => {
    setSavedRestaurantIds((prev) =>
      prev.includes(restaurantId) ? prev.filter((id) => id !== restaurantId) : [...prev, restaurantId],
    )
  }

  if (!userLocation) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6">
          <LocationPermission onLocationGranted={handleLocationGranted} />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Discover Restaurants</h1>
            <p className="text-muted-foreground">
              Find your next favorite spot using our map or swipe through curated recommendations
            </p>
          </div>

          <Tabs defaultValue="swipe" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-lg">
              <TabsTrigger value="swipe">Swipe Cards</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="ai">AI Picks</TabsTrigger>
            </TabsList>

            <TabsContent value="swipe" className="space-y-0">
              <SwipeCards center={userLocation} />
            </TabsContent>

            <TabsContent value="map" className="space-y-0">
              <MapView center={userLocation} />
            </TabsContent>

            <TabsContent value="ai" className="space-y-0">
              <div className="max-w-2xl mx-auto">
                <PersonalizedRecommendations
                  userPreferences={userPreferences}
                  savedRestaurantIds={savedRestaurantIds}
                  onRestaurantSave={handleRestaurantSave}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {showTutorial && <SwipeTutorial onComplete={handleTutorialComplete} />}
    </div>
  )
}
