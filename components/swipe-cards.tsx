"use client"

import { useState } from "react"
import { useRestaurantsQuery } from "@/lib/useRestaurantsQuery"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, X, Star, MapPin, DollarSign, Sparkles, RotateCcw, Info } from "lucide-react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"

import type { Restaurant } from "@/lib/google-places"

function SwipeCard({ restaurant, onSwipe, isTop }: {
  restaurant: Restaurant;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      onSwipe("right")
    } else if (info.offset.x < -threshold) {
      onSwipe("left")
    }
  }

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotate, opacity }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      exit={{ x: x.get() > 0 ? 300 : -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="h-full overflow-hidden cursor-grab active:cursor-grabbing">
        <div className="relative h-64">
          <img
            src={restaurant.photo_reference
              ? `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/places/photo?photo_reference=${restaurant.photo_reference}&maxwidth=400`
              : "/placeholder.svg"}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          {/* Swipe indicators */}
          <motion.div
            className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
            style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
          >
            <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg">LIKE</div>
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-red-500/20 flex items-center justify-center"
            style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
          >
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg">PASS</div>
          </motion.div>
          {/* Show address */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-black/50 text-white">{restaurant.vicinity}</Badge>
          </div>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{restaurant.name}</h3>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">{restaurant.vicinity}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function SwipeCards({ center }: { center: { lat: number; lng: number } }) {
  const { data, isLoading, isError } = useRestaurantsQuery(center)
  const restaurants = Array.isArray(data) ? (data as Restaurant[]) : [];
  const [currentIndex, setCurrentIndex] = useState(0)
  const [savedRestaurants, setSavedRestaurants] = useState<string[]>([])
  const [passedRestaurants, setPassedRestaurants] = useState<string[]>([])
  const [showStats, setShowStats] = useState(false)

  const visibleCards = restaurants.slice(currentIndex, currentIndex + 2)

  const handleSwipe = (direction: "left" | "right") => {
    const currentRestaurant = restaurants[currentIndex]
    if (!currentRestaurant) return

    if (direction === "right") {
      setSavedRestaurants((prev) => [...prev, currentRestaurant.place_id])
    } else {
      setPassedRestaurants((prev) => [...prev, currentRestaurant.place_id])
    }

    if (currentIndex < restaurants.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const handleButtonSwipe = (direction: "left" | "right") => {
    handleSwipe(direction)
  }

  const resetStack = () => {
    setCurrentIndex(0)
    setSavedRestaurants([])
    setPassedRestaurants([])
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center space-y-4">
          <div className="text-lg font-semibold">Loading restaurants...</div>
        </div>
      </div>
    )
  }
  if (isError) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center space-y-4">
          <div className="text-lg font-semibold">Error loading restaurants.</div>
        </div>
      </div>
    )
  }
  if (restaurants.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center space-y-4">
          <Heart className="h-16 w-16 text-primary mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">No restaurants found!</h3>
            <p className="text-muted-foreground">Try changing your location or check back later.</p>
          </div>
        </div>
      </div>
    )
  }

  if (currentIndex >= restaurants.length) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center space-y-4">
          <Heart className="h-16 w-16 text-primary mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">You've seen all restaurants!</h3>
            <p className="text-muted-foreground">Check back later for more recommendations</p>
          </div>
          <Button onClick={resetStack} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Start Over
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h3 className="text-lg font-semibold">Swipe to Discover</h3>
          <p className="text-muted-foreground text-sm">Swipe right to save, left to skip</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowStats(!showStats)}>
          <Info className="h-4 w-4" />
        </Button>
      </div>

      {showStats && (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{savedRestaurants.length}</div>
            <div className="text-xs text-muted-foreground">Saved</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-muted-foreground">{passedRestaurants.length}</div>
            <div className="text-xs text-muted-foreground">Passed</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{restaurants.length - currentIndex}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
        </div>
      )}

      <div className="relative h-[500px]">
        {visibleCards.map((restaurant, index) => (
          <SwipeCard
            key={`${restaurant.place_id}-${currentIndex}`}
            restaurant={restaurant}
            onSwipe={handleSwipe}
            isTop={index === 0}
          />
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full h-16 w-16 p-0 bg-transparent border-2 border-red-200 hover:bg-red-50 hover:border-red-300"
          onClick={() => handleButtonSwipe("left")}
        >
          <X className="h-6 w-6 text-red-500" />
        </Button>

        <Button
          size="lg"
          className="rounded-full h-16 w-16 p-0 bg-primary hover:bg-primary/90"
          onClick={() => handleButtonSwipe("right")}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex justify-center">
        <Button variant="ghost" size="sm" onClick={resetStack} className="gap-2 text-muted-foreground">
          <RotateCcw className="h-4 w-4" />
          Reset Stack
        </Button>
      </div>
    </div>
  )
}
