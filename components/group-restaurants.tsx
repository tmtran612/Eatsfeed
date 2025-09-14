"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, DollarSign, MapPin, ThumbsUp, ThumbsDown, MessageCircle, Plus } from "lucide-react"

// Mock group restaurants data
const mockGroupRestaurants = [
  {
    id: 1,
    name: "Bella Vista Italian",
    cuisine: "Italian",
    rating: 4.5,
    priceLevel: 2,
    distance: "0.3 miles",
    image: "/italian-restaurant-exterior.png",
    summary: "Authentic Italian cuisine with fresh pasta and wood-fired pizzas",
    addedBy: { name: "Sarah Wilson", avatar: "/diverse-user-avatars.png" },
    addedAt: "2024-01-15",
    votes: { up: 6, down: 1 },
    userVote: "up",
    comments: 3,
    status: "suggested",
  },
  {
    id: 2,
    name: "Sakura Sushi Bar",
    cuisine: "Japanese",
    rating: 4.7,
    priceLevel: 3,
    distance: "0.5 miles",
    image: "/bustling-sushi-restaurant.png",
    summary: "Premium sushi with fresh fish and creative rolls",
    addedBy: { name: "Mike Johnson", avatar: "/diverse-user-avatars.png" },
    addedAt: "2024-01-14",
    votes: { up: 8, down: 0 },
    userVote: null,
    comments: 5,
    status: "approved",
  },
  {
    id: 3,
    name: "The Local Burger",
    cuisine: "American",
    rating: 4.2,
    priceLevel: 1,
    distance: "0.2 miles",
    image: "/burger-restaurant.png",
    summary: "Gourmet burgers with locally sourced ingredients",
    addedBy: { name: "Jane Smith", avatar: "/diverse-user-avatars.png" },
    addedAt: "2024-01-13",
    votes: { up: 4, down: 2 },
    userVote: null,
    comments: 2,
    status: "visited",
  },
]

interface GroupRestaurantsProps {
  groupId: number
}

export function GroupRestaurants({ groupId }: GroupRestaurantsProps) {
  const [restaurants, setRestaurants] = useState(mockGroupRestaurants)
  const [filter, setFilter] = useState<"all" | "suggested" | "approved" | "visited">("all")

  const handleVote = (restaurantId: number, vote: "up" | "down") => {
    setRestaurants((prev) =>
      prev.map((restaurant) => {
        if (restaurant.id === restaurantId) {
          const newVotes = { ...restaurant.votes }
          const oldVote = restaurant.userVote

          // Remove old vote
          if (oldVote === "up") newVotes.up--
          if (oldVote === "down") newVotes.down--

          // Add new vote if different from old vote
          const newVote = oldVote === vote ? null : vote
          if (newVote === "up") newVotes.up++
          if (newVote === "down") newVotes.down++

          return {
            ...restaurant,
            votes: newVotes,
            userVote: newVote,
          }
        }
        return restaurant
      }),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "suggested":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "visited":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredRestaurants = filter === "all" ? restaurants : restaurants.filter((r) => r.status === filter)

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {["all", "suggested", "approved", "visited"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status as any)}
              className="capitalize"
            >
              {status} ({status === "all" ? restaurants.length : restaurants.filter((r) => r.status === status).length})
            </Button>
          ))}
        </div>

        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Restaurant
        </Button>
      </div>

      {/* Restaurant List */}
      <div className="space-y-4">
        {filteredRestaurants.map((restaurant) => (
          <Card key={restaurant.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <img
                  src={restaurant.image || "/placeholder.svg"}
                  alt={restaurant.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                        <Badge className={`text-xs ${getStatusColor(restaurant.status)}`}>{restaurant.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="secondary">{restaurant.cuisine}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {restaurant.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {"$".repeat(restaurant.priceLevel)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {restaurant.distance}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{restaurant.summary}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={restaurant.addedBy.avatar || "/placeholder.svg"}
                            alt={restaurant.addedBy.name}
                          />
                          <AvatarFallback className="text-xs">
                            {restaurant.addedBy.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        Added by {restaurant.addedBy.name}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(restaurant.addedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Voting */}
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant={restaurant.userVote === "up" ? "default" : "outline"}
                          onClick={() => handleVote(restaurant.id, "up")}
                          className="h-8 px-2 gap-1"
                        >
                          <ThumbsUp className="h-3 w-3" />
                          {restaurant.votes.up}
                        </Button>
                        <Button
                          size="sm"
                          variant={restaurant.userVote === "down" ? "destructive" : "outline"}
                          onClick={() => handleVote(restaurant.id, "down")}
                          className="h-8 px-2 gap-1"
                        >
                          <ThumbsDown className="h-3 w-3" />
                          {restaurant.votes.down}
                        </Button>
                      </div>

                      {/* Comments */}
                      <Button size="sm" variant="outline" className="h-8 px-2 gap-1 bg-transparent">
                        <MessageCircle className="h-3 w-3" />
                        {restaurant.comments}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No restaurants found</h3>
          <p className="text-muted-foreground">
            {filter === "all" ? "Start adding restaurants to your group" : `No ${filter} restaurants yet`}
          </p>
        </div>
      )}
    </div>
  )
}
